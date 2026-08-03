import { useEffect, useRef } from 'react';
import LeadHoneypot from './lead/LeadHoneypot';
import LeadConsent from './lead/LeadConsent';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../lead/analytics';
import { useLeadForm } from '../lead/useLeadForm';
import { useI18n } from '../i18n/I18nContext';

/**
 * Форма «Заказать звонок» из шапки (код формы `callback_header`).
 */
export default function CallPopup({ open, onClose, city }) {
  const { t } = useI18n();
  const form = useLeadForm({
    formCode: 'callback_header',
    city,
    ctaLocation: 'Шапка сайта',
    consentMode: 'explicit',
  });
  const panelRef = useRef(null);
  const { reset } = form;

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    trackEvent(LEAD_EVENTS.FORM_OPEN, formEventParams({ formCode: 'callback_header', city }));
  }, [open, city, reset]);

  useEffect(() => {
    if (!open) return undefined;
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
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector('input:not([tabindex="-1"])')?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="call-popup" role="dialog" aria-modal="true" aria-label={t('nav.call')} onClick={onClose}>
      <div className="call-popup__panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="call-popup__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {form.isSuccess ? (
          <div className="call-popup__success">
            <div className="call-popup__title">Спасибо за заявку!</div>
            <div className="call-popup__sub">Мы перезвоним вам в течение 10 минут.</div>
            <button type="button" className="btn-primary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="call-popup__intro">
              <div className="call-popup__title">{t('nav.call')}</div>
              <div className="call-popup__sub">Оставьте контакты — перезвоним в течение 10 минут.</div>
            </div>
            <input className="call-popup__input" placeholder="Ваше имя" aria-label="Ваше имя" {...form.fields.name} />
            {form.errors.name && <div className="form-error form-error--light">{form.errors.name}</div>}

            <input className="call-popup__input" aria-label="Номер телефона" {...form.fields.phone} />
            {form.errors.phone && <div className="form-error form-error--light">{form.errors.phone}</div>}

            <LeadConsent form={form} errorClassName="form-error form-error--light" />

            <LeadHoneypot {...form.honeypotProps} />

            {form.message && <div className="form-error form-error--light">{form.message}</div>}

            <button type="button" className="btn-primary" onClick={form.submit} disabled={form.isLoading}>
              {form.isLoading ? 'Отправка…' : t('nav.call')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
