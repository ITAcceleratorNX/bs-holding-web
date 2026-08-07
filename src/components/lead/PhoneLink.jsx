import { phoneForHref } from '../../data/phones';
import { LEAD_EVENTS, trackEvent } from '../../lead/analytics';
import { usePhoneReveal } from './PhoneRevealProvider';

/**
 * Номер отдела продаж в интерфейсе (ТЗ 7, 10).
 *
 * До заявки номер показан со скрытой серединой, и клик открывает форму
 * «Получить номер отдела продаж» — так каждый показ номера приносит лид.
 * После отправки (и до конца сессии) это обычная ссылка на звонок.
 *
 * Лид по клику на открытый номер намеренно не создаётся: пустая заявка без
 * имени и вопроса только засоряет воронку. Сам звонок учитывает подключённая
 * телефония Bitrix24, а здесь фиксируется только намерение позвонить.
 *
 * @param {Object} props
 * @param {string} props.href Ссылка вида `tel:+7…`.
 * @param {string} [props.city] Город номера — уходит в заявку.
 * @param {string} [props.project] ЖК, со страницы которого просят номер.
 * @param {string} [props.ctaLocation] Расположение номера на странице.
 */
export default function PhoneLink({ href, city, project, ctaLocation, className, onClick, children }) {
  const { isRevealed, openReveal } = usePhoneReveal();
  const phone = phoneForHref(href);

  // Незнакомый номер скрывать нечем: полного значения для него нет.
  if (!phone || isRevealed(href)) {
    return (
      <a
        href={href}
        className={className}
        onClick={(e) => {
          trackEvent(LEAD_EVENTS.PHONE_CLICK, {
            city,
            cta_location: ctaLocation,
            page: window.location.href,
          });
          onClick?.(e);
        }}
      >
        {phone?.full ?? children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`phone-reveal-trigger${className ? ` ${className}` : ''}`}
      aria-haspopup="dialog"
      aria-label={`${phone.display} — показать номер отдела продаж`}
      title="Показать номер отдела продаж"
      onClick={(e) => {
        onClick?.(e);
        openReveal({ phoneHref: href, city, project, ctaLocation });
      }}
    >
      {children ?? phone.display}
    </button>
  );
}
