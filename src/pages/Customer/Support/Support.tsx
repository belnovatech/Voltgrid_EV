import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { SupportTicket } from '../../../types/customer';
import './Support.css';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATABASE: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Reservations',
    question: 'How do I reserve a charger ahead of time?',
    answer:
      'Go to the Reservations tab, click "+ New Reservation", select your preferred charging station, choose an available DC Fast or AC charger connector, pick your vehicle, select your 30-minute to 2-hour time slot, and confirm. The connector is automatically reserved for your vehicle plate.',
  },
  {
    id: 'faq_2',
    category: 'Charging Issues',
    question: 'How do I start charging at a PowerGrid station?',
    answer:
      'Park at your designated bay, connect the charging gun (CCS2, Type 2, or GB/T) securely into your vehicle socket until it clicks. You can initiate charging directly from the PowerGrid app dashboard or tap your RFID card. Charging begins once vehicle handshake is complete.',
  },
  {
    id: 'faq_3',
    category: 'Wallet & Payments',
    question: 'How do I add money to my PowerGrid wallet?',
    answer:
      'Navigate to the Wallet page, click "+ Add Money", select a preset (₹100, ₹250, ₹500, ₹1,000, ₹2,000) or enter a custom amount. Choose UPI (Google Pay, PhonePe, Paytm), Debit/Credit Card, or Net Banking to complete the instant recharge.',
  },
  {
    id: 'faq_4',
    category: 'Charging Issues',
    question: 'Why was my charging session interrupted or stopped?',
    answer:
      'Sessions may stop due to: 1) Vehicle battery reaching your configured charge limit (e.g. 80% or 100%), 2) Vehicle BMS requesting thermal cut-off, 3) Insufficient wallet balance, or 4) Emergency stop triggered. Check your notifications for the exact session termination code.',
  },
  {
    id: 'faq_5',
    category: 'Reservations',
    question: 'How do I cancel a reservation and receive a refund?',
    answer:
      'You can cancel an upcoming reservation at least 15 minutes before the scheduled start time from the Reservations page by clicking "Cancel Reservation". Any reservation lock fee is instantly refunded back to your PowerGrid wallet.',
  },
  {
    id: 'faq_6',
    category: 'Vehicles',
    question: 'How do I add or edit my vehicle in the garage?',
    answer:
      'Visit the "My Vehicles" page and click "+ Add Vehicle". Select your manufacturer, model, connector type (CCS2 / Type 2 / GB/T / CHAdeMO), and license plate. You can also set a primary vehicle for default reservation matching.',
  },
  {
    id: 'faq_7',
    category: 'Wallet & Payments',
    question: 'Why is my payment pending or failing?',
    answer:
      'UPI and bank servers may occasionally take up to 2-3 minutes to verify settlements. If your bank account is debited but the wallet is not updated within 5 minutes, our auto-reconciliation engine will either credit the wallet or reverse the bank transaction.',
  },
  {
    id: 'faq_8',
    category: 'Account & Profile',
    question: 'How do I obtain B2B GST tax invoices for commercial fleets?',
    answer:
      'Go to Profile > Settings and enter your company Registered Name and GSTIN. All subsequent charging sessions and wallet top-up invoices will include compliant GST tax breakdowns downloadable in PDF/Excel format.',
  },
];

const CATEGORIES = [
  {
    id: 'Charging Issues',
    title: 'Charging Issues',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    iconClass: 'powergrid-support__cat-icon--cyan',
    desc: 'Station not starting, slow charging, connector lock',
  },
  {
    id: 'Charger / Station',
    title: 'Charger / Station',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    iconClass: 'powergrid-support__cat-icon--mint',
    desc: 'Offline station, access barriers, parking bay occupied',
  },
  {
    id: 'Reservations',
    title: 'Reservations',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    iconClass: 'powergrid-support__cat-icon--indigo',
    desc: 'Slot booking, reschedule, slot cancellation, no-show',
  },
  {
    id: 'Wallet & Payments',
    title: 'Wallet & Payments',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    iconClass: 'powergrid-support__cat-icon--green',
    desc: 'Auto-debit questions, recharge failure, refund status',
  },
  {
    id: 'Vehicles',
    title: 'Vehicles & Garage',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    iconClass: 'powergrid-support__cat-icon--yellow',
    desc: 'Vehicle setup, connector compatibility, battery sync',
  },
  {
    id: 'Account & Profile',
    title: 'Account & Profile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    iconClass: 'powergrid-support__cat-icon--gray',
    desc: 'Phone update, GST invoice setup, notification alerts',
  },
];

