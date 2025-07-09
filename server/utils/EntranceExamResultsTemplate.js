const EntranceExamResultsTemplate = (studentName, studentClass, examId, percentage, schoolName) => `
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
    .apply-link {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Congratulations from ${schoolName}!</h1>
    <div class="content">
      <p>Dear <b>${studentName}</b>,</p>
      
      <p>We are delighted to inform you that you have <strong>successfully qualified</strong> in the entrance examination conducted by <b>${schoolName}</b> for admission into <b>Class ${studentClass}</b>.</p>

      <p><strong>Your Result Details:</strong></p>
      <p><strong>Exam ID:</strong> ${examId}</p>
      <p><strong>Percentage:</strong> ${percentage}%</p>

      <p>To proceed with your admission, please fill out the official application form. You can choose to apply either <strong>online</strong> or an <strong>offline</strong> application.</p>

      <p style="text-align: center;">
        <a href="https://shikshamitra-i.web.app/applyonline" class="apply-link" target="_blank">Apply Now For Online Application</a>
        <a href="https://shikshamitra-i.web.app/admission" class="apply-link" target="_blank">Apply Now For Offline Application</a>
      </p>

      <p><strong>Note:</strong> While applying, please make sure to use your <strong>Exam ID (${examId})</strong> and <strong>percentage (${percentage})%</strong> for verification.</p>

      <br>
      <p><b>Best Wishes,</b></p>
      <p>Admissions Team,</p>
      <p><b>${schoolName}.</b></p>
    </div>

    <div class="footer">
      <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = EntranceExamResultsTemplate;
