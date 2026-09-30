import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchHero.css';

interface SearchHeroProps {
  onSearch?: (query: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (onSearch) {
      onSearch(query);
    } else {
      if (query) {
        navigate(`/customer/chargers?q=${encodeURIComponent(query)}`);
      } else {
        navigate('/customer/chargers');
      }
    }
  };

  return (
    <section className="pg-shero" aria-label="Find Charging Station">
      <div className="pg-shero__bg-decoration" aria-hidden="true">
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="100" r="80" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5" />
          <circle cx="250" cy="100" r="130" stroke="rgba(154, 230, 0, 0.05)" strokeWidth="1.5" />
          <circle cx="250" cy="100" r="180" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="pg-shero__content">
        <span className="pg-shero__tag">FIND YOUR NEXT CHARGE</span>
        <h2 className="pg-shero__heading">Where to charge?</h2>

        <form onSubmit={handleSubmit} className="pg-shero__form" role="search">
          <div className="pg-shero__input-box">
            <svg
              className="pg-shero__search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search station, city or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pg-shero__input"
              aria-label="Search station, city or area"
            />
          </div>

          <button type="submit" className="pg-shero__btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Find</span>
          </button>
        </form>
      </div>
    </section>
  );
};
