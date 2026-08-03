import { useI18n } from '../i18n/I18nContext';
import Header from '../components/Header';

export default function NewsPage({
  headerCity,
  setHeaderCity,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  onOpenCall,
  onGoHome,
}) {
  const { t } = useI18n();

  return (
    <>
      <Header
        headerCity={headerCity}
        setHeaderCity={setHeaderCity}
        langCur={langCur}
        setLangCur={setLangCur}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        onOpenCall={onOpenCall}
        onLogoClick={onGoHome}
      />
      <div className="page news-placeholder">
        <h1 className="section-title">{t('news.title')}</h1>
        <p className="news-placeholder__text">{t('news.soon')}</p>
      </div>
    </>
  );
}
