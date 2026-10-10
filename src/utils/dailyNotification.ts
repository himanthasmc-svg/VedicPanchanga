import { CityLocation, Language, PanchangaDay } from '../types';
import { getPanchangaForDate, getLocalizedPlaceName } from './panchanga';

const STORAGE_KEY_ENABLED = 'hcmm_daily_notify_enabled';
const STORAGE_KEY_LAST_DATE = 'hcmm_last_daily_notification_date';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export function isDailyNotificationEnabled(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY_ENABLED);
  // Enabled by default if user hasn't explicitly disabled it
  return saved === null || saved === 'true';
}

export function setDailyNotificationEnabled(enabled: boolean): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENABLED, enabled ? 'true' : 'false');
  }
}

/**
 * Builds the localized daily notification message content
 */
export function buildDailyPanchangaNotificationData(
  selectedCity: CityLocation,
  currentLang: Language,
  customDate?: Date
): { title: string; body: string } {
  const date = customDate || new Date();
  const panchang: PanchangaDay = getPanchangaForDate(date, selectedCity);
  const cityName = getLocalizedPlaceName(selectedCity, currentLang);

  const tithiStr = `${panchang.pakshaName[currentLang]} ${panchang.tithiName[currentLang]}`;
  const nakshatraStr = `${panchang.nakshatra[currentLang]} (Pada ${panchang.pada})`;
  
  let festSnippet = '';
  if (panchang.festivals.length > 0) {
    const festNames = panchang.festivals.map(f => f.name[currentLang]).join(', ');
    festSnippet = currentLang === 'kn' ? `\n🎉 ಹಬ್ಬ: ${festNames}` : currentLang === 'hi' ? `\n🎉 पर्व: ${festNames}` : `\n🎉 Festival: ${festNames}`;
  }

  const sunriseLabel = currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ' : currentLang === 'hi' ? 'सूर्योदय' : 'Sunrise';
  const abhijitLabel = currentLang === 'kn' ? 'ಅಭಿಜಿತ್' : currentLang === 'hi' ? 'अभिजित' : 'Abhijit';

  const title = `HCMM Panchanga • ${cityName}`;
  const body = `${tithiStr} • ${nakshatraStr}${festSnippet}\n🌅 ${sunriseLabel}: ${panchang.sunrise} | ${abhijitLabel}: ${panchang.abhijitMuhurta.start} - ${panchang.abhijitMuhurta.end}`;

  return { title, body };
}

/**
 * Checks if daily notification was already fired today. If not, fires it and records today's date.
 */
export function checkAndTriggerDailyNotification(
  selectedCity: CityLocation,
  currentLang: Language
): boolean {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  if (!isDailyNotificationEnabled()) return false;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);

  // If already triggered today, don't duplicate
  if (lastDate === todayStr) {
    return false;
  }

  const { title, body } = buildDailyPanchangaNotificationData(selectedCity, currentLang);

  try {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'hcmm-daily-panchanga'
    });

    notif.onclick = () => {
      window.focus();
    };

    localStorage.setItem(STORAGE_KEY_LAST_DATE, todayStr);
    return true;
  } catch (e) {
    console.error('Error firing daily notification:', e);
    return false;
  }
}

/**
 * Requests permission and fires today's daily notification immediately as a test / confirmation.
 */
export async function requestAndTriggerTestNotification(
  selectedCity: CityLocation,
  currentLang: Language
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let perm = Notification.permission;
  if (perm !== 'granted') {
    perm = await Notification.requestPermission();
  }

  if (perm !== 'granted') {
    return false;
  }

  setDailyNotificationEnabled(true);
  const { title, body } = buildDailyPanchangaNotificationData(selectedCity, currentLang);

  try {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'hcmm-daily-panchanga-test'
    });

    notif.onclick = () => {
      window.focus();
    };

    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY_LAST_DATE, todayStr);
    return true;
  } catch (e) {
    console.error('Error firing notification:', e);
    return false;
  }
}
