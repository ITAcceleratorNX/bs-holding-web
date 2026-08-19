import SectionLabel from './SectionLabel';
import { useImageLightbox } from '../../hooks/useImageLightbox';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectArchitecture({ data, onRequestTour }) {
  const { t } = useI18n();
  const { architecture } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  const gallery = architecture.gallery?.filter(Boolean) ?? [];
  const { open, lightbox } = useImageLightbox(data.name);

  return (
    <section id={architecture.id} className="easton-section easton-section--cream">
      <SectionLabel color={accentDark}>{t('project.label.architecture')}</SectionLabel>
      <h2 className="easton-h2 easton-h2--dark">{architecture.title}</h2>
      {architecture.lead ? (
        <p className="easton-body easton-body--dark" style={{ marginTop: 16 }}>
          {architecture.lead}
        </p>
      ) : null}
      <div className="easton-arch__image">
        <img
          src={architecture.image}
          alt={`${t('project.label.architecture')} ${data.name}`}
          loading="lazy"
          decoding="async"
          className="is-clickable"
          onClick={() => open(architecture.image, `${t('project.label.architecture')} ${data.name}`)}
          style={architecture.imagePosition ? { objectPosition: architecture.imagePosition } : undefined}
        />
      </div>
      {gallery.length > 0 && (
        <div className={`easton-arch__gallery${gallery.length === 1 ? ' easton-arch__gallery--single' : ''}`}>
          {gallery.map((src) => (
            <div key={src} className="easton-arch__gallery-item">
              <img
                src={src}
                alt={`Фасад ${data.name}`}
                loading="lazy"
                decoding="async"
                className="is-clickable"
                onClick={() => open(src, `Фасад ${data.name}`)}
              />
            </div>
          ))}
        </div>
      )}
      <div className="easton-arch__points">
        {architecture.points.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="easton-banner">
        <div>{architecture.ctaQuestion}</div>
        <button type="button" className="easton-btn easton-btn--light" onClick={onRequestTour}>
          {t('project.arch.cta')}
        </button>
      </div>
      {lightbox}
    </section>
  );
}
