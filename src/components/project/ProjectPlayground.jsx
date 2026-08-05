export default function ProjectPlayground({ data, onRequestConsult }) {
  const { playground } = data;
  return (
    <section className="easton-section easton-section--cream easton-playground">
      <div className="easton-playground__text">
        <h2 className="easton-h2 easton-h2--dark">{playground.title}</h2>
        <p className="easton-body easton-body--dark">{playground.text}</p>
        <button type="button" className="easton-btn easton-btn--solid" onClick={onRequestConsult}>
          {playground.cta}
        </button>
      </div>
      <div className="easton-playground__image">
        <img src={playground.image} alt="" />
      </div>
    </section>
  );
}
