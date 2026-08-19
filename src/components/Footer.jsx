import { SOCIALS, SOCIAL_LINKS } from '../data/projects';
import { projectHash, projectSlugFromName } from '../data/projectPages';
import { useI18n } from '../i18n/I18nContext';
import Logo from './Logo';

const PROJECT_NAMES = ['Central Park', 'Avenue Park', 'MURA', 'Easton', 'White Hill', 'ORTA', 'BS Towers'];

const LINK_HREF = {
  about: '#/about',
  vacancies: 'mailto:bsholding@gmail.com?subject=Вакансии BS Holding',
  news: '#/news',
  contacts: '#contacts',
  hours: '#contacts',
  aktau: '#contacts',
  aktobe: '#contacts',
  oskemen: '#contacts',
  installment: '#paida',
  mortgage: '#catalog',
  conditions: '#/akcii',
};

export default function Footer() {
  const { t } = useI18n();

  const FOOTER_COLS = [
    {
      titleKey: 'footer.col.projects',
      items: PROJECT_NAMES.map((name) => ({
        label: name,
        href: projectHash(projectSlugFromName(name)) ?? '#',
      })),
    },
    {
      titleKey: 'footer.col.company',
      items: [
        { label: t('footer.link.about'), href: LINK_HREF.about },
        { label: t('footer.link.vacancies'), href: LINK_HREF.vacancies },
        { label: t('footer.link.news'), href: LINK_HREF.news },
      ],
    },
    {
      titleKey: 'footer.col.support',
      items: [
        { label: t('footer.link.contacts'), href: LINK_HREF.contacts },
        { label: t('footer.link.hours'), href: LINK_HREF.hours },
      ],
    },
    {
      titleKey: 'footer.col.offices',
      items: [
        { label: 'Актау', href: LINK_HREF.aktau },
        { label: 'Актобе', href: LINK_HREF.aktobe },
        { label: 'Усть-Каменогорск', href: LINK_HREF.oskemen },
      ],
    },
    {
      titleKey: 'footer.col.paida',
      items: [
        { label: t('footer.link.installment'), href: LINK_HREF.installment },
        { label: t('footer.link.mortgage'), href: LINK_HREF.mortgage },
        { label: t('footer.link.conditions'), href: LINK_HREF.conditions },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Logo fill="#fff" />
        <div className="site-footer__cols">
          {FOOTER_COLS.map((col) => (
            <div key={col.titleKey} className="site-footer__col">
              <div className="site-footer__col-title">{t(col.titleKey)}</div>
              <div className="site-footer__links">
                {col.items.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="site-footer__bottom">
        <p className="site-footer__policy">{t('footer.policy')}</p>
        <div className="site-footer__meta">
          <span className="site-footer__copy">{t('footer.copy')}</span>
          <div className="site-footer__socials">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href={SOCIAL_LINKS[s] ?? '#'}
                className="site-footer__social"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
