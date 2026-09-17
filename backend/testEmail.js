require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

(async () => {
  try {
    await sendEmail({
      to: 'ashwinsureshp20@gmail.com',  // ← put your OWN personal email here
      subject: 'DevTrack test',
      html: '<h1>It works!</h1><p>Brevo SMTP is connected.</p>',
    });
    console.log('✅ Test email sent successfully');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
})();