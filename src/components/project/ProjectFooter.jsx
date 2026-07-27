import Logo from '../Logo';
import { projectSlugFromName } from '../../data/projectPages';

const PROJECT_NAMES = new Set([
  'Central Park',
  'Avenue Park',
  'Adal Town',
  'Orda Palace',
  'White Hill',
  'Easton',
  'ORTA',
]);

export default function ProjectFooter({ data, onBack, onNavigateProject }) {
  return (
    <footer className="easton-footer">
      <button type="button" className="easton-footer__logo" onClick={onBack} aria-label="BS Holding">
        <Logo fill="#fff" />
      </button>
      <div className="easton-footer__cols">
        {data.footer.cols.map((col) => (
          <div key={col.title}>
            <div className="easton-footer__col-title">{col.title}</div>
            <div className="easton-footer__links">
              {col.items.map((item) => {
                const isProject = PROJECT_NAMES.has(item);
                const slug = isProject ? projectSlugFromName(item) : null;
                if (isProject && slug) {
                  return (
                    <button key={item} type="button" onClick={() => onNavigateProject(slug)}>
                      {item}
                    </button>
                  );
                }
                if (isProject) {
                  return (
                    <button key={item} type="button" onClick={onBack}>
                      {item}
                    </button>
                  );
                }
                return <div key={item}>{item}</div>;
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="easton-footer__policy">{data.footer.policy}</p>
      <div className="easton-footer__copy">{data.footer.copyright}</div>
    </footer>
  );
}
