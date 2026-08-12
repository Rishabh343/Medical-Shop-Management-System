import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email, resetUrl) => {
  const { data, error } = await resend.emails.send({
    from: "MediStock <onboarding@resend.dev>",
    to: [email],
    subject: "MediStock - Reset Your Password",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          border: 1px solid #e7e5e4;
          border-radius: 12px;
        "
      >

        <h2 style="color: #1c1917;">
          Reset Your Password
        </h2>

        <p style="color: #57534e;">
          We received a request to reset your MediStock password.
        </p>

        <p style="color: #57534e;">
          Click the button below to create a new password.
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background: #1c1917;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="color: #78716c; font-size: 14px;">
          This password reset link will expire in 10 minutes.
        </p>

        <p style="color: #78716c; font-size: 14px;">
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e7e5e4;" />

        <p style="color: #a8a29e; font-size: 12px;">
          © MediStock
        </p>

      </div>
    `,
  });

  if (error) {
    console.log("Resend Error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent successfully:", data);

  return data;
};
