const queryTemplate = (schoolName,parentName, parentPhone, studentName, studentClass, studentSection, query) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 25px;
        }
        .footer p {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="border: 1px solid #ccc; border-radius: 5px; padding: 20px; max-width: 600px; font-family: Arial, sans-serif;">
          <<h2 style="color: #333;">New Query Form Submission.</h2>
          <p>We have received a new query submitted by ${parentName}, a parent of ${studentName}, from ${schoolName} School. Below are the details of the query:</p>
          <p><strong>Parent Name :</strong> ${parentName}</p>
          <p><strong>parent Phone Number :</strong> ${parentPhone}</p>
          <p><strong>Student :</strong> ${studentName} of class ${studentClass} ${studentSection}</p>
          <p><strong>Query :</strong><span"> ${query}</span></p>
          <p>Kindly review the query and respond to the parent’s concerns by replying to this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

module.exports = queryTemplate;