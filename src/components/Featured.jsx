import { projectHash, projectSlugFromName } from '../data/projectPages';
import { classFullLabel, termBadgeLabel } from '../i18n/catalogText';
import { useFeaturedData } from '../i18n/useFeaturedData';
import { useI18n } from '../i18n/I18nContext';

const TAB_NAMES = ['Avenue Park', 'BS Towers', 'ORTA', 'MURA'];

export default function Featured({ activeTab, setActiveTab }) {
  const { t } = useI18n();
  const featured = useFeaturedData(activeTab);
  const slug = projectSlugFromName(activeTab);
  const detailHref = slug ? projectHash(slug) : '#';

  if (!featured) return null;

  return (
    <section className="section featured">
      <h2 className="section-title">{t('featured.title')}</h2>
      <div className="featured-tabs">
        {TAB_NAMES.map((name) => {
          const active = name === activeTab;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setActiveTab(name)}
              className={`featured-tab${active ? ' is-active' : ''}`}
            >
              <span className="featured-tab__name">{name}</span>
            </button>
          );
        })}
      </div>
      <div className="featured-media">
        <img src={featured.image} alt={featured.name} />
        <div className="featured-media__badges">
          <span className="badge">{classFullLabel(t, featured.klass)}</span>
          {featured.termBadge && <span className="badge">{termBadgeLabel(t, featured.termBadge)}</span>}
        </div>
      </div>
      <div className="featured-info">
        <div className="featured-info__name">{featured.name}</div>
        <div className="featured-info__loc">{featured.location}</div>
      </div>
      <div className="featured-desc">
        {featured.desc.map((d, i) => (
          <p key={i}>{d}</p>
        ))}
      </div>
      <div>
        <a
          href={detailHref}
          className="btn-primary"
          onClick={(e) => {
            if (!slug) return;
            e.preventDefault();
            window.location.hash = projectHash(slug);
          }}
        >
          {t('plans.detail')}
        </a>
      </div>
    </section>
  );
}
