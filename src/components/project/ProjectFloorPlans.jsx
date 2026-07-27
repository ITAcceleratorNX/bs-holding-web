import { useEffect, useState } from 'react';
import SectionLabel from './SectionLabel';
import { nameOk, phoneOk } from '../../utils/format';
import { submitLead } from '../../utils/leads';

export default function ProjectFloorPlans({ data, onScrollToConsult }) {
  const { floorPlans } = data;
  const [active, setActive] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formState, setFormState] = useState('idle');

  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!floorPlans) return null;

  const close = () => {
    setActive(null);
    setName('');
    setPhone('');
    setFormState('idle');
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
        source: 'Планировка — подробнее',
        name: name.trim(),
        phone: phone.trim(),
        plan: active?.name,
        area: active?.area,
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
      <p className="easton-body" style={{ marginTop: 16, marginBottom: 32 }}>
        {floorPlans.text}
      </p>
      <div className="wh-plans-grid">
        {floorPlans.items.map((item) => (
          <article key={item.id} className="wh-plan-card">
            <div className="wh-plan-card__media">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="wh-plan-card__body">
              <div className="wh-plan-card__name">{item.name}</div>
              <div className="wh-plan-card__meta">
                <span>{item.rooms}</span>
                <span>{item.area}</span>
              </div>
              <button type="button" className="easton-btn easton-btn--light" onClick={() => setActive(item)}>
                Подробнее
              </button>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="wh-plan-popup" role="dialog" aria-modal="true" aria-label={active.name}>
          <button type="button" className="wh-plan-popup__backdrop" aria-label="Закрыть" onClick={close} />
          <div className="wh-plan-popup__panel">
            <button type="button" className="wh-plan-popup__close" onClick={close} aria-label="Закрыть">
              ×
            </button>
            <div className="wh-plan-popup__grid">
              <div className="wh-plan-popup__media">
                <img src={active.image} alt={active.name} />
              </div>
              <div className="wh-plan-popup__info">
                <h3>{active.name}</h3>
                <ul>
                  <li>{active.rooms}</li>
                  <li>Общая площадь: {active.area}</li>
                  {active.areaLiving && <li>Жилая площадь: {active.areaLiving}</li>}
                  {active.meta?.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                  {active.priceNote && <li>{active.priceNote}</li>}
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
                    <button type="button" className="easton-btn easton-btn--light" onClick={submit}>
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
