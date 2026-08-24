import { useI18n } from '../i18n/I18nContext';
import { homeSectionHref } from '../utils/navigation';

export default function Hero() {
  const { t } = useI18n();

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

      <div className="hero__paida">
        <img
          className="hero__paida-img"
          src="/images/paida-card-ref.webp"
          alt={t('hero.paidaAlt')}
        />
        <a href={homeSectionHref('paida')} className="hero__paida-btn" aria-label={t('hero.paidaMore')} />
      </div>
    </section>
  );
}
