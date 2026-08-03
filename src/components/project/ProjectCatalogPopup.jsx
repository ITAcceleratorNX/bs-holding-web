import { useEffect, useState } from 'react';
import { nameOk, phoneOk } from '../../utils/format';
import { LEAD_SOURCES, submitLead } from '../../utils/leads';

export default function ProjectCatalogPopup({ open, onClose, projectName, city }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
      setFormState('idle');
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (!nameOk(name) || !phoneOk(phone)) {
      setFormState('error');
      return;
    }
    setFormState('loading');
    try {
      await submitLead({
        project: projectName,
        city,
        source: LEAD_SOURCES.CATALOG,
        name: name.trim(),
        phone: phone.trim(),
      });
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className="project-lead-popup" role="dialog" aria-modal="true" aria-label="Скачать каталог" onClick={onClose}>
      <div className="project-lead-popup__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="project-lead-popup__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {formState === 'success' ? (
          <div className="project-lead-popup__success">
            <div className="project-lead-popup__title">Спасибо! Заявка принята.</div>
            <div className="project-lead-popup__sub">
              Менеджер свяжется с вами и отправит каталог.
            </div>
            <button type="button" className="easton-btn easton-btn--solid" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="project-lead-popup__intro">
              <div className="project-lead-popup__title">Скачать каталог</div>
              <div className="project-lead-popup__sub">
                Оставьте имя и номер телефона — менеджер отправит каталог.
              </div>
            </div>
            <label className="project-lead-popup__label">Имя</label>
            <input
              className="project-lead-popup__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
            />
            <label className="project-lead-popup__label">Номер телефона</label>
            <input
              className="project-lead-popup__input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Номер телефона"
            />
            {formState === 'error' && (
              <div className="project-lead-popup__error">Укажите имя и корректный номер телефона.</div>
            )}
            <button type="button" className="easton-btn easton-btn--solid" onClick={submit} disabled={formState === 'loading'}>
              {formState === 'loading' ? 'Отправка…' : 'Скачать каталог'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
