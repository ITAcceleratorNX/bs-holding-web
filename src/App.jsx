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
import ProjectPage from './pages/ProjectPage';
import AboutPage from './pages/AboutPage';
import EastonQuizLandingPage from './pages/EastonQuizLandingPage';
import { DEFAULT_FILTER, PROJECTS } from './data/projects';
import { getProjectPage, projectHash } from './data/projectPages';
import { filterProjects } from './utils/format';

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const slug = hash.split(/[/?#]/)[0]?.toLowerCase();
  if (slug === 'about' || slug === 'o-kompanii') {
    return { type: 'about' };
  }
  if (slug === 'easton-quiz') {
    return { type: 'easton-quiz' };
  }
  if (slug && getProjectPage(slug)) {
    return { type: 'project', slug };
  }
  return { type: 'home' };
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [openMenu, setOpenMenu] = useState(null);
  const [headerCity, setHeaderCity] = useState('Актау');
  const [langCur, setLangCur] = useState('RU');
  const [callOpen, setCallOpen] = useState(false);
  const [filter, setFilterState] = useState({ ...DEFAULT_FILTER });
  const [appliedFilter, setAppliedFilter] = useState({ ...DEFAULT_FILTER });
  const [activeTab, setActiveTab] = useState('Central Park');
  const [calcMode, setCalcMode] = useState('Ипотека');
  const [price, setPrice] = useState(15000000);
  const [down, setDown] = useState(7500000);
  const [termY, setTermY] = useState(15);
  const [rate, setRate] = useState(7.5);

  useEffect(() => {
    const onHash = () => {
      // Якорь на текущей странице (пункт меню ЖК-страницы вида #easton-location)
      // не должен переключать маршрут на главную — только прокручивать к блоку.
      // Настоящие маршруты всегда идут с ведущим слэшем (#/slug), поэтому конфликта
      // с якорями секций (id вида "<slug>-location") не возникает.
      const rawSlug = window.location.hash.replace(/^#\/?/, '').split(/[/?#]/)[0];
      const anchorTarget = rawSlug && document.getElementById(rawSlug);
      if (anchorTarget) {
        anchorTarget.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const next = getRoute();
      setRoute(next);
      window.scrollTo(0, 0);
      // After navigating home via #catalog / #paida, scroll to section
      if (next.type === 'home') {
        const raw = window.location.hash.replace(/^#\/?/, '');
        const section = raw.split(/[/?#]/)[0];
        if (section === 'catalog' || section === 'paida' || section === 'top') {
          requestAnimationFrame(() => {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
          });
        }
      }
    };
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
      goHome();
      return;
    }
    window.location.hash = projectHash(slug);
    setRoute({ type: 'project', slug });
    window.scrollTo(0, 0);
  }, [goHome]);

  const toggleMenu = useCallback((key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  }, []);

  const setFilter = useCallback((key, value) => {
    setFilterState((prev) => {
      const next = { ...prev, [key]: value };
      setAppliedFilter(next);
      return next;
    });
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

  const filtered = useMemo(
    () => filterProjects(PROJECTS, appliedFilter),
    [appliedFilter],
  );

  const openCall = useCallback(() => setCallOpen(true), []);
  const closeCall = useCallback(() => setCallOpen(false), []);

  const onOpenProject = useCallback((p) => {
    if (p?.slug) goProject(p.slug);
  }, [goProject]);

  // Форма звонка общая для всех маршрутов: город берётся из шапки (ТЗ 3).
  const callPopup = <CallPopup open={callOpen} onClose={closeCall} city={headerCity} />;

  if (route.type === 'project') {
    const projectData = getProjectPage(route.slug);
    if (!projectData) {
      return null;
    }
    return (
      <>
        <ProjectPage
          key={projectData.slug}
          data={projectData}
          onBack={goHome}
          onOpenCall={openCall}
          onNavigateProject={goProject}
        />
        {callPopup}
      </>
    );
  }

  if (route.type === 'easton-quiz') {
    return (
      <>
        <EastonQuizLandingPage onBack={goHome} onOpenCall={openCall} onNavigateProject={goProject} />
        {callPopup}
      </>
    );
  }

  if (route.type === 'about') {
    return (
      <>
        <AboutPage
          headerCity={headerCity}
          setHeaderCity={setHeaderCity}
          langCur={langCur}
          setLangCur={setLangCur}
          openMenu={openMenu}
          toggleMenu={toggleMenu}
          onOpenCall={openCall}
          onOpenProject={onOpenProject}
          onGoHome={goHome}
        />
        {callPopup}
      </>
    );
  }

  return (
    <>
      <Header
        showTopBar
        headerCity={headerCity}
        setHeaderCity={setHeaderCity}
        langCur={langCur}
        setLangCur={setLangCur}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        onOpenCall={openCall}
        onLogoClick={goHome}
      />
      <div className="page">
        <Hero onOpenCall={openCall} />
        <Catalog
          filter={filter}
          setFilter={setFilter}
          openMenu={openMenu}
          toggleMenu={toggleMenu}
          applyFilter={applyFilter}
          resetFilter={resetFilter}
          filtered={filtered}
          onOpenProject={onOpenProject}
        />
        <Featured activeTab={activeTab} setActiveTab={setActiveTab} />
        <Paida onOpenCall={openCall} />
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
        />
        <Banks />
        <Consultation />
        <Commercial />
        <Contacts />
        <Footer />
      </div>
      {callPopup}
    </>
  );
}
