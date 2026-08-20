const ICONS = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 5.5c.8 1.6 2.2 2.8 4 3.1v3.4c-1.5-.05-2.9-.6-4-1.5v6.6c0 3.2-2.6 5.8-5.8 5.8S3.5 19.2 3.5 16s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.6a2.3 2.3 0 1 0 1.6 2.2V5.5h3.7z"
        fill="currentColor"
      />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M11 9.5v5.5l4.5-2.75L11 9.5z" fill="currentColor" />
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.5 4.5L2.8 11.2c-.9.4-.9 1.7.1 2l4.6 1.7 1.8 5.5c.3.9 1.5 1 2 .2l2.6-3.4 4.9 3.6c.8.6 1.9.1 2.1-.9L22.5 6c.2-1.1-.9-2-2-1.5z"
        fill="currentColor"
      />
    </svg>
  ),
};

export const SOCIAL_NETWORKS = [
  {
    id: 'instagram',
    href: 'https://www.instagram.com/bs_holding?igsh=MXR5aGt1eTNhNDZydQ==',
    label: 'Instagram',
  },
  {
    id: 'tiktok',
    href: 'https://www.tiktok.com/@bs_holding?_r=1&_t=ZS-9927UPbq5Uj',
    label: 'TikTok',
  },
  {
    id: 'youtube',
    href: 'https://youtube.com/@bsholding_kz?si=lMlKCdfeyqNpD_J0',
    label: 'YouTube',
  },
  {
    id: 'telegram',
    href: 'https://t.me/bsholding_news',
    label: 'Telegram',
  },
];

export function SocialIcon({ id }) {
  return ICONS[id] ?? null;
}
