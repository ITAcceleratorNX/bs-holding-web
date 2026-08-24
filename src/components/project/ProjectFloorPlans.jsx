import { useEffect, useMemo, useState } from 'react';
import SectionLabel from './SectionLabel';
import LeadHoneypot from '../lead/LeadHoneypot';
import { useI18n } from '../../i18n/I18nContext';
import {
  translateAreaPending,
  translatePlanMeta,
  translatePlanName,
  translatePricePending,
  translateRoomsCount,
} from '../../i18n/planText';
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
  const { t } = useI18n();
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
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActive(null);
        form.reset();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [active, form]);

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
      <SectionLabel>{t('project.label.plans')}</SectionLabel>
      <h2 className="easton-h2">{floorPlans.title}</h2>
      <p className="easton-body" style={{ marginTop: 16, marginBottom: showFilters ? 20 : 32 }}>
        {floorPlans.text}
      </p>

      {showFilters && (
        <div className="wh-plans-filters">
          {showRoomsFilter && (
            <div className="wh-plans-filters__group">
              <span className="wh-plans-filters__label">{t('plans.filter.rooms')}</span>
              <div className="wh-plans-filters__chips" role="group" aria-label={t('plans.filter.rooms')}>
                <button
                  type="button"
                  className={`wh-plans-filter-chip${rooms === 'all' ? ' is-active' : ''}`}
                  onClick={() => setRooms('all')}
                >
                  {t('plans.filter.all')}
                </button>
                {roomsOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`wh-plans-filter-chip${rooms === opt ? ' is-active' : ''}`}
                    onClick={() => setRooms(opt)}
                  >
                    {translateRoomsCount(t, opt)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {blockOptions.length > 1 && (
            <div className="wh-plans-filters__group">
              <span className="wh-plans-filters__label">{t('plans.filter.block')}</span>
              <div className="wh-plans-filters__chips" role="group" aria-label={t('plans.filter.block')}>
                <button
                  type="button"
                  className={`wh-plans-filter-chip${block === 'all' ? ' is-active' : ''}`}
                  onClick={() => setBlock('all')}
                >
                  {t('plans.filter.all')}
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
              <span className="wh-plans-filters__label">{t('plans.filter.floor')}</span>
              <div className="wh-plans-filters__chips" role="group" aria-label={t('plans.filter.floor')}>
                <button
                  type="button"
                  className={`wh-plans-filter-chip${floor === 'all' ? ' is-active' : ''}`}
                  onClick={() => setFloor('all')}
                >
                  {t('plans.filter.all')}
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
                ? t('plans.shown').replace('{shown}', String(filtered.length)).replace('{total}', String(items.length))
                : t('plans.featured').replace('{shown}', String(filtered.length)).replace('{total}', String(items.length))}
            </span>
            {filtersActive && (
              <button type="button" className="wh-plans-filters__reset" onClick={resetFilters}>
                {t('plans.reset')}
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
                    <img src={item.image} alt={translatePlanName(t, item.name)} loading="lazy" />
                  </div>
                  <div className="wh-plan-card__body">
                    <div className="wh-plan-card__name">{translatePlanName(t, item.name)}</div>
                    <div className="wh-plan-card__meta">
                      {item.placeholder ? (
                        <span>{item.note ?? t('plans.charsPending')}</span>
                      ) : (
                        <>
                          {item.rooms && <span>{translateRoomsCount(t, item.rooms)}</span>}
                          {item.area && <span>{translateAreaPending(t, item.area)}</span>}
                        </>
                      )}
                    </div>
                    {item.price && <div className="wh-plan-card__price">{translatePricePending(t, item.price)}</div>}
                    <button
                      type="button"
                      className="easton-btn easton-btn--light wh-plan-card__cta"
                      onClick={() => openPlan(item)}
                    >
                      {item.cta ? t('plans.detailLong') : t('plans.detail')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {showMore && (
              <button type="button" className="wh-plans-show-more" onClick={() => setExpanded(true)}>
                {t('plans.showMore')}
              </button>
            )}
          </>
        ) : (
          <div className="wh-plans-empty">
            {t('plans.empty')}
            <button type="button" className="wh-plans-filters__reset" onClick={resetFilters}>
              {t('plans.resetFilter')}
            </button>
          </div>
        )
      ) : (
        <div className="project-plans-placeholder" aria-label={floorPlans.placeholder || `${t('project.label.plans')} ${data.name}`}>
          {floorPlans.placeholderImage ? (
            <img src={floorPlans.placeholderImage} alt={floorPlans.placeholder || `${t('project.label.plans')} ${data.name}`} />
          ) : (
            <div className="project-plans-placeholder__empty">{floorPlans.placeholder || `${t('project.label.plans')} ${data.name}`}</div>
          )}
        </div>
      )}

      {active && (
        <div className="wh-plan-popup" role="dialog" aria-modal="true" aria-label={translatePlanName(t, active.name)}>
          <button type="button" className="wh-plan-popup__backdrop" aria-label={t('form.close')} onClick={close} />
          <div className={`wh-plan-popup__panel${active.sheet ? ' wh-plan-popup__panel--sheet' : ''}`}>
            <button type="button" className="wh-plan-popup__close" onClick={close} aria-label={t('form.close')}>
              ×
            </button>
            <div className={`wh-plan-popup__grid${active.sheet ? ' wh-plan-popup__grid--sheet' : ''}`}>
              <div className="wh-plan-popup__media">
                <img src={active.image} alt={translatePlanName(t, active.name)} />
              </div>
              <div className="wh-plan-popup__info">
                <h3>{translatePlanName(t, active.name)}</h3>
                <ul>
                  {active.rooms && <li>{translateRoomsCount(t, active.rooms)}</li>}
                  {active.area && <li>{t('plans.areaTotal')}: {translateAreaPending(t, active.area)}</li>}
                  {active.areaLiving && <li>{t('plans.areaLiving')}: {translateAreaPending(t, active.areaLiving)}</li>}
                  {active.price && <li>{t('plans.price')}: {translatePricePending(t, active.price)}</li>}
                  {active.meta?.map((m) => (
                    <li key={m}>{translatePlanMeta(t, m)}</li>
                  ))}
                  {active.priceNote && <li>{translatePricePending(t, active.priceNote)}</li>}
                  {active.placeholder && (
                    <li>{active.note ?? t('plans.charsPending')} — {t('plans.placeholderNote')}</li>
                  )}
                </ul>
                {form.isSuccess ? (
                  <div>
                    <div className="easton-consult__success-title">{t('project.consult.success.title')}</div>
                    <div className="easton-consult__success-sub">{t('project.consult.success.sub')}</div>
                  </div>
                ) : (
                  <div className="wh-plan-popup__form">
                    <label htmlFor="plan-lead-name">{t('project.consult.name.label')}</label>
                    <input id="plan-lead-name" className="input-dark" placeholder={t('project.consult.name.placeholder')} {...form.fields.name} />
                    {form.errors.name && <div className="easton-consult__error">{form.errors.name}</div>}

                    <label htmlFor="plan-lead-phone">{t('project.consult.phone.label')}</label>
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
                      {form.isLoading ? t('form.sending') : t('lead.layout.submit')}
                    </button>
                    <button type="button" className="easton-btn easton-btn--ghost" onClick={() => { close(); onScrollToConsult?.(); }}>
                      {t('plans.consultObject')}
                    </button>
                    <div className="lead-policy">{t('lead.consent')}</div>
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
