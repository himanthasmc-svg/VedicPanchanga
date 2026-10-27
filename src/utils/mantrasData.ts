import { BookItem, MantraItem } from '../types';

export const BLOG_HOMEPAGE_URL = 'https://www.himanthacmm.com/myblog';

// High-fidelity Vedic background SVGs encoded as Data URIs for offline/online instantaneous display
const createVedicCardBg = (gradientFrom: string, gradientTo: string, glyph: string, accentColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientFrom}" />
        <stop offset="100%" stop-color="${gradientTo}" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1.5" fill="${accentColor}" opacity="0.25" />
      </pattern>
    </defs>
    <rect width="600" height="340" fill="url(#bg)" />
    <rect width="600" height="340" fill="url(#grid)" />
    <circle cx="300" cy="170" r="110" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.3" stroke-dasharray="6 4" />
    <circle cx="300" cy="170" r="85" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.4" />
    <text x="300" y="195" font-size="76" font-family="serif" text-anchor="middle" fill="${accentColor}" opacity="0.92">${glyph}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const HCMM_BLOG_MANTRAS: MantraItem[] = [
  {
    id: 'hcmm-nityapooja-sanskruth',
    title: 'NityaPooja Sanskruth (ನಿತ್ಯಪೂಜಾ ಸಂಸ್ಕೃತ & ಶ್ರೀ ರುದ್ರ)',
    description: 'Complete Sanskrit Nitya Pooja Vidhana, Sri Rudram chanting, and daily Vedic upasana vidhi from Sri Himanth CMM blog.',
    url: 'https://www.himanthacmm.com/myblog/nityapoojaandrudra',
    imageUrl: createVedicCardBg('#450a0a', '#7f1d1d', '🕉️', '#fde047'),
    category: 'Nitya Pooja'
  },
  {
    id: 'hcmm-nitya-pooja-vidhi',
    title: 'Nitya Pooja Vidhi (ದೈನಂದಿನ ನಿತ್ಯ ಪೂಜಾ ವಿಧಾನ)',
    description: 'Detailed step-by-step daily devotional pooja procedure, deepa prajwalana, sankalpa, dhyana, and naivedya.',
    url: 'https://www.himanthacmm.com/myblog/nityapoojavidhi',
    imageUrl: createVedicCardBg('#431407', '#7c2d12', '🪔', '#fdba74'),
    category: 'Nitya Pooja'
  },
  {
    id: 'hcmm-sankalpa-vidhi',
    title: 'Sankalpa Vidhi (ವೇದೋಕ್ತ ಶುಭ ಸಂಕಲ್ಪ ವಿಧಾನ)',
    description: 'Comprehensive guidance on taking authentic Vedic Sankalpa with samvatsara, ayana, masa, and astronomical tithi.',
    url: 'https://www.himanthacmm.com/sanklpa',
    imageUrl: createVedicCardBg('#1c1917', '#44403c', '📜', '#fef08a'),
    category: 'Sankalpa Vidhi'
  },
  {
    id: 'hcmm-ganesha-pooja',
    title: 'Shree Ganesha Pooja (ಶ್ರೀ ಮಹಾಗಣಪತಿ ಪೂಜಾ ವಿಧಾನ)',
    description: 'Sacred Ganesha invocation, Modaka naivedya, 21 Durva offering, and Vighnaharta stotras for auspicious beginnings.',
    url: 'https://www.himanthacmm.com/myblog/shreeganeshpoojavidhi',
    imageUrl: createVedicCardBg('#7c2d12', '#991b1b', '🐘', '#fef08a'),
    category: 'Vrata & Pooja'
  },
  {
    id: 'hcmm-varamahalakshmi',
    title: 'Vara Mahalakshmi Vrata (ಶ್ರೀ ವರಮಹಾಲಕ್ಷ್ಮೀ ವ್ರತ ವಿಧಾನ)',
    description: 'Complete Sravana Shukla Vara Mahalakshmi vrata katha, kalasha sthapana, and doragranthi pooja for wealth and prosperity.',
    url: 'https://www.himanthacmm.com/mahalakshmivrata',
    imageUrl: createVedicCardBg('#701a75', '#831843', '🪷', '#fbcfe8'),
    category: 'Vrata & Pooja'
  },
  {
    id: 'hcmm-mangalagauri',
    title: 'Mangalagauri Vrata (ಶ್ರೀ ಮಂಗಳಗೌರೀ ವ್ರತ ವಿಧಾನ)',
    description: 'Sravana Tuesday Mangalagauri vrata rituals for marital bliss, sowbhagya, and family prosperity.',
    url: 'https://www.himanthacmm.com/mangalgaurivrata',
    imageUrl: createVedicCardBg('#831843', '#9f1239', '🌺', '#fbcfe8'),
    category: 'Vrata & Pooja'
  },
  {
    id: 'hcmm-shiva-pooja',
    title: 'Shiva Pooja Vidhi (ಶ್ರೀ ಪರಮೇಶ್ವರ ಲಿಂಗ ಪೂಜಾ ವಿಧಾನ)',
    description: 'Shiva Linga abhisheka with panchamrita, Bilva patra archana, and Mahamrityunjaya japa vidhana for spiritual liberation.',
    url: 'https://www.himanthacmm.com/shivapoojavidhi',
    imageUrl: createVedicCardBg('#172554', '#1e3a8a', '🔱', '#93c5fd'),
    category: 'Shiva Stotra'
  },
  {
    id: 'hcmm-devi-purana',
    title: 'Devi Purana (ಶ್ರೀ ದೇವಿ ಪುರಾಣ & ದೇವೀ ಮಹಿಮೆ)',
    description: 'Cosmic triumphs of Divine Mother Mahashakti, Chandi parayana, and Sri Devi Mahatmya reflections.',
    url: 'https://www.himanthacmm.com/devipurana',
    imageUrl: createVedicCardBg('#4a044e', '#701a75', '👑', '#f0abfc'),
    category: 'Puranas & Stotras'
  },
  {
    id: 'hcmm-navadurga',
    title: 'Navadurga (ಶ್ರೀ ನವದುರ್ಗಾ ಧ್ಯಾನ & ನವರಾತ್ರಿ ಆರಾಧನೆ)',
    description: 'Detailed 9 divine forms of Goddess Durga worshipped during Sharannavaratri from Shailaputri to Siddhidatri.',
    url: 'https://www.himanthacmm.com/navadurga',
    imageUrl: createVedicCardBg('#881337', '#9f1239', '🦁', '#fecdd3'),
    category: 'Devi Stotra'
  },
  {
    id: 'hcmm-rudraadhyay',
    title: 'Shree Rudraadhyay (ಶ್ರೀ ನಮಕ-ಚಮಕ ರುದ್ರಾಧ್ಯಾಯ)',
    description: 'Sacred Yajurvedic Namaka and Chamaka Prashnas of Sri Rudradhyaya for cosmic peace and supreme healing.',
    url: 'https://www.himanthacmm.com/myblog/shreerudraadhyaaya',
    imageUrl: createVedicCardBg('#0f172a', '#1e293b', '🔥', '#fed7aa'),
    category: 'Vedic Sukta'
  },
  {
    id: 'hcmm-nagar-panchami',
    title: 'Nagar Panchami Pooja (ಶ್ರೀ ನಾಗದೇವತಾ ಪೂಜಾ ವಿಧಾನ)',
    description: 'Shravana Shukla Panchami Nagadevata pooja, halu-eredu rituals, sarpa dosha shanti, and sacred protective mantras.',
    url: 'https://www.himanthacmm.com/nagarapamchami',
    imageUrl: createVedicCardBg('#064e3b', '#065f46', '🐍', '#a7f3d0'),
    category: 'Vrata & Pooja'
  },
  {
    id: 'hcmm-navagraha-pooja',
    title: 'Navagraha Pooja (ನವಗ್ರಹ ಶಾಂತಿ & ಪೂಜಾ ವಿಧಾನ)',
    description: 'Nine planetary deities propitiation, Beeja mantras, dhanya grains, and samidha homa vidhana for planetary harmony.',
    url: 'https://www.himanthacmm.com/myblog/navagraha',
    imageUrl: createVedicCardBg('#14532d', '#166534', '☀️', '#bbf7d0'),
    category: 'Navagraha'
  },
  {
    id: 'hcmm-pitru-tarpana',
    title: 'Pitru Tarpana (ಪಿತೃ ತರ್ಪಣ & ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ ವಿಧಿ)',
    description: 'Vedic tilodaka tarpana procedures, pitru gayatri, and Mahalaya paksha shraddha guidelines for ancestral blessings.',
    url: 'https://www.himanthacmm.com/tarpanavidhi',
    imageUrl: createVedicCardBg('#292524', '#44403c', '🌾', '#e7e5e4'),
    category: 'Pitru Vidhi'
  },
  {
    id: 'hcmm-small-stories',
    title: 'Appa Helida Sanna Kathegalu (ಅಪ್ಪ ಹೇಳಿದ ಸಣ್ಣ ಕಥೆಗಳು)',
    description: 'Inspiring moral, spiritual, and dharmic short stories illustrating eternal truths of Sanatana Dharma.',
    url: 'https://www.himanthacmm.com/smallstories',
    imageUrl: createVedicCardBg('#312e81', '#3730a3', '📖', '#c7d2fe'),
    category: 'Vedic Stories'
  },
  {
    id: 'hcmm-panchanga-blog',
    title: 'Panchanga (ಜ್ಯೋತಿಷ್ಯ ಪಂಚಾಂಗ ಜ್ಞಾನ & ಗಣಿತ)',
    description: 'Astrological significance of Tithi, Vara, Nakshatra, Yoga, and Karana explained from Sri Himanth CMM blog.',
    url: 'https://www.himanthacmm.com/myblog/panchang',
    imageUrl: createVedicCardBg('#78350f', '#92400e', '🌕', '#fde68a'),
    category: 'Panchanga'
  }
];

