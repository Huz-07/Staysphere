import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const SECTIONS = [
  {
    id: 'information-we-collect',
    icon: '📋',
    title: '1. Information We Collect',
    subsections: [
      {
        title: '1.1 Personal Information',
        items: [
          'Full name, email address, and phone number provided during registration',
          'Government-issued ID details (Aadhar, PAN, Passport, etc.) submitted during booking for identity verification',
          'Profile information you voluntarily provide or update',
        ],
      },
      {
        title: '1.2 Booking & Transaction Data',
        items: [
          'Room booking details including check-in and check-out dates',
          'Booking history, payment status, and cancellation records',
          'Special requests or notes submitted with your booking',
        ],
      },
      {
        title: '1.3 Usage & Technical Data',
        items: [
          'Browser type, device type, and operating system information',
          'Pages visited, time spent on the platform, and click interactions',
          'IP address and approximate geographic location (city level only)',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: '🔍',
    title: '2. How We Use Your Information',
    text: 'We use the information we collect for the following purposes:',
    items: [
      { bold: 'Account Management:', text: 'To create, maintain, and secure your account on StaySphere' },
      { bold: 'Booking Processing:', text: 'To process your room booking requests, send confirmations, and manage your stay' },
      { bold: 'Identity Verification:', text: 'To verify your identity as required by hostel security and legal regulations' },
      { bold: 'Customer Support:', text: 'To respond to your inquiries, complaints, and support requests efficiently' },
      { bold: 'Service Improvement:', text: 'To analyze usage patterns and improve features, UI/UX, and overall service quality' },
      { bold: 'Legal Compliance:', text: 'To comply with applicable laws, regulations, and government requirements' },
      { bold: 'Safety & Security:', text: 'To detect, investigate, and prevent fraudulent or unauthorized activities' },
      { bold: 'Communication:', text: 'To send you important notices about your account, bookings, and service updates' },
    ],
    footer: 'We do NOT sell, rent, or trade your personal information to any third parties for their marketing purposes. Your data is used solely to provide you with StaySphere services.',
  },
  {
    id: 'information-sharing',
    icon: '🤝',
    title: '3. Information Sharing',
    text: 'StaySphere shares your information only in the following limited circumstances:',
    items: [
      { bold: 'Hostel Management Staff:', text: 'Authorized staff members access booking and resident data to manage day-to-day operations' },
      { bold: 'Legal Requirements:', text: 'We may disclose information when required by law, court order, or government authorities' },
      { bold: 'Service Providers:', text: 'Trusted third-party services (email delivery, payment processing) may access limited data strictly to perform their functions' },
      { bold: 'Business Transfers:', text: 'In the event of a merger or acquisition, your data may be transferred to the successor entity with prior notice' },
    ],
    footer: 'All service providers are contractually bound to protect your data and may not use it for any purpose beyond the agreed services.',
  },
  {
    id: 'data-security',
    icon: '🔒',
    title: '4. Data Security',
    text: 'We take the security of your personal information seriously and implement appropriate technical and organizational measures:',
    items: [
      'All user passwords are encrypted using bcrypt hashing — we never store plain text passwords',
      'Authentication sessions are managed using JSON Web Tokens (JWT) with appropriate expiry',
      'Our platform uses HTTPS encryption for all data transmitted between your browser and our servers',
      'Access to the admin panel is restricted to authorized personnel with role-based access controls',
      'Regular security audits and vulnerability assessments are conducted',
      'Database access is restricted and monitored with audit logs',
    ],
    footer: 'While we implement strong security measures, no method of transmission over the internet is 100% secure. We encourage you to use strong, unique passwords and log out after each session, especially on shared devices.',
  },
  {
    id: 'cookies',
    icon: '🍪',
    title: '5. Cookies & Local Storage',
    text: 'StaySphere uses browser local storage and session data to provide a seamless experience:',
    items: [
      { bold: 'Authentication Tokens:', text: 'We store your login session token locally to keep you logged in' },
      { bold: 'User Preferences:', text: 'Preferences like filter settings may be saved to improve your browsing experience' },
      { bold: 'Analytics:', text: 'We use anonymized analytics cookies to understand how the platform is used' },
    ],
    footer: 'You can clear local storage and cookies at any time through your browser settings. Note that clearing authentication data will log you out of your account.',
  },
  {
    id: 'your-rights',
    icon: '✋',
    title: '6. Your Rights',
    text: 'Under applicable data protection laws, you have the following rights regarding your personal data:',
    items: [
      { bold: 'Right to Access:', text: 'Request a copy of all personal data we hold about you' },
      { bold: 'Right to Correction:', text: 'Update or correct inaccurate personal information via your Profile page' },
      { bold: 'Right to Deletion:', text: 'Request deletion of your account and associated personal data' },
      { bold: 'Right to Portability:', text: 'Request your data in a structured, machine-readable format' },
      { bold: 'Right to Object:', text: 'Object to certain types of data processing in specific circumstances' },
      { bold: 'Right to Withdraw Consent:', text: 'Withdraw consent for non-essential data processing at any time' },
    ],
    footer: 'To exercise any of these rights, please contact us at hello@staysphere.com or visit our Contact page. We will respond within 30 days.',
  },
  {
    id: 'data-retention',
    icon: '🗂️',
    title: '7. Data Retention',
    text: 'We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy:',
    items: [
      'Active account data is retained for the duration of your account with us',
      'Booking records are retained for 5 years for legal and accounting compliance',
      'ID verification documents are stored for 2 years after the last booking',
      'After account deletion, anonymized usage statistics may be retained for analytics',
      'Upon request, we will delete your personal data within 30 days, subject to legal retention requirements',
    ],
  },
  {
    id: 'contact',
    icon: '📞',
    title: '8. Contact for Privacy Concerns',
    text: 'If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:',
    contactBlock: true,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="info-page page-enter">

      {/* ── Hero ── */}
      <div className="info-hero info-hero--privacy">
        <div className="container">
          <div className="info-hero__badge">🔒 Legal</div>
          <h1 className="info-hero__title">Privacy Policy</h1>
          <p className="info-hero__sub">
            Last updated: <strong style={{ color: 'var(--gold-light)' }}>March 2026</strong>
            &nbsp;|&nbsp; Effective from: <strong style={{ color: 'var(--gold-light)' }}>January 2025</strong>
          </p>
          <p className="info-hero__desc">
            We are committed to protecting your personal information.
            This policy explains how we collect, use, and safeguard your data.
          </p>
        </div>
      </div>

      <div className="container info-body">
        <div className="legal-layout">

          {/* ── Sticky Table of Contents ── */}
          <aside className="legal-toc">
            <div className="legal-toc__title">On This Page</div>
            <ul>
              {SECTIONS.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="legal-toc__link">
                    {s.icon} {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="legal-toc__contact">
              <p>Questions about this policy?</p>
              <Link to="/contact" className="btn btn--outline btn--sm">Contact Us</Link>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="legal-content">

            <div className="legal-intro">
              <p>
                This Privacy Policy applies to all users of the StaySphere Hostel & PG Management Portal.
                By using our platform, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {SECTIONS.map(section => (
              <section key={section.id} id={section.id} className="legal-section">
                <h2 className="legal-section__title">
                  <span className="legal-section__icon">{section.icon}</span>
                  {section.title}
                </h2>

                {section.text && (
                  <p className="legal-section__lead">{section.text}</p>
                )}

                {/* Subsections (nested) */}
                {section.subsections && section.subsections.map((sub, si) => (
                  <div key={si} className="legal-subsection">
                    <h3 className="legal-subsection__title">{sub.title}</h3>
                    <ul className="legal-list">
                      {sub.items.map((item, ii) => <li key={ii}>{item}</li>)}
                    </ul>
                  </div>
                ))}

                {/* Flat items */}
                {section.items && !section.subsections && (
                  <ul className="legal-list">
                    {section.items.map((item, ii) => (
                      <li key={ii}>
                        {typeof item === 'string'
                          ? item
                          : <><strong>{item.bold}</strong> {item.text}</>
                        }
                      </li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <div className="legal-note">{section.footer}</div>
                )}

                {section.contactBlock && (
                  <div className="legal-contact-block">
                    <div className="lcb-row"><span>Email</span><strong>privacy@staysphere.com</strong></div>
                    <div className="lcb-row"><span>Phone</span><strong>+91 98765 43210 (Mon–Sat, 9 AM to 7 PM)</strong></div>
                    <div className="lcb-row"><span>Address</span><strong>StaySphere Hostel, Near City Mall, Rajkot, Gujarat – 360001</strong></div>
                    <p className="lcb-note">We take all privacy concerns seriously and commit to responding within 72 hours.</p>
                  </div>
                )}
              </section>
            ))}

            <div className="legal-footer-cta">
              <h4>Questions About Your Privacy?</h4>
              <p>Our team is happy to clarify anything in this policy or how your data is handled.</p>
              <div className="legal-footer-cta__btns">
                <Link to="/contact" className="btn btn--primary">Contact Us</Link>
                <Link to="/terms-of-service" className="btn btn--outline">Terms of Service</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}