import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectAbout({ data }) {
  const { t } = useI18n();
  const { about } = data;
  const hasTitle = Boolean(about.title);
  return (
    <section id={about.id ?? `${data.slug}-about`} className="easton-section easton-section--dark easton-about">
      <SectionLabel>{t('project.label.about')}</SectionLabel>
      {hasTitle ? (
        <>
          <h2 className="easton-h2 easton-about__heading">{about.title}</h2>
          <p className="easton-body easton-about__lead">{about.text}</p>
        </>
      ) : (
        <p className="easton-about__text">{about.text}</p>
      )}
      {about.image && (
        /**
         * `imageRatio` ('2560 / 1433') отдаёт высоту блока пропорции рендера
         * вместо фиксированных 420px. Тогда кадр не обрезается ни на одной
         * ширине экрана — нужно там, где важно показать здание целиком.
         */
        <div
          className="easton-about__image"
          style={about.imageRatio ? { aspectRatio: about.imageRatio, height: 'auto' } : undefined}
        >
          <img
            src={about.image}
            alt={about.imageAlt ?? ''}
            loading="lazy"
            decoding="async"
            style={about.imagePosition ? { objectPosition: about.imagePosition } : undefined}
          />
        </div>
      )}
      <div className={`easton-about__stats${about.stats.length > 2 ? ' easton-about__stats--triple' : ''}`}>
        {about.stats.map((s) => (
          <div key={s.text} className="easton-about__stat">
            {s.icon && <img src={s.icon} alt="" width={48} height={48} />}
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
