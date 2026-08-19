import { useEffect, useState } from 'react';
import InstallmentCalculator from './InstallmentCalculator';
import LeadHoneypot from './lead/LeadHoneypot';
import LeadConsent from './lead/LeadConsent';
import { useI18n } from '../i18n/I18nContext';
import {
  DEFAULT_INSTALLMENT_CITY,
  INSTALLMENT_CITY_OPTIONS,
  getCityCalculator,
  getInstallmentConfig,
} from '../data/calculator';
import { LEAD_EVENTS, formEventParams, trackEvent } from '../lead/analytics';
import { buildDetails } from '../lead/details';
import { useLeadForm } from '../lead/useLeadForm';
import { clampNumber, computeCalc, fmt, onlyDigits } from '../utils/format';

/**
 * Границы полей ипотечного калькулятора. Ручной ввод приводится к ним, чтобы
 * поле не могло принять некорректное значение: сверху — сразу при вводе,
 * снизу — по уходу из поля (иначе нельзя было бы стереть и набрать число).
 */
const MORTGAGE_LIMITS = {
  price: { min: 5000000, max: 100000000, step: 100000 },
  termY: { min: 1, max: 25, step: 1 },
  rate: { min: 1, max: 25, step: 0.1 },
};

function CalcField({ label, value, onInput, onCommit, suffix, min, max, step, onRangeChange, boundsText }) {
  return (
    <div className="calc-field">
      <label>{label}</label>
      <div className="calc-field__input">
        <input
          value={value}
          onChange={(e) => onInput(e.target.value)}
          onBlur={onCommit}
          inputMode="numeric"
        />
        <span>{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={typeof value === 'number' ? value : onlyDigits(value)}
        onChange={(e) => onRangeChange(Number(e.target.value))}
        className="calc-field__range"
      />
      {boundsText && (
        <div className="calc-geo__bounds">
          <span>{boundsText[0]}</span>
          <span>{boundsText[1]}</span>
        </div>
      )}
    </div>
  );
}

export default function Calculator({
  city,
  lang,
  calcMode,
  setCalcMode,
  price,
  setPrice,
  down,
  setDown,
  termY,
  setTermY,
  rate,
  setRate,
  onReset,
}) {
  const { t } = useI18n();
  /**
   * Город рассрочки выбирается внутри калькулятора. Город из шапки задаёт
   * начальное значение и обновляет его при смене (ТЗ 2), но обратной связи нет:
   * переключатель внутри калькулятора верхнюю панель не трогает.
   */
  const headerConfig = getCityCalculator(city);
  const [installmentCity, setInstallmentCity] = useState(() => headerConfig?.city ?? DEFAULT_INSTALLMENT_CITY);

  useEffect(() => {
    if (headerConfig) setInstallmentCity(headerConfig.city);
  }, [headerConfig]);

  const installmentConfig = getInstallmentConfig(installmentCity);

  /**
   * Вкладка «Ипотека» не выводится для городов с утверждёнными условиями
   * рассрочки — банковские условия не предоставлены (ТЗ 2, 9).
   */
  const showMortgage = !headerConfig;
  const mode = showMortgage ? calcMode : 'Рассрочка';
  const isInstallment = mode === 'Рассрочка';

  const calc = computeCalc({ price, down, termY, rate });

  /**
   * Заявка из ипотечного калькулятора (код формы `calculator_mortgage`).
   * В CRM уходят все введённые значения и рассчитанный платёж (ТЗ 6.3).
   */
  const form = useLeadForm({
    formCode: 'calculator_mortgage',
    city,
    ctaLocation: 'Главная — ипотечный калькулятор',
    consentMode: 'explicit',
    details: () =>
      buildDetails('calculator', [
        ['calc_mode', 'Режим расчёта', 'Ипотека'],
        ['calc_price', 'Стоимость недвижимости', `${fmt(price)} ₸`],
        ['calc_down', 'Первоначальный взнос', `${fmt(down)} ₸`],
        ['calc_term', 'Срок займа', `${termY} лет`],
        ['calc_rate', 'Процентная ставка', `${rate}%`],
        ['calc_monthly', 'Ежемесячный платёж', calc.mainValue],
        ['calc_lang', 'Язык интерфейса', lang],
      ]),
  });

  const submitMortgage = () => {
    trackEvent(
      LEAD_EVENTS.CALCULATOR_SUBMIT,
      formEventParams({ formCode: 'calculator_mortgage', city, ctaLocation: 'Главная — ипотечный калькулятор' }),
    );
    form.submit();
  };

  /** @param {number} next @param {boolean} commit приводить ли к нижней границе */
  const applyPrice = (next, commit) => {
    const { min, max } = MORTGAGE_LIMITS.price;
    const safe = commit ? clampNumber(next, min, max) : clampNumber(next, 0, max);
    setPrice(safe);
    // Первоначальный взнос не может превышать стоимость недвижимости.
    setDown((prev) => Math.min(prev, safe));
  };

  const applyDown = (next) => setDown(clampNumber(next, 0, price));

  const applyTermY = (next, commit) => {
    const { min, max } = MORTGAGE_LIMITS.termY;
    setTermY(commit ? clampNumber(next, min, max) : clampNumber(next, 0, max));
  };

  const applyRate = (next, commit) => {
    const { min, max } = MORTGAGE_LIMITS.rate;
    setRate(commit ? clampNumber(next, min, max) : clampNumber(next, 0, max));
  };

  const parseRate = (raw) => Number(String(raw).replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

  return (
    <section className="section calculator">
      <h2 className="section-title">
        {isInstallment ? `${installmentConfig.title} · ${installmentConfig.city}` : t('calc.title.mortgage')}
      </h2>

      {showMortgage && (
        <div className="calc-modes">
          <button
            type="button"
            onClick={() => setCalcMode('Ипотека')}
            className={`calc-mode${mode === 'Ипотека' ? ' is-active' : ''}`}
          >
            {t('calc.mortgage')}
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('Рассрочка')}
            className={`calc-mode${mode === 'Рассрочка' ? ' is-active' : ''}`}
          >
            {t('calc.installment')}
          </button>
          {onReset && (
            <button type="button" className="calc-reset" onClick={onReset}>
              {t('calc.reset')}
            </button>
          )}
        </div>
      )}

      {isInstallment ? (
        <>
          <p className="calculator__subtitle">{installmentConfig.subtitle}</p>
          <InstallmentCalculator
            config={installmentConfig}
            lang={lang}
            cityOptions={INSTALLMENT_CITY_OPTIONS}
            cityId={installmentConfig.city}
            onCityChange={setInstallmentCity}
          />
        </>
      ) : (
        <div className="calc-panel">
          <div className="calc-panel__form">
            <CalcField
              label={t('calc.field.price')}
              value={fmt(price)}
              onInput={(raw) => applyPrice(onlyDigits(raw), false)}
              onCommit={() => applyPrice(price, true)}
              suffix="₸"
              min={MORTGAGE_LIMITS.price.min}
              max={MORTGAGE_LIMITS.price.max}
              step={MORTGAGE_LIMITS.price.step}
              onRangeChange={(v) => applyPrice(v, true)}
              boundsText={[`${fmt(MORTGAGE_LIMITS.price.min)} ₸`, `${fmt(MORTGAGE_LIMITS.price.max)} ₸`]}
            />
            <CalcField
              label={t('calc.field.down')}
              value={fmt(down)}
              onInput={(raw) => applyDown(onlyDigits(raw))}
              onCommit={() => applyDown(down)}
              suffix="₸"
              min={0}
              max={price}
              step={MORTGAGE_LIMITS.price.step}
              onRangeChange={applyDown}
              boundsText={['0 ₸', `${fmt(price)} ₸`]}
            />
            <CalcField
              label={t('calc.field.term')}
              value={termY}
              onInput={(raw) => applyTermY(onlyDigits(raw), false)}
              onCommit={() => applyTermY(termY, true)}
              suffix={t('calc.field.term.years')}
              min={MORTGAGE_LIMITS.termY.min}
              max={MORTGAGE_LIMITS.termY.max}
              step={MORTGAGE_LIMITS.termY.step}
              onRangeChange={(v) => applyTermY(v, true)}
              boundsText={[`${MORTGAGE_LIMITS.termY.min} ${t('calc.field.term.year')}`, `${MORTGAGE_LIMITS.termY.max} ${t('calc.field.term.years')}`]}
            />
            <CalcField
              label={t('calc.field.rate')}
              value={rate}
              onInput={(raw) => applyRate(parseRate(raw), false)}
              onCommit={() => applyRate(rate, true)}
              suffix="%"
              min={MORTGAGE_LIMITS.rate.min}
              max={MORTGAGE_LIMITS.rate.max}
              step={MORTGAGE_LIMITS.rate.step}
              onRangeChange={(v) => applyRate(v, true)}
              boundsText={[`${MORTGAGE_LIMITS.rate.min}%`, `${MORTGAGE_LIMITS.rate.max}%`]}
            />
            <p className="calc-panel__note">{t('calc.note')}</p>
          </div>
          <div className="calc-panel__result">
            <div className="calc-result-block">
              <div className="calc-result-block__label">{calc.mainLabel}</div>
              <div className="calc-result-block__value calc-result-block__value--lg">{calc.mainValue}</div>
              <div className="calc-result-block__sub">{calc.mainSub}</div>
            </div>
            <div className="calc-result-block">
              <div className="calc-result-block__value calc-result-block__value--md">{calc.statValue}</div>
              <div className="calc-result-block__sub">{calc.statLabel}</div>
            </div>
            {form.isSuccess ? (
              <div className="calc-lead calc-lead--success">
                <div className="calc-lead__title">{t('calc.success.title')}</div>
                <div className="calc-lead__sub">{t('calc.success.sub')}</div>
              </div>
            ) : (
              <div className="calc-lead">
                <div className="calc-lead__fields">
                  <input
                    className="input-dark"
                    placeholder={t('form.name.placeholder')}
                    aria-label={t('form.name.label')}
                    {...form.fields.name}
                  />
                  <input className="input-dark" aria-label={t('form.phone.label')} {...form.fields.phone} />
                </div>

                <LeadHoneypot {...form.honeypotProps} />

                {(form.errors.name || form.errors.phone || form.message) && (
                  <div className="form-error">{form.errors.name || form.errors.phone || form.message}</div>
                )}
                <LeadConsent form={form} />
                <button type="button" className="btn-white" onClick={submitMortgage} disabled={form.isLoading}>
                  {form.isLoading ? t('form.sending') : t('calc.submit')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
