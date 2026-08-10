import { useEffect, useRef } from 'react';
import LeadHoneypot from './LeadHoneypot';
import { CONSENT_POLICY, getLeadPreset } from '../../data/leadForms';
import { phoneForHref, phoneNumbers } from '../../data/phones';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../../lead/analytics';
import { useLeadForm } from '../../lead/useLeadForm';

const FORM_CODE = 'sales_phone_reveal';

/**
 * Форма «Получить номер отдела продаж» (код формы `sales_phone_reveal`).
 *
 * Открывается по клику на скрытый номер и после отправки показывает его
 * полностью. Лид уходит в CRM до показа номера: страница, расположение CTA и
 * рекламные метки собираются в `useLeadForm` и доходят до карточки лида
 * (ТЗ 4, 5). Имя не спрашиваем — форма стоит на месте номера, и лишнее поле
 * здесь стоит дороже, чем недостающее имя.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {{ phoneHref: string, phone?: Object, city?: string, project?: string, ctaLocation?: string, hours?: string }|null} props.request
 * @param {() => void} props.onClose
 * @param {(phoneHref: string) => void} props.onRevealed
 */
export default function PhoneRevealPopup({ open, request, onClose, onRevealed }) {
  const phoneHref = request?.phoneHref ?? '';
  const city = request?.city ?? '';
  const project = request?.project ?? '';
  const ctaLocation = request?.ctaLocation ?? '';

  const form = useLeadForm({
    formCode: FORM_CODE,
    city,
    project,
    ctaLocation,
    onSuccess: () => onRevealed(phoneHref),
  });
  const panelRef = useRef(null);
  const { reset } = form;

  // Событие открытия формы (ТЗ 10).
  useEffect(() => {
    if (!open) return;
    trackEvent(LEAD_EVENTS.FORM_OPEN, formEventParams({ formCode: FORM_CODE, city, project, ctaLocation }));
  }, [open, city, project, ctaLocation]);

  // Закрытая форма не должна открываться с прошлым номером и ошибкой.
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

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
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector('input:not([tabindex="-1"])')?.focus();
  }, [open]);

  if (!open) return null;

  const preset = getLeadPreset(FORM_CODE);
  // Набор линий приходит с точки показа: по одной ссылке колл-центр ЖК не
  // восстановить, у города и у проекта номера могут не совпадать.
  const numbers = phoneNumbers(request?.phone ?? phoneForHref(phoneHref));
  const hours = request?.hours || preset.successHours;

  return (
    <div
      className="call-popup"
      role="dialog"
      aria-modal="true"
      aria-label={preset.title}
      onClick={onClose}
    >
      <div className="call-popup__panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="call-popup__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {form.isSuccess ? (
          <div className="call-popup__success">
            <div className="call-popup__title">
              {numbers.length > 1 ? 'Номера отдела продаж' : preset.successTitle}
            </div>
            {/* Номера открыты: дальше это обычный звонок, и он уходит в аналитику (ТЗ 10). */}
            <div className="phone-reveal__numbers">
              {numbers.map((n) => (
                <a
                  key={n.href}
                  className="phone-reveal__number"
                  href={n.href}
                  onClick={() =>
                    trackEvent(LEAD_EVENTS.PHONE_CLICK, {
                      city,
                      cta_location: ctaLocation,
                      page: window.location.href,
                    })
                  }
                >
                  {n.full}
                </a>
              ))}
            </div>
            {hours && <div className="phone-reveal__hours">{hours}</div>}
            <div className="call-popup__sub">{preset.successText}</div>
            <button type="button" className="btn-primary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="call-popup__intro">
              <div className="call-popup__title">{preset.title}</div>
              <div className="call-popup__sub">{preset.subtitle()}</div>
            </div>

            <input className="call-popup__input" aria-label="Ваш номер телефона" {...form.fields.phone} />
            {form.errors.phone && <div className="form-error form-error--light">{form.errors.phone}</div>}

            <LeadHoneypot {...form.honeypotProps} />

            {form.message && <div className="form-error form-error--light">{form.message}</div>}

            <button type="button" className="btn-primary" onClick={form.submit} disabled={form.isLoading}>
              {form.isLoading ? 'Отправка…' : preset.submitLabel}
            </button>
            <div className="lead-policy">{CONSENT_POLICY}</div>
          </>
        )}
      </div>
    </div>
  );
}
