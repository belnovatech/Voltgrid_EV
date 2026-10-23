import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationService, EVStation } from '../../../services/stationService';
import { walletService } from '../../../services/walletService';
import './EwayAIAssistant.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: Array<{ label: string; onClick: () => void; primary?: boolean }>;
}

export const EwayAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [stations, setStations] = useState<EVStation[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(1250);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: 'Hi there! I am your Eway AI Copilot. Ask me about charging stations, session tariffs, wallet recharges, or battery optimization tips.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    stationService.getStations().then((st) => setStations(st)).catch(() => {});
    try {
      setWalletBalance(walletService.getBalance());
    } catch {}
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '⚡ Find nearest 60kW+ charger',
    '💰 Calculate 25 kWh charging cost',
    '💳 Wallet balance & GST receipt info',
    '🔋 Optimal charging battery tips',
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAIResponse(query);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 450);
  };

  const generateAIResponse = (query: string): Message => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Station or charger query
    if (q.includes('station') || q.includes('charger') || q.includes('find') || q.includes('nearest') || q.includes('fast')) {
      const available = stations.filter((s) => s.status === 'available' || s.availableChargers > 0);
      const topStation = available[0] || stations[0];

      if (topStation) {
        return {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `Found ${available.length} active high-speed stations on the Eway Supergrid. Recommended: "${topStation.name}" located at ${topStation.address}. It features ${topStation.connectorType} (${topStation.powerKw}kW) with ${topStation.availableChargers} guns ready for instant plug-in.`,
          timestamp: time,
          actions: [
            {
              label: 'View Live Stations',
              onClick: () => {
                setIsOpen(false);
                navigate('/customer/chargers');
              },
              primary: true,
            },
          ],
        };
      }
      return {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: 'The Eway Network currently operates 80+ fast chargers across Vijayawada, Guntur, Vizag, and Tirupati with dual-gun CCS2 & Type 2 connectivity.',
        timestamp: time,
        actions: [{ label: 'Browse Network Map', onClick: () => { setIsOpen(false); navigate('/customer/chargers'); }, primary: true }],
      };
    }

    // 2. Cost / Tariff calculation query
    if (q.includes('cost') || q.includes('tariff') || q.includes('price') || q.includes('calculate') || q.includes('kwh')) {
      const matchKwh = q.match(/(\d+)\s*kwh/i);
      const units = matchKwh ? parseInt(matchKwh[1], 10) : 25;
      const baseRate = 18.5;
      const energyCharge = units * baseRate;
      const gst = energyCharge * 0.18;
      const total = energyCharge + gst;

      return {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Tariff Breakdown for ${units} kWh:\n• Base Energy: ₹${energyCharge.toFixed(2)} (@ ₹${baseRate}/kWh)\n• GST (18%): ₹${gst.toFixed(2)}\n• Net Payable: ₹${total.toFixed(2)}\nZero convenience fees applied when paying via Eway Smart Wallet.`,
        timestamp: time,
        actions: [
          {
            label: 'Check Eway Wallet',
            onClick: () => {
              setIsOpen(false);
              navigate('/customer/wallet');
            },
            primary: true,
          },
        ],
      };
    }

    // 3. Wallet / GST receipt / Payment query
    if (q.includes('wallet') || q.includes('recharge') || q.includes('gst') || q.includes('receipt') || q.includes('invoice') || q.includes('payment') || q.includes('balance')) {
      return {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Your current verified Eway Wallet balance is ₹${walletBalance.toLocaleString('en-IN')}. Every recharge and charging session automatically generates a GST-compliant tax invoice. You can download PDF invoices anytime directly from your Wallet transaction ledger.`,
        timestamp: time,
        actions: [
          {
            label: 'Open Customer Wallet',
            onClick: () => {
              setIsOpen(false);
              navigate('/customer/wallet');
            },
            primary: true,
          },
        ],
      };
    }

    // 4. Battery / Optimal charging tips
    if (q.includes('battery') || q.includes('tip') || q.includes('health') || q.includes('80') || q.includes('range')) {
      return {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Battery Optimization Tip:\n1. Keep daily charging between 20% to 80% to preserve lithium-ion cathode health.\n2. Eway supports automated 80% charge cutoffs in your vehicle preferences.\n3. Pre-condition your EV battery during extreme weather before initiating high-speed 120kW DC sessions.`,
        timestamp: time,
        actions: [
          {
            label: 'Adjust Battery Limits in Settings',
            onClick: () => {
              setIsOpen(false);
              navigate('/customer/settings');
            },
          },
        ],
      };
    }

    // Default Fallback
    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: `I can help you locate chargers, compute charging costs, navigate wallet payments, or guide your EV setup. Would you like to check available chargers or your wallet?`,
      timestamp: time,
      actions: [
        {
          label: 'Find Chargers',
          onClick: () => {
            setIsOpen(false);
            navigate('/customer/chargers');
          },
          primary: true,
        },
        {
          label: 'Open Wallet',
          onClick: () => {
            setIsOpen(false);
            navigate('/customer/wallet');
          },
        },
      ],
    };
  };

  return (
    <aside className="eway-ai-assistant" aria-label="Eway AI Assistant">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className="eway-ai-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Eway AI Copilot"
          id="eway-ai-copilot-trigger"
        >
          <div className="eway-ai-launcher__icon-wrap">
            <span className="eway-ai-launcher__pulse-ring" aria-hidden="true" />
            <svg
              className="eway-ai-launcher__icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="eway-ai-launcher__text">Ask Eway AI</span>
          <span className="eway-ai-launcher__badge">Copilot</span>
        </button>
      )}

      {/* Floating Glassmorphic Chat Window */}
      {isOpen && (
        <div className="eway-ai-window" role="dialog" aria-modal="true" aria-label="Eway AI Copilot Dialog">
          {/* Header */}
          <div className="eway-ai-window__header">
            <div className="eway-ai-window__brand">
              <div className="eway-ai-window__avatar">
                <img src="/eway-logo.png" alt="Eway to Your EVs" />
              </div>
              <div className="eway-ai-window__title-box">
                <div className="eway-ai-window__title-row">
                  <h3 className="eway-ai-window__title">Eway AI Copilot</h3>
                  <span className="eway-ai-window__status-pill">Active</span>
                </div>
                <p className="eway-ai-window__subtitle">EV Intelligence & Telemetry Core</p>
              </div>
            </div>

            <div className="eway-ai-window__controls">
              <button
                type="button"
                className="eway-ai-window__close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Telemetry Banner */}
          <div className="eway-ai-window__telemetry-bar">
            <span className="eway-ai-window__telemetry-dot" />
            <span>Connected to Eway Grid · Real-time Tariffs & Station Status</span>
          </div>

          {/* Messages Body */}
          <div className="eway-ai-window__messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`eway-ai-msg eway-ai-msg--${m.sender}`}
              >
                {m.sender === 'ai' && (
                  <div className="eway-ai-msg__avatar" aria-hidden="true">
                    ⚡
                  </div>
                )}
                <div className="eway-ai-msg__content">
                  <p className="eway-ai-msg__text">{m.text}</p>
                  {m.actions && m.actions.length > 0 && (
                    <div className="eway-ai-msg__actions">
                      {m.actions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`eway-ai-msg__action-btn ${
                            act.primary ? 'eway-ai-msg__action-btn--primary' : ''
                          }`}
                          onClick={act.onClick}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="eway-ai-msg__time">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="eway-ai-msg eway-ai-msg--ai">
                <div className="eway-ai-msg__avatar" aria-hidden="true">⚡</div>
                <div className="eway-ai-msg__typing">
                  <span className="eway-ai-typing-dot" />
                  <span className="eway-ai-typing-dot" />
                  <span className="eway-ai-typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="eway-ai-window__quick-prompts">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="eway-ai-window__prompt-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            className="eway-ai-window__footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="eway-ai-window__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about fast chargers, cost, wallet, tariffs..."
              aria-label="Type message to Eway AI"
            />
            <button
              type="submit"
              className="eway-ai-window__send-btn"
              disabled={!inputValue.trim()}
              aria-label="Send query"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
export default EwayAIAssistant;
