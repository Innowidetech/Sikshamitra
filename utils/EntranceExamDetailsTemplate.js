const EntranceExamDetailsTemplate = (studentName, studentClass, examMode, examDate, examTime, examId, examLink, schoolName, address) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      color: white;
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
    .content p {
      margin: 8px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #888888;
      margin-top: 25px;
    }
    .divider {
      border-top: 1px solid #dddddd;
      margin: 20px 0;
    }
    .exam-link {
      display: inline-block;
      padding: 5px 5px;
      background-color: #2196f3;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Entrance Exam for school - ${schoolName} got Scheduled</h1>
    <div class="content">
      <p>Dear <b>${studentName}</b>,</p>
      <p>Thank You for applying for the entrance examination. You are eligible to take the exam. Below are the details:</p>

      <div class="divider"></div>

      <p><strong></u>Exam Details:</u></strong></p>
      <p><strong>Class:</strong> ${studentClass}</p>
      <p><strong>Exam Mode:</strong> ${examMode}</p>
      <p><strong>Exam Date:</strong> ${examDate}</p>
      <p><strong>Exam Time:</strong> ${examTime}</p>
      <p><strong>Exam ID:</strong> ${examId}</p>
      <p style="text-align: center;">${examMode === 'Online' ? `<a class="exam-link" href="${examLink}" target="_blank">Join Exam</a>` : ''} </p>
      <p> ${examMode === 'Offline' ? `<strong>Examination Center:</strong> ${address}` : ''}</p>

      <div class="divider"></div>

      <p>${
      examMode === 'Online'
        ? 'NOTE: Please ensure you are prepared and join the exam on time using the provided link. If you have any questions, contact your school administration.'
        : 'NOTE: Please arrive at the examination center before 30 minutes of the exam time. For any queries, contact your school administration.'
    }</p>
      <br>
      <p><b>Best Regards,</b></p>
      <p>${schoolName}.</p>
    </div>

    <div class="footer">
      <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = EntranceExamDetailsTemplate;
