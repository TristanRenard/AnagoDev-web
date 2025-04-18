export const accountVerificationMailTemplate = `
# Account Verification

Hello {{name}},

Please click on the link below to verify your account:

<a class="text-red-500" href="{{verificationLink}}">Verify Account</a>
`

export const sendOTPMailTemplate = `
# OTP Verification

Hello {{name}},

Your OTP is {{otp}}.

If you did not request this OTP, please ignore this email.

Thank you.
`

export const accountDeletionMailTemplate = `
# Account Deletion

Hello {{name}},

Please click on the link below to delete your account:

<a class="text-red-500" href="{{accountDeletionLink}}">Delete Account</a>
`

export const contactMailTemplate = `
# New Contact Form Submission

Hello {{name}},

You have received a new contact form submission from {{email}}.

Message:
{{message}}

Thank you.
`
