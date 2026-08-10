import LeadHoneypot from '../lead/LeadHoneypot';
import PhoneLink from '../lead/PhoneLink';
import { useLeadForm } from '../../lead/useLeadForm';

/**
 * Нижняя форма консультации страницы ЖК (код формы `zhk_final_consultation`).
 * Город и ЖК берутся из данных страницы и не запрашиваются у пользователя (ТЗ 3).
 *
 * Рядом с формой стоят контакты. Номер показан только у ЖК со своим
 * колл-центром (`data.phones`) и по той же логике, что и в шапке: до заявки
 * он скрыт звёздочками, после — открывается ссылкой на звонок (ТЗ 7).
 */
export default function ProjectConsultForm({ data }) {
  const { consult } = data;
  const project = consult.projectName || data.name || '';
  const city = consult.city || data.city || '';

  const form = useLeadForm({
    formCode: 'zhk_final_consultation',
    project,
    city,
    ctaLocation: 'Нижняя форма страницы ЖК',
  });

  return (
    <section id={`${data.slug}-consult`} className="easton-consult">
      <div className="easton-consult__info">
        <h2>{consult.title}</h2>
        <p>{consult.subtitle}</p>
        <div className="easton-consult__contacts">
          <div>{consult.address}</div>
          {data.phones && (
            <PhoneLink
              href={data.phoneHref}
              phone={data.phones}
              hours={data.hours}
              city={city}
              project={project}
              ctaLocation="Нижний блок контактов страницы ЖК"
            />
          )}
          <div>{consult.instagram}</div>
          <div>{consult.hours}</div>
        </div>
      </div>
      <div className="easton-consult__form">
        {form.isSuccess ? (
          <div>
            <div className="easton-consult__success-title">Спасибо! Заявка принята.</div>
            <div className="easton-consult__success-sub">Мы свяжемся с вами в течение дня.</div>
          </div>
        ) : (
          <>
            <label htmlFor={`${data.slug}-consult-name`}>Ваше Ф.И.О.</label>
            <input
              id={`${data.slug}-consult-name`}
              className="input-dark"
              placeholder="Ваше имя"
              {...form.fields.name}
            />
            {form.errors.name && <div className="easton-consult__error">{form.errors.name}</div>}

            <label htmlFor={`${data.slug}-consult-phone`}>Ваш номер телефона</label>
            <input id={`${data.slug}-consult-phone`} className="input-dark" {...form.fields.phone} />
            {form.errors.phone && <div className="easton-consult__error">{form.errors.phone}</div>}

            <LeadHoneypot {...form.honeypotProps} />

            {form.message && <div className="easton-consult__error">{form.message}</div>}

            <button
              type="button"
              className="easton-btn easton-btn--light"
              onClick={form.submit}
              disabled={form.isLoading}
            >
              {form.isLoading ? 'Отправка…' : 'Получить консультацию'}
            </button>
            <div className="easton-consult__policy">{consult.policy}</div>
          </>
        )}
      </div>
    </section>
  );
}
