import { useCallback, useState } from 'react';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectHero from '../components/project/ProjectHero';
import ProjectAbout from '../components/project/ProjectAbout';
import ProjectStandards from '../components/project/ProjectStandards';
import ProjectLocation from '../components/project/ProjectLocation';
import ProjectApartmentQuiz from '../components/project/ProjectApartmentQuiz';
import Footer from '../components/Footer';
import LeadPopup from '../components/lead/LeadPopup';
import { EASTON_QUIZ_LANDING } from '../data/eastonQuizLanding';
import { useProjectData } from '../i18n/useProjectData';

/**
 * Короткая посадочная страница «Easton — квиз» для рекламного трафика (ТЗ).
 *
 * Минимум блоков действующей страницы Easton + пятишаговый квиз в конце.
 * Полную страницу ЖК не заменяет и не переиспользует — отдельный маршрут
 * `#/easton-quiz`, подключённый в `App.jsx`.
 */
export default function EastonQuizLandingPage({ onBack, onOpenCall, onNavigateProject }) {
  const data = useProjectData(EASTON_QUIZ_LANDING);
  const accent = data.theme?.accent ?? '#61D0C5';
  const accentDark = data.theme?.accentDark ?? '#1F6059';

  /** Та же схема попапа, что и на полной странице ЖК: код формы + место вызова. */
  const [lead, setLead] = useState(null);
  const openLead = useCallback((formCode, ctaLocation) => setLead({ formCode, ctaLocation }), []);
  const closeLead = useCallback(() => setLead(null), []);

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
        <ProjectHero
          data={data}
          onRequestApplication={() => openLead('zhk_hero_application', 'Первый экран квиз-лендинга')}
          onRequestPresentation={() => openLead('easton_quiz_landing_presentation', 'Первый экран квиз-лендинга')}
        />
        <ProjectAbout data={data} />
        <div id="easton-quiz-advantages">
          <ProjectStandards data={data} />
        </div>
        <ProjectLocation data={data} />
        <ProjectApartmentQuiz data={data} />
        <Footer />

        {lead && (
          <LeadPopup
            open
            onClose={closeLead}
            formCode={lead.formCode}
            project={data.name}
            city={data.city}
            ctaLocation={lead.ctaLocation}
          />
        )}
      </div>
    </>
  );
}
