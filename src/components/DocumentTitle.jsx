import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { getProjectPage } from '../data/projectPages';

/**
 * @param {{ route: { type: string, slug?: string } }} props
 */
export default function DocumentTitle({ route }) {
  const { t } = useI18n();

  useEffect(() => {
    let title = t('title.home');
    if (route.type === 'about') title = t('title.about');
    else if (route.type === 'promotions') title = t('title.promotions');
    else if (route.type === 'news') title = t('title.news');
    else if (route.type === 'not-found') title = t('title.notFound');
    else if (route.type === 'project' && route.slug) {
      const page = getProjectPage(route.slug);
      title = t('title.project', { name: page?.name ?? route.slug });
    }
    document.title = title;
  }, [route, t]);

  return null;
}
