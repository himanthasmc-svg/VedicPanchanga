import { BookItem, MantraItem } from '../types';

export const INITIAL_MANTRAS: MantraItem[] = [
  {
    id: 'gayatri',
    title: 'Gayatri Mantra (ಗಾಯತ್ರೀ ಮಂತ್ರ)',
    description: 'The supreme Vedic invocation of Savitr (solar deity of illumination) for spiritual awakening and intellect.',
    url: 'https://archive.org/details/GayatriMantraCompleteRecitation',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    category: 'Vedic Sukta'
  },
  {
    id: 'maha-mrityunjaya',
    title: 'Maha Mrityunjaya Mantra (ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ)',
    description: 'The great death-conquering Rigvedic mantra of Lord Shiva for healing, longevity, and liberation.',
    url: 'https://archive.org/details/MahaMrityunjayaChant108',
    imageUrl: 'https://images.unsplash.com/photo-1609137144820-2b9a7c36a6e8?auto=format&fit=crop&w=600&q=80',
    category: 'Shiva Stotra'
  },
  {
    id: 'sri-suktam',
    title: 'Sri Suktam (ಶ್ರೀ ಸೂಕ್ತಂ)',
    description: 'Ancient Rigvedic hymn invoking Goddess Mahalakshmi for prosperity, wisdom, and cosmic auspiciousness.',
    url: 'https://archive.org/details/SriSuktamVedicRecitation',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    category: 'Vedic Sukta'
  },
  {
    id: 'purusha-suktam',
    title: 'Purusha Suktam (ಪುರುಷ ಸೂಕ್ತಂ)',
    description: 'Cosmic hymn from Rigveda describing the creation of the cosmos and the divine omnipresent Purusha.',
    url: 'https://archive.org/details/PurushaSuktamComplete',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    category: 'Vedic Sukta'
  },
  {
    id: 'vishnu-sahasranama',
    title: 'Sri Vishnu Sahasranama Stotram (ವಿಷ್ಣು ಸಹಸ್ರನಾಮ)',
    description: 'The thousand sacred names of Bhagavan Maha Vishnu imparted by Bhishma Pitamaha to Yudhishthira.',
    url: 'https://archive.org/details/VishnuSahasranamamStotram',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    category: 'Sahasranama'
  },
  {
    id: 'shiva-tandava',
    title: 'Shiva Tandava Stotram (ಶಿವ ತಾಂಡವ ಸ್ತೋತ್ರಂ)',
    description: 'Dynamic poetic ode praising Lord Shiva’s ecstatic cosmic dance composed by Ravana.',
    url: 'https://archive.org/details/ShivaTandavaStotramClassical',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80',
    category: 'Shiva Stotra'
  },
  {
    id: 'durga-saptashati',
    title: 'Devi Mahatmyam / Durga Saptashati (ಶ್ರೀ ಚಂಡೀ ಸಪ್ತಶತಿ)',
    description: 'The celebrated 700 verses from Markandeya Purana glorifying the triumphs of Divine Mother Durga.',
    url: 'https://archive.org/details/DurgaSaptashatiSanskritRecitation',
    imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
    category: 'Devi Stotra'
  },
  {
    id: 'hanuman-chalisa',
    title: 'Sri Hanuman Chalisa (ಶ್ರೀ ಹನುಮಾನ್ ಚಾಲೀಸಾ)',
    description: 'Forty verses of devotion and valor composed by Goswami Tulsidas invoking Anjaneya.',
    url: 'https://archive.org/details/HanumanChalisaOriginalAvadhi',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
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
