import { useI18n } from '../../i18n/I18nContext';

export default function ProjectYard({ data }) {
  const { t } = useI18n();
  const { yard } = data;
  return (
    <section className="easton-yard">
      {/* Широкий кадр на узком экране обрезался бы до центральной трети,
          поэтому для мобильного берём отдельный вертикальный кроп — как в hero. */}
      <picture>
        {yard.imageMobile && <source media="(max-width: 900px)" srcSet={yard.imageMobile} />}
        <img
          className="easton-yard__bg"
          src={yard.image}
          alt=""
          loading="lazy"
          decoding="async"
          style={yard.imagePosition ? { objectPosition: yard.imagePosition } : undefined}
        />
      </picture>
      <div className="easton-yard__overlay" />
      <div className="easton-yard__content">
        <div className="easton-yard__label">{yard.labelKey ? t(yard.labelKey) : yard.label || t('project.label.yard')}</div>
        <h2>{yard.title}</h2>
        {yard.text && <p className="easton-yard__text">{yard.text}</p>}
        {yard.features && yard.features.length > 0 && (
          <ul className="easton-yard__features">
            {yard.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
