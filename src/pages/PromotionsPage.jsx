import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PromotionDetail, { PromotionCard } from '../components/promotions/PromotionDetail';
import { PROMOTIONS } from '../data/promotions';
import { useI18n } from '../i18n/I18nContext';

const MOBILE_MQ = '(max-width: 768px)';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export default function PromotionsPage({
  headerCity,
  setHeaderCity,
  langCur,
  setLangCur,
  openMenu,
  toggleMenu,
  closeMenu,
  onOpenCall,
  onGoHome,
}) {
  const { t } = useI18n();
  const [activeOffer, setActiveOffer] = useState(null);
  const isMobile = useIsMobile();

  const openOffer = useCallback((offer) => setActiveOffer(offer), []);
  const closeOffer = useCallback(() => setActiveOffer(null), []);

  return (
    <>
      <Header
        showTopBar={false}
        activeNav="akcii"
        headerCity={headerCity}
        setHeaderCity={setHeaderCity}
        langCur={langCur}
        setLangCur={setLangCur}
        openMenu={openMenu}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
        onOpenCall={onOpenCall}
        onLogoClick={onGoHome}
      />

      <div className="promotions-page">
        <div className="promotions-page__shell">
          <h1 className="promotions-page__title">{t('promos.title')}</h1>
          <div className="promotions-page__grid">
            {PROMOTIONS.map((offer) => (
              <PromotionCard key={offer.id} offer={offer} onOpen={openOffer} />
            ))}
          </div>
        </div>
        <Footer />
      </div>

      <PromotionDetail
        offer={activeOffer}
        open={Boolean(activeOffer)}
        onClose={closeOffer}
        city={headerCity}
        mode={isMobile ? 'sheet' : 'popup'}
      />
    </>
  );
}
