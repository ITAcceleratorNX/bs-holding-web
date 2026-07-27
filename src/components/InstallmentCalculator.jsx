import { useEffect, useMemo, useRef, useState } from 'react';
import { AREA_STEP, ROOM_OPTIONS, getRoomOption } from '../data/calculator';
import { computeInstallment } from '../utils/installment';
import { fmt, formatKzPhone, kzPhoneE164, kzPhoneOk, nameOk } from '../utils/format';
import { LEAD_SOURCES, submitLead } from '../utils/leads';

const tenge = (n) => `${fmt(n)} ₸`;
/** @param {{min: number, max: number}} r */
const tengeRange = (r) => (r.min === r.max ? tenge(r.min) : `${fmt(r.min)} – ${fmt(r.max)} ₸`);
/** Значение может быть числом (точный расчёт) или диапазоном (расчёт «от–до»). */
const value = (v) => (v == null ? '—' : typeof v === 'number' ? tenge(v) : tengeRange(v));

/**
 * Начальный срок — максимальный из доступных, чтобы калькулятор открывался
 * с реалистичным платежом. Для расчёта диапазоном срок дополнительно
 * ограничивается правилом минимального платежа, иначе поле стартовало бы
 * с ошибкой (ТЗ 5.4).
 * @param {object} config
 * @returns {number}
 */
function defaultMonths(config) {
  if (config.kind !== 'range') return config.term.max;
  const probe = computeInstallment({
    config,
    roomId: ROOM_OPTIONS[0].id,
    area: ROOM_OPTIONS[0].areaMin,
    paymentId: config.payments[0].id,
    months: config.term.max,
  });
  return probe?.maxAllowedMonths ?? config.term.min;
}

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
 */
export default function InstallmentCalculator({ config, lang, projectName }) {
  const [blockId, setBlockId] = useState(() => config.blocks?.[0]?.id ?? null);
  const [roomId, setRoomId] = useState(ROOM_OPTIONS[0].id);
  const [area, setArea] = useState(ROOM_OPTIONS[0].areaMin);
  const [paymentId, setPaymentId] = useState(() => config.payments[0].id);
  const [months, setMonths] = useState(() => defaultMonths(config));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState('idle');
  const [fieldErrors, setFieldErrors] = useState({});
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
    setMonths(defaultMonths(config));
    setSubmittedResult(null);
    setFormState('idle');
    setFieldErrors({});
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

  const result = useMemo(
    () => computeInstallment({ config, blockId, roomId, area, paymentId, months }),
    [config, blockId, roomId, area, paymentId, months],
  );

  const payment = result?.payment ?? config.payments[0];
  const showTerm = !payment.full;

  const resetResult = () => setSubmittedResult(null);

  const submit = async () => {
    const errors = {};
    if (!nameOk(name)) errors.name = 'Укажите имя';
    if (!kzPhoneOk(phone)) errors.phone = 'Укажите номер в формате +7 (7XX) XXX-XX-XX';
    if (!consent) errors.consent = 'Необходимо согласие на обработку персональных данных';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || !result?.canSubmit) {
      setFormState('error');
      return;
    }

    setFormState('loading');
    const submittedFor = config;
    try {
      await submitLead({
        source: LEAD_SOURCES.INSTALLMENT_CALC,
        city: config.city,
        ...(projectName ? { project: projectName } : {}),
        ...(result.block ? { block: result.block.label } : {}),
        name: name.trim(),
        phone: kzPhoneE164(phone),
        lang,
        rooms: room.label,
        area: `${result.area} м²`,
        payment: payment.title,
        downPercent: payment.full ? null : payment.downPercent,
        surchargePercent: payment.surchargePercent ?? null,
        months: result.months,
        pricePerM2: result.pricePerM2,
        total: result.total,
        down: result.down,
        remainder: result.remainder,
        surcharge: result.surcharge,
        installmentSum: result.installmentSum,
        monthly: result.monthly,
      });
      // Заявка ушла с параметрами прежнего города — на экране показывать её не нужно.
      if (configRef.current !== submittedFor) return;
      setSubmittedResult(result);
      setFormState('success');
    } catch {
      if (configRef.current !== submittedFor) return;
      setFormState('error');
    }
  };

  if (!result) return null;

  const headline = payment.full
    ? { label: 'Полная стоимость', text: value(result.total), sub: `Полная оплата · ${value(result.pricePerM2)}/м²` }
    : {
        label: 'Ежемесячный платёж',
        text: value(result.monthly),
        sub: `${result.months} мес. · первоначальный взнос ${payment.downPercent}%`,
      };

  const termHint =
    config.minMonthlyPayment && result.maxAllowedMonths
      ? `При текущих параметрах доступен срок до ${result.maxAllowedMonths} мес.`
      : null;

  return (
    <div className="calc-panel calc-geo">
      <div className="calc-panel__form">
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
            min={config.term.min}
            max={config.term.max}
            current={result.months}
            onChange={(v) => {
              setMonths(v);
              resetResult();
            }}
            boundsText={[`${config.term.min} мес.`, `${config.term.max} мес.`]}
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

        {formState === 'success' && submittedResult ? (
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
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="Ваше имя"
                  aria-label="Ваше имя"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && <div className="calc-geo__error">{fieldErrors.name}</div>}
              </div>
              <div className="calc-geo__field">
                <input
                  className="input-dark"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatKzPhone(e.target.value));
                    setFieldErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="+7 (___) ___-__-__"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-label="Номер телефона"
                  aria-invalid={Boolean(fieldErrors.phone)}
                />
                {fieldErrors.phone && <div className="calc-geo__error">{fieldErrors.phone}</div>}
              </div>
            </div>

            <label className={`calc-geo__consent${consent ? ' is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setFieldErrors((p) => ({ ...p, consent: undefined }));
                }}
              />
              <span className="calc-geo__consent-box" aria-hidden="true" />
              <span>Согласен на обработку персональных данных</span>
            </label>
            {fieldErrors.consent && <div className="calc-geo__error">{fieldErrors.consent}</div>}

            {formState === 'error' && !Object.values(fieldErrors).some(Boolean) && (
              <div className="form-error">Не удалось отправить заявку. Попробуйте ещё раз.</div>
            )}

            <button
              type="button"
              className="btn-white"
              onClick={submit}
              disabled={formState === 'loading' || !result.canSubmit}
            >
              {formState === 'loading' ? 'Отправка…' : 'Получить расчет'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
