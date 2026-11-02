import { CityLocation, Language, LocalizedString } from '../types';
import { CITIES, calculateGochar, GocharReport, RASHIS } from './panchanga';
import { getUserProfile, computeProfileAstrology, UserProfile } from './userProfile';
import { calculateVimshottariDasha, VimshottariDashaResult, DASHA_LORDS } from './vimshottariDasha';

export const DB_NAME = 'HCMM_Vedic_Astro_DB';
export const DB_VERSION = 1;

export const STORE_DASHA = 'dasha_reports';
export const STORE_GOCHAR = 'gochar_snapshots';
export const STORE_META = 'sync_metadata';

export interface StoredDashaLog {
  id: string; // e.g. dasha_1729000000000
  timestamp: number;
  isoDate: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  dateStr: string; // YYYY-MM-DD
  profileName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  janmaNakshatra: string;
  janmaMoonRashi: string;
  targetInspectionDate: string;
  currentMahadasha: {
    lord: string;
    lordSanskritKn: string;
    lordSanskritHi: string;
    startDate: string;
    endDate: string;
    durationYears: number;
    daysElapsed: number;
    daysRemaining: number;
    percentComplete: number;
  };
  currentAntardasha: {
    lord: string;
    lordSanskritKn: string;
    lordSanskritHi: string;
    startDate: string;
    endDate: string;
    durationMonths: number;
    percentComplete: number;
  };
  currentPratyantardasha: {
    lord: string;
    lordSanskritKn: string;
    lordSanskritHi: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    percentComplete: number;
  };
  mahadashaSequence: Array<{
    lord: string;
    years: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>;
  syncSource: 'auto' | 'manual';
}

export interface StoredGocharLog {
  id: string; // e.g. gochar_1729000000000
  timestamp: number;
  isoDate: string;
  dateStr: string; // YYYY-MM-DD
  cityName: string;
  latitude: number;
  longitude: number;
  moonRashi: string;
  moonRashiIndex: number;
  planets: Array<{
    name: string;
    rashiEn: string;
    rashiKn: string;
    rashiIndex: number;
    degree: number;
    formattedDegree: string;
    nakshatra: string;
    houseFromMoon: number;
    motion: string;
    dignity: string;
  }>;
  keyTransits: {
    jupiterHouse: number;
    saturnHouse: number;
    rahuHouse: number;
    ketuHouse: number;
  };
  syncSource: 'auto' | 'manual';
}

export interface SyncStats {
  dashaCount: number;
  gocharCount: number;
  lastDashaSync: string | null;
  lastGocharSync: string | null;
  isDbSupported: boolean;
  dbName: string;
}

/**
 * Initializes or upgrades the HCMM Vedic Astrological IndexedDB instance.
 */
export function initAstroIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Dasha Reports Store
      if (!db.objectStoreNames.contains(STORE_DASHA)) {
        const dashaStore = db.createObjectStore(STORE_DASHA, { keyPath: 'id' });
        dashaStore.createIndex('timestamp', 'timestamp', { unique: false });
        dashaStore.createIndex('dateStr', 'dateStr', { unique: false });
        dashaStore.createIndex('profileName', 'profileName', { unique: false });
        dashaStore.createIndex('currentMahaLord', 'currentMahadasha.lord', { unique: false });
      }

      // 2. Gochar Snapshots Store
      if (!db.objectStoreNames.contains(STORE_GOCHAR)) {
        const gocharStore = db.createObjectStore(STORE_GOCHAR, { keyPath: 'id' });
        gocharStore.createIndex('timestamp', 'timestamp', { unique: false });
        gocharStore.createIndex('dateStr', 'dateStr', { unique: false });
        gocharStore.createIndex('cityName', 'cityName', { unique: false });
        gocharStore.createIndex('moonRashi', 'moonRashi', { unique: false });
      }

      // 3. Sync Metadata Store
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB.'));
    };
  });
}

/**
 * Captures current Vimshottari Dasha status and persists to IndexedDB.
 */
