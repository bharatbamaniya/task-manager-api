import sgMail from '@sendgrid/mail';

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'makemyspaceinfo@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app. ${name}. Let me know how you get along with the app.`
    })
};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'makemyspaceinfo@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye. ${name}. Hope to see you again.`
    })
}

export {sendWelcomeEmail, sendCancellationEmail}