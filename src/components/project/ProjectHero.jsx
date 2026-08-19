/**
 * Первый экран страницы ЖК.
 *
 * Обе кнопки создают лид: «Оставить заявку» — форму первого экрана
 * (`zhk_hero_application`), «Скачать презентацию» — форму презентации
 * (`presentation_download`), после которой открывается WhatsApp (ТЗ 3, 7).
 */
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectHero({ data, onRequestApplication, onRequestPresentation }) {
  const { t } = useI18n();
  const mobile = data.hero.imageMobile;
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
        <p className="easton-hero__city">{data.hero.location}</p>
        {data.hero.tagline && <p className="easton-hero__tagline">{data.hero.tagline}</p>}
        <div className="easton-hero__cta">
          <button type="button" className="easton-btn easton-btn--solid" onClick={onRequestApplication}>
            {t('project.hero.apply')}
          </button>
          <button type="button" className="easton-btn easton-btn--light" onClick={onRequestPresentation}>
            {t('project.hero.presentation')}
          </button>
        </div>
      </div>
    </section>
  );
}