export async function saveDashaSnapshotToIndexedDB(
  profileInput?: UserProfile,
  targetDateInput?: Date,
  syncSource: 'auto' | 'manual' = 'auto'
): Promise<StoredDashaLog> {
  const profile = profileInput || getUserProfile();
  const targetDate = targetDateInput || new Date();
  const astro = computeProfileAstrology(profile);
  const dashaResult = calculateVimshottariDasha(astro.birthDateObj, astro.moonLongitude, targetDate);

  const now = new Date();
  const dateStr = targetDate.toISOString().split('T')[0];
  const id = `dasha_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const currentMaha = dashaResult.currentMahadasha;
  const currentAntar = dashaResult.currentAntardasha;
  const currentPrat = dashaResult.currentPratyantardasha;

  const log: StoredDashaLog = {
    id,
    timestamp: now.getTime(),
    isoDate: now.toISOString(),
    dateStr,
    profileName: profile.name,
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    birthPlace: profile.birthPlace,
    latitude: profile.latitude,
    longitude: profile.longitude,
    janmaNakshatra: astro.nakshatraName.en,
    janmaMoonRashi: astro.rashiName.en,
    targetInspectionDate: dateStr,
    currentMahadasha: {
      lord: currentMaha.lord.name,
      lordSanskritKn: currentMaha.lord.sanskrit.kn,
      lordSanskritHi: currentMaha.lord.sanskrit.hi,
      startDate: new Date(currentMaha.startDate).toISOString(),
      endDate: new Date(currentMaha.endDate).toISOString(),
      durationYears: currentMaha.durationYears,
      daysElapsed: dashaResult.progress.mahadashaDaysElapsed,
      daysRemaining: dashaResult.progress.mahadashaDaysRemaining,
      percentComplete: dashaResult.progress.mahadashaPercent
    },
    currentAntardasha: {
      lord: currentAntar.lord.name,
      lordSanskritKn: currentAntar.lord.sanskrit.kn,
      lordSanskritHi: currentAntar.lord.sanskrit.hi,
      startDate: new Date(currentAntar.startDate).toISOString(),
      endDate: new Date(currentAntar.endDate).toISOString(),
      durationMonths: currentAntar.durationMonths,
      percentComplete: dashaResult.progress.antardashaPercent
    },
    currentPratyantardasha: {
      lord: currentPrat.lord.name,
      lordSanskritKn: currentPrat.lord.sanskrit.kn,
      lordSanskritHi: currentPrat.lord.sanskrit.hi,
      startDate: new Date(currentPrat.startDate).toISOString(),
      endDate: new Date(currentPrat.endDate).toISOString(),
      durationDays: currentPrat.durationDays,
      percentComplete: dashaResult.progress.pratyantardashaPercent
    },
    mahadashaSequence: dashaResult.mahadashas.map(m => ({
      lord: m.lord.name,
      years: m.durationYears,
      startDate: new Date(m.startDate).toISOString(),
      endDate: new Date(m.endDate).toISOString(),
      isActive: m.isCurrent
    })),
    syncSource
  };

  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_DASHA, STORE_META], 'readwrite');
    const store = tx.objectStore(STORE_DASHA);
    const metaStore = tx.objectStore(STORE_META);

    store.put(log);
    metaStore.put({ key: 'last_dasha_sync', value: now.toISOString(), logId: id });

    tx.oncomplete = () => {
      broadcastSyncEvent();
      resolve(log);
    };

    tx.onerror = () => {
      reject(tx.error || new Error('Failed to save Dasha report to IndexedDB.'));
    };
  });
}

/**
 * Captures current Gochar transits for a location and persists to IndexedDB.
 */
export async function saveGocharSnapshotToIndexedDB(
  cityInput?: CityLocation,
  dateInput?: Date,
  syncSource: 'auto' | 'manual' = 'auto'
): Promise<StoredGocharLog> {
  const city = cityInput || CITIES[0];
  const date = dateInput || new Date();
  const gochar = calculateGochar(date, city);

  const now = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const id = `gochar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const planetsMapped = gochar.planets.map(p => ({
    name: p.name,
    rashiEn: p.rashiName?.en || RASHIS[p.rashiIndex]?.en || '',
    rashiKn: p.rashiName?.kn || RASHIS[p.rashiIndex]?.kn || '',
    rashiIndex: p.rashiIndex,
    degree: p.degrees,
    formattedDegree: p.formattedDegree,
    nakshatra: typeof p.nakshatra === 'string' ? p.nakshatra : (p.nakshatra?.en || ''),
    houseFromMoon: p.houseFromMoon,
    motion: p.motionStatus.en,
    dignity: p.dignity.en
  }));

  const jup = planetsMapped.find(p => p.name === 'Jupiter');
  const sat = planetsMapped.find(p => p.name === 'Saturn');
  const rah = planetsMapped.find(p => p.name === 'Rahu');
  const ket = planetsMapped.find(p => p.name === 'Ketu');

  const log: StoredGocharLog = {
    id,
    timestamp: now.getTime(),
    isoDate: now.toISOString(),
    dateStr,
    cityName: city.name,
    latitude: city.lat,
    longitude: city.lng,
    moonRashi: gochar.moonRashi.en,
    moonRashiIndex: gochar.moonRashiIndex,
    planets: planetsMapped,
    keyTransits: {
      jupiterHouse: jup ? jup.houseFromMoon : 0,
      saturnHouse: sat ? sat.houseFromMoon : 0,
      rahuHouse: rah ? rah.houseFromMoon : 0,
      ketuHouse: ket ? ket.houseFromMoon : 0
    },
    syncSource
  };

  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_GOCHAR, STORE_META], 'readwrite');
    const store = tx.objectStore(STORE_GOCHAR);
    const metaStore = tx.objectStore(STORE_META);

    store.put(log);
    metaStore.put({ key: 'last_gochar_sync', value: now.toISOString(), logId: id });

    tx.oncomplete = () => {
      broadcastSyncEvent();
      resolve(log);
    };

    tx.onerror = () => {
      reject(tx.error || new Error('Failed to save Gochar snapshot to IndexedDB.'));
    };
  });
}

