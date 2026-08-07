import { useEffect, useMemo, useState } from 'react';
import SectionLabel from './SectionLabel';
import LeadHoneypot from '../lead/LeadHoneypot';
import { CONSENT_POLICY } from '../../data/leadForms';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../../lead/analytics';
import { buildDetails } from '../../lead/details';
import { useLeadForm } from '../../lead/useLeadForm';

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

/** Мобильный брейкпоинт, при котором список планировок сворачивается до 4 карточек. */
const MOBILE_QUERY = '(max-width: 768px)';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

export default function ProjectFloorPlans({ data, onScrollToConsult }) {
  const { floorPlans } = data;
  const [active, setActive] = useState(null);
  const [block, setBlock] = useState('all');
  const [floor, setFloor] = useState('all');
  const [rooms, setRooms] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  /**
   * Заявка из popup выбранной планировки (код формы `layout_application`).
   * В CRM уходят ЖК, название планировки, комнатность, площадь и цена (ТЗ 6.2).
   */
  const form = useLeadForm({
    formCode: 'layout_application',
    project: data.name,
    city: data.city,
    ctaLocation: 'Popup планировки',
    details: () =>
      buildDetails('layout', [
        ['layout_id', 'ID планировки', active?.id],
        ['layout_name', 'Планировка', active?.name],
        ['layout_rooms', 'Комнатность', active?.rooms],
        ['layout_area', 'Площадь', active?.area],
        ['layout_price', 'Цена', active?.price],
      ]),
  });

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
  const filtersActive = block !== 'all' || floor !== 'all' || rooms !== 'all';

  /** Фильтр «Комнатность» работает независимо от block/floor и включается автоматически,
   * когда у планировок есть поле `rooms` и вариантов больше одного. */
  const roomsOptions = useMemo(() => uniqueSorted(items.map((item) => item.rooms)), [items]);
  const showRoomsFilter = roomsOptions.length > 1;

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

  const byRoom = useMemo(
    () => (rooms === 'all' ? items : items.filter((item) => item.rooms === rooms)),
    [items, rooms],
  );

  const filtered = useMemo(() => {
    if (!enableFilters) return byRoom;
    if (!filtersActive) {
      const featured = byRoom.filter((item) => item.featured);
      return featured.length ? featured : byRoom.slice(0, 9);
    }
    return byRoom.filter((item) => itemMatchesFilters(item, block, floor));
  }, [byRoom, enableFilters, filtersActive, block, floor]);

  // Новый фильтр — сворачиваем мобильный список планировок обратно к первым 4 карточкам.
  useEffect(() => {
    setExpanded(false);
  }, [rooms, block, floor]);

  const visible = isMobile && !expanded ? filtered.slice(0, 4) : filtered;
  const showMore = isMobile && !expanded && filtered.length > 4;

  if (!floorPlans) return null;

  const hasItems = items.length > 0;
  const showFilters = showRoomsFilter || (enableFilters && (blockOptions.length > 1 || floorOptions.length > 1));

  const close = () => {
    setActive(null);
    form.reset();
  };

  const openPlan = (item) => {
    setActive(item);
    form.reset();
    trackEvent(
      LEAD_EVENTS.FORM_OPEN,
      formEventParams({
        formCode: 'layout_application',
        city: data.city,
        project: data.name,
        ctaLocation: 'Popup планировки',
      }),
    );
  };

  const resetFilters = () => {
    setBlock('all');
    setFloor('all');
    setRooms('all');
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
          {showRoomsFilter && (
            <div className="wh-plans-filters__group">
              <span className="wh-plans-filters__label">Комнатность</span>
              <div className="wh-plans-filters__chips" role="group" aria-label="Фильтр по комнатности">
                <button
                  type="button"
                  className={`wh-plans-filter-chip${rooms === 'all' ? ' is-active' : ''}`}
                  onClick={() => setRooms('all')}
                >
                  Все
                </button>
                {roomsOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`wh-plans-filter-chip${rooms === opt ? ' is-active' : ''}`}
                    onClick={() => setRooms(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          <>
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
              {visible.map((item) => (
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
                    {item.price && <div className="wh-plan-card__price">{item.price}</div>}
                    <button
                      type="button"
                      className="easton-btn easton-btn--light wh-plan-card__cta"
                      onClick={() => openPlan(item)}
                    >
                      {item.cta ?? 'Подробнее'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {showMore && (
              <button type="button" className="wh-plans-show-more" onClick={() => setExpanded(true)}>
                Показать ещё
              </button>
            )}
          </>
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
                  {active.price && <li>Стоимость: {active.price}</li>}
                  {active.meta?.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                  {active.priceNote && <li>{active.priceNote}</li>}
                  {active.placeholder && (
                    <li>{active.note ?? 'Характеристики уточняются'} — оставьте заявку, и менеджер пришлёт планировку.</li>
                  )}
                </ul>
                {form.isSuccess ? (
                  <div>
                    <div className="easton-consult__success-title">Заявка принята</div>
                    <div className="easton-consult__success-sub">Мы свяжемся с вами в течение дня.</div>
                  </div>
                ) : (
                  <div className="wh-plan-popup__form">
                    <label htmlFor="plan-lead-name">Ваше Ф.И.О.</label>
                    <input id="plan-lead-name" className="input-dark" placeholder="Ваше имя" {...form.fields.name} />
                    {form.errors.name && <div className="easton-consult__error">{form.errors.name}</div>}

                    <label htmlFor="plan-lead-phone">Телефон</label>
                    <input id="plan-lead-phone" className="input-dark" {...form.fields.phone} />
                    {form.errors.phone && <div className="easton-consult__error">{form.errors.phone}</div>}

                    <LeadHoneypot {...form.honeypotProps} />

                    {form.message && <div className="easton-consult__error">{form.message}</div>}

                    <button
                      type="button"
                      className="easton-btn easton-btn--light"
                      onClick={form.submit}
                      disabled={form.isLoading}
                    >
                      {form.isLoading ? 'Отправка…' : 'Оставить заявку'}
                    </button>
                    <button type="button" className="easton-btn easton-btn--ghost" onClick={() => { close(); onScrollToConsult?.(); }}>
                      Консультация по объекту
                    </button>
                    <div className="lead-policy">{CONSENT_POLICY}</div>
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
