import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';
import Logo from './Logo';
import { phoneForCity } from '../data/phones';

const NAV_ITEMS = [
  { label: 'Главная', href: '#top', active: true },
  { label: 'Жилые комплексы', href: '#catalog', active: false },
  { label: 'О компании', href: '#', active: false },
  { label: 'Акции и предложения', href: '#paida', active: false },
];

const CITIES = ['Актау', 'Актобе', 'Усть-Каменогорск'];
const LANGS = ['RU', 'KZ', 'EN'];

export default function Header({
  showTopBar,
  headerCity,
  setHeaderCity,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  onOpenCall,
}) {
  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [spacerH, setSpacerH] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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
  }, [showTopBar, mobileOpen]);

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

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header${scrolled ? ' site-header--scrolled' : ''}${mobileOpen ? ' site-header--menu-open' : ''}`}
      >
        {showTopBar && (
          <div className="site-header__promo">
            <span className="site-header__promo-text">
              Рассрочка на жилой комплекс White Hill начинается с 23 января
            </span>
            <a href="#/white-hill" className="site-header__promo-link" onClick={closeMobile}>
              Подробнее →
            </a>
          </div>
        )}
        <div className="site-header__bar">
          <a href="#top" aria-label="BS Holding" className="site-header__logo" onClick={closeMobile}>
            <Logo />
          </a>
          <nav className="site-header__nav" aria-label="Основная навигация">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`site-header__nav-link${item.active ? ' is-active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="site-header__actions">
            <a href={cityPhone.href} className="site-header__phone">{cityPhone.display}</a>
            <Dropdown
              current={headerCity}
              open={openMenu === 'hcity'}
              onToggle={() => toggleMenu('hcity')}
              options={CITIES}
              onSelect={(o) => { setHeaderCity(o); toggleMenu(null); }}
            />
            <Dropdown
              current={langCur}
              open={openMenu === 'lang'}
              onToggle={() => toggleMenu('lang')}
              options={LANGS}
              onSelect={(o) => { setLangCur(o); toggleMenu(null); }}
            />
            <button type="button" className="btn-outline site-header__call" onClick={onOpenCall}>
              Заказать звонок
            </button>
          </div>
          <button
            type="button"
            className={`site-header__burger${mobileOpen ? ' is-open' : ''}`}
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`site-header__drawer${mobileOpen ? ' is-open' : ''}`} id="mobile-nav">
          <nav className="site-header__drawer-nav" aria-label="Мобильная навигация">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`site-header__drawer-link${item.active ? ' is-active' : ''}`}
                onClick={closeMobile}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href={cityPhone.href} className="site-header__drawer-phone" onClick={closeMobile}>
            {cityPhone.display}
          </a>
          <div className="site-header__drawer-row">
            <Dropdown
              current={headerCity}
              open={openMenu === 'mcity'}
              onToggle={() => toggleMenu('mcity')}
              options={CITIES}
              onSelect={(o) => { setHeaderCity(o); toggleMenu(null); }}
            />
            <Dropdown
              current={langCur}
              open={openMenu === 'mlang'}
              onToggle={() => toggleMenu('mlang')}
              options={LANGS}
              onSelect={(o) => { setLangCur(o); toggleMenu(null); }}
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
            Заказать звонок
          </button>
        </div>
      </header>
      {mobileOpen && (
        <button
          type="button"
          className="site-header__backdrop"
          aria-label="Закрыть меню"
          onClick={closeMobile}
        />
      )}
      <div className="site-header-spacer" style={{ height: spacerH }} aria-hidden="true" />
    </>
  );
}
