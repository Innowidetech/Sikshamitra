const offlineTemplate = (firstName, lastName, address, dob, email, phoneNumber, schoolName) => `
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
            font-size: 26px;
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
        .content h6 {
            font-size: 18px;
            color: #333333;
            margin-bottom: 10px;
        }
        .content p {
            margin: 8px 0;
        }
        .content p strong {
            color: #333333;
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
        <h1>New Offline Application Received.</h1>
        <div class="content">
            <p>Dear Admissions Team - <strong>${schoolName}</strong>,</p>
            <p>You have received a new offline application. Below are the details of the applicant:</p>
            
            <div class="divider"></div>
            
            <p><strong>Applicant Details:</strong></p>
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>

            <div class="divider"></div>

            <p class="j">Please refer to the applicant’s information for further processing and contact them via phone number(${phoneNumber}) or email(${email}), Thank you.</p>
        </div>

        <div class="footer">
            <p>If you have any questions or need further assistance, please contact Shikshamitra.</p>
            <p>&copy; 2024 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = offlineTemplate;
