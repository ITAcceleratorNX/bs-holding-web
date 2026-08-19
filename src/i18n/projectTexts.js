/**
 * Переводы контентных текстов страниц ЖК на KZ и EN.
 * RU-тексты хранятся в data-файлах (easton.js, whitehill.js и т.д.) и используются как fallback.
 * Структура: { [slug]: { KZ: { about: {text, title?, stats?}, ... }, EN: { ... } } }
 */

export const PROJECT_TEXTS = {
  easton: {
    KZ: {
      hero: { location: 'Өскемен қ.' },
      about: {
        title: 'Easton – BS Holding-тің Өскемендегі алғашқы тұрғын үй кешені',
        text: 'Панорамалық терезелері, 3,2 метр төбелері, жеке фитнес залы және балалар бөлмесі бар бизнес-класс.',
        stats: [
          { text: 'Тапсыру мерзімі: 2027 жыл' },
          { text: 'I кезекте барлығы 208 пәтер' },
        ],
      },
      standards: {
        title: 'Easton ыңғайлы өмір үшін маңызды барлығын біріктіреді',
        text: 'Easton қалалық ортаның жаңа кезеңін символдайды – ыңғайлылық, эстетика және сенімділік Өскеменнің заманауи бейнесін қалыптастыратын кеңістік.',
        cards: [
          { title: 'Заманауи сәулеттік дизайн' },
          { title: 'Ойластырылған инфрақұрылым' },
          { title: 'Жоғары сапалы құрылыс' },
        ],
      },
      location: {
        title: 'Есенберлин мен Сәтбаев\nкөшелерінің қиылысы — қалаңың жаңа жүрегі',
        notes: [
          'Инфрақұрылым мұқият ойластырылған: жаяу қашықтықта өмір, демалыс және даму үшін қажетті барлығы бар.',
          'Абаттандырылған көшелер, көлік қолжетімділігі мен ойластырылған жаяу маршруттар қозғалысты ыңғайлы және қауіпсіз етеді.',
          'Жақын жерде — мектеп, спорт кешені, қоғамдық көлік аялдамасы және аурухана.',
        ],
        cards: [
          { title: 'Спорт кешені' },
          { title: 'Театр' },
          { title: 'Нұрлы Жол паркі' },
        ],
      },
      architecture: {
        title: 'Easton сәулеті жеке тұлғалылық пен заманауи көзқарасты бейнелейді',
        points: [
          'Монолитті қаңқа бүкіл тұрғын ғимараттың беріктігі мен ұзақ мерзімділігін қамтамасыз етеді.',
          'Минерал мақтадан жылытылған алюминий композиттік панельдерден жасалған заманауи желдетілетін фасад.',
        ],
        ctaQuestion: 'Easton материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: 'Двор стилобат деңгейінде жобаланған — автомобиль қозғалысы толықтай шеттетілген. Бұл тыныштықты, қауіпсіздікті және жайлы атмосфераны кепілдендіреді',
      },
      playground: {
        title: 'Заманауи ойын алаңы',
        text: 'Двор — үйлер арасындағы кеңістік қана емес, отбасымен серуендеу, демалу және қарым-қатынасқа арналған үйлесімді орта.',
      },
      kids: {
        gallery: [
          { title: 'Қауіпсіз\nматериалдар' },
          { title: 'Белсенді\nойын аймағы' },
          { title: 'Шығармашылық\nжәне демалыс орны' },
          { title: 'Kids Room' },
        ],
        roomTitle: 'Kids Room Easton — балаларға арналған жылы және жайлы кеңістік',
        roomText: 'Жаман ауа райында да балалар ойнай, қиялдай және мәзір уақыт өткізе алады.',
      },
      hall: {
        title: 'Кешен холлдары — элегантттылық пен заманауи стильдің үйлесімі',
        text1: 'Безендіру жарық пен пропорцияларға назар аударыла жасалған — жайлылық пен премиум ыңғайлылық атмосферасын туғызады.',
        text2: 'Мұндай безендіру жоғары өмір деңгейін бейнелейді, холлдарды күту аймағына ғана емес, эстетикалық кеңістікке айналдырады.',
        features: [
          'Дизайнерлік кіреберіс топтар',
          'Кең холлдар премиум-класс',
          'Пәтерлердегі төбе биіктігі — 3,2 м',
          'Xizi Gots дыбыссыз лифтілер',
        ],
      },
      apartments: {
        title: 'Әрбір пәтер — ыңғайлылық, функционалдылық және заманауи стиль кеңістігі',
        text: 'Биік төбелер жеңілдік сезімін туғызады, ал жоспарлар әр шаршы метрді тиімді пайдалануға мүмкіндік береді.',
        features: [
          'Face ID домофондар — кілтсіз, картасыз кіру',
          'Smart тұтқалар — саусақ ізімен немесе кодпен есік ашу',
          'Бескамералық терезелер — тамаша дыбыс және жылу оқшаулауы',
          'Электр құлыптар және IP домофондар — қауіпсіздік және сенімділік',
        ],
      },
      parking: {
        title: 'Easton паркингі — ыңғайлылық, қауіпсіздік және ойластырылған ұйымның үйлесімі',
        points: [
          'Жер үсті жабық паркинг сыртқы әсерлерден қорғалған және жылдың кез келген мезгілінде қолжетімді.',
          'Кіру қолжетімділікті бақылау жүйесі арқылы жүзеге асырылады — бөгде адамдардың кіруі шеттетілген.',
          'Паркингтен тұрғын қабаттарға лифтімен тікелей шығу.',
        ],
        note: 'Кең орындар, ойластырылған навигация және заманауи жарықтандыру паркингті пайдалануды барынша ыңғайлы етеді.',
      },
      boxroom: {
        title: 'Boxroom — сақтауға арналған жеке қойма бөлмелері',
        text: 'Велосипедтерге, коляскаларға, маусымдық заттар мен спорт мүкәммалына арналған ойластырылған шешім.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жіберіп береді.',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: { location: 'Oskemen city' },
      about: {
        title: 'Easton – BS Holding\'s first residential complex in Oskemen',
        text: 'Business class with panoramic windows, 3.2-metre ceilings, a private fitness centre and a kids\' room.',
        stats: [
          { text: 'Completion: 2027' },
          { text: '208 apartments total in Phase I' },
        ],
      },
      standards: {
        title: 'Easton brings together everything that matters for a comfortable life',
        text: 'Easton symbolises a new chapter of urban living — a space where comfort, aesthetics and reliability shape the modern face of Oskemen.',
        cards: [
          { title: 'Modern architectural design' },
          { title: 'Thoughtful infrastructure' },
          { title: 'High construction quality' },
        ],
      },
      location: {
        title: 'Corner of Esenberlin & Satpaev —\nthe new heart of the city',
        notes: [
          'The infrastructure is carefully planned: everything you need for daily life, leisure and development is within walking distance.',
          'Well-maintained streets, transport links and pedestrian routes ensure comfortable and safe movement.',
          'Nearby: school, sports complex, public transport stop and hospital.',
        ],
        cards: [
          { title: 'Sports complex' },
          { title: 'Theatre' },
          { title: 'Nurly Zhol Park' },
        ],
      },
      architecture: {
        title: 'Easton\'s architecture reflects individuality and a modern vision',
        points: [
          'A monolithic frame provides strength and durability for the entire residential building.',
          'A modern ventilated façade of aluminium composite panels with mineral wool insulation.',
        ],
        ctaQuestion: 'Would you like to assess the quality of Easton\'s materials in person?',
      },
      yard: {
        title: 'The courtyard is designed on a stylobate, completely free of vehicle traffic — guaranteeing peace, safety and a cosy atmosphere',
      },
      playground: {
        title: 'Modern playground',
        text: 'The courtyard is a harmonious environment for family walks, relaxation and socialising, with every detail created with safety and comfort in mind.',
      },
      kids: {
        gallery: [
          { title: 'Safe\nmaterials' },
          { title: 'Active\nplay zone' },
          { title: 'Creative space\n& relaxation' },
          { title: 'Kids Room' },
        ],
        roomTitle: 'Kids Room Easton — a warm and cosy space for children',
        roomText: 'Even in bad weather, children can play, imagine and have fun.',
      },
      hall: {
        title: 'Complex lobbies — a blend of elegance and modern style',
        text1: 'The design pays close attention to light and proportions, creating an atmosphere of warmth and premium comfort.',
        text2: 'The décor reflects a high standard of living, turning lobbies into an aesthetic and emotional space, not just a waiting area.',
        features: [
          'Designer entrance groups',
          'Spacious premium-class lobbies',
          'Ceiling height in apartments — 3.2 m',
          'Xizi Gots silent lifts',
        ],
      },
      apartments: {
        title: 'Every apartment is a space of comfort, functionality and modern style',
        text: 'High ceilings create a sense of lightness, while floor plans make every square metre as efficient as possible.',
        features: [
          'Face ID intercoms — keyless, cardless entry',
          'Smart handles — open the door with a fingerprint or code',
          'Five-chamber windows — perfect noise and thermal insulation',
          'Electronic locks and IP intercoms — security and durability',
        ],
      },
      parking: {
        title: 'Easton parking — convenience, safety and thoughtful organisation',
        points: [
          'The covered above-ground parking is protected from the elements and accessible year-round.',
          'Access is controlled by an access-control system — no unauthorised entry.',
          'Direct lift access from parking to residential floors.',
        ],
        note: 'Spacious bays, clear navigation and modern lighting make parking as comfortable as possible.',
      },
      boxroom: {
        title: 'Boxroom — personal storage units',
        text: 'A smart solution for bicycles, prams, seasonal items and sports equipment.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you the catalogue, current prices and 0% instalment terms.',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  'white-hill': {
    KZ: {
      hero: { location: 'Ақтөбе қ.' },
      about: {
        text: 'White Hill — Ақтөбедегі алғашқы бизнес-класс тұрғын үй кешені.\nАлтын Орда шағын ауданындағы қалалық өмірдің жаңа деңгейі.',
        stats: [
          { text: 'Тапсыру мерзімі — 2027 жылғы тамыз' },
          { text: '235 пәтер · ауданы 43-тен 181 шарш. м-ге дейін' },
        ],
      },
      standards: {
        title: '«White Hill» тұрғын үй кешені ыңғайлы өмір үшін маңызды барлығын біріктіреді',
        text: 'White Hill авторлық дизайнды, отбасы инфрақұрылымын және жабық ауланы премиум материалдармен үйлестіреді.',
        cards: [
          { title: 'Заманауи сәулеттік дизайн' },
          { title: 'Ойластырылған инфрақұрылым' },
          { title: 'Жоғары сапалы құрылыс' },
        ],
      },
      location: {
        title: 'Ақтөбе, Алтын Орда шағын ауданы,\nОраз Татеулы көшесі',
        notes: [
          'Алтын Орда шағын ауданы — Ақтөбенің ең перспективалы және қарқынды дамып жатқан аудандарының бірі.',
          'Жаяу қашықтықта мектептер, балабақшалар және отбасының ыңғайлы өмірі үшін қажетті барлығы бар.',
        ],
        cards: [
          { title: 'НЗМ' },
          { title: 'Aqbobek мектебі' },
          { title: 'ACE — теннис корты' },
          { title: '«Достық» бассейні' },
        ],
      },
      architecture: {
        title: 'White Hill сәулеті — ойластырылған тіршілік кеңістігі',
        ctaQuestion: 'White Hill материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: 'Ауланың кеңістігі тыныштық пен ыңғайлылыққа приоритет беріліп жобаланған',
      },
      kids: {
        gallery: [
          { title: 'Қауіпсіз\nматериалдар' },
          { title: 'Белсенді\nойын аймағы' },
          { title: 'Шығармашылық\nжәне демалыс' },
        ],
      },
      hall: {
        title: 'Холлдар — элегантттылық пен заманауи стильдің үйлесімі',
        text1: 'Безендіру жарық пен пропорцияларға назар аударыла жасалған.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жіберіп береді.',
        hours: 'Дс–Жм: 09:00–19:00\nСб–Жс: 10:00–17:00',
      },
    },
    EN: {
      hero: { location: 'Aktobe city' },
      about: {
        text: 'White Hill — the first business-class residential complex in Aktobe.\nA new level of urban living in the Altyn Orda district.',
        stats: [
          { text: 'Completion — August 2027' },
          { text: '235 apartments · areas from 43 to 181 sq. m' },
        ],
      },
      standards: {
        title: 'White Hill brings together everything that matters for comfortable living',
        text: 'White Hill combines original design, family infrastructure and a gated courtyard with premium materials.',
        cards: [
          { title: 'Modern architectural design' },
          { title: 'Thoughtful infrastructure' },
          { title: 'High construction quality' },
        ],
      },
      location: {
        title: 'Aktobe, Altyn Orda district,\nOraza Tateuuly street',
        notes: [
          'Altyn Orda is one of the most promising and rapidly developing districts of Aktobe.',
          'Schools, kindergartens and everything a family needs are within walking distance.',
        ],
        cards: [
          { title: 'NIS school' },
          { title: 'Aqbobek school' },
          { title: 'ACE tennis court' },
          { title: 'Dostyk pool' },
        ],
      },
      architecture: {
        title: 'White Hill architecture — a thoughtful living space',
        ctaQuestion: 'Would you like to assess the quality of White Hill\'s materials in person?',
      },
      yard: {
        title: 'The courtyard space is designed with a priority on peace and comfort',
      },
      kids: {
        gallery: [
          { title: 'Safe\nmaterials' },
          { title: 'Active\nplay zone' },
          { title: 'Creative space\n& relaxation' },
        ],
      },
      hall: {
        title: 'Lobbies — a blend of elegance and modern style',
        text1: 'The design pays close attention to light and proportions.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you the catalogue, current prices and 0% instalment terms.',
        hours: 'Mon–Fri: 09:00–19:00\nSat–Sun: 10:00–17:00',
      },
    },
  },

  orta: {
    KZ: {
      hero: { location: 'Ақтау қ.' },
      about: {
        title: 'Тыныштықты бағалайтындарға арналған үй',
        text: 'ORTA — екі подъездегі барлығы 69 пәтерден тұратын бизнес-класс тұрғын үй кешені. Жоба сдержанная сәулеттік эстетикаға, жеке өмірге және қалалық контекстке құрметке негізделген.',
        stats: [
          { text: '69 пәтер — шағын форматты кешен' },
          { text: '2 подъезд — жабық клубтық масштаб' },
          { text: '2026 жылдың IV тоқсаны — пайдалануға беру мерзімі' },
        ],
      },
      standards: {
        title: 'Жобаның басты артықшылықтары',
        text: 'ORTA, Ақтау — теңізден екі қадам жердегі ескі орталықтағы бизнес-класс үй.',
        cards: [
          { title: 'Ескі орталықтағы орналасуы — теңізге, Жеңіс бульваріне және инфрақұрылымға жаяу қолжетімділік' },
          { title: 'Инженерлік автономдылық — су резервуары мен резервтік генератор' },
          { title: 'Шағын формат — барлығы 69 пәтер мен 2 подъезд' },
        ],
      },
      location: {
        title: '9 шағын аудан — Ақтаудың ескі орталығы',
        notes: [
          '9 шағын аудан — қалалардың ең тұрақты және құнды бөліктерінің бірі: бұрыннан қалыптасқан әлеуметтік инфрақұрылымы бар ескі орталық.',
          'Теңіздің жақын болуы орналасудың құндылығын арттырады, ал Жеңіс бульварына, физика-математика мектебіне жаяу жету мүмкіндігі күнделікті өмірді ыңғайлы етеді.',
        ],
        cards: [
          { title: 'Жеңіс бульвары — серуен және теңізге жақын' },
          { title: 'Физика-математика мектебі — сапалы білім жанында' },
          { title: 'Сауда және мәдени орталықтар — барлық күнделікті инфрақұрылым жаяу қашықтықта' },
        ],
      },
      architecture: {
        title: 'Жеті қабатты тыныш ырғақ',
        lead: 'ORTA — қалалық ортаға үстемдік етпей, ескі орталықтың ғимараттарына органикалық түрде сіңісетін жеті қабатты ғимарат.',
        points: [
          '2 подъезд, 69 пәтер.',
          'Төбе биіктігі — 3,2 метр.',
          'Биіктігі 2,2 метр бескамералық терезелер.',
          'Фасад материалдары мен конструкциясы расталған деректер алынғаннан кейін қосылады.',
        ],
        ctaQuestion: 'ORTA сәулетін жеке бағалағыңыз келе ме?',
      },
      yard: {
        label: 'Жабық аула',
        title: 'Кездейсоқ адамдар жоқ аула. ORTA-ның жабық аулалық аумағы транзитті шеттетеді — жеке кеңістік.',
      },
      playground: {
        title: 'Үйдің жалғасы ретіндегі аула',
        text: 'Ландшафттық жасыл желек, сәулеттік формалар мен эко-ойын кешендері балалар мен ересектерге ыңғайлы жеке аула ортасын қалыптастырады.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер ORTA туралы ақпарат жіберіп, кеңес береді.',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: { location: 'Aktau city' },
      about: {
        title: 'A home for those who value peace and quiet',
        text: 'ORTA — an intimate business-class residential complex with just 69 apartments across two entrances. The project is built on restrained architectural aesthetics, privacy and respect for the urban context.',
        stats: [
          { text: '69 apartments — intimate format' },
          { text: '2 entrances — closed club scale' },
          { text: 'Q4 2026 — completion date' },
        ],
      },
      standards: {
        title: 'Key advantages of the project',
        text: 'ORTA, Aktau — a business-class home in the old city centre, two steps from the sea.',
        cards: [
          { title: 'Old-town location — walking distance to the sea, Victory Boulevard and established infrastructure' },
          { title: 'Engineering autonomy — water tank and back-up generator' },
          { title: 'Intimate format — just 69 apartments and 2 entrances' },
        ],
      },
      location: {
        title: 'District 9 — old centre of Aktau',
        notes: [
          'District 9 is one of the most stable and valuable parts of the city: an established old centre with well-developed social and commercial infrastructure.',
          'Proximity to the sea adds value to the location, while walking access to Victory Boulevard, the physics and maths school and shopping centres makes daily life convenient.',
        ],
        cards: [
          { title: 'Victory Boulevard — promenade and sea nearby' },
          { title: 'Physics & Maths School — quality education close by' },
          { title: 'Shopping & cultural centres — all everyday infrastructure within walking distance' },
        ],
      },
      architecture: {
        title: 'Seven floors of quiet rhythm',
        lead: 'ORTA — a seven-storey building with considered proportions that blends organically into the old-town fabric rather than dominating it.',
        points: [
          '2 entrances, 69 apartments.',
          'Ceiling height — 3.2 metres.',
          'Five-chamber windows 2.2 metres tall.',
          'Façade materials and structure to be added once confirmed data is received.',
        ],
        ctaQuestion: 'Would you like to assess ORTA\'s architecture in person?',
      },
      yard: {
        label: 'Gated courtyard',
        title: 'A courtyard with no strangers. ORTA\'s gated territory excludes transit, creating a private space for residents.',
      },
      playground: {
        title: 'The courtyard as an extension of home',
        text: 'Landscaped greenery, architectural features and eco play structures form a private courtyard environment comfortable for both children and adults.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you information about ORTA and offer a consultation.',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  'avenue-park': {
    KZ: {
      hero: { location: 'Ақтау қ.' },
      about: {
        text: 'Avenue Park — Ақтаудағы ең ірі масштабты және инфрақұрылымдық тұрғысынан дамыған жобалардың бірі. Заманауи мегакешен.',
        stats: [
          { text: 'Тапсыру мерзімі: 2025-2027 жж.' },
          { text: 'Бизнес+ класс · алаңдар 41-ден 247 шарш. м-ге дейін' },
        ],
      },
      standards: {
        title: 'Avenue Park ыңғайлы өмір үшін маңызды барлығын біріктіреді',
        text: 'Avenue Park — аудан ауқымында дамыған инфрақұрылымы, жасыл аумақтары мен заманауи сәулетімен ерекшеленетін тұрғын кешен.',
        cards: [
          { title: 'Заманауи сәулеттік дизайн' },
          { title: 'Ойластырылған инфрақұрылым' },
          { title: 'Жоғары сапалы құрылыс' },
        ],
      },
      location: {
        title: 'Ақтаудың 32-ші шағын ауданы —\nқала инфрақұрылымына жақын',
        notes: [
          'Avenue Park қалалық ортаға жақын орналасқан — дүкендер, мектептер мен ойын-сауық орталықтары жаяу қашықтықта.',
          'Даму орталығы, балабақшалар мен мектептер жобаның аумағында орналасқан немесе жанында.',
        ],
      },
      architecture: {
        title: 'Avenue Park сәулеті — заманауи масштаб пен эстетика',
        ctaQuestion: 'Avenue Park материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: 'Аула кеңістігі тыныштық пен ыңғайлылыққа приоритет беріліп жобаланған',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жіберіп береді.',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: { location: 'Aktau city' },
      about: {
        text: 'Avenue Park — one of the largest-scale and most infrastructure-rich projects in Aktau. A modern mega-complex.',
        stats: [
          { text: 'Completion: 2025–2027' },
          { text: 'Business+ class · areas from 41 to 247 sq. m' },
        ],
      },
      standards: {
        title: 'Avenue Park brings together everything that matters for comfortable living',
        text: 'Avenue Park is a residential complex distinguished by its district-level infrastructure, green spaces and modern architecture.',
        cards: [
          { title: 'Modern architectural design' },
          { title: 'Thoughtful infrastructure' },
          { title: 'High construction quality' },
        ],
      },
      location: {
        title: 'District 32, Aktau —\nclose to the city\'s infrastructure',
        notes: [
          'Avenue Park is conveniently located near the urban environment — shops, schools and entertainment centres are within walking distance.',
          'A development centre, kindergartens and schools are located within or adjacent to the complex.',
        ],
      },
      architecture: {
        title: 'Avenue Park architecture — modern scale and aesthetics',
        ctaQuestion: 'Would you like to assess the quality of Avenue Park\'s materials in person?',
      },
      yard: {
        title: 'The courtyard space is designed with a priority on peace and comfort',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you the catalogue, current prices and 0% instalment terms.',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  'bs-towers': {
    KZ: {
      hero: { location: 'Ақтау қ.' },
      about: {
        text: 'BS Towers — Ақтаудың бірегей биіктік акценті, заманауи бизнес-класс кешені.',
        stats: [
          { text: 'Тапсыру мерзімі: 2026 жыл' },
          { text: 'Бизнес-класс · кең алаңдар' },
        ],
      },
      standards: {
        title: 'BS Towers ыңғайлы өмір үшін маңызды барлығын біріктіреді',
        text: 'BS Towers — заманауи биіктік архитектурасы мен жоғары сапалы инфрақұрылымы бар кешен.',
        cards: [
          { title: 'Заманауи сәулеттік дизайн' },
          { title: 'Ойластырылған инфрақұрылым' },
          { title: 'Жоғары сапалы құрылыс' },
        ],
      },
      location: {
        title: 'Ақтаудың орталық аймағы',
        notes: [
          'BS Towers қалалық инфрақұрылымға қолайлы жерде орналасқан.',
          'Жақын жерде барлық қажетті нысандар бар.',
        ],
      },
      architecture: {
        title: 'BS Towers сәулеті — заманауи биіктік акценті',
        ctaQuestion: 'BS Towers материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: 'Аула кеңістігі тыныштық пен ыңғайлылыққа приоритет беріліп жобаланған',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жіберіп береді.',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: { location: 'Aktau city' },
      about: {
        text: 'BS Towers — a unique high-rise accent of Aktau, a modern business-class complex.',
        stats: [
          { text: 'Completion: 2026' },
          { text: 'Business class · spacious areas' },
        ],
      },
      standards: {
        title: 'BS Towers brings together everything that matters for comfortable living',
        text: 'BS Towers is a complex with modern high-rise architecture and high-quality infrastructure.',
        cards: [
          { title: 'Modern architectural design' },
          { title: 'Thoughtful infrastructure' },
          { title: 'High construction quality' },
        ],
      },
      location: {
        title: 'Central area of Aktau',
        notes: [
          'BS Towers is conveniently located near the city\'s infrastructure.',
          'All necessary amenities are nearby.',
        ],
      },
      architecture: {
        title: 'BS Towers architecture — a modern high-rise accent',
        ctaQuestion: 'Would you like to assess the quality of BS Towers\' materials in person?',
      },
      yard: {
        title: 'The courtyard space is designed with a priority on peace and comfort',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you the catalogue, current prices and 0% instalment terms.',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  mura: {
    KZ: {
      hero: {
        location: 'Ақтау қ. / 40 МКР',
        tagline: 'МҰРА — Ақтаудың 40 шағын ауданындағы комфорт+ класс тұрғын үй кешені',
      },
      about: {
        text: 'МҰРА — Ақтаудың 40-шы шағын ауданында, Президент паркіне жақын орналасқан BS Holding тұрғын үй кешені. Кешен биіктігі 7 қабат, 3 блоктан тұрады, онда 262 пәтер қарастырылған. Кешеннің сәулеттік тұжырымдамасы заманауи эстетиканы сенімді құрылыс шешімдерімен үйлестіруге негізделген.',
        stats: [
          { text: '2028 жылдың I тоқсанында тапсыру' },
          { text: '262 пәтер · 3 блок · 7 қабат' },
        ],
      },
      standards: {
        title: '262 пәтер · 3 блок · 2028 жылдың I тоқсанында тапсыру',
        text: 'МҰРА тұрғын үй кешені Ақтаудың 40-шы шағын ауданында, Президент паркіне жақын орналасқан.',
        cards: [
          { title: '262 пәтер' },
          { title: '3 блок' },
          { title: '2028 жылдың I тоқсанында тапсыру' },
        ],
      },
      architecture: {
        title: 'Заманауи және лаконикалық сәулет бейнесі, ұзақ мерзімді беріктік және эстетикалық фасад',
        lead: '«Мұра» тұрғын үй кешені биіктігі 7 қабатты 3 блоктан тұрады, пәтерлердің жалпы саны — 262. Ғимараттың каркасы кірпіштен жасалған, сыртқы фасады жоғары сапалы фиброцементтік панельдермен қапталған. Бұл материал ғимаратқа заманауи сәулет бейнесін береді және фасадтың ұзақ мерзімді беріктігін қамтамасыз етеді. Ғимараттың жылу тиімділігі минерал мақта тақталарынан жылытқышпен қамтамасыз етіледі.',
        points: [
          'Кірпіштен жасалған ғимарат каркасы',
          'Фасад — жоғары сапалы фиброцементтік панельдер',
          'Минерал мақта тақталарынан жылытқыш',
          'Ылғал, бу және желден қорғауға арналған «Изоспан» үш қабатты мембрана',
        ],
        ctaQuestion: 'MURA материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: '«Мұра» тұрғын үй кешенінің ауласы ашық және абаттандырылған кеңістік ретінде жобаланған',
        text: '«Мұра» тұрғын үй кешенінің ауласы ашық және абаттандырылған кеңістік ретінде жобаланған. Балаларға экологиялық таза материалдардан жасалған заманауи ойын алаңы орнатылған. Тұрғындарға жайлы демалыс аймақтары мен беседкалар, сондай-ақ отбасылық жиналыстарға арналған қазан-ошақ аймағы қарастырылған.',
      },
      playground: {
        title: 'Экологиялық таза материалдардан жасалған заманауи ойын алаңы',
        text: 'Балаларға экологиялық таза материалдардан жасалған заманауи ойын алаңы орнатылған — маусымға қарамастан ойын қауіпсіз.',
      },
      hall: {
        title: 'Кешеннің кіреберіс топтары авторлық дизайнмен безендірілген',
        text1: 'Тұрғын үй кешенінің кіреберіс топтары авторлық дизайнмен безендірілген. Әр подъезд күнделікті тұрғындардың ыңғайлылығын қамтамасыз ететін заманауи лифт жүйесімен жабдықталған.',
        text2: 'Пәтер есіктері металл негізде жасалған, MDF-панельдермен қапталған және заманауи смарт құлыптармен жабдықталған.',
        features: [
          'Авторлық дизайн кіреберіс топтары',
          'Заманауи лифт жүйесі',
          'MDF-облицовкамен металл есіктер',
          'Смарт құлыптар',
        ],
      },
      apartments: {
        title: 'Пәтерлерде бескамералық профиль мен екі камералы шыны пакеттер қарастырылған',
        text: 'Пәтерлерде бескамералық профиль мен екі камералы шыны пакеттер қарастырылған. Мұндай терезе жүйесі жылу мен дыбыс оқшаулауын жақсартады.',
        features: [
          'Бескамералық терезе профилі',
          'Екі камералы шыны пакеттер',
          'Жақсартылған жылу және дыбыс оқшаулауы',
          'Тұрғындарға ыңғайлы микроклимат',
        ],
      },
      parking: {
        title: '323 орынды жер үсті паркинг',
        points: [
          'Жалпы сыйымдылығы 323 машина орны бар жер үсті паркинг.',
          'Кешен тұрғындары үшін ыңғайлы кіру-шығу.',
          'Ойластырылған навигация мен жарықтандыру.',
        ],
        note: '«Мұра» тұрғын үй кешенінде тұрғындар мен қонақтарға арналған жер үсті паркинг бар. Паркингтің жалпы сыйымдылығы — 323 машина орны.',
      },
      boxroom: {
        title: 'Сақтауға арналған қойма бөлмелері',
        text: '«Мұра» тұрғын үй кешенінде сақтауға арналған қосымша кеңістіктер қарастырылған: әр подъездде 3,2 м² кладовая, сондай-ақ кешеннің жертөлесінде жеке қойма бөлмелері бар.',
      },
      consult: {
        title: '«МҰРА» ТҚ ТУРАЛЫ ТОЛЫҚ АҚПАРАТ АЛҒЫМ КЕЛЕДІ',
        subtitle: 'Менеджер сізбен байланысып, MURA тұрғын үй кешені туралы барлық сұрақтарыңызға жауап береді.',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: {
        location: 'Aktau / District 40',
        tagline: 'MURA — a comfort+ class residential complex in District 40, Aktau',
      },
      about: {
        text: 'MURA — a BS Holding residential complex located in District 40 of Aktau, in close proximity to Presidential Park. The complex consists of 3 blocks, 7 storeys each, with 262 apartments. The architectural concept is based on combining modern aesthetics with reliable construction solutions.',
        stats: [
          { text: 'Completion: Q1 2028' },
          { text: '262 apartments · 3 blocks · 7 storeys' },
        ],
      },
      standards: {
        title: '262 apartments · 3 blocks · Completion Q1 2028',
        text: 'MURA residential complex is located in District 40 of Aktau, in close proximity to Presidential Park.',
        cards: [
          { title: '262 apartments' },
          { title: '3 blocks' },
          { title: 'Completion Q1 2028' },
        ],
      },
      architecture: {
        title: 'Modern and minimalist architectural look, long-term durability and aesthetic façade',
        lead: 'The MURA residential complex consists of 3 blocks, 7 storeys each, with a total of 262 apartments. The building frame is made of brick; the exterior façade is clad with high-quality fibre-cement panels. This material gives the building a modern, minimalist look while providing long-term durability. Thermal efficiency is achieved with mineral wool insulation, and an additional three-layer Izospan membrane protects against moisture, vapour and wind.',
        points: [
          'Brick building frame',
          'Façade — high-quality fibre-cement panels',
          'Mineral wool insulation boards',
          'Three-layer Izospan membrane against moisture, vapour and wind',
        ],
        ctaQuestion: 'Would you like to assess the quality of MURA\'s materials in person?',
      },
      yard: {
        title: 'The courtyard of MURA is designed as an open, well-maintained space',
        text: 'The courtyard is designed as an open, well-maintained space with various functional zones for comfortable relaxation and safe children\'s activities. A modern children\'s playground made from eco-friendly materials has been installed, along with rest areas, gazebos and a traditional qazan-oshaq zone.',
      },
      playground: {
        title: 'Modern playground made from eco-friendly materials',
        text: 'A modern playground made from eco-friendly materials has been installed for children — a safe and cosy place for play, regardless of the season.',
      },
      hall: {
        title: 'The entrance groups of the complex are finished with original design',
        text1: 'The entrance groups of the complex are finished with original design. Each entrance is equipped with a modern lift system ensuring everyday comfort for residents.',
        text2: 'Apartment doors are made on a metal base, clad with MDF panels and fitted with modern smart locks — combining security with everyday convenience.',
        features: [
          'Original design entrance groups',
          'Modern lift system',
          'Metal doors with MDF cladding',
          'Smart locks',
        ],
      },
      apartments: {
        title: 'Apartments feature five-chamber windows with double-glazed units',
        text: 'Apartments are fitted with five-chamber window profiles and double-glazed units. This window system improves thermal and acoustic insulation, contributing to a comfortable indoor climate.',
        features: [
          'Five-chamber window profiles',
          'Double-glazed units',
          'Improved thermal and acoustic insulation',
          'Comfortable indoor climate for residents',
        ],
      },
      parking: {
        title: 'Above-ground parking for 323 vehicles',
        points: [
          'Above-ground parking with a total capacity of 323 spaces.',
          'Convenient access for complex residents.',
          'Thoughtful navigation and lighting.',
        ],
        note: 'MURA provides above-ground parking for residents and guests. Total capacity — 323 spaces.',
      },
      boxroom: {
        title: 'Storage rooms',
        text: 'MURA offers additional storage spaces: a 3.2 m² storage room in each entrance and individual storage units in the basement. Everything you need to store is near home without cluttering your apartment.',
      },
      consult: {
        title: 'I WANT DETAILED INFORMATION ABOUT MURA RESIDENTIAL COMPLEX',
        subtitle: 'A manager will contact you and answer all your questions about the MURA complex.',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  'central-park': {
    KZ: {
      hero: {
        location: 'Ақтау қ. / 40 МКР 2 ҮЙ',
        tagline: 'Central Park — эстетика, ыңғайлылық және жоғары құрылыс стандарттары үйлескен кешен.',
      },
      about: {
        text: 'Central Park — жеке өмірдің үйлесімін, сыйлы сәулетті және ойластырылған қалалық өмір салтын бағалайтындарға арналған жоба.',
        stats: [
          { text: '2024 жылы пайдалануға берілді' },
          { text: '435 пәтер · 14 подъезд' },
        ],
      },
      standards: {
        title: 'Central Park — ыңғайлы қалалық өмір үшін жасалған заманауи тұрғын үй кешені.',
        text: 'Кешен құрамында ойластырылған сәулет, абаттандырылған аумақ және дамыған инфрақұрылыммен біріктірілген 435 пәтер мен 14 подъезд бар. 2024 жылы пайдалануға берілді.',
        cards: [
          { title: '435 пәтер' },
          { title: '14 подъезд' },
          { title: '2024 жылы пайдалануға берілді' },
        ],
      },
      location: {
        title: 'Перспективалы 40-шы шағын аудан\nАқтау — Тұңғыш Президент паркіне жақын',
        text: 'Central Park тұрғын үй кешені Ақтаудың перспективалы 40-шы шағын ауданында орналасқан. Орналасудың басты ерекшелігі — Тұңғыш Президент Паркіне жақындығы.',
        notes: [
          'Central Park тұрғын үй кешені Ақтаудың 40-шы шағын ауданында орналасқан.',
          'Тұңғыш Президент Паркіне — қалаңың ең ірі жасыл массивіне — жақындығы.',
        ],
        cards: [
          { title: 'Dina гипермаркеті' },
          { title: 'Президент паркі' },
          { title: 'Әбіш Кекілбаев атындағы мұражай' },
        ],
      },
      architecture: {
        title: 'Ауа-райына бағынбайтын, өңсізденбейтін және ескірмейтін материалдар',
        lead: 'Кешен фасадтары БАЭ-тен алюминий композиттік панельдермен, иран табиғи мәрмәрімен және жапон клинкерлік кірпішімен жасалған. Ғимараттар монолитті-каркасты технология бойынша тұрғызылған.',
        points: [
          'БАЭ алюминий композиттік панельдері',
          'Иран табиғи мәрмәрі',
          'Жапон клинкерлік кірпіші',
          'Монолитті-каркасты технология',
          'Бескамералық терезе профильдері',
        ],
        ctaQuestion: 'Central Park материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      autonomy: {
        title: 'Үзіліссіз жұмыс істейтін кешен',
        points: [
          '2 дизелді генератор подъезд пен пәтерлерде жарық пен электр энергиясын қамтамасыз етеді',
          '350 м³ су сумен жабдықтаудың үзілу жағдайына арналған резервте сақталады',
          '50 м³ тек ландшафтқа суару үшін бөлінген',
        ],
      },
      yard: {
        title: 'Central Park аумағы бөгде адамдардан толықтай жабық және автомобильдер үшін кіру жоқ',
        text: 'Аула шу мен машина қозғалысынан бос, демалыс пен қарым-қатынасқа арналған қауіпсіз орын ретінде жобаланған.',
        features: [
          'Ересектерге арналған демалыс аймақтары',
          'Серуен маршруттары мен орындықтар',
          'Балалар эко-ойын кеңістіктері',
          'Жарықтандыру, жасылдандыру және акустикалық ыңғайлылық',
        ],
      },
      playground: {
        title: 'Балалар алаңы',
        text: 'Балалар үшін Buglo компаниясының ұзақ мерзімді және қауіпсіз материалдардан жасалған заманауи ойын алаңы орнатылған.',
      },
      kids: {
        roomTitle: 'Уличные тренировки жабдығы',
        roomText: 'Buglo компаниясының Workout аймағы — күш, төзімділік пен координацияны дамытуға бағытталған уличные тренировкалар жабдығы.',
        gallery: [
          { title: 'Workout аймағы' },
          { title: 'Футбол алаңы' },
          { title: 'Баскетбол алаңы' },
        ],
      },
      extras: {
        title: 'Аула аумағында демалыс, қарым-қатынас және іс-шаралар өткізуге арналған кеңістіктер бар',
        items: [
          { title: 'Қазан-ошақ', text: 'Отта тамақ пісіруге арналған дәстүрлі аймақ' },
          { title: 'Барбекю аймақтар', text: 'Отбасымен немесе көршілермен грильде тамақ пісіруге арналған алаңдар' },
          { title: '2 киіз үй', text: 'Дәстүр мен мәдениетке деген бережное қатынасты символдайтын демалысқа бейімделген киіз үйлер' },
        ],
      },
      hall: {
        title: 'Central Park-тың әрбір подъезді кең дизайнерлік холлдан басталады',
        text1: 'Авторлық безендіру, ойластырылған жарықтандыру, сәндік элементтер мен сапалы жиһаз әрбір подъездде ерекше атмосфера тудырады.',
        text2: '"Смарт домофон" жүйесі биометриялық тану мүмкіндігімен ендірілген. Енді кілтсіз подъездті ашуға, телефоннан қоңырауды қабылдауға және қонақтарды қашықтан кіргізуге болады.',
        features: [
          'Авторлық дизайнерлік безендіру',
          'Ойластырылған жарықтандыру',
          'Сәндік элементтер мен жиһаз',
          'Биометриялық смарт домофон',
          'Кілтсіз подъездке кіру',
          'Қонақтарды қашықтан кіргізу',
          'Барлық кіруді 24/7 жазу',
        ],
      },
      apartments: {
        title: 'Әрбір пәтердегі жоғары технологиялар',
        text: 'Подъездке кіру — бет-әлпетті тану арқылы, пәтерге — Philips смарт құлпы арқылы, IP домофондар — телефоннан жұмыс істейтін интерфейс.',
        features: [
          'Бет-әлпетті тану арқылы подъездке кіру',
          'Пәтерге Philips смарт құлпы',
          'Жазу мен қашықтан қолжетімділікпен IP домофон',
          'Телефоннан басқару интерфейсі',
        ],
      },
      consult: {
        title: 'CENTRAL PARK-ТАҒЫ КОММЕРЦИЯЛЫҚ ҮЙЛЕР ТУРАЛЫ АҚПАРАТ АЛҒЫМ КЕЛЕДІ',
        subtitle: 'Менеджер сізбен байланысып, өзекті коммерциялық үйлер туралы айтып береді.',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: {
        location: 'Aktau / District 40, Building 2',
        tagline: 'Central Park — a complex where aesthetics, comfort and high construction standards come together.',
      },
      about: {
        text: 'Central Park — a project for those who value harmony in personal life, respectable architecture and a thoughtful urban lifestyle.',
        stats: [
          { text: 'Commissioned in 2024' },
          { text: '435 apartments · 14 entrances' },
        ],
      },
      standards: {
        title: 'Central Park — a modern residential complex created for comfortable city living.',
        text: 'The complex comprises 435 apartments and 14 entrances united by thoughtful architecture, landscaped grounds and developed infrastructure. Commissioned in 2024.',
        cards: [
          { title: '435 apartments' },
          { title: '14 entrances' },
          { title: 'Commissioned 2024' },
        ],
      },
      location: {
        title: 'Promising District 40\nAktau — close to Presidential Park',
        text: 'Central Park is located in the promising District 40 of Aktau. The main highlight of the location is its proximity to Presidential Park, the city\'s largest green space.',
        notes: [
          'Central Park is located in Aktau\'s District 40.',
          'Proximity to Presidential Park — the city\'s largest green space.',
        ],
        cards: [
          { title: 'Dina Hypermarket' },
          { title: 'Presidential Park' },
          { title: 'Abish Kekilbayev Museum' },
        ],
      },
      architecture: {
        title: 'Materials that don\'t bow to the weather, don\'t fade and don\'t age, serving for decades',
        lead: 'The complex façades are finished with aluminium composite panels (UAE), natural Iranian marble and Japanese clinker brick. The buildings are assembled using monolithic frame technology with thoughtful thermal insulation and five-chamber window profiles.',
        points: [
          'Aluminium composite panels (UAE)',
          'Natural Iranian marble',
          'Japanese clinker brick',
          'Monolithic frame technology',
          'Five-chamber window profiles',
        ],
        ctaQuestion: 'Would you like to assess the quality of Central Park\'s materials in person?',
      },
      autonomy: {
        title: 'A complex that runs without interruption',
        points: [
          '2 diesel generators provide light and electricity in entrances and apartments during outages',
          '350 m³ of water is held in reserve in case of water supply disruptions',
          '50 m³ is allocated solely for landscape irrigation',
        ],
      },
      yard: {
        title: 'Central Park\'s territory is fully closed to outsiders with no vehicle access',
        text: 'The courtyard is designed as a safe place for rest and socialising, free from noise and traffic.',
        features: [
          'Adult recreation zones',
          'Walking routes and benches',
          'Children\'s eco play spaces',
          'Lighting, greenery and acoustic comfort',
        ],
      },
      playground: {
        title: 'Children\'s playground',
        text: 'A modern Buglo playground made from durable and safe materials has been installed for children. The design features a soft surface making play safe regardless of the season.',
      },
      kids: {
        roomTitle: 'Outdoor training equipment',
        roomText: 'Buglo Workout Zone — outdoor training equipment focused on developing strength, endurance and coordination. All elements are made from vandal-proof and eco-safe materials.',
        gallery: [
          { title: 'Workout zone' },
          { title: 'Football pitch' },
          { title: 'Basketball court' },
        ],
      },
      extras: {
        title: 'The courtyard features spaces for relaxation, socialising and events',
        items: [
          { title: 'Qazan-oshaq', text: 'Traditional open-fire cooking zone' },
          { title: 'Barbecue areas', text: 'Grilling areas for family or neighbour gatherings' },
          { title: '2 yurts', text: 'Rest-adapted yurts symbolising respect for tradition and culture' },
        ],
      },
      hall: {
        title: 'Every entrance of Central Park begins with a spacious designer lobby',
        text1: 'Original finishing, thoughtful lighting, decorative elements and quality furniture create a special atmosphere in every entrance.',
        text2: 'The complex features a "Smart Intercom" system with biometric recognition. You can now open the entrance without keys, answer calls from your phone and let guests in remotely. All visits are recorded; the system operates 24/7.',
        features: [
          'Original designer finishing',
          'Thoughtful lighting',
          'Decorative elements and furniture',
          'Biometric smart intercom',
          'Keyless entrance',
          'Remote guest access',
          'All visits recorded 24/7',
        ],
      },
      apartments: {
        title: 'High technology in every apartment',
        text: 'Entrance to the building via facial recognition, to the apartment via Philips smart lock; IP intercoms with a phone-based interface, recording and remote access.',
        features: [
          'Facial recognition entry to entrance',
          'Philips smart lock for apartment',
          'IP intercom with recording and remote access',
          'Phone-based control interface',
        ],
      },
      consult: {
        title: 'I WANT INFORMATION ABOUT COMMERCIAL PREMISES IN CENTRAL PARK',
        subtitle: 'A manager will contact you and provide details on available commercial premises.',
        hours: 'Daily 9:00–19:00',
      },
    },
  },
};

/**
 * Смёрдживает поверхностно объект переводов поверх оригинального data-объекта.
 * Вложенные объекты (about, standards и т.д.) смёрдживаются рекурсивно на 1 уровень.
 * @param {object} base   — оригинальный объект данных ЖК
 * @param {object} overrides — объект переводов из PROJECT_TEXTS[slug][lang]
 * @returns {object} пропатченный объект
 */
export function applyProjectTexts(base, overrides) {
  if (!overrides) return base;
  const result = { ...base };
  for (const [key, val] of Object.entries(overrides)) {
    if (val && typeof val === 'object' && !Array.isArray(val) && base[key] && typeof base[key] === 'object') {
      // Для вложенных объектов — shallow merge, массивы cards/stats/gallery/features/points/items мёрджим поэлементно
      const merged = { ...base[key], ...val };
      for (const arrKey of ['cards', 'stats', 'gallery', 'features', 'points', 'items', 'notes']) {
        if (val[arrKey] && base[key][arrKey]) {
          merged[arrKey] = base[key][arrKey].map((orig, i) => {
            const ov = val[arrKey][i];
            if (!ov) return orig;
            return typeof ov === 'object' ? { ...orig, ...ov } : ov;
          });
        }
      }
      result[key] = merged;
    } else {
      result[key] = val;
    }
  }
  return result;
}