/**
 * Retrieves historical Vimshottari Dasha reports from IndexedDB (sorted descending by timestamp).
 */
export async function getHistoricalDashaLogs(limit: number = 50): Promise<StoredDashaLog[]> {
  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DASHA, 'readonly');
    const store = tx.objectStore(STORE_DASHA);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev'); // descending

    const results: StoredDashaLog[] = [];
    request.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to retrieve Dasha reports.'));
    };
  });
}

/**
 * Retrieves historical Gochar snapshots from IndexedDB (sorted descending by timestamp).
 */
export async function getHistoricalGocharLogs(limit: number = 50): Promise<StoredGocharLog[]> {
  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_GOCHAR, 'readonly');
    const store = tx.objectStore(STORE_GOCHAR);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev'); // descending

    const results: StoredGocharLog[] = [];
    request.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to retrieve Gochar snapshots.'));
    };
  });
}

/**
 * Deletes a single Dasha report from IndexedDB by ID.
 */
export async function deleteDashaLog(id: string): Promise<boolean> {
  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DASHA, 'readwrite');
    const store = tx.objectStore(STORE_DASHA);
    store.delete(id);

    tx.oncomplete = () => {
      broadcastSyncEvent();
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Deletes a single Gochar snapshot from IndexedDB by ID.
 */
export async function deleteGocharLog(id: string): Promise<boolean> {
  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_GOCHAR, 'readwrite');
    const store = tx.objectStore(STORE_GOCHAR);
    store.delete(id);

    tx.oncomplete = () => {
      broadcastSyncEvent();
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Clears all stored Dasha and Gochar logs.
 */
export async function clearAllAstroLogs(): Promise<boolean> {
  const db = await initAstroIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_DASHA, STORE_GOCHAR, STORE_META], 'readwrite');
    tx.objectStore(STORE_DASHA).clear();
    tx.objectStore(STORE_GOCHAR).clear();
    tx.objectStore(STORE_META).clear();

    tx.oncomplete = () => {
      broadcastSyncEvent();
      resolve(true);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Exports all stored logs as formatted JSON string for backup/export.
 */
export async function exportAllIndexedDBLogsAsJSON(): Promise<string> {
  const dashaLogs = await getHistoricalDashaLogs(500);
  const gocharLogs = await getHistoricalGocharLogs(500);
  const stats = await getSyncStats();

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    system: 'HCMM Vedic Panchanga & Astrological Suite',
    statistics: stats,
    dashaReports: dashaLogs,
    gocharSnapshots: gocharLogs
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Fetches current synchronization stats from IndexedDB.
 */
export async function getSyncStats(): Promise<SyncStats> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return {
      dashaCount: 0,
      gocharCount: 0,
      lastDashaSync: null,
      lastGocharSync: null,
      isDbSupported: false,
      dbName: DB_NAME
    };
  }

  try {
    const db = await initAstroIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_DASHA, STORE_GOCHAR, STORE_META], 'readonly');
      const dashaStore = tx.objectStore(STORE_DASHA);
      const gocharStore = tx.objectStore(STORE_GOCHAR);
      const metaStore = tx.objectStore(STORE_META);

      let dashaCount = 0;
      let gocharCount = 0;
      let lastDashaSync: string | null = null;
      let lastGocharSync: string | null = null;

      const dCountReq = dashaStore.count();
      dCountReq.onsuccess = () => { dashaCount = dCountReq.result; };

      const gCountReq = gocharStore.count();
      gCountReq.onsuccess = () => { gocharCount = gCountReq.result; };

      const mDashaReq = metaStore.get('last_dasha_sync');
      mDashaReq.onsuccess = () => {
        if (mDashaReq.result) lastDashaSync = mDashaReq.result.value;
      };

      const mGocharReq = metaStore.get('last_gochar_sync');
      mGocharReq.onsuccess = () => {
        if (mGocharReq.result) lastGocharSync = mGocharReq.result.value;
      };

      tx.oncomplete = () => {
        resolve({
          dashaCount,
          gocharCount,
          lastDashaSync,
          lastGocharSync,
          isDbSupported: true,
          dbName: DB_NAME
        });
      };

      tx.onerror = () => {
        resolve({
          dashaCount: 0,
          gocharCount: 0,
          lastDashaSync: null,
          lastGocharSync: null,
          isDbSupported: true,
          dbName: DB_NAME
        });
      };
    });
  } catch (err) {
    return {
      dashaCount: 0,
      gocharCount: 0,
      lastDashaSync: null,
      lastGocharSync: null,
      isDbSupported: false,
      dbName: DB_NAME
    };
  }
}

