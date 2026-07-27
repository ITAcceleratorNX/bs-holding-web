import InstallmentCalculator from './InstallmentCalculator';
import { getCityCalculator } from '../data/calculator';
import { computeCalc, fmt, onlyDigits } from '../utils/format';

function CalcField({ label, value, onChange, suffix, min, max, step, onRangeChange }) {
  return (
    <div className="calc-field">
      <label>{label}</label>
      <div className="calc-field__input">
        <input value={value} onChange={onChange} />
        <span>{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={typeof value === 'number' ? value : onlyDigits(value)}
        onChange={onRangeChange}
        className="calc-field__range"
      />
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
  termM,
  setTermM,
  leadName,
  setLeadName,
  leadPhone,
  setLeadPhone,
  leadState,
  submitLead,
}) {
  const calc = computeCalc({ price, down, termY, rate, termM, calcMode });
  /**
   * Для городов с утверждёнными условиями рассрочки показывается геозависимый
   * калькулятор. Вкладка «Ипотека» для них не выводится — банковские условия
   * не предоставлены (ТЗ 2, 9). Остальные города используют общий калькулятор.
   */
  const cityConfig = getCityCalculator(city);

  if (cityConfig) {
    return (
      <section className="section calculator">
        <h2 className="section-title">
          {cityConfig.title} · {cityConfig.city}
        </h2>
        <p className="calculator__subtitle">{cityConfig.subtitle}</p>
        <InstallmentCalculator config={cityConfig} lang={lang} />
      </section>
    );
  }

  return (
    <section className="section calculator">
      <h2 className="section-title">Ипотечный калькулятор</h2>
      <div className="calc-modes">
        <button
          type="button"
          onClick={() => setCalcMode('Ипотека')}
          className={`calc-mode${calcMode === 'Ипотека' ? ' is-active' : ''}`}
        >
          Ипотека
        </button>
        <button
          type="button"
          onClick={() => setCalcMode('Рассрочка')}
          className={`calc-mode${calcMode === 'Рассрочка' ? ' is-active' : ''}`}
        >
          Рассрочка
        </button>
      </div>
      <div className="calc-panel">
        <div className="calc-panel__form">
          <CalcField
            label="Стоимость недвижимости"
            value={fmt(price)}
            onChange={(e) => setPrice(onlyDigits(e.target.value))}
            suffix="₸"
            min={5000000}
            max={100000000}
            step={100000}
            onRangeChange={(e) => setPrice(Number(e.target.value))}
          />
          <CalcField
            label="Первоначальный взнос"
            value={fmt(down)}
            onChange={(e) => setDown(onlyDigits(e.target.value))}
            suffix="₸"
            min={0}
            max={price}
            step={100000}
            onRangeChange={(e) => setDown(Number(e.target.value))}
          />
          {calcMode === 'Ипотека' && (
            <>
              <CalcField
                label="Срок займа"
                value={termY}
                onChange={(e) => setTermY(onlyDigits(e.target.value))}
                suffix="лет"
                min={1}
                max={25}
                step={1}
                onRangeChange={(e) => setTermY(Number(e.target.value))}
              />
              <CalcField
                label="Процентная ставка"
                value={rate}
                onChange={(e) => setRate(Number(String(e.target.value).replace(',', '.').replace(/[^0-9.]/g, '')) || 0)}
                suffix="%"
                min={1}
                max={25}
                step={0.1}
                onRangeChange={(e) => setRate(Number(e.target.value))}
              />
            </>
          )}
          {calcMode === 'Рассрочка' && (
            <CalcField
              label="Срок рассрочки"
              value={termM}
              onChange={(e) => setTermM(onlyDigits(e.target.value))}
              suffix="мес."
              min={1}
              max={12}
              step={1}
              onRangeChange={(e) => setTermM(Number(e.target.value))}
            />
          )}
          <p className="calc-panel__note">
            Результат ипотечного калькулятора не является публичной офертой. Для более точного расчёта оставьте заявку.
          </p>
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
          {leadState === 'success' ? (
            <div className="calc-lead calc-lead--success">
              <div className="calc-lead__title">Заявка отправлена!</div>
              <div className="calc-lead__sub">Мы свяжемся с вами в течение 10 минут и рассчитаем ваши условия.</div>
            </div>
          ) : (
            <div className="calc-lead">
              <div className="calc-lead__fields">
                <input
                  className="input-dark"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Ваше имя"
                />
                <input
                  className="input-dark"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Номер телефона"
                />
              </div>
              {leadState === 'error' && (
                <div className="form-error">Укажите имя и корректный номер телефона.</div>
              )}
              <button type="button" className="btn-white" onClick={submitLead}>
                {leadState === 'loading' ? 'Отправка…' : 'Получить расчёт'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
