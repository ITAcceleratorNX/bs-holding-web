/**
 * Общее поведение всех форм сайта (ТЗ 8).
 *
 * Хук держит состояние полей, проверку, защиту от повторного нажатия,
 * идентификатор отправки, события аналитики и переход в WhatsApp. Форме
 * остаётся только разметка — за счёт этого тринадцать форм ведут себя
 * одинаково, а новая подключается одним вызовом.
 *
 * Состояния: `idle` → `loading` → `success` | `error`. Из `error` можно
 * отправить повторно, из `success` — только через `reset()`.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { LEAD_EVENTS, formEventParams, trackEvent } from './analytics';
import { getAttribution, getPageContext } from './attribution';
import { LIMITS, normalizeLead } from './contract';
import { useI18n } from '../i18n/I18nContext';
import { getFormMeta } from './formCodes';
import { formatKzPhone } from './phone';
import { createSubmissionId, postLead } from './submit';
import { buildWhatsappUrl, openPendingTab } from './whatsapp';

/**
 * @typedef {Object} LeadFormOptions
 * @property {string} formCode Код формы из реестра `FORM_CODES`.
 * @property {string} [city] Город. Пустой — сервер подставит Актау.
 * @property {string} [project] Название ЖК.
 * @property {string} [ctaLocation] Расположение кнопки, открывшей форму.
 * @property {Array|(() => Array)} [details] Данные квиза, планировки, расчёта.
 * @property {'implied'|'explicit'} [consentMode] Согласие по факту отправки или галочкой.
 * @property {() => Record<string, string>} [validate] Дополнительные проверки формы.
 * @property {(result: { leadId: number }) => void} [onSuccess]
 */

/**
 * @param {LeadFormOptions} options
 */
/**
 * Ошибки контракта приходят готовым русским текстом — он общий с сервером.
 * В интерфейсе показываем перевод по имени поля, незнакомые поля оставляем как есть.
 * @param {Function} t
 * @param {Record<string, string>} errors
 */
function translateContractErrors(t, errors) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [field, message] of Object.entries(errors)) {
    const key = `lead.error.${field}`;
    const translated = t(key);
    out[field] = translated === key ? message : translated;
  }
  return out;
}

