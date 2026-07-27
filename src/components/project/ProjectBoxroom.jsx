import SectionLabel from './SectionLabel';

export default function ProjectBoxroom({ data }) {
  const { boxroom } = data;
  const gallery = boxroom.gallery?.filter(Boolean) ?? [];
  return (
    <section className="easton-section easton-section--dark">
      <SectionLabel>{boxroom.label}</SectionLabel>
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
    </section>
  );
}
