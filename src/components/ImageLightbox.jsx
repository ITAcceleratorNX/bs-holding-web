import { useEffect } from 'react';

/**
 * @param {{ src: string | null, alt?: string, onClose: () => void }} props
 */
export default function ImageLightbox({ src, alt = '', onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div className="img-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="img-lightbox__close" aria-label="Закрыть" onClick={onClose}>
        ×
      </button>
      <img className="img-lightbox__img" src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
