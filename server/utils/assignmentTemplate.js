const assignmentTemplate = (studentName, chapterName, subject, teacherName, chapter, startDate, endDate) => `
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
            text-align: center;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            padding: 15px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content h6 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .content p {
            margin: 8px 0;
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
        <h1>New Assignment - ${chapter}</h1>
        <div class="content">
            <p>Dear <b>${studentName}</b>,</p>
            <p>You have received a new assignment in <b>${subject}</b> from <b>${teacherName} teacher</b>. <a href="https://shikshamitra-i.web.app/student/maindashboard">Click on this link:</a></p>
            
            <p><strong>Assignment Details:</strong></p>
            <p><strong>Chapter Name:</strong> ${chapterName}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Chapter:</strong> ${chapter}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>

            <div class="divider"></div>

            <p>Please login to the portal and make sure to complete the assignment on time. If you have any questions, contact to ${teacherName} teacher.</p>
        </div>

        <div class="footer">
            <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = assignmentTemplate;