export const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_1');

  // Ticket Modal States
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [ticketCategory, setTicketCategory] = useState<string>('Charging Issues');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDescription, setTicketDescription] = useState<string>('');
  const [ticketStation, setTicketStation] = useState<string>('Vijayawada Central');
  const [ticketCharger, setTicketCharger] = useState<string>('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState<boolean>(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Selected Ticket for Details & Reply Modal
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  const loadTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    try {
      const res = await customerService.getSupportTickets();
      setTickets(res);
    } catch {
      // ignore
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Filtered FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchesCat = selectedCategory ? item.category === selectedCategory : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenTicketModal = (categoryOverride?: string) => {
    setTicketCategory(categoryOverride || selectedCategory || 'Charging Issues');
    setTicketSubject('');
    setTicketDescription('');
    setTicketStation('Vijayawada Central');
    setTicketCharger('');
    setTicketError(null);
    setCreatedTicketId(null);
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    if (isSubmittingTicket) return;
    setIsTicketModalOpen(false);
    setTicketError(null);
    setCreatedTicketId(null);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      setTicketError('Please provide a subject for your ticket.');
      return;
    }
    if (!ticketDescription.trim()) {
      setTicketError('Please describe the issue in detail.');
      return;
    }

    setIsSubmittingTicket(true);
    setTicketError(null);

    try {
      const newTicket = await customerService.createSupportTicket({
        subject: ticketSubject.trim(),
        category: ticketCategory,
        description: ticketDescription.trim(),
        stationName: ticketStation,
        chargerId: ticketCharger.trim() || undefined,
      });

      setTickets((prev) => [newTicket, ...prev]);
      setCreatedTicketId(newTicket.id);
      setIsSubmittingTicket(false);
    } catch {
      setTicketError('Failed to create ticket. Please try again.');
      setIsSubmittingTicket(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingTicket || !replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const updated = await customerService.addTicketReply(viewingTicket.id, replyText.trim());
      setViewingTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setReplyText('');
    } catch {
      // ignore
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleToggleResolve = async () => {
    if (!viewingTicket) return;
    const nextStatus = viewingTicket.status === 'Resolved' || viewingTicket.status === 'Closed' ? 'Open' : 'Resolved';
    const updated = await customerService.updateTicketStatus(viewingTicket.id, nextStatus);
    setViewingTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <CustomerLayout>
      <div className="powergrid-support">
        {/* Support Center Header & Search Banner */}
        <div className="powergrid-support__hero">
          <div className="powergrid-support__hero-content">
            <span className="powergrid-support__hero-badge">POWERGRID HELP & SUPPORT</span>
            <h1 className="powergrid-support__hero-title">How can we help you today?</h1>
            <p className="powergrid-support__hero-sub">
              Search answers for charging stations, reservations, wallet billing, or submit a support ticket.
            </p>

            {/* Search Bar */}
            <div className="powergrid-support__search-wrapper">
              <svg className="powergrid-support__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="powergrid-support__search-input"
                placeholder="Search help articles, questions, error codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search help articles"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="powergrid-support__search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 24x7 Roadside Emergency Banner */}
        <div className="powergrid-support__emergency-bar">
          <div className="powergrid-support__emergency-left">
            <div className="powergrid-support__emergency-icon">🚨</div>
            <div>
              <h3 className="powergrid-support__emergency-title">24x7 Roadside & Charging Station Helpline</h3>
              <p className="powergrid-support__emergency-sub">
                Toll-free across Andhra Pradesh: <strong>1800-425-VOLT</strong> (1800-425-8658) · Emergency Response &lt; 15 mins
              </p>
            </div>
          </div>
          <button
            type="button"
            className="powergrid-support__emergency-cta"
            onClick={() => handleOpenTicketModal('Charging Issues')}
          >
            + Raise Ticket
          </button>
        </div>

        {/* Quick Help Category Cards */}
        <section className="powergrid-support__section">
          <div className="powergrid-support__section-header">
            <h2 className="powergrid-support__section-title">Quick Help Categories</h2>
            {selectedCategory && (
              <button
                type="button"
                className="powergrid-support__clear-cat-btn"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Category Filter ({selectedCategory})
              </button>
            )}
          </div>

          <div className="powergrid-support__categories-grid">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`powergrid-support__category-card ${
                    isSelected ? 'powergrid-support__category-card--active' : ''
                  }`}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCategory(isSelected ? null : cat.id);
                    }
                  }}
                >
                  <div className={`powergrid-support__cat-icon ${cat.iconClass}`}>
                    {cat.icon}
                  </div>
                  <h3 className="powergrid-support__cat-title">{cat.title}</h3>
                  <p className="powergrid-support__cat-desc">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Help / FAQ Accordion */}
        <section className="powergrid-support__section">
          <div className="powergrid-support__section-header">
            <div>
              <h2 className="powergrid-support__section-title">Frequently Asked Questions</h2>
              <p className="powergrid-support__section-sub">
                {selectedCategory
                  ? `Showing questions for ${selectedCategory}`
                  : 'Common questions regarding PowerGrid charging operations.'}
              </p>
            </div>
            <button
              type="button"
              className="powergrid-support__raise-ticket-btn"
              onClick={() => handleOpenTicketModal()}
              id="support-raise-ticket-trigger"
            >
              + Raise a Support Ticket
            </button>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="powergrid-support__faq-empty">
              <p className="powergrid-support__faq-empty-title">No matching help articles found</p>
              <p className="powergrid-support__faq-empty-sub">
                Can&apos;t find what you need? Raise a direct support ticket and our engineering team will assist.
              </p>
              <button
                type="button"
                className="powergrid-support__cta-small"
                onClick={() => handleOpenTicketModal()}
              >
                Raise a Support Ticket
              </button>
            </div>
          ) : (
            <div className="powergrid-support__faq-list">
              {filteredFAQs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`powergrid-support__faq-item ${
                      isOpen ? 'powergrid-support__faq-item--open' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="powergrid-support__faq-question-btn"
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="powergrid-support__faq-question">{faq.question}</span>
                      <span className="powergrid-support__faq-badge">{faq.category}</span>
                      <svg
                        className={`powergrid-support__faq-chevron ${
                          isOpen ? 'powergrid-support__faq-chevron--open' : ''
                        }`}
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="powergrid-support__faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Support Tickets Section */}
        <section className="powergrid-support__section">
          <div className="powergrid-support__section-header">
            <div>
              <h2 className="powergrid-support__section-title">My Support Tickets</h2>
              <p className="powergrid-support__section-sub">
                Track status, updates, and communications for your raised inquiries.
              </p>
            </div>
            <button
              type="button"
              className="powergrid-support__raise-ticket-btn"
              onClick={() => handleOpenTicketModal()}
            >
              + New Ticket
            </button>
          </div>

          {isLoadingTickets ? (
            <div className="powergrid-support__skeleton-tickets">
              <div className="powergrid-support__skeleton-card" />
              <div className="powergrid-support__skeleton-card" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="powergrid-support__no-tickets">
              <p className="powergrid-support__no-tickets-title">No support tickets created yet</p>
              <p className="powergrid-support__no-tickets-sub">
                If you encounter any station, wallet, or vehicle issue, raise a ticket to get direct engineering assistance.
              </p>
              <button
                type="button"
                className="powergrid-support__cta-small"
                onClick={() => handleOpenTicketModal()}
              >
                Create Your First Ticket
              </button>
            </div>
          ) : (
            <div className="powergrid-support__tickets-list">
              {tickets.map((t) => {
                const statusClass =
                  t.status === 'Resolved' || t.status === 'resolved' || t.status === 'Closed'
                    ? 'powergrid-support__ticket-badge--resolved'
                    : t.status === 'In Progress' || t.status === 'in_progress'
                    ? 'powergrid-support__ticket-badge--progress'
                    : 'powergrid-support__ticket-badge--open';

                return (
                  <div
                    key={t.id}
                    className="powergrid-support__ticket-card"
                    onClick={() => setViewingTicket(t)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setViewingTicket(t);
                      }
                    }}
                  >
                    <div className="powergrid-support__ticket-left">
                      <div className="powergrid-support__ticket-header-row">
                        <span className="powergrid-support__ticket-id">{t.id}</span>
                        <span className="powergrid-support__ticket-cat">{t.category}</span>
                      </div>
                      <h4 className="powergrid-support__ticket-subject">{t.subject}</h4>
                      <p className="powergrid-support__ticket-preview">{t.description}</p>
                    </div>

                    <div className="powergrid-support__ticket-right">
                      <span className={`powergrid-support__ticket-badge ${statusClass}`}>
                        {t.status}
                      </span>
                      <span className="powergrid-support__ticket-date">
                        Updated {t.lastUpdate || t.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Contact Information & Channels */}
        <section className="powergrid-support__channels">
          <div className="powergrid-support__channel-card">
            <div className="powergrid-support__channel-icon">📞</div>
            <h4 className="powergrid-support__channel-title">24x7 Roadside Phone</h4>
            <p className="powergrid-support__channel-desc">Toll Free: 1800-425-8658</p>
            <span className="powergrid-support__channel-badge">Immediate Response</span>
          </div>

          <div className="powergrid-support__channel-card">
            <div className="powergrid-support__channel-icon">✉️</div>
            <h4 className="powergrid-support__channel-title">Email Technical Support</h4>
            <p className="powergrid-support__channel-desc">support@powergrid-ev.in</p>
            <span className="powergrid-support__channel-badge">&lt; 2 Hours Reply</span>
          </div>

          <div className="powergrid-support__channel-card">
            <div className="powergrid-support__channel-icon">📍</div>
            <h4 className="powergrid-support__channel-title">Zone Operations Desk</h4>
            <p className="powergrid-support__channel-desc">Vijayawada Central Station</p>
            <span className="powergrid-support__channel-badge">On-site Technicians</span>
          </div>
        </section>

        {/* ================================================================ */}
        {/* RAISE TICKET MODAL */}
        {/* ================================================================ */}
        {isTicketModalOpen && (
          <div
            className="powergrid-support__modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSubmittingTicket) {
                handleCloseTicketModal();
              }
            }}
          >
            <div
              className="powergrid-support__modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-ticket-modal-title"
            >
              <div className="powergrid-support__modal-header">
                <h3 id="support-ticket-modal-title" className="powergrid-support__modal-title">
                  Raise a Support Ticket
                </h3>
                <button
                  type="button"
                  className="powergrid-support__modal-close"
                  onClick={handleCloseTicketModal}
                  disabled={isSubmittingTicket}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {createdTicketId ? (
                <div className="powergrid-support__modal-success">
                  <div className="powergrid-support__modal-success-icon">✓</div>
                  <h4 className="powergrid-support__modal-success-title">
                    Support Ticket Created Successfully!
                  </h4>
                  <p className="powergrid-support__modal-success-id">
                    Ticket ID: <strong>{createdTicketId}</strong>
                  </p>
                  <p className="powergrid-support__modal-success-sub">
                    Our technical support team has received your ticket and will provide updates directly in your portal.
                  </p>
                  <button
                    type="button"
                    className="powergrid-support__submit-btn"
                    onClick={handleCloseTicketModal}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="powergrid-support__form">
                  {ticketError && (
                    <div className="powergrid-support__form-error">{ticketError}</div>
                  )}

                  <div className="powergrid-support__field">
                    <label className="powergrid-support__label">Issue Category *</label>
                    <select
                      className="powergrid-support__select"
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      disabled={isSubmittingTicket}
                    >
                      <option value="Charging Issues">Charging Issues (Station not starting, slow, error)</option>
                      <option value="Charger / Station">Charger / Station (Hardware offline, blocked bay)</option>
                      <option value="Reservations">Reservations (Time slot, reschedule, cancellation)</option>
                      <option value="Wallet & Payments">Wallet & Payments (Auto-debit, recharge, invoice)</option>
                      <option value="Vehicles">Vehicles & Garage (Connector compatibility, sync)</option>
                      <option value="Account & Profile">Account & Profile (GSTIN, Phone number, alerts)</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="powergrid-support__field">
                    <label className="powergrid-support__label">Subject *</label>
                    <input
                      type="text"
                      className="powergrid-support__input"
                      placeholder="e.g. Charger stopped unexpectedly during 120kW session"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      disabled={isSubmittingTicket}
                      required
                    />
                  </div>

                  <div className="powergrid-support__grid-2">
                    <div className="powergrid-support__field">
                      <label className="powergrid-support__label">Station Name (Optional)</label>
                      <input
                        type="text"
                        className="powergrid-support__input"
                        placeholder="e.g. Vijayawada Central"
                        value={ticketStation}
                        onChange={(e) => setTicketStation(e.target.value)}
                        disabled={isSubmittingTicket}
                      />
                    </div>
                    <div className="powergrid-support__field">
                      <label className="powergrid-support__label">Charger / Gun ID (Optional)</label>
                      <input
                        type="text"
                        className="powergrid-support__input"
                        placeholder="e.g. CH-005"
                        value={ticketCharger}
                        onChange={(e) => setTicketCharger(e.target.value)}
                        disabled={isSubmittingTicket}
                      />
                    </div>
                  </div>

                  <div className="powergrid-support__field">
                    <label className="powergrid-support__label">Description *</label>
                    <textarea
                      rows={4}
                      className="powergrid-support__textarea"
                      placeholder="Please describe what happened, vehicle SoC percentage, transaction ID, or error message..."
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      disabled={isSubmittingTicket}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="powergrid-support__submit-btn"
                    disabled={isSubmittingTicket}
                    id="support-submit-ticket-btn"
                  >
                    {isSubmittingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* VIEW TICKET DETAILS & REPLY MODAL */}
        {/* ================================================================ */}
        {viewingTicket && (
          <div
            className="powergrid-support__modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setViewingTicket(null);
              }
            }}
          >
            <div
              className="powergrid-support__modal powergrid-support__modal--large"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ticket-detail-title"
            >
              <div className="powergrid-support__modal-header">
                <div>
                  <span className="powergrid-support__modal-subtitle">{viewingTicket.id} · {viewingTicket.category}</span>
                  <h3 id="ticket-detail-title" className="powergrid-support__modal-title">
                    {viewingTicket.subject}
                  </h3>
                </div>
                <button
                  type="button"
                  className="powergrid-support__modal-close"
                  onClick={() => setViewingTicket(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Status Header */}
              <div className="powergrid-support__ticket-status-bar">
                <div className="powergrid-support__status-info">
                  <span>Status:</span>
                  <span className="powergrid-support__status-badge-inline">
                    {viewingTicket.status}
                  </span>
                </div>
                <button
                  type="button"
                  className="powergrid-support__resolve-btn"
                  onClick={handleToggleResolve}
                >
                  {viewingTicket.status === 'Resolved' || viewingTicket.status === 'Closed'
                    ? 'Reopen Ticket'
                    : 'Mark as Resolved'}
                </button>
              </div>

              {/* Conversation Messages */}
              <div className="powergrid-support__conversation">
                {(viewingTicket.replies || [
                  {
                    id: 'orig',
                    sender: 'customer',
                    message: viewingTicket.description || viewingTicket.subject,
                    timestamp: viewingTicket.createdAt,
                  },
                ]).map((rep) => (
                  <div
                    key={rep.id}
                    className={`powergrid-support__chat-bubble ${
                      rep.sender === 'customer'
                        ? 'powergrid-support__chat-bubble--customer'
                        : 'powergrid-support__chat-bubble--support'
                    }`}
                  >
                    <div className="powergrid-support__chat-sender">
                      <strong>{rep.sender === 'customer' ? 'You' : 'PowerGrid Technical Support'}</strong>
                      <span>{rep.timestamp}</span>
                    </div>
                    <p className="powergrid-support__chat-msg">{rep.message}</p>
                  </div>
                ))}
              </div>

              {/* Customer Reply Form */}
              <form onSubmit={handleSendReply} className="powergrid-support__reply-form">
                <input
                  type="text"
                  className="powergrid-support__reply-input"
                  placeholder="Type a message or response to technical support..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSubmittingReply}
                />
                <button
                  type="submit"
                  className="powergrid-support__reply-btn"
                  disabled={isSubmittingReply || !replyText.trim()}
                >
                  {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
export default Support;
