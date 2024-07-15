// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';

interface OptionType {
   email: string;
   subject: string;
   message: string;
   attachments?: Array<{ filename: string; content: Buffer }>;
}

const sendEmail = async (options:OptionType) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER as string,
      pass: process.env.GMAIL_PASSWORD as string,
    },
  });

  const mailOption = {
    from: 'Yusuf Habib',
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments,
  };

  await transporter.sendMail(mailOption);
};

export { sendEmail };
