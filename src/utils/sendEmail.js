import nodemailer from "nodemailer";

export const sendEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<h3>Click to verify:</h3><a href="${verificationLink}">Verify Email</a>`,
  });
};
