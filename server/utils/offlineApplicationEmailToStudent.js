const offlineApplicationStudentTemplate = (
  firstName,
  lastName,
  address,
  dob,
  email,
  phoneNumber,
  schoolName,
  schoolCode,
  schoolContact,
  schoolEmail,
  schoolWebsite,
  schoolAddress
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .container {
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            background-color: #ff9f1c;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
            padding: 15px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content p {
            margin: 8px 0;
        }
        .content p strong {
            color: #333333;
        }
        .section-title {
            font-size: 18px;
            color: #333333;
            margin: 20px 0 10px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 25px;
        }
        .footer p {
            margin-top: 10px;
        }
        .divider {
            border-top: 1px solid #dddddd;
            margin: 20px 0;
        }
        .j {
            text-align: justify;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thank You for Applying to ${schoolName}</h1>
        <div class="content">
            <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
            <p>Thank you for your interest in <strong>${schoolName}</strong>. We have successfully received your offline application. Below is a copy of your application for your reference:</p>

            <div class="divider"></div>

            <p class="section-title">Application Details:</p>
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>

            <div class="divider"></div>

            <p class="section-title">School Contact Information:</p>
            <p><strong>School Code:</strong> ${schoolCode}</p>
            <p><strong>School Name:</strong> ${schoolName}</p>
            <p><strong>Contact Number:</strong> ${schoolContact}</p>
            <p><strong>Email:</strong> ${schoolEmail}</p>
            <p><strong>Website:</strong> <a href="${schoolWebsite}">${schoolWebsite}</a></p>
            <p><strong>Address:</strong> ${schoolAddress}</p>


            <p class="j">We appreciate your interest and will review your application shortly. If any additional information is required, the admissions team will reach out using the contact details you provided.</p>
        </div>

        <div class="footer">
            <p>If you have any questions, feel free to contact us at the provided details above.</p>
            <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = offlineApplicationStudentTemplate;
