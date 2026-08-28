import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

const PLAY_ICON = (
  <svg width="24" height="26" viewBox="0 0 24 26" fill="none" aria-hidden="true">
    <path d="M22.5 11.27a2 2 0 0 1 0 3.46L3.5 25.7A2 2 0 0 1 .5 23.97V2.03A2 2 0 0 1 3.5.3l19 10.97Z" fill="currentColor" />
  </svg>
);

/** Превью YouTube: плеер подключается только после клика. */
export default function YouTubeEmbed({ id, title }) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const [posterFallback, setPosterFallback] = useState(false);

  if (!id) return null;

  const poster = `https://i.ytimg.com/vi/${id}/${posterFallback ? 'hqdefault' : 'maxresdefault'}.jpg`;

  return (
    <div className={`video-frame${playing ? ' is-playing' : ''}`}>
      {playing ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className="video-frame__poster"
          onClick={() => setPlaying(true)}
          aria-label={`${t('videos.play')} — ${title}`}
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPosterFallback(true)}
          />
          <span className="video-frame__scrim" aria-hidden="true" />
          <span className="video-frame__play" aria-hidden="true">{PLAY_ICON}</span>
        </button>
      )}
    </div>
  );
}
