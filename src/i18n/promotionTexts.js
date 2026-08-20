/** Переводы акций (KZ / EN). RU — в data/promotions.js. */
export const PROMOTION_TEXTS = {
  'bs-paida': {
    KZ: {
      tag: '«BS Пайда»',
      title: 'Бөліп төлеуде сатып алғанда 9,5%-ға дейін пайда',
      applies: 'Ақтау, Ақтөбе және Өскемен ТҮК-теріне қолданылады',
      description:
        'I және II кезектерде пайдалануға берілгенге дейін пәтер сатып алғанда 9,5%-ға дейін үнемдеумен тиімді шарттар. Бөліп төлеу максимум 12 айға және объект тапсыру мерзіміне дейін беріледі. Кеңес алу үшін өтінім қалдырыңыз.',
    },
    EN: {
      tag: '«BS Paida»',
      title: 'Up to 9.5% savings when buying with installment',
      applies: 'Valid for residential complexes in Aktau, Aktobe, and Oskemen',
      description:
        'When buying an apartment before commissioning on phases I and II, you get favorable terms with savings up to 9.5%. Installment is available for up to 12 months and until the project is commissioned. Leave a request for a consultation.',
    },
  },
  'trade-in': {
    KZ: {
      tag: '«Trade Inn»',
      title: 'BS Holding Trade-In — автокөлікті бастапқы жарна ретінде пайдалануға болады',
      applies: 'BS Holding ТҮК-теріне қолданылады',
      description:
        'Автокөлігіңізді Trade-In арқылы тапсырып, оның құнын BS Holding ТҮК-терінде пәтер сатып алу кезінде бастапқы жарна ретінде пайдаланыңыз. Өтінім қалдырыңыз — менеджер шарттарды есептейді.',
    },
    EN: {
      tag: '«Trade Inn»',
      title: 'BS Holding Trade-In — use your car as a down payment',
      applies: 'Valid for BS Holding residential complexes',
      description:
        'Trade in your car and use its value as a down payment when buying an apartment in BS Holding residential complexes. Leave a request — a manager will calculate the terms.',
    },
  },
  umai: {
    KZ: {
      tag: '««Умай» әйелдер ипотекасы»',
      title: '2026 жылдың тамызында Отбасы банк «Умай» әйелдер ипотекасына өтінімдерді қайта қабылдайды',
      applies: 'Отбасы банк «Умай» бағдарламасы',
      description:
        '«Умай» әйелдер ипотекасы — Отбасы банктің жеңілдетілген бағдарламасы. Өтінім қалдырыңыз — менеджер қатысу шарттарын айтып, құжаттарды дайындауға көмектеседі.',
      facts: [
        {
          label: 'Максималды несие сомасы',
          text: 'тұрғын үй сатып алуға 50 млн теңгеге дейін, жөндеуге 15 млн теңгеге дейін',
        },
        {
          label: 'Бастапқы жарна',
          text: '15%-дан. Жарнаға зейнетақы артықшылығын пайдалануға болады',
        },
        {
          label: 'Қарыз алушының табысы',
          text: 'отбасының максималды айлық табысы 1 250 000 теңгеден аспауы керек. Ресми табыс және соңғы 6 ай минимум зейнетақы аударымдары қажет',
        },
        {
          label: 'Несие мерзімі',
          text: '25 жылға дейін',
        },
      ],
    },
    EN: {
      tag: '«Umai women\'s mortgage»',
      title: 'In August 2026, Otbasy Bank resumes accepting applications for the popular Umai women\'s mortgage',
      applies: 'Otbasy Bank Umai program',
      description:
        'Umai women\'s mortgage is a preferential program from Otbasy Bank. Leave a request and a manager will explain the terms and help prepare documents.',
      facts: [
        {
          label: 'Maximum loan amount',
          text: 'up to 50 million tenge for housing, up to 15 million tenge for renovation',
        },
        {
          label: 'Down payment',
          text: 'from 15%. Pension surplus can be used for the down payment',
        },
        {
          label: 'Borrower\'s income',
          text: 'maximum monthly family income must not exceed 1,250,000 tenge. Official income and pension contributions for at least the last 6 months are required',
        },
        {
          label: 'Loan term',
          text: 'up to 25 years',
        },
      ],
    },
  },
  'developer-installment': {
    KZ: {
      tag: '«Девелоперден бөліп төлеу»',
      title: '30% және 50% бастапқы жарнамен 0% молшерлемесіз бөліп төлеу',
      applies: 'BS Holding ТҮК-теріне қолданылады',
      description:
        '30% немесе 50% бастапқы жарнамен девелоперден 0% молшерлемесіз бөліп төлеу. Таңдалған ТҮК бойынша ағымдағы шарттарды алу үшін өтінім қалдырыңыз.',
    },
    EN: {
      tag: '«Developer installment»',
      title: 'Interest-free 0% installment with 30% or 50% down payment',
      applies: 'Valid for BS Holding residential complexes',
      description:
        'Interest-free 0% installment from the developer with a 30% or 50% down payment. Leave a request to get current terms for your chosen residential complex.',
    },
  },
};

/**
 * @param {import('../data/promotions').Promotion} offer
 * @param {'KZ'|'EN'} lang
 */
export function applyPromotionTexts(offer, lang) {
  const overrides = PROMOTION_TEXTS[offer.id]?.[lang];
  if (!overrides) return offer;
  return { ...offer, ...overrides };
}
