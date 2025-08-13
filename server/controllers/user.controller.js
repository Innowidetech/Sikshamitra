const Offline = require('../models/applyOffline');
const School = require('../models/School');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
const offlineApplicationStudentTemplate = require('../utils/offlineApplicationEmailToStudent');
const contactUsTemplate = require('../utils/contactUsTemplate');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Online = require('../models/applyOnline');
const { uploadImage } = require('../utils/multer');
const ClassWiseFees = require('../models/ClassWiseFees');
require('dotenv').config();
const Blogs = require('../models/Blogs');
const ApplyForEntranceExam = require('../models/ApplyForEntranceExam');
const EntranceExamQuestionPaper = require('../models/EntranceExamQuestionPaper');
const EntranceExamResults = require('../models/EntranceExamResults');
const moment = require('moment');
const Notifications = require('../models/Notifications');


exports.getAllSchoolsName = async (req, res) => {
    try {
        const schools = await School.find();
        if (!schools.length) {
            return res.status(404).json({ message: 'No schools found' });
        }

        const formattedSchools = schools.map(school => {
            const rawAddress = school.address || '';
            const addressParts = rawAddress.split(',');

            const city = addressParts[addressParts.length - 2]?.trim();
            const stateAndPin = addressParts[addressParts.length - 1]?.trim();

            const cityStatePincode = city && stateAndPin ? `${city}, ${stateAndPin}` : rawAddress;

            return { schoolName: school.schoolName, schoolCode: school.schoolCode, applicationFee: school.applicationFee, location: cityStatePincode };
        });
        res.status(200).json({ message: 'Schools data', schools: formattedSchools });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};



exports.applyOffline = async (req, res) => {
    try {
        const { fullname, className, email, phoneNumber, dob, address, schoolName, examId, resultPercentage } = req.body;
        if (!fullname || !className || !phoneNumber || !dob || !address || !schoolName || !examId || !resultPercentage) {
            return res.status(400).json({ message: 'Please provide all the details to submit.' })
        };

        const existingUser = await Offline.findOne({ email, schoolName }) || await Online.findOne({ 'studentDetails.email': email, 'studentDetails.schoolName': schoolName });
        if (existingUser) { return res.status(400).json({ message: 'You have already applied to this school through Online/Offline. Please contact the school to know more details.' }) }

        const schoolExists = await School.findOne({ schoolName: schoolName }).populate('userId');
        if (!schoolExists) {
            return res.status(400).json({ message: 'Invalid school name. Please select a valid school.' });
        };

        const result = await EntranceExamResults.findOne({ schoolId: schoolExists._id, examId, resultPercentage, status: 'sent' }).populate({ path: 'applicantId', select: 'studentDetails.email classApplying' });
        if (!result) { return res.status(404).json({ message: "No result found with the examId and exam percentage for the school." }) }

        if (email != result.applicantId.studentDetails.email || className != result.applicantId.classApplying) {
            return res.status(400).json({ message: "You are only allowed to apply using the same email and class with which you registered and wrote the exam." });
        }

        let schoolEmail = schoolExists.userId.email;
        let schoolCode = schoolExists.schoolCode;
        let schoolContact = schoolExists.contact.phone;
        let schoolWebsite = schoolExists.contact.website;
        let schoolAddress = schoolExists.address;
        await sendEmail(email, schoolEmail, `Offline applicaion - ${schoolName}`, offlineApplicationStudentTemplate(fullname, className, address, dob, email, phoneNumber, examId, resultPercentage, schoolName, schoolCode, schoolContact, schoolEmail, schoolWebsite, schoolAddress));

        const newApplication = new Offline({ fullname, class: className, email, phoneNumber, dob, address, schoolName, examId, resultPercentage });
        await newApplication.save();

        let memberIds = []
        memberIds.push({ memberId: schoolExists.userId._id });
        const notification = new Notifications({ section: 'admission', memberIds, text: `Received a new Offline Application from '${fullname}', who scored '${resultPercentage}%' in the entrance examination for class '${className}'.` });
        await notification.save();

        res.status(200).json({
            message: `Application submitted successfully and notified to ${schoolName}, please wait until they review your application and contact you.`,
            'schoolName': schoolExists.schoolName, 'schoolCode': schoolExists.schoolCode, 'schoolContact': schoolExists.contact.phone, 'website': schoolExists.contact.website, 'schoolEmail': schoolExists.userId.email, 'schoolAddress': schoolExists.address,
            Application: newApplication,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'An error occurred. Please try again later.', error: err.message });
    }
};


exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, message } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber || !message) {
            return res.status(400).jsonb({ message: "Please provide all the details." })
        };

        await sendEmail(process.env.EMAIL, email, `Shikshamitra - New Contact Us Form`, contactUsTemplate(firstName, lastName, email, phoneNumber, message));

        res.status(200).json({ message: 'Contact Us Form submitted successfully.' });
    }
    catch {
        return res.status(500).json({ message: 'An error occurred. Please try again later.', error: err.message });
    }
};

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.applyOnline = async (req, res) => {
    try {
        const studentDetails = JSON.parse(req.body.studentDetails);
        const parentDetails = JSON.parse(req.body.parentDetails);
        const applicationFee = Number(req.body.applicationFee) || 0;

        //  Check for existing application
        const onlineExist = await Online.findOne({
            'studentDetails.examId': studentDetails.examId
        });
        if (onlineExist) {
            return res.status(400).json({
                message: 'You have already applied to this school through Online. Please contact the school to know more details.'
            });
        }
        const existingUser = await Offline.findOne({
            examId: studentDetails.examId,
        }) || await Online.findOne({
            'studentDetails.examId': studentDetails.examId
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'You have already applied to this school through Offline. Please contact the school to know more details.'
            });
        }


        const files = req.files;
        if (!files || !files.aadharCard || !files.panCard) {
            return res.status(400).json({
                message: 'Missing one or more required files (aadharCard, panCard)'
            });
        }

        //  Check required fields
        if (!studentDetails || !parentDetails) {
            return res.status(400).json({ message: 'Missing data fields.' });
        }

        //  Verify exam result
        const result = await EntranceExamResults.findOne({
            examId: studentDetails.examId,
            resultPercentage: studentDetails.resultPercentage,
            status: 'sent'
        });

        if (!result) {
            return res.status(404).json({
                message: "No result found with the examId and exam percentage for the school."
            });
        }

        //  Attach file references (placeholder logic)
           const aadharUrl = await uploadImage(files.aadharCard[0]);
        const panUrl = await uploadImage(files.panCard[0]);

        parentDetails.aadharCard = Array.isArray(aadharUrl) ? aadharUrl[0] : aadharUrl;
        parentDetails.panCard = Array.isArray(panUrl) ? panUrl[0] : panUrl;

        let paymentDetails;

        if (applicationFee > 0) {
            //  Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: applicationFee * 100, // in paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            });

            paymentDetails = {
                razorpayOrderId: razorpayOrder.id,
                status: 'pending',
                amount: applicationFee
            };
        } else {
            // Skip payment
            paymentDetails = {
                razorpayOrderId: null,
                status: 'not_required',
                amount: 0
            };
        }

        // Save application
        const onlineApplication = new Online({
            studentDetails,
            parentDetails,
            paymentDetails,
        });

        await onlineApplication.save();

        //  Notify school
        const notification = new Notifications({
            section: 'admission',
            memberIds: [],
            text: `Received a new Online Application from '${studentDetails.firstName} ${studentDetails.lastName}', who scored '${studentDetails.resultPercentage}%' in the entrance examination for class '${studentDetails.classToJoin}'.`
        });
        await notification.save();

        return res.status(201).json({
            message: applicationFee > 0
                ? 'Application created successfully, payment required'
                : 'Application created successfully',
            applicationId: onlineApplication._id,
            paymentDetails,
            studentDetails: onlineApplication.studentDetails,
            parentDetails: onlineApplication.parentDetails,
            paymentDetails: onlineApplication.paymentDetails
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;

        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (signature === expectedSignature) {

            const payment = await razorpay.payments.fetch(paymentId);

            const onlineApplication = await Online.findOneAndUpdate(
                { 'paymentDetails.razorpayOrderId': orderId },
                {
                    $set: {
                        'paymentDetails.razorpayPaymentId': paymentId,
                        'paymentDetails.status': 'success',
                    },
                },
                { new: true }
            );

            if (!onlineApplication) {
                return res.status(404).json({ message: 'Application not found for given order ID.' });
            }
            res.status(200).json({
                message: 'Payment successfully verified, and amount sent to the school.',
                payment, onlineApplication,
            });
        } else {
            res.status(400).json({ message: 'Invalid signature, payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message, });
    }
};


exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.find().sort({ createdAt: -1 })
        if (!blogs.length) {
            return res.status(404).json({ message: "No blogs posted yet." })
        }
        res.status(200).json({ blogs });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.applyForEntranceExamination = async (req, res) => {
    try {
        const { academicYear, classApplying, school, studentDetails, previousSchoolDetails } = req.body;
        if (!academicYear || !classApplying || !school || !studentDetails || !previousSchoolDetails) {
            return res.status(400).json({ message: "Please provide all the details to apply for entrance exam." })
        }

        if (previousSchoolDetails.board == 'Others') {
            if (!previousSchoolDetails.schoolBoard) { return res.status(400).json({ message: "Please specify the board type." }) }
        }

        let uploadedPhotoUrl;
        if (req.files?.photo && req.files.photo[0]) {
            try {
                const [photoUrl] = await uploadImage(req.files.photo[0]);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        } else {
            return res.status(400).json({ message: "Please provide student photo." });
        }

        const existingSchool = await School.findOne({ schoolName: school });
        if (!existingSchool) {
            return res.status(404).json({ message: `No school found with the name - ${school}` });
        };
        studentDetails.photo = uploadedPhotoUrl;
        if (req.files?.['previousSchoolDetails[documents]']) {
            const docUrls = await uploadImage(req.files['previousSchoolDetails[documents]']);
            previousSchoolDetails.documents = docUrls.map(url => ({ url }));
        }

        const application = new ApplyForEntranceExam({
            academicYear, classApplying, schoolId: existingSchool._id, previousSchoolDetails,
            studentDetails: {
                ...studentDetails,
                photo: uploadedPhotoUrl
            }
        });
        await application.save();

        let memberIds = []
        memberIds.push({ memberId: existingSchool.userId });
        const notification = new Notifications({ section: 'entranceExam', memberIds, text: `New Entrance exam application by '${studentDetails.firstName} ${studentDetails.lastName}' for class - '${classApplying}'` });
        await notification.save();

        res.status(201).json({
            message: `Your application for the entrance exam has been successfully sent to the school - '${school}'. Please wait while your application is being reviewed.`,
            application
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message, });
    }
};


exports.getQuestionsToApplicants = async (req, res) => {
    try {
        const loggedInApplicant = req.applicant?.id;
        if (!loggedInApplicant) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in applicants can get the question paper.' })
        };

        const application = await ApplyForEntranceExam.findById(loggedInApplicant)
        if (!application) { return res.status(404).json({ message: "No application found." }) }

        const associatedSchool = await School.findById(application.schoolId);
        if (!associatedSchool || associatedSchool.status !== 'active') {
            return res.status(403).json({ message: "School is not active. Please contact the school management." });
        }

        const result = await EntranceExamResults.findOne({ schoolId: associatedSchool._id, applicantId: application._id });
        if (result) { return res.status(403).json({ message: "You have already attempted the exam." }) }

        const questionPaper = await EntranceExamQuestionPaper.findOne({ schoolId: associatedSchool._id, class: application.classApplying }).select({ 'questions.option1.isAnswer': 0, 'questions.option2.isAnswer': 0, 'questions.option3.isAnswer': 0, 'questions.option4.isAnswer': 0 });
        if (!questionPaper) {
            return res.status(404).json({ message: "No question paper found for the class." })
        }

        const currentTime = moment().tz('Asia/Kolkata');
        const tokenExpirationTime = moment().add(3, 'hours').tz('Asia/Kolkata');

        const remainingTime = tokenExpirationTime.diff(currentTime, 'seconds');

        const remainingTimeFormatted = {
            hours: Math.floor(remainingTime / 3600),
            minutes: Math.floor((remainingTime % 3600) / 60),
            seconds: remainingTime % 60
        };

        res.status(200).json({ details: { class: application.classApplying, photo: application.studentDetails.photo, school: associatedSchool.schoolName, year: application.academicYear }, remainingTime: remainingTimeFormatted, questionPaper });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};


exports.submitExamAnswers = async (req, res) => {
    try {
        const loggedInApplicant = req.applicant?.id;
        if (!loggedInApplicant) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in applicants can get the question paper.' })
        };

        const application = await ApplyForEntranceExam.findById(loggedInApplicant).populate('schoolId')
        if (!application) { return res.status(404).json({ message: "No application found." }) }

        const existringResult = await EntranceExamResults.findOne({ schoolId: application.schoolId._id, applicantId: application._id });
        if (existringResult) { return res.status(403).json({ message: "You have already attempted the exam, you are not allowed to submit now." }) }

        const questionPaper = await EntranceExamQuestionPaper.findOne({ schoolId: application.schoolId._id, class: application.classApplying });
        if (!questionPaper) {
            return res.status(404).json({ message: "No question paper found for the class" })
        }

        const answers = req.body.answers; // [{questionId, selectedOption}]
        if (answers.length != questionPaper.questions.length) {
            return res.status(400).json({ message: "The number of submitted answers are not equal to the number of questions." })
        }
        let correctAnswersCount = 0;

        answers.forEach(answer => {
            const question = questionPaper.questions.find(q => q._id.toString() === answer.questionId);
            if (question) {
                const selectedOption = question[answer.selectedOption];
                if (selectedOption.isAnswer) {
                    correctAnswersCount++;
                }
            }
            else { return res.status(404).json({ message: `No question found with the questionId in the examination paper of class ${application.classApplying}.` }) }
        });

        const resultPercentage = ((correctAnswersCount / questionPaper.questions.length) * 100).toFixed(2);

        const result = new EntranceExamResults({ schoolId: application.schoolId._id, applicantId: application._id, examId: application.examId, resultPercentage });
        await result.save();

        let memberIds = []
        memberIds.push({ memberId: application.schoolId.userId });
        const notification = new Notifications({ section: 'entranceExam', memberIds, text: `Entrance Exam has been submitted by '${application.studentDetails.firstName} ${application.studentDetails.lastName}' for class - '${application.classApplying}'` });
        await notification.save();

        return res.status(200).json({ message: 'Exam submitted successfully.' });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error.", error: err.message })
    }
};

exports.verifyExamResultLogin = async (req, res) => {
  try {
    const { examId, email } = req.body;

    // 1. Validate input (examId is required, email is optional)
    if (!examId || !email) {
      return res.status(400).json({ message: 'Exam ID is required.' });
    }

    // 2. Check if the result exists for this examId and if it's marked as "sent"

    const result = await EntranceExamResults.findOne({
      examId,
      status: 'sent'
       // Ensure the result is marked as "sent"
    }).populate('applicantId');
    if(result.applicantId.studentDetails.email!=email){
        return res.status(400).json({ message: 'Invalid email ' });
    }

    if (!result ) {
      return res.status(404).json({ message: 'Invalid exam ID or result not available  a.' });
    }

    return res.status(200).json({
      message: 'Login successful.',
    });
    
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
