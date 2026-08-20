import { useEffect, useMemo, useState } from 'react';
import SectionLabel from './SectionLabel';
import LeadHoneypot from '../lead/LeadHoneypot';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../../lead/analytics';
import { buildDetails } from '../../lead/details';
import { useLeadForm } from '../../lead/useLeadForm';
import { useI18n } from '../../i18n/I18nContext';

function buildDefaultSteps(t) {
  return [
    {
      key: 'rooms',
      title: t('quiz.step.rooms'),
      options: [
        { value: '1', label: t('rooms.count1') },
        { value: '2', label: t('rooms.count2') },
        { value: '3', label: t('rooms.count3') },
        { value: '4', label: t('rooms.count4') },
      ],
    },
    {
      key: 'floor',
      title: t('quiz.step.floor'),
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
      title: t('quiz.step.layout'),
      options: [{ value: 'Свободная', label: t('quiz.layout.free') }],
    },
    {
      key: 'payment',
      title: t('quiz.step.payment'),
      options: [
        { value: 'Ипотека', label: t('quiz.payment.mortgage') },
        { value: 'Рассрочка', label: t('quiz.payment.installment') },
      ],
    },
  ];
}

function localizeQuizOptions(t, key, options) {
  if (!options) return options;
  if (key === 'rooms') {
    const map = { '1': 'rooms.count1', '2': 'rooms.count2', '3': 'rooms.count3', '4': 'rooms.count4' };
    return options.map((o) => (map[o.value] ? { ...o, label: t(map[o.value]) } : o));
  }
  if (key === 'payment') {
    return options.map((o) => {
      if (o.value === 'Ипотека') return { ...o, label: t('quiz.payment.mortgage') };
      if (o.value === 'Рассрочка') return { ...o, label: t('quiz.payment.installment') };
      return o;
    });
  }
  if (key === 'layout') {
    return options.map((o) =>
      o.value === 'Свободная' ? { ...o, label: t('quiz.layout.free') } : o,
    );
  }
  return options;
}

function buildSteps(quiz, t) {
  const defaults = buildDefaultSteps(t);
  if (!quiz) return defaults;
  return [
    {
      key: 'rooms',
      title: t('quiz.step.rooms'),
      options: localizeQuizOptions(t, 'rooms', quiz.rooms || defaults[0].options),
    },
    {
      key: 'floor',
      title: t('quiz.step.floor'),
      compact: true,
      options: quiz.floors || defaults[1].options,
    },
    {
      key: 'layout',
      title: t('quiz.step.layout'),
      options: localizeQuizOptions(t, 'layout', quiz.layouts || defaults[2].options),
    },
    {
      key: 'payment',
      title: t('quiz.step.payment'),
      options: localizeQuizOptions(t, 'payment', quiz.payments || defaults[3].options),
    },
  ];
}

/**
 * Квиз подбора квартиры (код формы `apartment_quiz`).
 */
export default function ProjectApartmentQuiz({ data }) {
  const { t } = useI18n();
  const steps = useMemo(() => buildSteps(data.quiz, t), [data.quiz, t]);
  const totalSteps = steps.length + 1;

  const [step, setStep] = useState(0);
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
    validate: () =>
      steps.every((s) => answers[s.key]) ? {} : { quiz: t('quiz.error.incomplete') },
  });

  const isContact = step >= steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

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
      <SectionLabel color={data.theme?.accentDark ?? '#1F6059'}>{t('quiz.label')}</SectionLabel>
      <h2 className="easton-h2 easton-h2--dark">{t('quiz.title', { name: data.name })}</h2>
      <p className="easton-body easton-body--dark project-quiz__lead">{t('quiz.lead')}</p>

      <div className="project-quiz__card">
        {form.isSuccess ? (
          <div className="project-quiz__success">
            <div className="project-quiz__success-title">{t('quiz.success.title')}</div>
            <div className="project-quiz__success-sub">{t('quiz.success.sub')}</div>
          </div>
        ) : (
          <>
            <div className="project-quiz__progress" aria-hidden="true">
              <div className="project-quiz__progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="project-quiz__meta">
              <span>{t('quiz.stepProgress', { current: step + 1, total: totalSteps })}</span>
              {step > 0 && (
                <button type="button" className="project-quiz__back" onClick={goBack}>
                  {t('quiz.back')}
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
                <h3 className="project-quiz__step-title">{t('quiz.contacts')}</h3>
                <div className="project-quiz__form">
                  <label htmlFor={`${data.slug}-quiz-name`}>{t('form.name.label')}</label>
                  <input
                    id={`${data.slug}-quiz-name`}
                    className="input-dark"
                    placeholder={t('form.name.placeholder')}
                    {...form.fields.name}
                  />
                  {form.errors.name && <div className="easton-consult__error">{form.errors.name}</div>}

                  <label htmlFor={`${data.slug}-quiz-phone`}>{t('form.phone.label')}</label>
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
                    {form.isLoading ? t('form.sending') : t('quiz.submit')}
                  </button>
                  <div className="lead-policy">{t('lead.consent')}</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
