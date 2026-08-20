import { useI18n } from '../i18n/I18nContext';

export default function Paida({ onOpenCall }) {
  const { t } = useI18n();

  return (
    <section id="paida" className="section paida">
      <h2 className="section-title paida__title">{t('paida.title')}</h2>
      <div className="paida__media">
        <img src="/images/paida-family.webp" alt={t('paida.alt')} />
      </div>
      <div className="paida__body">
        <h3 className="paida__subtitle">{t('paida.subtitle')}</h3>
        <div className="paida__cols">
          <p>{t('paida.p1')}</p>
          <p>{t('paida.p2')}</p>
          <button type="button" className="btn-primary paida__cta" onClick={onOpenCall}>
            {t('paida.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
