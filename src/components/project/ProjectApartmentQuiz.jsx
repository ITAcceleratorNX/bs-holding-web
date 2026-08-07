import { useEffect, useMemo, useState } from 'react';
import SectionLabel from './SectionLabel';
import LeadHoneypot from '../lead/LeadHoneypot';
import { CONSENT_POLICY } from '../../data/leadForms';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../../lead/analytics';
import { buildDetails } from '../../lead/details';
import { useLeadForm } from '../../lead/useLeadForm';

const DEFAULT_STEPS = [
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
    /** Short numeric labels — lay them out in a dense grid instead of 2 wide columns. */
    compact: true,
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

function buildSteps(quiz) {
  if (!quiz) return DEFAULT_STEPS;
  return [
    { key: 'rooms', title: 'Комнатность', options: quiz.rooms || DEFAULT_STEPS[0].options },
    { key: 'floor', title: 'Этаж', compact: true, options: quiz.floors || DEFAULT_STEPS[1].options },
    { key: 'layout', title: 'Планировка', options: quiz.layouts || DEFAULT_STEPS[2].options },
    { key: 'payment', title: 'Способ оплаты', options: quiz.payments || DEFAULT_STEPS[3].options },
  ];
}

/**
 * Квиз подбора квартиры (код формы `apartment_quiz`).
 *
 * В CRM уходят все ответы в понятном виде — подписью варианта, а не его
 * кодом, — плюс ЖК и город страницы (ТЗ 6.1).
 */
export default function ProjectApartmentQuiz({ data }) {
  const steps = useMemo(() => buildSteps(data.quiz), [data.quiz]);
  const totalSteps = steps.length + 1;

  const [step, setStep] = useState(0);
  /** Ответ хранится вместе с подписью: в карточку лида уходит именно подпись. */
  const [answers, setAnswers] = useState({});

  const project = data.consult?.projectName ?? data.name;
  const city = data.consult?.city ?? data.city;

  const form = useLeadForm({
    formCode: 'apartment_quiz',
    project,
    city,
    ctaLocation: 'Квиз подбора квартиры',
    details: () =>
      buildDetails(
        'quiz',
        steps.map((s) => [`quiz_${s.key}`, s.title, answers[s.key]?.label]),
      ),
    // Ответы собраны заранее, но пользователь мог вернуться назад и не выбрать заново.
    validate: () =>
      steps.every((s) => answers[s.key]) ? {} : { quiz: 'Ответьте на все вопросы квиза' },
  });

  const isContact = step >= steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  // Квиз пройден — фиксируем событие до отправки контактов (ТЗ 10).
  useEffect(() => {
    if (isContact) {
      trackEvent(
        LEAD_EVENTS.QUIZ_COMPLETE,
        formEventParams({ formCode: 'apartment_quiz', city, project, ctaLocation: 'Квиз подбора квартиры' }),
      );
    }
  }, [isContact, city, project]);

  const selectOption = (key, option) => {
    setAnswers((prev) => ({ ...prev, [key]: option }));
    setTimeout(() => setStep((s) => Math.min(s + 1, steps.length)), 180);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <section id={`${data.slug}-quiz`} className="easton-section easton-section--cream project-quiz">
      <SectionLabel color={data.theme?.accentDark ?? '#1F6059'}>Подбор квартиры</SectionLabel>
      <h2 className="easton-h2 easton-h2--dark">Подберите свою квартиру в {data.name} за 1 минуту</h2>
      <p className="easton-body easton-body--dark project-quiz__lead">
        Ответьте на 4 вопроса — покажем подходящие планировки, актуальные цены и условия покупки.
      </p>

      <div className="project-quiz__card">
        {form.isSuccess ? (
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
                Шаг {step + 1} из {totalSteps}
              </span>
              {step > 0 && (
                <button type="button" className="project-quiz__back" onClick={goBack}>
                  Назад
                </button>
              )}
            </div>

            {!isContact ? (
              <>
                <h3 className="project-quiz__step-title">{steps[step].title}</h3>
                <div className={`project-quiz__options${steps[step].compact ? ' project-quiz__options--compact' : ''}`}>
                  {steps[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`project-quiz__option${answers[steps[step].key]?.value === opt.value ? ' is-active' : ''}`}
                      onClick={() => selectOption(steps[step].key, opt)}
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
                  <label htmlFor={`${data.slug}-quiz-name`}>Имя</label>
                  <input
                    id={`${data.slug}-quiz-name`}
                    className="input-dark"
                    placeholder="Ваше имя"
                    {...form.fields.name}
                  />
                  {form.errors.name && <div className="easton-consult__error">{form.errors.name}</div>}

                  <label htmlFor={`${data.slug}-quiz-phone`}>Телефон</label>
                  <input id={`${data.slug}-quiz-phone`} className="input-dark" {...form.fields.phone} />
                  {form.errors.phone && <div className="easton-consult__error">{form.errors.phone}</div>}

                  <LeadHoneypot {...form.honeypotProps} />

                  {form.errors.quiz && <div className="easton-consult__error">{form.errors.quiz}</div>}
                  {form.message && <div className="easton-consult__error">{form.message}</div>}

                  <button
                    type="button"
                    className="easton-btn easton-btn--light"
                    onClick={form.submit}
                    disabled={form.isLoading}
                  >
                    {form.isLoading ? 'Отправка…' : 'Получить подбор'}
                  </button>
                  <div className="lead-policy">{CONSENT_POLICY}</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
