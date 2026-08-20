import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Featured from './components/Featured';
import Paida from './components/Paida';
import Calculator from './components/Calculator';
import Banks from './components/Banks';
import Consultation from './components/Consultation';
import Commercial from './components/Commercial';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import CallPopup from './components/CallPopup';
import DocumentTitle from './components/DocumentTitle';
import ProjectPage from './pages/ProjectPage';
import AboutPage from './pages/AboutPage';
import EastonQuizLandingPage from './pages/EastonQuizLandingPage';
import PromotionsPage from './pages/PromotionsPage';
import NotFoundPage from './pages/NotFoundPage';
import { I18nProvider, useInitialLang, useI18n } from './i18n/I18nContext';
import { SHOW_CALCULATORS } from './config/features';
import { cityLabel } from './data/cities';
import { ALL_CITIES, CITIES, DEFAULT_FILTER, PROJECTS } from './data/projects';
import { getProjectPage, projectHash } from './data/projectPages';
import { filterProjects } from './utils/format';
import { HOME_SECTIONS } from './utils/navigation';

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const slug = hash.split(/[/?#]/)[0]?.toLowerCase();
  if (!slug || slug === 'top') {
    return { type: 'home', section: slug === 'top' ? 'top' : null };
  }
  if (HOME_SECTIONS.has(slug)) {
    return { type: 'home', section: slug };
  }
  if (slug === 'about' || slug === 'o-kompanii') {
    return { type: 'about' };
  }
  if (slug === 'easton-quiz') {
    return { type: 'easton-quiz' };
  }
  if (slug === 'akcii' || slug === 'promotions') {
    return { type: 'promotions' };
  }
  if (slug === 'news' || slug === 'novosti') {
    return { type: 'promotions' };
  }
  if (slug && getProjectPage(slug)) {
    return { type: 'project', slug };
  }
  if (slug) {
    return { type: 'not-found', slug };
  }
  return { type: 'home', section: null };
}

export const DEFAULT_CALC = {
  calcMode: 'Ипотека',
  price: 15000000,
  down: 7500000,
  termY: 15,
  rate: 7.5,
};

function AppRoutes({ langCur, setLangCur }) {
  const [route, setRoute] = useState(getRoute);
  const [openMenu, setOpenMenu] = useState(null);
  const [headerCity, setHeaderCityState] = useState('Актау');
  const [callOpen, setCallOpen] = useState(false);
  const [filter, setFilterState] = useState({ ...DEFAULT_FILTER });
  const [appliedFilter, setAppliedFilter] = useState({ ...DEFAULT_FILTER });
  const [activeTab, setActiveTab] = useState('Central Park');
  const [calcMode, setCalcMode] = useState(DEFAULT_CALC.calcMode);
  const [price, setPrice] = useState(DEFAULT_CALC.price);
  const [down, setDown] = useState(DEFAULT_CALC.down);
  const [termY, setTermY] = useState(DEFAULT_CALC.termY);
  const [rate, setRate] = useState(DEFAULT_CALC.rate);

  useEffect(() => {
    const scrollHomeSection = (section) => {
      if (!section) return;
      requestAnimationFrame(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      });
    };

    const onHash = () => {
      const rawSlug = window.location.hash.replace(/^#\/?/, '').split(/[/?#]/)[0];
      const anchorTarget = rawSlug && document.getElementById(rawSlug);
      if (anchorTarget) {
        anchorTarget.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const next = getRoute();
      setRoute(next);
      window.scrollTo(0, 0);
      if (next.type === 'home' && next.section) {
        scrollHomeSection(next.section);
      }
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goHome = useCallback(() => {
    window.location.hash = '';
    setRoute({ type: 'home' });
    window.scrollTo(0, 0);
  }, []);

  const goProject = useCallback((slug) => {
    const page = getProjectPage(slug);
    if (!page) {
      window.location.hash = '#/404';
      setRoute({ type: 'not-found', slug });
      return;
    }
    window.location.hash = projectHash(slug);
    setRoute({ type: 'project', slug });
    window.scrollTo(0, 0);
  }, []);

  const toggleMenu = useCallback((key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  }, []);

  // Город в шапке — это выбор «мой город»: он задаёт номер телефона, город
  // заявки и подборку ЖК. Каталог фильтруется тем же городом, иначе выбор в
  // верхней панели ничего не меняет в списке комплексов.
  const setHeaderCity = useCallback((city) => {
    setHeaderCityState(city);
    setFilterState((prev) => ({ ...prev, city }));
    setAppliedFilter((prev) => ({ ...prev, city }));
    setOpenMenu(null);
  }, []);

  const closeMenu = useCallback(() => setOpenMenu(null), []);

  const setFilter = useCallback((key, value) => {
    setFilterState((prev) => {
      const next = { ...prev, [key]: value };
      setAppliedFilter(next);
      return next;
    });
    // Обратная связь: город, выбранный в каталоге, становится городом шапки —
    // два выпадающих списка не должны показывать разные города. «Все города»
    // городом не является, поэтому телефон и город заявки остаются прежними.
    if (key === 'city' && value !== ALL_CITIES) setHeaderCityState(value);
    setOpenMenu(null);
  }, []);

  const applyFilter = useCallback(() => {
    setAppliedFilter({ ...filter });
    setOpenMenu(null);
  }, [filter]);

  const resetFilter = useCallback(() => {
    const d = { ...DEFAULT_FILTER };
    setFilterState(d);
    setAppliedFilter(d);
    setOpenMenu(null);
  }, []);

  const resetCalculator = useCallback(() => {
    setCalcMode(DEFAULT_CALC.calcMode);
    setPrice(DEFAULT_CALC.price);
    setDown(DEFAULT_CALC.down);
    setTermY(DEFAULT_CALC.termY);
    setRate(DEFAULT_CALC.rate);
  }, []);

  const { t } = useI18n();

  const filterSpec = useMemo(() => [
    ['city', [
      { value: ALL_CITIES, label: t('filter.allCities') },
      ...CITIES.map((c) => ({ value: c, label: cityLabel(t, c) })),
    ]],
    ['klass', [
      { value: 'Все классы', label: t('filter.allClasses') },
      { value: 'Премиум', label: t('klass.premium') },
      { value: 'Бизнес', label: t('klass.business') },
      { value: 'Бизнес+', label: t('klass.businessPlus') },
      { value: 'Комфорт', label: t('klass.comfort') },
      { value: 'Комфорт+', label: t('klass.comfortPlus') },
    ]],
    ['term', [
      { value: 'Любой срок', label: t('filter.anyTerm') },
      { value: 'Сдан', label: t('filter.delivered') },
      { value: '2026 год', label: t('filter.year2026') },
    ]],
    ['floor', [
      { value: 'Любой этаж', label: t('filter.anyFloor') },
      { value: 'до 5 этажей', label: t('filter.floor5') },
      { value: '5–10 этажей', label: t('filter.floor5to10') },
      { value: '10 и выше', label: t('filter.floor10plus') },
    ]],
    ['rooms', [
      { value: 'Все комнаты', label: t('filter.allRooms') },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ]],
  ], [t]);

  const projectsWithFrom = useMemo(
    () => PROJECTS.map((p) => ({ ...p, priceFrom: t('catalog.price.from') })),
    [t],
  );

  const filtered = useMemo(
    () => filterProjects(projectsWithFrom, appliedFilter),
    [projectsWithFrom, appliedFilter],
  );

  const openCall = useCallback(() => setCallOpen(true), []);
  const closeCall = useCallback(() => setCallOpen(false), []);

  const onOpenProject = useCallback((p) => {
    if (p?.slug) goProject(p.slug);
  }, [goProject]);

  const callPopup = <CallPopup open={callOpen} onClose={closeCall} city={headerCity} />;

  const sharedHeaderProps = {
    headerCity,
    setHeaderCity,
    langCur,
    setLangCur,
    openMenu,
    toggleMenu,
    closeMenu,
    onOpenCall: openCall,
    onLogoClick: goHome,
  };

  let pageContent;

  if (route.type === 'project') {
    const projectData = getProjectPage(route.slug);
    if (!projectData) {
      pageContent = <NotFoundPage onGoHome={goHome} />;
    } else {
      pageContent = (
        <>
          <ProjectPage
            key={projectData.slug}
            data={projectData}
            onBack={goHome}
            onOpenCall={openCall}
            onNavigateProject={goProject}
            langCur={langCur}
            setLangCur={setLangCur}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            closeMenu={closeMenu}
          />
          {callPopup}
        </>
      );
    }
  } else if (route.type === 'easton-quiz') {
    pageContent = (
      <>
        <EastonQuizLandingPage onBack={goHome} onOpenCall={openCall} onNavigateProject={goProject} />
        {callPopup}
      </>
    );
  } else if (route.type === 'about') {
    pageContent = (
      <>
        <AboutPage
          {...sharedHeaderProps}
          onOpenProject={onOpenProject}
          onGoHome={goHome}
        />
        {callPopup}
      </>
    );
  } else if (route.type === 'promotions') {
    pageContent = (
      <>
        <PromotionsPage {...sharedHeaderProps} onGoHome={goHome} />
        {callPopup}
      </>
    );
  } else if (route.type === 'not-found') {
    pageContent = (
      <>
        <Header {...sharedHeaderProps} />
        <NotFoundPage onGoHome={goHome} />
        {callPopup}
      </>
    );
  } else {
    pageContent = (
      <>
        <Header showTopBar {...sharedHeaderProps} />
        <div className="page">
          <Hero />
          <Catalog
            filter={filter}
            filterSpec={filterSpec}
            setFilter={setFilter}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            closeMenu={closeMenu}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
            filtered={filtered}
            onOpenProject={onOpenProject}
          />
          <Featured activeTab={activeTab} setActiveTab={setActiveTab} />
          <Paida onOpenCall={openCall} />
          {SHOW_CALCULATORS && (
            <Calculator
              city={headerCity}
              lang={langCur}
              calcMode={calcMode}
              setCalcMode={setCalcMode}
              price={price}
              setPrice={setPrice}
              down={down}
              setDown={setDown}
              termY={termY}
              setTermY={setTermY}
              rate={rate}
              setRate={setRate}
              onReset={resetCalculator}
            />
          )}
          <Banks />
          <Consultation />
          <Commercial />
          <Contacts headerCity={headerCity} />
        </div>
        <Footer />
        {callPopup}
      </>
    );
  }

  return (
    <>
      <DocumentTitle route={route} />
      {pageContent}
    </>
  );
}

export default function App() {
  const [langCur, setLangCur] = useState(useInitialLang);

  return (
    <I18nProvider lang={langCur} setLang={setLangCur}>
      <AppRoutes langCur={langCur} setLangCur={setLangCur} />
    </I18nProvider>
  );
}
