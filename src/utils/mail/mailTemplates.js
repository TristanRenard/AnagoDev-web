export const accountVerificationMailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Account Verification</title>
  <style>
    body {
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 500px;
      background-color: #f9f9fc;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .greeting {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .message {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 14px 24px;
      background-color: #5E17EB;
      color: white;
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
    }
    .link-box {
      background-color: #e8eaf6;
      padding: 15px;
      margin-top: 20px;
      border-radius: 10px;
      word-break: break-word;
      font-size: 14px;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">Hello {{name}},</div>
    <div class="message">
      We need to verify your email to finish the setup of your account.
    </div>
    <div class="message">
      Please click on the button below to verify your account or copy and paste the link below:
    </div>
    <a href="{{verificationLink}}" class="button">Verify my account</a>
    <div class="link-box">
      {{verificationLink}}
    </div>
  </div>
</body>
</html>
`

export const sendOTPMailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OTP Verification</title>
  <style>
    body {
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 500px;
      background-color: #f9f9fc;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .greeting {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .welcome {
      font-size: 16px;
      margin-bottom: 30px;
    }
    .otp-label {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .otp-box {
      display: inline-block;
      background-color: #e8eaf6;
      padding: 20px 40px;
      border-radius: 12px;
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #000;
      margin-bottom: 30px;
    }
    .footer {
      font-size: 14px;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">Hello {{name}},</div>
    <div class="welcome">We are really happy to see you again!</div>
    <div class="otp-label">Your OTP is</div>
    <div class="otp-box">{{otp}}</div>
    <div class="footer">
      If you did not request this OTP, please ignore this email.
    </div>
  </div>
</body>
</html>
`

export const accountDeletionMailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Account Deletion</title>
  <style>
    body {
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 500px;
      background-color: #f9f9fc;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .greeting {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .message {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 14px 24px;
      background-color: #E53935;
      color: white;
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
    }
    .link-box {
      background-color: #e8eaf6;
      padding: 15px;
      margin-top: 20px;
      border-radius: 10px;
      word-break: break-word;
      font-size: 14px;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">Hello {{name}},</div>
    <div class="message">
      Please click on the button below to delete your account. If you did not request this action, please ignore this email.
    </div>
    <a href="{{accountDeletionLink}}" class="button">Delete Account</a>
    <div class="link-box">
      {{accountDeletionLink}}
    </div>
  </div>
</body>
</html>
`

export const contactMailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
  <style>
    body {
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 500px;
      background-color: #f9f9fc;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .greeting {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: center;
    }
    .content {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .message-box {
      background-color: #e8eaf6;
      padding: 15px;
      border-radius: 10px;
      margin-top: 20px;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">New Contact Form Submission</div>
    <div class="content">
      <strong>From:</strong> {{name}} ({{email}})
    </div>
    <div class="content">
      <strong>Message:</strong>
    </div>
    <div class="message-box">
      {{message}}
    </div>
  </div>
</body>
</html>
`

export const contactMailTemplateConfirmation = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Message Received</title>
  <style>
    body {
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 500px;
      background-color: #f9f9fc;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: center;
    }
    .greeting {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .content {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .message-box {
      background-color: #e8eaf6;
      padding: 15px;
      border-radius: 10px;
      margin-top: 20px;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">Hello {{name}},</div>
    <div class="content">
      Our team has received your message. We will get back to you as soon as possible.
    </div>
    <div class="content">
      <strong>Your message:</strong>
    </div>
    <div class="message-box">
      {{message}}
    </div>
    <div class="content" style="margin-top: 30px;">
      Thank you for contacting us!
    </div>
  </div>
</body>
</html>
`
