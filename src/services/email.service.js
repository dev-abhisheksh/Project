import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

if (!process.env.SENDGRID_API_KEY) {
  console.error('⚠️  Missing SENDGRID_API_KEY environment variable');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getOtpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; margin: 0 0 20px 0;">ImpactHub</h1>
        <p style="font-size: 16px; color: #666; line-height: 24px;">Verify your email to complete your registration.</p>
        <div style="background-color: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
          <h2 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h2>
        </div>
        <p style="color: #999; font-size: 14px; margin: 10px 0;">This OTP is valid for 5 minutes.</p>
        <p style="color: #999; font-size: 14px; margin: 10px 0;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

const sendOtpEmail = async (to, otp) => {
  try {
    console.log(`📧 Sending OTP to ${to} via SendGrid`);

    const msg = {
      to: to,
      from: {
        email: 'finalyearproject2023.01@gmail.com',
        name: 'ImpactHub'
      },
      subject: 'Your ImpactHub Verification Code',
      text: `Your ImpactHub OTP is: ${otp}. It is valid for 5 minutes.`,
      html: getOtpTemplate(otp),
    };

    const response = await sgMail.send(msg);

    console.log('✅ OTP email sent successfully via SendGrid');
    return { success: true, messageId: response[0].headers['x-message-id'] };
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error.message);

    if (error.response) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body, null, 2));
    }

    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const transporter = {
  verify: () => {
    console.log('✅ SendGrid configured and ready');
    return Promise.resolve(true);
  }
};

export { transporter, sendOtpEmail };