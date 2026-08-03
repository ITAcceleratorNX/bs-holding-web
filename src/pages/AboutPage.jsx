import { useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ABOUT } from '../data/about';
import { CITIES, PROJECTS } from '../data/projects';
import { fmt } from '../utils/format';

const ALL = 'Все';
const CITY_FILTERS = [ALL, ...CITIES];

function Lines({ text }) {
  return text.split('\n').map((line) => (
    <span key={line}>
      {line}
      <br />
    </span>
  ));
}

export default function AboutPage({
  headerCity,
  setHeaderCity,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  closeMenu,
  onOpenCall,
  onOpenProject,
  onGoHome,
}) {
  const [city, setCity] = useState(ALL);
  const { hero, intro, history, quality, projects, contribution, cta } = ABOUT;

  // Выбор города в шапке переключает и подборку проектов на этой странице.
  // Синхронизация только на смену города: при первом заходе показываем все ЖК,
  // а не проекты города по умолчанию.
  const syncedCity = useRef(headerCity);
  if (syncedCity.current !== headerCity) {
    syncedCity.current = headerCity;
    setCity(headerCity);
  }

  const filtered = useMemo(
    () => (city === ALL ? PROJECTS : PROJECTS.filter((p) => p.city === city)),
    [city],
  );

  const scrollToProjects = () => {
    document.getElementById('about-projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header
        showTopBar={false}
        overlay
        activeNav="О компании"
        headerCity={headerCity}
        setHeaderCity={setHeaderCity}
        langCur={langCur}
        setLangCur={setLangCur}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
        onOpenCall={onOpenCall}
        onLogoClick={onGoHome}
      />

      <div className="about-page">
        <section className="about-hero">
          <img className="about-hero__bg" src={hero.image} alt="" />
          <div className="about-hero__overlay" />
          <div className="about-hero__content">
            <h1 className="about-hero__title">
              <Lines text={hero.title} />
            </h1>
            <p className="about-hero__subtitle">{hero.subtitle}</p>
            <button type="button" className="about-hero__cta" onClick={scrollToProjects}>
              {hero.cta}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <section className="about-section about-section--dark">
          <div className="about-shell">
            <div className="about-intro">
              <h2 className="about-intro__title">{intro.title}</h2>
              <p className="about-intro__text">{intro.text}</p>

              <div className="about-stats">
                <div className="about-stats__highlight">
                  <div className="about-stats__value">{intro.highlight.value}</div>
                  <div className="about-stats__label">{intro.highlight.label}</div>
                </div>
                <div className="about-stats__grid">
                  {intro.stats.map((stat) => (
                    <div key={stat.label} className="about-stats__card">
                      <div className="about-stats__value">{stat.value}</div>
                      <div className="about-stats__label">
                        <Lines text={stat.label} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="about-city-shots">
                {intro.cities.map((item) => (
                  <article key={item.name} className="about-city-shot">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="about-history">
              <h2 className="about-title about-title--light">{history.title}</h2>
              <div className="about-history__timeline" aria-hidden="true">
                {history.items.map((item) => (
                  <span key={item.year} className="about-history__node" />
                ))}
              </div>
              <div className="about-history__grid">
                {history.items.map((item) => (
                  <article key={item.year} className="about-history__card">
                    <div className="about-history__media">
                      <img src={item.image} alt="" />
                    </div>
                    <div className="about-history__year">{item.year}</div>
                    <h3 className="about-history__card-title">{item.title}</h3>
                    <p className="about-history__card-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-section--light">
          <div className="about-shell">
            <div className="about-quality__head">
              <h2 className="about-title">{quality.title}</h2>
              <p className="about-lead">{quality.text}</p>
            </div>
            <div className="about-quality__grid">
              {quality.features.map((feature) => (
                <div key={feature.title} className="about-quality__item">
                  <span className="about-quality__icon" aria-hidden="true" />
                  <div>
                    <div className="about-quality__item-title">{feature.title}</div>
                    <p>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <figure className="about-quality__figure">
              <img src={quality.image} alt="" />
              <figcaption>{quality.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section id="about-projects" className="about-section about-section--light">
          <div className="about-shell">
            <div className="about-projects__head">
              <h2 className="about-title">{projects.title}</h2>
              <p className="about-lead">{projects.text}</p>
            </div>
            <div className="about-filters" role="group" aria-label="Фильтр по городу">
              {CITY_FILTERS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`about-filters__chip${city === name ? ' is-active' : ''}`}
                  onClick={() => setCity(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="about-projects__grid">
              {filtered.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="about-project-card"
                  onClick={() => onOpenProject?.(project)}
                >
                  <img src={project.image} alt="" />
                  <div className="about-project-card__body">
                    <div className="about-project-card__city">
                      <span className="about-project-card__pin" aria-hidden="true" />
                      г. {project.city}
                    </div>
                    <div className="about-project-card__name">{project.name}</div>
                    {project.price != null && (
                      <div className="about-project-card__price">от {fmt(project.price)} ₸</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="about-projects__empty">В этом городе пока нет проектов в каталоге.</p>
            )}
          </div>
        </section>

        <div className="about-end">
          <section className="about-section about-section--dark">
            <div className="about-shell">
              <div className="about-contrib">
                <div className="about-contrib__intro">
                  <h2 className="about-title about-title--light">{contribution.title}</h2>
                  <p className="about-lead about-lead--muted">{contribution.text}</p>
                </div>
                <div className="about-contrib__body">
                  <figure className="about-contrib__figure">
                    <img src={contribution.image} alt="" />
                  </figure>
                  <div className="about-contrib__list">
                    {contribution.items.map((item) => (
                      <div key={item.id} className="about-contrib__row">
                        <img className="about-contrib__thumb" src={item.image} alt="" />
                        <span className="about-contrib__name">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-cta">
            <div className="about-cta__bg" style={{ backgroundImage: `url(${hero.image})` }} />
            <div className="about-cta__overlay" />
            <div className="about-cta__content">
              <h2>{cta.title}</h2>
              <p>{cta.text}</p>
              <div className="about-cta__actions">
                <button type="button" className="about-cta__btn about-cta__btn--solid" onClick={scrollToProjects}>
                  {cta.primary}
                </button>
                <button type="button" className="about-cta__btn about-cta__btn--ghost" onClick={onOpenCall}>
                  {cta.secondary}
                </button>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </>
  );
}
