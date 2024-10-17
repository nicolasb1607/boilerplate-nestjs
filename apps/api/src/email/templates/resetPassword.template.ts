export const ResetPasswordTemplateName = 'ResetPassword';

export const ResetPasswordTemplateSubject =
  '{{firstName}}, reset your password';

export const ResetPasswordTemplateHTMLBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      font-size: 24px;
      color: #333333;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007BFF;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, {{firstName}} {{lastName}}</h1>
    <p>It seems like you requested a password reset for your State.com account. To reset your password, please click the button below:</p>
    <a href="{{resetLink}}" class="button">Reset Your Password</a>
    <p>If you did not request this password reset, please ignore this email or contact support if you have questions.</p>
    <div class="footer">
      <p>Thank you,<br>The State.com Team</p>
    </div>
  </div>
</body>
</html>`;
