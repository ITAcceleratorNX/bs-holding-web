import { useState } from 'react';
import SectionLabel from './SectionLabel';
import { nameOk, phoneOk } from '../../utils/format';
import { LEAD_SOURCES, submitLead } from '../../utils/leads';

const STEPS = [
  {
    key: 'rooms',
    title: 'Комнатность',
    options: [
      { value: '1', label: '1 комната' },
      { value: '2', label: '2 комнаты' },
      { value: '3', label: '3 комнаты' },
      { value: '4', label: '4 комнаты' },
    ],
  },
  {
    key: 'floor',
    title: 'Этаж',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
    ],
  },
  {
    key: 'layout',
    title: 'Планировка',
    options: [{ value: 'Свободная', label: 'Свободная' }],
  },
  {
    key: 'payment',
    title: 'Способ оплаты',
    options: [
      { value: 'Ипотека', label: 'Ипотека' },
      { value: 'Рассрочка', label: 'Рассрочка' },
    ],
  },
];

const TOTAL_STEPS = STEPS.length + 1;

export default function ProjectApartmentQuiz({ data }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    rooms: '',
    floor: '',
    layout: '',
    payment: '',
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formState, setFormState] = useState('idle');

  const isContact = step >= STEPS.length;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const selectOption = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setFormState('idle');
    setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length)), 180);
  };

  const goBack = () => {
    setFormState('idle');
    setStep((s) => Math.max(0, s - 1));
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
        source: LEAD_SOURCES.QUIZ,
        name: name.trim(),
        phone: phone.trim(),
        rooms: answers.rooms,
        floor: answers.floor,
        layout: answers.layout,
        payment: answers.payment,
      });
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  return (
    <section id={`${data.slug}-quiz`} className="easton-section easton-section--cream project-quiz">
      <SectionLabel color={data.theme?.accentDark ?? '#1F6059'}>Подбор квартиры</SectionLabel>
      <h2 className="easton-h2 easton-h2--dark">Подберите квартиру под ваши предпочтения</h2>
      <p className="easton-body easton-body--dark project-quiz__lead">
        Ответьте на несколько вопросов — менеджер подготовит консультацию по {data.name}.
      </p>

      <div className="project-quiz__card">
        {formState === 'success' ? (
          <div className="project-quiz__success">
            <div className="project-quiz__success-title">Спасибо! Заявка принята.</div>
            <div className="project-quiz__success-sub">Мы свяжемся с вами и подберём варианты по вашим ответам.</div>
          </div>
        ) : (
          <>
            <div className="project-quiz__progress" aria-hidden="true">
              <div className="project-quiz__progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="project-quiz__meta">
              <span>
                Шаг {step + 1} из {TOTAL_STEPS}
              </span>
              {step > 0 && (
                <button type="button" className="project-quiz__back" onClick={goBack}>
                  Назад
                </button>
              )}
            </div>

            {!isContact ? (
              <>
                <h3 className="project-quiz__step-title">{STEPS[step].title}</h3>
                <div className="project-quiz__options">
                  {STEPS[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`project-quiz__option${answers[STEPS[step].key] === opt.value ? ' is-active' : ''}`}
                      onClick={() => selectOption(STEPS[step].key, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="project-quiz__step-title">Контакты</h3>
                <div className="project-quiz__form">
                  <label>Имя</label>
                  <input
                    className="input-dark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                  <label>Телефон</label>
                  <input
                    className="input-dark"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Номер телефона"
                  />
                  {formState === 'error' && (
                    <div className="easton-consult__error">Укажите имя и корректный номер телефона.</div>
                  )}
                  <button
                    type="button"
                    className="easton-btn easton-btn--light"
                    onClick={submit}
                    disabled={formState === 'loading'}
                  >
                    {formState === 'loading' ? 'Отправка…' : 'Получить консультацию'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
