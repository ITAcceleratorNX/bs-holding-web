export default function ProjectYard({ data }) {
  const { yard } = data;
  return (
    <section className="easton-yard">
      <img
        className="easton-yard__bg"
        src={yard.image}
        alt=""
        loading="lazy"
        decoding="async"
        style={yard.imagePosition ? { objectPosition: yard.imagePosition } : undefined}
      />
      <div className="easton-yard__overlay" />
      <div className="easton-yard__content">
        <div className="easton-yard__label">{yard.label}</div>
        <h2>{yard.title}</h2>
        {yard.text && <p className="easton-yard__text">{yard.text}</p>}
      </div>
    </section>
  );
}
