import { phoneForHref, phoneNumbers } from '../../data/phones';
import { LEAD_EVENTS, trackEvent } from '../../lead/analytics';

/**
 * Номер отдела продаж в интерфейсе (ТЗ 7, 10).
 *
 * Номер показан полностью и ведёт на звонок — форму перед показом номера не
 * просим: путь до звонка должен быть в один клик.
 *
 * У точки показа может быть несколько линий (колл-центр ЖК) — тогда номера
 * идут списком, и каждый кликабелен.
 *
 * Лид по клику намеренно не создаётся: пустая заявка без имени и вопроса
 * только засоряет воронку. Сам звонок учитывает подключённая телефония
 * Bitrix24, а здесь фиксируется только намерение позвонить.
 *
 * @param {Object} props
 * @param {string} [props.href] Ссылка вида `tel:+7…`. Игнорируется, если задан `phone`.
 * @param {Object} [props.phone] Готовая запись номера — набор линий колл-центра ЖК.
 * @param {string} [props.city] Город номера — уходит в аналитику.
 * @param {string} [props.ctaLocation] Расположение номера на странице.
 */
export default function PhoneLink({ href, phone: phoneProp, city, ctaLocation, className, onClick, children }) {
  const phone = phoneProp ?? phoneForHref(href);
  const numbers = phoneNumbers(phone);

  const handleClick = (e) => {
    trackEvent(LEAD_EVENTS.PHONE_CLICK, {
      city,
      cta_location: ctaLocation,
      page: window.location.href,
    });
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

  // Незнакомый номер показываем как есть: полного значения для него нет.
  return (
    <a href={phone?.href ?? href} className={className} onClick={handleClick}>
      {numbers[0]?.full ?? children}
    </a>
  );
}
