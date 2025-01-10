const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const env = process.env.NODE_ENV || 'development';
const configContainer = require(__dirname + '/../config/config.json')[env];

const createTransporter = () => {
    return nodemailer.createTransport(configContainer.emailSenderOptions);
};

const sendEmail = async (to, subject, templatePath, templateData) => {
    try {
        const transporter = createTransporter();
        const template = fs.readFileSync(path.resolve(__dirname, templatePath), "utf-8");
        const html = ejs.render(template, templateData);

        const mailOptions = {
            from: '"Fred Foo 👻" <node@example.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        return info.messageId;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Email sending failed");
    }
};

module.exports = { sendEmail };
