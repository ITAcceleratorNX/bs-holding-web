import SectionLabel from './SectionLabel';
import { useI18n } from '../../i18n/I18nContext';

export default function ProjectExtras({ data }) {
  const { t } = useI18n();
  const { extras } = data;
  if (!extras) return null;
  const label = extras.labelKey ? t(extras.labelKey) : extras.label;
  const cream = extras.sectionTone === 'cream';
  return (
    <section
      className={`easton-section ${cream ? 'easton-section--cream easton-extras--cream' : 'easton-section--dark'}`}
    >
      <SectionLabel color={cream ? data.theme?.accentDark ?? '#1F6059' : undefined}>{label}</SectionLabel>
      <h2 className={`easton-h2${cream ? ' easton-h2--dark' : ''}`}>{extras.title}</h2>
      <div className="wh-extras-grid">
        {extras.items.map((item) => (
          <div key={item.title} className={`wh-extras-card${cream ? ' wh-extras-card--cream' : ''}`}>
            <div className="wh-extras-card__title">{item.title}</div>
            <p className={`easton-body${cream ? ' easton-body--dark' : ''}`}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
