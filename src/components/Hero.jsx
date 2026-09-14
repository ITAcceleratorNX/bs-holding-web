import { useCallback, useState } from 'react';
import AutoTradeInPopup from './AutoTradeInPopup';
import { useI18n } from '../i18n/I18nContext';
import { homeSectionHref } from '../utils/navigation';

const TRADE_RING_RADII = [70, 110, 155, 205, 260];

export default function Hero() {
  const { t } = useI18n();
  const [tradeOpen, setTradeOpen] = useState(false);
  const openTrade = useCallback(() => setTradeOpen(true), []);
  const closeTrade = useCallback(() => setTradeOpen(false), []);

  return (
    <section id="top" className="hero">
      <div className="hero__main">
        <img
          className="hero__bg"
          src="/images/hero-bs-towers.webp"
          alt={t('hero.alt')}
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">{t('hero.title')}</h1>
          <a href={homeSectionHref('catalog')} className="btn-white hero__cta">
            {t('hero.cta')}
          </a>
        </div>
      </div>

      <div className="hero__trade">
        <svg
          className="hero__trade-circles"
          viewBox="0 0 400 540"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <filter id="tradeSoftBlob" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <circle
            cx="400"
            cy="250"
            r="120"
            fill="var(--trade-blob)"
            fillOpacity="0.9"
            filter="url(#tradeSoftBlob)"
          />
          {TRADE_RING_RADII.map((radius) => (
            <circle
              key={radius}
              cx="400"
              cy="250"
              r={radius}
              stroke="var(--trade-ring)"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        <div className="hero__trade-art" aria-hidden="true">
          <img
            className="hero__trade-building"
            src="/images/auto-trade-in/building.webp"
            alt=""
            draggable={false}
          />
          <img
            className="hero__trade-refresh"
            src="/images/auto-trade-in/refresh.svg"
            alt=""
            draggable={false}
          />
          <img
            className="hero__trade-car"
            src="/images/auto-trade-in/car.webp"
            alt=""
            draggable={false}
          />
        </div>

        <div className="hero__trade-text">
          <div className="hero__trade-title">{t('tradein.card.title')}</div>
          <div className="hero__trade-sub">{t('tradein.card.sub')}</div>
        </div>

        <button type="button" className="hero__trade-btn" onClick={openTrade}>
          {t('tradein.card.cta')}
        </button>
      </div>

      <AutoTradeInPopup open={tradeOpen} onClose={closeTrade} />
    </section>
  );
}
