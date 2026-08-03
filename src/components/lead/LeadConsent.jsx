import { useI18n } from '../../i18n/I18nContext';
import { CONSENT_POLICY } from '../../data/leadForms';

/**
 * Явная галочка согласия для форм с `consentMode: 'explicit'`.
 */
export default function LeadConsent({ form, errorClassName = 'form-error' }) {
  const { t } = useI18n();

  return (
    <>
      <label className="lead-consent">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => form.setConsent(e.target.checked)}
        />
        <span>{t('consent.label')} — {CONSENT_POLICY}</span>
      </label>
      {form.errors.consent && <div className={errorClassName}>{form.errors.consent}</div>}
    </>
  );
}
