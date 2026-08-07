import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';

export default function ProjectLocation({ data, onOpenCalc }) {
  const { location } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  return (
    <section id={location.id} className="easton-section easton-section--cream">
      <SectionLabel color={accentDark}>{location.label}</SectionLabel>
      <h2 className="easton-h2 easton-h2--dark easton-location__title">{location.title}</h2>
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
          <div>Хотите узнать стоимость квартиры в {data.name}?</div>
          <button type="button" className="easton-btn easton-btn--light" onClick={onOpenCalc}>
            Получить расчет
          </button>
        </div>
      )}
    </section>
  );
}
