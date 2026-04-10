import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const FAQ_DATA = [
  {
    category: 'Booking & Reservations',
    icon: '📅',
    questions: [
      {
        q: 'How do I book a room at StaySphere?',
        a: 'Booking is simple! Create a free account, browse available rooms on the Home page, click "Book Now" on your preferred room, fill in the booking form with your personal details and stay duration, then submit. Our admin team will review and confirm your booking within 24 hours.',
      },
      {
        q: 'Can I visit and inspect the room before booking?',
        a: 'Absolutely! We encourage all prospective residents to schedule a site visit before booking. Contact us via the Contact Us page or call us at +91 98765 43210 to arrange a convenient time for a walkthrough.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 7–14 days in advance to ensure your preferred room is available. During peak admission seasons (June–August and November–December), we suggest booking 3–4 weeks ahead.',
      },
      {
        q: 'What happens after I submit a booking request?',
        a: 'Once you submit, the booking shows as "Pending" in your My Bookings page. Our admin reviews the request, verifies availability, and updates the status to "Confirmed" — usually within 24 hours.',
      },
      {
        q: 'Can I book a room for someone else?',
        a: 'Yes, you can book on behalf of a family member or colleague. However, the occupant must present valid ID proof at the time of check-in for verification.',
      },
    ],
  },
  {
    category: 'Payments & Pricing',
    icon: '💰',
    questions: [
      {
        q: 'When and how do I pay the rent?',
        a: 'Rent is collected on-site at check-in for the first month. Subsequent months are due by the 5th of each month. We accept cash and UPI payments (PhonePe, Google Pay, Paytm) at the property office.',
      },
      {
        q: 'Is there a security deposit?',
        a: 'Yes, a refundable security deposit equivalent to 2 months rent is collected at check-in. This is fully refunded within 15 working days of vacating, provided there is no damage to the property.',
      },
      {
        q: 'Are there any hidden charges?',
        a: 'Absolutely no hidden charges. The listed price covers accommodation only. Electricity is metered and billed separately. Optional services like laundry, mess food, and parking are charged at fixed rates disclosed upfront.',
      },
      {
        q: 'What is included in the monthly rent?',
        a: 'Monthly rent includes the furnished room, high-speed WiFi, 24/7 security, housekeeping twice a week, and access to all common areas including lounge, terrace, and gym. AC rooms include electricity up to a fixed unit limit per month.',
      },
      {
        q: 'Do you offer discounts for long-term stays?',
        a: 'Yes! Residents booking for 6 months get 5% off monthly rent, and those booking for 12 months get 10% off. Contact our admin for details on applying the long-term discount to your booking.',
      },
    ],
  },
  {
    category: 'Cancellation & Refunds',
    icon: '🔄',
    questions: [
      {
        q: 'What is the cancellation policy?',
        a: 'Cancellations made 7 or more days before check-in receive a full refund. Cancellations within 3–6 days receive a 50% refund. Cancellations within 48 hours of check-in are non-refundable. Security deposits are always fully refundable.',
      },
      {
        q: 'How do I cancel my booking?',
        a: 'Go to "My Bookings" in your account and click the "Cancel" button next to your booking. Alternatively, contact us at +91 98765 43210 or email hello@staysphere.com with your booking ID.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds are processed within 5–7 working days. UPI refunds reflect within 3 working days. Cash payments are refunded in person at the property office.',
      },
    ],
  },
  {
    category: 'Facilities & Rules',
    icon: '🏠',
    questions: [
      {
        q: 'What amenities are available in the hostel?',
        a: 'StaySphere provides high-speed WiFi in all rooms and common areas, 24/7 CCTV surveillance, biometric entry, housekeeping, a fully-equipped gym, rooftop lounge, laundry service, filtered drinking water, power backup, and on-site parking.',
      },
      {
        q: 'Are guests allowed inside the hostel?',
        a: 'Residents may have guests in common areas between 9 AM and 9 PM. Guests are not permitted inside resident rooms. Overnight guests are strictly not allowed for security and privacy reasons.',
      },
      {
        q: 'What are the check-in and check-out timings?',
        a: 'Standard check-in is between 10 AM and 7 PM. Check-out must be completed by 11 AM. Early check-in or late check-out can be arranged based on availability — please inform us at least 48 hours in advance.',
      },
      {
        q: 'Is cooking allowed in rooms?',
        a: 'Cooking is not permitted inside individual rooms for safety reasons. Residents have access to a shared kitchen on the ground floor equipped with a refrigerator, microwave, induction cooktop, and basic cookware.',
      },
    ],
  },
  {
    category: 'Account & Support',
    icon: '👤',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Get Started" in the top navigation bar. Fill in your full name, email, phone number, and create a strong password. Your account is created instantly and you can start browsing and booking rooms right away.',
      },
      {
        q: 'I forgot my password. What do I do?',
        a: 'On the Login page, click "Forgot password?" below the password field. Enter your registered email and we will send a password reset link within a few minutes. Check your spam folder if needed.',
      },
      {
        q: 'Can I update my profile information?',
        a: 'Yes. Go to your Profile page (click your avatar top-right, then "My Profile"). You can update your name, email, and phone number at any time. Password changes require your current password for security.',
      },
    ],
  },
];

