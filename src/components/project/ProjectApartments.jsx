import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectApartments({ data, onRequestConsult }) {
  const { t } = useI18n();
  const { apartments } = data;
  return (
    <section id={apartments.id} className="easton-section easton-section--dark">
      <div className="easton-split easton-split--top">
        <div>
          <SectionLabel>{apartments.labelKey ? t(apartments.labelKey) : t('project.label.apartments')}</SectionLabel>
          <h2 className="easton-h2">{apartments.title}</h2>
        </div>
        <p className="easton-body">{apartments.text}</p>
      </div>
      <div className="easton-apartments__image">
        <img
          src={apartments.image}
          alt=""
          loading="lazy"
          decoding="async"
          style={apartments.imagePosition ? { objectPosition: apartments.imagePosition } : undefined}
        />
        <button type="button" className="easton-btn easton-btn--light" onClick={onRequestConsult}>
          {t('project.apartments.cta')}
        </button>
      </div>
      <div className="easton-feature-row">
        {apartments.features.map((f) => (
          <div key={f}>{f}</div>
        ))}
      </div>
    </section>
  );
}
