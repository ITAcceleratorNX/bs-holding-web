import SectionLabel from './SectionLabel';

export default function ProjectAbout({ data }) {
  const { about } = data;
  const hasTitle = Boolean(about.title);
  return (
    <section id={about.id ?? `${data.slug}-about`} className="easton-section easton-section--dark easton-about">
      <SectionLabel>{about.label}</SectionLabel>
      {hasTitle ? (
        <>
          <h2 className="easton-h2 easton-about__heading">{about.title}</h2>
          <p className="easton-body easton-about__lead">{about.text}</p>
        </>
      ) : (
        <p className="easton-about__text">{about.text}</p>
      )}
      {about.image && (
        <div className="easton-about__image">
          <img src={about.image} alt={about.imageAlt ?? ''} />
        </div>
      )}
      <div className={`easton-about__stats${about.stats.length > 2 ? ' easton-about__stats--triple' : ''}`}>
        {about.stats.map((s) => (
          <div key={s.text} className="easton-about__stat">
            {s.icon && <img src={s.icon} alt="" width={48} height={48} />}
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
