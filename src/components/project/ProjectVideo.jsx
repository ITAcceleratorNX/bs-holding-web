import YouTubeEmbed from '../YouTubeEmbed';
import { youtubeWatchUrl } from '../../data/projectVideos';
import { useI18n } from '../../i18n/I18nContext';

/** Видеообзор ЖК: на странице с квизом встаёт второй колонкой рядом с ним. */
export default function ProjectVideo({ data }) {
  const { t } = useI18n();
  const { video } = data;

  if (!video?.youtubeId) return null;

  return (
    <aside className="project-video-card">
      <YouTubeEmbed id={video.youtubeId} title={`${data.name} — ${t('videos.embedTitle')}`} />
      <div className="project-video-card__overlay">
        <p className="project-video-card__kicker">{t('project.label.video')}</p>
        <p className="project-video-card__title">{t('project.video.title', { name: data.name })}</p>
      </div>
      <div className="project-video-card__bar">
        <span className="project-video-card__name">{data.name}</span>
        <span className="project-video-card__city">{data.city}</span>
        <a
          className="project-video-card__link"
          href={youtubeWatchUrl(video.youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('videos.watch')}
        </a>
      </div>
    </aside>
  );
}
