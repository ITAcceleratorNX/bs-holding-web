import LeadHoneypot from '../lead/LeadHoneypot';
import { CONSENT_POLICY } from '../../data/leadForms';
import { useLeadForm } from '../../lead/useLeadForm';

/**
 * Форма заявки по акции: имя, телефон, согласие.
 * В CRM уходят акция, город, страница и UTM через useLeadForm.
 */
export default function PromotionLeadForm({ offer, city, ctaLocation, onClose }) {
  const form = useLeadForm({
    formCode: 'promotion_offer',
    city,
    project: '',
    ctaLocation,
    consentMode: 'explicit',
    details: () => [
      { key: 'promotion_id', label: 'ID акции', value: offer.id, group: 'promotion' },
      { key: 'promotion_tag', label: 'Акция', value: offer.tag, group: 'promotion' },
      { key: 'promotion_title', label: 'Название акции', value: offer.title, group: 'promotion' },
    ],
  });

  if (form.isSuccess) {
    return (
      <div className="promo-detail__success">
        <div className="promo-detail__success-icon" aria-hidden="true">
          ✓
        </div>
        <div className="promo-detail__success-title">Спасибо!</div>
        <p className="promo-detail__success-text">
          Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
        </p>
        {onClose && (
          <button type="button" className="promo-detail__submit" onClick={onClose}>
            Закрыть
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="promo-detail__form">
      <label className="promo-detail__label" htmlFor={`promo-${offer.id}-name`}>
        Ваше имя
      </label>
      <input
        id={`promo-${offer.id}-name`}
        className={`promo-detail__input${form.errors.name ? ' is-error' : ''}`}
        placeholder="Введите ваше имя"
        {...form.fields.name}
      />
      {form.errors.name && <div className="promo-detail__error">{form.errors.name}</div>}

      <label className="promo-detail__label" htmlFor={`promo-${offer.id}-phone`}>
        Номер телефона
      </label>
      <input
        id={`promo-${offer.id}-phone`}
        className={`promo-detail__input${form.errors.phone ? ' is-error' : ''}`}
        {...form.fields.phone}
      />
      {form.errors.phone && <div className="promo-detail__error">{form.errors.phone}</div>}

      <label className="promo-detail__consent">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => form.setConsent(e.target.checked)}
        />
        <span>{CONSENT_POLICY}</span>
      </label>
      {form.errors.consent && <div className="promo-detail__error">{form.errors.consent}</div>}

      <LeadHoneypot {...form.honeypotProps} />

      {form.message && <div className="promo-detail__error">{form.message}</div>}

      <button
        type="button"
        className="promo-detail__submit"
        onClick={form.submit}
        disabled={form.isLoading}
      >
        {form.isLoading ? 'Отправка…' : 'Получить условия акции'}
      </button>
    </div>
  );
}
