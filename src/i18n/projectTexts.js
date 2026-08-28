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
        text: 'Панорамалық терезелері, 3,2 метр төбелері және балалар бөлмесі бар бизнес-класс.',
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
        title: 'И. Есенберлин мен Қ. Сәтбаев даңғылдарының қиылысында',
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
        title: '2-кезектегі жабық балалар алаңы',
        text: 'Жабық балалар алаңы 2-кезекте қарастырылған. Двор — үйлер арасындағы кеңістік қана емес, отбасымен серуендеу, демалу және қарым-қатынасқа арналған үйлесімді орта.',
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
          '2-кезектегі жабық балалар алаңы',
          'Жабық жер үсті паркинг',
          'Ақылды құлыптар',
          '24/7 бейнебақылау',
          'Үлкейтілген терезелер 2 × 2,3 м',
          'Панорамалық терезелі пәтерлер',
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
      floorPlans: {
        title: 'Easton жоспарлары 48-ден 132 м²-ге дейін',
        text: '1–4 бөлмелі пәтер нұсқалары әртүрлі блоктарда. Жоспарды таңдап, кеңес алуға өтінім қалдырыңыз.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жіберіп береді.',
        address: 'Өскемен қ., Ілияс Есенберлин даңғылы, 38/3',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: { location: 'Oskemen city' },
      about: {
        title: 'Easton – BS Holding\'s first residential complex in Oskemen',
        text: 'Business class with panoramic windows, 3.2-metre ceilings and a kids\' room.',
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
        title: 'At the intersection of I. Yesenberlin and K. Satpayev avenues',
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
        title: 'Closed playground in Phase 2',
        text: 'A closed playground is planned for Phase 2. The courtyard is a harmonious environment for family walks, relaxation and socialising, with every detail created with safety and comfort in mind.',
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
          'Closed playground in Phase 2',
          'Covered above-ground parking',
          'Smart locks',
          '24/7 video surveillance',
          'Enlarged windows 2 × 2.3 m',
          'Apartments with panoramic windows',
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
      floorPlans: {
        title: 'Easton floor plans from 48 to 132 m²',
        text: '1–4 room apartment layouts across different blocks. Pick a layout and request a consultation.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you the catalogue, current prices and 0% instalment terms.',
        address: 'Oskemen, Ilyas Yesenberlin Avenue, 38/3',
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
        points: [
          'Монолитті қаңқа бүкіл тұрғын ғимараттың беріктігі мен ұзақ мерзімділігін қамтамасыз етеді.',
          'Минерал мақтамен жылытылған алюминий композиттік панельдерден жасалған фасад жылу және шу оқшаулауын, сондай-ақ жоғары өрт қауіпсіздігін қамтамасыз етеді.',
          'Rehau бескамералық терезелері мен IP-домофония кешеннің премиум сипатын айқындайды.',
        ],
        ctaQuestion: 'White Hill материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: 'Ауланың кеңістігі тыныштық пен ыңғайлылыққа приоритет беріліп жобаланған',
      },
      playground: {
        title: 'Заманауи ойын алаңы',
        text: 'Аула — үйлер арасындағы кеңістік қана емес, бүкіл отбасымен демалуға, қарым-қатынасқа және серуендеуге арналған үйлесімді орта. Мангал аймағы, chill-аймақ және спорт алаңдары қауіпсіздік пен ыңғайлылық ескеріле жасалған.',
      },
      kids: {
        gallery: [
          { title: 'Қауіпсіз\nматериалдар' },
          { title: 'Белсенді\nойын аймағы' },
          { title: 'Шығармашылық\nжәне демалыс' },
        ],
        roomTitle: 'Kids Room — тұрғын үй кешенінің кішкентай тұрғындарына арналған жабық балалар алаңы',
        roomText: 'Жаман ауа райында да балалар жылы әрі қауіпсіз кеңістікте ойнап, қиялдап, көңілді уақыт өткізе алады.',
      },
      hall: {
        title: 'Холлдар — элегантттылық пен заманауи стильдің үйлесімі',
        text1: 'Безендіру жарық пен пропорцияларға назар аударыла жасалған.',
        text2: 'Подъездтер мен лифт аймақтарының кеңістігі бірыңғай авторлық стильде орындалып, премиум ыңғайлылық атмосферасын тудырады.',
        features: [
          'Авторлық дизайнерлік холлдар',
          'Лобби төбелері 5,1-ден 6,5 м-ге дейін',
          'Ойластырылған подъездтер',
          'Заманауи лифт аймақтары',
        ],
      },
      apartments: {
        title: 'Әрбір пәтер — ыңғайлылық, функционалдылық және заманауи стиль кеңістігі',
        text: 'Төбе биіктігі 3,1-ден 3,2 м-ге дейін, IP-домофония және Rehau бескамералық терезелері жеңілдік сезімін тудырып, әр шаршы метрді барынша тиімді пайдалануға мүмкіндік береді.',
        features: [
          'Төбе биіктігі 3,1-ден 3,2 м-ге дейін',
          'IP-домофония',
          'Rehau бескамералық терезелері',
          'Пәтерлер екінші қабаттан басталады',
        ],
      },
      parking: {
        title: 'White Hill паркингі — ыңғайлылық, қауіпсіздік және ойластырылған ұйымның үйлесімі',
        points: [
          'Жер үсті жабық паркинг сыртқы әсерлерден қорғалған және жылдың кез келген мезгілінде қолжетімді.',
          'Кіру қолжетімділікті бақылау жүйесі арқылы жүзеге асырылады — бөгде адамдардың кіруі шеттетілген.',
          'Паркингтен тұрғын қабаттарға лифтімен тікелей шығу.',
        ],
        note: 'Кең орындар, ойластырылған навигация және заманауи жарықтандыру паркингті пайдалануды барынша ыңғайлы етеді.',
      },
      floorPlans: {
        title: 'White Hill жоспарлары 43-тен 181 шарш. м-ге дейін',
        text: 'Кең ас үй-қонақ бөлмелері, мастер-жатын бөлмелері мен гардеробтары бар пәтер нұсқалары. Жоспарды таңдап, кеңес алуға өтінім қалдырыңыз.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жіберіп береді.',
        address: 'Ақтөбе қ., Алтын Орда шағын ауданы, Ораз Татеулы көшесі',
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
        points: [
          'A monolithic frame provides strength and durability for the entire building.',
          'A façade of aluminium composite panels with mineral wool insulation delivers thermal and sound insulation as well as enhanced fire safety.',
          'Five-chamber Rehau windows and IP intercoms underline the premium character of the complex.',
        ],
        ctaQuestion: 'Would you like to assess the quality of White Hill\'s materials in person?',
      },
      yard: {
        title: 'The courtyard space is designed with a priority on peace and comfort',
      },
      playground: {
        title: 'A modern playground',
        text: 'The courtyard is more than the space between buildings — it is a harmonious environment for rest, socialising and family walks. The barbecue area, chill-out zone and sports pitches are designed with safety and comfort in mind.',
      },
      kids: {
        gallery: [
          { title: 'Safe\nmaterials' },
          { title: 'Active\nplay zone' },
          { title: 'Creative space\n& relaxation' },
        ],
        roomTitle: 'Kids Room — an indoor playground for the complex\'s youngest residents',
        roomText: 'Even in bad weather children can play, imagine and have fun in a warm and safe space.',
      },
      hall: {
        title: 'Lobbies — a blend of elegance and modern style',
        text1: 'The design pays close attention to light and proportions.',
        text2: 'Entrance and lift areas are finished in a single signature style, creating an atmosphere of premium comfort.',
        features: [
          'Original designer lobbies',
          'Lobby ceilings from 5.1 to 6.5 m',
          'Thoughtfully designed entrances',
          'Modern lift areas',
        ],
      },
      apartments: {
        title: 'Every apartment is a space of comfort, functionality and modern style',
        text: 'Ceiling heights from 3.1 to 3.2 m, IP intercoms and five-chamber Rehau windows create a sense of lightness and make the most of every square metre.',
        features: [
          'Ceiling heights from 3.1 to 3.2 m',
          'IP intercom',
          'Five-chamber Rehau windows',
          'Apartments start from the second floor',
        ],
      },
      parking: {
        title: 'White Hill parking — a combination of convenience, security and thoughtful organisation',
        points: [
          'The covered above-ground car park is protected from the elements and accessible year-round.',
          'Entry is managed by an access control system — outsiders cannot get in.',
          'Direct lift access from the car park to the residential floors.',
        ],
        note: 'Spacious bays, clear wayfinding and modern lighting make using the car park as convenient as possible.',
      },
      floorPlans: {
        title: 'White Hill floor plans from 43 to 181 sq. m',
        text: 'Apartment layouts with spacious kitchen-living rooms, master bedrooms and walk-in wardrobes. Pick a layout and request a consultation.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you the catalogue, current prices and 0% instalment terms.',
        address: 'Aktobe, Altyn Orda district, Oraza Tateuuly street',
        hours: 'Mon–Fri: 09:00–19:00\nSat–Sun: 10:00–17:00',
      },
    },
  },

  orta: {
    KZ: {
      hero: {
        location: '9-шы шағын ауданда орналасқан бизнес-класс санатындағы тұрғын үй кешені',
      },
      about: {
        title: 'Тыныштықты бағалайтындарға арналған үй',
        text: 'ORTA — екі подъезге біріктірілген 69 пәтерден тұратын бизнес-класс тұрғын үй кешені. Жоба ұстамды сәулетімен, жеке кеңістікке мән беруімен және қалалық ортамен үйлесімділігімен ерекшеленеді.',
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
        title: 'Бөгде адамдардан оқшауланған жеке аула',
        text: 'ORTA-ның жабық ауласы сырттан келетін адамдардың және көлік қозғалысының транзитін шектейді. Мұнда тұрғындарға арналған тыныш әрі қауіпсіз жеке кеңістік қалыптасады.',
      },
      playground: {
        title: 'Үйдің жалғасы ретіндегі аула',
        text: 'Ландшафттық жасыл желек, сәулеттік формалар мен эко-ойын кешендері балалар мен ересектерге ыңғайлы жеке аула ортасын қалыптастырады.',
      },
      hall: {
        title: 'Дизайнерлік кіреберіс топтар',
        text1: 'ORTA-ның дизайнерлік холлдары үй туралы алғашқы әсерді қалыптастырып, оның ұстамды, мәртебелі сипатын нығайтады.',
        features: [
          'Транзитсіз жабық аула',
          'IP-домофония',
          'Тәулік бойы бейнебақылау',
          'Кешен күзеті',
        ],
      },
      apartments: {
        title: 'Ұсақ-түйегіне дейін ойластырылған жайлылық',
        text: 'ORTA-ның жоспарлау шешімдері функционалдылық пен жеке кеңістікке басымдық береді — әр шаршы метрі тиімді пайдаланылып, қажетсіз кеңістікке орын берілмеген.',
        features: [
          'Төбе биіктігі — 3,2 метр',
          'Биіктігі 2,2 метр бескамералық терезелер',
          'Smart-тұтқалар',
          'IP-домофония',
        ],
      },
      floorPlans: {
        title: 'ORTA жоспарлары 43-тен 100 м²-ге дейін',
        text: 'ORTA-да еркін жоспарлау шешімдері қарастырылған: 1 бөлмелі — 43,39–43,45 м²; 2 бөлмелі — 66,04–89,39 м²; 3 бөлмелі — 90,67–100,45 м². Толығырақ қарау үшін жоспарды ашыңыз.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер ORTA туралы ақпарат жіберіп, кеңес береді.',
        address: 'Ақтау қ., 9 шағын аудан',
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
      hall: {
        title: 'Designer entrance groups',
        text1: 'ORTA\'s designer lobbies shape the first impression of the building and reinforce its restrained, high-status character.',
        features: [
          'Gated courtyard with no through traffic',
          'IP intercom',
          '24/7 video surveillance',
          'On-site security',
        ],
      },
      apartments: {
        title: 'Comfort considered down to the details',
        text: 'ORTA\'s layouts are built around functionality and privacy, with no surplus metres or incidental spaces.',
        features: [
          'Ceiling height — 3.2 metres',
          'Five-chamber windows 2.2 metres tall',
          'Smart handles',
          'IP intercom',
        ],
      },
      floorPlans: {
        title: 'ORTA floor plans from 43 to 100 m²',
        text: 'ORTA offers open-plan layouts: 1-room — 43.39–43.45 m²; 2-room — 66.04–89.39 m²; 3-room — 90.67–100.45 m². Open a plan to view it in detail.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send you information about ORTA and offer a consultation.',
        address: 'Aktau, District 9',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  'avenue-park': {
    KZ: {
      hero: {
        location: '',
        tagline: 'Avenue Park — 40-шы шағын аудандағы жайлылық пен сенімділіктің жаңа стандарты.',
      },
      about: {
        title: 'Үйдің жылуын сезінетін мекен',
        text: 'Avenue Park — қаланың қарбаласынан алыс кетпей, жайлылық пен тыныштықты қатар сезінуге мүмкіндік беретін тұрғын үй кешені. Мұнда табиғилық, қауіпсіздік және заманауи жайлылық бір кеңістікте үйлесім табады.',
        imageAlt: 'Avenue Park кешенінің жалпы көрінісі',
        stats: [
          { text: '360 м³ — сумен жабдықтау тоқтаған жағдайда пайдаланылатын резервтік су қоры.' },
          { text: '3–3,2 м — пәтерлердегі төбе биіктігі' },
          { text: '24/7 — бейнебақылау және аумақты қорғау' },
        ],
      },
      standards: {
        title: 'Жобаның басты артықшылықтары',
        text: 'Avenue Park — 40-шы шағын аудандағы жайлылық пен сенімділіктің жаңа стандарты.',
        cards: [
          {
            title:
              'Инженерлік автономия — резервтік дизель-генератор мен 360 м³ су қоры сыртқы желілерде ақау болған жағдайда кешеннің үздіксіз жұмысын қамтамасыз етеді.',
          },
          {
            title:
              'Ақылды қауіпсіздік технологиялары — Xiaomi MI Magic Vein электрондық құлпы арқылы Face ID, саусақ ізі, карта немесе құпиясөз көмегімен кілтсіз кіру мүмкіндігі және IP-домофония жүйесі.',
          },
          {
            title:
              'Премиум инженерлік жүйелер — Xizi Gotz лифтілері, Rehau терезелері, Royal Thermo радиаторлары',
          },
        ],
      },
      location: {
        title: '40-шы шағын аудан — Бірінші Президент саябағының жанында',
        cards: [
          { title: 'Бірінші Президент паркі' },
          { title: 'А. Кекілбаев атындағы мұражай' },
          { title: 'BS Arena спорт кешені' },
        ],
        notes: [
          'Avenue Park Ақтаудың перспективалы 40-шы микрорайонында орналасқан — жаңа идеалар мен жайлы өмір салтының орталығына айналуда.',
          'Локацияның басты ерекшелігі — Бірінші Президент паркіне жақындығы: таңғы серуендер мен кешкі демалыс күнделікті өмірдің бөлігіне айналады.',
        ],
      },
      architecture: {
        title: 'Премиум-класс деңгейіндегі инженерлік шешімдер',
        lead: 'Avenue Park тұрғын үй кешенінде лифт жүйесінен бастап терезелер мен есіктерге дейін әрбір инженерлік шешім сенімділікке, қауіпсіздікке және ұзақ мерзімді пайдалануға бағытталған.',
        points: [
          'Xizi Gotz (Қытай) лифттері — A және D блоктарында 2 лифттен, ал B, E, V және G блоктарында 1 лифттен қарастырылған.',
          'Rehau (Германия) терезелері — 5 камералы профиль және жылуды жақсы сақтайтын екі камералы шыныпакет.',
          'Металл кіреберіс есіктері — Ресейде өндірілген, Xiaomi MI Magic Vein электрондық құлпымен жабдықталған.',
        ],
        ctaQuestion: 'Avenue Park материалдарының сапасын жеке бағалағыңыз келе ме?',
        ctaButton: 'Экскурсияға жазылу',
      },
      yard: {
        label: 'Жобаның ірі артықшылығы',
        title: 'Ақылды үй есікпен басталады',
        text:
          'Avenue Park пәтерлерінде Xiaomi MI Magic Vein электрондық құлыптары орнатылған. Құлып Face ID арқылы бетті тану, саусақ ізі, карта және құпиясөз арқылы ашылады. Сондай-ақ есікті кілтпен ашу мүмкіндігі бар. Балалы отбасылар үшін бұл — бала күтуші, қонақтар немесе туыстардың кіруін бақылауға және оларға берілетін қолжетімділікті басқаруға мүмкіндік беретін заманауи шешім.',
      },
      playground: {
        title: 'Аула — тыныштық, спорт және сау өмір салтының орталығы',
        text:
          'Avenue Park көпфункционалды ауласы жасылдануды, балаларға арналған сенсорлық ойын алаңдарын, спорт аймақтарын және бүкіл отбасыға арналған демалыс орындарын біріктіреді.',
        cta: 'Кеңес алу',
      },
      kids: {
        label: 'Аула және абаттандыру',
        gallery: [
          { title: 'Балалардың дамуына арналған сенсорлық ойын алаңдары: горкалар, тепе-теңдік тақталары және тактильді жолдар' },
          { title: 'Workout аймақтары, баскетбол және футбол алаңдары' },
          { title: 'Перголалар мен шағын архитектуралық формалармен демалыс аймақтары' },
        ],
        roomLabel: 'Kids Room',
        roomTitle: 'Kids Room — балаға арналған қауіпсіз шағын әлем',
        roomText:
          'Avenue Park кешенінде балаларға арналған жабық бөлме қарастырылған. Мұнда жұмсақ әрі қауіпсіз жабын төселген, балалар кез келген ауа райында шығармашылықпен айналысып, ойнап, жаңа достар тауып, өз қабілеттерін дамыта алады.',
        roomImageAlt: 'Kids Room интерьері',
      },
      hall: {
        label: 'Қоғамдық кеңістіктер',
        title: 'Киіз үй мен қазан аймағы — дәстүрдің заманауи көрінісі',
        text1: 'Кешен ауласында отбасылық демалыс пен дәстүрлі іс-шараларды өткізуге арналған ұлттық нақыштағы жайлы кеңістіктер қарастырылған.',
        features: [
          'Отбасылық жиналыстар мен мерекелерге арналған қазан және барбекю аймағы',
          'Демалыс пен мерекелерге арналған қазақ юртасының заманауи интерпретациясы',
          'Бүкіл аумақты тәулік бойы бейнебақылау',
          'Әр пәтерде IP-домофония',
        ],
      },
      apartments: {
        title: 'Пәтердің әр бөлшегінде — жайлылық',
        text: '3–3,2 метрлік төбе биіктігі, француз панорамалық балкондары және сенімді инженерлік шешімдер кеңдік, жайлылық пен қауіпсіздік сезімін қалыптастырады.',
        cta: 'Кеңес алу',
        features: [
          '3–3,2 м төбе биіктігі',
          'Үш жағынан шыныланған француз панорамалық балкондары',
          'Royal Thermo радиаторлары',
          'Xiaomi MI Magic Vein электрондық құлпы: Face ID, саусақ ізі, карта және құпиясөз арқылы ашылады.',
        ],
      },
      floorPlans: {
        title: 'Avenue Park пәтер жоспарлары — блоктар бойынша',
        text: 'A және D блоктарының пәтерлік парақтары. Сүзгісіз нұсқада негізгі қабаттар көрсетілген. Толық тізімді ашу үшін блокты немесе қажетті қабатты таңдаңыз.',
      },
      boxroom: {
        label: 'Boxroom және бизнес-кеңістіктер',
        title: 'Boxroom және бизнес-кеңістіктер — Avenue Park қосымша мүмкіндіктері',
        text:
          'Жеке Boxroom қоймалары пәтерді артық заттардан арылтып, кең әрі жинақы ұстауға мүмкіндік береді. Коммерциялық мақсатқа арналған 3,8–5 м төбелі бизнес-кеңістіктер мен жеке инженерлік жүйелер қарастырылған.',
        gallery: [
          { alt: 'Boxroom кладовая' },
          { alt: 'Бизнес-кеңістік' },
        ],
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жібереді.',
        address: 'Ақтау қ., 40-шы микрорайон',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: {
        location: '',
        tagline: 'Avenue Park — a new standard of comfort and reliability in District 40.',
      },
      about: {
        title: 'A home where a true sense of home is born',
        text: 'Avenue Park is a residential complex at the heart of city life, where every resident enjoys calm, natural surroundings and modern comfort. The complex is united by one idea — making everyday life convenient, safe and meaningful.',
        imageAlt: 'Avenue Park complex overview',
        stats: [
          { text: '360 m³ — backup water reserve in case of water supply interruption' },
          { text: '3–3.2 m — ceiling height in apartments' },
          { text: '24/7 — video surveillance and territory security' },
        ],
      },
      standards: {
        title: 'Key project advantages',
        text: 'Avenue Park, Aktau — a new standard of comfort and reliability in District 40.',
        cards: [
          {
            title:
              'Engineering autonomy — backup diesel generator and 360 m³ water reserve ensure uninterrupted comfort during external network failures',
          },
          {
            title:
              'Smart security — Xiaomi MI Magic Vein electronic lock (Face ID, fingerprint, card, password) and IP intercom in every apartment',
          },
          {
            title: 'Premium engineering systems — Xizi Gotz lifts, Rehau windows, Royal Thermo radiators',
          },
        ],
      },
      location: {
        title: 'District 40 — next to First President Park',
        cards: [
          { title: 'First President Park' },
          { title: 'A. Kekilbayev Museum' },
          { title: 'BS Arena sports complex' },
        ],
        notes: [
          'Avenue Park is located in the promising District 40 of Aktau — becoming a centre of new ideas and a comfortable lifestyle.',
          'The main location advantage is proximity to First President Park — morning walks and evening relaxation become part of everyday life.',
        ],
      },
      architecture: {
        title: 'Premium-class engineering solutions',
        lead: 'Avenue Park focuses on the reliability and durability of engineering systems — from lifts to windows and doors.',
        points: [
          'Xizi Gotz (China) lifts with load distribution across blocks: 2 lifts in blocks A and D; 1 lift in blocks B, E, V and G.',
          'Rehau (Germany) windows: 5-chamber profile, double-glazed units.',
          'Russian-made steel entrance doors with Xiaomi MI Magic Vein electronic lock.',
        ],
        ctaQuestion: 'Would you like to assess the quality of Avenue Park\'s materials in person?',
        ctaButton: 'Book a tour',
      },
      yard: {
        label: 'Major project advantage',
        title: 'A smart home starts at the door',
        text:
          'Avenue Park apartments feature a Xiaomi MI Magic Vein electronic lock: face recognition (Face ID), fingerprint, card, password or manual opening. For families with children, full control over access time and level for a nanny, guest or relative.',
      },
      playground: {
        title: 'Courtyard — centre of calm, sport and healthy living',
        text:
          'Avenue Park\'s multifunctional courtyard combines landscaping, sensory playgrounds for children, sports zones and recreation areas for the whole family.',
        cta: 'Get consultation',
      },
      kids: {
        label: 'Courtyard and landscaping',
        gallery: [
          { title: 'Sensory playgrounds for child development: slides, balance boards and tactile paths' },
          { title: 'Workout zones, basketball and football courts' },
          { title: 'Recreation areas with pergolas and small architectural forms' },
        ],
        roomLabel: 'Kids Room',
        roomTitle: 'Kids Room — a safe mini-world for your child',
        roomText:
          'Avenue Park has a closed children\'s room with soft safe flooring where children create and play in any weather.',
        roomImageAlt: 'Kids Room interior',
      },
      hall: {
        label: 'Public spaces',
        title: 'Yurt and qazan zone — traditions in a modern format',
        text1: 'The complex courtyard includes ethnic and family spaces for recreation and traditional events.',
        features: [
          'Qazan and barbecue zone for family gatherings and celebrations',
          'Modern interpretation of a Kazakh yurt for recreation and celebrations',
          '24/7 video surveillance across the territory',
          'IP intercom in every apartment',
        ],
      },
      apartments: {
        title: 'Comfort in every apartment detail',
        text: 'Ceiling heights of 3–3.2 m, French panoramic balconies and reliable engineering create a sense of space and security.',
        cta: 'Get consultation',
        features: [
          'Ceiling height 3–3.2 m',
          'French panoramic balconies with glazing on three sides',
          'Royal Thermo radiators',
          'Xiaomi MI Magic Vein: Face ID, fingerprint, card and password',
        ],
      },
      floorPlans: {
        title: 'Avenue Park floor plans by block',
        text: 'Apartment sheets for blocks A and D. Without filter — main floors; select a block or floor for the full list.',
      },
      boxroom: {
        label: 'Boxroom and business spaces',
        title: 'Boxroom and business spaces — additional Avenue Park opportunities',
        text:
          'Personal Boxroom storage frees your apartment from clutter. Business spaces with 3.8–5 m ceilings and separate engineering systems for work, services, retail or a studio.',
        gallery: [
          { alt: 'Boxroom storage' },
          { alt: 'Business space' },
        ],
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send the catalogue, current prices and 0% instalment terms.',
        address: 'Aktau, District 40',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  'bs-towers': {
    KZ: {
      hero: {
        location: 'Ақтау қ.',
        tagline: 'BS Towers — Ақтаудың жаңа белесі!',
      },
      about: {
        title: 'BS Towers — BS Holding-тің жаңа премиум-класс жобасы',
        text:
          'Жоба қаланың заманауи сәулеттік келбетін айқындайтын ерекше нысан ретінде жасалған. 12, 16 және 18 қабатты үш мұнара панорамалық терезелерді, функционалды жоспарларды, жоғары деңгейдегі инженерлік шешімдерді және қаланың ерекше көрінісін үйлестіреді.',
        imageAlt: 'BS Towers үш мұнарасының жалпы көрінісі',
        stats: [
          { text: '226 пәтер — кешеннің тұрғын үй қоры' },
          { text: '12, 16 және 18 қабат — үш мұнара' },
          {
            text: '3,2–3,3 м — тұрғын қабаттардағы төбе биіктігі; 5,8 м — коммерциялық үй-жайлар; 4,1 м — соңғы қабаттағы төбе биіктігі',
          },
        ],
      },
      standards: {
        title: 'Жобаның басты артықшылықтары',
        text: 'BS Towers — Ақтаудағы премиум-класс тұрғын үй кешені.',
        cards: [
          {
            title:
              'Жер асты паркинг — пайдалануға жарамды жасыл төбе және машинасыз аула аймағымен',
          },
          { title: 'Резиденттерге арналған жеке Fitness Room' },
          { title: 'Панорамалық шынылау — қала көрінісін ашады' },
        ],
      },
      location: {
        title: 'Ақтаудың престижді 40-шы микрорайоны',
        cards: [
          {
            title:
              'Dina гипермаркеті — Ақтаудағы заманауи гипермаркет, кең ассортимент және өз кулинариясы',
          },
          {
            title:
              'Президент паркі — Ақтаудағы ірі парк серуен, демалыс және отбасылық досқой үшін',
          },
          {
            title:
              'Абиш Кекілбаев атындағы мұражай — қазақстандық жазушы мен мемлекеттік қайраткердің өмірі мен шығармашылығына арналған мәдени орталық',
          },
        ],
        notes: [
          'Кешен қаланың беделді аудандарының бірі — 40-шы шағын ауданда орналасқан. Тұңғыш Президент саябағына жаяу жетуге болады, ал Каспий теңізінің жағалауына дейін небәрі 15 минутта жетесіз.',
          'Жақын маңда DINA гипермаркеті, мектептер, балабақшалар және Әбіш Кекілбайұлы атындағы музей орналасқан.',
        ],
      },
      architecture: {
        title: 'Монолитті қаңқа және заманауи фасад материалдары',
        lead:
          'Ғимараттың негізгі қаңқасы монолитті темірбетоннан орындалған. Тірек конструкциялар бағаналардан, көлденең қабырғалардан және тік қаттылық диафрагмаларынан тұрады. Ғимараттың негізі — монолитті қаңқалы жүйе.',
        points: [
          'Сыртқы безендіру: АКП, алюминий, фибробетон, клинкер және гранит.',
          'Сыртқы қабырғалар — 250 мм газоблок.',
          'Блоктардың қабаттылығы — 12, 16 және 18 қабат.',
        ],
        ctaQuestion: 'BS Towers материалдарының сапасын жеке бағалағыңыз келе ме?',
        ctaButton: 'Экскурсияға жазылу',
      },
      yard: {
        label: 'Жобаның ірі артықшылығы',
        title: 'Көгалдандырылған төбесі бар жерасты паркингі',
        text:
          'Кешенде пайдаланылатын төбесі бар бір қабатты жер асты паркингі қарастырылған. Паркингтің үстіңгі бөлігі көгалдандырылып, балаларға және спортпен айналысуға арналған алаңдармен жабдықталған. Аула аумағы автокөліктерден толық босатылған.',
      },
      kids: {
        label: 'Аула және абаттандыру',
        gallery: [
          { title: 'Балалар алаңдары' },
          { title: 'Спорт алаңдары' },
          { title: 'Тұрғындарға арналған демалыс аймақтары' },
        ],
        roomImageAlt: 'Kids Room BS Towers',
      },
      hall: {
        title: 'BS Towers ортақ пайдалану кеңістіктері',
        text1:
          'Кешеннің холлдары мен кіреберіс топтары заманауи премиум стильде безендірілген — мәнерлі материалдар, акценттік жарықтандыру және ойластырылған навигация.',
        gallery: [
          { title: 'Кіреберіс тобы' },
          { title: 'Лифт холлы' },
          { title: 'Тұрғындарға арналған кеңістік' },
        ],
        features: [
          'Холлдардың премиум безендірілуі',
          'Заманауи навигациялы лифт холдары',
          'Кіреберіс топтарының акценттік жарықтандыруы',
          'Тұрғындар мен қонақтарға арналған аймақтар',
        ],
      },
      apartments: {
        title: 'Жайлы биіктік және форматтардың әртүрлілігі',
        text: 'Тұрғын қабаттардағы төбе биіктігі 3,2–3,3 м. Үйде 1-ден 4 бөлмеге дейін пәтерлер ұсынылған.',
        cta: 'Кеңес алу',
        features: [],
      },
      floorPlans: {
        title: 'BS Towers квартирография',
        text:
          'Кешенде төрт формат ұсынылған: 1 бөлмелі — 54 пәтер (23,9%), 2 бөлмелі — 65 (28,8%), 3 бөлмелі — 64 (28,3%), 4 бөлмелі — 43 (19,0%). Барлығы 226 пәтер.',
      },
      consult: {
        title: 'Байланыс деректерін толтырыңыз — м² үшін тиімді бағаны бекітіп береміз',
        subtitle: 'Менеджер каталогты, өзекті бағаларды және 0% бөліп төлеу шарттарын жібереді.',
        address: 'Ақтау қ., 40-шы микрорайон',
        hours: 'Күн сайын 9:00-ден 19:00-ге дейін',
      },
    },
    EN: {
      hero: {
        location: 'Aktau',
        tagline: 'BS Towers — a premium-class residential complex in Aktau.',
      },
      about: {
        title: 'BS Towers — a new premium-class project from BS Holding',
        text:
          'The project is designed as a modern architectural landmark of the city. Three towers of 12, 16 and 18 floors combine panoramic glazing, functional layouts, high-level engineering solutions and exceptional views.',
        imageAlt: 'Overview of the three BS Towers buildings',
        stats: [
          { text: '226 apartments — the residential stock of the complex' },
          { text: '12, 16 and 18 floors — three towers' },
          {
            text: '3.2–3.3 m — residential floor ceiling height; 5.8 m — commercial units; 4.1 m — top floor',
          },
        ],
      },
      standards: {
        title: 'Key project advantages',
        text: 'BS Towers — a premium-class residential complex in Aktau.',
        cards: [
          {
            title:
              'Underground parking — with a usable green roof and a car-free courtyard area',
          },
          { title: 'Private Fitness Room for residents' },
          { title: 'Panoramic glazing — opens views of the city' },
        ],
      },
      location: {
        title: 'Prestigious District 40, Aktau',
        cards: [
          {
            title:
              'Dina hypermarket — a modern Aktau hypermarket with a wide range of products, homeware and own culinary line',
          },
          {
            title:
              'Presidential Park — one of Aktau\'s largest parks for walks, outdoor recreation and family leisure',
          },
          {
            title:
              'Abish Kekilbayev Museum — a modern cultural centre dedicated to the life and work of the Kazakh writer and statesman',
          },
        ],
        notes: [
          'The complex is in District 40 — one of the city\'s prestigious areas. First President Park is within walking distance; the Caspian coast is about 15 minutes away.',
          'Nearby: Dina hypermarket, schools, kindergartens and the Abish Kekilbayev Museum.',
        ],
      },
      architecture: {
        title: 'Monolithic frame and modern façade materials',
        lead:
          'The building uses a frame scheme: load-bearing structures form a system of columns, horizontal slabs and vertical stiffening diaphragms; pile foundation.',
        points: [
          'Exterior finish: ACM, aluminium, fibre concrete, clinker and granite.',
          'External walls — 250 mm aerated concrete blocks.',
          'Block heights — 12, 16 and 18 floors.',
        ],
        ctaQuestion: 'Would you like to assess the quality of BS Towers\' materials in person?',
        ctaButton: 'Book a tour',
      },
      yard: {
        label: 'Major project advantage',
        title: 'Underground parking with a green roof',
        text:
          'The complex has a single-level underground parking with a usable roof. Landscaped courtyards with greenery, children\'s and sports playgrounds are on the roof — the entire courtyard is car-free.',
      },
      kids: {
        label: 'Courtyard and landscaping',
        gallery: [
          { title: 'Children\'s playgrounds' },
          { title: 'Sports courts' },
          { title: 'Recreation areas for residents' },
        ],
        roomImageAlt: 'Kids Room BS Towers',
      },
      hall: {
        title: 'BS Towers common areas',
        text1:
          'The lobbies and entrance groups of the complex are finished in a modern premium style — with expressive materials, accent lighting and thoughtful wayfinding.',
        gallery: [
          { title: 'Entrance group' },
          { title: 'Lift lobby' },
          { title: 'Residents\' space' },
        ],
        features: [
          'Premium lobby finishes',
          'Lift lobbies with modern wayfinding',
          'Accent lighting in entrance groups',
          'Areas for residents and guests',
        ],
      },
      apartments: {
        title: 'Comfortable ceiling height and variety of formats',
        text: 'Residential floor ceiling height is 3.2–3.3 m. The building offers apartments from 1 to 4 rooms.',
        cta: 'Get consultation',
        features: [
          'Residential floor ceiling height — 3.2–3.3 m',
          'Total apartment area — 21,231.4 m²; living area — 10,911 m²',
          'Storage rooms in the building — total area 422.26 m²',
          '226 apartments in the complex',
        ],
      },
      floorPlans: {
        title: 'BS Towers apartment layouts',
        text:
          'The complex offers four formats: 1-bedroom — 54 apartments (23.9%), 2-bedroom — 65 (28.8%), 3-bedroom — 64 (28.3%), 4-bedroom — 43 (19.0%). Total 226 apartments.',
      },
      consult: {
        title: 'Leave your contacts — we\'ll lock in a great price per m² for you',
        subtitle: 'A manager will send the catalogue, current prices and 0% instalment terms.',
        address: 'Aktau, District 40',
        hours: 'Daily 9:00–19:00',
      },
    },
  },

  mura: {
    KZ: {
      hero: {
        location: 'Ақтау қ. / 40 МКР',
        tagline: 'MURA — Ақтаудың 40 шағын ауданындағы комфорт+ класс тұрғын үй кешені',
      },
      about: {
        text: 'MURA — Ақтаудың 40-шы шағын ауданында, Президент паркіне жақын орналасқан BS Holding тұрғын үй кешені. Кешен биіктігі 7 қабат, 3 блоктан тұрады, онда 262 пәтер қарастырылған. Кешеннің сәулеттік тұжырымдамасы заманауи эстетиканы сенімді құрылыс шешімдерімен үйлестіруге негізделген.',
        stats: [
          { text: '2028 жылдың I тоқсанында тапсыру' },
          { text: '262 пәтер · 3 блок · 7 қабат' },
        ],
      },
      standards: {
        title: '262 пәтер · 3 блок · 2028 жылдың I тоқсанында тапсыру',
        text: 'MURA тұрғын үй кешені Ақтаудың 40-шы шағын ауданында, Президент паркіне жақын орналасқан.',
        cards: [
          { title: '262 пәтер' },
          { title: '3 блок' },
          { title: '2028 жылдың I тоқсанында тапсыру' },
        ],
      },
      architecture: {
        title: 'Заманауи сәулет, жинақы дизайн және ұзақ жылдар бойы сақталатын фасад эстетикасы',
        lead: '«MURA» тұрғын үй кешені биіктігі 7 қабатты 3 блоктан тұрады, пәтерлердің жалпы саны — 262. Ғимараттың каркасы кірпіштен жасалған, сыртқы фасады жоғары сапалы фиброцементтік панельдермен қапталған. Бұл материал ғимаратқа заманауи сәулет бейнесін береді және фасадтың ұзақ мерзімді беріктігін қамтамасыз етеді. Ғимараттың жылу тиімділігі минерал мақта тақталарынан жылытқышпен қамтамасыз етіледі.',
        points: [
          'Кірпіштен жасалған ғимарат каркасы',
          'Фасад — жоғары сапалы фиброцементтік панельдер',
          'Минерал мақта тақталарынан жылытқыш',
          'Ылғал, бу және желден қорғауға арналған «Изоспан» үш қабатты мембрана',
        ],
        ctaQuestion: 'MURA материалдарының сапасын жеке бағалағыңыз келе ме?',
      },
      yard: {
        title: '«MURA» тұрғын үй кешенінің ауласы ашық және абаттандырылған кеңістік ретінде жобаланған',
        text: '«MURA» тұрғын үй кешенінің ауласы ашық және абаттандырылған кеңістік ретінде жобаланған. Балаларға экологиялық таза материалдардан жасалған заманауи ойын алаңы орнатылған. Тұрғындарға жайлы демалыс аймақтары мен беседкалар, сондай-ақ отбасылық жиналыстарға арналған қазан-ошақ аймағы қарастырылған.',
      },
      playground: {
        title: 'Экологиялық таза материалдардан жасалған заманауи ойын алаңы',
        text: 'Балаларға экологиялық таза материалдардан жасалған заманауи ойын алаңы орнатылған — маусымға қарамастан ойын қауіпсіз.',
      },
      kids: {
        gallery: [
          { title: 'Қауіпсіз\nматериалдар' },
          { title: 'Белсенді\nойын аймағы' },
          { title: 'Шығармашылық\nжәне демалыс орны' },
        ],
      },
      location: {
        title: 'Ақтаудың 40-шы шағын ауданы\nПрезидент паркінің жанында',
        cards: [
          { title: 'Президент паркі' },
          { title: 'Ақтаудың 40-шы микрорайоны' },
          { title: 'Ауданның дамыған инфрақұрылымы' },
        ],
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
        note: '«MURA» тұрғын үй кешенінде тұрғындар мен қонақтарға арналған жер үсті паркинг бар. Паркингтің жалпы сыйымдылығы — 323 машина орны.',
      },
      boxroom: {
        title: 'Сақтауға арналған қойма бөлмелері',
        text: '«MURA» тұрғын үй кешенінде сақтауға арналған қосымша кеңістіктер қарастырылған: әр подъездде 3,2 м² кладовая, сондай-ақ кешеннің жертөлесінде жеке қойма бөлмелері бар.',
        items: [
          {
            title: 'Автономды резервуар',
            text: '360 м³ су қоры — сумен жабдықтау үзілген жағдайда тұрғындарды сумен қамтамасыз ететін резервтік жүйе.',
          },
          {
            title: 'Резервтік генератор',
            text: 'Дизель-генератор — сыртқы электр желісінде ақау болған жағдайда кешеннің негізгі жүйелерінің үздіксіз жұмысын қамтамасыз етеді.',
          },
        ],
      },
      floorPlans: {
        title: 'MURA жоспарлары',
        text: 'Тұрғын үй кешенінде ыңғайлы әрі кең жоспарланған бір, екі, үш және төрт бөлмелі пәтерлер ұсынылған. Мұндай алуандық жалғыз адамға да, жұпқа да, үлкен отбасына да қолайлы нұсқаны таңдауға мүмкіндік береді.',
      },
      consult: {
        title: '«MURA» ТҚ ТУРАЛЫ ТОЛЫҚ АҚПАРАТ АЛҒЫМ КЕЛЕДІ',
        subtitle: 'Менеджер сізбен байланысып, MURA тұрғын үй кешені туралы барлық сұрақтарыңызға жауап береді.',
        address: 'Ақтау қ., 40 шағын аудан',
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
      kids: {
        gallery: [
          { title: 'Safe\nmaterials' },
          { title: 'Active play\narea' },
          { title: 'Creative\nand rest space' },
        ],
      },
      location: {
        title: 'District 40 of Aktau\nnext to Presidential Park',
        cards: [
          { title: 'Presidential Park' },
          { title: 'District 40, Aktau' },
          { title: 'Well-developed neighbourhood infrastructure' },
        ],
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
      floorPlans: {
        title: 'MURA floor plans',
        text: 'The complex offers one-, two-, three- and four-room apartments with convenient and spacious layouts. This variety makes it possible to choose an option that suits a single person or a couple as well as a large family.',
      },
      consult: {
        title: 'I WANT DETAILED INFORMATION ABOUT MURA RESIDENTIAL COMPLEX',
        subtitle: 'A manager will contact you and answer all your questions about the MURA complex.',
        address: 'Aktau, District 40',
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
        text: 'Central Park — жеке өмірдің үйлесімін, талғамды сәулет пен ойластырылған қалалық өмір салтын бағалайтындарға арналған жоба.',
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
        title: 'Ақтаудың перспективті 40-шы шағын ауданы — Тұңғыш Президент саябағына жақын.',
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
        title: 'Ауа райына төзімді, түсін жоғалтпайтын және ұзақ жылдар бойы бастапқы қалпын сақтайтын материалдар.',
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
        title: 'Үздіксіз жұмыс істейтін тұрғын үй кешені',
        points: [
          '2 дизелді генератор подъезд пен пәтерлерде жарық пен электр энергиясын қамтамасыз етеді',
          'Сумен жабдықтау үзіліп қалған жағдайда тұрғындардың қажеттілігін қамтамасыз ету үшін 350 м³ су қоры қарастырылған.',
          '50 м³ тек ландшафтты суару үшін бөлінген',
        ],
      },
      yard: {
        title: 'Central Park аумағы бөгде адамдар үшін жабық, ал аулаға автокөліктің кіруіне жол берілмейді.',
        text: 'Аула көлік қозғалысы мен артық шудан оқшауланып, демалыс пен жайлы қарым-қатынасқа арналған қауіпсіз кеңістік ретінде жобаланған.',
        features: [
          'Ересектерге арналған демалыс аймақтары',
          'Серуендеу жолдары мен жайлы орындықтар',
          'Балаларға арналған эко-ойын алаңдары',
          'Заманауи жарықтандыру және көгалдандыру',
          'Тыныш әрі жайлы акустикалық орта',
        ],
      },
      playground: {
        title: 'Балалар алаңы',
        text: 'Балалар үшін Buglo компаниясының ұзақ мерзімді және қауіпсіз материалдардан жасалған заманауи ойын алаңы орнатылған.',
      },
      kids: {
        roomLabel: 'Buglo Workout аймағы',
        roomTitle: 'Далада жаттығуға арналған жабдық',
        roomText:
          'Buglo компаниясының Workout аймағы— күшті, төзімділікті және дене қимылының үйлесімділігін дамытуға арналған заманауи ашық аспан астындағы жаттығу кеңістігі.',
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
          { title: '2 киіз үй', text: 'Дәстүр мен мәдениетке деген ұқыпты қатынасты символдайтын демалысқа бейімделген киіз үйлер' },
        ],
      },
      hall: {
        title: 'Central Park-тың әрбір подъезді кең дизайнерлік холлдан басталады',
        text1: 'Авторлық безендіру, ойластырылған жарықтандыру, сәндік элементтер мен сапалы жиһаз әрбір подъездде ерекше атмосфера тудырады.',
        text2: '',
        gallery: [
          { title: 'Дизайнерлік холл' },
          { title: 'Лифт холлы' },
          { title: 'Күту аймағы' },
        ],
        features: [
          'Авторлық дизайнерлік безендіру',
          'Ойластырылған жарықтандыру',
          'Сәндік элементтер мен жиһаз',
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
        subtitle:
          'Менеджер сізбен байланысып, қазіргі таңда қолжетімді коммерциялық нысандар туралы толық ақпаратпен таныстырады.',
        address: 'Ақтау қ., 40 шағын аудан, 2-үй',
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
        roomLabel: 'Buglo Workout Zone',
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
        text2: '',
        gallery: [
          { title: 'Designer lobby' },
          { title: 'Lift lobby' },
          { title: 'Waiting area' },
        ],
        features: [
          'Original designer finishing',
          'Thoughtful lighting',
          'Decorative elements and furniture',
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
        subtitle: 'A manager will contact you with full details on currently available commercial premises.',
        address: 'Aktau, District 40, Building 2',
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
        if (!Object.prototype.hasOwnProperty.call(val, arrKey)) continue;
        if (!Array.isArray(val[arrKey])) {
          merged[arrKey] = val[arrKey];
          continue;
        }
        // Пустой массив = явное удаление (например, gallery: []).
        if (val[arrKey].length === 0 || !base[key][arrKey]) {
          merged[arrKey] = val[arrKey];
          continue;
        }
        merged[arrKey] = base[key][arrKey].map((orig, i) => {
          const ov = val[arrKey][i];
          if (!ov) return orig;
          return typeof ov === 'object' ? { ...orig, ...ov } : ov;
        });
      }
      if (val.quiz && base[key].quiz) {
        merged.quiz = { ...base[key].quiz };
        for (const quizKey of ['rooms', 'floors', 'layouts', 'payments']) {
          if (val.quiz[quizKey] && base[key].quiz[quizKey]) {
            merged.quiz[quizKey] = base[key].quiz[quizKey].map((orig, i) => {
              const ov = val.quiz[quizKey][i];
              if (!ov) return orig;
              return typeof ov === 'object' ? { ...orig, ...ov } : ov;
            });
          }
        }
      }
      result[key] = merged;
    } else {
      result[key] = val;
    }
  }
  return result;
}
