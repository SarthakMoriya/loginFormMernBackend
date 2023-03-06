import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';


let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'dolly.dooley@ethereal.email', // generated ethereal user
        pass: 'ypFdEJ8XteCh9Gf6CN', // generated ethereal password
    },
    tls: {
        // do not fail on invalid certs yoyo
        rejectUnauthorized: false
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    //body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody = MailGenerator.generate(email)

    let message = {
        from: "dolly.dooley@ethereal.email",
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us." })
        })
        .catch(error => res.status(500).send({ error }))
}