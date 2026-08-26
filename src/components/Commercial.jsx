import { useI18n } from '../i18n/I18nContext';

const COMMERCIAL_ITEMS = [
  {
    key: 'parking',
    image: '/images/commercial-parking.webp',
  },
  {
    key: 'storage',
    image: '/images/commercial-storage.webp',
  },
  {
    key: 'space',
    image: '/images/commercial-space.webp',
  },
];

export default function Commercial() {
  const { t } = useI18n();

  return (
    <section className="section commercial">
      <h2 className="section-title commercial__title">{t('commercial.title')}</h2>
      <div className="commercial-grid">
        {COMMERCIAL_ITEMS.map((c) => {
          const title = t(`commercial.${c.key}.title`);
          return (
            <div key={c.key} className="commercial-item">
              <div className="commercial-item__title">{title}</div>
              <div className="commercial-item__meta">
                <span>{t(`commercial.${c.key}.meta0`)}</span>
                <span>{t(`commercial.${c.key}.meta1`)}</span>
              </div>
              <div className="commercial-item__media">
                <img src={c.image} alt={title} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
