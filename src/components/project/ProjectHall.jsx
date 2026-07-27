import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';

export default function ProjectHall({ data }) {
  const { hall } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  const galleryCount = hall.gallery?.length ?? 0;

  return (
    <section className="easton-section easton-section--cream">
      <div className="easton-hall">
        <div className="easton-hall__intro">
          <SectionLabel color={accentDark}>{hall.label}</SectionLabel>
          <h2 className="easton-h2 easton-h2--dark">{hall.title}</h2>
          {hall.text1 && <p className="easton-body easton-body--dark">{hall.text1}</p>}
          {hall.text2 && <p className="easton-body easton-body--dark">{hall.text2}</p>}
        </div>

        <div className="easton-hall__image">
          <img src={hall.image} alt="" />
        </div>

        {galleryCount > 0 && (
          <div
            className="easton-hall__gallery"
            style={{ '--hall-gallery-cols': Math.min(galleryCount, 4) }}
          >
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
      </div>
    </section>
  );
}
