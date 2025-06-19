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
        const schools = await School.find().select('schoolName applicationFee');
        if (!schools.length) {
            return res.status(404).json({ message: 'No schools fould' })
        };
        res.status(200).json({ message: 'Schools data', schools })
    }
    catch (err) {
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

        const existingUser = await Offline.findOne({ email: studentDetails.email, schoolName: studentDetails.schoolName }) || await Online.findOne({ 'studentDetails.email': studentDetails.email, 'studentDetails.schoolName': studentDetails.schoolName });
        if (existingUser) { return res.status(400).json({ message: 'You have already applied to this school through Online/Offline. Please contact the school to know more details.' }) }

        const files = req.files;
        if (!files || !files.studentPhoto || !files.aadharCard || !files.voterId || !files.panCard) {
            return res.status(400).json({ message: 'Missing one or more required files (studentPhoto, parentDocuments)' });
        };

        if (!studentDetails || !parentDetails) {
            return res.status(400).json({ message: 'Missing data fields.' });
        };

        const school = await School.findOne({ schoolName: studentDetails.schoolName });
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        };

        const result = await EntranceExamResults.findOne({ schoolId: school._id, examId: studentDetails.examId, resultPercentage: studentDetails.resultPercentage, status: 'sent' }).populate({ path: 'applicantId', select: 'studentDetails.email classApplying' });
        if (!result) { return res.status(404).json({ message: "No result found with the examId and exam percentage for the school." }) }

        if (studentDetails.email != result.applicantId.studentDetails.email || studentDetails.classToJoin != result.applicantId.classApplying) {
            return res.status(400).json({ message: "You are only allowed to apply using the same email and class with which you registered and wrote the exam." });
        }

        if (studentDetails.classToJoin) {
            const classNum = parseInt(studentDetails.classToJoin, 10);
            if (!isNaN(classNum) && classNum >= 1 && classNum <= 9) {
                studentDetails.classToJoin = classNum.toString().padStart(2, '0');
            }
        }

        const classWiseFees = await ClassWiseFees.findOne({ schoolId: school._id, class: studentDetails.classToJoin });
        if (!classWiseFees) { return res.status(404).json({ message: "No admission fees found for the class to join, please contact the school." }) }
        let applicationFee = classWiseFees.admissionFees;

        let uploadedImages = await uploadImage(files.studentPhoto.concat(files.educationDocuments, files.aadharCard, files.voterId, files.panCard));

        if (!uploadedImages || uploadedImages.length < 5) {
            return res.status(400).json({ message: 'Required files are missing.' });
        }
        studentDetails.photo = { url: uploadedImages[0] };

        educationDetails.forEach((eduDetail, index) => {
            if (files.educationDocuments && files.educationDocuments[index]) {
                eduDetail.documents = { url: uploadedImages[index + 1] }; // Add document URL for each education entry
            }
        });

        parentDetails.aadharCard = uploadedImages[uploadedImages.length - 3];
        parentDetails.voterId = uploadedImages[uploadedImages.length - 2];
        parentDetails.panCard = uploadedImages[uploadedImages.length - 1];

        studentDetails.admissionFees = applicationFee;
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

            let memberIds = []
            memberIds.push({ memberId: school.userId });
            const notification = new Notifications({ section: 'admission', memberIds, text: `Received a new Online Application from '${studentDetails.firstName} ${studentDetails.lastName}', who scored '${studentDetails.resultPercentage}%' in the entrance examination for class '${studentDetails.classToJoin}'.` });
            await notification.save();

            res.status(201).json({
                message: 'Application created successfully, Razorpay order initiated',
                order,
                applicationId: onlineApplication._id,
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message, });
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
            try {
                const payment = await razorpay.payments.fetch(paymentId);

                const onlineApplication = await Online.findOneAndUpdate(
                    { 'paymentDetails.razorpayOrderId': orderId },
                    {
                        $set: {
                            'paymentDetails.razorpayPaymentId': paymentId,
                            'paymentDetails.status': 'success',
                            // 'paymentDetails.paymentDate': new Date(),
                        },
                    },
                    { new: true }
                );

                const school = await School.findOne({ _id: onlineApplication.studentDetails.schoolId });
                if (!school || !school.paymentDetails) {
                    return res.status(404).json({ message: 'School bank details not found.' });
                }

                const payoutOptions = {
                    account_number: school.paymentDetails.accountNumber,
                    ifsc: school.paymentDetails.ifscCode,
                    amount: payment.amount, //payment.admissionFees
                    currency: 'INR',
                    purpose: 'Online Application Fees',
                    notes: {
                        schoolId: school._id,
                        studentId: onlineApplication.studentDetails._id,
                        paymentId: paymentId,
                    },
                };

                razorpay.payouts.create(payoutOptions, async (err, payout) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error initiating payout', error: err });
                    }

                    onlineApplication.paymentDetails.payoutStatus = payout.status;
                    onlineApplication.paymentDetails.payoutId = payout.id;
                    await onlineApplication.save();

                    res.status(200).json({
                        message: 'Payment successfully verified, and amount sent to the school.',
                        payment,
                        payout,
                        onlineApplication,
                    });
                });

            } catch (error) {
                res.status(500).json({ message: 'Error capturing the payment', error: error.message });
            }
        } else {
            res.status(400).json({ message: 'Invalid signature, payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
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
        res.status(500).json({ message: 'Internal server error', error: error.message, });
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
        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        }
        else { return res.status(400).json({ message: "Please provide student photo." }) };

        const existingSchool = await School.findOne({ schoolName: school });
        if (!existingSchool) {
            return res.status(404).json({ message: `No school found with the name - ${school}` });
        };
        studentDetails.photo = uploadedPhotoUrl;

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