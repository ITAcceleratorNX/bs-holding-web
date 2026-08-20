import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectHall({ data }) {
  const { t } = useI18n();
  const { hall } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';

  return (
    <section id={hall.id} className="easton-section easton-section--cream easton-hall-section">
      <div className="easton-hall">
        <div className="easton-hall__text">
          <SectionLabel color={accentDark}>{hall.labelKey ? t(hall.labelKey) : t('project.label.hall')}</SectionLabel>
          <h2 className="easton-h2 easton-h2--dark">{hall.title}</h2>
          <p className="easton-body easton-body--dark">{hall.text1}</p>
          {hall.text2 ? <p className="easton-body easton-body--dark">{hall.text2}</p> : null}
        </div>
        <div className="easton-hall__image">
          <img src={hall.image} alt="" />
        </div>
      </div>
      {hall.gallery?.length > 0 && (
        <div className={`easton-kids__grid easton-kids__grid--${hall.gallery.length}`} style={{ marginTop: 32 }}>
          {hall.gallery.map((g, i) => (
            <MediaCard key={i} image={g.image} title={g.title} />
          ))}
        </div>
      )}
      {hall.features?.length > 0 && (
        <div className="easton-hall__features">
          {hall.features.map((f) => (
            <div key={f}>{f}</div>
          ))}
        </div>
      )}
    </section>
  );
}
