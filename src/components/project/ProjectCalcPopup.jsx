import { useEffect, useMemo, useState } from 'react';
import Dropdown from '../Dropdown';
import LeadPopup from '../lead/LeadPopup';
import { AREA_RANGES } from '../../lead/details';
import { useI18n } from '../../i18n/I18nContext';
import { translatePlanName } from '../../i18n/planText';

/**
 * Форма «Получить расчет» на странице ЖК (код формы `zhk_calculation`).
 *
 * Отличается от остальных popup-форм одним дополнительным полем —
 * комнатностью и диапазоном площади (ТЗ 3), поэтому здесь только оно и
 * его проверка. Всё общее поведение берёт на себя `LeadPopup`.
 */
export default function ProjectCalcPopup({ open, onClose, projectName, city, areaRanges, ctaLocation }) {
  const { t } = useI18n();
  /* В CRM уходит русское значение, пользователю показываем переведённую подпись. */
  const options = useMemo(() => {
    const ranges = areaRanges?.length ? areaRanges : AREA_RANGES;
    return ranges.map((r) => ({ value: r.value, label: translatePlanName(t, r.label || r.value) }));
  }, [areaRanges, t]);

  const [area, setArea] = useState('');
  const [areaOpen, setAreaOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setArea('');
      setAreaOpen(false);
    }
  }, [open]);

  return (
    <LeadPopup
      open={open}
      onClose={onClose}
      formCode="zhk_calculation"
      project={projectName}
      city={city}
      ctaLocation={ctaLocation}
      panelClassName={areaOpen ? 'is-dropdown-open' : ''}
      details={() => (area ? [{ key: 'calc_area', label: 'Комнатность и площадь', value: area, group: 'context' }] : [])}
      validate={() => (area ? {} : { area: t('calc.area.select') })}
    >
      {(form) => (
        <>
          <label className="project-lead-popup__label">{t('calc.area.select')}</label>
          <Dropdown
            className="project-lead-popup__dropdown"
            current={area || t('calc.area.select')}
            open={areaOpen}
            onToggle={() => setAreaOpen((v) => !v)}
            options={options}
            onSelect={(value) => {
              setArea(value);
              setAreaOpen(false);
            }}
            active={Boolean(area)}
          />
          {form.errors.area && <div className="project-lead-popup__error">{form.errors.area}</div>}
        </>
      )}
    </LeadPopup>
  );
}
