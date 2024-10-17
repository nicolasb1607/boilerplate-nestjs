export const CodeVerifyTemplateName = 'Verify_email';

export const CodeVerifyTemplateSubject = '{{firstName}}, Verify your email!';

export const CodeVerifyTemplateHTMLBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #666666;
            line-height: 1.5;
        }
        .code {
            display: inline-block;
            padding: 10px;
            font-size: 18px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007bff;
            border-radius: 5px;
            text-align: center;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hi {{firstName}} {{lastName}},</h1>
        <p>Thank you for registering with us! Please use the verification code below to complete your registration:</p>
        <div class="code">{{verificationCode}}</div>
        <p>If you did not create an account, please ignore this email.</p>
        <div class="footer">
            &copy; 2024 Your Company Name. All rights reserved.
        </div>
    </div>
</body>
</html>`;
