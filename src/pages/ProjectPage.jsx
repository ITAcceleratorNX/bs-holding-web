import { useCallback, useState } from 'react';
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
import LeadPopup from '../components/lead/LeadPopup';

export default function ProjectPage({
  data,
  onBack,
  onOpenCall,
  onNavigateProject,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  closeMenu,
}) {
  const accent = data.theme?.accent ?? '#61D0C5';
  const accentDark = data.theme?.accentDark ?? '#1F6059';

  /**
   * Открытая форма: код формы и расположение кнопки, которая её вызвала (ТЗ 3, 4).
   * Одно состояние на все всплывающие формы страницы — форма монтируется при
   * открытии, поэтому поля и статус отправки всегда чистые.
   * @type {[{ formCode: string, ctaLocation: string }|null, Function]}
   */
  const [lead, setLead] = useState(null);

  const openLead = useCallback((formCode, ctaLocation) => setLead({ formCode, ctaLocation }), []);
  const closeLead = useCallback(() => setLead(null), []);

  const projectName = data.consult?.projectName ?? data.name;
  const city = data.consult?.city ?? data.city;

  const scrollToConsult = useCallback(() => {
    document.getElementById(`${data.slug}-consult`)?.scrollIntoView({ behavior: 'smooth' });
  }, [data.slug]);

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
      <ProjectHeader
        data={data}
        onBack={onBack}
        onOpenCall={onOpenCall}
        langCur={langCur}
        setLangCur={setLangCur}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />
      <div
        className="page easton-page"
        style={{
          '--project-accent': accent,
          '--project-accent-dark': accentDark,
        }}
      >
        <ProjectHero
          data={data}
          onRequestApplication={() => openLead('zhk_hero_application', 'Первый экран')}
          onRequestPresentation={() => openLead('presentation_download', 'Первый экран')}
        />
        <ProjectAbout data={data} />
        <ProjectStandards data={data} />
        <ProjectLocation data={data} onOpenCalc={() => openLead('zhk_calculation', 'Блок «Локация»')} />
        <ProjectArchitecture data={data} onRequestTour={() => openLead('tour_booking', 'Блок «Архитектура»')} />
        {!plansAfterApartments && plansBlock}
        {data.yard && <ProjectYard data={data} />}
        {data.playground && (
          <ProjectPlayground
            data={data}
            onRequestConsult={() => openLead('zhk_consultation', 'Блок «Игровая площадка»')}
          />
        )}
        {data.kids && <ProjectKids data={data} />}
        {data.gym && <ProjectGym data={data} />}
        {data.hall && <ProjectHall data={data} />}
        {data.apartments && (
          <ProjectApartments
            data={data}
            onRequestConsult={() => openLead('zhk_consultation', 'Блок «Квартиры»')}
          />
        )}
        {plansAfterApartments && plansBlock}
        {data.parking && (
          <ProjectParking data={data} onOpenCatalog={() => openLead('catalog_download', 'Блок «Паркинг»')} />
        )}
        {data.extras ? <ProjectExtras data={data} /> : data.boxroom ? <ProjectBoxroom data={data} /> : null}
        <ProjectConsultForm data={data} />
        <ProjectFooter data={data} onBack={onBack} onNavigateProject={onNavigateProject} />

        {/* Форма «Получить расчет» отличается дополнительным полем квадратуры. */}
        {lead?.formCode === 'zhk_calculation' ? (
          <ProjectCalcPopup
            open
            onClose={closeLead}
            projectName={projectName}
            city={city}
            areaRanges={data.calcAreas}
            ctaLocation={lead.ctaLocation}
          />
        ) : lead ? (
          <LeadPopup
            open
            onClose={closeLead}
            formCode={lead.formCode}
            project={projectName}
            city={city}
            ctaLocation={lead.ctaLocation}
          />
        ) : null}
      </div>
    </>
  );
}
