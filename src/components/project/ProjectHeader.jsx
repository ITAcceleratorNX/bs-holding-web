import { useEffect, useState } from 'react';
import Dropdown from '../Dropdown';
import Logo from '../Logo';
import PhoneLink from '../lead/PhoneLink';
import { useI18n } from '../../i18n/I18nContext';

const LANGS = ['RU', 'KZ', 'EN'];

export default function ProjectHeader({
  data,
  onBack,
  onOpenCall,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  closeMenu,
}) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`easton-header${scrolled ? ' easton-header--scrolled' : ''}${mobileOpen ? ' easton-header--menu-open' : ''}`}
      >
        <div className="easton-header__inner">
          <div className="easton-header__left">
            <button type="button" className="easton-header__logo" onClick={onBack} aria-label={t('project.back')}>
              <Logo fill="#fff" />
            </button>
            <nav className="easton-header__nav">
              {data.nav.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.labelKey ? t(item.labelKey) : item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="easton-header__right">
            {/* Номер(а) берём записью: у ЖК со своим колл-центром линий несколько. */}
            <PhoneLink
              href={data.phoneHref}
              phone={data.phones}
              city={data.city}
              ctaLocation="Шапка страницы ЖК"
              className="easton-header__phone"
            />
            <button type="button" className="easton-btn easton-btn--light easton-header__call" onClick={onOpenCall}>
              {t('project.call')}
            </button>
            {langCur && setLangCur && (
              <Dropdown
                variant="dark"
                current={langCur}
                open={openMenu === 'plang'}
                onToggle={() => toggleMenu?.('plang')}
                options={LANGS}
                onSelect={(o) => {
                  setLangCur(o);
                  toggleMenu?.(null);
                }}
                onClose={closeMenu}
                className="easton-header__lang"
              />
            )}
            <button
              type="button"
              className={`easton-header__burger${mobileOpen ? ' is-open' : ''}`}
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className={`easton-header__drawer${mobileOpen ? ' is-open' : ''}`}>
          <nav className="easton-header__drawer-nav">
            {data.nav.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMobile}>
                {item.labelKey ? t(item.labelKey) : item.label}
              </a>
            ))}
          </nav>
          <PhoneLink
            href={data.phoneHref}
            phone={data.phones}
            city={data.city}
            ctaLocation="Мобильное меню страницы ЖК"
            className="easton-header__drawer-phone"
            onClick={closeMobile}
          />
          <button
            type="button"
            className="easton-btn easton-btn--light"
            onClick={() => {
              closeMobile();
              onOpenCall();
            }}
          >
            {t('project.call')}
          </button>
        </div>
      </header>
      {mobileOpen && (
        <button type="button" className="easton-header__backdrop" aria-label={t('nav.closeMenu')} onClick={closeMobile} />
      )}
    </>
  );
}
