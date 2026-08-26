import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectApartments({ data, onRequestConsult }) {
  const { t } = useI18n();
  const { apartments } = data;
  const portrait = apartments.imageFit === 'portrait';
  const label = apartments.labelKey
    ? t(apartments.labelKey)
    : apartments.label || t('project.label.apartments');

  return (
    <section id={apartments.id} className="easton-section easton-section--dark">
      <div className={`easton-apartments${portrait ? ' easton-apartments--portrait' : ''}`}>
        <div className="easton-apartments__copy">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="easton-h2">{apartments.title}</h2>
          <p className="easton-body">{apartments.text}</p>
          {apartments.features?.length > 0 && (
            <ul className="easton-feature-list">
              {apartments.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          <button type="button" className="easton-btn easton-btn--light" onClick={onRequestConsult}>
            {apartments.cta || t('project.apartments.cta')}
          </button>
        </div>
        <div className="easton-apartments__image">
          <img
            src={apartments.image}
            alt=""
            loading="lazy"
            decoding="async"
            style={apartments.imagePosition ? { objectPosition: apartments.imagePosition } : undefined}
          />
        </div>
      </div>
    </section>
  );
}
