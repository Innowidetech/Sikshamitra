const contactUsTemplate = (firstName, lastName, email, phoneNumber, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff9f1c;
            color: #fff;
            padding: 25px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .header h2 {
            margin: 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .content strong {
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 25px;
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 0 0 10px 10px;
        }
        .footer p {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Us Form Submission</h2>
        </div>
        <div class="content">
            <p><strong>Dear Team,</strong></p>
            <p>You have received a new contact form submission. Below are the details:</p>

            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email Address:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Message:</strong><br> ${message}</p>

            <p>If you require any further information, please reply to this email directly.</p>

        </div>
        <div class="footer">
            <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = contactUsTemplate;
