import Dropdown from './Dropdown';
import { FILTER_SPEC } from '../data/projects';
import { fmt } from '../utils/format';

function ProjectCard({ p, onOpen }) {
  const clickable = Boolean(p.slug || p.href);
  const Wrapper = clickable ? 'button' : 'div';
  const wrapperProps = clickable
    ? {
        type: 'button',
        onClick: () => onOpen?.(p),
        className: 'project-card project-card--btn',
      }
    : { className: 'project-card' };

  return (
    <Wrapper {...wrapperProps}>
      <div className="project-card__media">
        <img src={p.image} alt={p.name} />
        <div className="project-card__badges">
          <span className="badge">{p.classFull}</span>
          {p.termBadge && <span className="badge">{p.termBadge}</span>}
        </div>
      </div>
      <div className="project-card__info">
        <div className="project-card__name">{p.name}</div>
        <div className="project-card__meta">
          {(p.meta || [p.city, p.classFull]).map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
      {p.price != null && <div className="project-card__price">от {fmt(p.price)} ₸</div>}
    </Wrapper>
  );
}

export default function Catalog({
  filter,
  setFilter,
  openMenu,
  toggleMenu,
  applyFilter,
  resetFilter,
  filtered,
  onOpenProject,
}) {
  return (
    <>
      <section id="catalog" className="section catalog-head">
        <h2 className="section-title">Все проекты BS Holding</h2>
        <div className="catalog-filters">
          {FILTER_SPEC.map(([key, opts]) => (
            <Dropdown
              key={key}
              current={filter[key]}
              open={openMenu === `f_${key}`}
              onToggle={() => toggleMenu(`f_${key}`)}
              options={opts}
              onSelect={(o) => setFilter(key, o)}
              active={filter[key] !== opts[0]}
            />
          ))}
          <button type="button" className="btn-primary catalog-filters__find" onClick={applyFilter}>
            Найти квартиру
          </button>
          <button type="button" className="catalog-filters__reset" onClick={resetFilter}>
            Сбросить фильтр
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
            <div className="catalog-empty__title">По вашему запросу ничего не найдено</div>
            <div className="catalog-empty__sub">
              Попробуйте изменить параметры фильтра или сбросьте их.
            </div>
            <button type="button" className="btn-primary" onClick={resetFilter}>
              Сбросить фильтр
            </button>
          </div>
        )}
      </section>
    </>
  );
}
