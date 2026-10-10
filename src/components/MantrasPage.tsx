import React, { useState, useMemo } from 'react';
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
  Filter
} from 'lucide-react';
import { BookItem, Language, MantraItem } from '../types';

interface MantrasPageProps {
  currentLang: Language;
  onBackToCalendar: () => void;
  hcmmLogoUrl: string;
  onOpenHcmmAdmin: () => void;
  mantrasList: MantraItem[];
  onAddMantra: (mantra: MantraItem) => void;
  onDeleteMantra: (id: string) => void;
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

  // Search and Category Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: { en: 'All Items', kn: 'ಎಲ್ಲವೂ', hi: 'सभी' } },
    { id: 'Vedic Mantra', label: { en: 'Vedic Mantras', kn: 'ವೇದ ಮಂತ್ರ', hi: 'वैदिक मन्त्र' } },
    { id: 'Stotra', label: { en: 'Stotras', kn: 'ಸ್ತೋತ್ರ', hi: 'स्तोत्र' } },
    { id: 'Japa', label: { en: 'Japa & Chants', kn: 'ಜಪ / ಧ್ಯಾನ', hi: 'जप एवं ध्यान' } },
    { id: 'Sacred Scripture', label: { en: 'Scriptures', kn: 'ಪವಿತ್ರ ಗ್ರಂಥ', hi: 'पवित्र ग्रन्थ' } },
    { id: 'Jyotisha Shastra', label: { en: 'Jyotisha', kn: 'ಜ್ಯೋತಿಷ', hi: 'ज्योतिष शास्त्र' } }
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

  // Fallback background image palette for links entered
  const defaultBgPresets = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1609137144820-2b9a7c36a6e8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80'
  ];

  const handleAddMantraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    // Pick image from user input or preset based on title length
    let bgImg = customImage.trim();
    if (!bgImg) {
      const idx = (newTitle.length + mantrasList.length) % defaultBgPresets.length;
      bgImg = defaultBgPresets[idx];
    }

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

      {/* Dynamic Link Input Form (Accessible right at the beginning) */}
      {showAddForm && (
        <div className="rounded-2xl bg-white dark:bg-stone-900 p-6 border-2 border-amber-400 dark:border-amber-600 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>
                {currentLang === 'kn' ? 'ಹೊಸ ಮಂತ್ರದ ಲಿಂಕ್ ಮತ್ತು ವಿವರ ನಮೂದಿಸಿ' : currentLang === 'hi' ? 'नए मन्त्र का वेब लिंक एवं विवरण दर्ज करें' : 'Enter New Mantra Web Link & Details'}
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

              {/* Background Picture URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {currentLang === 'kn' ? 'ಹಿನ್ನೆಲೆ ಚಿತ್ರದ ಲಿಂಕ್ (Background Image URL - Optional)' : currentLang === 'hi' ? 'पृष्ठभूमि चित्र लिंक (वैकल्पिक)' : 'Background Image URL (Optional)'}
                </label>
                <input
                  type="url"
                  placeholder="https://... (Leave blank to use sacred Vedic theme background)"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
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
              {/* Background Thumbnail Image Banner */}
              <div className="relative h-40 w-full overflow-hidden bg-stone-900">
                <img
                  src={mantra.imageUrl}
                  alt={mantra.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    // Fallback image if custom URL fails to load
                    (e.target as HTMLImageElement).src = defaultBgPresets[0];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                
                {/* Category & Custom badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 uppercase tracking-wider border border-amber-400/30">
                    {mantra.category}
                  </span>
                  {mantra.isCustom && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[9px] font-extrabold uppercase">
                      Custom
                    </span>
                  )}
                </div>

                {/* Mantra Title inside thumbnail */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold font-serif text-white group-hover:text-amber-300 transition-colors drop-shadow-md">
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
