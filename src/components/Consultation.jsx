import { useState } from 'react';
import Dropdown from './Dropdown';
import LeadHoneypot from './lead/LeadHoneypot';
import LeadConsent from './lead/LeadConsent';
import { CITIES, DEFAULT_CITY } from '../lead/contract';
import { useLeadForm } from '../lead/useLeadForm';
import { useI18n } from '../i18n/I18nContext';

/**
 * Общая форма консультации на главной (код формы `main_consultation`).
 */
export default function Consultation() {
  const { t } = useI18n();
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
          <h2 className="consult-card__title">{t('consult.title')}</h2>
          <p className="consult-card__sub">{t('consult.sub')}</p>
        </div>
        {form.isSuccess ? (
          <div className="consult-card__success">
            <div className="consult-card__success-title">{t('consult.success.title')}</div>
            <div className="consult-card__success-sub">{t('consult.success.sub')}</div>
          </div>
        ) : (
          <div className="consult-card__form">
            <div className="consult-card__row">
              <input
                className="input-dark consult-card__input"
                placeholder={t('form.name.placeholder')}
                aria-label={t('form.name.label')}
                {...form.fields.name}
              />
              <input
                className="input-dark consult-card__input"
                aria-label={t('form.phone.label')}
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
                {form.isLoading ? t('form.sending') : t('consult.submit')}
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
