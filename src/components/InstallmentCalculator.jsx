import { useEffect, useMemo, useRef, useState } from 'react';
import LeadHoneypot from './lead/LeadHoneypot';
import { AREA_STEP, ROOM_OPTIONS, getRoomOption } from '../data/calculator';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../lead/analytics';
import { buildDetails } from '../lead/details';
import { useLeadForm } from '../lead/useLeadForm';
import { allowedTermRange, computeInstallment } from '../utils/installment';
import { clampNumber, fmt } from '../utils/format';
import { useI18n } from '../i18n/I18nContext';
import { cityLabel } from '../data/cities';

const tenge = (n) => `${fmt(n)} ₸`;
/** @param {{min: number, max: number}} r */
const tengeRange = (r) => (r.min === r.max ? tenge(r.min) : `${fmt(r.min)} – ${fmt(r.max)} ₸`);
/** Значение может быть числом (точный расчёт) или диапазоном (расчёт «от–до»). */
const value = (v) => (v == null ? '—' : typeof v === 'number' ? tenge(v) : tengeRange(v));

/** Подпись опции: ключ перевода, город или готовый текст (проценты, «30%»). */
function optionLabel(t, opt) {
  if (opt.cityLabel) return cityLabel(t, opt.cityLabel);
  if (opt.labelKey) return opt.labelSuffix ? `${t(opt.labelKey)} ${opt.labelSuffix}` : t(opt.labelKey);
  return opt.label;
}

function OptionGroup({ label, options, current, onSelect, name, t }) {
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
            {optionLabel(t, opt)}
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

function ResultRows({ result, t }) {
  const rows = [];
  const room = getRoomOption(result.roomId);
  const months = t('calc.unit.months');

  if (result.block) rows.push([t('calc.row.block'), optionLabel(t, result.block)]);
  rows.push([t('calc.row.roomsArea'), `${room ? t(room.labelKey) : '—'} · ${result.area} ${t('units.m2')}`]);
  rows.push([
    t('calc.row.pricePerM2'),
    typeof result.pricePerM2 === 'number' ? tenge(result.pricePerM2) : tengeRange(result.pricePerM2),
  ]);
  rows.push([
    typeof result.total === 'number' ? t('calc.row.totalFull') : t('calc.row.total'),
    value(result.total),
  ]);

  if (result.isFullPayment) {
    rows.push([t('calc.row.payment'), t('calc.payment.full')]);
  } else {
    rows.push([t('calc.payment.down', { percent: result.payment.downPercent }), value(result.down)]);
    rows.push([t('calc.row.remainder'), value(result.remainder)]);
    if (result.surcharge != null) {
      rows.push([
        t('calc.row.surcharge', { percent: result.payment.surchargePercent }),
        value(result.surcharge),
      ]);
      rows.push([t('calc.row.installmentSum'), value(result.installmentSum)]);
    }
    rows.push([t('calc.row.term'), `${result.months} ${months}`]);
    rows.push([t('calc.row.monthly'), value(result.monthly)]);
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
  const { t } = useI18n();
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
    validate: () => (result?.canSubmit ? {} : { calc: t('calc.error.params') }),
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
    ? {
        label: t('calc.headline.total'),
        text: value(result.total),
        sub: t('calc.headline.totalSub', { price: value(result.pricePerM2) }),
      }
    : {
        label: t('calc.headline.monthly'),
        text: value(result.monthly),
        sub: t('calc.headline.monthlySub', { months: result.months, percent: payment.downPercent }),
      };

  // Верхняя граница ниже городской — из-за минимального платежа. Об этом нужно
  // сказать явно, иначе «недоступный» участок ползунка выглядит ошибкой (ТЗ 7).
  const termHint =
    config.minMonthlyPayment && termRange.max < config.term.max
      ? t('calc.termHint', {
          min: tenge(config.minMonthlyPayment),
          max: termRange.max,
          total: config.term.max,
        })
      : null;

  return (
    <div className="calc-panel calc-geo">
      <div className="calc-panel__form">
        {cityOptions?.length > 1 && (
          <OptionGroup
            name="calc-city"
            t={t}
            label={t('calc.field.city')}
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
            t={t}
            label={t('calc.field.block')}
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
          t={t}
          label={t('calc.field.rooms')}
          options={ROOM_OPTIONS}
          current={roomId}
          onSelect={selectRoom}
        />

        <SliderField
          id="calc-area"
          label={t('calc.field.area')}
          valueText={`${area} ${t('units.m2')}`}
          min={room.areaMin}
          max={room.areaMax}
          step={AREA_STEP}
          current={area}
          onChange={(v) => {
            setArea(v);
            resetResult();
          }}
          boundsText={[`${room.areaMin} ${t('units.m2')}`, `${room.areaMax} ${t('units.m2')}`]}
        />

        <OptionGroup
          name="calc-payment"
          t={t}
          label={config.kind === 'exact' ? t('calc.field.payment') : t('calc.field.down')}
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
            label={t('calc.field.termInstallment')}
            valueText={`${result.months} ${t('calc.unit.months')}`}
            min={termRange.min}
            max={termRange.max}
            current={result.months}
            onChange={(v) => {
              setMonths(clampNumber(v, termRange.min, termRange.max));
              resetResult();
            }}
            boundsText={[
              `${termRange.min} ${t('calc.unit.months')}`,
              `${termRange.max} ${t('calc.unit.months')}`,
            ]}
            hint={termHint}
            error={
              result.error?.field === 'months'
                ? t(result.error.messageKey, { min: tenge(result.error.messageVars.min) })
                : null
            }
          />
        )}

        <p className="calc-panel__note">
          {t('calc.note.installment')}
          {config.kind === 'range' && t('calc.note.range')}
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
            {t('calc.result.sub', {
              rooms: t(room.labelKey),
              area: result.area,
              price: typeof result.pricePerM2 === 'number' ? tenge(result.pricePerM2) : tengeRange(result.pricePerM2),
            })}
          </div>
        </div>

        {form.isSuccess && submittedResult ? (
          <div className="calc-lead calc-lead--success">
            <div className="calc-lead__title">{t('calc.result.ready')}</div>
            <ResultRows result={submittedResult} t={t} />
            <div className="calc-lead__sub">{t('calc.result.accepted')}</div>
          </div>
        ) : (
          <div className="calc-lead">
            <div className="calc-lead__fields">
              <div className="calc-geo__field">
                <input
                  className="input-dark"
                  placeholder={t('calc.name.placeholder')}
                  aria-label={t('calc.name.placeholder')}
                  {...form.fields.name}
                />
                {form.errors.name && <div className="calc-geo__error">{form.errors.name}</div>}
              </div>
              <div className="calc-geo__field">
                <input className="input-dark" aria-label={t('calc.phone.label')} {...form.fields.phone} />
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
              <span>{t('calc.consent')}</span>
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
              {form.isLoading ? t('form.sending') : t('calc.submit')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
