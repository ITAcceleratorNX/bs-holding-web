export default function ProjectHero({ data, onScrollToConsult, onOpenCatalog }) {
  const mobile = data.hero.imageMobile;
  return (
    <section className="easton-hero">
      <picture>
        {mobile && <source media="(max-width: 768px)" srcSet={mobile} />}
        <img className="easton-hero__bg" src={data.hero.image} alt="" />
      </picture>
      <div className="easton-hero__overlay" />
      <div className="easton-hero__content">
        <h1>{data.hero.title}</h1>
        <p className="easton-hero__city">{data.hero.location}</p>
        {data.hero.tagline && <p className="easton-hero__tagline">{data.hero.tagline}</p>}
        <div className="easton-hero__cta">
          <button type="button" className="easton-btn easton-btn--solid" onClick={onScrollToConsult}>
            Оставить заявку
          </button>
          <button type="button" className="easton-btn easton-btn--ghost" onClick={onOpenCatalog}>
            Скачать презентацию
          </button>
        </div>
      </div>
    </section>
  );
}
