import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, subject, message } = await req.json();

  // Create a transporter object using SMTP or another email service
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `FROM PORTFOLIO SITE: ${subject}`,
      text: message,
      html: `<p>${message}</p>`,
    });

    console.log("Email sent successfully!");

    // Return a success response
    return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);

    // Return an error response
    return new Response(JSON.stringify({ success: false, message: "Failed to send email." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
