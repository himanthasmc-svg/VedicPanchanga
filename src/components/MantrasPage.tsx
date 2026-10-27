import React, { useState, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  KeyRound, 
  Upload, 
  Copy, 
  Check, 
  Play, 
  Music, 
  Image as ImageIcon, 
  Compass, 
  FileCode, 
  Search, 
  X, 
  Filter,
  RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { BookItem, Language, MantraItem } from '../types';
import { BLOG_HOMEPAGE_URL, HCMM_BLOG_MANTRAS } from '../utils/mantrasData';
import { getPanchangaForDate, CITIES } from '../utils/panchanga';

interface MantrasPageProps {
  currentLang: Language;
  onBackToCalendar: () => void;
  hcmmLogoUrl: string;
  onOpenHcmmAdmin: () => void;
  mantrasList: MantraItem[];
  onAddMantra: (mantra: MantraItem) => void;
  onDeleteMantra: (id: string) => void;
  onSetMantrasList?: (list: MantraItem[]) => void;
  booksList: BookItem[];
  onOpenCodeCopyModal: () => void;
}

export const MantrasPage: React.FC<MantrasPageProps> = ({
  currentLang,
  onBackToCalendar,
  hcmmLogoUrl,
  onOpenHcmmAdmin,
  mantrasList,
  onAddMantra,
  onDeleteMantra,
  onSetMantrasList,
  booksList,
  onOpenCodeCopyModal
}) => {
  // Add new mantra state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Vedic Mantra');
  const [customImage, setCustomImage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected image input mode & individual card picture customization
  const [imageInputMode, setImageInputMode] = useState<'system' | 'web'>('system');
  const [editingMantraForImage, setEditingMantraForImage] = useState<MantraItem | null>(null);
  const [cardImageInput, setCardImageInput] = useState('');
  const cardFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.85);
              setCustomImage(compressed);
            } else {
              setCustomImage(reader.result as string);
            }
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    const clean = (s: string) =>
      (s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\u0C80-\u0CFF\u0900-\u097F]/g, '');

    const enteredClean = clean(passwordInput.trim());
    if (!enteredClean) {
      setPasswordError(
        currentLang === 'kn' ? 'ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.' : 'Please enter the password.'
      );
      return;
    }

    const todayPanch = getPanchangaForDate(new Date(), CITIES[0]);
    const masaEn = clean(todayPanch.masa?.en || '');
    const nakEn = clean((todayPanch.nakshatra?.en || '').split('(')[0]);
    const masaKn = clean(todayPanch.masa?.kn || '');
    const nakKn = clean((todayPanch.nakshatra?.kn || '').split('(')[0]);
    const masaHi = clean(todayPanch.masa?.hi || '');
    const nakHi = clean((todayPanch.nakshatra?.hi || '').split('(')[0]);

    const trimTrailingA = (val: string) => (val.endsWith('a') ? val.slice(0, -1) : val);
    const validSet = new Set<string>();

    if (masaEn && nakEn) {
      validSet.add(masaEn + nakEn);
      validSet.add(trimTrailingA(masaEn) + nakEn);
      validSet.add(masaEn + trimTrailingA(nakEn));
      validSet.add(trimTrailingA(masaEn) + trimTrailingA(nakEn));
    }
    if (masaKn && nakKn) validSet.add(masaKn + nakKn);
    if (masaHi && nakHi) validSet.add(masaHi + nakHi);
    if (nakEn && masaEn) validSet.add(nakEn + masaEn);
    if (nakKn && masaKn) validSet.add(nakKn + masaKn);
    if (nakHi && masaHi) validSet.add(nakHi + masaHi);

    validSet.add('hcmm');
    const savedPass = clean(localStorage.getItem('hcmm_user_password') || 'HCMM');
    if (savedPass) validSet.add(savedPass);

    if (validSet.has(enteredClean)) {
      setIsUnlocked(true);
      setShowAddForm(true);
      setPasswordInput('');
    } else {
      setPasswordError(
        currentLang === 'kn'
          ? 'ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್! ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.'
          : currentLang === 'hi'
          ? 'गलत पासवर्ड! कृपया पुनः प्रयास करें।'
          : 'Incorrect password! Please try again.'
      );
    }
  };

  // Blog sync state
  const [isSyncingBlog, setIsSyncingBlog] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const handleSyncFromBlog = async () => {
    setIsSyncingBlog(true);
    setSyncStatusMsg('');
    try {
      const res = await fetch('/api/sync-blog-mantras', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.mantrasList) && data.mantrasList.length > 0) {
          if (onSetMantrasList) {
            onSetMantrasList(data.mantrasList);
          } else {
            for (const item of data.mantrasList) {
              if (!mantrasList.some(m => m.url === item.url || m.id === item.id)) {
                onAddMantra(item);
              }
            }
          }
          localStorage.setItem('hcmm_mantras', JSON.stringify(data.mantrasList));
          setSyncStatusMsg(currentLang === 'kn' ? 'ಬ್ಲಾಗ್‌ನೊಂದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'Successfully synchronized with Sri Himanth CMM blog!');
        }
      } else {
        const existingUrls = new Set(mantrasList.map(m => m.url));
        const missing = HCMM_BLOG_MANTRAS.filter(m => !existingUrls.has(m.url));
        if (onSetMantrasList) {
          onSetMantrasList([...missing, ...mantrasList]);
        } else {
          missing.forEach(m => onAddMantra(m));
        }
        setSyncStatusMsg(currentLang === 'kn' ? 'ಸ್ಥಳೀಯ ಬ್ಲಾಗ್ ಮಂತ್ರಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Updated blog mantras.');
      }
    } catch (err) {
      const existingUrls = new Set(mantrasList.map(m => m.url));
      const missing = HCMM_BLOG_MANTRAS.filter(m => !existingUrls.has(m.url));
      if (onSetMantrasList) {
        onSetMantrasList([...missing, ...mantrasList]);
      } else {
        missing.forEach(m => onAddMantra(m));
      }
      setSyncStatusMsg(currentLang === 'kn' ? 'ಸ್ಥಳೀಯ ಬ್ಲಾಗ್ ಮಂತ್ರಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Updated blog mantras.');
    } finally {
      setIsSyncingBlog(false);
      setTimeout(() => setSyncStatusMsg(''), 4000);
    }
  };

  // Search and Category Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: { en: 'All Items', kn: 'ಎಲ್ಲವೂ', hi: 'सभी' } },
    { id: 'Nitya Pooja', label: { en: 'Nitya Pooja', kn: 'ನಿತ್ಯ ಪೂಜೆ', hi: 'नित्य पूजा' } },
    { id: 'Vrata & Pooja', label: { en: 'Vrata & Pooja', kn: 'ವ್ರತ & ಪೂಜೆ', hi: 'व्रत व पूजा' } },
    { id: 'Sankalpa Vidhi', label: { en: 'Sankalpa', kn: 'ಸಂಕಲ್ಪ', hi: 'संकल्प विधि' } },
    { id: 'Shiva Stotra', label: { en: 'Shiva Stotra', kn: 'ಶಿವ ಸ್ತೋತ್ರ', hi: 'शिव स्तोत्र' } },
    { id: 'Devi Stotra', label: { en: 'Devi Stotra', kn: 'ದೇವಿ ಸ್ತೋತ್ರ', hi: 'देवी स्तोत्र' } },
    { id: 'Vedic Sukta', label: { en: 'Vedic Suktas', kn: 'ವೇದ ಸೂಕ್ತ', hi: 'वैदिक सूक्त' } },
    { id: 'Puranas & Stotras', label: { en: 'Puranas', kn: 'ಪುರಾಣಗಳು', hi: 'पुराण' } },
    { id: 'Navagraha', label: { en: 'Navagraha', kn: 'ನವಗ್ರಹ', hi: 'नवग्रह' } },
    { id: 'Pitru Vidhi', label: { en: 'Pitru Vidhi', kn: 'ಪಿತೃ ವಿಧಿ', hi: 'पितृ विधि' } },
    { id: 'Vedic Stories', label: { en: 'Kathegalu', kn: 'ಸಣ್ಣ ಕಥೆಗಳು', hi: 'कथाएं' } },
    { id: 'Panchanga', label: { en: 'Panchanga', kn: 'ಪಂಚಾಂಗ ಜ್ಞಾನ', hi: 'पंचांग' } },
    { id: 'Sahasranama', label: { en: 'Sahasranama', kn: 'ಸಹಸ್ರನಾಮ', hi: 'सहस्रनाम' } },
    { id: 'Devotional Hymn', label: { en: 'Devotional Hymns', kn: 'ಭಕ್ತಿ ಗೀತೆ', hi: 'भक्ति भजन' } }
  ];

  // Filtered Mantras based on search query and category
  const filteredMantras = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mantrasList.filter((m) => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesQuery = !q || 
        m.title.toLowerCase().includes(q) || 
        m.category.toLowerCase().includes(q) || 
        m.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [mantrasList, searchQuery, selectedCategory]);

  // Filtered Books based on search query and category
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return booksList.filter((b) => {
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      const matchesQuery = !q || 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [booksList, searchQuery, selectedCategory]);

  const handleAddMantraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    // Use only image provided by user (from system upload or webpage URL), otherwise empty
    const bgImg = customImage.trim();

    const newMantra: MantraItem = {
      id: `mantra-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Sacred hymn link and recitation source.',
      url: newUrl.trim(),
      imageUrl: bgImg,
      category: newCategory,
      isCustom: true,
      addedAt: Date.now()
    };

    onAddMantra(newMantra);

    // Reset
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setCustomImage('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* Top Banner with HCMM Logo & Action Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 shadow-xl border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-4">
            {/* Top HCMM Logo - clickable to prompt password HCMM */}
            <button
              onClick={onOpenHcmmAdmin}
              title="HCMM Creator Portal: Edit books and copy full HTML source code"
              className="group relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              {hcmmLogoUrl ? (
                <img
                  src={hcmmLogoUrl}
                  alt="HCMM Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              ) : (
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex flex-col items-center justify-center text-amber-300 font-extrabold text-sm tracking-tighter">
                  <span className="font-serif text-lg leading-none text-amber-400">HCMM</span>
                  <span className="text-[9px] text-amber-200/80 uppercase">Vedic</span>
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-1 rounded-full ring-2 ring-white dark:ring-stone-900 shadow-md">
                <KeyRound className="w-3.5 h-3.5" />
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-200 font-bold px-2 py-0.5 rounded-sm bg-black/20">
                  SACRED HYMNS & WEBLINKS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-0.5">
                {currentLang === 'kn' ? 'ಮಂತ್ರ ಮಂಜರಿ ಮತ್ತು ಪವಿತ್ರ ಲಿಂಕ್‌ಗಳು' : currentLang === 'hi' ? 'मन्त्र मंजरी एवं पवित्र वेबलिंक' : 'Mantras Library & Sacred Links'}
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
                {currentLang === 'kn'
                  ? 'ನಿಮ್ಮ ಸ್ವಂತ ಮಂತ್ರಗಳ ವೆಬ್‌ಪುಟ ಲಿಂಕ್‌ಗಳನ್ನು ಸೇರಿಸಿ, ಹಿನ್ನೆಲೆ ಚಿತ್ರ ಮತ್ತು ಶೀರ್ಷಿಕೆಯೊಂದಿಗೆ ವೀಕ್ಷಿಸಿ.'
                  : currentLang === 'hi'
                  ? 'अपने मन्त्रों के वेबलिंक जोड़ें, पृष्ठभूमि चित्र और नाम के साथ सहजता से श्रवण करें।'
                  : 'Add your own mantra web links. The system automatically binds preview backgrounds and icons.'}
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-xl bg-white text-stone-900 hover:bg-amber-100 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>
                {currentLang === 'kn' ? '+ ಹೊಸ ಮಂತ್ರ ಲಿಂಕ್ ಸೇರಿಸಿ' : currentLang === 'hi' ? '+ नया मन्त्र लिंक जोड़ें' : '+ Add Mantra Link'}
              </span>
            </button>

            <button
              onClick={onBackToCalendar}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors backdrop-blur-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ' : currentLang === 'hi' ? 'कैलेंडर पर वापस' : 'Back to Calendar'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Official Sri Himanth CMM Blog Banner & Live Synchronizer */}
      <div className="rounded-2xl border-2 border-amber-400/80 dark:border-amber-600/80 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md backdrop-blur-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0 border border-amber-300">
            🪔
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-amber-300 dark:border-stone-700">
                Official Vedic Blog Portal
              </span>
              <a 
                href={BLOG_HOMEPAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>himanthacmm.com/myblog</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h3 className="font-serif font-black text-base sm:text-lg text-amber-950 dark:text-amber-100 mt-0.5">
              {currentLang === 'kn' ? 'ಶ್ರೀ ಹಿಮಂತ ಸಿ.ಎಂ.ಎಂ. ವೇದ ಬ್ಲಾಗ್ ಮತ್ತು ಪವಿತ್ರ ಮಂತ್ರ ಸಂಗ್ರಹ' : currentLang === 'hi' ? 'श्री हिमंत सी.एम.एम. वैदिक ब्लॉग एवं पावन मन्त्र संकलन' : 'Sri Himanth CMM Vedic Blog & Sacred Mantras Portal'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {currentLang === 'kn' 
                ? 'ಬ್ಲಾಗ್‌ನಲ್ಲಿ ನವೀಕರಣಗೊಳ್ಳುವ ಪವಿತ್ರ ಮಂತ್ರಗಳು, ವ್ರತ ಕಥೆಗಳು ಹಾಗೂ ನಿತ್ಯ ಪೂಜಾ ವಿಧಾನಗಳು ಇಲ್ಲಿ ತಕ್ಷಣ ಲಭ್ಯವಾಗುತ್ತವೆ.' 
                : 'Mantras, Vrata Kathas, and Nitya Pooja Vidhis updated on the blog are seamlessly synchronized here.'}
            </p>
            {syncStatusMsg && (
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 animate-pulse">
                ✓ {syncStatusMsg}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleSyncFromBlog}
            disabled={isSyncingBlog}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Fetch and update latest articles from himanthacmm.com/myblog"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingBlog ? 'animate-spin' : ''}`} />
            <span>{isSyncingBlog ? (currentLang === 'kn' ? 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...' : 'Syncing...') : (currentLang === 'kn' ? 'ಬ್ಲಾಗ್‌ನಿಂದ ನವೀಕರಿಸಿ (Sync)' : 'Sync from Blog')}</span>
          </button>

          <a
            href={BLOG_HOMEPAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-amber-600" />
            <span>{currentLang === 'kn' ? 'ಬ್ಲಾಗ್ ಭೇಟಿ ನೀಡಿ →' : 'Visit Blog →'}</span>
          </a>
        </div>
      </div>

      {/* Dynamic Link Input Form (With password protection & full picture selection) */}
      {showAddForm && (
        <div className="rounded-2xl bg-white dark:bg-stone-900 p-6 border-2 border-amber-400 dark:border-amber-600 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {!isUnlocked ? (
            /* Password authorization step */
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif font-bold text-base">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <span>
                    {currentLang === 'kn' ? 'ಮಂತ್ರ ಸೇರಿಸಲು ದೃಢೀಕರಣ' : currentLang === 'hi' ? 'मन्त्र जोड़ने हेतु प्रमाणीकरण' : 'Authentication Required'}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Current Masa & Current Nakshatra Mention on window */}
              {(() => {
                const p = getPanchangaForDate(new Date(), CITIES[0]);
                const masa = p.masa?.[currentLang] || p.masa?.en || '';
                const nak = p.nakshatra?.[currentLang] || p.nakshatra?.en || '';
                return (
                  <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-300 font-bold">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಪಂಚಾಂಗ ವಿವರಗಳು' : 'Current Astronomical Details'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700">
                        <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
                          {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಮಾಸ:' : 'Current Masa:'}
                        </span>
                        <strong className="text-xs font-bold text-amber-950 dark:text-amber-200 font-serif">
                          {masa}
                        </strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700">
                        <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
                          {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ನಕ್ಷತ್ರ:' : 'Current Nakshatra:'}
                        </span>
                        <strong className="text-xs font-bold text-amber-950 dark:text-amber-200 font-serif">
                          {nak}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <p className="text-xs text-stone-500 dark:text-stone-400">
                {currentLang === 'kn'
                  ? 'ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಮಂತ್ರ ಮತ್ತು ಚಿತ್ರ ಸೇರಿಸಲು ಅಧಿಕೃತ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.'
                  : currentLang === 'hi'
                  ? 'वेबसाइट पर मन्त्र एवं चित्र जोड़ने हेतु अधिकृत पासवर्ड दर्ज करें।'
                  : 'Enter administrator password to add mantra links and select pictures.'}
              </p>

              {passwordError && (
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter the password"
                  className="px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 w-56 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Unlock Form
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked Add Form with full picture selection */
            <>
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif font-bold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>
                    {currentLang === 'kn' ? 'ಹೊಸ ಮಂತ್ರದ ಲಿಂಕ್ ಮತ್ತು ಚಿತ್ರ ಆಯ್ಕೆ' : currentLang === 'hi' ? 'नए मन्त्र का वेब लिंक एवं चित्र चयन' : 'Add Mantra Link & Picture'}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMantraSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Mantra Name Space */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {currentLang === 'kn' ? 'ಮಂತ್ರದ ಹೆಸರು (Mantra Name) *' : currentLang === 'hi' ? 'मन्त्र का नाम *' : 'Mantra Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Rudram, Aditya Hridaya Stotra, Mrityunjaya Japa"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Mantra Web Link Space */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {currentLang === 'kn' ? 'ಮಂತ್ರದ ವೆಬ್‌ಲಿಂಕ್ (Mantra Web Link URL) *' : currentLang === 'hi' ? 'मन्त्र का वेब लिंक (URL) *' : 'Mantra Web Link (URL) *'}
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://... (e.g. YouTube, Archive.org, or web page URL)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500 cursor-pointer"
                    >
                      <option value="Vedic Sukta">Vedic Sukta (ವೇದ ಸೂಕ್ತ)</option>
                      <option value="Stotram">Stotram (ಸ್ತೋತ್ರ)</option>
                      <option value="Sahasranama">Sahasranama (ಸಹಸ್ರನಾಮ)</option>
                      <option value="Devi Stotra">Devi Stotra (ದೇವಿ ಸ್ತೋತ್ರ)</option>
                      <option value="Shiva Stotra">Shiva Stotra (ಶಿವ ಸ್ತೋತ್ರ)</option>
                      <option value="Japa & Dhyana">Japa & Dhyana (ಜಪ ಮತ್ತು ಧ್ಯಾನ)</option>
                      <option value="Kavacham">Kavacham (ಕವಚ)</option>
                    </select>
                  </div>

                  {/* Online Synced Notice */}
                  <div className="flex items-center p-3 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                      🌐 <strong>Online Auto-Sync:</strong> This mantra and chosen picture will be saved to your website server and immediately available to visitors on all systems.
                    </span>
                  </div>

                </div>

                {/* Picture Selection Section - Include from System or Webpage */}
                <div className="space-y-3 p-4 rounded-xl border border-amber-300/80 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200 dark:border-stone-700 pb-2.5">
                    <div>
                      <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                        {currentLang === 'kn' ? 'ಚಿತ್ರ ಸೇರಿಸಿ (Include Picture)' : currentLang === 'hi' ? 'चित्र शामिल करें' : 'Include Picture'}
                      </span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {currentLang === 'kn'
                          ? 'ನಿಮ್ಮ ಸಾಧನದಿಂದ ಅಥವಾ ವೆಬ್‌ಪುಟದ ಲಿಂಕ್‌ನಿಂದ ನೈಜ ಚಿತ್ರವನ್ನು ಸೇರಿಸಿ'
                          : 'Include image from your system or webpage, or leave empty for sacred Vedic emblem'}
                      </p>
                    </div>

                    {/* Mode Switcher: System vs Webpage */}
                    <div className="inline-flex rounded-lg border border-amber-300 dark:border-stone-700 p-0.5 bg-white dark:bg-stone-900 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('system')}
                        className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'system'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{currentLang === 'kn' ? 'ಸಾಧನದಿಂದ (System)' : 'From System'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('web')}
                        className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'web'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{currentLang === 'kn' ? 'ವೆಬ್‌ಪುಟದಿಂದ (Webpage)' : 'From Webpage'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: From System / Device */}
                  {imageInputMode === 'system' && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileUpload} 
                        className="sr-only" 
                        id="mantra-photo-upload" 
                      />
                      <label
                        htmlFor="mantra-photo-upload"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95 select-none"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{currentLang === 'kn' ? 'ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್ / ಮೊಬೈಲ್‌ನಿಂದ ಚಿತ್ರ ಆಯ್ಕೆ' : 'Upload Image File from Device'}</span>
                      </label>
                      <span className="text-[11px] text-stone-500">
                        Supports PNG, JPG, WebP. Compressed automatically.
                      </span>
                    </div>
                  )}

                  {/* Mode 2: From Webpage */}
                  {imageInputMode === 'web' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                        {currentLang === 'kn' ? 'ನಿಮ್ಮ ವೆಬ್‌ಪುಟದ ಚಿತ್ರದ URL ಲಿಂಕ್:' : 'Image URL from your webpage or server:'}
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-website.com/images/deity.jpg"
                        value={customImage}
                        onChange={(e) => setCustomImage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                      />
                    </div>
                  )}

                  {/* Selected Image Preview / Clear Button */}
                  {customImage ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-emerald-400 dark:border-emerald-600 shadow-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={customImage}
                          alt="Selected Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-amber-400 shrink-0 shadow-xs"
                        />
                        <div>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Picture Ready</span>
                          </span>
                          <span className="text-[10.5px] text-stone-500 block">
                            Will appear on the mantra card and reading backdrop
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomImage('')}
                        className="px-3 py-1 text-xs text-red-600 hover:text-red-700 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        Remove Picture
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/20 text-stone-600 dark:text-stone-400 text-[11px] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>No picture chosen: A dignified, sacred Vedic emblem with luminous Om glyph will be displayed automatically.</span>
                    </div>
                  )}

                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Description / Significance
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief notes on benefits, chanting count (108 times), or deity..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save to Mantras Page</span>
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      )}

      {/* SEARCH BAR & CATEGORY FILTERS */}
      <div className="rounded-2xl border border-amber-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'kn'
                  ? 'ಮಂತ್ರಗಳು ಅಥವಾ ಗ್ರಂಥಗಳನ್ನು ಶೀರ್ಷಿಕೆ, ಕರ್ತೃ, ಅಥವಾ ವರ್ಗದಿಂದ ಹುಡುಕಿ...'
                  : currentLang === 'hi'
                  ? 'मन्त्र अथवा पुस्तकें शीर्षक, लेखक या श्रेणी से खोजें...'
                  : 'Search mantras or books by title, author, or category...'
              }
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs font-medium focus:outline-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {cat.label[currentLang] || cat.label.en}
              </button>
            ))}
          </div>

        </div>

        {/* Active Filter Indicator */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1.5 border-t border-stone-100 dark:border-stone-800">
            <span>
              {currentLang === 'kn' ? 'ಹುಡುಕಾಟದ ಫಲಿತಾಂಶಗಳು:' : currentLang === 'hi' ? 'खोज परिणाम:' : 'Search results:'}{' '}
              <strong className="text-amber-700 dark:text-amber-400 font-mono">
                {filteredMantras.length} {currentLang === 'kn' ? 'ಮಂತ್ರಗಳು' : 'Mantras'}, {filteredBooks.length} {currentLang === 'kn' ? 'ಗ್ರಂಥಗಳು' : 'Books'}
              </strong>
            </span>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-[11px] text-amber-600 hover:underline font-bold"
            >
              {currentLang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ತೋರಿಸಿ (Reset)' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

      {/* Grid of Mantras with background picture card and icon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {currentLang === 'kn' ? 'ಪವಿತ್ರ ಮಂತ್ರಗಳ ಪಟ್ಟಿ' : currentLang === 'hi' ? 'पवित्र मन्त्र सूची' : 'Curated & Custom Mantras'}
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            {filteredMantras.length} {currentLang === 'kn' ? 'ಮಂತ್ರಗಳು' : 'Items'}
          </span>
        </div>

        {filteredMantras.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-white/50 dark:bg-stone-900/50">
            <Search className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              {currentLang === 'kn' ? 'ಯಾವುದೇ ಮಂತ್ರಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : currentLang === 'hi' ? 'कोई मन्त्र नहीं मिला' : 'No matching mantras found'}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {currentLang === 'kn' ? 'ದಯವಿಟ್ಟು ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ.' : 'Try adjusting your search keyword or selected category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMantras.map((mantra) => (
            <div
              key={mantra.id}
              className="group relative rounded-2xl overflow-hidden border border-amber-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Background Thumbnail Image Banner / Sacred Vedic Emblem */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-950 flex items-center justify-center">
                {mantra.imageUrl ? (
                  <img
                    src={mantra.imageUrl}
                    alt={mantra.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    onError={(e) => {
                      // If custom URL fails, hide broken img and show sacred emblem
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  /* Sacred Vedic Emblem Banner when no image is included */
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-950 to-stone-950 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden">
                    {/* Glowing background mandala glow */}
                    <div className="absolute w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
                    
                    {/* Sacred Om Glyph */}
                    <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 p-0.5 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-300 font-serif font-black text-2xl shadow-inner">
                        ॐ
                      </div>
                    </div>

                    <span className="relative z-10 mt-1.5 text-[9px] font-mono tracking-widest text-amber-300/80 uppercase font-bold">
                      ॥ ಪವಿತ್ರ ಮಂತ್ರ ಮಂಜರಿ ॥
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />
                
                {/* Category & Custom badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-stone-950/85 backdrop-blur-xs text-[10px] font-bold text-amber-300 uppercase tracking-wider border border-amber-400/30">
                    {mantra.category}
                  </span>
                  {mantra.isCustom && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[9px] font-extrabold uppercase shadow-xs">
                      Custom
                    </span>
                  )}
                </div>

                {/* Picture Inclusion Trigger Button on Top Right */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingMantraForImage(mantra);
                    setCardImageInput(mantra.imageUrl || '');
                  }}
                  className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/70 hover:bg-amber-600 text-amber-200 hover:text-white text-[10.5px] font-bold border border-amber-400/40 backdrop-blur-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                  title="Include or change picture from device or webpage"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{mantra.imageUrl ? 'Change Picture' : '+ Add Picture'}</span>
                </button>

                {/* Mantra Title inside thumbnail */}
                <div className="absolute bottom-2.5 left-3 right-3 z-10 pointer-events-none">
                  <h3 className="text-base font-bold font-serif text-white group-hover:text-amber-300 transition-colors drop-shadow-md leading-tight">
                    {mantra.title}
                  </h3>
                </div>
              </div>

              {/* Content Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                  {mantra.description}
                </p>

                {/* Card Bottom: Action Link */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <a
                    href={mantra.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Web Page / Audio</span>
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`Remove "${mantra.title}" from list?`)) {
                        onDeleteMantra(mantra.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove mantra link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Modal to Include / Edit Picture for Any Mantra */}
      {editingMantraForImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditingMantraForImage(null)}
        >
          <div 
            className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-500 shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {currentLang === 'kn' ? 'ಮಂತ್ರಕ್ಕೆ ಚಿತ್ರ ಸೇರಿಸಿ / ಬದಲಾಯಿಸಿ' : 'Include Picture for Mantra'}
                </h3>
              </div>
              <button
                onClick={() => setEditingMantraForImage(null)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif font-bold text-amber-700 dark:text-amber-400">
              {editingMantraForImage.title}
            </p>

            {/* Input from System or Webpage */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  {currentLang === 'kn' ? '೧. ಸಾಧನದಿಂದ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ (Upload from Device):' : '1. Upload Picture File from Device:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={cardFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const maxDim = 800;
                              let width = img.width;
                              let height = img.height;
                              if (width > maxDim || height > maxDim) {
                                if (width > height) {
                                  height = Math.round((height * maxDim) / width);
                                  width = maxDim;
                                } else {
                                  width = Math.round((width * maxDim) / height);
                                  height = maxDim;
                                }
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(img, 0, 0, width, height);
                                setCardImageInput(canvas.toDataURL('image/jpeg', 0.85));
                              } else {
                                setCardImageInput(reader.result as string);
                              }
                            };
                            img.src = reader.result;
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="sr-only"
                    id="card-photo-file-input"
                  />
                  <label
                    htmlFor="card-photo-file-input"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File from System</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  {currentLang === 'kn' ? '೨. ಅಥವಾ ವೆಬ್‌ಪುಟದ ಚಿತ್ರದ URL ಲಿಂಕ್:' : '2. Or Paste Picture URL from your Webpage:'}
                </label>
                <input
                  type="url"
                  value={cardImageInput}
                  onChange={(e) => setCardImageInput(e.target.value)}
                  placeholder="https://your-website.com/images/deity.jpg"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                />
              </div>

              {/* Preview */}
              {cardImageInput ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/60 border border-amber-300 dark:border-stone-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={cardImageInput}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border-2 border-amber-500 shadow-md"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Picture Preview Ready</span>
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Will be stored securely with this mantra
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardImageInput('')}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 text-[11px] text-center">
                  Clearing image will restore the serene Vedic Om banner.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  // Remove picture completely
                  const updated: MantraItem = {
                    ...editingMantraForImage,
                    imageUrl: ''
                  };
                  onAddMantra(updated);
                  setEditingMantraForImage(null);
                }}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg font-bold"
              >
                Remove Picture (Restore Emblem)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMantraForImage(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated: MantraItem = {
                      ...editingMantraForImage,
                      imageUrl: cardImageInput.trim()
                    };
                    onAddMantra(updated);
                    setEditingMantraForImage(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                >
                  Save Picture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Resources / Sacred Books Section */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಪವಿತ್ರ ಗ್ರಂಥಗಳು ಮತ್ತು ಪುಸ್ತಕಗಳ ಲಿಂಕ್‌ಗಳು' : currentLang === 'hi' ? 'पवित्र ग्रन्थ एवं सन्दर्भ पुस्तकें' : 'Sacred Scriptures & Reference Books'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Books and reference materials provided to benefit viewers and devotees.
              </p>
            </div>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-white/40 dark:bg-stone-900/40">
            <p className="text-xs font-semibold text-stone-500">
              {currentLang === 'kn' ? 'ಹುಡುಕಾಟಕ್ಕೆ ಸರಿಹೊಂದುವ ಯಾವುದೇ ಗ್ರಂಥಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No sacred books or resources found matching your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <div 
                key={book.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 flex items-start justify-between gap-3 shadow-2xs hover:border-amber-400 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {book.category}
                  </span>
                  <h4 className="font-bold font-serif text-sm text-stone-900 dark:text-stone-100 mt-0.5">
                    {book.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                    Author / Reference: {book.author}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0 transition-colors"
                  title="Open Book Reference"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation: Back to Calendar Button */}
      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-start">
        <button
          onClick={onBackToCalendar}
          className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ (Back to Calendar)' : currentLang === 'hi' ? 'कैलेंडर पर वापस (Back to Calendar)' : 'Back to Calendar'}
          </span>
        </button>
      </div>

    </div>
  );
};
