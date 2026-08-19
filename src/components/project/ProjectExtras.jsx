import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectExtras({ data }) {
  const { t } = useI18n();
  const { extras } = data;
  if (!extras) return null;
  const label = extras.labelKey ? t(extras.labelKey) : extras.label;
  return (
    <section className="easton-section easton-section--dark">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="easton-h2">{extras.title}</h2>
      <div className="wh-extras-grid">
        {extras.items.map((item) => (
          <div key={item.title} className="wh-extras-card">
            <div className="wh-extras-card__title">{item.title}</div>
            <p className="easton-body">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
