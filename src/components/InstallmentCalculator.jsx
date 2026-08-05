import { useEffect, useMemo, useRef, useState } from 'react';
import LeadHoneypot from './lead/LeadHoneypot';
import { AREA_STEP, ROOM_OPTIONS, getRoomOption } from '../data/calculator';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../lead/analytics';
import { buildDetails } from '../lead/details';
import { useLeadForm } from '../lead/useLeadForm';
import { allowedTermRange, computeInstallment } from '../utils/installment';
import { clampNumber, fmt } from '../utils/format';

const tenge = (n) => `${fmt(n)} ₸`;
/** @param {{min: number, max: number}} r */
const tengeRange = (r) => (r.min === r.max ? tenge(r.min) : `${fmt(r.min)} – ${fmt(r.max)} ₸`);
/** Значение может быть числом (точный расчёт) или диапазоном (расчёт «от–до»). */
const value = (v) => (v == null ? '—' : typeof v === 'number' ? tenge(v) : tengeRange(v));

function OptionGroup({ label, options, current, onSelect, name }) {
  return (
    <div className="calc-field calc-geo__group">
      <label id={`${name}-label`}>{label}</label>
      <div className="calc-geo__options" role="radiogroup" aria-labelledby={`${name}-label`}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={current === opt.id}
            className={`calc-geo__option${current === opt.id ? ' is-active' : ''}`}
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SliderField({ label, valueText, min, max, step = 1, current, onChange, boundsText, hint, error, id }) {
  return (
    <div className="calc-field calc-geo__group">
      <div className="calc-geo__slider-head">
        <label htmlFor={id}>{label}</label>
        <span className="calc-geo__slider-value">{valueText}</span>
      </div>
      <input
        id={id}
        type="range"
        className="calc-field__range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-invalid={Boolean(error)}
      />
      <div className="calc-geo__bounds">
        <span>{boundsText?.[0]}</span>
        <span>{boundsText?.[1]}</span>
      </div>
      {hint && !error && <div className="calc-geo__hint">{hint}</div>}
      {error && <div className="calc-geo__error">{error}</div>}
    </div>
  );
}

function ResultRows({ result }) {
  const rows = [];
  const room = getRoomOption(result.roomId);

  if (result.block) rows.push(['Блок', result.block.label]);
  rows.push(['Комнатность и площадь', `${room?.label ?? '—'} · ${result.area} м²`]);
  rows.push([
    'Цена за 1 м²',
    typeof result.pricePerM2 === 'number' ? tenge(result.pricePerM2) : tengeRange(result.pricePerM2),
  ]);
  rows.push([
    typeof result.total === 'number' ? 'Полная стоимость квартиры' : 'Стоимость квартиры',
    value(result.total),
  ]);

  if (result.isFullPayment) {
    rows.push(['Вариант оплаты', 'Полная оплата']);
  } else {
    rows.push([`Первоначальный взнос ${result.payment.downPercent}%`, value(result.down)]);
    rows.push(['Остаток', value(result.remainder)]);
    if (result.surcharge != null) {
      rows.push([`Надбавка на остаток ${result.payment.surchargePercent}%`, value(result.surcharge)]);
      rows.push(['Сумма рассрочки', value(result.installmentSum)]);
    }
    rows.push(['Срок рассрочки', `${result.months} мес.`]);
    rows.push(['Ежемесячный платёж', value(result.monthly)]);
  }

  return (
    <dl className="calc-geo__rows">
      {rows.map(([label, text]) => (
        <div key={label} className="calc-geo__row">
          <dt>{label}</dt>
          <dd>{text}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Калькулятор рассрочки с условиями выбранного города.
 * Тарифы и формулы приходят извне: data/calculator.js и utils/installment.js.
 *
 * Город выбирается внутри калькулятора (`cityOptions` + `cityId`), выбор города
 * в шапке сайта при этом не меняется — им управляет родительский компонент.
 */
export default function InstallmentCalculator({ config, lang, projectName, cityOptions, cityId, onCityChange }) {
  const [blockId, setBlockId] = useState(() => config.blocks?.[0]?.id ?? null);
  const [roomId, setRoomId] = useState(ROOM_OPTIONS[0].id);
  const [area, setArea] = useState(ROOM_OPTIONS[0].areaMin);
  const [paymentId, setPaymentId] = useState(() => config.payments[0].id);
  /**
   * Хранится «желаемый» срок: к допустимому диапазону он приводится ниже.
   * Калькулятор открывается на максимальном сроке города — так виден
   * минимальный платёж.
   */
  const [months, setMonths] = useState(() => config.term.max);
  /** Итоговый расчёт показывается после успешной отправки формы (ТЗ 6). */
  const [submittedResult, setSubmittedResult] = useState(null);

  // Город, для которого идёт отправка: если во время запроса его сменили,
  // устаревший результат показывать нельзя.
  const configRef = useRef(config);

  // Смена города: несовместимые значения сбрасываются, комнатность и площадь
  // общие для всех городов и сохраняются (ТЗ 2).
  useEffect(() => {
    configRef.current = config;
    setBlockId(config.blocks?.[0]?.id ?? null);
    setPaymentId(config.payments[0].id);
    setMonths(config.term.max);
    setSubmittedResult(null);
  }, [config]);

  const room = getRoomOption(roomId) ?? ROOM_OPTIONS[0];

  const selectRoom = (id) => {
    const next = getRoomOption(id);
    if (!next) return;
    setRoomId(id);
    // Площадь доступна только в диапазоне выбранной комнатности (ТЗ 3).
    setArea((prev) => Math.min(next.areaMax, Math.max(next.areaMin, prev)));
    setSubmittedResult(null);
  };

  /**
   * Срок доступен только в допустимом диапазоне: границы города, а для
   * Усть-Каменогорска — ещё и правило минимального платежа (ТЗ 5.4).
   * Ползунок не даёт выйти за них, а сохранённый срок приводится к диапазону
   * при смене остальных параметров.
   */
  const termRange = useMemo(
    () => allowedTermRange({ config, roomId, area, paymentId }),
    [config, roomId, area, paymentId],
  );
  const safeMonths = clampNumber(months, termRange.min, termRange.max);

  const result = useMemo(
    () => computeInstallment({ config, blockId, roomId, area, paymentId, months: safeMonths }),
    [config, blockId, roomId, area, paymentId, safeMonths],
  );

  const payment = result?.payment ?? config.payments[0];
  const showTerm = !payment.full;

  const resetResult = () => setSubmittedResult(null);

  /** Условия, с которыми ушла текущая отправка. */
  const submittedFor = useRef(config);

  /**
   * Заявка из калькулятора рассрочки (код формы `calculator_installment`).
   * В CRM уходят город, блок и все применённые городские условия (ТЗ 6.3).
   */
  const form = useLeadForm({
    formCode: 'calculator_installment',
    city: config.city,
    project: projectName ?? '',
    ctaLocation: 'Калькулятор рассрочки',
    // Здесь стоит явная галочка согласия, поэтому режим — explicit (ТЗ 4).
    consentMode: 'explicit',
    details: () =>
      buildDetails('calculator', [
        ['calc_mode', 'Режим расчёта', 'Рассрочка'],
        ['calc_city', 'Город расчёта', config.city],
        ['calc_block', 'Блок', result?.block?.label],
        ['calc_rooms', 'Комнатность', room.label],
        ['calc_area', 'Площадь', `${result?.area} м²`],
        ['calc_payment', 'Вариант оплаты', payment.title],
        ['calc_down_percent', 'Первоначальный взнос, %', payment.full ? null : payment.downPercent],
        ['calc_surcharge_percent', 'Надбавка на остаток, %', payment.surchargePercent],
        ['calc_term', 'Срок рассрочки', payment.full ? null : `${result?.months} мес.`],
        ['calc_price_per_m2', 'Цена за 1 м²', value(result?.pricePerM2)],
        ['calc_total', 'Стоимость квартиры', value(result?.total)],
        ['calc_down', 'Первоначальный взнос', payment.full ? null : value(result?.down)],
        ['calc_remainder', 'Остаток', payment.full ? null : value(result?.remainder)],
        ['calc_surcharge', 'Надбавка', result?.surcharge == null ? null : value(result.surcharge)],
        ['calc_installment_sum', 'Сумма рассрочки', result?.installmentSum == null ? null : value(result.installmentSum)],
        ['calc_monthly', 'Ежемесячный платёж', payment.full ? null : value(result?.monthly)],
        ['calc_lang', 'Язык интерфейса', lang],
      ]),
    validate: () => (result?.canSubmit ? {} : { calc: 'Измените параметры расчёта' }),
    onSuccess: () => {
      // Заявка ушла с параметрами прежнего города — устаревший расчёт не показываем.
      if (configRef.current === submittedFor.current) setSubmittedResult(result);
    },
  });

  // Смена города сбрасывает и форму: показывать успех от прежних условий нельзя.
  const { reset: resetForm } = form;
  useEffect(() => {
    resetForm();
  }, [config, resetForm]);

  const submitInstallment = () => {
    submittedFor.current = config;
    trackEvent(
      LEAD_EVENTS.CALCULATOR_SUBMIT,
      formEventParams({
        formCode: 'calculator_installment',
        city: config.city,
        project: projectName ?? '',
        ctaLocation: 'Калькулятор рассрочки',
      }),
    );
    form.submit();
  };

  if (!result) return null;

  const headline = payment.full
    ? { label: 'Полная стоимость', text: value(result.total), sub: `Полная оплата · ${value(result.pricePerM2)}/м²` }
    : {
        label: 'Ежемесячный платёж',
        text: value(result.monthly),
        sub: `${result.months} мес. · первоначальный взнос ${payment.downPercent}%`,
      };

  // Верхняя граница ниже городской — из-за минимального платежа. Об этом нужно
  // сказать явно, иначе «недоступный» участок ползунка выглядит ошибкой (ТЗ 7).
  const termHint =
    config.minMonthlyPayment && termRange.max < config.term.max
      ? `Минимальный ежемесячный платёж — ${tenge(config.minMonthlyPayment)}, поэтому при текущих параметрах доступен срок до ${termRange.max} мес. из ${config.term.max}.`
      : null;

  return (
    <div className="calc-panel calc-geo">
      <div className="calc-panel__form">
        {cityOptions?.length > 1 && (
          <OptionGroup
            name="calc-city"
            label="Город"
            options={cityOptions}
            current={cityId}
            onSelect={(id) => {
              if (id === cityId) return;
              onCityChange?.(id);
            }}
          />
        )}

        {config.blocks && (
          <OptionGroup
            name="calc-block"
            label="Блок"
            options={config.blocks}
            current={blockId}
            onSelect={(id) => {
              setBlockId(id);
              resetResult();
            }}
          />
        )}

        <OptionGroup
          name="calc-rooms"
          label="Комнатность"
          options={ROOM_OPTIONS}
          current={roomId}
          onSelect={selectRoom}
        />

        <SliderField
          id="calc-area"
          label="Площадь"
          valueText={`${area} м²`}
          min={room.areaMin}
          max={room.areaMax}
          step={AREA_STEP}
          current={area}
          onChange={(v) => {
            setArea(v);
            resetResult();
          }}
          boundsText={[`${room.areaMin} м²`, `${room.areaMax} м²`]}
        />

        <OptionGroup
          name="calc-payment"
          label={config.kind === 'exact' ? 'Вариант оплаты' : 'Первоначальный взнос'}
          options={config.payments}
          current={paymentId}
          onSelect={(id) => {
            setPaymentId(id);
            resetResult();
          }}
        />

        {/* При 100% оплате срок и ежемесячный платёж не применяются — поля скрываются (ТЗ 4.4, 7). */}
        {showTerm && (
          <SliderField
            id="calc-term"
            label="Срок рассрочки"
            valueText={`${result.months} мес.`}
            min={termRange.min}
            max={termRange.max}
            current={result.months}
            onChange={(v) => {
              setMonths(clampNumber(v, termRange.min, termRange.max));
              resetResult();
            }}
            boundsText={[`${termRange.min} мес.`, `${termRange.max} мес.`]}
            hint={termHint}
            error={result.error?.field === 'months' ? result.error.message : null}
          />
        )}

        <p className="calc-panel__note">
          Расчёт носит предварительный характер и не является публичной офертой.
          {config.kind === 'range' && ' Точная стоимость зависит от конкретной квартиры и уточняется менеджером.'}
        </p>
      </div>

      <div className="calc-panel__result">
        <div className="calc-result-block">
          <div className="calc-result-block__label">{headline.label}</div>
          <div
            className={`calc-result-block__value ${
              config.kind === 'range' ? 'calc-result-block__value--sm' : 'calc-result-block__value--lg'
            }`}
          >
            {headline.text}
          </div>
          <div className="calc-result-block__sub">{headline.sub}</div>
        </div>

        <div className="calc-result-block">
          <div className={`calc-result-block__value ${config.kind === 'range' ? 'calc-result-block__value--sm' : 'calc-result-block__value--md'}`}>
            {value(result.total)}
          </div>
          <div className="calc-result-block__sub">
            Стоимость квартиры · {room.label} · {result.area} м² ·{' '}
            {typeof result.pricePerM2 === 'number' ? tenge(result.pricePerM2) : tengeRange(result.pricePerM2)}/м²
          </div>
        </div>

        {form.isSuccess && submittedResult ? (
          <div className="calc-lead calc-lead--success">
            <div className="calc-lead__title">Ваш расчёт готов</div>
            <ResultRows result={submittedResult} />
            <div className="calc-lead__sub">Заявка принята — менеджер свяжется с вами и подтвердит условия.</div>
          </div>
        ) : (
          <div className="calc-lead">
            <div className="calc-lead__fields">
              <div className="calc-geo__field">
                <input
                  className="input-dark"
                  placeholder="Ваше имя"
                  aria-label="Ваше имя"
                  {...form.fields.name}
                />
                {form.errors.name && <div className="calc-geo__error">{form.errors.name}</div>}
              </div>
              <div className="calc-geo__field">
                <input className="input-dark" aria-label="Номер телефона" {...form.fields.phone} />
                {form.errors.phone && <div className="calc-geo__error">{form.errors.phone}</div>}
              </div>
            </div>

            <LeadHoneypot {...form.honeypotProps} />

            <label className={`calc-geo__consent${form.consent ? ' is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => form.setConsent(e.target.checked)}
              />
              <span className="calc-geo__consent-box" aria-hidden="true" />
              <span>Согласен на обработку персональных данных</span>
            </label>
            {form.errors.consent && <div className="calc-geo__error">{form.errors.consent}</div>}
            {form.errors.calc && <div className="calc-geo__error">{form.errors.calc}</div>}

            {form.message && <div className="form-error">{form.message}</div>}

            <button
              type="button"
              className="btn-white"
              onClick={submitInstallment}
              disabled={form.isLoading || !result.canSubmit}
            >
              {form.isLoading ? 'Отправка…' : 'Получить расчет'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
