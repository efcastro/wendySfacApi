import nodemailer from "nodemailer";

import { EMAIL_PASS, EMAIL_USER } from "../config.js";

export const sendVerificationCode = async (to, code) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: '"SFAC" <no-reply@SFAC.com>',
      to,
      subject: "Código de verificación",
      html: `
        <p>Tu código de verificación para cambiar la contraseña es:</p>
        <h2>${code}</h2>
        <p>Este código expira en 10 minutos.</p>
      `,
    };
  
    await transporter.sendMail(mailOptions);
  };