const ADMIN_EMAIL = 'nexorabuisnessdigital@gmail.com';
const FIELDS = ['name', 'business', 'email', 'whatsapp', 'project_type', 'budget', 'message'];

const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

module.exports = async (request, response) => {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

  const data = request.body || {};
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();
  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ error: 'Please complete your name, a valid email address, and project details.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(500).json({ error: 'Email delivery is being configured. Please email NEXORA directly for now.' });
  }

  const rows = FIELDS.map(field => `<tr><td style="padding:8px 14px;border:1px solid #e5e7eb;font-weight:700">${escapeHtml(field.replace('_', ' '))}</td><td style="padding:8px 14px;border:1px solid #e5e7eb">${escapeHtml(data[field])}</td></tr>`).join('');
  try {
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'NEXORA <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `New project enquiry from ${name}`,
        html: `<h2>New NEXORA project enquiry</h2><table style="border-collapse:collapse;font-family:Arial,sans-serif">${rows}</table>`
      })
    });
    if (!providerResponse.ok) throw new Error('Email provider rejected the request.');
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email failed:', error.message);
    return response.status(502).json({ error: 'We could not send your request. Please email NEXORA directly.' });
  }
};
