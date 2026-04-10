import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const SECTIONS = [
  {
    id: 'acceptance',
    icon: '✅',
    title: '1. Acceptance of Terms',
    text: 'By accessing or using the StaySphere platform — including our website, mobile application, and any related services — you agree to be legally bound by these Terms of Service ("Terms"). Please read them carefully.',
    items: [
      'If you do not agree to any part of these terms, you must not use our services. These Terms constitute a legally binding agreement between you ("User" or "Resident") and StaySphere ("Company", "we", "us").',
      'These Terms apply to all users, including visitors, registered residents, and anyone accessing the StaySphere admin panel. Using our platform constitutes full acceptance of these Terms.',
    ],
  },
  {
    id: 'eligibility',
    icon: '👤',
    title: '2. User Eligibility',
    text: 'To use StaySphere services, you must meet the following requirements:',
    items: [
      'You must be at least 18 years of age',
      'You must be a citizen or legal resident of India',
      'You must have a valid government-issued photo ID (Aadhar, PAN, Passport, Driving License, or Voter ID)',
      'You must provide accurate, current, and complete information during registration',
      'You must not have been previously suspended or removed from StaySphere for policy violations',
      'StaySphere reserves the right to verify user identity and eligibility at any time, including at check-in, and to refuse service to any person who does not meet these requirements.',
    ],
  },
  {
    id: 'account-security',
    icon: '🔑',
    title: '3. Account Registration & Security',
    text: 'When you create an account on StaySphere, you agree to:',
    items: [
      'Provide truthful, accurate, and complete registration information',
      'Maintain and promptly update your account information when it changes',
      'Keep your password confidential and not share it with any third party',
      'Notify us immediately at hello@staysphere.com if you suspect unauthorized access to your account',
      'Accept responsibility for all activities that occur under your account',
    ],
    subsection: {
      title: 'Account Restrictions',
      items: [
        'Each person may maintain only one active resident account',
        'Account sharing or transferring is strictly prohibited',
        'Creating fake, duplicate, or impersonation accounts is grounds for immediate termination',
      ],
    },
  },
  {
    id: 'booking-terms',
    icon: '📅',
    title: '4. Booking Terms & Conditions',
    subsections: [
      {
        title: '4.1 Booking Process',
        text: 'A booking request submitted through StaySphere constitutes an offer to rent the specified room for the specified duration. It is NOT a confirmed reservation until explicitly approved by our admin team.',
      },
      {
        title: '4.2 Booking Confirmation',
        items: [
          'Bookings are confirmed only after admin review and explicit status change to "Confirmed"',
          'You will be notified via email and on your My Bookings page',
          'Confirmation does not guarantee immediate check-in without proper ID verification',
        ],
      },
      {
        title: '4.3 Your Obligations as a Resident',
        items: [
          'Comply with all house rules, building regulations, and management instructions',
          'Pay monthly rent by the 5th of each month without exception',
          'Maintain the room in good condition and report any damage immediately',
          'Not sublet or share the room with unauthorized persons',
          'Respect fellow residents and maintain a peaceful environment',
          'Keep common areas clean and follow shared kitchen protocols',
          'Violations of house rules may result in immediate termination of your booking without refund of the security deposit, subject to the nature and severity of the violation.',
        ],
      },
    ],
  },
  {
    id: 'payments',
    icon: '💰',
    title: '5. Payments & Financial Terms',
    items: [
      { bold: 'Rent Due Date:', text: 'Monthly rent is due by the 5th of each calendar month' },
      { bold: 'Late Payment:', text: 'A late fee of ₹200 per day will be charged for rent paid after the 5th' },
      { bold: 'Security Deposit:', text: '2 months\' rent collected at check-in; refundable within 15 working days of vacating' },
      { bold: 'Deductions:', text: 'Security deposit may be deducted for property damage, unpaid rent, or outstanding dues' },
      { bold: 'Advance Rent:', text: 'Any advance payments made are non-refundable unless the booking is cancelled per our cancellation policy' },
      { bold: 'Electricity:', text: 'Metered separately and billed by the 10th of each month' },
      { bold: 'Price Changes:', text: 'Rent may be revised with 30 days\' written notice to current residents' },
    ],
  },
  {
    id: 'cancellation',
    icon: '🔄',
    title: '6. Cancellation & Termination',
    subsections: [
      {
        title: '6.1 Cancellation by Resident',
        items: [
          '7+ days before check-in: full refund of advance payment',
          '3–6 days before check-in: 50% refund of advance payment',
          'Within 48 hours of check-in: No refund of advance payment',
          'Security deposit is always fully refundable subject to room condition',
        ],
      },
      {
        title: '6.2 Early Checkout',
        text: 'If you wish to vacate before your scheduled check-out date, you must provide at least 30 days\' written notice. Rent for the notice period is payable regardless of actual occupancy.',
      },
      {
        title: '6.3 Termination by StaySphere',
        text: 'We reserve the right to terminate a booking immediately and without refund in cases of:',
        items: [
          'Non-payment of rent for more than 7 days',
          'Repeated violation of house rules causing disturbance or damage',
          'Fraudulent or misrepresented booking information',
          'Illegal activities on the premises',
          'Harassment of staff or fellow residents',
        ],
      },
    ],
  },
  {
    id: 'prohibited',
    icon: '🚫',
    title: '7. Prohibited Conduct',
    text: 'The following activities are strictly prohibited on StaySphere premises and platform:',
    items: [
      'Smoking, alcohol consumption, or use of illegal substances on the premises',
      'Possession or storage of weapons, explosives, or hazardous materials',
      'Loud music, parties, or activities that disturb other residents after 10 PM',
      'Unauthorized entry into other residents\' rooms or storage areas',
      'Subletting or transferring your room to another person',
      'Tampering with security systems, CCTV, or biometric access devices',
      'Misuse of the online platform including hacking, scraping, or automated access',
      'Uploading false, defamatory, or misleading information',
      'Harassment, bullying, or threatening behavior toward any person',
    ],
  },
  {
    id: 'liability',
    icon: '⚖️',
    title: '8. Limitation of Liability',
    text: 'StaySphere provides accommodation management services and to the extent permitted by law:',
    items: [
      'We are not liable for theft, loss, or damage to personal belongings on the premises',
      'We are not responsible for injuries arising from negligence by the resident',
      'Our total liability in any claim shall not exceed the monthly rent paid for the relevant period',
      'We are not liable for service interruptions due to maintenance, technical issues, or circumstances beyond our control',
      'Residents are strongly advised to obtain personal belongings insurance. StaySphere is not responsible for personal property left in common areas.',
    ],
  },
  {
    id: 'governing-law',
    icon: '🏛️',
    title: '9. Governing Law & Disputes',
    items: [
      { bold: 'Applicable Law:', text: 'These Terms are governed by and construed in accordance with the laws of India, specifically applicable to the state of Gujarat.' },
      { bold: 'Dispute Resolution:', text: 'Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation' },
      { bold: 'Mediation:', text: 'Unresolved disputes will be referred to mediation before litigation' },
      { bold: 'Jurisdiction:', text: 'Courts in Rajkot, Gujarat shall have exclusive jurisdiction over any legal proceedings' },
    ],
  },
  {
    id: 'changes',
    icon: '📝',
    title: '10. Changes to These Terms',
    items: [
      'StaySphere reserves the right to modify these Terms at any time. When changes are made:',
      'We will update the "Last updated" date at the top of this page',
      'For material changes, we will notify active residents via email at least 14 days in advance',
      'Continued use of our services after changes take effect constitutes acceptance of the new Terms',
      'We encourage you to review these Terms periodically. If you disagree with revised Terms, you may cancel your account before the changes take effect.',
      'For questions about these Terms, contact us at legal@staysphere.com',
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="info-page page-enter">

      {/* ── Hero ── */}
      <div className="info-hero info-hero--terms">
        <div className="container">
          <div className="info-hero__badge">📋 Legal</div>
          <h1 className="info-hero__title">Terms of Service</h1>
          <p className="info-hero__sub">
            Last updated: <strong style={{ color: 'var(--gold-light)' }}>March 2026</strong>
            &nbsp;|&nbsp; Version: <strong style={{ color: 'var(--gold-light)' }}>2.0</strong>
          </p>
          <p className="info-hero__desc">
            Please read these terms carefully before using StaySphere.
            By using our services, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      <div className="container info-body">
        <div className="legal-layout">

          {/* ── Sticky Table of Contents ── */}
          <aside className="legal-toc">
            <div className="legal-toc__title">Contents</div>
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
              <p>Need clarification?</p>
              <Link to="/contact" className="btn btn--outline btn--sm">Contact Us</Link>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="legal-content">

            <div className="legal-intro">
              <p>
                Welcome to StaySphere. These Terms of Service constitute a legally binding agreement
                between you and StaySphere regarding your use of our platform and accommodation services.
                By registering or booking with us, you confirm that you have read and accepted these terms.
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

                {/* Top-level flat items */}
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

                {/* Inline subsection (single) */}
                {section.subsection && (
                  <div className="legal-subsection">
                    <h3 className="legal-subsection__title">{section.subsection.title}</h3>
                    <ul className="legal-list">
                      {section.subsection.items.map((item, ii) => <li key={ii}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {/* Multiple subsections */}
                {section.subsections && section.subsections.map((sub, si) => (
                  <div key={si} className="legal-subsection">
                    <h3 className="legal-subsection__title">{sub.title}</h3>
                    {sub.text && <p className="legal-subsection__text">{sub.text}</p>}
                    {sub.items && (
                      <ul className="legal-list">
                        {sub.items.map((item, ii) => <li key={ii}>{item}</li>)}
                      </ul>
                    )}
                  </div>
                ))}

                {section.footer && (
                  <div className="legal-note">{section.footer}</div>
                )}
              </section>
            ))}

            <div className="legal-footer-cta">
              <h4>Have Questions About Our Terms?</h4>
              <p>Our team is happy to explain anything in plain language. Don't hesitate to reach out.</p>
              <div className="legal-footer-cta__btns">
                <Link to="/contact" className="btn btn--primary">Contact Us</Link>
                <Link to="/privacy-policy" className="btn btn--outline">Privacy Policy</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}