import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: `MediStock <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "MediStock - Reset Your Password",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2 style="color: #1c1917;">
          Reset Your Password
        </h2>

        <p>
          We received a request to reset your MediStock password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#1c1917;
            color:white;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px;color:#777;">
          This link will expire in 10 minutes.
        </p>

        <p style="color:#777;">
          If you didn't request this password reset, you can safely ignore this email.
        </p>

      </div>
    `,
  });
};
