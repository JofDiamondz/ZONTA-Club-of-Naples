// Email sending scaffold for Scholarship Application
// By default, this is a safe no-op so the site works without credentials.
// To enable real emails, integrate a provider (e.g., EmailJS) by filling the config below
// and including their SDK, or replace this function with a POST to your backend.

(function(global){
  const EmailConfig = {
    enabled: false, // set true after configuring provider
    provider: 'emailjs',
    emailjs: {
      publicKey: '', // e.g., 'YOUR_PUBLIC_KEY'
      serviceId: '', // e.g., 'service_xxx'
      templateApplicant: '', // e.g., 'template_applicant'
      templateAdmin: '', // e.g., 'template_admin'
      adminEmail: '' // where to send admin copy (if using SDK); otherwise include in backend
    }
  };

  function sendViaEmailJS(data){
    if(!global.emailjs){
      console.warn('[Email] EmailJS SDK not loaded; skipping real send.');
      return Promise.resolve({ ok: true, simulated: true });
    }
    const cfg = EmailConfig.emailjs;
    if(!cfg.publicKey || !cfg.serviceId || !cfg.templateApplicant || !cfg.templateAdmin){
      console.warn('[Email] EmailJS config incomplete; skipping real send.');
      return Promise.resolve({ ok: true, simulated: true });
    }
    global.emailjs.init({ publicKey: cfg.publicKey });

    const applicantParams = {
      to_email: data.email,
      to_name: data.firstName + ' ' + data.lastName,
      subject: 'Your Scholarship Application – Zonta Club of Naples',
      message: 'Thank you for applying! We have received your submission and will follow up via email.'
    };
    const adminParams = {
      to_email: cfg.adminEmail,
      subject: 'New Scholarship Application Submitted',
      message: JSON.stringify(data, null, 2)
    };

    return Promise.all([
      global.emailjs.send(cfg.serviceId, cfg.templateApplicant, applicantParams),
      global.emailjs.send(cfg.serviceId, cfg.templateAdmin, adminParams)
    ]).then(()=>({ ok: true })).catch(err=>{
      console.error('[Email] send failed', err);
      return { ok: false, error: err };
    });
  }

  function sendScholarshipEmails(appData){
    if(EmailConfig.enabled){
      if(EmailConfig.provider === 'emailjs'){
        return sendViaEmailJS(appData);
      }
      // extend with other providers as needed
    }
    // Default: no-op simulation
    console.log('[Email] Simulating emails to applicant and admin. Data:', appData);
    return Promise.resolve({ ok: true, simulated: true });
  }

  global.sendScholarshipEmails = sendScholarshipEmails;
})(window);