export const INITIAL_MANTRAS: MantraItem[] = [
  ...HCMM_BLOG_MANTRAS,
  {
    id: 'gayatri',
    title: 'Gayatri Mantra (ಗಾಯತ್ರೀ ಮಂತ್ರ)',
    description: 'The supreme Vedic invocation of Savitr (solar deity of illumination) for spiritual awakening and intellect.',
    url: 'https://archive.org/details/GayatriMantraCompleteRecitation',
    imageUrl: createVedicCardBg('#7c2d12', '#b45309', '☀️', '#fef08a'),
    category: 'Vedic Sukta'
  },
  {
    id: 'maha-mrityunjaya',
    title: 'Maha Mrityunjaya Mantra (ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ)',
    description: 'The great death-conquering Rigvedic mantra of Lord Shiva for healing, longevity, and liberation.',
    url: 'https://archive.org/details/MahaMrityunjayaChant108',
    imageUrl: createVedicCardBg('#1e3a8a', '#1e40af', '🔱', '#93c5fd'),
    category: 'Shiva Stotra'
  },
  {
    id: 'sri-suktam',
    title: 'Sri Suktam (ಶ್ರೀ ಸೂಕ್ತಂ)',
    description: 'Ancient Rigvedic hymn invoking Goddess Mahalakshmi for prosperity, wisdom, and cosmic auspiciousness.',
    url: 'https://archive.org/details/SriSuktamVedicRecitation',
    imageUrl: createVedicCardBg('#701a75', '#86198f', '🪷', '#f5d0fe'),
    category: 'Vedic Sukta'
  },
  {
    id: 'purusha-suktam',
    title: 'Purusha Suktam (ಪುರುಷ ಸೂಕ್ತಂ)',
    description: 'Cosmic hymn from Rigveda describing the creation of the cosmos and the divine omnipresent Purusha.',
    url: 'https://archive.org/details/PurushaSuktamComplete',
    imageUrl: createVedicCardBg('#312e81', '#3730a3', '🌌', '#c7d2fe'),
    category: 'Vedic Sukta'
  },
  {
    id: 'vishnu-sahasranama',
    title: 'Sri Vishnu Sahasranama Stotram (ವಿಷ್ಣು ಸಹಸ್ರನಾಮ)',
    description: 'The thousand sacred names of Bhagavan Maha Vishnu imparted by Bhishma Pitamaha to Yudhishthira.',
    url: 'https://archive.org/details/VishnuSahasranamamStotram',
    imageUrl: createVedicCardBg('#14532d', '#15803d', '📿', '#bbf7d0'),
    category: 'Sahasranama'
  },
  {
    id: 'shiva-tandava',
    title: 'Shiva Tandava Stotram (ಶಿವ ತಾಂಡವ ಸ್ತೋತ್ರಂ)',
    description: 'Dynamic poetic ode praising Lord Shiva’s ecstatic cosmic dance composed by Ravana.',
    url: 'https://archive.org/details/ShivaTandavaStotramClassical',
    imageUrl: createVedicCardBg('#111827', '#1f2937', '🌀', '#e5e7eb'),
    category: 'Shiva Stotra'
  },
  {
    id: 'durga-saptashati',
    title: 'Devi Mahatmyam / Durga Saptashati (ಶ್ರೀ ಚಂಡೀ ಸಪ್ತಶತಿ)',
    description: 'The celebrated 700 verses from Markandeya Purana glorifying the triumphs of Divine Mother Durga.',
    url: 'https://archive.org/details/DurgaSaptashatiSanskritRecitation',
    imageUrl: createVedicCardBg('#881337', '#9f1239', '🦁', '#fecdd3'),
    category: 'Devi Stotra'
  },
  {
    id: 'hanuman-chalisa',
    title: 'Sri Hanuman Chalisa (ಶ್ರೀ ಹನುಮಾನ್ ಚಾಲೀಸಾ)',
    description: 'Forty verses of devotion and valor composed by Goswami Tulsidas invoking Anjaneya.',
    url: 'https://archive.org/details/HanumanChalisaOriginalAvadhi',
    imageUrl: createVedicCardBg('#7c2d12', '#c2410c', '🚩', '#ffedd5'),
    category: 'Devotional Hymn'
  }
];

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title: 'Srimad Devi Bhagavatam & Mahatmyam',
    author: 'Veda Vyasa',
    url: 'https://archive.org/details/DeviBhagavataPuranaEnglishTranslation',
    description: 'Comprehensive scripture on the cosmic manifestations and devotional glory of the Divine Mother.',
    category: 'Puranas'
  },
  {
    id: 'book-2',
    title: 'Brihat Parashara Hora Shastra',
    author: 'Maharshi Parashara',
    url: 'https://archive.org/details/BrihatParasaraHoraSastraSanEng2Vols',
    description: 'The foundational classic textbook of Vedic Astrology and Lagna Kundali interpretation.',
    category: 'Jyotisha Shastra'
  },
  {
    id: 'book-3',
    title: 'Surya Siddhanta: A Text-book of Hindu Astronomy',
    author: 'E. Burgess & W. D. Whitney',
    url: 'https://archive.org/details/SuryaSiddhantaBurgess',
    description: 'Ancient astronomical treatise detailing planetary revolutions, equinoxes, and panchang calculation.',
    category: 'Astronomical Treatise'
  },
  {
    id: 'book-4',
    title: 'Panchapeetha Siddhanta & Virashaiva Darshana',
    author: 'Sri Shivacharya Vidwans',
    url: 'https://archive.org/details/ShriSiddhantaShikhamani',
    description: 'Sacred traditions, Gotra Pravara, and philosophical lineage of the five holy Peethas.',
    category: 'Philosophical Text'
  }
];
