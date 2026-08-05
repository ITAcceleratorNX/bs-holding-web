import { LEAD_EVENTS, trackEvent } from '../../lead/analytics';

/**
 * Ссылка на телефон с фиксацией клика в аналитике (ТЗ 7, 10).
 *
 * Лид по клику намеренно не создаётся: пустая заявка без имени и вопроса
 * только засоряет воронку. Сам звонок учитывает подключённая телефония
 * Bitrix24, а здесь фиксируется только намерение позвонить.
 */
export default function PhoneLink({ href, city, ctaLocation, className, onClick, children }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        trackEvent(LEAD_EVENTS.PHONE_CLICK, {
          city,
          cta_location: ctaLocation,
          page: typeof window === 'undefined' ? '' : window.location.href,
        });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
