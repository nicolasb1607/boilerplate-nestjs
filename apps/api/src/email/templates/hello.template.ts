export const HelloTemplateName = 'Hello';

export const HelloTemplateSubject = 'Welcome to State.com, {{firstName}}!';

export const HelloTemplateHTMLBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to State.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #555555;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #28a745;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to State.com, {{firstName}}!</h1>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>We are thrilled to have you join our community! At State.com, we strive to provide the best services and experiences to our members. We are confident that you will find everything you need to stay connected and informed.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <a href="{{dashboardLink}}" class="button">Visit Your Dashboard</a>
        <p>We hope you enjoy your time with us and make the most of what we offer.</p>
        <div class="footer">
            &copy; 2024 State.com. All rights reserved.<br>
            <a href="https://state.com/privacy-policy">Privacy Policy</a> | <a href="https://state.com/terms">Terms of Service</a>
        </div>
    </div>
</body>
</html>`;
