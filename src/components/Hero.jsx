import { useCallback, useState } from 'react';
import AutoTradeInPopup from './AutoTradeInPopup';
import { useI18n } from '../i18n/I18nContext';
import { homeSectionHref } from '../utils/navigation';

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
        {/* Иллюстрация собрана из слоёв, а не запечена в картинку: заголовок и
            кнопка на карточке переводятся на три языка. */}
        <div className="hero__trade-art" aria-hidden="true">
          <img className="hero__trade-building" src="/images/auto-trade-in/building.webp" alt="" />
          <span className="hero__trade-building-fade" />
          <img className="hero__trade-refresh" src="/images/auto-trade-in/refresh.svg" alt="" />
          <img className="hero__trade-car" src="/images/auto-trade-in/car.webp" alt="" />
          <span className="hero__trade-car-fade" />
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
