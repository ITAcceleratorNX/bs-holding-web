import { FOOTER_COLS, SOCIALS, SOCIAL_LINKS } from '../data/projects';
import { projectHash, projectSlugFromName } from '../data/projectPages';
import { useI18n } from '../i18n/I18nContext';
import Logo from './Logo';

const FOOTER_HREFS = {
  'О нас': '#/about',
  'Вакансии': 'mailto:bsholding@gmail.com?subject=Вакансии BS Holding',
  'Новости': '#/news',
  'Контакты': '#contacts',
  'График работы': '#contacts',
  'Актау': '#contacts',
  'Актобе': '#contacts',
  'Усть-Каменогорск': '#contacts',
  'Рассрочка': '#paida',
  'Ипотека': '#catalog',
  'Условия': '#/akcii',
};

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Logo fill="#fff" />
        <div className="site-footer__cols">
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="site-footer__col">
              <div className="site-footer__col-title">{col.title}</div>
              <div className="site-footer__links">
                {col.items.map((item) => {
                  const slug = col.title === 'Проекты' ? projectSlugFromName(item) : null;
                  const href = slug ? projectHash(slug) : (FOOTER_HREFS[item] ?? '#');
                  return (
                    <a key={item} href={href}>
                      {item}
                    </a>
                  );
                })}
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
