import { useI18n } from '../i18n/I18nContext';

export default function NotFoundPage({ onGoHome }) {
  const { t } = useI18n();

  return (
    <div className="page not-found">
      <div className="not-found__inner">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">{t('404.title')}</h2>
        <p className="not-found__text">{t('404.text')}</p>
        <button type="button" className="btn-primary" onClick={onGoHome}>
          {t('404.home')}
        </button>
      </div>
    </div>
  );
}
