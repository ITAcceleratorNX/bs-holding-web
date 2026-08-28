import { HOME_PROJECT_VIDEOS, youtubeWatchUrl } from '../data/projectVideos';
import { projectHash } from '../data/projectPages';
import { cityLabel } from '../data/cities';
import { useI18n } from '../i18n/I18nContext';
import YouTubeEmbed from './YouTubeEmbed';

export default function ProjectVideos() {
  const { t } = useI18n();

  return (
    <section id="videos" className="section project-videos">
      <div className="project-videos__panel">
        <div className="project-videos__head">
          <span className="project-videos__kicker">{t('videos.kicker')}</span>
          <h2 className="project-videos__title">{t('videos.title')}</h2>
          <p className="project-videos__lead">{t('videos.lead')}</p>
        </div>

        <div className="project-videos__grid">
          {HOME_PROJECT_VIDEOS.map((item, i) => (
            <article key={item.slug} className="project-videos__card">
              <YouTubeEmbed id={item.youtubeId} title={`${item.name} — ${t('videos.embedTitle')}`} />
              <div className="project-videos__meta">
                <span className="project-videos__index">{String(i + 1).padStart(2, '0')}</span>
                <div className="project-videos__caption">
                  <h3 className="project-videos__name">
                    <a href={projectHash(item.slug) ?? '#'}>{item.name}</a>
                  </h3>
                  <span className="project-videos__city">{cityLabel(t, item.city)}</span>
                </div>
                <a
                  className="project-videos__link"
                  href={youtubeWatchUrl(item.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('videos.watch')}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
