const registrationTemplate = (fullname, schoolName, email, password) => `
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
    </style>
</head>
<body>
    <div class="container">
        <h1>Account Registration Successful!</h1>
        <div class="content">
            <p>Dear ${fullname},</p>
            <p>We are excited to inform you that your account has been successfully created for school - ${schoolName}, with the following details:</p>
            
            <div class="divider"></div>
            
            <p><strong>Account Details:</strong></p>
            <p><strong>Name:</strong> ${fullname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>

            <div class="divider"></div>

            <p>To get started, you can log in to your account using your email and password. You can change your password by clicking on the forgot password.</p>
            <p>If you have any questions or need help, feel free to reach out.</p>
        </div>

        <div class="footer">
            <p>Thank you for registering with us! We look forward to serving you.</p>
            <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = registrationTemplate;
