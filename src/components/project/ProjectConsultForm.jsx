import LeadHoneypot from '../lead/LeadHoneypot';
import { useLeadForm } from '../../lead/useLeadForm';
import { useI18n } from '../../i18n/I18nContext';

const ICONS = {
  location: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  ),
  hours: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function instagramUrl(handle) {
  if (!handle) return null;
  const user = handle.replace(/^@/, '').trim();
  return user ? `https://www.instagram.com/${user}` : null;
}

function mapsSearchUrl(address) {
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function addressLinkLabel(href, t) {
  if (!href) return null;
  if (/2gis/i.test(href)) return '2GIS';
  return t('project.consult.contact.openMap');
}

function ContactRow({ icon, label, linked, children }) {
  return (
    <li className={`easton-consult__contact-item${linked ? ' easton-consult__contact-item--linked' : ''}`}>
      <span className="easton-consult__contact-icon">{icon}</span>
      <div className="easton-consult__contact-body">
        <span className="easton-consult__contact-label">{label}</span>
        <div className="easton-consult__contact-value">{children}</div>
      </div>
    </li>
  );
}

function ContactLink({ href, action, children }) {
  return (
    <a
      className="easton-consult__contact-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="easton-consult__contact-link-text">{children}</span>
      {action && <span className="easton-consult__contact-action">{action}</span>}
      {ICONS.external}
    </a>
  );
}

/**
 * Нижняя форма консультации страницы ЖК (код формы `zhk_final_consultation`).
 */
export default function ProjectConsultForm({ data }) {
  const { t } = useI18n();
  const { consult } = data;
  const project = consult.projectName || data.name || '';
  const city = consult.city || data.city || '';
  const addressHref = consult.addressHref || mapsSearchUrl(consult.address);
  const instagramHref = consult.instagramHref || instagramUrl(consult.instagram);

  const form = useLeadForm({
    formCode: 'zhk_final_consultation',
    project,
    city,
    ctaLocation: 'Нижняя форма страницы ЖК',
  });

  return (
    <section id={`${data.slug}-consult`} className="easton-consult">
      <div className="easton-consult__info">
        <h2>{consult.title}</h2>
        <p>{consult.subtitle}</p>
        <ul className="easton-consult__contacts">
          {consult.address && (
            <ContactRow
              icon={ICONS.location}
              label={t('project.consult.contact.address')}
              linked={Boolean(addressHref)}
            >
              {addressHref ? (
                <ContactLink href={addressHref} action={addressLinkLabel(addressHref, t)}>
                  {consult.address}
                </ContactLink>
              ) : (
                consult.address
              )}
            </ContactRow>
          )}
          {consult.instagram && (
            <ContactRow
              icon={ICONS.instagram}
              label={t('project.consult.contact.instagram')}
              linked={Boolean(instagramHref)}
            >
              {instagramHref ? (
                <ContactLink href={instagramHref} action={t('project.consult.contact.openInstagram')}>
                  @{consult.instagram.replace(/^@/, '')}
                </ContactLink>
              ) : (
                consult.instagram
              )}
            </ContactRow>
          )}
          {consult.hours && (
            <ContactRow icon={ICONS.hours} label={t('project.consult.contact.hours')}>
              {consult.hours}
            </ContactRow>
          )}
        </ul>
      </div>
      <div className="easton-consult__form">
        {form.isSuccess ? (
          <div>
            <div className="easton-consult__success-title">{t('project.consult.success.title')}</div>
            <div className="easton-consult__success-sub">{t('project.consult.success.sub')}</div>
          </div>
        ) : (
          <>
            <label htmlFor={`${data.slug}-consult-name`}>{t('project.consult.name.label')}</label>
            <input
              id={`${data.slug}-consult-name`}
              className="input-dark"
              placeholder={t('project.consult.name.placeholder')}
              {...form.fields.name}
            />
            {form.errors.name && <div className="easton-consult__error">{form.errors.name}</div>}

            <label htmlFor={`${data.slug}-consult-phone`}>{t('project.consult.phone.label')}</label>
            <input id={`${data.slug}-consult-phone`} className="input-dark" {...form.fields.phone} />
            {form.errors.phone && <div className="easton-consult__error">{form.errors.phone}</div>}

            <LeadHoneypot {...form.honeypotProps} />

            {form.message && <div className="easton-consult__error">{form.message}</div>}

            <button
              type="button"
              className="easton-btn easton-btn--light"
              onClick={form.submit}
              disabled={form.isLoading}
            >
              {form.isLoading ? t('form.sending') : t('project.consult.submit')}
            </button>
            <div className="easton-consult__policy">{t('project.consult.policy')}</div>
          </>
        )}
      </div>
    </section>
  );
}
