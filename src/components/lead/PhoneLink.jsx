import { phoneForHref, phoneNumbers } from '../../data/phones';
import { LEAD_EVENTS, trackEvent } from '../../lead/analytics';
import { usePhoneReveal } from './PhoneRevealProvider';

/**
 * Номер отдела продаж в интерфейсе (ТЗ 7, 10).
 *
 * До заявки номер показан со скрытой серединой, и клик открывает форму
 * «Получить номер отдела продаж» — так каждый показ номера приносит лид.
 * После отправки (и до конца сессии) это обычная ссылка на звонок.
 *
 * Если у точки показа несколько линий (колл-центр ЖК), скрытыми показаны все
 * и открываются они одной заявкой: заставлять оставлять номер дважды, чтобы
 * увидеть вторую линию того же отдела продаж, — потерянный звонок.
 *
 * Лид по клику на открытый номер намеренно не создаётся: пустая заявка без
 * имени и вопроса только засоряет воронку. Сам звонок учитывает подключённая
 * телефония Bitrix24, а здесь фиксируется только намерение позвонить.
 *
 * @param {Object} props
 * @param {string} [props.href] Ссылка вида `tel:+7…`. Игнорируется, если задан `phone`.
 * @param {Object} [props.phone] Готовая запись номера — набор линий колл-центра ЖК.
 * @param {string} [props.city] Город номера — уходит в заявку.
 * @param {string} [props.project] ЖК, со страницы которого просят номер.
 * @param {string} [props.ctaLocation] Расположение номера на странице.
 * @param {string} [props.hours] График приёма звонков для формы показа номера.
 */
export default function PhoneLink({
  href,
  phone: phoneProp,
  city,
  project,
  ctaLocation,
  hours,
  className,
  onClick,
  children,
}) {
  const { isRevealed, openReveal } = usePhoneReveal();
  const phone = phoneProp ?? phoneForHref(href);
  // Ссылка набора ведёт на первую линию: по ней же запоминается открытый номер.
  const target = phone?.href ?? href;
  const numbers = phoneNumbers(phone);

  const trackCall = () =>
    trackEvent(LEAD_EVENTS.PHONE_CLICK, {
      city,
      cta_location: ctaLocation,
      page: window.location.href,
    });

  // Незнакомый номер скрывать нечем: полного значения для него нет.
  if (!phone || isRevealed(target)) {
    const handleClick = (e) => {
      trackCall();
      onClick?.(e);
    };

    if (numbers.length > 1) {
      return (
        <span className="phone-links">
          {numbers.map((n) => (
            <a key={n.href} href={n.href} className={className} onClick={handleClick}>
              {n.full}
            </a>
          ))}
        </span>
      );
    }

    return (
      <a href={target} className={className} onClick={handleClick}>
        {numbers[0]?.full ?? children}
      </a>
    );
  }

  const isMulti = numbers.length > 1;

  return (
    <button
      type="button"
      className={`phone-reveal-trigger${className ? ` ${className}` : ''}`}
      aria-haspopup="dialog"
      aria-label={
        isMulti
          ? 'Показать номера отдела продаж'
          : `${phone.display} — показать номер отдела продаж`
      }
      title={isMulti ? 'Показать номера отдела продаж' : 'Показать номер отдела продаж'}
      onClick={(e) => {
        onClick?.(e);
        openReveal({ phoneHref: target, phone, city, project, ctaLocation, hours });
      }}
    >
      {children ??
        (isMulti ? (
          <span className="phone-links">
            {numbers.map((n) => (
              <span key={n.href}>{n.display}</span>
            ))}
          </span>
        ) : (
          phone.display
        ))}
    </button>
  );
}
