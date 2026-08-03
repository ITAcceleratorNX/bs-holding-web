import { useEffect, useRef } from 'react';
import { PROMOTIONS_PAGE } from '../../data/promotions';
import PromotionLeadForm from './PromotionLeadForm';

function PromoMedia({ offer, stubOnly = false }) {
  const showImage = !stubOnly && Boolean(offer.image);
  const showTag = !showImage || !offer.tagInImage;
  return (
    <div className={`promo-media${showImage ? '' : ' promo-media--stub'}`}>
      {showImage ? <img src={offer.image} alt="" className="promo-media__img" /> : null}
      {showTag ? <span className="promo-media__tag">{offer.tag}</span> : null}
      <span className="promo-media__stub">{offer.stub}</span>
    </div>
  );
}

function PromoDetailBody({ offer, city, onClose }) {
  return (
    <>
      <PromoMedia offer={offer} stubOnly />
      {offer.applies ? <p className="promo-detail__applies">{offer.applies}</p> : null}
      <h2 className="promo-detail__title">{offer.title}</h2>
      {offer.description ? <p className="promo-detail__desc">{offer.description}</p> : null}
      {offer.facts?.length ? (
        <ul className="promo-detail__facts">
          {offer.facts.map((f) => (
            <li key={f.label} className="promo-detail__fact">
              <div className="promo-detail__fact-label">{f.label}</div>
              <div className="promo-detail__fact-text">{f.text}</div>
            </li>
          ))}
        </ul>
      ) : null}
      <PromotionLeadForm
        key={offer.id}
        offer={offer}
        city={city}
        ctaLocation="Страница акций — детали"
        onClose={onClose}
      />
    </>
  );
}

/**
 * Desktop: центрированный popup. Mobile: нижний sheet.
 * Режим задаётся снаружи через `mode` ('popup' | 'sheet').
 */
function PromotionDetail({ offer, open, onClose, city, mode }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    /** @param {KeyboardEvent} e */
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector('input:not([tabindex="-1"])')?.focus();
  }, [open, offer?.id]);

  if (!open || !offer) return null;

  const isSheet = mode === 'sheet';

  return (
    <div
      className={`promo-detail${isSheet ? ' promo-detail--sheet' : ' promo-detail--popup'}`}
      role="dialog"
      aria-modal="true"
      aria-label={offer.title}
      onClick={onClose}
    >
      <div
        className="promo-detail__panel"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        {isSheet ? <div className="promo-detail__handle" aria-hidden="true" /> : null}
        <button type="button" className="promo-detail__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <PromoDetailBody offer={offer} city={city} onClose={onClose} />
      </div>
    </div>
  );
}

export function PromotionCard({ offer, onOpen }) {
  return (
    <article className="promo-card">
      <PromoMedia offer={offer} />
      <h3 className="promo-card__title">{offer.title}</h3>
      <button type="button" className="promo-card__cta" onClick={() => onOpen(offer)}>
        {PROMOTIONS_PAGE.cta}
      </button>
    </article>
  );
}

export default PromotionDetail;