export default function FAQ() {
  // Only one item open at a time — track as single string key or null
  const [openKey, setOpenKey] = useState('0-0');

  const toggle = (key) => {
    // If same key clicked again → close it. Otherwise open new one.
    setOpenKey(prev => prev === key ? null : key);
  };

  const totalQuestions = FAQ_DATA.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div className="info-page page-enter">

      {/* ── Hero ── */}
      <div className="info-hero info-hero--faq">
        <div className="container">
          <div className="info-hero__badge">❓ Help Center</div>
          <h1 className="info-hero__title">Frequently Asked Questions</h1>
          <p className="info-hero__sub">
            {totalQuestions} answers to common questions about StaySphere.
            Can't find what you need?{' '}
            <Link to="/contact">Contact us directly</Link>.
          </p>
        </div>
      </div>

      <div className="container info-body">

        {/* ── Category Quick Links ── */}
        <div className="faq-category-links">
          {FAQ_DATA.map((cat, i) => (
            <a key={i} href={`#faq-cat-${i}`} className="faq-cat-link">
              <span>{cat.icon}</span>
              {cat.category}
            </a>
          ))}
        </div>

        {/* ── Accordion Sections ── */}
        <div className="faq-sections">
          {FAQ_DATA.map((cat, ci) => (
            <div key={ci} id={`faq-cat-${ci}`} className="faq-category">

              <div className="faq-category__header">
                <span className="faq-category__icon">{cat.icon}</span>
                <h2 className="faq-category__title">{cat.category}</h2>
                <span className="faq-category__count">{cat.questions.length} questions</span>
              </div>

              <div className="faq-list">
                {cat.questions.map((item, qi) => {
                  const key = `${ci}-${qi}`;
                  const isOpen = openKey === key;

                  return (
                    <div
                      key={key}
                      className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                    >
                      {/* Question Button */}
                      <button
                        className="faq-item__question"
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-item__q-text">{item.q}</span>
                        <span className="faq-item__chevron">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            width="18"
                            height="18"
                            style={{
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            <path
                              d="M5 7.5l5 5 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>

                      {/* Answer — only rendered when open */}
                      {isOpen && (
                        <div className="faq-item__answer">
                          <p>{item.a}</p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="info-cta">
          <h3>Still have questions?</h3>
          <p>Our support team is available Monday to Saturday, 9 AM to 7 PM.</p>
          <div className="info-cta__btns">
            <Link to="/contact" className="btn btn--gold btn--lg">Contact Support</Link>
            <Link to="/" className="btn btn--outline btn--lg">Browse Rooms</Link>
          </div>
        </div>

      </div>
    </div>
  );
}