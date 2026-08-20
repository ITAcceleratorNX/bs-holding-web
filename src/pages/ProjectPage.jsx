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
import ProjectAutonomy from '../components/project/ProjectAutonomy';
import ProjectConsultForm from '../components/project/ProjectConsultForm';
import ProjectFooter from '../components/project/ProjectFooter';
import ProjectCalcPopup from '../components/project/ProjectCalcPopup';
import LeadPopup from '../components/lead/LeadPopup';
import { useProjectData } from '../i18n/useProjectData';

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
  const d = useProjectData(data);
  const accent = d.theme?.accent ?? '#61D0C5';
  const accentDark = d.theme?.accentDark ?? '#1F6059';

  /**
   * Открытая форма: код формы и расположение кнопки, которая её вызвала (ТЗ 3, 4).
   * Одно состояние на все всплывающие формы страницы — форма монтируется при
   * открытии, поэтому поля и статус отправки всегда чистые.
   * @type {[{ formCode: string, ctaLocation: string }|null, Function]}
   */
  const [lead, setLead] = useState(null);

  const openLead = useCallback((formCode, ctaLocation) => setLead({ formCode, ctaLocation }), []);
  const closeLead = useCallback(() => setLead(null), []);

  const projectName = d.consult?.projectName ?? d.name;
  const city = d.consult?.city ?? d.city;

  const scrollToConsult = useCallback(() => {
    document.getElementById(`${data.slug}-consult`)?.scrollIntoView({ behavior: 'smooth' });
  }, [data.slug]);

  /**
   * Планировки и следующий за ними квиз по умолчанию идут после архитектуры,
   * но страница может сдвинуть их ниже блока «Квартиры» (`plansPlacement`).
   */
  const plansBlock = (
    <>
      {d.floorPlans && <ProjectFloorPlans data={d} onScrollToConsult={scrollToConsult} />}
      {d.showQuiz !== false && <ProjectApartmentQuiz data={d} />}
    </>
  );
  const plansAfterApartments = d.plansPlacement === 'after-apartments';

  return (
    <>
      <ProjectHeader
        data={d}
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
          data={d}
          onRequestApplication={() => openLead('zhk_hero_application', 'Первый экран')}
          onRequestPresentation={() => openLead('presentation_download', 'Первый экран')}
        />
        <ProjectAbout data={d} />
        <ProjectStandards data={d} />
        <ProjectLocation data={d} onOpenCalc={() => openLead('zhk_calculation', 'Блок «Локация»')} />
        <ProjectArchitecture data={d} onRequestTour={() => openLead('tour_booking', 'Блок «Архитектура»')} />
        <ProjectAutonomy data={d} />
        {!plansAfterApartments && plansBlock}
        {d.yard && <ProjectYard data={d} />}
        {d.playground && (
          <ProjectPlayground
            data={d}
            onRequestConsult={() => openLead('zhk_consultation', 'Блок «Игровая площадка»')}
          />
        )}
        {d.kids && <ProjectKids data={d} />}
        {d.gym && <ProjectGym data={d} />}
        {d.hall && <ProjectHall data={d} />}
        {d.apartments && (
          <ProjectApartments
            data={d}
            onRequestConsult={() => openLead('zhk_consultation', 'Блок «Квартиры»')}
          />
        )}
        {plansAfterApartments && plansBlock}
        {d.parking && (
          <ProjectParking data={d} onOpenCatalog={() => openLead('catalog_download', 'Блок «Паркинг»')} />
        )}
        {d.extras ? <ProjectExtras data={d} /> : d.boxroom ? <ProjectBoxroom data={d} /> : null}
        <ProjectConsultForm data={d} />
        <ProjectFooter data={d} onBack={onBack} onNavigateProject={onNavigateProject} />

        {/* Форма «Получить расчет» отличается дополнительным полем квадратуры. */}
        {lead?.formCode === 'zhk_calculation' ? (
          <ProjectCalcPopup
            open
            onClose={closeLead}
            projectName={projectName}
            city={city}
            areaRanges={d.calcAreas}
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
