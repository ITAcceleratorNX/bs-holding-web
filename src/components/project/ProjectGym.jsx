import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';

export default function ProjectGym({ data }) {
  const { gym } = data;
  if (!gym) return null;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  return (
    <section className="easton-section easton-section--cream">
      <div className="easton-gym">
        <div className="easton-gym__intro">
          <SectionLabel color={accentDark}>{gym.label}</SectionLabel>
          <h2 className="easton-h2 easton-h2--dark">{gym.title}</h2>
          {gym.text && <p className="easton-body easton-body--dark">{gym.text}</p>}
        </div>

        <div className="easton-gym__main">
          <img src={gym.image} alt="" />
        </div>

        {gym.gallery?.length > 0 && (
          <div className="easton-gym__grid">
            {gym.gallery.map((g, i) => (
              <MediaCard key={i} image={g.image} title={g.title} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
