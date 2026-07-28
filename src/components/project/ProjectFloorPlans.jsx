import { useEffect, useMemo, useState } from 'react';
import SectionLabel from './SectionLabel';
import { nameOk, phoneOk } from '../../utils/format';
import { submitLead } from '../../utils/leads';

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b), 'ru');
  });
}

function itemMatchesFilters(item, block, floor) {
  if (block !== 'all' && item.block !== block) return false;
  if (floor !== 'all') {
    const floors = item.floors ?? [];
    if (!floors.map(String).includes(String(floor))) return false;
  }
  return true;
}

export default function ProjectFloorPlans({ data, onScrollToConsult }) {
  const { floorPlans } = data;
  const [active, setActive] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formState, setFormState] = useState('idle');
  const [block, setBlock] = useState('all');
  const [floor, setFloor] = useState('all');

  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  const items = floorPlans?.items ?? [];
  const enableFilters = Boolean(floorPlans?.enableFilters);
  const filtersActive = block !== 'all' || floor !== 'all';

  const blockOptions = useMemo(
    () => (enableFilters ? uniqueSorted(items.map((item) => item.block)) : []),
    [items, enableFilters],
  );
  const floorOptions = useMemo(() => {
    if (!enableFilters) return [];
    const scoped = block === 'all' ? items : items.filter((item) => item.block === block);
    return uniqueSorted(scoped.flatMap((item) => item.floors ?? []));
  }, [items, block, enableFilters]);

  useEffect(() => {
    if (!enableFilters || floor === 'all') return;
    if (!floorOptions.map(String).includes(String(floor))) {
      setFloor('all');
    }
  }, [enableFilters, floor, floorOptions]);

  const filtered = useMemo(() => {
    if (!enableFilters) return items;
    if (!filtersActive) {
      const featured = items.filter((item) => item.featured);
      return featured.length ? featured : items.slice(0, 9);
    }
    return items.filter((item) => itemMatchesFilters(item, block, floor));
  }, [items, enableFilters, filtersActive, block, floor]);

  if (!floorPlans) return null;

  const hasItems = items.length > 0;
  const showFilters = enableFilters && (blockOptions.length > 1 || floorOptions.length > 1);

  const close = () => {
    setActive(null);
    setName('');
    setPhone('');
    setFormState('idle');
  };

  const resetFilters = () => {
    setBlock('all');
    setFloor('all');
  };

  const submit = async () => {
    if (!nameOk(name) || !phoneOk(phone)) {
      setFormState('error');
      return;
    }
    setFormState('loading');
    try {
      await submitLead({
        project: data.name,
        city: data.city,
        source: 'Планировка — подробнее',
        name: name.trim(),
        phone: phone.trim(),
        plan: active?.name,
        ...(active?.area ? { area: active.area } : {}),
      });
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  return (
    <section id={floorPlans.id} className="easton-section easton-section--dark">
      <SectionLabel>{floorPlans.label}</SectionLabel>
      <h2 className="easton-h2">{floorPlans.title}</h2>
      <p className="easton-body" style={{ marginTop: 16, marginBottom: showFilters ? 20 : 32 }}>
        {floorPlans.text}
      </p>

      {showFilters && (
        <div className="wh-plans-filters">
          {blockOptions.length > 1 && (
            <div className="wh-plans-filters__group">
              <span className="wh-plans-filters__label">Блок</span>
              <div className="wh-plans-filters__chips" role="group" aria-label="Фильтр по блоку">
                <button
                  type="button"
                  className={`wh-plans-filter-chip${block === 'all' ? ' is-active' : ''}`}
                  onClick={() => setBlock('all')}
                >
                  Все
                </button>
                {blockOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`wh-plans-filter-chip${block === opt ? ' is-active' : ''}`}
                    onClick={() => setBlock(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {floorOptions.length > 1 && (
            <div className="wh-plans-filters__group">
              <span className="wh-plans-filters__label">Этаж</span>
              <div className="wh-plans-filters__chips" role="group" aria-label="Фильтр по этажу">
                <button
                  type="button"
                  className={`wh-plans-filter-chip${floor === 'all' ? ' is-active' : ''}`}
                  onClick={() => setFloor('all')}
                >
                  Все
                </button>
                {floorOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`wh-plans-filter-chip${String(floor) === String(opt) ? ' is-active' : ''}`}
                    onClick={() => setFloor(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="wh-plans-filters__meta">
            <span>
              {filtersActive
                ? `Показано ${filtered.length} из ${items.length}`
                : `Основные планировки · ${filtered.length} из ${items.length}`}
            </span>
            {filtersActive && (
              <button type="button" className="wh-plans-filters__reset" onClick={resetFilters}>
                Сбросить
              </button>
            )}
          </div>
        </div>
      )}

      {hasItems ? (
        filtered.length > 0 ? (
          <div
            className={[
              'wh-plans-grid',
              filtered.length === 2 ? 'wh-plans-grid--2' : '',
              filtered.length === 4 ? 'wh-plans-grid--4' : '',
              (filtered.length > 4 || filtered.some((i) => i.sheet)) && filtered.length !== 2
                ? 'wh-plans-grid--sheets'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {filtered.map((item) => (
              <article
                key={item.id}
                className={`wh-plan-card${item.placeholder ? ' wh-plan-card--placeholder' : ''}${item.sheet ? ' wh-plan-card--sheet' : ''}`}
              >
                <div className="wh-plan-card__media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="wh-plan-card__body">
                  <div className="wh-plan-card__name">{item.name}</div>
                  <div className="wh-plan-card__meta">
                    {item.placeholder ? (
                      <span>{item.note ?? 'Характеристики уточняются'}</span>
                    ) : (
                      <>
                        {item.rooms && <span>{item.rooms}</span>}
                        {item.area && <span>{item.area}</span>}
                      </>
                    )}
                  </div>
                  <button type="button" className="easton-btn easton-btn--light" onClick={() => setActive(item)}>
                    {item.cta ?? 'Подробнее'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wh-plans-empty">
            Нет планировок по выбранным фильтрам.
            <button type="button" className="wh-plans-filters__reset" onClick={resetFilters}>
              Сбросить фильтр
            </button>
          </div>
        )
      ) : (
        <div className="project-plans-placeholder" aria-label={floorPlans.placeholder || `Планировки ${data.name}`}>
          {floorPlans.placeholderImage ? (
            <img src={floorPlans.placeholderImage} alt={floorPlans.placeholder || `Планировки ${data.name}`} />
          ) : (
            <div className="project-plans-placeholder__empty">{floorPlans.placeholder || `Планировки ${data.name}`}</div>
          )}
        </div>
      )}

      {active && (
        <div className="wh-plan-popup" role="dialog" aria-modal="true" aria-label={active.name}>
          <button type="button" className="wh-plan-popup__backdrop" aria-label="Закрыть" onClick={close} />
          <div className={`wh-plan-popup__panel${active.sheet ? ' wh-plan-popup__panel--sheet' : ''}`}>
            <button type="button" className="wh-plan-popup__close" onClick={close} aria-label="Закрыть">
              ×
            </button>
            <div className={`wh-plan-popup__grid${active.sheet ? ' wh-plan-popup__grid--sheet' : ''}`}>
              <div className="wh-plan-popup__media">
                <img src={active.image} alt={active.name} />
              </div>
              <div className="wh-plan-popup__info">
                <h3>{active.name}</h3>
                <ul>
                  {active.rooms && <li>{active.rooms}</li>}
                  {active.area && <li>Общая площадь: {active.area}</li>}
                  {active.areaLiving && <li>Жилая площадь: {active.areaLiving}</li>}
                  {active.meta?.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                  {active.priceNote && <li>{active.priceNote}</li>}
                  {active.placeholder && (
                    <li>{active.note ?? 'Характеристики уточняются'} — оставьте заявку, и менеджер пришлёт планировку.</li>
                  )}
                </ul>
                {formState === 'success' ? (
                  <div>
                    <div className="easton-consult__success-title">Заявка принята</div>
                    <div className="easton-consult__success-sub">Мы свяжемся с вами в течение дня.</div>
                  </div>
                ) : (
                  <div className="wh-plan-popup__form">
                    <label>Ваше Ф.И.О.</label>
                    <input className="input-dark" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
                    <label>Телефон</label>
                    <input className="input-dark" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Номер телефона" />
                    {formState === 'error' && (
                      <div className="easton-consult__error">Укажите имя и корректный номер телефона.</div>
                    )}
                    <button
                      type="button"
                      className="easton-btn easton-btn--light"
                      onClick={submit}
                      disabled={formState === 'loading'}
                    >
                      {formState === 'loading' ? 'Отправка…' : 'Оставить заявку'}
                    </button>
                    <button type="button" className="easton-btn easton-btn--ghost" onClick={() => { close(); onScrollToConsult?.(); }}>
                      Консультация по объекту
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
