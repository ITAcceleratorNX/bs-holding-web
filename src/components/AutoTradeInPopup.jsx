import { useEffect, useRef } from 'react';
import { AUTO_TRADE_IN_PROJECTS } from '../data/autoTradeIn';
import { projectHash } from '../data/projectPages';
import { useI18n } from '../i18n/I18nContext';

/**
 * Поп-ап выбора ЖК из карточки Auto Trade-in в первом экране.
 *
 * Каждый ЖК — обычная ссылка на хэш-роут страницы комплекса: так работают
 * средняя кнопка мыши, «открыть в новой вкладке» и переход с клавиатуры.
 * На мобильных та же разметка показывается шторкой снизу (см. `index.css`).
 */
export default function AutoTradeInPopup({ open, onClose }) {
  const { t } = useI18n();
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    // Фокус возвращается на кнопку карточки, иначе после закрытия он теряется.
    returnFocusRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /** @param {KeyboardEvent} e */
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKeyDown);
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector('a')?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="trade-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trade-popup-title"
      onClick={onClose}
    >
      <div className="trade-popup__panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        {/* Полоска-ручка шторки: на мобильных это единственный способ закрыть
            окно кроме тапа по затемнению, поэтому она кнопка, а не декор. */}
        <button
          type="button"
          className="trade-popup__handle"
          onClick={onClose}
          aria-label={t('form.close')}
        />

        <div className="trade-popup__head">
          <div className="trade-popup__intro">
            <h2 className="trade-popup__title" id="trade-popup-title">
              {t('tradein.popup.title')}
            </h2>
            <p className="trade-popup__sub">{t('tradein.popup.sub')}</p>
          </div>
          <button
            type="button"
            className="trade-popup__close"
            onClick={onClose}
            aria-label={t('form.close')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="trade-popup__list">
          {AUTO_TRADE_IN_PROJECTS.map((p) => (
            <li key={p.slug} className="trade-popup__item-wrap">
              <a className="trade-popup__item" href={projectHash(p.slug)} onClick={onClose}>
                <img className="trade-popup__item-img" src={p.image} alt="" loading="lazy" />
                <span className="trade-popup__item-body">
                  <span className="trade-popup__item-name">{p.name}</span>
                  <span className="trade-popup__item-note">{t('tradein.popup.available')}</span>
                </span>
                <svg
                  className="trade-popup__item-chevron"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
