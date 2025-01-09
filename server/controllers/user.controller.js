const Offline = require('../models/applyOffline');
const School = require('../models/School');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
const offlineTemplete = require('../utils/offlineTemplate');
const contactUsTemplate = require('../utils/contactUsTemplate');
const Razorpay = require('razorpay');
const Online = require('../models/applyOnline');
const { uploadImage } = require('../utils/multer');


exports.getAllSchoolsName = async(req,res)=>{
    try{
        const schools = await School.find().select('schoolName applicationFee');
        if(!schools.length){
          return res.status(404).json({message:'No schools fould'})
        };
        res.status(200).json({
          message:'Schools data',
          schools
        })
      }
      catch(err){
        res.status(500).json({
          message:'Internal server error',
          error:err.message
        });
      }
};


exports.applyOffline = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, dob, address, collegeName } = req.body;
        if (!firstName || !lastName || !phoneNumber || !dob || !address || !collegeName) {
            return res.status(400).json({ message: 'Please provide all the details to submit.' })
        };

        const schoolExists = await School.findOne({ schoolName: collegeName });
        if (!schoolExists) {
            return res.status(400).json({ message: 'Invalid college name. Please select a valid college.' });
        };

        const newApplication = new Offline({
            firstName,
            lastName,
            phoneNumber,
            dob,
            address,
            collegeName,
        });

        await newApplication.save();

        const user = await User.findById(schoolExists.createdBy);
        const email = user.email;

        await sendEmail(email, email, `New offline applicaion - ${firstName} ${lastName}`, offlineTemplete(firstName, lastName, address, dob, phoneNumber, collegeName));

        res.status(200).json({
            message: `Application submitted successfully and notified to ${collegeName}.`,
            newApplication,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'An error occurred. Please try again later.',
            error: err.message
        });
    }
};


exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, message } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber || !message) {
            return res.status(400).jsonb({ message: "Please provide all the details." })
        };

        await sendEmail(process.env.EMAIL, email, `Shikshamitra - New Contact Us Form - ${firstName} ${lastName}`, contactUsTemplate(firstName, lastName, email, phoneNumber, message));

        res.status(200).json({ message: 'Contact Us Form submitted successfully.' });
    }
    catch {
        return res.status(500).json({
            message: 'An error occurred. Please try again later.',
            error: err.message
        });
    }
};

// Razorpay instance configuration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.applyOnline = async (req, res) => {
    try {
        const studentDetails = JSON.parse(req.body.studentDetails);
        const educationDetails = JSON.parse(req.body.educationDetails);
        const parentDetails = JSON.parse(req.body.parentDetails);
        
        const files = req.files;
        if (!files || !files.studentPhoto || !files.educationDocuments || !files.aadharCard || !files.voterId || !files.panCard) {
            return res.status(400).json({ message: 'Missing one or more required files (studentPhoto, educationDocuments, parentDocuments)' });
        };

        if (!studentDetails || !educationDetails || !parentDetails) {
            return res.status(400).json({ message: 'Missing data fields.'});
        };

        const school = await School.findOne({ schoolName: studentDetails.collegeName });
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        };

    let uploadedImages = await uploadImage(files.studentPhoto.concat(files.educationDocuments, files.aadharCard, files.voterId, files.panCard));

        if (!uploadedImages || uploadedImages.length < 5) {
            return res.status(400).json({ message: 'Required files are missing.' });
        }
        studentDetails.photo = { url: uploadedImages[0] }; 

        educationDetails.forEach((eduDetail, index) => {
            if (files.educationDocuments && files.educationDocuments[index]) {
                eduDetail.documents = { url: uploadedImages[index+1] }; // Add document URL for each education entry
            }
        });

        parentDetails.aadharCard = uploadedImages[uploadedImages.length - 3] ;
        parentDetails.voterId = uploadedImages[uploadedImages.length - 2] ;
        parentDetails.panCard = uploadedImages[uploadedImages.length - 1] ;

        const applicationFee = school.applicationFee;
        studentDetails.amount = applicationFee;
        const options = {
            amount: applicationFee,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                schoolName: school.schoolName,
                schoolCode: school.schoolCode,
            },
        };

        razorpay.orders.create(options, async (err, order) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating Razorpay order', error: err });
            }

            const onlineApplication = new Online({
                studentDetails,
                educationDetails,
                parentDetails,
                paymentDetails: {
                    razorpayOrderId: order.id,
                    status: 'pending',
                },
            });

            await onlineApplication.save();

            res.status(201).json({
                message: 'Application created successfully, Razorpay order initiated',
                order,
                applicationId: onlineApplication._id,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.verifyRazorpayPayment = async (req, res) => {
    const { paymentId, orderId, signature } = req.body;

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (signature === expectedSignature) {
        try {
            const payment = await razorpay.payments.fetch(paymentId);

            const onlineApplication = await Online.findOneAndUpdate(
                { 'paymentDetails.razorpayOrderId': orderId },
                {
                    $set: {
                        'paymentDetails.razorpayPaymentId': paymentId,
                        'paymentDetails.status': 'paid',
                        'paymentDetails.paymentDate': new Date(),
                    },
                },
                { new: true }
            );

            res.status(200).json({ message: 'Payment successfully verified and processed', payment, onlineApplication });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error capturing the payment', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'Invalid signature, payment verification failed' });
    }
};