import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';

export default function ProjectStandards({ data }) {
  const { standards } = data;
  return (
    <section id={standards.id ?? `${data.slug}-standards`} className="easton-section easton-section--dark">
      <div className="easton-split easton-split--top">
        <div>
          <SectionLabel>{standards.label}</SectionLabel>
          <h2 className="easton-h2">{standards.title}</h2>
        </div>
        <p className="easton-body">{standards.text}</p>
      </div>
      <div className="easton-standards-grid">
        <MediaCard image={standards.cards[0].image} title={standards.cards[0].title} tall />
        <div className="easton-standards-grid__stack">
          {standards.cards.slice(1).map((c) => (
            <MediaCard key={c.title} image={c.image} title={c.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
