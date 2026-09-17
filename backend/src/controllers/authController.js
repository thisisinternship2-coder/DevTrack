exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const result = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpiry, user.id]
    );

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">DevTrack Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Reset Password</a>
        </p>
        <p>Or copy this link into your browser:</p>
        <p style="word-break: break-all; color: #586069;">${resetUrl}</p>
        <p style="color: #94a3b8; font-size: 13px;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'DevTrack — Password Reset',
      html,
    });

    res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    console.error('=== FORGOT PASSWORD ERROR ===');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    console.error('Response:', error.response);
    console.error('Stack:', error.stack);

    res.status(500).json({
      message: 'Failed to send reset email',
      debug: {
        message: error.message,
        code: error.code,
        command: error.command,
      },
    });
  }
};