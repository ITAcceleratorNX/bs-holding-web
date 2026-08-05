import { useEffect, useRef } from 'react';
import LeadHoneypot from './LeadHoneypot';
import { CONSENT_POLICY, getLeadPreset } from '../../data/leadForms';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../../lead/analytics';
import { useLeadForm } from '../../lead/useLeadForm';

/**
 * Всплывающая форма заявки для страниц ЖК.
 *
 * Одна разметка на все popup-формы: заявка с первого экрана, расчёт, экскурсия,
 * консультация, планировка, каталог и презентация. Отличаются они кодом формы,
 * текстами из `LEAD_FORM_PRESETS` и дополнительными полями через `children`.
 *
 * Поведение (ТЗ 8) целиком в `useLeadForm`: проверка, блокировка повторного
 * нажатия, идентификатор отправки, аналитика и переход в WhatsApp.
 */
export default function LeadPopup({
  open,
  onClose,
  formCode,
  project = '',
  city = '',
  ctaLocation = '',
  details,
  validate,
  /** Дополнительные поля формы. Получают состояние отправки, чтобы блокироваться. */
  children,
  /** Переопределение текстов из пресета. */
  title,
  subtitle,
  submitLabel,
  /** Модификатор панели: нужен, когда дополнительное поле — выпадающий список. */
  panelClassName = '',
}) {
  const preset = getLeadPreset(formCode);
  const form = useLeadForm({ formCode, city, project, ctaLocation, details, validate });
  const panelRef = useRef(null);
  const { reset } = form;

  // Событие открытия формы (ТЗ 10).
  useEffect(() => {
    if (!open) return;
    trackEvent(LEAD_EVENTS.FORM_OPEN, formEventParams({ formCode, city, project, ctaLocation }));
  }, [open, formCode, city, project, ctaLocation]);

  // Закрытая форма не должна открываться с прошлым именем, телефоном и ошибкой.
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

  // Фокус переводится в форму, иначе он остаётся на кнопке под затемнением.
  useEffect(() => {
    if (open) panelRef.current?.querySelector('input:not([tabindex="-1"])')?.focus();
  }, [open]);

  if (!open) return null;

  const heading = title ?? preset?.title ?? 'Оставить заявку';
  const lead = subtitle ?? preset?.subtitle?.(project) ?? '';

  return (
    <div className="project-lead-popup" role="dialog" aria-modal="true" aria-label={heading} onClick={onClose}>
      <div
        className={`project-lead-popup__panel${panelClassName ? ` ${panelClassName}` : ''}`}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="project-lead-popup__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {form.isSuccess ? (
          <div className="project-lead-popup__success">
            <div className="project-lead-popup__title">{preset?.successTitle ?? 'Спасибо! Заявка принята.'}</div>
            <div className="project-lead-popup__sub">
              {preset?.successText ?? 'Менеджер свяжется с вами в ближайшее время.'}
            </div>
            {/* Вкладку WhatsApp заблокировал браузер — даём перейти вручную (ТЗ 7). */}
            {form.whatsappUrl && (
              <a
                className="lead-whatsapp-fallback"
                href={form.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть WhatsApp
              </a>
            )}
            <button type="button" className="easton-btn easton-btn--solid" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="project-lead-popup__intro">
              <div className="project-lead-popup__title">{heading}</div>
              {lead && <div className="project-lead-popup__sub">{lead}</div>}
            </div>

            <label className="project-lead-popup__label" htmlFor={`${formCode}-name`}>
              Имя
            </label>
            <input
              id={`${formCode}-name`}
              className="project-lead-popup__input"
              placeholder="Ваше имя"
              {...form.fields.name}
            />
            {form.errors.name && <div className="project-lead-popup__error">{form.errors.name}</div>}

            <label className="project-lead-popup__label" htmlFor={`${formCode}-phone`}>
              Номер телефона
            </label>
            <input id={`${formCode}-phone`} className="project-lead-popup__input" {...form.fields.phone} />
            {form.errors.phone && <div className="project-lead-popup__error">{form.errors.phone}</div>}

            {typeof children === 'function' ? children(form) : children}

            <LeadHoneypot {...form.honeypotProps} />

            {form.message && <div className="project-lead-popup__error">{form.message}</div>}

            <button
              type="button"
              className="easton-btn easton-btn--solid"
              onClick={form.submit}
              disabled={form.isLoading}
            >
              {form.isLoading ? 'Отправка…' : (submitLabel ?? preset?.submitLabel ?? 'Отправить')}
            </button>

            <div className="lead-policy">{CONSENT_POLICY}</div>
          </>
        )}
      </div>
    </div>
  );
}