/**
 * Triggers a combined manual sync of both Dasha and Gochar right now.
 */
export async function triggerManualSync(city: CityLocation): Promise<{ dashaLog: StoredDashaLog; gocharLog: StoredGocharLog }> {
  const dashaLog = await saveDashaSnapshotToIndexedDB(undefined, undefined, 'manual');
  const gocharLog = await saveGocharSnapshotToIndexedDB(city, undefined, 'manual');
  return { dashaLog, gocharLog };
}

/**
 * Broadcasts an event across windows / tabs so UI components can update badges.
 */
function broadcastSyncEvent(): void {
  if (typeof window !== 'undefined') {
    getSyncStats().then((stats) => {
      window.dispatchEvent(new CustomEvent('hcmm_indexeddb_synced', { detail: stats }));
    }).catch(() => {});
  }
}

/**
 * Initiates an automated recurring sync background ticker that periodically updates
 * the user's saved Vimshottari Dasha and Gochar logs into IndexedDB.
 * Defaults to running every 30 minutes (and runs immediately on startup).
 * Returns a cleanup callback.
 */
export function startPeriodicAstroSync(
  city: CityLocation,
  intervalMinutes: number = 30
): () => void {
  // Check if browser supports IndexedDB
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return () => {};
  }

  const runSyncPass = async () => {
    try {
      // Deduplicate: Check if a sync happened in the last 2 hours
      const stats = await getSyncStats();
      const now = Date.now();
      const twoHoursMs = 2 * 60 * 60 * 1000;

      const shouldSyncDasha = !stats.lastDashaSync || (now - new Date(stats.lastDashaSync).getTime() > twoHoursMs);
      const shouldSyncGochar = !stats.lastGocharSync || (now - new Date(stats.lastGocharSync).getTime() > twoHoursMs);

      if (shouldSyncDasha) {
        await saveDashaSnapshotToIndexedDB(undefined, undefined, 'auto');
      }

      if (shouldSyncGochar) {
        await saveGocharSnapshotToIndexedDB(city, undefined, 'auto');
      }
    } catch (err) {
      console.warn('Auto Astro IndexedDB Sync skipped or delayed:', err);
    }
  };

  // Run on startup after a slight 2.5s delay to keep first load snappy
  const startupTimeout = setTimeout(() => {
    runSyncPass();
  }, 2500);

  // Interval ticker
  const intervalMs = Math.max(5, intervalMinutes) * 60 * 1000;
  const intervalId = setInterval(() => {
    runSyncPass();
  }, intervalMs);

  return () => {
    clearTimeout(startupTimeout);
    clearInterval(intervalId);
  };
}
