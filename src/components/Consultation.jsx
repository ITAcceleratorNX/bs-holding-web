import { useState } from 'react';
import Dropdown from './Dropdown';
import LeadHoneypot from './lead/LeadHoneypot';
import LeadConsent from './lead/LeadConsent';
import { CITIES, DEFAULT_CITY } from '../lead/contract';
import { useLeadForm } from '../lead/useLeadForm';

/**
 * Общая форма консультации на главной (код формы `main_consultation`).
 */
export default function Consultation() {
  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState(DEFAULT_CITY);

  const form = useLeadForm({
    formCode: 'main_consultation',
    city,
    ctaLocation: 'Главная — блок консультации',
    consentMode: 'explicit',
  });

  return (
    <section className="section consultation">
      <div className="consult-card">
        <div className="consult-card__intro">
          <h2 className="consult-card__title">
            Чтобы получить индивидуальную консультацию, оставьте заявку
          </h2>
          <p className="consult-card__sub">
            Мы наберём вас в течение 10 минут после заявки и проконсультируем по объектам, способам оплаты и ипотеке.
          </p>
        </div>
        {form.isSuccess ? (
          <div className="consult-card__success">
            <div className="consult-card__success-title">Спасибо! Заявка принята.</div>
            <div className="consult-card__success-sub">Наш менеджер перезвонит вам в течение 10 минут.</div>
          </div>
        ) : (
          <div className="consult-card__form">
            <div className="consult-card__row">
              <input
                className="input-dark consult-card__input"
                placeholder="Ваше имя"
                aria-label="Ваше имя"
                {...form.fields.name}
              />
              <input
                className="input-dark consult-card__input"
                aria-label="Номер телефона"
                {...form.fields.phone}
              />
              <div className="consult-card__city">
                <Dropdown
                  variant="dark"
                  current={city}
                  open={cityOpen}
                  onToggle={() => setCityOpen((v) => !v)}
                  options={CITIES}
                  onSelect={(next) => {
                    setCity(next);
                    setCityOpen(false);
                  }}
                  onClose={() => setCityOpen(false)}
                />
              </div>
              <button
                type="button"
                className="btn-white consult-card__submit"
                onClick={form.submit}
                disabled={form.isLoading}
              >
                {form.isLoading ? 'Отправка…' : 'Оставить заявку'}
              </button>
            </div>

            <LeadHoneypot {...form.honeypotProps} />

            {(form.errors.name || form.errors.phone || form.message) && (
              <div className="form-error">{form.errors.name || form.errors.phone || form.message}</div>
            )}
            <LeadConsent form={form} />
          </div>
        )}
      </div>
    </section>
  );
}
