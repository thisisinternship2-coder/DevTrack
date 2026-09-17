const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'DevTrack',
        email: process.env.EMAIL_FROM_EMAIL || 'thisisinternship2@gmail.com',
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Brevo API error response:', errorText);
    throw new Error(`Brevo API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  console.log(`📧 Email sent via Brevo API: ${data.messageId}`);
  return data;
};

module.exports = sendEmail;