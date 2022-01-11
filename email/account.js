const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
sgMail.send({
    to: email,
    from: "kheyyon.parker@gmail.com",
    subject: "Welcome to the Task-Manager!",
    text: `Welcome to my app, ${name}. Let me know what you think about it. I will do my best in adding new features over time.`
})
}

const sendCancellationEmail = (email, name) => {
sgMail.send({
        to:email,
        from: "kheyyon.parker@gmail.com",
        subject:"We are sad to see you go 😟. What happended?",
        text: `${name}, we are curious about what made you decide to quit the service? Don't worry there's no survey. This is just so the service can improve moving forward.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}



