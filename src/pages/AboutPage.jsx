import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ABOUT } from '../data/about';
import { PROJECTS } from '../data/projects';
import { fmt } from '../utils/format';

const CITY_FILTERS = ['Все города', 'Актау', 'Актобе', 'Усть-Каменогорск'];

function HistorySlider({ items }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i) => {
    const next = Math.max(0, Math.min(items.length - 1, i));
    setIndex(next);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[next];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => {
      const cards = [...track.children];
      if (!cards.length) return;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="about-history">
      <div className="about-history__track" ref={trackRef}>
        {items.map((item) => (
          <article key={item.year} className="about-history__card">
            <div className="about-history__year">{item.year}</div>
            <h3 className="about-history__card-title">{item.title}</h3>
            <p className="about-history__card-text">{item.text}</p>
          </article>
        ))}
      </div>
      <div className="about-history__controls">
        <button
          type="button"
          className="about-history__nav"
          aria-label="Предыдущий"
          onClick={() => scrollTo(index - 1)}
          disabled={index === 0}
        >
          ←
        </button>
        <div className="about-history__dots" role="tablist" aria-label="История компании">
          {items.map((item, i) => (
            <button
              key={item.year}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`about-history__dot${i === index ? ' is-active' : ''}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="about-history__nav"
          aria-label="Следующий"
          onClick={() => scrollTo(index + 1)}
          disabled={index === items.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ p, onOpen }) {
  return (
    <button type="button" className="project-card project-card--btn about-projects__card" onClick={() => onOpen?.(p)}>
      <div className="project-card__media">
        <img src={p.image} alt={p.name} />
        <div className="project-card__badges">
          <span className="badge">{p.classFull}</span>
          {p.termBadge && <span className="badge">{p.termBadge}</span>}
        </div>
      </div>
      <div className="project-card__info">
        <div className="project-card__name">{p.name}</div>
        <div className="project-card__meta">
          {(p.meta || [p.city, p.classFull]).map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      {p.price != null && <div className="project-card__price">от {fmt(p.price)} ₸</div>}
    </button>
  );
}

export default function AboutPage({
  headerCity,
  setHeaderCity,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  onOpenCall,
  onOpenProject,
  onGoHome,
}) {
  const [city, setCity] = useState('Все города');
  const { hero, intro, history, projects, cities } = ABOUT;

  const filtered = useMemo(() => {
    if (city === 'Все города') return PROJECTS;
    return PROJECTS.filter((p) => p.city === city);
  }, [city]);

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
        onOpenCall={onOpenCall}
        onLogoClick={onGoHome}
      />

      <div className="about-page">
        <section className="about-hero">
          <img className="about-hero__bg" src={hero.image} alt="" />
          <div className="about-hero__overlay" />
          <div className="about-hero__content">
            <h1 className="about-hero__title">{hero.title}</h1>
            <p className="about-hero__subtitle">{hero.subtitle}</p>
            <div className="about-hero__cta">
              <button
                type="button"
                className="easton-btn easton-btn--solid"
                onClick={() => document.getElementById('about-projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {hero.primaryCta.label}
              </button>
              <button type="button" className="easton-btn easton-btn--ghost" onClick={onOpenCall}>
                {hero.secondaryCta.label}
              </button>
            </div>
          </div>
        </section>

        <section className="about-section about-section--dark about-intro">
          <div className="about-section__inner">
            <div className="about-label">{intro.label}</div>
            <p className="about-intro__text">{intro.text}</p>
            <div className="about-intro__stats">
              {intro.stats.map((s) => (
                <div key={s.label} className="about-intro__stat">
                  <div className="about-intro__stat-value">{s.value}</div>
                  <div className="about-intro__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section about-section--cream">
          <div className="about-section__inner">
            <div className="about-section__head about-section__head--center">
              <div className="about-label about-label--dark">{history.label}</div>
              <h2 className="about-h2">{history.title}</h2>
            </div>
            <HistorySlider items={history.items} />
          </div>
        </section>

        <section id="about-projects" className="about-section about-section--dark">
          <div className="about-section__inner">
            <div className="about-section__head">
              <div>
                <div className="about-label">{projects.label}</div>
                <h2 className="about-h2 about-h2--light">{projects.title}</h2>
              </div>
              <p className="about-body about-body--light">{projects.text}</p>
            </div>

            <div className="about-cities-filter" role="group" aria-label="Фильтр проектов по городу">
              {CITY_FILTERS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`about-cities-filter__chip${city === c ? ' is-active' : ''}`}
                  onClick={() => setCity(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="about-projects__grid">
              {filtered.map((p) => (
                <ProjectCard key={p.id} p={p} onOpen={onOpenProject} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="about-projects__empty">В этом городе пока нет проектов в каталоге.</div>
            )}
          </div>
        </section>

        <section className="about-section about-section--cream">
          <div className="about-section__inner">
            <div className="about-section__head about-section__head--center">
              <div className="about-label about-label--dark">{cities.label}</div>
              <h2 className="about-h2">{cities.title}</h2>
              <p className="about-body">{cities.text}</p>
            </div>
            <div className="about-cities-grid">
              {cities.items.map((item) => (
                <article key={item.city} className="about-city-card">
                  <div className="about-city-card__media">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="about-city-card__body">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
