// ============================================
// WEDDING DJ GREECE — MAIN JS
// ============================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll animations with IntersectionObserver
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .dest-card, .review-card, .portfolio-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
  observer.observe(el);
});

// ============================================
// MAILJET CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');

    // Gather form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const country = document.getElementById('country').value.trim();
    const weddingDate = document.getElementById('weddingDate').value;
    const venue = document.getElementById('venue').value.trim();
    const guests = document.getElementById('guests').value;
    const message = document.getElementById('message').value.trim();
    const services = [...document.querySelectorAll('input[name="services"]:checked')]
      .map(cb => cb.value).join(', ');

    // Basic validation
    if (!name || !email || !country) {
      formError.style.display = 'block';
      formError.querySelector('p').textContent = 'Please fill in your name, email and country.';
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    formSuccess.style.display = 'none';
    formError.style.display = 'none';

    const emailBody = `
<h2>New Wedding Enquiry — weddingdjgreece.eu</h2>
<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Name</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Email</td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Country</td><td style="padding:8px;border:1px solid #ddd;">${country}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Wedding Date</td><td style="padding:8px;border:1px solid #ddd;">${weddingDate || 'Not specified'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Venue / Location</td><td style="padding:8px;border:1px solid #ddd;">${venue || 'Not specified'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Guests</td><td style="padding:8px;border:1px solid #ddd;">${guests || 'Not specified'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Services</td><td style="padding:8px;border:1px solid #ddd;">${services || 'Not specified'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">Message</td><td style="padding:8px;border:1px solid #ddd;">${message || 'No message'}</td></tr>
</table>
<br>
<p style="color:#999;font-size:12px;">Sent from weddingdjgreece.eu contact form</p>
    `.trim();

    // Mailjet API v3.1 — uses Cloudflare Worker proxy (see _worker.js)
    // Direct call if CORS is configured, otherwise route through CF Worker
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromName: 'Wedding DJ Greece',
          fromEmail: 'info@weddingdjgreece.eu',
          toEmail: 'info@weddingdjgreece.eu',
          toName: 'Wedding DJ Greece',
          replyToEmail: email,
          replyToName: name,
          subject: `New Wedding Enquiry from ${name} (${country})`,
          htmlBody: emailBody,
          textBody: `New enquiry from ${name} (${email}, ${country}). Date: ${weddingDate}. Venue: ${venue}. Guests: ${guests}. Services: ${services}. Message: ${message}`
        })
      });

      if (response.ok) {
        formSuccess.style.display = 'block';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      formError.style.display = 'block';
      formError.querySelector('p').textContent = 'Something went wrong. Please email us directly at info@weddingdjgreece.eu or WhatsApp +30 693 680 4060';
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });
}

// Smooth anchor scrolling offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
