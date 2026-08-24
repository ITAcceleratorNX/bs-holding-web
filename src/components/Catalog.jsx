import Dropdown from './Dropdown';
import { classFullLabel, metaLabel, termBadgeLabel } from '../i18n/catalogText';
import { useI18n } from '../i18n/I18nContext';
import { fmt } from '../utils/format';

function ProjectCard({ p, onOpen }) {
  const { t } = useI18n();
  const clickable = Boolean(p.slug || p.href);
  const Wrapper = clickable ? 'button' : 'div';
  const wrapperProps = clickable
    ? {
        type: 'button',
        onClick: () => onOpen?.(p),
        className: 'project-card project-card--btn',
      }
    : { className: 'project-card' };

  const metaItems = p.meta
    ? p.meta.map((m) => metaLabel(t, m))
    : [metaLabel(t, p.city), classFullLabel(t, p.classFull)];

  return (
    <Wrapper {...wrapperProps}>
      <div className="project-card__media">
        <img src={p.image} alt={p.name} />
        <div className="project-card__badges">
          <span className="badge">{classFullLabel(t, p.classFull)}</span>
          {p.termBadge && <span className="badge">{termBadgeLabel(t, p.termBadge)}</span>}
        </div>
      </div>
      <div className="project-card__info">
        <div className="project-card__name">{p.name}</div>
        <div className="project-card__meta">
          {metaItems.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
      {p.price > 0 && <div className="project-card__price">{p.priceFrom} {fmt(p.price)} ₸</div>}
    </Wrapper>
  );
}

export default function Catalog({
  filter,
  filterSpec,
  setFilter,
  openMenu,
  toggleMenu,
  closeMenu,
  applyFilter,
  resetFilter,
  filtered,
  onOpenProject,
}) {
  const { t } = useI18n();
  return (
    <>
      <section id="catalog" className="section catalog-head">
        <h2 className="section-title">{t('catalog.title')}</h2>
        <div className="catalog-filters">
          {filterSpec.map(([key, opts]) => (
            <Dropdown
              key={key}
              current={filter[key]}
              open={openMenu === `f_${key}`}
              onToggle={() => toggleMenu(`f_${key}`)}
              options={opts}
              onSelect={(o) => setFilter(key, o)}
              onClose={closeMenu}
              active={filter[key] !== opts[0]}
            />
          ))}
          <button type="button" className="btn-primary catalog-filters__find" onClick={applyFilter}>
            {t('catalog.find')}
          </button>
          <button type="button" className="catalog-filters__reset" onClick={resetFilter}>
            {t('catalog.reset')}
          </button>
        </div>
      </section>

      <section className="section catalog-grid-wrap">
        {filtered.length > 0 ? (
          <div className="catalog-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.id} p={p} onOpen={onOpenProject} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <div className="catalog-empty__title">{t('catalog.empty.title')}</div>
            <div className="catalog-empty__sub">{t('catalog.empty.sub')}</div>
            <button type="button" className="btn-primary" onClick={resetFilter}>
              {t('catalog.reset')}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
