import { useState } from 'react';
import { CITY_LIST, cityLabel } from '../data/cities';
import { OFFICES } from '../data/offices';
import { CITY_PHONES } from '../data/phones';
import { useI18n } from '../i18n/I18nContext';
import PhoneLink from './lead/PhoneLink';

const PHONE_ICON = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M6 28H12C13.0609 28 14.0783 28.4214 14.8284 29.1716C15.5786 29.9217 16 30.9391 16 32V38C16 39.0609 15.5786 40.0783 14.8284 40.8284C14.0783 41.5786 13.0609 42 12 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V24C6 19.2261 7.89642 14.6477 11.2721 11.2721C14.6477 7.89642 19.2261 6 24 6C28.7739 6 33.3523 7.89642 36.7279 11.2721C40.1036 14.6477 42 19.2261 42 24V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H36C34.9391 42 33.9217 41.5786 33.1716 40.8284C32.4214 40.0783 32 39.0609 32 38V32C32 30.9391 32.4214 29.9217 33.1716 29.1716C33.9217 28.4214 34.9391 28 36 28H42"
      stroke="#A5947E"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MAIL_ICON = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M44 34C44 35.0609 43.5786 36.0783 42.8284 36.8284C42.0783 37.5786 41.0609 38 40 38H8C6.93913 38 5.92172 37.5786 5.17157 36.8284C4.42143 36.0783 4 35.0609 4 34V19C4 14 8 10 13 10H36C40.4 10 44 13.6 44 18V34Z"
      stroke="#A5947E"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 18H36V22M13 10C18 10 22 14 22 19V34C22 35.0609 21.5786 36.0783 20.8284 36.8284C20.0783 37.5786 19.0609 38 18 38M12 20H14"
      stroke="#A5947E"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Contacts({ headerCity = 'Актау' }) {
  const { t } = useI18n();
  const [mapCity, setMapCity] = useState(CITY_LIST.includes(headerCity) ? headerCity : 'Актау');
  const office = OFFICES.find((o) => o.city === mapCity) ?? OFFICES[0];

  const contactItems = [
    ...CITY_LIST.map((city) => ({
      title: CITY_PHONES[city].full,
      sub: `${cityLabel(t, city)} — ${t('contacts.hours')}`,
      href: CITY_PHONES[city].href,
      city,
      icon: PHONE_ICON,
    })),
    {
      title: 'bsholding@gmail.com',
      sub: t('contacts.emailSub'),
      href: 'mailto:bsholding@gmail.com',
      icon: MAIL_ICON,
    },
  ];

  return (
    <section id="contacts" className="section contacts">
      <h2 className="section-title">{t('contacts.title')}</h2>
      <div className="contacts-grid">
        {contactItems.map((c) => (
          <div key={c.title} className="contacts-item">
            {c.icon}
            {c.city ? (
              <PhoneLink href={c.href} city={c.city} ctaLocation="Блок «Поддержка»" className="contacts-item__title">
                {c.title}
              </PhoneLink>
            ) : (
              <a href={c.href} className="contacts-item__title">
                {c.title}
              </a>
            )}
            <div className="contacts-item__sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="contacts-map">
        <h3 className="contacts-map__title">{t('contacts.mapTitle')}</h3>
        <p className="contacts-map__hint">{t('contacts.mapHint')}</p>
        <div className="contacts-map__tabs">
          {CITY_LIST.map((city) => (
            <button
              key={city}
              type="button"
              className={`contacts-map__tab${mapCity === city ? ' is-active' : ''}`}
              onClick={() => setMapCity(city)}
            >
              {cityLabel(t, city)}
            </button>
          ))}
        </div>
        <p className="contacts-map__address">{t(office.addressKey)}</p>
        <div className="contacts-map__frame">
          <iframe
            key={office.city}
            title={`${t('contacts.mapTitle')} — ${cityLabel(t, office.city)}`}
            src={office.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <a
          className="contacts-map__route"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('contacts.route')}
        </a>
      </div>
    </section>
  );
}
