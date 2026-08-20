import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectLocation({ data, onOpenCalc }) {
  const { t } = useI18n();
  const { location } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  return (
    <section id={location.id} className="easton-section easton-section--cream">
      <SectionLabel color={accentDark}>{t('project.label.location')}</SectionLabel>
      <h2 className="easton-h2 easton-h2--dark easton-location__title">{location.title}</h2>
      {location.text && (
        <p className="easton-body easton-body--dark" style={{ marginTop: 16, marginBottom: 24 }}>
          {location.text}
        </p>
      )}
      {location.mapImage && (
        <div className="easton-arch__image easton-location__map">
          <img
            src={location.mapImage}
            alt={location.title.replace(/\n/g, ' ')}
            loading="lazy"
            decoding="async"
            style={location.mapPosition ? { objectPosition: location.mapPosition } : undefined}
          />
        </div>
      )}
      <div className={`easton-location__cards${location.cards.length > 3 ? ' easton-location__cards--four' : ''}`}>
        {location.cards.map((c) => (
          <MediaCard key={c.title} {...c} />
        ))}
      </div>
      <div className="easton-location__notes">
        {location.notes.map((n) => (
          <p key={n} className="easton-body easton-body--dark">
            {n}
          </p>
        ))}
      </div>
      {onOpenCalc && (
        <div className="easton-banner">
          <div>{t('project.location.cta').replace('{name}', data.name)}</div>
          <button type="button" className="easton-btn easton-btn--light" onClick={onOpenCalc}>
            {t('project.location.calc')}
          </button>
        </div>
      )}
    </section>
  );
}
