import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';
import Logo from './Logo';
import { cityLabel } from '../data/cities';
import { phoneForCity } from '../data/phones';
import { CITIES } from '../data/projects';
import PhoneLink from './lead/PhoneLink';
import { useI18n } from '../i18n/I18nContext';
import { homeSectionHref } from '../utils/navigation';

const NAV_ITEMS = [
  { labelKey: 'nav.home', href: '#/', key: 'home' },
  { labelKey: 'nav.catalog', href: homeSectionHref('catalog'), key: 'catalog' },
  { labelKey: 'nav.about', href: '#/about', key: 'about' },
  { labelKey: 'nav.promotions', href: '#/akcii', key: 'akcii' },
];

const LANGS = ['RU', 'KZ', 'EN'];

function navKeyFromHash() {
  const path = (window.location.hash || '').replace(/^#\/?/, '').split(/[/?#]/)[0]?.toLowerCase() || '';
  if (path === 'about' || path === 'o-kompanii') return 'about';
  if (path === 'akcii' || path === 'promotions') return 'akcii';
  if (path === 'catalog') return 'catalog';
  if (path && path !== 'top') return 'catalog';
  return 'home';
}

function isHomeSurface() {
  const path = (window.location.hash || '').replace(/^#\/?/, '').split(/[/?#]/)[0]?.toLowerCase() || '';
  return !path || path === 'top' || path === 'catalog';
}

function navKeyFromProp(activeNav, t) {
  if (!activeNav) return null;
  const match = NAV_ITEMS.find((item) => t(item.labelKey) === activeNav || item.key === activeNav);
  return match?.key ?? null;
}

export default function Header({
  showTopBar,
  overlay = false,
  activeNav,
  headerCity,
  setHeaderCity,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  closeMenu = () => {},
  onOpenCall,
  onLogoClick,
}) {
  const { t } = useI18n();
  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [spacerH, setSpacerH] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(() => navKeyFromProp(activeNav, t) || navKeyFromHash());

  useEffect(() => {
    const syncFromLocation = () => {
      if (!isHomeSurface()) {
        const fromProp = navKeyFromProp(activeNav, t);
        setActiveKey(fromProp || navKeyFromHash());
        return;
      }

      const headerH = headerRef.current?.offsetHeight ?? 100;
      const line = window.scrollY + headerH + 48;
      let next = 'home';
      for (const section of [{ id: 'catalog', key: 'catalog' }]) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= line) next = section.key;
      }
      setActiveKey(next);
    };

    syncFromLocation();
    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('scroll', syncFromLocation, { passive: true });
    return () => {
      window.removeEventListener('hashchange', syncFromLocation);
      window.removeEventListener('scroll', syncFromLocation);
    };
  }, [activeNav, t]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const sync = () => setSpacerH(el.offsetHeight);
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showTopBar, mobileOpen, overlay]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
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
  const cityPhone = phoneForCity(headerCity);
  const logoFill = overlay && !mobileOpen ? '#fff' : 'black';
  const isOverlayIdle = overlay && !scrolled && !mobileOpen;

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    label: t(item.labelKey),
    active: item.key === activeKey,
  }));

  const handleLogoClick = (e) => {
    closeMobile();
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'site-header',
          scrolled ? 'site-header--scrolled' : '',
          mobileOpen ? 'site-header--menu-open' : '',
          overlay ? 'site-header--overlay' : '',
          isOverlayIdle ? 'site-header--overlay-idle' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {showTopBar && (
          <div className="site-header__promo">
            <span className="site-header__promo-text">{t('promo.text')}</span>
            <a href="#/white-hill" className="site-header__promo-link" onClick={closeMobile}>
              {t('promo.link')}
            </a>
          </div>
        )}
        <div className="site-header__bar">
          <a href="#/" aria-label="BS Holding" className="site-header__logo" onClick={handleLogoClick}>
            <Logo fill={logoFill} />
          </a>
          <nav className="site-header__nav" aria-label={t('nav.home')}>
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`site-header__nav-link${item.active ? ' is-active' : ''}`}
                onClick={closeMobile}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="site-header__actions">
            <PhoneLink href={cityPhone.href} city={headerCity} ctaLocation="Шапка сайта" className="site-header__phone" />
            <Dropdown
              current={headerCity}
              open={openMenu === 'hcity'}
              onToggle={() => toggleMenu('hcity')}
              options={CITIES.map((c) => ({ value: c, label: cityLabel(t, c) }))}
              onSelect={(o) => { setHeaderCity(o); toggleMenu(null); }}
              onClose={closeMenu}
            />
            <Dropdown
              current={langCur}
              open={openMenu === 'lang'}
              onToggle={() => toggleMenu('lang')}
              options={LANGS}
              onSelect={(o) => { setLangCur(o); toggleMenu(null); }}
              onClose={closeMenu}
            />
            <button type="button" className="btn-outline site-header__call" onClick={onOpenCall}>
              {t('nav.call')}
            </button>
          </div>
          <button
            type="button"
            className={`site-header__burger${mobileOpen ? ' is-open' : ''}`}
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`site-header__drawer${mobileOpen ? ' is-open' : ''}`} id="mobile-nav">
          <nav className="site-header__drawer-nav" aria-label={t('nav.openMenu')}>
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`site-header__drawer-link${item.active ? ' is-active' : ''}`}
                onClick={closeMobile}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <PhoneLink
            href={cityPhone.href}
            city={headerCity}
            ctaLocation="Мобильное меню"
            className="site-header__drawer-phone"
            onClick={closeMobile}
          />
          <div className="site-header__drawer-row">
            <Dropdown
              current={headerCity}
              open={openMenu === 'mcity'}
              onToggle={() => toggleMenu('mcity')}
              options={CITIES.map((c) => ({ value: c, label: cityLabel(t, c) }))}
              onSelect={(o) => { setHeaderCity(o); toggleMenu(null); }}
              onClose={closeMenu}
            />
            <Dropdown
              current={langCur}
              open={openMenu === 'mlang'}
              onToggle={() => toggleMenu('mlang')}
              options={LANGS}
              onSelect={(o) => { setLangCur(o); toggleMenu(null); }}
              onClose={closeMenu}
            />
          </div>
          <button
            type="button"
            className="btn-primary site-header__drawer-cta"
            onClick={() => {
              closeMobile();
              onOpenCall();
            }}
          >
            {t('nav.call')}
          </button>
        </div>
      </header>
      {mobileOpen && (
        <button
          type="button"
          className="site-header__backdrop"
          aria-label={t('nav.closeMenu')}
          onClick={closeMobile}
        />
      )}
      {!overlay && <div className="site-header-spacer" style={{ height: spacerH }} aria-hidden="true" />}
    </>
  );
}
