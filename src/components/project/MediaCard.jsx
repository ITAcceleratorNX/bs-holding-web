/**
 * Карточка-плитка с фоновым изображением.
 */
export default function MediaCard({ image, imagePosition, title, tall, solid, icon, onImageClick }) {
  return (
    <div
      className={`easton-media-card${tall ? ' easton-media-card--tall' : ''}${solid ? ' easton-media-card--solid' : ''}${onImageClick ? ' easton-media-card--clickable' : ''}`}
      onClick={onImageClick && image ? () => onImageClick(image, title) : undefined}
      onKeyDown={
        onImageClick && image
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick(image, title);
              }
            }
          : undefined
      }
      role={onImageClick && image ? 'button' : undefined}
      tabIndex={onImageClick && image ? 0 : undefined}
    >
      {!solid && image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      )}
      {!solid && <div className="easton-media-card__shade" />}
      {icon && <img className="easton-media-card__icon" src={icon} alt="" width={48} height={48} />}
      {title && <div className="easton-media-card__title">{title}</div>}
    </div>
  );
}
