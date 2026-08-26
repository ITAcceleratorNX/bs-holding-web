import { SOCIAL_NETWORKS, SocialIcon } from './SocialIcons';
import { cityLabel } from '../data/cities';
import { projectHash, projectSlugFromName } from '../data/projectPages';
import { useI18n } from '../i18n/I18nContext';
import { homeSectionHref } from '../utils/navigation';
import Logo from './Logo';

const PROJECT_NAMES = ['Central Park', 'Avenue Park', 'MURA', 'Easton', 'White Hill', 'ORTA', 'BS Towers'];

export default function Footer({ logoFill = '#fff' }) {
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
        { label: t('footer.link.about'), href: '#/about' },
        { label: t('footer.link.news'), href: '#/akcii' },
      ],
    },
    {
      titleKey: 'footer.col.support',
      items: [
        { label: t('footer.link.contacts'), href: homeSectionHref('contacts') },
        { label: t('footer.link.hours'), href: homeSectionHref('contacts') },
      ],
    },
    {
      titleKey: 'footer.col.offices',
      items: [
        { label: cityLabel(t, 'Актау'), href: homeSectionHref('contacts') },
        { label: cityLabel(t, 'Актобе'), href: homeSectionHref('contacts') },
        { label: cityLabel(t, 'Усть-Каменогорск'), href: homeSectionHref('contacts') },
      ],
    },
    {
      titleKey: 'footer.col.paida',
      items: [{ label: t('footer.link.conditions'), href: '#/akcii' }],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Logo fill={logoFill} />
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
            {SOCIAL_NETWORKS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                className="site-footer__social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <SocialIcon id={s.id} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
