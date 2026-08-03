import { useState } from 'react';
import ImageLightbox from '../components/ImageLightbox';

/**
 * @param {string} [initialAlt]
 */
export function useImageLightbox(initialAlt = '') {
  const [state, setState] = useState(null);

  const open = (src, alt = initialAlt) => setState({ src, alt });
  const close = () => setState(null);

  const lightbox = (
    <ImageLightbox src={state?.src ?? null} alt={state?.alt ?? ''} onClose={close} />
  );

  return { open, close, lightbox };
}
