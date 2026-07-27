import SectionLabel from './SectionLabel';

export default function ProjectParking({ data, onOpenCatalog }) {
  const { parking } = data;
  return (
    <section className="easton-section easton-section--dark">
      <SectionLabel>{parking.label}</SectionLabel>
      <h2 className="easton-h2">{parking.title}</h2>
      <div className="easton-parking">
        <div className="easton-parking__image">
          <img src={parking.image} alt="" />
        </div>
        <div className="easton-parking__text">
          {parking.points.map((p) => (
            <div key={p} className="easton-parking__point">
              {p}
            </div>
          ))}
          <p className="easton-body">{parking.note}</p>
          {onOpenCatalog && (
            <button type="button" className="easton-btn easton-btn--light easton-parking__catalog" onClick={onOpenCatalog}>
              Скачать каталог
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
