import { useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ABOUT } from '../data/about';
import { CITIES, PROJECTS } from '../data/projects';
import { useI18n } from '../i18n/I18nContext';
import { fmt } from '../utils/format';

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
  const { t } = useI18n();
  const CITY_FILTERS = [null, ...CITIES];
  // null = все города
  const [city, setCity] = useState(null);
  const { hero, intro, history, quality, contribution } = ABOUT;

  const syncedCity = useRef(headerCity);
  if (syncedCity.current !== headerCity) {
    syncedCity.current = headerCity;
    setCity(headerCity);
  }

  const filtered = useMemo(
    () => (city === null ? PROJECTS : PROJECTS.filter((p) => p.city === city)),
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
        activeNav="about"
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
              <Lines text={t('about.hero.title')} />
            </h1>
            <p className="about-hero__subtitle">{t('about.hero.subtitle')}</p>
            <button type="button" className="about-hero__cta" onClick={scrollToProjects}>
              {t('about.hero.cta')}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <section className="about-section about-section--dark">
          <div className="about-shell">
            <div className="about-intro">
              <h2 className="about-intro__title">{t('about.intro.title')}</h2>
              <p className="about-intro__text">{t('about.intro.text')}</p>

              <div className="about-stats">
                <div className="about-stats__highlight">
                  <div className="about-stats__value">{t('about.intro.highlight.value')}</div>
                  <div className="about-stats__label">{t('about.intro.highlight.label')}</div>
                </div>
                <div className="about-stats__grid">
                  {[
                    { valueKey: 'about.stat.years.value', labelKey: 'about.stat.years.label' },
                    { valueKey: 'about.stat.projects.value', labelKey: 'about.stat.projects.label' },
                    { valueKey: 'about.stat.area.value', labelKey: 'about.stat.area.label' },
                    { valueKey: 'about.stat.cities.value', labelKey: 'about.stat.cities.label' },
                  ].map((stat) => (
                    <div key={stat.labelKey} className="about-stats__card">
                      <div className="about-stats__value">{t(stat.valueKey)}</div>
                      <div className="about-stats__label">
                        <Lines text={t(stat.labelKey)} />
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
              <h2 className="about-title about-title--light">{t('about.history.title')}</h2>
              <div className="about-history__timeline" aria-hidden="true">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="about-history__node" />
                ))}
              </div>
              <div className="about-history__grid">
                {[1, 2, 3].map((i) => (
                  <article key={i} className="about-history__card">
                    <div className="about-history__media">
                      <img src={history.items[i - 1]?.image} alt="" />
                    </div>
                    <div className="about-history__year">{t(`about.hist.${i}.year`)}</div>
                    <h3 className="about-history__card-title">{t(`about.hist.${i}.title`)}</h3>
                    <p className="about-history__card-text">{t(`about.hist.${i}.text`)}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-section--light">
          <div className="about-shell">
            <div className="about-quality__head">
              <h2 className="about-title">{t('about.quality.title')}</h2>
              <p className="about-lead">{t('about.quality.text')}</p>
            </div>
            <div className="about-quality__grid">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="about-quality__item">
                  <span className="about-quality__icon" aria-hidden="true" />
                  <div>
                    <div className="about-quality__item-title">{t(`about.feat.${i}.title`)}</div>
                    <p>{t(`about.feat.${i}.text`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <figure className="about-quality__figure">
              <img src={quality.image} alt="" />
              <figcaption>{t('about.quality.caption')}</figcaption>
            </figure>
          </div>
        </section>

        <section id="about-projects" className="about-section about-section--light">
          <div className="about-shell">
            <div className="about-projects__head">
              <h2 className="about-title">{t('about.projects.title')}</h2>
              <p className="about-lead">{t('about.projects.text')}</p>
            </div>
            <div className="about-filters" role="group" aria-label={t('about.projects.filterLabel')}>
              {CITY_FILTERS.map((name) => (
                <button
                  key={name ?? 'all'}
                  type="button"
                  className={`about-filters__chip${city === name ? ' is-active' : ''}`}
                  onClick={() => setCity(name)}
                >
                  {name === null ? t('about.projects.all') : name}
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
                      {t('about.projects.cityPrefix') ? `${t('about.projects.cityPrefix')} ${project.city}` : project.city}
                    </div>
                    <div className="about-project-card__name">{project.name}</div>
                    {project.price != null && (
                      <div className="about-project-card__price">{t('about.projects.priceFrom')} {fmt(project.price)} ₸</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="about-projects__empty">{t('about.projects.empty')}</p>
            )}
          </div>
        </section>

        <div className="about-end">
          <section className="about-section about-section--dark">
            <div className="about-shell">
              <div className="about-contrib">
                <div className="about-contrib__intro">
                  <h2 className="about-title about-title--light">{t('about.contrib.title')}</h2>
                  <p className="about-lead about-lead--muted">{t('about.contrib.text')}</p>
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
              <h2>{t('about.cta.title')}</h2>
              <p>{t('about.cta.text')}</p>
              <div className="about-cta__actions">
                <button type="button" className="about-cta__btn about-cta__btn--solid" onClick={scrollToProjects}>
                  {t('about.cta.primary')}
                </button>
                <button type="button" className="about-cta__btn about-cta__btn--ghost" onClick={onOpenCall}>
                  {t('about.cta.secondary')}
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
