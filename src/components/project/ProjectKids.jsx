import SectionLabel from './SectionLabel';
import MediaCard from './MediaCard';
import { useImageLightbox } from '../../hooks/useImageLightbox';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectKids({ data }) {
  const { t } = useI18n();
  const { kids } = data;
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  const { open, lightbox } = useImageLightbox(data.name);
  const hasRoom = Boolean(kids.roomTitle || kids.roomText);

  return (
    <section className="easton-section easton-section--cream">
      <SectionLabel color={accentDark}>{kids.labelKey ? t(kids.labelKey) : kids.label || t('project.label.kids')}</SectionLabel>
      <div className={`easton-kids__grid easton-kids__grid--${kids.gallery.length}`}>
        {kids.gallery.map((g, i) => (
          <MediaCard
            key={i}
            image={g.image}
            imagePosition={g.imagePosition}
            title={g.title}
            onImageClick={g.image ? open : undefined}
          />
        ))}
      </div>
      {hasRoom && (
        <div className={`easton-kids__room${kids.stackRoomLabel ? ' easton-kids__room--stack' : ''}`}>
          {kids.roomLabel ? <div className="easton-kids__room-label">{kids.roomLabel}</div> : null}
          <div>
            <h3 className="easton-h2 easton-h2--dark">{kids.roomTitle}</h3>
            <p className="easton-body easton-body--dark">{kids.roomText}</p>
          </div>
        </div>
      )}
      {kids.roomImage && (
        <div className="easton-kids__room-image">
          <img
            src={kids.roomImage}
            alt={kids.roomImageAlt ?? ''}
            className="is-clickable"
            onClick={() => open(kids.roomImage, kids.roomImageAlt)}
          />
        </div>
      )}
      {lightbox}
    </section>
  );
}
