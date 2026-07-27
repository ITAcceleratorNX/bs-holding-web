import { useEffect, useState } from 'react';
import Dropdown from '../Dropdown';
import { nameOk, phoneOk } from '../../utils/format';
import { AREA_RANGES, LEAD_SOURCES, submitLead } from '../../utils/leads';

const AREA_OPTIONS = AREA_RANGES.map((r) => r.label);

export default function ProjectCalcPopup({ open, onClose, projectName }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [areaOpen, setAreaOpen] = useState(false);
  const [formState, setFormState] = useState('idle');

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setName('');
      setPhone('');
      setArea('');
      setAreaOpen(false);
      setFormState('idle');
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (!nameOk(name) || !phoneOk(phone) || !area) {
      setFormState('error');
      return;
    }
    setFormState('loading');
    try {
      await submitLead({
        project: projectName,
        source: LEAD_SOURCES.CALC,
        name: name.trim(),
        phone: phone.trim(),
        area,
      });
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className="project-lead-popup" role="dialog" aria-modal="true" aria-label="Получить расчет" onClick={onClose}>
      <div
        className={`project-lead-popup__panel${areaOpen ? ' is-dropdown-open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="project-lead-popup__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {formState === 'success' ? (
          <div className="project-lead-popup__success">
            <div className="project-lead-popup__title">Спасибо! Заявка принята.</div>
            <div className="project-lead-popup__sub">Мы рассчитаем стоимость и свяжемся с вами в ближайшее время.</div>
            <button type="button" className="easton-btn easton-btn--solid" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="project-lead-popup__intro">
              <div className="project-lead-popup__title">Получить расчет</div>
              <div className="project-lead-popup__sub">
                Оставьте контакты и выберите квадратуру — подготовим расчёт по {projectName}.
              </div>
            </div>
            <label className="project-lead-popup__label">Имя</label>
            <input
              className="project-lead-popup__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
            />
            <label className="project-lead-popup__label">Телефон</label>
            <input
              className="project-lead-popup__input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Номер телефона"
            />
            <label className="project-lead-popup__label">Выберите квадратуру</label>
            <Dropdown
              className="project-lead-popup__dropdown"
              current={area || 'Выберите квадратуру'}
              open={areaOpen}
              onToggle={() => setAreaOpen((v) => !v)}
              options={AREA_OPTIONS}
              onSelect={(value) => {
                setArea(value);
                setAreaOpen(false);
                setFormState((s) => (s === 'error' ? 'idle' : s));
              }}
              active={Boolean(area)}
            />
            {formState === 'error' && (
              <div className="project-lead-popup__error">Укажите имя, корректный телефон и квадратуру.</div>
            )}
            <button type="button" className="easton-btn easton-btn--solid" onClick={submit} disabled={formState === 'loading'}>
              {formState === 'loading' ? 'Отправка…' : 'Получить расчет'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
