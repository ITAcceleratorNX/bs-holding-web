import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectBoxroom({ data }) {
  const { t } = useI18n();
  const { boxroom } = data;
  const gallery = boxroom.gallery?.filter(Boolean) ?? [];
  const items = boxroom.items?.filter(Boolean) ?? [];
  return (
    <section className="easton-section easton-section--dark">
      <SectionLabel>{boxroom.label || t('project.label.boxroom')}</SectionLabel>
      <h2 className="easton-h2">{boxroom.title}</h2>
      {gallery.length > 0 ? (
        <div className="easton-boxroom__gallery">
          {gallery.map((g) => (
            <div key={g.image} className="easton-boxroom__image">
              <img src={g.image} alt={g.alt ?? ''} />
            </div>
          ))}
        </div>
      ) : (
        <div className="easton-boxroom__image">
          <img src={boxroom.image} alt="" />
        </div>
      )}
      <p className="easton-body">{boxroom.text}</p>
      {items.length > 0 && (
        <div className="easton-boxroom__items">
          {items.map((item) => (
            <div key={item.title} className="easton-boxroom__item">
              <div className="easton-boxroom__item-title">{item.title}</div>
              <p className="easton-body">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
