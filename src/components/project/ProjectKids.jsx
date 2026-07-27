import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';

export default function ProjectKids({ data }) {
  const { kids } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  return (
    <section className="easton-section easton-section--cream">
      <SectionLabel color={accentDark}>{kids.label}</SectionLabel>
      <div className={`easton-kids__grid easton-kids__grid--${kids.gallery.length}`}>
        {kids.gallery.map((g, i) => (
          <MediaCard key={i} image={g.image} title={g.title} />
        ))}
      </div>
      <div className="easton-kids__room">
        <div className="easton-kids__room-label">{kids.roomLabel}</div>
        <div>
          <h3 className="easton-h2 easton-h2--dark">{kids.roomTitle}</h3>
          <p className="easton-body easton-body--dark">{kids.roomText}</p>
        </div>
      </div>
      {kids.roomImage && (
        <div className="easton-kids__room-image">
          <img src={kids.roomImage} alt={kids.roomImageAlt ?? ''} />
        </div>
      )}
    </section>
  );
}
