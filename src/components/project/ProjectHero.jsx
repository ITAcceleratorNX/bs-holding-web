/**
 * Первый экран страницы ЖК.
 * При `hero.brochureHref` вторая кнопка скачивает PDF, иначе открывает форму презентации.
 */
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectHero({ data, onRequestApplication, onRequestPresentation }) {
  const { t } = useI18n();
  const mobile = data.hero.imageMobile;
  const brochureHref = data.hero.brochureHref;
  return (
    <section className="easton-hero">
      <picture>
        {mobile && <source media="(max-width: 768px)" srcSet={mobile} />}
        <img
          className="easton-hero__bg"
          src={data.hero.image}
          alt=""
          fetchPriority="high"
          decoding="async"
          style={data.hero.imagePosition ? { objectPosition: data.hero.imagePosition } : undefined}
        />
      </picture>
      <div className="easton-hero__overlay" />
      <div className="easton-hero__content">
        <h1>{data.hero.title}</h1>
        {data.hero.location ? <p className="easton-hero__city">{data.hero.location}</p> : null}
        {data.hero.tagline && <p className="easton-hero__tagline">{data.hero.tagline}</p>}
        <div className="easton-hero__cta">
          <button type="button" className="easton-btn easton-btn--solid" onClick={onRequestApplication}>
            {t('project.hero.apply')}
          </button>
          {brochureHref ? (
            <a
              className="easton-btn easton-btn--light"
              href={brochureHref}
              download={data.hero.brochureFileName ?? true}
            >
              {t('project.hero.brochure')}
            </a>
          ) : (
            <button type="button" className="easton-btn easton-btn--light" onClick={onRequestPresentation}>
              {t('project.hero.presentation')}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
