import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Calendar, 
  Clock, 
  Sparkles, 
  Flame, 
  Heart, 
  Search, 
  Filter, 
  CheckCircle2, 
  Check, 
  X,
  FileText,
  User,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';

export interface OfferingLogEntry {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  time: string; // e.g. 07:15 AM
  deityName: string;
  sankalpaType: string;
  granthaOrMantra: string;
  offerings: string[];
  customNaivedya?: string;
  devoteeName?: string;
  devoteeGotra?: string;
  locationName?: string;
  notes?: string;
  paksha: 'Shukla' | 'Krishna';
  tithiName: string;
  nakshatraName: string;
}

interface DigitalOfferingLogProps {
  language: Language;
  currentDeityName: string;
  currentGranthaName: string;
  currentLocationName: string;
  currentDateStr: string;
  currentPaksha: 'Shukla' | 'Krishna';
  currentTithi: string;
  currentNakshatra: string;
  onSelectDeity?: (deity: string) => void;
}

const STORAGE_KEY = 'hcmm_sankalpa_offering_logs_v1';

const SANKALPA_TYPES: Record<Language, { id: string; label: string }[]> = {
  kn: [
    { id: 'kalasha_sthapana', label: 'ಕಲಶ ಸ್ಥಾಪನಾ ಸಂಕಲ್ಪ (Kalasha Sthapana)' },
    { id: 'akhanda_deepa', label: 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ (Akhanda Deepa)' },
    { id: 'nitya_puja', label: 'ದೈನಂದಿನ ನಿತ್ಯ ಪೂಜೆ (Daily Nitya Puja)' },
    { id: 'navaratri_vrata', label: 'ಶರನ್ನವರಾತ್ರಿ ವ್ರತ (Navaratri Vrata)' },
    { id: 'satyanarayana', label: 'ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ವ್ರತ (Satyanarayana Vrata)' },
    { id: 'rudrabhisheka', label: 'ಶ್ರೀ ರುದ್ರಾಭಿಷೇಕ (Rudrabhisheka)' },
    { id: 'lalitha_sahasranama', label: 'ಲಲಿತಾ ಸಹಸ್ರನಾಮ ಕುಂಕುಮಾರ್ಚನೆ (Kumkumarchana)' },
    { id: 'visarjana_shanti', label: 'ವಿಸರ್ಜನ ಶಾಂತಿ ಹೋಮ (Visarjana Shanti)' },
    { id: 'custom', label: 'ಇತರ ವಿಶೇಷ ಸಂಕಲ್ಪ (Other Special Vrata)' }
  ],
  hi: [
    { id: 'kalasha_sthapana', label: 'कलश स्थापना संकल्प (Kalasha Sthapana)' },
    { id: 'akhanda_deepa', label: 'अखण्ड दीप प्रतिष्ठा (Akhanda Deepa)' },
    { id: 'nitya_puja', label: 'दैनिक नित्य पूजन (Daily Nitya Puja)' },
    { id: 'navaratri_vrata', label: 'शारदीय नवरात्रि व्रत (Navaratri Vrata)' },
    { id: 'satyanarayana', label: 'सत्यनारायण व्रत कथा (Satyanarayana Vrata)' },
    { id: 'rudrabhisheka', label: 'रुद्राभिषेक (Rudrabhisheka)' },
    { id: 'lalitha_sahasranama', label: 'ललिता सहस्रनाम कुंकुमार्चन (Kumkumarchana)' },
    { id: 'visarjana_shanti', label: 'विसर्जन शान्ति हवन (Visarjana Shanti)' },
    { id: 'custom', label: 'अन्य विशेष संकल्प (Other Special Vrata)' }
  ],
  en: [
    { id: 'kalasha_sthapana', label: 'Kalasha Sthapana Sankalpa' },
    { id: 'akhanda_deepa', label: 'Akhanda Deepa Installation' },
    { id: 'nitya_puja', label: 'Daily Nitya Puja' },
    { id: 'navaratri_vrata', label: 'Sharannavaratri Vrata' },
    { id: 'satyanarayana', label: 'Sri Satyanarayana Vrata' },
    { id: 'rudrabhisheka', label: 'Sri Rudrabhisheka' },
    { id: 'lalitha_sahasranama', label: 'Kumkumarchana with Sahasranama' },
    { id: 'visarjana_shanti', label: 'Visarjana Shanti Ritual' },
    { id: 'custom', label: 'Custom Special Vrata / Puja' }
  ]
};

const COMMON_OFFERINGS: Record<Language, { id: string; label: string; icon: string }[]> = {
  kn: [
    { id: 'pushpa', label: 'ಪುಷ್ಪ (Sacred Flowers)', icon: '🌸' },
    { id: 'deepa', label: 'ದೀಪ (Ghee/Oil Lamp)', icon: '🪔' },
    { id: 'dhoopa', label: 'ಧೂಪ (Fragrant Incense)', icon: '💨' },
    { id: 'gandha', label: 'ಶ್ರೀಗಂಧ / ಚಂದನ (Sandalwood)', icon: '🪵' },
    { id: 'kumkuma', label: 'ಕುಂಕುಮ / ಅರಿಶಿನ (Kumkum & Haldi)', icon: '🔴' },
    { id: 'naivedya_payasa', label: 'ಪಾಯಸ ನೈವೇದ್ಯ (Ksheer Payasam)', icon: '🥣' },
    { id: 'phala', label: 'ಪಂಚ ಫಲಗಳು (Fresh Fruits)', icon: '🍎' },
    { id: 'tambula', label: 'ತಾಂಬೂಲ (Betel Leaves & Areca)', icon: '🍃' },
    { id: 'panchamrita', label: 'ಪಂಚಾಮೃತ (Milk, Curd, Ghee, Honey, Sugar)', icon: '🥛' },
    { id: 'bilva_tulasi', label: 'ಬಿಲ್ವಪತ್ರೆ / ತುಳಸೀ (Bilva & Tulasi)', icon: '🌿' },
    { id: 'dakshina', label: 'ದಕ್ಷಿಣೆ (Sacred Offering)', icon: '🪙' }
  ],
  hi: [
    { id: 'pushpa', label: 'पुष्प (पवित्र फूल)', icon: '🌸' },
    { id: 'deepa', label: 'दीप (घृत/तैल दीप)', icon: '🪔' },
    { id: 'dhoopa', label: 'धूप (सुगन्धित अगरबत्ती)', icon: '💨' },
    { id: 'gandha', label: 'चन्दन (श्रीगन्ध)', icon: '🪵' },
    { id: 'kumkuma', label: 'कुमकुम व हरिद्रा (हल्दी)', icon: '🔴' },
    { id: 'naivedya_payasa', label: 'खीर नैवेद्य (पायसम)', icon: '🥣' },
    { id: 'phala', label: 'पंच फल (ऋतु फल)', icon: '🍎' },
    { id: 'tambula', label: 'ताम्बूल (पान-सुपारी)', icon: '🍃' },
    { id: 'panchamrita', label: 'पंचामृत (दूध, दही, घी, शहद, शर्करा)', icon: '🥛' },
    { id: 'bilva_tulasi', label: 'बिल्वपत्र / तुलसी दल', icon: '🌿' },
    { id: 'dakshina', label: 'दक्षिणा (श्रद्धा सुमन)', icon: '🪙' }
  ],
  en: [
    { id: 'pushpa', label: 'Pushpa (Sacred Flowers)', icon: '🌸' },
    { id: 'deepa', label: 'Deepa (Sacred Lamp)', icon: '🪔' },
    { id: 'dhoopa', label: 'Dhoopa (Incense)', icon: '💨' },
    { id: 'gandha', label: 'Gandha (Sandalwood Paste)', icon: '🪵' },
    { id: 'kumkuma', label: 'Kumkuma & Haridra', icon: '🔴' },
    { id: 'naivedya_payasa', label: 'Naivedya (Sweet Rice/Kheer)', icon: '🥣' },
    { id: 'phala', label: 'Pancha Phala (Fruits)', icon: '🍎' },
    { id: 'tambula', label: 'Tambula (Betel Leaves)', icon: '🍃' },
    { id: 'panchamrita', label: 'Panchamrita (5 Nectars)', icon: '🥛' },
    { id: 'bilva_tulasi', label: 'Bilva / Tulasi Leaves', icon: '🌿' },
    { id: 'dakshina', label: 'Dakshina Offering', icon: '🪙' }
  ]
};

export const DigitalOfferingLog: React.FC<DigitalOfferingLogProps> = ({
  language,
  currentDeityName,
  currentGranthaName,
  currentLocationName,
  currentDateStr,
  currentPaksha,
  currentTithi,
  currentNakshatra,
  onSelectDeity
}) => {
  const [logs, setLogs] = useState<OfferingLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading offering logs from localStorage', e);
    }
    // Default initial seeded log for Navaratri
    return [
      {
        id: 'seed-1',
        timestamp: new Date().toISOString(),
        date: currentDateStr,
        time: '06:45 AM',
        deityName: currentDeityName || 'ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ (Sri Durga Parameshwari)',
        sankalpaType: 'ಕಲಶ ಸ್ಥಾಪನಾ ಸಂಕಲ್ಪ (Kalasha Sthapana)',
        granthaOrMantra: currentGranthaName || 'ಶ್ರೀ ದೇವೀ ಮಾಹಾತ್ಮ್ಯೆ (Sri Devi Mahatmye)',
        offerings: ['ಪುಷ್ಪ (Sacred Flowers)', 'ದೀಪ (Ghee/Oil Lamp)', 'ಧೂಪ (Fragrant Incense)', 'ಶ್ರೀಗಂಧ / ಚಂದನ (Sandalwood)', 'ಪಾಯಸ ನೈವೇದ್ಯ (Ksheer Payasam)', 'ತಾಂಬೂಲ (Betel Leaves & Areca)'],
        customNaivedya: 'ಬೆಲ್ಲದ ಪಾಯಸ, ಕೇಸರಿಬಾತ್, ಪಂಚಾಮೃತ',
        devoteeName: 'ಭಕ್ತ ಕುಟುಂಬ (Devotee Family)',
        devoteeGotra: 'ಕಶ್ಯಪ (Kashyapa)',
        locationName: currentLocationName,
        notes: 'ಆರೋಗ್ಯ, ಆಯುಷ್ಯ, ಧನಧಾನ್ಯ ವೃದ್ಧಿ ಹಾಗೂ ಸಕಲ ಸಂಕಷ್ಟ ನಿವಾರಣಾರ್ಥ ಸಂಕಲ್ಪ ಪೂಜೆ ಸಂಪನ್ನ.',
        paksha: currentPaksha,
        tithiName: currentTithi,
        nakshatraName: currentNakshatra
      }
    ];
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving offering logs to localStorage', e);
    }
  }, [logs]);

  // Form State for Adding / Editing Log
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDeity, setSelectedDeity] = useState(currentDeityName);
  const [selectedGrantha, setSelectedGrantha] = useState(currentGranthaName);
  const [selectedSankalpaType, setSelectedSankalpaType] = useState(SANKALPA_TYPES[language][0].label);
  const [logDate, setLogDate] = useState(currentDateStr);
  const [logTime, setLogTime] = useState(() => {
    const d = new Date();
    const hrs = d.getHours() % 12 || 12;
    const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${hrs}:${mins} ${ampm}`;
  });
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([
    COMMON_OFFERINGS[language][0].label,
    COMMON_OFFERINGS[language][1].label,
    COMMON_OFFERINGS[language][2].label,
    COMMON_OFFERINGS[language][5].label
  ]);
  const [customNaivedyaText, setCustomNaivedyaText] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteeGotra, setDevoteeGotra] = useState('');
  const [notes, setNotes] = useState('');
  const [pakshaChoice, setPakshaChoice] = useState<'Shukla' | 'Krishna'>(currentPaksha);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeity, setFilterDeity] = useState('ALL');

  // Update form defaults when props change
  useEffect(() => {
    setSelectedDeity(currentDeityName);
    setSelectedGrantha(currentGranthaName);
    setLogDate(currentDateStr);
    setPakshaChoice(currentPaksha);
  }, [currentDeityName, currentGranthaName, currentDateStr, currentPaksha]);

  const toggleOffering = (offeringLabel: string) => {
    setSelectedOfferings(prev => 
      prev.includes(offeringLabel) 
        ? prev.filter(item => item !== offeringLabel)
        : [...prev, offeringLabel]
    );
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeity.trim()) return;

    const newEntry: OfferingLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      date: logDate,
      time: logTime,
      deityName: selectedDeity.trim(),
      sankalpaType: selectedSankalpaType,
      granthaOrMantra: selectedGrantha.trim(),
      offerings: selectedOfferings,
      customNaivedya: customNaivedyaText.trim() || undefined,
      devoteeName: devoteeName.trim() || undefined,
      devoteeGotra: devoteeGotra.trim() || undefined,
      locationName: currentLocationName,
      notes: notes.trim() || undefined,
      paksha: pakshaChoice,
      tithiName: currentTithi,
      nakshatraName: currentNakshatra
    };

    setLogs(prev => [newEntry, ...prev]);
    setShowAddForm(false);
    // Reset inputs
    setCustomNaivedyaText('');
    setNotes('');
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm(language === 'kn' ? 'ಈ ಸಂಕಲ್ಪ ಪೂಜಾ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತಪಡಿಸಿ?' : 'Delete this Sankalpa Offering Record?')) {
      setLogs(prev => prev.filter(log => log.id !== id));
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sankalpa_Offerings_Log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ['Date', 'Time', 'Deity Name', 'Sankalpa Type', 'Mantra/Grantha', 'Offerings', 'Custom Naivedya', 'Devotee', 'Gotra', 'Paksha', 'Tithi', 'Notes'];
    const rows = logs.map(l => [
      `"${l.date}"`,
      `"${l.time}"`,
      `"${l.deityName.replace(/"/g, '""')}"`,
      `"${l.sankalpaType.replace(/"/g, '""')}"`,
      `"${l.granthaOrMantra.replace(/"/g, '""')}"`,
      `"${l.offerings.join(', ').replace(/"/g, '""')}"`,
      `"${(l.customNaivedya || '').replace(/"/g, '""')}"`,
      `"${(l.devoteeName || '').replace(/"/g, '""')}"`,
      `"${(l.devoteeGotra || '').replace(/"/g, '""')}"`,
      `"${l.paksha}"`,
      `"${l.tithiName.replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `Sankalpa_Offerings_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Distinct deities in logs for filter
  const distinctDeities = useMemo(() => {
    const set = new Set<string>();
    logs.forEach(l => set.add(l.deityName));
    return Array.from(set);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch = 
        l.deityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.sankalpaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.notes && l.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.customNaivedya && l.customNaivedya.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDeity = filterDeity === 'ALL' || l.deityName === filterDeity;
      return matchesSearch && matchesDeity;
    });
  }, [logs, searchTerm, filterDeity]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-800 via-rose-800 to-amber-800 text-white p-5 shadow-xl border border-red-500/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <BookMarked className="w-4 h-4 text-amber-300" />
            <span>DIGITAL OFFERING LOG • ದೇವತಾ ಸಂಕಲ್ಪ ಪೂಜಾ ಲಾಗ್</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <span>{language === 'kn' ? 'ಡಿಜಿಟಲ್ ಸಂಕಲ್ಪ ಮತ್ತು ನೈವೇದ್ಯ ದಾಖಲಾತಿ' : language === 'hi' ? 'डिजिटल संकल्प एवं नैवेद्य अभिलेख' : 'Digital Sankalpa & Offering Log'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold">
              {logs.length} {language === 'kn' ? 'ದಾಖಲೆಗಳು' : 'Entries'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
            {language === 'kn'
              ? 'ಪ್ರತಿದಿನ ಅಥವಾ ವಿಶೇಷ ವ್ರತಗಳಲ್ಲಿ ಇಷ್ಟದೇವತೆಗಳಿಗೆ ಸಮರ್ಪಿಸಿದ ಸಂಕಲ್ಪ, ನೈವೇದ್ಯ, ಗ್ರಂಥ ಪಾರಾಯಣ ಹಾಗೂ ದಿನಾಂಕ-ಸಮಯವನ್ನು ದಾಖಲಿಸಿ ಇತಿಹಾಸವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.'
              : language === 'hi'
              ? 'प्रत्येक दिन अथवा विशेष व्रतों में इष्टदेवता को समर्पित संकल्प, नैवेद्य, मन्त्र पाठ एवं दिनांक-समय का ऐतिहासिक अभिलेख रखें।'
              : 'Record dates, exact times, worshipped Deities, recited Scriptures, and specific offerings (Naivedya, Deepa, Pushpa) for perpetual historical tracking.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'kn' ? '+ ಹೊಸ ಸಂಕಲ್ಪ ದಾಖಲಿಸಿ' : language === 'hi' ? '+ नया संकल्प जोड़ें' : '+ Record New Offering'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleExportCsv}
            title="Export offering history to CSV spreadsheet"
            className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            title="Print offering logs"
            className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Add Offering Form Modal / Card */}
      {showAddForm && (
        <div className="rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50/70 dark:bg-stone-900 p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {language === 'kn' ? 'ಹೊಸ ಸಂಕಲ್ಪ ಮತ್ತು ಸಮರ್ಪಣೆ ದಾಖಲಿಸಿ' : language === 'hi' ? 'नया संकल्प एवं समर्पण दर्ज करें' : 'Record New Sankalpa & Offering Entry'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveLog} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Date */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'kn' ? 'ಪೂಜಾ ದಿನಾಂಕ (Date)' : 'Puja Date'}</span>
                </label>
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'kn' ? 'ಪೂಜಾ ಸಮಯ (Time)' : 'Puja Time'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={logTime}
                  onChange={(e) => setLogTime(e.target.value)}
                  placeholder="e.g. 06:30 AM"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Paksha Selection */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ಪಕ್ಷ (Paksha)' : 'Fortnight (Paksha)'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setPakshaChoice('Shukla')}
                    className={`py-1 text-center font-bold rounded-md transition-all ${
                      pakshaChoice === 'Shukla'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {language === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ' : language === 'hi' ? 'शुक्ल पक्ष' : 'Shukla'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPakshaChoice('Krishna')}
                    className={`py-1 text-center font-bold rounded-md transition-all ${
                      pakshaChoice === 'Krishna'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {language === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ' : language === 'hi' ? 'कृष्ण पक्ष' : 'Krishna'}
                  </button>
                </div>
              </div>

              {/* Sankalpa Type */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ಸಂಕಲ್ಪ ಪ್ರಕಾರ (Sankalpa Type)' : 'Sankalpa Type'}
                </label>
                <select
                  value={selectedSankalpaType}
                  onChange={(e) => setSelectedSankalpaType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                >
                  {SANKALPA_TYPES[language].map(t => (
                    <option key={t.id} value={t.label}>{t.label}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Deity Name */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ಪೂಜಿಸಿದ ಇಷ್ಟದೇವತೆ (Worshipped Deity Name)' : 'Worshipped Deity'} *
                </label>
                <input
                  type="text"
                  required
                  value={selectedDeity}
                  onChange={(e) => setSelectedDeity(e.target.value)}
                  placeholder="e.g. ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ / ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ / ಶ್ರೀ ಪರಮೇಶ್ವರ"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Grantha / Mantra */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ಪಠಿಸಿದ ಗ್ರಂಥ / ಮಂತ್ರ (Recited Scripture/Mantra)' : 'Recited Scripture/Mantra'}
                </label>
                <input
                  type="text"
                  value={selectedGrantha}
                  onChange={(e) => setSelectedGrantha(e.target.value)}
                  placeholder="e.g. ಶ್ರೀ ದೇವೀ ಮಾಹಾತ್ಮ್ಯೆ / ಲಲಿತಾ ಸಹಸ್ರನಾಮ / ಶ್ರೀ ರುದ್ರ"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Devotee / Family & Gotra */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {language === 'kn' ? 'ಭಕ್ತರ ಹೆಸರು' : 'Devotee Name'}
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="e.g. ರಮೇಶ್ & ಪರಿವಾರ"
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {language === 'kn' ? 'ಗೋತ್ರ' : 'Gotra'}
                  </label>
                  <input
                    type="text"
                    value={devoteeGotra}
                    onChange={(e) => setDevoteeGotra(e.target.value)}
                    placeholder="e.g. ಕಶ್ಯಪ / ಭಾರದ್ವಾಜ"
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

            </div>

            {/* Offerings Checkboxes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                {language === 'kn' ? 'ಸಮರ್ಪಿಸಿದ ಉಪಚಾರಗಳು ಮತ್ತು ನೈವೇದ್ಯ (Select Offerings Made):' : 'Offerings & Upacharas Made:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_OFFERINGS[language].map(item => {
                  const isSelected = selectedOfferings.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleOffering(item.label)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Naivedya Details & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ವಿಶೇಷ ನೈವೇದ್ಯ ವಿವರ (Specific Sweet/Naivedya Dishes)' : 'Special Naivedya Dishes'}
                </label>
                <input
                  type="text"
                  value={customNaivedyaText}
                  onChange={(e) => setCustomNaivedyaText(e.target.value)}
                  placeholder="e.g. ಶ್ಯಾವಿಗೆ ಪಾಯಸ, ಹಯಗ್ರೀವ, ಕಜ್ಜಾಯ, ಪಂಚಾಮೃತ"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'kn' ? 'ವಿಶೇಷ ಪ್ರಾರ್ಥನೆ ಅಥವಾ ಟಿಪ್ಪಣಿಗಳು (Notes / Prayer)' : 'Notes / Personal Prayer'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. ಕುಟುಂಬದ ಕ್ಷೇಮಾಭಿವೃದ್ಧಿ ಮತ್ತು ವಿದ್ಯಾರ್ಹತೆಗಾಗಿ ಮಾಡಿದ ವಿಶೇಷ ಸಂಕಲ್ಪ."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-amber-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'kn' ? 'ದಾಖಲೆಯನ್ನು ಉಳಿಸಿ (Save to Log)' : 'Save Offering Entry'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
        
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'kn' ? 'ದೇವತೆ, ಸಂಕಲ್ಪ ಅಥವಾ ನೈವೇದ್ಯ ಹುಡುಕಿ...' : 'Search deity, sankalpa or naivedya...'}
            className="w-full bg-transparent border-none text-stone-900 dark:text-stone-100 focus:outline-hidden text-xs"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {distinctDeities.length > 1 && (
          <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-700 pt-2 sm:pt-0 sm:pl-3">
            <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <select
              value={filterDeity}
              onChange={(e) => setFilterDeity(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-xs focus:outline-hidden"
            >
              <option value="ALL">{language === 'kn' ? 'ಎಲ್ಲಾ ದೇವತೆಗಳು (All Deities)' : 'All Deities'}</option>
              {distinctDeities.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* Offering Records List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 p-6 space-y-3">
            <span className="text-4xl">🪔</span>
            <h4 className="font-serif font-bold text-stone-800 dark:text-stone-200 text-base">
              {language === 'kn' ? 'ಯಾವುದೇ ಪೂಜಾ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ' : 'No Offering Logs Found'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {language === 'kn'
                ? 'ನೀವು ಮಾಡಿದ ಸಂಕಲ್ಪ ಹಾಗೂ ನೈವೇದ್ಯಗಳನ್ನು ದಾಖಲಿಸಲು ಮೇಲಿನ "+ ಹೊಸ ಸಂಕಲ್ಪ ದಾಖಲಿಸಿ" ಗುಂಡಿಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.'
                : 'Click "+ Record New Offering" above to log your ritual date, deity, and offerings.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLogs.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-red-500" />

                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🪔</span>
                      <h4 className="font-serif font-bold text-base text-stone-950 dark:text-white">
                        {entry.deityName}
                      </h4>
                    </div>
                    <span className="inline-block mt-0.5 text-xs font-semibold text-amber-800 dark:text-amber-400">
                      {entry.sankalpaType}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 text-xs font-mono font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-stone-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{entry.time}</span>
                    </div>
                  </div>
                </div>

                {/* Panchanga Context Pill */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] bg-amber-50 dark:bg-stone-800/60 p-2 rounded-xl border border-amber-200/60 dark:border-stone-700/60 text-stone-700 dark:text-stone-300">
                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[10px] ${entry.paksha === 'Shukla' ? 'bg-amber-400 text-stone-950' : 'bg-stone-700 text-white'}`}>
                    {entry.paksha === 'Shukla' ? (language === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ' : 'Shukla') : (language === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ' : 'Krishna')}
                  </span>
                  {entry.tithiName && (
                    <span className="font-semibold">
                      {entry.tithiName}
                    </span>
                  )}
                  {entry.nakshatraName && (
                    <span>• ನಕ್ಷತ್ರ: {entry.nakshatraName}</span>
                  )}
                  {entry.locationName && (
                    <span className="flex items-center gap-0.5 text-stone-500">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {entry.locationName.split(',')[0]}
                    </span>
                  )}
                </div>

                {/* Recited Scripture / Devotee */}
                <div className="text-xs space-y-1 text-stone-600 dark:text-stone-400">
                  {entry.granthaOrMantra && (
                    <div>
                      <strong className="text-stone-800 dark:text-stone-200">{language === 'kn' ? 'ಗ್ರಂಥ / ಮಂತ್ರ:' : 'Scripture:'}</strong>{' '}
                      <span className="italic">{entry.granthaOrMantra}</span>
                    </div>
                  )}
                  {(entry.devoteeName || entry.devoteeGotra) && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {entry.devoteeName || 'Devotee'} {entry.devoteeGotra ? `(${language === 'kn' ? 'ಗೋತ್ರ:' : 'Gotra:'} ${entry.devoteeGotra})` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Offerings Pills */}
                {entry.offerings && entry.offerings.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      {language === 'kn' ? 'ಸಮರ್ಪಿಸಿದ ಉಪಚಾರಗಳು (Offerings Made):' : 'Offerings Made:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.offerings.map((off, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[11px] font-medium border border-stone-200 dark:border-stone-700"
                        >
                          {off}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Naivedya */}
                {entry.customNaivedya && (
                  <div className="p-2 rounded-xl bg-rose-50/60 dark:bg-stone-800/40 border border-rose-200/50 dark:border-stone-700 text-xs">
                    <span className="font-bold text-rose-900 dark:text-rose-300">🥣 {language === 'kn' ? 'ವಿಶೇಷ ನೈವೇದ್ಯ:' : 'Naivedya:'}</span>{' '}
                    <span className="text-stone-800 dark:text-stone-200">{entry.customNaivedya}</span>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-800/30 p-2 rounded-lg border border-stone-200/50 dark:border-stone-700/50">
                    "{entry.notes}"
                  </p>
                )}

                {/* Card Actions */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  {onSelectDeity && (
                    <button
                      type="button"
                      onClick={() => onSelectDeity(entry.deityName)}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>{language === 'kn' ? 'ಸಂಕಲ್ಪ ಮಂತ್ರದಲ್ಲಿ ಅನ್ವಯಿಸಿ' : 'Apply to Sankalpa Stotra'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteLog(entry.id)}
                    className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
                    title="Delete this record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
