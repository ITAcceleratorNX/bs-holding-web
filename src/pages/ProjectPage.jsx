import { useState } from 'react';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectHero from '../components/project/ProjectHero';
import ProjectAbout from '../components/project/ProjectAbout';
import ProjectStandards from '../components/project/ProjectStandards';
import ProjectLocation from '../components/project/ProjectLocation';
import ProjectArchitecture from '../components/project/ProjectArchitecture';
import ProjectYard from '../components/project/ProjectYard';
import ProjectPlayground from '../components/project/ProjectPlayground';
import ProjectKids from '../components/project/ProjectKids';
import ProjectGym from '../components/project/ProjectGym';
import ProjectHall from '../components/project/ProjectHall';
import ProjectApartments from '../components/project/ProjectApartments';
import ProjectFloorPlans from '../components/project/ProjectFloorPlans';
import ProjectApartmentQuiz from '../components/project/ProjectApartmentQuiz';
import ProjectParking from '../components/project/ProjectParking';
import ProjectBoxroom from '../components/project/ProjectBoxroom';
import ProjectExtras from '../components/project/ProjectExtras';
import ProjectConsultForm from '../components/project/ProjectConsultForm';
import ProjectFooter from '../components/project/ProjectFooter';
import ProjectCalcPopup from '../components/project/ProjectCalcPopup';
import ProjectCatalogPopup from '../components/project/ProjectCatalogPopup';

export default function ProjectPage({ data, onBack, onOpenCall, onNavigateProject }) {
  const accent = data.theme?.accent ?? '#61D0C5';
  const accentDark = data.theme?.accentDark ?? '#1F6059';
  const [calcOpen, setCalcOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const scrollToConsult = () => {
    document.getElementById(`${data.slug}-consult`)?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Планировки и следующий за ними квиз по умолчанию идут после архитектуры,
   * но страница может сдвинуть их ниже блока «Квартиры» (`plansPlacement`).
   */
  const plansBlock = (
    <>
      {data.floorPlans && <ProjectFloorPlans data={data} onScrollToConsult={scrollToConsult} />}
      <ProjectApartmentQuiz data={data} />
    </>
  );
  const plansAfterApartments = data.plansPlacement === 'after-apartments';

  return (
    <>
      <ProjectHeader data={data} onBack={onBack} onOpenCall={onOpenCall} />
      <div
        className="page easton-page"
        style={{
          '--project-accent': accent,
          '--project-accent-dark': accentDark,
        }}
      >
        <ProjectHero data={data} onScrollToConsult={scrollToConsult} onOpenCatalog={() => setCatalogOpen(true)} />
        <ProjectAbout data={data} />
        <ProjectStandards data={data} />
        <ProjectLocation data={data} onOpenCalc={() => setCalcOpen(true)} />
        <ProjectArchitecture data={data} onScrollToConsult={scrollToConsult} />
        {!plansAfterApartments && plansBlock}
        {data.yard && <ProjectYard data={data} />}
        {data.playground && <ProjectPlayground data={data} onScrollToConsult={scrollToConsult} />}
        {data.kids && <ProjectKids data={data} />}
        {data.gym && <ProjectGym data={data} />}
        {data.hall && <ProjectHall data={data} />}
        {data.apartments && <ProjectApartments data={data} onScrollToConsult={scrollToConsult} />}
        {plansAfterApartments && plansBlock}
        {data.parking && <ProjectParking data={data} onOpenCatalog={() => setCatalogOpen(true)} />}
        {data.extras ? <ProjectExtras data={data} /> : data.boxroom ? <ProjectBoxroom data={data} /> : null}
        <ProjectConsultForm data={data} />
        <ProjectFooter data={data} onBack={onBack} onNavigateProject={onNavigateProject} />
        <ProjectCalcPopup
          open={calcOpen}
          onClose={() => setCalcOpen(false)}
          projectName={data.consult?.projectName ?? data.name}
          city={data.consult?.city ?? data.city}
          areaRanges={data.calcAreas}
        />
        <ProjectCatalogPopup
          open={catalogOpen}
          onClose={() => setCatalogOpen(false)}
          projectName={data.consult?.projectName ?? data.name}
          city={data.consult?.city ?? data.city}
          whatsappPhone={data.whatsappPhone}
        />
      </div>
    </>
  );
}
