import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Trash2, 
  Clock, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Check, 
  ChevronRight, 
  X, 
  AlertCircle,
  FileText,
  Search,
  HardDrive,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { CityLocation, Language } from '../types';
import { 
  StoredDashaLog, 
  StoredGocharLog, 
  SyncStats, 
  getSyncStats, 
  getHistoricalDashaLogs, 
  getHistoricalGocharLogs, 
  triggerManualSync, 
  deleteDashaLog, 
  deleteGocharLog, 
  clearAllAstroLogs, 
  exportAllIndexedDBLogsAsJSON 
} from '../utils/indexedDbSync';

interface AstroOfflineArchiveDrawerProps {
  currentLang: Language;
  selectedCity: CityLocation;
  isOpen: boolean;
  onClose: () => void;
  onSelectHistoricalDasha?: (log: StoredDashaLog) => void;
}

export const AstroOfflineArchiveDrawer: React.FC<AstroOfflineArchiveDrawerProps> = ({
  currentLang,
  selectedCity,
  isOpen,
  onClose,
  onSelectHistoricalDasha
}) => {
  const [activeTab, setActiveTab] = useState<'dasha' | 'gochar'>('dasha');
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [dashaLogs, setDashaLogs] = useState<StoredDashaLog[]>([]);
  const [gocharLogs, setGocharLogs] = useState<StoredGocharLog[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDashaDetail, setSelectedDashaDetail] = useState<StoredDashaLog | null>(null);
  const [selectedGocharDetail, setSelectedGocharDetail] = useState<StoredGocharLog | null>(null);

  // Load stats and historical records from IndexedDB
  const loadData = async () => {
    try {
      const s = await getSyncStats();
      setStats(s);
      const d = await getHistoricalDashaLogs(50);
      setDashaLogs(d);
      const g = await getHistoricalGocharLogs(50);
      setGocharLogs(g);
    } catch (e) {
      console.warn('Error loading IndexedDB logs:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Listen to background sync events
  useEffect(() => {
    const handleSyncEvent = (e: any) => {
      if (e.detail) {
        setStats(e.detail);
        getHistoricalDashaLogs(50).then(setDashaLogs).catch(() => {});
        getHistoricalGocharLogs(50).then(setGocharLogs).catch(() => {});
      }
    };
    window.addEventListener('hcmm_indexeddb_synced', handleSyncEvent);
    return () => window.removeEventListener('hcmm_indexeddb_synced', handleSyncEvent);
  }, []);

  const handleManualSyncNow = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg('');
    try {
      await triggerManualSync(selectedCity);
      await loadData();
      setSyncSuccessMsg(
        currentLang === 'kn'
          ? 'ಇಂಡೆಕ್ಸ್‌ಡ್ ಡಿಬಿ (IndexedDB) ಆಫ್‌ಲೈನ್ ಸಿಂಕ್ ಯಶಸ್ವಿಯಾಗಿದೆ!'
          : 'Successfully synced Dasha & Gochar to IndexedDB!'
      );
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      const jsonStr = await exportAllIndexedDBLogsAsJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HCMM_Astro_Historical_Logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export JSON:', e);
    }
  };

  const handleDeleteDasha = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDashaLog(id);
    if (selectedDashaDetail?.id === id) setSelectedDashaDetail(null);
    await loadData();
  };

  const handleDeleteGochar = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteGocharLog(id);
    if (selectedGocharDetail?.id === id) setSelectedGocharDetail(null);
    await loadData();
  };

  const handleClearAll = async () => {
    const confirmMsg = currentLang === 'kn'
      ? 'ಎಲ್ಲಾ ಐತಿಹಾಸಿಕ ದಶಾ ಮತ್ತು ಗೋಚಾರ ಲಾಗ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?'
      : 'Are you sure you want to clear all historical Dasha and Gochar logs from IndexedDB?';
    if (window.confirm(confirmMsg)) {
      await clearAllAstroLogs();
      setSelectedDashaDetail(null);
      setSelectedGocharDetail(null);
      await loadData();
    }
  };

  const filteredDashaLogs = useMemo(() => {
    if (!searchQuery.trim()) return dashaLogs;
    const q = searchQuery.toLowerCase();
    return dashaLogs.filter(l => 
      l.dateStr.includes(q) ||
      l.currentMahadasha.lord.toLowerCase().includes(q) ||
      l.currentAntardasha.lord.toLowerCase().includes(q) ||
      l.profileName.toLowerCase().includes(q)
    );
  }, [dashaLogs, searchQuery]);

  const filteredGocharLogs = useMemo(() => {
    if (!searchQuery.trim()) return gocharLogs;
    const q = searchQuery.toLowerCase();
    return gocharLogs.filter(l => 
      l.dateStr.includes(q) ||
      l.cityName.toLowerCase().includes(q) ||
      l.moonRashi.toLowerCase().includes(q)
    );
  }, [gocharLogs, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-amber-500/40 text-stone-900 dark:text-stone-100 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base sm:text-lg text-amber-200">
                  {currentLang === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಆಸ್ಟ್ರೋ ಸಿಂಕ್ ಆರ್ಕೈವ್ (IndexedDB)' : currentLang === 'hi' ? 'ऑफलाइन ज्योतिष सिंक अभिलेखागार (IndexedDB)' : 'Offline Astro Sync & IndexedDB Archive'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  100% Offline Ready
                </span>
              </div>
              <p className="text-xs text-stone-300">
                {currentLang === 'kn'
                  ? 'ಬ್ರೌಸರ್‌ನ ಇಂಡೆಕ್ಸ್‌ಡ್ ಡಿಬಿಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾದ ಐತಿಹಾಸಿಕ ದಶಾ ಮತ್ತು ಗೋಚಾರ ವರದಿಗಳು'
                  : 'Automated periodic persistence for historical Dasha & Gochar analytics'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner & Actions Strip */}
        <div className="p-3 sm:p-4 bg-amber-50/70 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
                <HardDrive className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ದಾಖಲೆಗಳು:' : 'Records:'}
                </span>
                <span className="font-mono text-amber-700 dark:text-amber-300">
                  {stats?.dashaCount || 0} Dasha • {stats?.gocharCount || 0} Gochar
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSyncNow}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? (currentLang === 'kn' ? 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...' : 'Syncing...') : (currentLang === 'kn' ? 'ಈಗಲೇ ಸಿಂಕ್ ಮಾಡಿ' : 'Sync Now')}</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Export all records as JSON file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'JSON ರಫ್ತು' : 'Export JSON'}</span>
              </button>
            </div>
          </div>

          {syncSuccessMsg && (
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{syncSuccessMsg}</span>
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'kn' ? 'ದಿನಾಂಕ, ಗ್ರಹ ಅಥವಾ ಸ್ಥಳದಿಂದ ಹುಡುಕಿ...' : 'Filter historical logs by date, planet, or place...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-medium"
            />
          </div>
        </div>

        {/* Tab Switcher: Dasha vs Gochar */}
        <div className="px-4 pt-3 flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('dasha'); setSelectedGocharDetail(null); }}
              className={`px-3.5 py-2 font-bold text-xs rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'dasha'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-white dark:bg-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ವರದಿಗಳು' : 'Vimshottari Dasha Logs'} ({filteredDashaLogs.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('gochar'); setSelectedDashaDetail(null); }}
              className={`px-3.5 py-2 font-bold text-xs rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'gochar'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-white dark:bg-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಗೋಚಾರ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್‌ಗಳು' : 'Gochar Snapshots'} ({filteredGocharLogs.length})</span>
            </button>
          </div>

          {(dashaLogs.length > 0 || gocharLogs.length > 0) && (
            <button
              onClick={handleClearAll}
              className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer mb-2"
              title="Clear all logs"
            >
              <Trash2 className="w-3 h-3" />
              <span>{currentLang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ' : 'Clear All'}</span>
            </button>
          )}
        </div>

        {/* Content Body: List and Detail Split */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* TAB 1: DASHA REPORTS */}
          {activeTab === 'dasha' && (
            filteredDashaLogs.length === 0 ? (
              <div className="text-center py-12 text-stone-400 space-y-2">
                <Database className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-xs font-semibold">
                  {currentLang === 'kn' ? 'ಯಾವುದೇ ದಶಾ ವರದಿಗಳು ಸಂಗ್ರಹವಾಗಿಲ್ಲ.' : 'No Dasha snapshots found in IndexedDB yet.'}
                </p>
                <button
                  onClick={handleManualSyncNow}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {currentLang === 'kn' ? 'ಮೊದಲ ವರದಿ ಸಿಂಕ್ ಮಾಡಿ' : 'Capture First Snapshot'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredDashaLogs.map((log) => {
                  const isSelected = selectedDashaDetail?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedDashaDetail(isSelected ? null : log)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-400'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-amber-400/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {log.currentMahadasha.lord.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
                              <span>{log.currentMahadasha.lord} ➔ {log.currentAntardasha.lord}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                                {log.currentMahadasha.percentComplete}%
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5 font-mono">
                              <span>📅 {log.dateStr}</span>
                              <span>•</span>
                              <span>{log.profileName}</span>
                              <span>•</span>
                              <span className="capitalize">{log.syncSource}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleDeleteDasha(log.id, e)}
                            className="p-1 rounded-lg hover:bg-red-100 text-stone-400 hover:text-red-600 transition-colors"
                            title="Delete snapshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded Detail Panel */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs space-y-2 text-stone-700 dark:text-stone-300 animate-in fade-in">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl text-[11px]">
                            <div>
                              <span className="text-stone-400 block">Mahadasha:</span>
                              <strong>{log.currentMahadasha.lord} ({log.currentMahadasha.durationYears}y)</strong>
                            </div>
                            <div>
                              <span className="text-stone-400 block">Antardasha:</span>
                              <strong>{log.currentAntardasha.lord} ({log.currentAntardasha.durationMonths}m)</strong>
                            </div>
                            <div>
                              <span className="text-stone-400 block">Pratyantardasha:</span>
                              <strong>{log.currentPratyantardasha.lord} ({log.currentPratyantardasha.durationDays}d)</strong>
                            </div>
                            <div>
                              <span className="text-stone-400 block">Remaining:</span>
                              <span className="text-amber-600 font-bold">{log.currentMahadasha.daysRemaining} days left</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block">Nakshatra:</span>
                              <span>{log.janmaNakshatra}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block">Moon Sign:</span>
                              <span>{log.janmaMoonRashi}</span>
                            </div>
                          </div>

                          <div className="text-[10px] text-stone-400 font-mono">
                            Snapshot ID: {log.id} • Saved: {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* TAB 2: GOCHAR SNAPSHOTS */}
          {activeTab === 'gochar' && (
            filteredGocharLogs.length === 0 ? (
              <div className="text-center py-12 text-stone-400 space-y-2">
                <Zap className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-xs font-semibold">
                  {currentLang === 'kn' ? 'ಯಾವುದೇ ಗೋಚಾರ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್‌ಗಳು ಸಂಗ್ರಹವಾಗಿಲ್ಲ.' : 'No Gochar snapshots found in IndexedDB yet.'}
                </p>
                <button
                  onClick={handleManualSyncNow}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {currentLang === 'kn' ? 'ಮೊದಲ ಗೋಚಾರ ಸಿಂಕ್ ಮಾಡಿ' : 'Capture First Gochar'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredGocharLogs.map((log) => {
                  const isSelected = selectedGocharDetail?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedGocharDetail(isSelected ? null : log)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-400'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-amber-400/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {log.cityName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
                              <span>{log.cityName} • Chandra in {log.moonRashi}</span>
                            </div>
                            <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5 font-mono">
                              <span>📅 {log.dateStr}</span>
                              <span>•</span>
                              <span>Guru H{log.keyTransits.jupiterHouse}</span>
                              <span>•</span>
                              <span>Shani H{log.keyTransits.saturnHouse}</span>
                              <span>•</span>
                              <span className="capitalize">{log.syncSource}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleDeleteGochar(log.id, e)}
                            className="p-1 rounded-lg hover:bg-red-100 text-stone-400 hover:text-red-600 transition-colors"
                            title="Delete snapshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded Gochar Planetary Table */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs space-y-2.5 animate-in fade-in">
                          <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                            {currentLang === 'kn' ? 'ಗ್ರಹಗಳ ಸ್ಥಾನಗಳು (Planetary Transits):' : 'Planetary Transit Coordinates:'}
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10.5px]">
                            {log.planets.map(p => (
                              <div key={p.name} className="p-1.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
                                <span className="font-bold">{p.name}</span>
                                <span className="font-mono text-amber-700 dark:text-amber-400">{p.rashiEn} {p.formattedDegree}</span>
                              </div>
                            ))}
                          </div>

                          <div className="text-[10px] text-stone-400 font-mono">
                            Snapshot ID: {log.id} • Saved: {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};
