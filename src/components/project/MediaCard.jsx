/**
 * Карточка-плитка с фоновым изображением.
 *
 * `imagePosition` — значение CSS `object-position` (например `'center 30%'`).
 * Плитки обрезают изображение по `object-fit: cover`, поэтому для рендеров с
 * высоким объектом (башня, фасад) кадр смещается без правки верстки.
 */
export default function MediaCard({ image, imagePosition, title, tall, solid, icon }) {
  return (
    <div
      className={`easton-media-card${tall ? ' easton-media-card--tall' : ''}${solid ? ' easton-media-card--solid' : ''}`}
    >
      {!solid && image && (
        <img src={image} alt="" loading="lazy" decoding="async" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
      )}
      {!solid && <div className="easton-media-card__shade" />}
      {icon && <img className="easton-media-card__icon" src={icon} alt="" width={48} height={48} />}
      {title && <div className="easton-media-card__title">{title}</div>}
    </div>
  );
}
