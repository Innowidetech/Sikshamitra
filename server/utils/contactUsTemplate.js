const contactUsTemplate = (firstName, lastName, email, phoneNumber, message) => `
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
          <h2 style="color: #333;">New Contact Us Form.</h2>
          <p><strong>Name :</strong> ${firstName} ${lastName}</p>
          <p><strong>Email :</strong> ${email}
          <p><strong>Contact Number :</strong> ${phoneNumber}</p>
          <p><strong>Message :</strong><span"> ${message}</span></p>         
        </div>
        <div class="footer">
            <p>&copy; 2024 Shikshamitra. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

module.exports = contactUsTemplate;