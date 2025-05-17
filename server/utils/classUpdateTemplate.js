const classUpdateTemplate = (teacherName, teacherClass, teacherSection, schoolName) => `
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
        }
        .container {
            width: 100%;
            max-width: 650px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 26px;
            background-color: #ff9f1c;
            text-align: center;
            color: #fff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
        }
        .content h6 {
            font-size: 18px;
            margin-bottom: 12px;
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 30px;
        }
        .footer p {
            margin-top: 10px;
        }
        .divider {
            border-top: 1px solid #dddddd;
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Class Assignment Update</h1>
        <div class="content">
            <h6>Dear ${teacherName},</h6>
            <p>We would like to inform you that <strong>${schoolName}</strong> has updated your class teacher assignment.</p>
            <p>You have now been assigned as the class teacher for:</p>
            <p><strong>Class:</strong> ${teacherClass}</p>
            <p><strong>Section:</strong> ${teacherSection}</p>
            <p>We appreciate your continued dedication and look forward to your valuable contributions in this new role.</p>
            <p>If you have any questions or concerns regarding this update, please feel free to reach out to the school administration by replying to this email directly.</p>
            <p>Thank you.</p>
        </div>
        <div class="divider"></div>
        <div class="footer">
            <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = classUpdateTemplate;
