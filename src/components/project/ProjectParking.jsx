import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectParking({ data, onOpenCatalog }) {
  const { t } = useI18n();
  const { parking } = data;
  return (
    <section className="easton-section easton-section--dark">
      <SectionLabel>{t('project.label.parking')}</SectionLabel>
      <h2 className="easton-h2">{parking.title}</h2>
      <div className="easton-parking">
        <div className="easton-parking__image">
          <img src={parking.image} alt="" />
        </div>
        <div className="easton-parking__text">
          {parking.points.map((p) => (
            <div key={p} className="easton-parking__point">
              {p}
            </div>
          ))}
          <p className="easton-body">{parking.note}</p>
          {onOpenCatalog && (
            <button type="button" className="easton-btn easton-btn--light easton-parking__catalog" onClick={onOpenCatalog}>
              {t('project.parking.catalog')}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
