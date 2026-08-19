import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectAutonomy({ data }) {
  const { t } = useI18n();
  const { autonomy } = data;
  if (!autonomy) return null;
  return (
    <section className="easton-section easton-section--dark cp-autonomy">
      <SectionLabel>{t('project.label.autonomy')}</SectionLabel>
      <h2 className="easton-h2">{autonomy.title}</h2>
      <div className="cp-autonomy__grid">
        {autonomy.points.map((p) => (
          <div key={p} className="cp-autonomy__item">
            <p className="easton-body">{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