export function useLeadForm({
  formCode,
  city = '',
  project = '',
  ctaLocation = '',
  details,
  consentMode = 'implied',
  validate,
  onSuccess,
}) {
  const { t } = useI18n();
  const [name, setNameRaw] = useState('');
  const [phone, setPhoneRaw] = useState('');
  // При согласии по факту отправки галочки нет: рядом с кнопкой стоит текст
  // политики, а факт и дата согласия всё равно уходят в CRM (ТЗ 4).
  const [consent, setConsentRaw] = useState(consentMode === 'implied');
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  /** Поле-ловушка: пользователь его не видит, автозаполнение обходит стороной. */
  const [honeypot, setHoneypot] = useState('');

  /** Момент показа формы — по нему сервер отличает бота от человека. */
  const renderedAt = useRef(Date.now());
  /** Один и тот же id при повторах: дубль в CRM не создаётся (ТЗ 8). */
  const submissionId = useRef('');
  /** Страховка от двойной отправки помимо состояния: клик может опередить рендер. */
  const inFlight = useRef(false);

  // Свежие значения для `submit`, чтобы не пересоздавать колбэк на каждый ввод.
  const latest = useRef({});
  latest.current = { name, phone, consent, honeypot, city, project, ctaLocation, details, validate, onSuccess, t };

  const setName = useCallback((value) => {
    setNameRaw(value.slice(0, LIMITS.name.max));
    setErrors((prev) => (prev.name ? { ...prev, name: undefined } : prev));
  }, []);

  const setPhone = useCallback((value) => {
    setPhoneRaw(formatKzPhone(value));
    setErrors((prev) => (prev.phone ? { ...prev, phone: undefined } : prev));
  }, []);

  const setConsent = useCallback((value) => {
    setConsentRaw(Boolean(value));
    setErrors((prev) => (prev.consent ? { ...prev, consent: undefined } : prev));
  }, []);

  const reset = useCallback(() => {
    setNameRaw('');
    setPhoneRaw('');
    setConsentRaw(consentMode === 'implied');
    setHoneypot('');
    setErrors({});
    setState('idle');
    setMessage('');
    setResult(null);
    submissionId.current = '';
    renderedAt.current = Date.now();
  }, [consentMode]);

  const submit = useCallback(async () => {
    if (inFlight.current) return;

    const current = latest.current;
    const eventParams = formEventParams({
      formCode,
      city: current.city,
      project: current.project,
      ctaLocation: current.ctaLocation,
    });

    const resolvedDetails =
      typeof current.details === 'function' ? current.details() : (current.details ?? []);

    const payload = {
      formCode,
      name: current.name.trim(),
      phone: current.phone,
      consent: current.consent,
      city: current.city,
      project: current.project,
      ctaLocation: current.ctaLocation,
      details: resolvedDetails,
      page: getPageContext(),
      attribution: getAttribution(),
      submissionId: submissionId.current || (submissionId.current = createSubmissionId()),
      renderedAt: renderedAt.current,
      hp: current.honeypot,
    };

    // Та же проверка, что и на сервере, — без лишнего запроса при пустых полях.
    const { ok, errors: contractErrors } = normalizeLead(payload);
    const extraErrors = current.validate?.() ?? {};
    const allErrors = { ...translateContractErrors(current.t, contractErrors), ...extraErrors };
    // `submissionId` формирует хук, пользователю о нём сообщать нечего.
    delete allErrors.submissionId;

    if (!ok || Object.keys(extraErrors).length > 0) {
      setErrors(allErrors);
      setState('error');
      setMessage('');
      trackEvent(LEAD_EVENTS.FORM_ERROR, { ...eventParams, error_code: 'validation' });
      return;
    }

    inFlight.current = true;
    setErrors({});
    setMessage('');
    setState('loading');
    trackEvent(LEAD_EVENTS.FORM_SUBMIT, eventParams);

    // Вкладку WhatsApp открываем сейчас, пока браузер ещё считает это реакцией
    // на клик; адрес она получит после подтверждения лида (ТЗ 7).
    const needsWhatsapp = getFormMeta(formCode)?.whatsapp === true;
    const pendingTab = needsWhatsapp ? openPendingTab() : null;

    try {
      const response = await postLead(payload);

      if (!response.ok) {
        pendingTab?.cancel();
        setErrors(response.fields ?? {});
        setMessage(response.messageKey ? current.t(response.messageKey) : response.message);
        setState('error');
        trackEvent(LEAD_EVENTS.FORM_ERROR, { ...eventParams, error_code: response.error });
        return;
      }

      let whatsappUrl = '';
      if (needsWhatsapp) {
        whatsappUrl = buildWhatsappUrl({ formCode, project: current.project, city: current.city });
        const opened = pendingTab?.redirect(whatsappUrl) ?? false;
        trackEvent(LEAD_EVENTS.WHATSAPP_CLICK, eventParams);
        // Вкладку заблокировали — форма покажет обычную ссылку.
        if (opened) whatsappUrl = '';
      }

      setResult({ leadId: response.leadId, whatsappUrl });
      setState('success');
      trackEvent(LEAD_EVENTS.FORM_SUCCESS, { ...eventParams, lead_id: response.leadId });
      current.onSuccess?.({ leadId: response.leadId });
    } finally {
      inFlight.current = false;
    }
  }, [formCode]);

  const fields = useMemo(
    () => ({
      name: {
        value: name,
        onChange: (e) => setName(e.target.value),
        'aria-invalid': Boolean(errors.name),
        maxLength: LIMITS.name.max,
        autoComplete: 'name',
      },
      phone: {
        value: phone,
        onChange: (e) => setPhone(e.target.value),
        'aria-invalid': Boolean(errors.phone),
        inputMode: 'tel',
        autoComplete: 'tel',
        placeholder: '+7 (___) ___-__-__',
      },
    }),
    [name, phone, errors.name, errors.phone, setName, setPhone],
  );

  return {
    name,
    setName,
    phone,
    setPhone,
    consent,
    setConsent,
    consentMode,
    errors,
    state,
    message,
    leadId: result?.leadId ?? 0,
    /** Заполнена, только если вкладку WhatsApp заблокировал браузер. */
    whatsappUrl: result?.whatsappUrl ?? '',
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    /** Готовые пропсы для полей имени и телефона. */
    fields,
    /** Пропсы поля-ловушки. Форма отдаёт их в `<LeadHoneypot />`. */
    honeypotProps: { value: honeypot, onChange: (e) => setHoneypot(e.target.value) },
    submit,
    reset,
  };
}
