import { useState } from 'react';
import { nameOk, phoneOk } from '../../utils/format';
import { LEAD_SOURCES, submitLead } from '../../utils/leads';

export default function ProjectConsultForm({ data }) {
  const { consult } = data;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formState, setFormState] = useState('idle');

  const submit = async () => {
    if (!nameOk(name) || !phoneOk(phone)) {
      setFormState('error');
      return;
    }
    setFormState('loading');
    try {
      await submitLead({
        project: consult.projectName || data.name || '',
        city: consult.city || data.city || '',
        source: LEAD_SOURCES.CONSULT,
        name: name.trim(),
        phone: phone.trim(),
      });
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  return (
    <section id={`${data.slug}-consult`} className="easton-consult">
      <div className="easton-consult__info">
        <h2>{consult.title}</h2>
        <p>{consult.subtitle}</p>
        <div className="easton-consult__contacts">
          <div>{consult.address}</div>
          <div>{consult.instagram}</div>
          <div>{consult.hours}</div>
        </div>
      </div>
      <div className="easton-consult__form">
        {formState === 'success' ? (
          <div>
            <div className="easton-consult__success-title">Спасибо! Заявка принята.</div>
            <div className="easton-consult__success-sub">Мы свяжемся с вами в течение дня.</div>
          </div>
        ) : (
          <>
            <input type="hidden" name="city" value={consult.city || data.city || ''} readOnly />
            <input type="hidden" name="project" value={consult.projectName || data.name || ''} readOnly />
            <label>Ваше Ф.И.О.</label>
            <input
              className="input-dark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
            />
            <label>Ваш номер телефона</label>
            <input
              className="input-dark"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Номер телефона"
            />
            {formState === 'error' && (
              <div className="easton-consult__error">Укажите имя и корректный номер телефона.</div>
            )}
            <button type="button" className="easton-btn easton-btn--light" onClick={submit} disabled={formState === 'loading'}>
              {formState === 'loading' ? 'Отправка…' : 'Получить консультацию'}
            </button>
            <div className="easton-consult__policy">{consult.policy}</div>
          </>
        )}
      </div>
    </section>
  );
}
