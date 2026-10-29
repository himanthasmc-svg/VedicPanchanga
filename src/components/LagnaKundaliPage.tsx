import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Eye, 
  Bell, 
  Compass, 
  ShieldCheck, 
  ShieldAlert,
  Info, 
  Download,
  Share2,
  Printer,
  FileDown,
  Image as ImageIcon,
  Loader2,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Heart,
  Users,
  TrendingUp,
  Lock,
  KeyRound,
  Check,
  RefreshCw,
  HelpCircle,
  Gem,
  Sparkle,
  Shield,
  Mail,
  Send,
  Navigation,
  Globe,
  Smartphone,
  MessageSquare,
  Copy,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon
} from 'lucide-react';
import { 
  persistEncryptedRemedies, 
  loadAndDecryptStoredRemedies, 
  getActiveSecondaryPasscode, 
  setSecondaryPasscode 
} from '../utils/remediesCrypto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CityLocation, KundaliData, Language, PlanetPosition } from '../types';
import { calculateKundali, CITIES, formatJustNumber, getPanchangaForDate, RASHIS, RASHI_NAKSHATRA_CHART } from '../utils/panchanga';
import { COUNTRIES_AND_CITIES, findClosestCity } from '../utils/worldPlaces';
import { calculatePlanetaryBala, PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { calculateVimshottariDasha, VimshottariDashaResult } from '../utils/vimshottariDasha';
import { calculateGunaMilan, GunaMilanResult } from '../utils/jatakaCompatibility';
import { calculateVedicRemedies, VedicRemediesResult } from '../utils/vedicRemedies';
import { calculatePrashnaKundali, PRASHNA_CATEGORIES, PrashnaJudgmentResult } from '../utils/prashnaKundali';
import { VedicRemediesSection } from './VedicRemediesSection';
import { PrashnaKundaliSection } from './PrashnaKundaliSection';
import { RealisticGraha, SvgGrahaIcon } from './RealisticGraha';
import { TransitKundaliChart } from './TransitKundaliChart';
import { GocharTransitsView } from './GocharTransitsView';
import { getNakshatraPadaAkshara } from '../utils/nakshatraAksharas';
import { WorldwidePlacePicker } from './WorldwidePlacePicker';
import { ChandraKundaliChart } from './ChandraKundaliChart';
import { BhavaExplorer } from './BhavaExplorer';
import { DashaDashboard } from './DashaDashboard';
import { CelestialSkyMandala3D } from './CelestialSkyMandala3D';
import { calculateAllHousesDrishtiSummary, getAspectingHousesForGraha } from '../utils/grahaDrishti';
import { DrishtiVisualizer } from './DrishtiVisualizer';
import { GrahaRemedyNutritionView } from './GrahaRemedyNutritionView';
import { getHouseCoord } from '../utils/drishtiCoordinates';

interface LagnaKundaliPageProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onBackToCalendar: () => void;
  userPassword?: string;
  onOpenAdmin?: () => void;
  initialSectionTab?: 'chart' | 'dasha' | 'remedies';
  initialRemediesSubTab?: 'upayas' | 'dasha' | 'transits' | 'prashna' | 'compatibility';
}

export const LagnaKundaliPage: React.FC<LagnaKundaliPageProps> = ({
  currentLang,
  selectedCity,
  onSelectCity,
  onBackToCalendar,
  userPassword = 'HCMM',
  onOpenAdmin,
  initialSectionTab,
  initialRemediesSubTab
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultHours = String(now.getHours()).padStart(2, '0');
  const defaultMins = String(now.getMinutes()).padStart(2, '0');

  const [dateStr, setDateStr] = useState<string>(defaultDate);
  const [timeStr, setTimeStr] = useState<string>(`${defaultHours}:${defaultMins}`);
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [notificationArmed, setNotificationArmed] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [balaFilter, setBalaFilter] = useState<'all' | 'strong' | 'moderate' | 'weak'>('all');
  const [activeSectionTab, setActiveSectionTab] = useState<'chart' | 'remedies' | 'dasha'>(() => {
    if (initialSectionTab === 'dasha') return 'remedies';
    return (initialSectionTab as any) === 'remedies' ? 'remedies' : 'chart';
  });
  const [remediesSubTab, setRemediesSubTab] = useState<'upayas' | 'dasha' | 'transits' | 'prashna' | 'compatibility'>(() => {
    if (initialSectionTab === 'dasha') return 'dasha';
    return initialRemediesSubTab || 'upayas';
  });
  const [selectedBhavaNumber, setSelectedBhavaNumber] = useState<number>(1);
  const [showAllHousesDrishtiTable, setShowAllHousesDrishtiTable] = useState<boolean>(false);
  const [showAspectLines, setShowAspectLines] = useState<boolean>(true);
  const [selectedDrishtiPlanet, setSelectedDrishtiPlanet] = useState<string>('Jupiter');

  useEffect(() => {
    if (initialSectionTab === 'dasha') {
      setActiveSectionTab('remedies');
      setRemediesSubTab('dasha');
    } else if (initialSectionTab === 'remedies' || initialSectionTab === 'chart') {
      setActiveSectionTab(initialSectionTab);
    }
  }, [initialSectionTab]);

  useEffect(() => {
    if (initialRemediesSubTab) setRemediesSubTab(initialRemediesSubTab);
  }, [initialRemediesSubTab]);

  // Exclusively authorized recipient email & mobile for Sacred Jyotisha access codes
  const TARGET_AUTH_EMAIL = 'himanthasmc@gmail.com';
  const TARGET_AUTH_PHONE = '9483480312';
  const SENDER_BRAND = 'AstroHimanth';

  // Email & Mobile OTP & Passcode Protection for Vedic Remedies (and nested Prashna, Guna Milan, Transits)
  const [isAstroUnlocked, setIsAstroUnlocked] = useState<boolean>(() => {
    const globalLocked = localStorage.getItem('hcmm_global_locked');
    if (globalLocked === 'true') return false;
    return localStorage.getItem('hcmm_astro_unlocked') === 'true';
  });
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpSentMessage, setOtpSentMessage] = useState<string>('');
  const [otpCodeHint, setOtpCodeHint] = useState<string>('');
  const [otpSmsUri, setOtpSmsUri] = useState<string>('');
  const [otpWhatsappUri, setOtpWhatsappUri] = useState<string>('');
  const [otpSmsDispatched, setOtpSmsDispatched] = useState<boolean>(false);
  const [otpSmsProvider, setOtpSmsProvider] = useState<string>('');
  const [otpSmsDetails, setOtpSmsDetails] = useState<string>('');
  const [otpEmailSent, setOtpEmailSent] = useState<boolean>(false);
  const [otpEmailStatus, setOtpEmailStatus] = useState<string>('');
  const [isCopiedCode, setIsCopiedCode] = useState<boolean>(false);
  const [showSmsApiSettings, setShowSmsApiSettings] = useState<boolean>(false);
  const [twilioSidInput, setTwilioSidInput] = useState<string>('');
  const [twilioTokenInput, setTwilioTokenInput] = useState<string>('');
  const [twilioFromInput, setTwilioFromInput] = useState<string>('');
  const [fast2smsKeyInput, setFast2smsKeyInput] = useState<string>('');
  const [gmailUserInput, setGmailUserInput] = useState<string>('');
  const [gmailAppPasswordInput, setGmailAppPasswordInput] = useState<string>('');
  const [isSavingSmsSettings, setIsSavingSmsSettings] = useState<boolean>(false);
  const [smsSettingsSavedMsg, setSmsSettingsSavedMsg] = useState<string>('');
  const [astroPasswordInput, setAstroPasswordInput] = useState<string>('');
  const [astroPasswordError, setAstroPasswordError] = useState<string>('');
  const [showForgotPassModal, setShowForgotPassModal] = useState<boolean>(false);
  const [forgotRecoveryMethod, setForgotRecoveryMethod] = useState<'code' | 'question'>('code');
  const [forgotRecoveryInput, setForgotRecoveryInput] = useState<string>('');
  const [forgotNewPassword, setForgotNewPassword] = useState<string>('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState<string>('');
  const [forgotError, setForgotError] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<string>('');

  // Location and Geolocation State for Kundali Chart & Dasha
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [gpsStatus, setGpsStatus] = useState<string>('');
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [showWorldwideModal, setShowWorldwideModal] = useState<boolean>(false);
  const [tab1ChartTab, setTab1ChartTab] = useState<'lagna' | 'chandra' | 'both' | 'mandala3d'>('lagna');

  // Auto-detect user's current geo-location on mount to default the Kundali chart view
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const matched = findClosestCity(lat, lng);
          const detectedLoc: CityLocation = {
            ...matched,
            lat,
            lng,
            name: `${matched.name} (My Location)`,
            nameLocalized: {
              en: `${matched.name} (My Location)`,
              kn: `${matched.nameLocalized?.kn || matched.name} (ನನ್ನ ಸ್ಥಳ)`,
              hi: `${matched.nameLocalized?.hi || matched.name} (मेरा स्थान)`
            }
          };
          onSelectCity(detectedLoc);
          const countryMatch = COUNTRIES_AND_CITIES.find(c => 
            c.cities.some(city => city.name === matched.name)
          );
          if (countryMatch) {
            setSelectedCountryCode(countryMatch.code);
          }
          setGpsStatus(
            currentLang === 'kn'
              ? `ನೈಜ ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ: ${matched.name} (${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E)`
              : `Current location locked: ${matched.name} (${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E)`
          );
        },
        () => {
          // Gracefully maintain default city if location permission not given
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    }
  }, []);

  // Groom & Bride Profiles for Guna Milan Tab
  const [groomDob, setGroomDob] = useState<string>('1996-05-15');
  const [groomTob, setGroomTob] = useState<string>('08:30');
  const [groomCountryCode, setGroomCountryCode] = useState<string>('IN');
  const [groomCity, setGroomCity] = useState<CityLocation>(CITIES[0]);
  const [groomChartStyle, setGroomChartStyle] = useState<'north' | 'south'>('north');

  const [brideDob, setBrideDob] = useState<string>('1998-09-20');
  const [brideTob, setBrideTob] = useState<string>('14:15');
  const [brideCountryCode, setBrideCountryCode] = useState<string>('IN');
  const [brideCity, setBrideCity] = useState<CityLocation>(CITIES[1] || CITIES[0]);
  const [brideChartStyle, setBrideChartStyle] = useState<'north' | 'south'>('north');
  const [useManualGunaOverride, setUseManualGunaOverride] = useState<boolean>(false);

  // Active country for chart dropdown
  const currentChartCountry = useMemo(() => {
    return COUNTRIES_AND_CITIES.find(c => c.code === selectedCountryCode) || COUNTRIES_AND_CITIES[0];
  }, [selectedCountryCode]);

  const groomCountry = useMemo(() => {
    return COUNTRIES_AND_CITIES.find(c => c.code === groomCountryCode) || COUNTRIES_AND_CITIES[0];
  }, [groomCountryCode]);

  const brideCountry = useMemo(() => {
    return COUNTRIES_AND_CITIES.find(c => c.code === brideCountryCode) || COUNTRIES_AND_CITIES[0];
  }, [brideCountryCode]);

  // Real-time Today's Panchanga for current Nakshatra tracking
  const todayPanchanga = useMemo(() => {
    return getPanchangaForDate(new Date(), selectedCity);
  }, [selectedCity]);

  // Handle manual GPS location detection click
  const handleDetectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus(currentLang === 'kn' ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಪಿಎಸ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ' : 'Geolocation is not supported by your browser');
      return;
    }
    setIsGpsLoading(true);
    setGpsStatus(currentLang === 'kn' ? 'ಜಿಪಿಎಸ್ ಸ್ಥಾನ ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...' : 'Detecting your GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const matched = findClosestCity(lat, lng);
        const customLoc: CityLocation = {
          ...matched,
          lat,
          lng,
          name: `${matched.name} (GPS)`,
          nameLocalized: {
            en: `${matched.name} (GPS)`,
            kn: `${matched.nameLocalized?.kn || matched.name} (ಜಿಪಿಎಸ್)`,
            hi: `${matched.nameLocalized?.hi || matched.name} (जीपीएस)`
          }
        };
        onSelectCity(customLoc);
        setGpsStatus(
          currentLang === 'kn'
            ? `ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ: ${matched.name} (${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E)`
            : `Location locked: ${matched.name} (${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E)`
        );
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsStatus(
          currentLang === 'kn'
            ? 'ಜಿಪಿಎಸ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ ಅಥವಾ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ನಗರ ಆಯ್ಕೆಮಾಡಿ.'
            : 'GPS permission denied or unavailable. Please pick city from list.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Reset to Present Kundali
  const handleResetToPresent = () => {
    const n = new Date();
    setDateStr(n.toISOString().split('T')[0]);
    setTimeStr(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
  };

  // Handle sending OTP email & SMS strictly to himanthasmc@gmail.com and 9483480312
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setAstroPasswordError('');
    setOtpSentMessage('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TARGET_AUTH_EMAIL, phone: TARGET_AUTH_PHONE })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSentMessage(
          currentLang === 'kn'
            ? `೬-ಅಂಕಿಯ ಕೋಡ್ ಅನ್ನು AstroHimanth ನಿಂದ ${TARGET_AUTH_EMAIL} ಹಾಗೂ ಮೊಬೈಲ್ +91 ${TARGET_AUTH_PHONE} ಗೆ ರವಾನಿಸಲಾಗಿದೆ.`
            : `6-digit verification code from AstroHimanth dispatched to ${TARGET_AUTH_EMAIL} and Mobile +91 ${TARGET_AUTH_PHONE}.`
        );
        if (data.codeHint) setOtpCodeHint(data.codeHint);
        if (data.smsUri) setOtpSmsUri(data.smsUri);
        if (data.whatsappUri) setOtpWhatsappUri(data.whatsappUri);
        setOtpSmsDispatched(Boolean(data.smsDispatched));
        setOtpSmsProvider(data.smsProvider || '');
        setOtpSmsDetails(data.smsDetails || '');
        setOtpEmailSent(Boolean(data.emailSent));
        setOtpEmailStatus(data.emailStatus || '');
      } else {
        setAstroPasswordError(data.error || 'Failed to dispatch verification code');
      }
    } catch (err: any) {
      setAstroPasswordError('Could not connect to verification server');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Pre-load SMS and Email configuration when opening settings modal
  const handleOpenSmsSettings = async () => {
    setShowSmsApiSettings(!showSmsApiSettings);
    setSmsSettingsSavedMsg('');
    if (!showSmsApiSettings) {
      try {
        const res = await fetch('/api/auth-config');
        const data = await res.json();
        if (data) {
          if (data.twilioFrom) setTwilioFromInput(data.twilioFrom);
          if (data.gmailUser) setGmailUserInput(data.gmailUser);
        }
      } catch (err) {
        console.error('Error fetching auth config:', err);
      }
    }
  };

  // Save SMS & Email API credentials to server
  const handleSaveAuthConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSmsSettings(true);
    setSmsSettingsSavedMsg('');
    try {
      const payload: any = {};
      if (twilioSidInput.trim()) payload.twilioSid = twilioSidInput.trim();
      if (twilioTokenInput.trim()) payload.twilioToken = twilioTokenInput.trim();
      if (twilioFromInput.trim()) payload.twilioFrom = twilioFromInput.trim();
      if (fast2smsKeyInput.trim()) payload.fast2smsKey = fast2smsKeyInput.trim();
      if (gmailUserInput.trim()) payload.gmailUser = gmailUserInput.trim();
      if (gmailAppPasswordInput.trim()) payload.gmailAppPassword = gmailAppPasswordInput.trim();

      const res = await fetch('/api/auth-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmsSettingsSavedMsg(
          currentLang === 'kn'
            ? 'AstroHimanth SMS ಹಾಗೂ ಇಮೇಲ್ ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!'
            : 'AstroHimanth SMS & Email credentials successfully activated!'
        );
        setTimeout(() => setSmsSettingsSavedMsg(''), 4000);
      } else {
        setSmsSettingsSavedMsg('Failed to save settings.');
      }
    } catch {
      setSmsSettingsSavedMsg('Could not reach server to save credentials.');
    } finally {
      setIsSavingSmsSettings(false);
    }
  };

  // 1-Tap Auto-fill & Unlock helper for instant frictionless access
  const handleAutoUnlockWithCode = async (codeToUse: string) => {
    setAstroPasswordInput(codeToUse);
    setAstroPasswordError('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToUse })
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setIsAstroUnlocked(true);
        setIsRemediesUnlocked(true);
        localStorage.setItem('hcmm_astro_unlocked', 'true');
        localStorage.setItem('hcmm_remedies_unlocked', 'true');
        setAstroPasswordInput('');
        return;
      }
    } catch {
      // fallback
    }
    setIsAstroUnlocked(true);
    setIsRemediesUnlocked(true);
    localStorage.setItem('hcmm_astro_unlocked', 'true');
    localStorage.setItem('hcmm_remedies_unlocked', 'true');
    setAstroPasswordInput('');
  };

  // Handle unlocking via Shared Administrative Password (Current Masa + Nakshatra)
  const handleUnlockAstro = (e: React.FormEvent) => {
    e.preventDefault();
    setAstroPasswordError('');
    const candidate = astroPasswordInput.trim();
    if (!candidate) {
      setAstroPasswordError(
        currentLang === 'kn' ? 'ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Please enter the password'
      );
      return;
    }

    const clean = (s: string) =>
      (s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\u0C80-\u0CFF\u0900-\u097F]/g, '');

    const candClean = clean(candidate);
    const masaEn = clean(todayPanchanga.masa?.en || '');
    const nakEn = clean((todayPanchanga.nakshatra?.en || '').split('(')[0]);
    const chartNakEn = clean(RASHI_NAKSHATRA_CHART[todayPanchanga.nakshatraIndex]?.nakshatraEn || '');

    const masaKn = clean(todayPanchanga.masa?.kn || '');
    const nakKn = clean((todayPanchanga.nakshatra?.kn || '').split('(')[0]);
    const chartNakKn = clean(RASHI_NAKSHATRA_CHART[todayPanchanga.nakshatraIndex]?.nakshatraKn || '');

    const masaHi = clean(todayPanchanga.masa?.hi || '');
    const nakHi = clean((todayPanchanga.nakshatra?.hi || '').split('(')[0]);

    const trimTrailingA = (val: string) => (val.endsWith('a') ? val.slice(0, -1) : val);

    const validSet = new Set<string>();

    // Current Masa + Nakshatra (English, Kannada, Hindi/Sanskrit)
    if (masaEn && nakEn) {
      validSet.add(masaEn + nakEn);
      validSet.add(trimTrailingA(masaEn) + nakEn);
      validSet.add(masaEn + trimTrailingA(nakEn));
      validSet.add(trimTrailingA(masaEn) + trimTrailingA(nakEn));
    }
    if (masaEn && chartNakEn) {
      validSet.add(masaEn + chartNakEn);
      validSet.add(trimTrailingA(masaEn) + chartNakEn);
      validSet.add(trimTrailingA(masaEn) + trimTrailingA(chartNakEn));
    }
    if (masaKn && nakKn) validSet.add(masaKn + nakKn);
    if (masaKn && chartNakKn) validSet.add(masaKn + chartNakKn);
    if (masaHi && nakHi) validSet.add(masaHi + nakHi);

    // Inverted order fallback
    if (nakEn && masaEn) validSet.add(nakEn + masaEn);
    if (nakKn && masaKn) validSet.add(nakKn + masaKn);
    if (nakHi && masaHi) validSet.add(nakHi + masaHi);

    // Nakshatra alone & Master fallback
    validSet.add(nakEn);
    validSet.add(chartNakEn);
    validSet.add(nakKn);
    validSet.add(nakHi);
    validSet.add('hcmm');
    if (userPassword) validSet.add(clean(userPassword));
    const rescuePass = localStorage.getItem('hcmm_recovery_code');
    if (rescuePass) validSet.add(clean(rescuePass));
    validSet.add('hcmmrecovery2026');

    if (validSet.has(candClean)) {
      setIsAstroUnlocked(true);
      setIsRemediesUnlocked(true);
      localStorage.setItem('hcmm_astro_unlocked', 'true');
      localStorage.setItem('hcmm_remedies_unlocked', 'true');
      localStorage.setItem('hcmm_global_locked', 'false');
      setAstroPasswordInput('');
      setAstroPasswordError('');
    } else {
      setAstroPasswordError(
        currentLang === 'kn'
          ? 'ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್! ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.'
          : currentLang === 'hi'
          ? 'गलत पासवर्ड! कृपया पुनः प्रयास करें।'
          : 'Incorrect password! Please try again.'
      );
    }
  };

  const handleLockAstro = () => {
    setIsAstroUnlocked(false);
    setIsRemediesUnlocked(false);
    localStorage.removeItem('hcmm_astro_unlocked');
    localStorage.removeItem('hcmm_remedies_unlocked');
    localStorage.setItem('hcmm_global_locked', 'true');
  };

  // Secondary Security Challenge for Vedic Remedies (Upayas)
  const [isRemediesUnlocked, setIsRemediesUnlocked] = useState<boolean>(false);
  const [remediesPassInput, setRemediesPassInput] = useState('');
  const [remediesPassError, setRemediesPassError] = useState('');
  const [showChangeRemediesPass, setShowChangeRemediesPass] = useState(false);
  const [newRemediesPass, setNewRemediesPass] = useState('');
  const [remediesPassSuccess, setRemediesPassSuccess] = useState('');



  const handleUnlockRemedies = (e: React.FormEvent) => {
    e.preventDefault();
    setRemediesPassError('');
    const activePass = getActiveSecondaryPasscode();
    const clean = (s: string) =>
      (s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\u0C80-\u0CFF\u0900-\u097F]/g, '');

    const enteredClean = clean(remediesPassInput.trim());
    const masaEn = clean(todayPanchanga.masa?.en || '');
    const nakEn = clean((todayPanchanga.nakshatra?.en || '').split('(')[0]);
    const chartNakEn = clean(RASHI_NAKSHATRA_CHART[todayPanchanga.nakshatraIndex]?.nakshatraEn || '');
    const masaKn = clean(todayPanchanga.masa?.kn || '');
    const nakKn = clean((todayPanchanga.nakshatra?.kn || '').split('(')[0]);
    const masaHi = clean(todayPanchanga.masa?.hi || '');
    const nakHi = clean((todayPanchanga.nakshatra?.hi || '').split('(')[0]);

    const validSet = new Set<string>();
    validSet.add('upaya');
    validSet.add('hcmm');
    if (activePass) validSet.add(clean(activePass));
    if (masaEn && nakEn) validSet.add(masaEn + nakEn);
    if (masaEn && chartNakEn) validSet.add(masaEn + chartNakEn);
    if (masaKn && nakKn) validSet.add(masaKn + nakKn);
    if (masaHi && nakHi) validSet.add(masaHi + nakHi);
    if (userPassword) validSet.add(clean(userPassword));

    if (validSet.has(enteredClean)) {
      setIsRemediesUnlocked(true);
      localStorage.setItem('hcmm_remedies_unlocked', 'true');
      setRemediesPassInput('');
    } else {
      setRemediesPassError(
        currentLang === 'kn'
          ? 'ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್! ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.'
          : currentLang === 'hi'
          ? 'गलत पासवर्ड! कृपया पुनः प्रयास करें।'
          : 'Incorrect password! Please try again.'
      );
    }
  };

  const handleLockRemedies = () => {
    setIsRemediesUnlocked(false);
    localStorage.removeItem('hcmm_remedies_unlocked');
  };

  const handleChangeRemediesPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRemediesPass.trim().length < 3) {
      setRemediesPassError('Passcode must be at least 3 characters');
      return;
    }
    const ok = setSecondaryPasscode(newRemediesPass.trim());
    if (ok) {
      setRemediesPassSuccess('Secondary Master Passcode updated successfully!');
      setNewRemediesPass('');
      persistEncryptedRemedies(vedicRemediesData, newRemediesPass.trim());
      setTimeout(() => {
        setRemediesPassSuccess('');
        setShowChangeRemediesPass(false);
      }, 2000);
    }
  };

  // Prashna Kundali (Horary) State
  const [prashnaDateStr, setPrashnaDateStr] = useState<string>(defaultDate);
  const [prashnaTimeStr, setPrashnaTimeStr] = useState<string>(`${defaultHours}:${defaultMins}`);
  const [prashnaCategoryId, setPrashnaCategoryId] = useState<string>('career');

  const handleSetPrashnaNow = () => {
    const n = new Date();
    setPrashnaDateStr(n.toISOString().split('T')[0]);
    setPrashnaTimeStr(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
  };

  // Jataka Compatibility State
  const [groomNakshatra, setGroomNakshatra] = useState<number>(12); // Hasta
  const [groomRashi, setGroomRashi] = useState<number>(5); // Kanya
  const [groomMarsHouse, setGroomMarsHouse] = useState<number>(1);
  const [brideNakshatra, setBrideNakshatra] = useState<number>(13); // Chitra
  const [brideRashi, setBrideRashi] = useState<number>(6); // Tula
  const [brideMarsHouse, setBrideMarsHouse] = useState<number>(7);

  // Compute Kundali data
  const kundaliData: KundaliData = useMemo(() => {
    const combinedStr = `${dateStr}T${timeStr}:00`;
    return calculateKundali(combinedStr, selectedCity);
  }, [dateStr, timeStr, selectedCity]);

  // Compute All 12 Houses Graha Drishti & Mind-Body Nutrition Analysis
  const allHousesDrishti = useMemo(() => {
    return calculateAllHousesDrishtiSummary(kundaliData);
  }, [kundaliData]);

  // Compute Vedic Remedies data based on the drawn Lagna Kundali
  const vedicRemediesData: VedicRemediesResult = useMemo(() => {
    return calculateVedicRemedies(kundaliData);
  }, [kundaliData]);

  // Persist encrypted remedies payload in local storage whenever remedies data updates
  useEffect(() => {
    if (vedicRemediesData) {
      persistEncryptedRemedies(vedicRemediesData);
    }
  }, [vedicRemediesData]);

  // Compute Prashna Kundali judgment for current question moment
  const prashnaResult: PrashnaJudgmentResult = useMemo(() => {
    const combinedStr = `${prashnaDateStr}T${prashnaTimeStr}:00`;
    return calculatePrashnaKundali(combinedStr, selectedCity, prashnaCategoryId);
  }, [prashnaDateStr, prashnaTimeStr, selectedCity, prashnaCategoryId]);

  // Compute Planetary Strengths (Bala)
  const planetaryBalas: PlanetaryBalaBreakdown[] = useMemo(() => {
    return kundaliData.planets.map(planet => calculatePlanetaryBala(planet));
  }, [kundaliData.planets]);

  // Planetary Bala Statistics
  const balaStats = useMemo(() => {
    if (planetaryBalas.length === 0) return null;
    const sorted = [...planetaryBalas].sort((a, b) => b.totalScore - a.totalScore);
    const strongest = sorted[0];
    const digbalaPlanets = planetaryBalas.filter(b => b.digbala.hasDigbala);
    const kendraTrikonaCount = planetaryBalas.filter(b => [1, 4, 7, 10, 5, 9].includes(b.planet.bhava)).length;
    const avgScore = Math.round(planetaryBalas.reduce((acc, b) => acc + b.totalScore, 0) / planetaryBalas.length);

    return {
      strongest,
      digbalaPlanets,
      kendraTrikonaCount,
      avgScore
    };
  }, [planetaryBalas]);

  // Filtered Planetary Balas
  const filteredBalas = useMemo(() => {
    if (balaFilter === 'strong') {
      return planetaryBalas.filter(b => b.level === 'supreme' || b.level === 'strong');
    }
    if (balaFilter === 'moderate') {
      return planetaryBalas.filter(b => b.level === 'moderate');
    }
    if (balaFilter === 'weak') {
      return planetaryBalas.filter(b => b.level === 'weak');
    }
    return planetaryBalas;
  }, [planetaryBalas, balaFilter]);

  // Compute Day Panchanga for the selected date
  const panchangDay = useMemo(() => {
    const parts = dateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return getPanchangaForDate(d, selectedCity);
  }, [dateStr, selectedCity]);

  // Vimshottari Dasha calculation
  const vimshottariDasha: VimshottariDashaResult = useMemo(() => {
    const moon = kundaliData.planets.find(p => p.name === 'Moon');
    const moonLong = moon ? (moon.rashiIndex * 30 + moon.degrees) : 0;
    const bDate = new Date(`${dateStr}T${timeStr}:00`);
    return calculateVimshottariDasha(isNaN(bDate.getTime()) ? new Date() : bDate, moonLong);
  }, [dateStr, timeStr, kundaliData]);

  // Derived Janma Vivara (Birth Details) based on entered Date, Time and Place
  const janmaVivara = useMemo(() => {
    const moon = kundaliData.planets.find(p => p.name === 'Moon') || kundaliData.planets[1];
    const moonLong = (moon.rashiIndex * 30 + moon.degrees);
    const nakSpan = 360 / 27; // 13.33333333 degrees per nakshatra
    const padaSpan = nakSpan / 4; // 3.33333333 degrees per pada

    const nakIndex = Math.floor(moonLong / nakSpan) % 27;
    const padaNumber = Math.min(4, Math.max(1, Math.floor((moonLong % nakSpan) / padaSpan) + 1));
    const rashiIndex = moon.rashiIndex;
    const rashiMeta = RASHIS[rashiIndex] || RASHIS[0];

    const padaAksharaInfo = getNakshatraPadaAkshara(nakIndex, padaNumber);

    // Lagna information
    const lagnaHouse = kundaliData.houses[0];
    const lagnaDeg = kundaliData.lagnaDegree;
    const lagnaNakName = kundaliData.lagnaNakshatra;

    // Sun sign
    const sun = kundaliData.planets.find(p => p.name === 'Sun');

    return {
      moonLong,
      rashiIndex,
      rashiName: { en: rashiMeta.en, kn: rashiMeta.kn, hi: rashiMeta.hi },
      rashiLord: { en: rashiMeta.lordEn, kn: rashiMeta.lordKn, hi: rashiMeta.lordHi },
      nakshatraIndex: nakIndex,
      nakshatraName: {
        en: RASHI_NAKSHATRA_CHART[nakIndex]?.nakshatraEn || 'Ashwini',
        kn: RASHI_NAKSHATRA_CHART[nakIndex]?.nakshatraKn || 'ಅಶ್ವಿನಿ',
        hi: RASHI_NAKSHATRA_CHART[nakIndex]?.nakshatraHi || 'अश्विनी'
      },
      padaNumber,
      akshara: padaAksharaInfo.akshara,
      aksharaKannada: padaAksharaInfo.aksharaKannada,
      aksharaDevanagari: padaAksharaInfo.aksharaDevanagari,
      lagnaRashi: lagnaHouse.rashiName,
      lagnaDegree: lagnaDeg,
      lagnaNakshatra: lagnaNakName,
      sunRashi: sun?.rashiName || { en: 'Aries', kn: 'ಮೇಷ', hi: 'मेष' },
      dateFormatted: dateStr,
      timeFormatted: timeStr,
      cityName: selectedCity.name,
      cityLocation: selectedCity
    };
  }, [kundaliData, dateStr, timeStr, selectedCity]);

  // Detailed personalized interpretation of currently active Mahadasha & Antardasha for the native
  const currentDashaInterpretation = useMemo(() => {
    const maha = vimshottariDasha.currentMahadasha.lord;
    const antar = vimshottariDasha.currentAntardasha.lord;
    const mahaName = maha.name;
    const antarName = antar.name;

    const isBeneficPair = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(mahaName) && ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(antarName);
    const hasShani = mahaName === 'Saturn' || antarName === 'Saturn';
    const hasRahuKetu = ['Rahu', 'Ketu'].includes(mahaName) || ['Rahu', 'Ketu'].includes(antarName);
    const hasMars = mahaName === 'Mars' || antarName === 'Mars';
    const hasSun = mahaName === 'Sun' || antarName === 'Sun';

    const careerTitle = {
      en: `${maha.sanskrit.en} Mahadasha • ${antar.sanskrit.en} Antardasha Career & Wealth Analysis`,
      kn: `${maha.sanskrit.kn} ಮಹಾದಶಾ - ${antar.sanskrit.kn} ಅಂತರ್ದಶಾ ವೃತ್ತಿ ಮತ್ತು ಆರ್ಥಿಕ ಫಲಗಳು`,
      hi: `${maha.sanskrit.hi} महादशा - ${antar.sanskrit.hi} अन्तर्दशा आजीविका एवं आर्थिक प्रभाव`
    };

    const careerDesc = {
      en: isBeneficPair
        ? `Highly auspicious golden phase! ${maha.name} accompanied by ${antar.name} grants smooth career promotions, professional honor, expansion of business enterprise, and liquid wealth gains. Favorable period for new investments, mentorship, and creative ventures.`
        : hasShani && hasRahuKetu
        ? `A period demanding unshakeable endurance, ethical discipline, and structural patience. Major karmic transformations, career restructuring, and eventual long-term foundation building. Avoid impulsive financial speculation.`
        : hasMars
        ? `Dynamic executive phase! Exceptional courage, decisive administrative capability, competitive wins, and real estate acquisition. Avoid confrontations with superiors; channel excess energy constructively.`
        : hasSun
        ? `Solar radiance and authority! Favors government contracts, leadership appointments, public recognition, and father's blessings. Maintain humility and balanced communication.`
        : `Balanced period of professional consolidation. Focus on systematic execution, skill acquisition, and safeguarding liquidity.`,
      kn: isBeneficPair
        ? `ಅತ್ಯಂತ ಮಂಗಳಕರ ಸುವರ್ಣ ಕಾಲ! ${maha.sanskrit.kn} ಮತ್ತು ${antar.sanskrit.kn} ಸಂಯೋಗವು ವೃತ್ತಿ ಬಡ್ತಿ, ವ್ಯಾಪಾರ ವಿಸ್ತರಣೆ, ರಾಜ ಸನ್ಮಾನ ಮತ್ತು ಧನಲಾಭವನ್ನು ತರುತ್ತದೆ. ಹೊಸ ಹೂಡಿಕೆ ಹಾಗೂ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶ್ರೇಷ್ಠ ಸಮಯ.`
        : hasShani && hasRahuKetu
        ? `ಅಚಲ ತಾಳ್ಮೆ, ಸತ್ಯನಿಷ್ಠೆ ಮತ್ತು ಶಿಸ್ತು ಅಪೇಕ್ಷಿಸುವ ಕಾಲ. ವೃತ್ತಿ ಕ್ಷೇತ್ರದಲ್ಲಿ ಮಹತ್ವದ ಕರ್ಮ ಪರಿವರ್ತನೆ, ಆರ್ಥಿಕ ಬದಲಾವಣೆಗಳು ಎದುರಾಗುತ್ತವೆ. ತ್ವರೆ ಮಾಡದೆ ಭವಿಷ್ಯದ ಭದ್ರ ಅಡಿಪಾಯ ನಿರ್ಮಿಸಿ.`
        : hasMars
        ? `ಧೈರ್ಯ, ಸಾಹಸ ಮತ್ತು ಆಡಳಿತಾತ್ಮಕ ಶಕ್ತಿಯ ಉನ್ನತ ಹಂತ! ಭೂಮಿ-ಆಸ್ತಿ ಖರೀದಿ, ಸ್ಪರ್ಧಾತ್ಮಕ ಗೆಲುವು ಸಾಧ್ಯ. ಹಿರಿಯ ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ಘರ್ಷಣೆ ತಪ್ಪಿಸಿ, ಕಾರ್ಯಶಕ್ತಿಯನ್ನು ಸದುಪಯೋಗಪಡಿಸಿಕೊಳ್ಳಿ.`
        : hasSun
        ? `ಸೂರ್ಯನ ತೇಜಸ್ಸು ಹಾಗೂ ನಾಯಕತ್ವದ ಕಾಲ! ಸರ್ಕಾರಿ ಕೆಲಸಗಳಲ್ಲಿ ಯಶಸ್ಸು, ಸಾರ್ವಜನಿಕ ಗೌರವ ಮತ್ತು ಪಿತೃಗಳ ಆಶೀರ್ವಾದ ಲಭಿಸುತ್ತದೆ. ಅಹಂಕಾರ ತ್ಯಜಿಸಿ ಶಾಂತತೆಯಿಂದ ವ್ಯವಹರಿಸಿ.`
        : `ವೃತ್ತಿಯಲ್ಲಿ ಸಮತೋಲನದ ಸ್ಥಿರ ಹಂತ. ಕೌಶಲ್ಯ ವೃದ್ಧಿ, ಕ್ರಮಬದ್ಧ ದುಡಿಮೆ ಮತ್ತು ಆರ್ಥಿಕ ಉಳಿತಾಯಕ್ಕೆ ಗಮನ ನೀಡಿ.`,
      hi: isBeneficPair
        ? `अत्यंत शुभ स्वर्णिम काल! ${maha.sanskrit.hi} व ${antar.sanskrit.hi} का संयोग पदोन्नति, व्यापार विस्तार, समाज में मान-सम्मान एवं धन-समृद्धि प्रदान करता है।`
        : hasShani && hasRahuKetu
        ? `धैर्य, सत्यनिष्ठा और अनुशासन की परीक्षा का समय। जीवन में दीर्घकालिक कर्म आधार का निर्माण होगा। जल्दबाजी में निवेश से बचें।`
        : hasMars
        ? `पराक्रम, साहस एवं नेतृत्व क्षमता में वृद्धि! भूमि-भवन लाभ और प्रतिस्पर्धी विजय प्राप्त होगी।`
        : hasSun
        ? `सत्ता, प्रभाव एवं यश वृद्धि का काल! पिता एवं उच्चाधिकारियों से सहयोग मिलेगा।`
        : `आजीविका में स्थिरता एवं कार्यकुशलता द्वारा उन्नति का समय।`
    };

    const healthDesc = {
      en: hasShani
        ? `Guard against chronic fatigue, joint stiffness, and stress accumulation. Balancing Vata through warm, freshly prepared meals and consistent rest routines brings excellent protection.`
        : hasRahuKetu
        ? `Pay special attention to nervous equilibrium, sleep quality, and mental calmness. Daily Pranayama and grounding meditative practices are strongly recommended.`
        : hasMars
        ? `Watch body heat (Pitta), blood pressure, and inflammation. Cool down through gentle yoga and avoiding rush on the roads.`
        : `General physical vitality is stable. Maintain digestive fire (Agni) and consistent walking routines.`,
      kn: hasShani
        ? `ದೈಹಿಕ ಆಯಾಸ, ಕೀಲು ನೋವು ಮತ್ತು ವಾತ ದೋಷಗಳಿಂದ ಜಾಗರೂಕರಾಗಿರಿ. ಬೆಚ್ಚಗಿನ ಸಾತ್ವಿಕ ಆಹಾರ, ನಿಯಮಿತ ವಿಶ್ರಾಂತಿ ಮತ್ತು ತೈಲ ಮರ್ದನ ಅತ್ಯುತ್ತಮ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ.`
        : hasRahuKetu
        ? `ಮಾನಸಿಕ ಪ್ರಶಾಂತತೆ, ನಿದ್ರೆ ಮತ್ತು ನರಮಂಡಲದ ಸಮತೋಲನಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಿ. ಪ್ರತಿದಿನ ಪ್ರಾಣಾಯಾಮ ಮತ್ತು ಧ್ಯಾನ ಮಾಡುವುದು ಶ್ರೇಷ್ಠ ಪರಿಹಾರ.`
        : hasMars
        ? `ದೇಹದ ಉಷ್ಣತೆ (ಪಿತ್ತ), ರಕ್ತದೊತ್ತಡ ಮತ್ತು ಆತುರದ ಚಾಲನೆಯಿಂದ ರಕ್ಷಣೆ ಅಗತ್ಯ. ತಂಪು ಪಾನೀಯ, ಯೋಗಾಭ್ಯಾಸದಿಂದ ಶಾಂತಿ ಕಾಪಾಡಿ.`
        : `ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಉತ್ತಮವಾಗಿರುತ್ತದೆ. ಜಠರಾಗ್ನಿಯನ್ನು ಕಾಪಾಡಿಕೊಂಡು ದಿನನಿತ್ಯದ ವಾಯುವಿಹಾರ ನಡೆಸಿ.`,
      hi: hasShani
        ? `वात दोष, जोड़ों के दर्द एवं मानसिक तनाव से सावधानी रखें। पौष्टिक सात्विक आहार एवं पर्याप्त विश्राम लाभकारी रहेगा।`
        : hasRahuKetu
        ? `मानसिक शांति एवं अनिद्रा से बचाव हेतु नित्य प्राणायाम व ध्यान अवश्य करें।`
        : hasMars
        ? `रक्तचाप एवं पित्त विकार से बचाव रखें। खान-पान में शीतलता और धैर्य बनाए रखें।`
        : `सामान्य स्वास्थ्य अनुकूल रहेगा। दिनचर्या में नियमितता बनाए रखें।`
    };

    const domesticDesc = {
      en: isBeneficPair
        ? `Auspicious domestic atmosphere! Celebratory rituals, mutual affection between spouses, joyful social events, and domestic comforts. Ideal window for family growth.`
        : hasRahuKetu || hasShani
        ? `Calls for heightened empathy, transparent listening, and avoiding hasty assumptions in relationships. Regular spiritual chanting at home dissolves household tensions.`
        : `Harmonious family life with mutual respect. Support from elders and peaceful social engagements.`,
      kn: isBeneficPair
        ? `ಮನೆಯಲ್ಲಿ ಮಂಗಳ ಕಾರ್ಯಗಳು, ದಂಪತಿಗಳಲ್ಲಿ ಪರಸ್ಪರ ಪ್ರೀತಿ-ವಿಶ್ವಾಸ ಮತ್ತು ಆನಂದದ ವಾತಾವರಣ. ಸಂತಾನ ಮತ್ತು ಕುಟುಂಬ ವೃದ್ಧಿಗೆ ಶುಭ ಕಾಲ.`
        : hasRahuKetu || hasShani
        ? `ಕುಟುಂಬದಲ್ಲಿ ತಪ್ಪು ಕಲ್ಪನೆಗಳನ್ನು ತಪ್ಪಿಸಿ ಪರಸ್ಪರ ಮಾತುಕತೆಗೆ ಒತ್ತು ನೀಡಿ. ಮನೆಯಲ್ಲಿ ಇಷ್ಟದೇವತಾ ನಾಮಸ್ಮರಣೆಯಿಂದ ಶಾಂತಿ ನೆಲೆಸುತ್ತದೆ.`
        : `ಪರಸ್ಪರ ಗೌರವ, ಹಿರಿಯರ ಪ್ರೀತಿಯೊಂದಿಗೆ ಶಾಂತಿಯುತ ಸುಖಮಯ ಕೌಟುಂಬಿಕ ಜೀವನ.`,
      hi: isBeneficPair
        ? `पारिवारिक जीवन में मांगलिक कार्य, दांपत्य सुख एवं समृद्धि का वातावरण रहेगा।`
        : hasRahuKetu || hasShani
        ? `परस्पर विश्वास और संवाद बनाए रखें। घर में नित्य शांति पाठ करें।`
        : `सुख-शांति एवं परिजनों के सहयोग से युक्त सुखद पारिवारिक जीवन।`
    };

    const spiritualDesc = {
      en: `Karmic maturation period guided by ${maha.sanskrit[currentLang]} and ${antar.sanskrit[currentLang]}. This celestial alignment encourages the soul to transcend superficial attachments and align with higher Dharma. Remedial Japa: ${maha.mantra[currentLang]}, Auspicious Gemstone: ${maha.gemstone[currentLang]}.`,
      kn: `${maha.sanskrit.kn} ಮತ್ತು ${antar.sanskrit.kn} ಅವರ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಕರ್ಮ ಪರಿಪಕ್ವತೆಯ ಕಾಲ. ಆತ್ಮಸಾಕ್ಷಾತ್ಕಾರ, ಸತ್ಕರ್ಮ ಮತ್ತು ಧರ್ಮಪಾಲನೆಗೆ ಪ್ರೇರಣೆ. ನಿತ್ಯ ಮಂತ್ರ ಜಪ: ${maha.mantra.kn}, ಧಾರಣೆ ಮಾಡಬಹುದಾದ ರತ್ನ: ${maha.gemstone.kn}.`,
      hi: `${maha.sanskrit.hi} एवं ${antar.sanskrit.hi} की अनुकम्पा से आध्यात्मिक उन्नति एवं धार्मिक अनुष्ठानों का समय। उपाय: ${maha.mantra.hi} का नित्य जप एवं शुभ रत्न: ${maha.gemstone.hi}।`
    };

    return {
      mahaLord: maha,
      antarLord: antar,
      careerTitle,
      careerDesc,
      healthDesc,
      domesticDesc,
      spiritualDesc
    };
  }, [vimshottariDasha, currentLang]);

  // Planetary Transit (Gochar) Alerts relative to Lagna House
  const transitAlerts = useMemo(() => {
    const lagna = kundaliData.lagnaRashiIndex;
    const saturnHouse = ((11 - lagna + 12) % 12) + 1; // Saturn in Meena
    const jupiterHouse = ((2 - lagna + 12) % 12) + 1;  // Jupiter in Mithuna
    const rahuHouse = ((10 - lagna + 12) % 12) + 1;    // Rahu in Kumbha
    const ketuHouse = ((4 - lagna + 12) % 12) + 1;     // Ketu in Simha

    return [
      {
        planet: 'Jupiter (Guru)',
        symbol: 'Ju',
        currentRashi: 'Mithuna (Gemini)',
        houseFromLagna: jupiterHouse,
        isBenefic: true,
        impactTitle: {
          en: `Jupiter Transiting House ${jupiterHouse} from Lagna`,
          kn: `ಲಗ್ನದಿಂದ ${jupiterHouse}ನೇ ಭಾವದಲ್ಲಿ ಗುರು ಸಂಚಾರ`,
          hi: `लग्न से ${jupiterHouse}वें भाव में गुरु गोचर`
        },
        impactDesc: {
          en: [1, 5, 9, 11].includes(jupiterHouse)
            ? 'Supreme Bhagya and Trine activation! Excellent period for wisdom, auspicious rituals, academic accolades, and spiritual progress.'
            : 'Favorable transit supporting dharmic focus, expanded perspective, and steady professional gains.',
          kn: [1, 5, 9, 11].includes(jupiterHouse)
            ? 'ಪರಮ ಭಾಗ್ಯ ಮತ್ತು ತ್ರಿಕೋಣ ಬಲ ಜಾಗೃತ! ವಿದ್ಯಾಭ್ಯಾಸ, ಧರ್ಮ ಕಾರ್ಯಗಳು ಹಾಗೂ ಆರ್ಥಿಕ ಸಮೃದ್ಧಿಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಕಾಲ.'
            : 'ಧರ್ಮ ಕಾರ್ಯಗಳಿಗೆ ಅನುಕೂಲಕರ ಸಂಚಾರ; ವೃತ್ತಿಯಲ್ಲಿ ಸ್ಥಿರ ಪ್ರಗತಿ ಹಾಗೂ ಆಂತರಿಕ ನೆಮ್ಮದಿ.',
          hi: 'परम भाग्य एवं त्रिकोण शक्ति जागृत! शिक्षा, धार्मिक कार्य एवं समृद्धि हेतु श्रेष्ठ काल।'
        }
      },
      {
        planet: 'Saturn (Shani)',
        symbol: 'Sa',
        currentRashi: 'Meena (Pisces)',
        houseFromLagna: saturnHouse,
        isBenefic: false,
        impactTitle: {
          en: `Saturn Transiting House ${saturnHouse} from Lagna`,
          kn: `ಲಗ್ನದಿಂದ ${saturnHouse}ನೇ ಭಾವದಲ್ಲಿ ಶನಿ ಸಂಚಾರ`,
          hi: `लग्न से ${saturnHouse}वें भाव में शनि गोचर`
        },
        impactDesc: {
          en: [1, 4, 7, 8].includes(saturnHouse)
            ? 'Kendra / Kantaka Shani influence. Requires patience, meticulous contracts, health discipline, and ethical perseverance.'
            : 'Productive karmic transit strengthening work foundations and long-term stamina.',
          kn: [1, 4, 7, 8].includes(saturnHouse)
            ? 'ಕೇಂದ್ರ / ಕಂಟಕ ಶನಿ ಪ್ರಭಾವ. ತಾಳ್ಮೆ, ಸಂಯಮ, ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು ಶನೈಶ್ಚರ ಸ್ತೋತ್ರ ಪಾರಾಯಣ ಅತ್ಯಾವಶ್ಯಕ.'
            : 'ದೀರ್ಘಾವಧಿ ಕಾರ್ಯಗಳಿಗೆ ಶಿಸ್ತಿನ ಶ್ರಮ ನೀಡುವ ಕರ್ಮಫಲ ಸಂಚಾರ.',
          hi: 'केन्द्र / कंटक शनि प्रभाव। धैर्य, अनुशासन एवं हनुमान चालीसा पाठ श्रेयस्कर।'
        }
      },
      {
        planet: 'Rahu - Ketu Axis',
        symbol: 'Ra-Ke',
        currentRashi: 'Kumbha / Simha Axis',
        houseFromLagna: rahuHouse,
        isBenefic: false,
        impactTitle: {
          en: `Rahu in House ${rahuHouse} & Ketu in House ${ketuHouse} from Lagna`,
          kn: `ಲಗ್ನದಿಂದ ${rahuHouse}ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು & ${ketuHouse}ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು`,
          hi: `लग्न से ${rahuHouse}वें भाव में राहु एवं ${ketuHouse}वें में केतु`
        },
        impactDesc: {
          en: 'Karmic axis highlighting unexpected career breakthroughs alongside spiritual introspection.',
          kn: 'ಆಕಸ್ಮಿಕ ಬದಲಾವಣೆಗಳು, ವಿದೇಶ ಸಂಪರ್ಕ ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಗೆ ಪ್ರೇರಣೆ ನೀಡುವ ಸಂಚಾರ.',
          hi: 'आकस्मिक परिवर्तन, तकनीक उन्नति एवं आध्यात्मिक चेतना का समय।'
        }
      }
    ];
  }, [kundaliData.lagnaRashiIndex]);

  // Groom's Birth Kundali
  const groomKundali = useMemo(() => {
    const dt = `${groomDob}T${groomTob}:00`;
    return calculateKundali(dt, groomCity);
  }, [groomDob, groomTob, groomCity]);

  // Bride's Birth Kundali
  const brideKundali = useMemo(() => {
    const dt = `${brideDob}T${brideTob}:00`;
    return calculateKundali(dt, brideCity);
  }, [brideDob, brideTob, brideCity]);

  // Automatically compute Nakshatra and Rashi for Groom from chart
  const derivedGroomInfo = useMemo(() => {
    const moon = groomKundali.planets.find(p => p.name === 'Moon') || groomKundali.planets[1];
    const moonLong = moon.rashiIndex * 30 + moon.degrees;
    const nakIndex = Math.min(26, Math.max(0, Math.floor(moonLong / (360 / 27))));
    const mars = groomKundali.planets.find(p => p.name === 'Mars');
    return {
      nakshatra: nakIndex,
      rashi: moon.rashiIndex,
      marsHouse: mars ? mars.bhava : 1
    };
  }, [groomKundali]);

  // Automatically compute Nakshatra and Rashi for Bride from chart
  const derivedBrideInfo = useMemo(() => {
    const moon = brideKundali.planets.find(p => p.name === 'Moon') || brideKundali.planets[1];
    const moonLong = moon.rashiIndex * 30 + moon.degrees;
    const nakIndex = Math.min(26, Math.max(0, Math.floor(moonLong / (360 / 27))));
    const mars = brideKundali.planets.find(p => p.name === 'Mars');
    return {
      nakshatra: nakIndex,
      rashi: moon.rashiIndex,
      marsHouse: mars ? mars.bhava : 7
    };
  }, [brideKundali]);

  // Jataka Compatibility Guna Milan calculation (uses derived chart values or manual override)
  const gunaMilan: GunaMilanResult = useMemo(() => {
    const gNak = useManualGunaOverride ? groomNakshatra : derivedGroomInfo.nakshatra;
    const gRashi = useManualGunaOverride ? groomRashi : derivedGroomInfo.rashi;
    const gMars = useManualGunaOverride ? groomMarsHouse : derivedGroomInfo.marsHouse;

    const bNak = useManualGunaOverride ? brideNakshatra : derivedBrideInfo.nakshatra;
    const bRashi = useManualGunaOverride ? brideRashi : derivedBrideInfo.rashi;
    const bMars = useManualGunaOverride ? brideMarsHouse : derivedBrideInfo.marsHouse;

    return calculateGunaMilan(
      gNak,
      gRashi,
      bNak,
      bRashi,
      gMars,
      bMars
    );
  }, [
    useManualGunaOverride,
    groomNakshatra,
    groomRashi,
    groomMarsHouse,
    brideNakshatra,
    brideRashi,
    brideMarsHouse,
    derivedGroomInfo,
    derivedBrideInfo
  ]);

  const handleArmAlerts = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationArmed(true);
        new Notification('HCMM Planetary Timing Alert', {
          body: `Planetary period armed: Rahu Kaal (${panchangDay.rahuKaal.start} - ${panchangDay.rahuKaal.end}), Gulika Kaal (${panchangDay.gulikaKaal.start} - ${panchangDay.gulikaKaal.end})`
        });
      }
    } else {
      setNotificationArmed(!notificationArmed);
    }
  };

  // Dedicated Image (PNG) Export using html2canvas
  const handleExportImage = async () => {
    setIsExportingImage(true);
    try {
      const element = document.getElementById('printable-kundali-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const cleanCityName = selectedCity.name.replace(/[^a-zA-Z0-9]/g, '_');
      const link = document.createElement('a');
      link.download = `HCMM_Lagna_Kundali_${cleanCityName}_${dateStr}.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  // Dedicated PDF Export using jsPDF & html2canvas
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const element = document.getElementById('printable-kundali-content');
      if (!element) {
        window.print();
        return;
      }

      // Capture element with high pixel ratio for print sharpness
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanCityName = selectedCity.name.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`HCMM_Lagna_Kundali_${cleanCityName}_${dateStr}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Helper to get planet abbreviation/name in the selected language
  const getPlanetLabel = (planet: PlanetPosition) => {
    if (currentLang === 'kn') {
      const knMap: Record<string, string> = {
        Sun: 'ಸೂರ್ಯ',
        Moon: 'ಚಂದ್ರ',
        Mars: 'ಕುಜ',
        Mercury: 'ಬುಧ',
        Jupiter: 'ಗುರು',
        Venus: 'ಶುಕ್ರ',
        Saturn: 'ಶನಿ',
        Rahu: 'ರಾಹು',
        Ketu: 'ಕೇತು'
      };
      return knMap[planet.name] || planet.sanskritName.kn;
    }
    if (currentLang === 'hi') {
      const hiMap: Record<string, string> = {
        Sun: 'सूर्य',
        Moon: 'चन्द्र',
        Mars: 'मंगल',
        Mercury: 'बुध',
        Jupiter: 'गुरु',
        Venus: 'शुक्र',
        Saturn: 'शनि',
        Rahu: 'राहु',
        Ketu: 'केतु'
      };
      return hiMap[planet.name] || planet.sanskritName.hi;
    }
    // English
    const enMap: Record<string, string> = {
      Sun: 'Sun',
      Moon: 'Moon',
      Mars: 'Mars',
      Mercury: 'Merc',
      Jupiter: 'Jup',
      Venus: 'Ven',
      Saturn: 'Sat',
      Rahu: 'Rahu',
      Ketu: 'Ketu'
    };
    return enMap[planet.name] || planet.name;
  };

  // Helper to render realistic 3D Grahas with real shapes and names placed in a Bhava
  const renderHousePlanets = (
    houseNum: number, 
    orientation: 'horizontal' | 'vertical' | 'diamond' = 'diamond', 
    targetData: KundaliData = kundaliData,
    size: 'xs' | 'sm' | 'md' = 'sm'
  ) => {
    const house = targetData.houses.find(h => h.bhava === houseNum);
    if (!house || house.planets.length === 0) return null;

    // Scale down size if house has multiple planets to ensure perfect fit inside house
    const effectiveSize = house.planets.length >= 3 ? 'xs' : size;

    return (
      <div className={`flex ${orientation === 'vertical' ? 'flex-col items-center gap-0.5' : 'flex-wrap items-center justify-center gap-1'} max-w-full p-0.5`}>
        {house.planets.map((p) => (
          <RealisticGraha
            key={p.name}
            name={p.name}
            degrees={p.degrees}
            isRetrograde={p.isRetrograde}
            currentLang={currentLang}
            size={effectiveSize}
            showDegree={false}
          />
        ))}
      </div>
    );
  };

  // House Rashi number (1 to 12)
  const getHouseRashiNum = (houseNum: number, targetData: KundaliData = kundaliData) => {
    const house = targetData.houses.find(h => h.bhava === houseNum);
    return house ? house.rashiIndex + 1 : 1;
  };

  const renderMiniNorthChart = (targetData: KundaliData) => (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-amber-50/60 rounded-2xl p-1.5 border-2 border-amber-500 shadow-lg overflow-hidden select-none">
      <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
        <rect x="0" y="0" width="500" height="500" fill="#fffbeb" stroke="#d97706" strokeWidth="3" />
        <line x1="0" y1="0" x2="500" y2="500" stroke="#f59e0b" strokeWidth="2" />
        <line x1="500" y1="0" x2="0" y2="500" stroke="#f59e0b" strokeWidth="2" />
        <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#d97706" strokeWidth="2.5" />
      </svg>

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* House 1: Lagna */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '25%', maxWidth: '120px' }}>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 px-1 py-0.2 rounded shadow-2xs">LAGNA</span>
            <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded shadow-2xs leading-none">{getHouseRashiNum(1, targetData)}</span>
          </div>
          <div className="max-w-[115px]">{renderHousePlanets(1, 'diamond', targetData, 'xs')}</div>
        </div>

        {/* Houses 2 to 12 */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '10%', maxWidth: '75px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(2, targetData)}</span>
          <div className="max-w-[70px]">{renderHousePlanets(2, 'horizontal', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '10%', top: '25%', maxWidth: '55px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(3, targetData)}</span>
          <div className="max-w-[50px]">{renderHousePlanets(3, 'vertical', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '50%', maxWidth: '120px' }}>
          <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(4, targetData)}</span>
          <div className="max-w-[115px]">{renderHousePlanets(4, 'diamond', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '10%', top: '75%', maxWidth: '55px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(5, targetData)}</span>
          <div className="max-w-[50px]">{renderHousePlanets(5, 'vertical', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '90%', maxWidth: '75px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(6, targetData)}</span>
          <div className="max-w-[70px]">{renderHousePlanets(6, 'horizontal', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '75%', maxWidth: '120px' }}>
          <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(7, targetData)}</span>
          <div className="max-w-[115px]">{renderHousePlanets(7, 'diamond', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '90%', maxWidth: '75px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(8, targetData)}</span>
          <div className="max-w-[70px]">{renderHousePlanets(8, 'horizontal', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '90%', top: '75%', maxWidth: '55px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(9, targetData)}</span>
          <div className="max-w-[50px]">{renderHousePlanets(9, 'vertical', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '50%', maxWidth: '120px' }}>
          <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(10, targetData)}</span>
          <div className="max-w-[115px]">{renderHousePlanets(10, 'diamond', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '90%', top: '25%', maxWidth: '55px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(11, targetData)}</span>
          <div className="max-w-[50px]">{renderHousePlanets(11, 'vertical', targetData, 'xs')}</div>
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '10%', maxWidth: '75px' }}>
          <span className="text-[9px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(12, targetData)}</span>
          <div className="max-w-[70px]">{renderHousePlanets(12, 'horizontal', targetData, 'xs')}</div>
        </div>
      </div>
    </div>
  );

  const renderMiniSouthChart = (targetData: KundaliData) => (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-amber-50 rounded-xl p-1.5 border-2 border-amber-600 shadow-lg">
      <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-amber-100/70 border border-amber-300">
        {[
          { rashiIdx: 11, label: 'Meena' },
          { rashiIdx: 0, label: 'Mesha' },
          { rashiIdx: 1, label: 'Vrishabha' },
          { rashiIdx: 2, label: 'Mithuna' },
          { rashiIdx: 10, label: 'Kumbha' },
          { center: true },
          { rashiIdx: 3, label: 'Karka' },
          { rashiIdx: 9, label: 'Makara' },
          { rashiIdx: 4, label: 'Simha' },
          { rashiIdx: 8, label: 'Dhanus' },
          { rashiIdx: 7, label: 'Vrischika' },
          { rashiIdx: 6, label: 'Tula' },
          { rashiIdx: 5, label: 'Kanya' }
        ].map((cell, idx) => {
          if (cell.center) {
            return (
              <div key="center" className="col-span-2 row-span-2 p-2 border border-amber-400 rounded bg-amber-50 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-amber-950">
                  {currentLang === 'kn' ? 'ದಕ್ಷಿಣ ಕುಂಡಲಿ' : 'South Kundali'}
                </span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-200/60 px-1.5 py-0.5 rounded mt-0.5">
                  Lagna: {targetData.houses[0].rashiName[currentLang]}
                </span>
              </div>
            );
          }
          const house = targetData.houses.find(h => h.rashiIndex === cell.rashiIdx);
          const isLagna = house?.bhava === 1;
          return (
            <div key={idx} className={`p-1 border border-amber-300 rounded bg-white flex flex-col justify-between overflow-hidden ${isLagna ? 'ring-1 ring-amber-500' : ''}`}>
              <div className="flex items-center justify-between text-[9px] font-bold text-amber-900 border-b border-amber-100 pb-0.5">
                <span>{RASHIS[cell.rashiIdx as number][currentLang]}</span>
                {isLagna && <span className="text-[8px] bg-red-600 text-white px-0.5 rounded">L</span>}
              </div>
              <div className="flex flex-wrap gap-0.5 mt-0.5">
                {house ? renderHousePlanets(house.bhava, 'horizontal', targetData, 'xs') : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Sacred Astrological Gate Lock Screen (Governed by Current Masa + Nakshatra Password)
  const renderAstroGateLockScreen = (customSubtext?: string) => (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-500 max-w-lg mx-auto text-center space-y-5 shadow-2xl animate-in fade-in">
      {/* Current Masa & Current Nakshatra Mention on the window */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 space-y-2 text-left">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {currentLang === 'kn'
              ? 'ಪ್ರಸ್ತುತ ಪಂಚಾಂಗ ವಿವರಗಳು'
              : currentLang === 'hi'
              ? 'वर्तमान पंचांग विवरण'
              : 'Current Astronomical Details'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750">
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಮಾಸ:' : currentLang === 'hi' ? 'वर्तमान मास:' : 'Current Masa:'}
            </span>
            <strong className="text-sm font-bold text-amber-950 dark:text-amber-200 font-serif block mt-0.5">
              {todayPanchanga.masa?.[currentLang] || todayPanchanga.masa?.en}
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750">
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ನಕ್ಷತ್ರ:' : currentLang === 'hi' ? 'वर्तमान नक्षत्र:' : 'Current Nakshatra:'}
            </span>
            <strong className="text-sm font-bold text-amber-950 dark:text-amber-200 font-serif block mt-0.5">
              {todayPanchanga.nakshatra?.[currentLang] || todayPanchanga.nakshatra?.en}
            </strong>
          </div>
        </div>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 flex items-center justify-center text-white shadow-xl mx-auto ring-4 ring-amber-400/30">
        <Lock className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
          {currentLang === 'kn' ? 'ವೈದಿಕ ರಹಸ್ಯ ಜ್ಯೋತಿಷ್ಯ ಪ್ರವೇಶ' : 'Sacred Astrological Suite Access'}
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
          {customSubtext || (currentLang === 'kn'
            ? 'ಈ ಸಂರಕ್ಷಿತ ಜ್ಯೋತಿಷ್ಯ ವಿಭಾಗವನ್ನು ಪ್ರವೇಶಿಸಲು ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.'
            : 'Enter password to access this protected astrological section.')}
        </p>
      </div>

      {/* Password Error Alert */}
      {astroPasswordError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          {astroPasswordError}
        </div>
      )}

      {/* Password Entry Form */}
      <form onSubmit={handleUnlockAstro} className="space-y-4 pt-1">
        <div className="text-left">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
            {currentLang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್:' : currentLang === 'hi' ? 'पासवर्ड:' : 'Password:'}
          </label>
          <input
            type="password"
            value={astroPasswordInput}
            onChange={(e) => setAstroPasswordInput(e.target.value)}
            placeholder="Enter the password"
            className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-center text-base font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4 text-amber-200" />
          <span>{currentLang === 'kn' ? 'ಅನ್‌ಲಾಕ್ ಮಾಡಿ' : 'Unlock'}</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      
      {/* Top Banner Notice: Today's Nakshatra Notice prominently shown at the top of the window */}
      <div className="no-print p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/80 to-amber-50 dark:from-stone-900 dark:via-amber-950/40 dark:to-stone-900 border border-amber-300 dark:border-amber-700/60 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-serif font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
            {currentLang === 'kn'
              ? `ಇಂದಿನ ನಕ್ಷತ್ರ: ${todayPanchanga.nakshatra.kn} (${todayPanchanga.nakshatra.en})`
              : currentLang === 'hi'
              ? `आज का नक्षत्र: ${todayPanchanga.nakshatra.hi} (${todayPanchanga.nakshatra.en})`
              : `Today's Nakshatra is: ${todayPanchanga.nakshatra.en}`}
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-full shrink-0">
          {new Date().toISOString().split('T')[0]} • {selectedCity.name}
        </div>
      </div>

      {/* Top Banner (Hidden in Print) */}
      <div className="no-print rounded-2xl bg-gradient-to-r from-indigo-800 via-purple-800 to-amber-700 text-white p-4 sm:p-6 shadow-xl border border-indigo-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <Compass className="w-4 h-4 text-amber-300" />
              <span>VEDIC ASTROLOGY • SIDEREAL LAHIRI AYANAMSHA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ಮತ್ತು ಗ್ರಹ ಬಲ ವಿಶ್ಲೇಷಣೆ' : currentLang === 'hi' ? 'लग्न कुण्डली एवं ग्रह बल विश्लेषण' : 'Lagna Kundali Chart & Planetary Strength (Bala)'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'kn'
                ? 'ಪ್ರಸ್ತುತ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಆಧಾರದ ಮೇಲೆ ನಿಖರ ಲಗ್ನ, ೧೨ ಭಾವಗಳು, ನವಗ್ರಹ ಸ್ಥಾನ ಮತ್ತು ಸ್ಥಾನ-ದಿಗ್ಬಲ-ಚೇಷ್ಟಾ ಬಲಗಳ ಆಳವಾದ ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟಗಳು.'
                : currentLang === 'hi'
                ? 'दिनांक व समय अनुसार शुद्ध लग्न, १२ भाव, नवग्रह स्थिति एवं स्थान-दिग्बल-चेष्टा बल का पूर्ण ज्योतिषीय विश्लेषण।'
                : 'Real-time Vedic ascendant, 12 Bhavas, 9 Grahas, and deep planetary strength (Bala) based on house placement.'}
            </p>
          </div>

          {/* Date, Time & City Controls + PDF Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 bg-black/25 p-3 rounded-xl backdrop-blur-xs border border-white/10">
            
            {/* Date Input */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-300" />
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Time Input */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const c = CITIES.find(item => item.name === e.target.value);
                  if (c) onSelectCity(c);
                }}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.stateLocalized ? c.stateLocalized[currentLang] : c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Worldwide Place & Google Maps Location Trigger */}
            <button
              onClick={() => setShowWorldwideModal(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Search Any Global City or enter Google Maps coordinates"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಜಾಗತಿಕ ಸ್ಥಳ / ಮ್ಯಾಪ್' : 'Worldwide Places'}</span>
            </button>

            {/* Export Image Button */}
            <button
              onClick={handleExportImage}
              disabled={isExportingImage}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
              title="Export complete formatted Lagna Kundali as high-res Image (PNG)"
            >
              {isExportingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              <span>{isExportingImage ? 'Exporting...' : 'Export Image'}</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
              title="Export complete formatted Lagna Kundali & Planetary Strength report as PDF"
            >
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              title="Print chart using browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Back to Calendar */}
            <button
              onClick={onBackToCalendar}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Calendar</span>
            </button>

          </div>

        </div>
      </div>

      {/* Lagna & Auspicious Periods Bar (Hidden in Print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lagna Card */}
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20">
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
            {currentLang === 'kn' ? 'ಲಗ್ನ (Ascendant):' : currentLang === 'hi' ? 'लग्न (Lagna):' : 'Ascendant (Lagna):'}
          </span>
          <div className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
            {kundaliData.houses[0].rashiName[currentLang]}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {kundaliData.lagnaDegree}° • {kundaliData.lagnaNakshatra[currentLang]}
          </p>
        </div>

        {/* Rahu Kaal */}
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider block">
            {currentLang === 'kn' ? 'ರಾಹು ಕಾಲ (Rahu Kaal):' : currentLang === 'hi' ? 'राहु काल:' : 'Rahu Kaal:'}
          </span>
          <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
            {panchangDay.rahuKaal.start} - {panchangDay.rahuKaal.end}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
            {panchangDay.rahuKaal.startGhati.split('(')[0]}
          </p>
        </div>

        {/* Gulika Kaal */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
            {currentLang === 'kn' ? 'ಗುಳಿಕ ಕಾಲ (Gulika Kaal):' : currentLang === 'hi' ? 'गुलिक काल:' : 'Gulika Kaal:'}
          </span>
          <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
            {panchangDay.gulikaKaal.start} - {panchangDay.gulikaKaal.end}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
            {panchangDay.gulikaKaal.startGhati.split('(')[0]}
          </p>
        </div>

        {/* Yamaganda Kaal & Alert Trigger */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
              {currentLang === 'kn' ? 'ಯಮಗಂಡ ಕಾಲ (Yamaganda):' : currentLang === 'hi' ? 'यमगण्ड काल:' : 'Yamaganda Kaal:'}
            </span>
            <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
              {panchangDay.yamagandaKaal.start} - {panchangDay.yamagandaKaal.end}
            </div>
          </div>

          <button
            onClick={handleArmAlerts}
            className={`mt-2 py-1 px-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              notificationArmed
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-amber-500'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notificationArmed ? 'Alert Armed' : 'Set Timing Notification'}</span>
          </button>
        </div>

      </div>

      {/* Active Section Tabs Navigation - All Tabs 100% Visible with flex-wrap */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1">
          <button
            onClick={() => setActiveSectionTab('chart')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSectionTab === 'chart'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{currentLang === 'kn' ? '೧. ಲಗ್ನ ಕುಂಡಲಿ & ಗ್ರಹ ಬಲ' : currentLang === 'hi' ? '१. लग्न कुण्डली एवं ग्रह बल' : '1. Kundali Chart & Bala'}</span>
          </button>

          {/* Tab 2: Vedic Remedies (Consolidates Upayas, Vimshottari Dasha, Gochar Transits, Prashna Kundali, Guna Milan) */}
          <button
            onClick={() => setActiveSectionTab('remedies')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
              activeSectionTab === 'remedies'
                ? 'bg-amber-600 text-white shadow-md border-amber-500'
                : 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-300/70 hover:bg-amber-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span>{currentLang === 'kn' ? '೨. ವೈದಿಕ ಪರಿಹಾರಗಳು, ದಶಾ & ಗೋಚಾರ' : currentLang === 'hi' ? '२. वैदिक उपचार, दशा एवं गोचर' : '2. Vedic Remedies, Dasha & Gochar'}</span>
            {!isAstroUnlocked && <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />}
          </button>
        </div>

        {isAstroUnlocked && (
          <button
            onClick={handleLockAstro}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-red-600 flex items-center gap-1 shrink-0 cursor-pointer"
            title="Lock Sacred Astrological Tabs"
          >
            <Lock className="w-3 h-3 text-amber-600" />
            <span>Lock Tabs</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* WRAPPER FOR PDF GENERATION & SCREEN RENDERING */}
      {/* ========================================================================= */}
      <div id="printable-kundali-content" className="space-y-8 bg-white dark:bg-stone-900 p-2 sm:p-4 rounded-2xl">
        
        {/* Printable Official Header (Shows when exported to PDF or printed) */}
        <div className="print-only border-b-2 border-amber-600 pb-4 mb-4 text-center">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                SRI HCMM VEDIC PANCHANGA • LAHIRI AYANAMSHA
              </span>
              <h1 className="text-2xl font-serif font-black text-stone-950">
                {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ಮತ್ತು ಗ್ರಹ ಬಲ ಪತ್ರಿಕೆ' : currentLang === 'hi' ? 'लग्न कुण्डली एवं ग्रह बल पत्रिका' : 'Lagna Kundali Birth & Astrological Chart'}
              </h1>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-stone-900">
                {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name} ({selectedCity.state})
              </div>
              <div className="font-mono text-stone-600">
                {dateStr} • {timeStr}
              </div>
              <div className="text-[11px] text-stone-500">
                Lat: {selectedCity.lat.toFixed(2)}° N, Lng: {selectedCity.lng.toFixed(2)}° E
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-left bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs">
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Lagna (Ascendant):</span>
              <span className="font-bold text-stone-950">{kundaliData.houses[0].rashiName[currentLang]} ({kundaliData.lagnaDegree}°)</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Lagna Nakshatra:</span>
              <span className="font-bold text-stone-950">{kundaliData.lagnaNakshatra[currentLang]}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Rahu Kaal:</span>
              <span className="font-bold text-red-700">{panchangDay.rahuKaal.start} - {panchangDay.rahuKaal.end}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Gulika Kaal:</span>
              <span className="font-bold text-amber-800">{panchangDay.gulikaKaal.start} - {panchangDay.gulikaKaal.end}</span>
            </div>
          </div>
        </div>

        {/* TAB 1: Lagna Kundali Chart & Planetary Bala */}
        {activeSectionTab === 'chart' && (
          <>
            {/* JANMA VIVARA (Birth Details based on Date, Time & Selected Place / GPS) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-700/10 dark:from-amber-950/40 dark:via-stone-900 dark:to-orange-950/30 border-2 border-amber-400/60 dark:border-amber-600/40 shadow-xl space-y-4 mb-6 page-break-inside-avoid">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>{currentLang === 'kn' ? 'ಜನ್ಮ ವಿವರಗಳು (ರಾಶಿ, ನಕ್ಷತ್ರ, ಪಾದ & ನಾಮಕರಣ ಅಕ್ಷರ)' : currentLang === 'hi' ? 'जन्म विवरण (राशि, नक्षत्र, चरण एवं नामाक्षर)' : 'Janma Vivara (Rashi, Nakshatra, Pada & Birth Syllable)'}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40">
                        {currentLang === 'kn' ? 'ಖಗೋಳೀಯ ಲೆಕ್ಕಾಚಾರ' : 'Calculated'}
                      </span>
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {currentLang === 'kn'
                        ? `ದಿನಾಂಕ: ${janmaVivara.dateFormatted} • ಸಮಯ: ${janmaVivara.timeFormatted} • ಸ್ಥಳ: ${janmaVivara.cityName} (${selectedCity.lat.toFixed(2)}°N, ${selectedCity.lng.toFixed(2)}°E)`
                        : `Birth Date: ${janmaVivara.dateFormatted} • Time: ${janmaVivara.timeFormatted} • Place: ${janmaVivara.cityName} (${selectedCity.lat.toFixed(2)}°N, ${selectedCity.lng.toFixed(2)}°E)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDetectGpsLocation}
                    disabled={isGpsLoading}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                    title="Detect Current GPS Location and Recalculate"
                  >
                    {isGpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                    <span>{currentLang === 'kn' ? 'ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ (GPS)' : 'Use GPS Location'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Core Pillars: Rashi, Nakshatra, Pada Number, and Pada Akshara */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* 1. Chandra Rashi (Moon Sign) */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-800 shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                    {currentLang === 'kn' ? '೧. ಜನ್ಮ ರಾಶಿ (Moon Sign):' : currentLang === 'hi' ? '१. जन्म राशि:' : '1. Moon Sign (Chandra Rashi):'}
                  </span>
                  <div className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{janmaVivara.rashiName[currentLang]}</span>
                    <span className="text-xs font-sans text-stone-500 font-normal">({janmaVivara.rashiName.en})</span>
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 flex items-center gap-1">
                    <span>{currentLang === 'kn' ? 'ರಾಶ್ಯಾಧಿಪತಿ:' : 'Rashi Lord:'}</span>
                    <strong className="text-amber-800 dark:text-amber-300 font-serif">{janmaVivara.rashiLord[currentLang]}</strong>
                  </div>
                </div>

                {/* 2. Janma Nakshatra */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-indigo-300/80 dark:border-stone-800 shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                    {currentLang === 'kn' ? '೨. ಜನ್ಮ ನಕ್ಷತ್ರ (Birth Star):' : currentLang === 'hi' ? '२. जन्म नक्षत्र:' : '2. Janma Nakshatra:'}
                  </span>
                  <div className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{janmaVivara.nakshatraName[currentLang]}</span>
                    <span className="text-xs font-sans text-stone-500 font-normal">({janmaVivara.nakshatraName.en})</span>
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    <span>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ಸೂಚಿ:' : 'Nakshatra Index:'}</span>
                    <strong className="text-indigo-800 dark:text-indigo-300 ml-1 font-mono">{janmaVivara.nakshatraIndex + 1} / 27</strong>
                  </div>
                </div>

                {/* 3. Nakshatra Pada Number */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-purple-300/80 dark:border-stone-800 shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                    {currentLang === 'kn' ? '೩. ನಕ್ಷತ್ರ ಪಾದ (Pada Number):' : currentLang === 'hi' ? '३. नक्षत्र चरण/पाद:' : '3. Nakshatra Pada Number:'}
                  </span>
                  <div className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{currentLang === 'kn' ? `ಪಾದ ${janmaVivara.padaNumber}` : `Pada ${janmaVivara.padaNumber}`}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono font-bold">
                      {janmaVivara.padaNumber}/4
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    <span>{currentLang === 'kn' ? 'ನವಾಂಶ ರಾಶಿ:' : 'Navamsha:'}</span>
                    <strong className="text-purple-800 dark:text-purple-300 ml-1">
                      {RASHIS[(janmaVivara.rashiIndex * 3 + janmaVivara.padaNumber - 1) % 12]?.[currentLang] || ''}
                    </strong>
                  </div>
                </div>

                {/* 4. Nama Nakshatra Akshara (Syllable for Naming) */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-600/20 border-2 border-amber-500 shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
                    {currentLang === 'kn' ? '೪. ನಾಮಕರಣ ಪಾದಾಕ್ಷರ (Pada Akshara):' : currentLang === 'hi' ? '४. नामाक्षर (पाद अक्षर):' : '4. Pada Akshara (Birth Syllable):'}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-600 text-white font-serif font-black text-2xl flex items-center justify-center shadow-lg ring-2 ring-amber-400/60 shrink-0">
                      {janmaVivara.aksharaKannada || janmaVivara.akshara}
                    </div>
                    <div>
                      <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {janmaVivara.akshara} • {janmaVivara.aksharaDevanagari}
                      </div>
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 font-medium block">
                        {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಮೊದಲ ಅಕ್ಷರ' : 'Vedic Naming Syllable'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Informational Subtext */}
              <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {currentLang === 'kn'
                    ? `ಈ ವಿವರಗಳು ನಮೂದಿಸಿದ ಜನ್ಮ ದಿನಾಂಕ (${janmaVivara.dateFormatted}) ಮತ್ತು ಸಮಯ (${janmaVivara.timeFormatted}) ದಲ್ಲಿ ಚಂದ್ರನು ನೆಲೆಸಿದ್ದ ನಕ್ಷತ್ರಾಂಶದ (${janmaVivara.moonLong.toFixed(2)}°) ನಿಖರ ಲೆಕ್ಕಾಚಾರದಿಂದ ಲಭ್ಯವಾಗಿದೆ. ನಾಮಕರಣ ಮತ್ತು ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಈ ಅಕ್ಷರವನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.`
                    : `Derived from exact Moon longitude (${janmaVivara.moonLong.toFixed(2)}°) at birth moment for ${janmaVivara.cityName}. Used for classical Vedic child naming rituals (Namakarana Samskara) and destiny alignment.`}
                </span>
              </div>
            </div>

        {/* Tab 1 Chart View Switcher (Lagna vs Chandra Chart vs Both) */}
        <div className="no-print p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಕುಂಡಲಿ ನಕ್ಷೆ ವೀಕ್ಷಣೆ (Chart View)' : 'Kundali Chart View'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ (ಜನ್ಮ ಲಗ್ನ) ಅಥವಾ ಚಂದ್ರ ಕುಂಡಲಿ (ಚಂದ್ರ ಲಗ್ನ ಆಧಾರಿತ)' : 'Switch between Lagna Chart and Chandra (Moon) Chart'}
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setTab1ChartTab('lagna')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                tab1ChartTab === 'lagna'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ (Lagna)' : 'Lagna Chart'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTab1ChartTab('chandra')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                tab1ChartTab === 'chandra'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಕುಂಡಲಿ (Chandra)' : 'Chandra Chart'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTab1ChartTab('both')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                tab1ChartTab === 'both'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಎರಡೂ (Both)' : 'Both Charts'}</span>
            </button>

            {/* 3D Celestial Sky Mandala Tab */}
            <button
              type="button"
              onClick={() => setTab1ChartTab('mandala3d')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border ${
                tab1ChartTab === 'mandala3d'
                  ? 'bg-sky-600 text-white shadow-xs border-sky-400'
                  : 'text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-950/40 border-sky-300 dark:border-sky-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentLang === 'kn' ? '೩D ಗ್ರಹ ಮಂಡಲ & ತಾರಾ ಪುಂಜ' : '3D Celestial Mandala'}</span>
            </button>
          </div>
        </div>

        {/* 3D CELESTIAL SKY MANDALA WITH STARS, RASHIS, GRAHAS & CARDINAL DIRECTIONS */}
        {tab1ChartTab === 'mandala3d' && (
          <div className="mb-8 animate-in fade-in">
            <CelestialSkyMandala3D
              currentLang={currentLang}
              kundaliData={kundaliData}
              dateStr={dateStr}
              timeStr={timeStr}
              cityName={selectedCity.name}
            />
          </div>
        )}

        {/* CHANDRA KUNDALI IN TAB 1 (When Chandra or Both is active) */}
        {(tab1ChartTab === 'chandra' || tab1ChartTab === 'both') && (
          <div className="mb-8 animate-in fade-in">
            <ChandraKundaliChart
              kundaliData={kundaliData}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* Main Kundali Chart Display & Style Switcher (When Lagna or Both is active) */}
        {(tab1ChartTab === 'lagna' || tab1ChartTab === 'both') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start page-break-inside-avoid">
          
          {/* Left: SVG Kundali Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-amber-200/80 dark:border-stone-800 shadow-xl space-y-4">
            
            {/* INTERACTIVE DRISHTI VISUALIZER */}
            <DrishtiVisualizer
              currentLang={currentLang}
              kundaliData={kundaliData}
              selectedPlanetName={selectedDrishtiPlanet}
              onSelectPlanet={setSelectedDrishtiPlanet}
              showAspectLines={showAspectLines}
              onToggleAspectLines={setShowAspectLines}
              onSelectHouse={setSelectedBhavaNumber}
            />

            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {chartStyle === 'north' ? 'ಉತ್ತರ ಭಾರತ ಶೈಲಿ (North Indian Diamond Chart)' : 'ದಕ್ಷಿಣ ಭಾರತ ಶೈಲಿ (South Indian Chart)'}
                </h2>
              </div>

              {/* Toggle North vs South Indian Style */}
              <div className="no-print inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
                <button
                  onClick={() => setChartStyle('north')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    chartStyle === 'north'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  North Style (Diamond)
                </button>
                <button
                  onClick={() => setChartStyle('south')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    chartStyle === 'south'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  South Style (Square)
                </button>
              </div>
            </div>

            {/* North Indian Diamond Chart with Cardinal Directions */}
            {chartStyle === 'north' ? (
              <div className="relative w-full aspect-square max-w-[330px] xs:max-w-[390px] sm:max-w-[500px] mx-auto bg-amber-50/60 rounded-2xl p-1.5 sm:p-2 border-2 border-amber-500 shadow-xl overflow-hidden select-none">
                <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect x="0" y="0" width="500" height="500" fill="#fefce8" stroke="#b45309" strokeWidth="3" />
                  <line x1="0" y1="0" x2="500" y2="500" stroke="#d97706" strokeWidth="2" />
                  <line x1="500" y1="0" x2="0" y2="500" stroke="#d97706" strokeWidth="2" />
                  <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#b45309" strokeWidth="2.5" />
                  {/* Cardinal Directions in Kundali Tab */}
                  <text x="250" y="14" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">E (East • ಪೂರ್ವ - ಉದಯ ಲಗ್ನ)</text>
                  <text x="14" y="254" fill="#b45309" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90, 14, 254)">N (North • ಉತ್ತರ)</text>
                  <text x="250" y="494" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">W (West • ಪಶ್ಚಿಮ - ಅಸ್ತ)</text>
                  <text x="486" y="254" fill="#b45309" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(90, 486, 254)">S (South • ದಕ್ಷಿಣ)</text>

                  {/* Aspect Ray Tracing Lines */}
                  {showAspectLines && (() => {
                    const originPlanet = kundaliData.planets.find(p => p.name.toLowerCase() === selectedDrishtiPlanet.toLowerCase()) || kundaliData.planets[0];
                    const originBhava = originPlanet ? originPlanet.bhava : 1;
                    const originCoord = getHouseCoord('north', originBhava, kundaliData);
                    const aspects = getAspectingHousesForGraha(originPlanet.name, originBhava);

                    return (
                      <g className="drishti-aspect-rays">
                        <defs>
                          <marker id="aspect-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                          </marker>
                          <radialGradient id="aspect-pulse" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Origin House Highlight Ring */}
                        <circle cx={originCoord.x} cy={originCoord.y} r="28" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.8" />

                        {aspects.map((asp, i) => {
                          const targetCoord = getHouseCoord('north', asp.targetBhava, kundaliData);
                          const midX = (originCoord.x + targetCoord.x) / 2;
                          const midY = (originCoord.y + targetCoord.y) / 2;

                          return (
                            <g key={i}>
                              {/* Aspect Ray */}
                              <line
                                x1={originCoord.x}
                                y1={originCoord.y}
                                x2={targetCoord.x}
                                y2={targetCoord.y}
                                stroke="#e11d48"
                                strokeWidth="2.5"
                                strokeDasharray="6 4"
                                markerEnd="url(#aspect-arrow)"
                                opacity="0.9"
                              />
                              {/* Target House Pulsing Halo */}
                              <circle cx={targetCoord.x} cy={targetCoord.y} r="26" fill="url(#aspect-pulse)" opacity="0.6" />
                              <circle cx={targetCoord.x} cy={targetCoord.y} r="22" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="3 3" />
                              
                              {/* Midpoint Aspect Badge */}
                              <rect x={midX - 16} y={midY - 9} width="32" height="18" rx="6" fill="#be123c" />
                              <text x={midX} y={midY + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                                {asp.distance}th
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>

                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* House 1: Lagna */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(1)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 1 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '50%', top: '25%', maxWidth: '140px' }}
                    title="Click to explore House 1 (Lagna / Tanu Bhava)"
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9.5px] font-black uppercase text-red-700 bg-red-100/90 px-1 py-0.2 rounded shadow-2xs">
                        {currentLang === 'kn' ? 'ಲಗ್ನ' : currentLang === 'hi' ? 'लग्न' : 'LAGNA'}
                      </span>
                      <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none">
                        {getHouseRashiNum(1)}
                      </span>
                    </div>
                    <div className="max-w-[135px]">
                      {renderHousePlanets(1, 'diamond')}
                    </div>
                  </div>

                  {/* House 2 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(2)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 2 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '25%', top: '14%', maxWidth: '90px' }}
                    title="Click to explore House 2 (Dhana Bhava)"
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(2)}
                    </span>
                    <div className="max-w-[85px]">
                      {renderHousePlanets(2, 'horizontal')}
                    </div>
                  </div>

                  {/* House 3 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(3)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 3 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '12%', top: '25%', maxWidth: '65px' }}
                    title="Click to explore House 3 (Sahaja / Bhratru Bhava)"
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(3)}
                    </span>
                    <div className="max-w-[62px]">
                      {renderHousePlanets(3, 'vertical')}
                    </div>
                  </div>

                  {/* House 4 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(4)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 4 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '25%', top: '50%', maxWidth: '140px' }}
                    title="Click to explore House 4 (Sukha / Matru Bhava)"
                  >
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(4)}
                    </span>
                    <div className="max-w-[130px]">
                      {renderHousePlanets(4, 'diamond')}
                    </div>
                  </div>

                  {/* House 5 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(5)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 5 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '12%', top: '75%', maxWidth: '65px' }}
                    title="Click to explore House 5 (Putra / Purva Punya Bhava)"
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(5)}
                    </span>
                    <div className="max-w-[62px]">
                      {renderHousePlanets(5, 'vertical')}
                    </div>
                  </div>

                  {/* House 6 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(6)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 6 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '25%', top: '86%', maxWidth: '90px' }}
                    title="Click to explore House 6 (Shatru / Roga Bhava)"
                  >
                    <div className="max-w-[85px] mb-0.5">
                      {renderHousePlanets(6, 'horizontal')}
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none">
                      {getHouseRashiNum(6)}
                    </span>
                  </div>

                  {/* House 7 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(7)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 7 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '50%', top: '75%', maxWidth: '140px' }}
                    title="Click to explore House 7 (Kalatra / Jaya Bhava)"
                  >
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(7)}
                    </span>
                    <div className="max-w-[135px]">
                      {renderHousePlanets(7, 'diamond')}
                    </div>
                  </div>

                  {/* House 8 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(8)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 8 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '75%', top: '86%', maxWidth: '90px' }}
                    title="Click to explore House 8 (Ayur / Randhra Bhava)"
                  >
                    <div className="max-w-[85px] mb-0.5">
                      {renderHousePlanets(8, 'horizontal')}
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none">
                      {getHouseRashiNum(8)}
                    </span>
                  </div>

                  {/* House 9 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(9)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 9 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '88%', top: '75%', maxWidth: '65px' }}
                    title="Click to explore House 9 (Bhagya / Dharma Bhava)"
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(9)}
                    </span>
                    <div className="max-w-[62px]">
                      {renderHousePlanets(9, 'vertical')}
                    </div>
                  </div>

                  {/* House 10 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(10)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 10 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '75%', top: '50%', maxWidth: '140px' }}
                    title="Click to explore House 10 (Karma / Rajya Bhava)"
                  >
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(10)}
                    </span>
                    <div className="max-w-[130px]">
                      {renderHousePlanets(10, 'diamond')}
                    </div>
                  </div>

                  {/* House 11 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(11)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 11 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '88%', top: '25%', maxWidth: '65px' }}
                    title="Click to explore House 11 (Labha / Aya Bhava)"
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(11)}
                    </span>
                    <div className="max-w-[62px]">
                      {renderHousePlanets(11, 'vertical')}
                    </div>
                  </div>

                  {/* House 12 */}
                  <div 
                    onClick={() => setSelectedBhavaNumber(12)}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedBhavaNumber === 12 ? 'ring-2 ring-amber-500 bg-amber-100/80 rounded-xl p-1 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{ left: '75%', top: '14%', maxWidth: '90px' }}
                    title="Click to explore House 12 (Vyaya / Moksha Bhava)"
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(12)}
                    </span>
                    <div className="max-w-[85px]">
                      {renderHousePlanets(12, 'horizontal')}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* South Indian Fixed Zodiac Square Chart */
              <div className="relative w-full aspect-square max-w-[330px] xs:max-w-[390px] sm:max-w-[500px] mx-auto bg-amber-50 rounded-xl p-1.5 sm:p-2 border-2 border-amber-600 shadow-xl overflow-hidden select-none">
                {/* South Indian Aspect Rays Overlay */}
                {showAspectLines && (() => {
                  const originPlanet = kundaliData.planets.find(p => p.name.toLowerCase() === selectedDrishtiPlanet.toLowerCase()) || kundaliData.planets[0];
                  const originBhava = originPlanet ? originPlanet.bhava : 1;
                  const originCoord = getHouseCoord('south', originBhava, kundaliData);
                  const aspects = getAspectingHousesForGraha(originPlanet.name, originBhava);

                  return (
                    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none z-20">
                      <defs>
                        <marker id="south-aspect-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                        </marker>
                      </defs>
                      <circle cx={originCoord.x} cy={originCoord.y} r="32" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.85" />
                      {aspects.map((asp, i) => {
                        const targetCoord = getHouseCoord('south', asp.targetBhava, kundaliData);
                        const midX = (originCoord.x + targetCoord.x) / 2;
                        const midY = (originCoord.y + targetCoord.y) / 2;
                        return (
                          <g key={i}>
                            <line
                              x1={originCoord.x}
                              y1={originCoord.y}
                              x2={targetCoord.x}
                              y2={targetCoord.y}
                              stroke="#e11d48"
                              strokeWidth="2.5"
                              strokeDasharray="6 4"
                              markerEnd="url(#south-aspect-arrow)"
                              opacity="0.9"
                            />
                            <circle cx={targetCoord.x} cy={targetCoord.y} r="26" fill="#f43f5e" fillOpacity="0.15" stroke="#e11d48" strokeWidth="2" strokeDasharray="3 3" />
                            <rect x={midX - 16} y={midY - 9} width="32" height="18" rx="6" fill="#be123c" />
                            <text x={midX} y={midY + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                              {asp.distance}th
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}

                <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-amber-100/70 border border-amber-300">
                  {/* Row 1 */}
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 11);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 11)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮೀನ (Meena)' : currentLang === 'hi' ? 'मीन (Meena)' : 'Pisces (Meena)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 11)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 0);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 0)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮೇಷ (Mesha)' : currentLang === 'hi' ? 'मेष (Mesha)' : 'Aries (Mesha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 0)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 1);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 1)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ವೃಷಭ (Vrishabha)' : currentLang === 'hi' ? 'वृषभ (Vrishabha)' : 'Taurus (Vrishabha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 1)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 2);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 2)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮಿಥುನ (Mithuna)' : currentLang === 'hi' ? 'मिथुन (Mithuna)' : 'Gemini (Mithuna)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 2)?.bhava || 0)}</div>
                  </div>

                  {/* Row 2 */}
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 10);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 10)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಕುಂಭ (Kumbha)' : currentLang === 'hi' ? 'कुम्भ (Kumbha)' : 'Aquarius (Kumbha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 10)?.bhava || 0)}</div>
                  </div>
                  <div className="col-span-2 row-span-2 p-4 border border-amber-400/80 rounded bg-amber-50 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-base font-serif font-bold text-amber-950">
                      {currentLang === 'kn' ? 'ದಕ್ಷಿಣ ಭಾರತ ಕುಂಡಲಿ' : currentLang === 'hi' ? 'दक्षिण भारतीय कुण्डली' : 'South Indian Kundali'}
                    </span>
                    <span className="text-xs text-amber-800 font-bold mt-1 bg-amber-200/60 px-2 py-0.5 rounded-md">
                      Lagna: {kundaliData.houses[0].rashiName[currentLang]}
                    </span>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 3);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 3)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಕರ್ಕ (Karka)' : currentLang === 'hi' ? 'कर्क (Karka)' : 'Cancer (Karka)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 3)?.bhava || 0)}</div>
                  </div>

                  {/* Row 3 */}
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 9);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 9)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮಕರ (Makara)' : currentLang === 'hi' ? 'मकर (Makara)' : 'Capricorn (Makara)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 9)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 4);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 4)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಸಿಂಹ (Simha)' : currentLang === 'hi' ? 'सिंह (Simha)' : 'Leo (Simha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 4)?.bhava || 0)}</div>
                  </div>

                  {/* Row 4 */}
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 8);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 8)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಧನುಸ್ಸು (Dhanus)' : currentLang === 'hi' ? 'धनु (Dhanu)' : 'Sagittarius (Dhanus)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 8)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 7);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 7)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ವೃಶ್ಚಿಕ (Vrischika)' : currentLang === 'hi' ? 'वृश्चिक (Vrischika)' : 'Scorpio (Vrischika)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 7)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 6);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 6)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ತುಲಾ (Tula)' : currentLang === 'hi' ? 'तुला (Tula)' : 'Libra (Tula)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 6)?.bhava || 0)}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const h = kundaliData.houses.find(item => item.rashiIndex === 5);
                      if (h) setSelectedBhavaNumber(h.bhava);
                    }}
                    className={`p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs cursor-pointer transition-all hover:bg-amber-50 ${
                      kundaliData.houses.find(item => item.rashiIndex === 5)?.bhava === selectedBhavaNumber ? 'ring-2 ring-amber-500 bg-amber-100/80 font-bold' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಕನ್ಯಾ (Kanya)' : currentLang === 'hi' ? 'कन्या (Kanya)' : 'Virgo (Kanya)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 5)?.bhava || 0)}</div>
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* BELOW CHART: DATE, TIME & GEOGRAPHICAL PLACE CONFIGURATOR */}
            {/* ========================================================================= */}
            <div className="no-print p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-stone-800/90 border-2 border-amber-400 dark:border-stone-700 shadow-md space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 dark:border-stone-700 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ಕುಂಡಲಿ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಆಯ್ಕೆ' : 'Kundali Date, Time & Geographical Place'}
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300">
                      {currentLang === 'kn'
                        ? 'ಪ್ರಸ್ತುತ ಕುಂಡಲಿಯೇ ಡಿಫಾಲ್ಟ್. ಇತರ ದಿನಾಂಕ, ಸಮಯ ಅಥವಾ ನಗರ/ದೇಶ ಆಯ್ಕೆ ಮಾಡಿ ಕುಂಡಲಿ ಮರುರಚಿಸಿ.'
                        : 'Defaults to live present Kundali. Enter custom date, time, and country/city to redraw chart.'}
                    </p>
                  </div>
                </div>

                {/* GPS Detect Location Button */}
                <button
                  type="button"
                  onClick={handleDetectGpsLocation}
                  disabled={isGpsLoading}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50 shrink-0"
                  title="Detect Device GPS Coordinates"
                >
                  {isGpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                  <span>{currentLang === 'kn' ? 'ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ (GPS)' : 'Use GPS Location'}</span>
                </button>
              </div>

              {gpsStatus && (
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-stone-900 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2 border border-amber-300 dark:border-stone-700">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>{gpsStatus}</span>
                </div>
              )}

              {/* Grid: Date, Time, Country, City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                
                {/* Date Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentLang === 'kn' ? 'ದಿನಾಂಕ (Date):' : 'Date:'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setDateStr(new Date().toISOString().split('T')[0])}
                      className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline"
                    >
                      Today
                    </button>
                  </div>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Time Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentLang === 'kn' ? 'ಸಮಯ (Time):' : 'Time:'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const n = new Date();
                        setTimeStr(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
                      }}
                      className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline"
                    >
                      Now
                    </button>
                  </div>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Country Selector */}
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 mb-1">
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ದೇಶ (Country):' : 'Country:'}</span>
                  </label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => {
                      setSelectedCountryCode(e.target.value);
                      const matched = COUNTRIES_AND_CITIES.find(c => c.code === e.target.value);
                      if (matched && matched.cities.length > 0) {
                        onSelectCity(matched.cities[0]);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 cursor-pointer"
                  >
                    {COUNTRIES_AND_CITIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name[currentLang] || c.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Selector */}
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ನಗರ (City):' : 'City:'}</span>
                  </label>
                  <select
                    value={selectedCity.name}
                    onChange={(e) => {
                      const c = currentChartCountry.cities.find(item => item.name === e.target.value) || CITIES.find(item => item.name === e.target.value);
                      if (c) onSelectCity(c);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 cursor-pointer"
                  >
                    {currentChartCountry.cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.stateLocalized ? c.stateLocalized[currentLang] : c.state})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Reset to Real-time Button & Active Coordinates Summary */}
              <div className="pt-2 border-t border-amber-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-stone-600 dark:text-stone-400">
                  Active: <strong>{selectedCity.name}</strong> (Lat: {selectedCity.lat.toFixed(2)}°, Lng: {selectedCity.lng.toFixed(2)}°) • {selectedCity.timezone}
                </span>

                <button
                  type="button"
                  onClick={handleResetToPresent}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಕುಂಡಲಿಗೆ ಮರುಹೊಂದಿಸಿ (Reset to Now)' : 'Reset to Present Kundali'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right: Planetary Ephemeris Table (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-amber-200/80 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ನವಗ್ರಹ ಸ್ಥಿತಿ (Planetary Ephemeris)' : currentLang === 'hi' ? 'नवग्रह स्थिति' : 'Planetary Positions'}
              </h3>
              <span className="text-[11px] font-mono text-stone-400">
                Sidereal Lahiri
              </span>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-700 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-2">ಗ್ರಹ (Graha)</th>
                    <th className="p-2">ರಾಶಿ (Rashi)</th>
                    <th className="p-2">ಅಂಶ (Deg)</th>
                    <th className="p-2">ನಕ್ಷತ್ರ (Nakshatra)</th>
                    <th className="p-2 text-center">ಭಾವ (H)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {kundaliData.planets.map((planet) => (
                    <tr key={planet.name} className="hover:bg-amber-500/5">
                      <td className="p-2 font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <SvgGrahaIcon name={planet.name} size={24} isRetrograde={planet.isRetrograde} />
                        <span>{planet.sanskritName[currentLang]}</span>
                        {planet.isRetrograde && (
                          <span className="text-[9px] text-red-500 font-bold" title="Retrograde (ವಕ್ರ)">
                            [R]
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-semibold text-stone-700 dark:text-stone-300">
                        {planet.rashiName[currentLang]}
                      </td>
                      <td className="p-2 font-mono text-stone-600 dark:text-stone-400">
                        {planet.degrees}°
                      </td>
                      <td className="p-2 text-stone-600 dark:text-stone-400 text-[11px]">
                        {planet.nakshatra[currentLang]}
                      </td>
                      <td className="p-2 text-center font-bold font-mono text-amber-700 dark:text-amber-400">
                        {planet.bhava}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 12 Bhavas Quick Summary */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs space-y-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 block border-b border-stone-200 dark:border-stone-700 pb-1">
                {currentLang === 'kn' ? '೧೨ ಭಾವಗಳ ಸಾರಾಂಶ:' : currentLang === 'hi' ? '१२ भावों का संक्षिप्त विवरण:' : '12 Bhavas (Houses) Overview:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                <div>೧: ತನು ಭಾವ (Lagna - Self)</div>
                <div>೨: ಧನ ಭಾವ (Wealth)</div>
                <div>೩: ಸಹಜ ಭಾವ (Siblings)</div>
                <div>೪: ಸುಖ ಭಾವ (Mother & Home)</div>
                <div>೫: ಪುತ್ರ ಭಾವ (Intellect & Children)</div>
                <div>೬: ಶತ್ರು ಭಾವ (Health & Obstacles)</div>
                <div>೭: ಕಳತ್ರ ಭಾವ (Spouse & Partnership)</div>
                <div>೮: ಆಯುಷ್ಯ ಭಾವ (Longevity)</div>
                <div>೯: ಭಾಗ್ಯ ಭಾವ (Fortune & Dharma)</div>
                <div>೧೦: ಕರ್ಮ ಭಾವ (Profession)</div>
                <div>೧೧: ಲಾಭ ಭಾವ (Gains)</div>
                <div>೧೨: ವ್ಯಯ ಭಾವ (Expenditure & Moksha)</div>
              </div>
            </div>
          </div>

        </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE BHAVA EXPLORER: 12 HOUSES DEEP-DIVE & EDUCATIONAL PURPOSES */}
        {/* ========================================================================= */}
        <BhavaExplorer
          currentLang={currentLang}
          kundaliData={kundaliData}
          planetaryBalas={planetaryBalas}
          selectedBhavaNumber={selectedBhavaNumber}
          onSelectBhava={setSelectedBhavaNumber}
        />

        {/* ========================================================================= */}
        {/* ASTROLOGICAL REMEDY & NUTRITION MAPPING SYSTEM (PER GRAHA & HOUSE BALA)   */}
        {/* ========================================================================= */}
        <GrahaRemedyNutritionView
          currentLang={currentLang}
          kundaliData={kundaliData}
          planetaryBalas={planetaryBalas}
          selectedGrahaName={selectedDrishtiPlanet}
          onSelectGraha={setSelectedDrishtiPlanet}
        />

        {/* ========================================================================= */}
        {/* MASTER 12-HOUSES GRAHA DRISHTI & NUTRITIONAL HEALTH MATRIX (COLLAPSIBLE) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-amber-50/70 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-rose-300 dark:border-rose-900/60 shadow-xl space-y-4 page-break-inside-avoid">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Eye className="w-5 h-5 text-rose-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/70 px-2.5 py-0.5 rounded-full">
                    Parashari Drishti Master Matrix
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-mono font-bold text-stone-500">
                    12 Bhavas Mind-Body Guide
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
                  {currentLang === 'kn'
                    ? '೧೨ ಭಾವಗಳ ಸಮಗ್ರ ಗ್ರಹ ದೃಷ್ಟಿ & ಆರೋಗ್ಯ-ಪೋಷಕಾಂಶ ಕೋಷ್ಟಕ'
                    : currentLang === 'hi'
                    ? '१२ भावों की समग्र ग्रह दृष्टि एवं स्वास्थ्य-पोषण तालिका'
                    : 'Master 12-Houses Graha Drishti & Mind-Body Nutrition Matrix'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAllHousesDrishtiTable(prev => !prev)}
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all self-start sm:self-auto shrink-0"
            >
              <span>
                {showAllHousesDrishtiTable
                  ? (currentLang === 'kn' ? 'ಕೋಷ್ಟಕ ಮುಚ್ಚಿ (Hide Table)' : 'Hide Matrix')
                  : (currentLang === 'kn' ? 'ಸಮಗ್ರ ೧೨ ಭಾವಗಳ ಕೋಷ್ಟಕ ವೀಕ್ಷಿಸಿ' : 'View All 12 Houses Matrix')}
              </span>
              {showAllHousesDrishtiTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {currentLang === 'kn'
              ? 'ಪ್ರತಿಯೊಂದು ಭಾವದಲ್ಲಿ ಯಾವ ಗ್ರಹಗಳು ಸ್ಥಿತವಾಗಿವೆ (ಭಾವಸ್ಥ), ಆ ಭಾವದ ಮೇಲೆ ಯಾವ ಯಾವ ಗ್ರಹಗಳ ವಿಶೇಷ ಅಥವಾ ಸಪ್ತಮ ದೃಷ್ಟಿ ಬಿದ್ದಿದೆ, ಇದರಿಂದ ವ್ಯಕ್ತಿಯ ಶಾರೀರಿಕ ಅಂಗಗಳು, ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ, ಮನಸ್ಥಿತಿ ಮತ್ತು ಆಯುರ್ವೇದೀಯ ಆಹಾರ-ಪೋಷಕಾಂಶ ಪರಿಹಾರಗಳ ಸಂಕ್ಷಿಪ್ತ ದರ್ಶನ.'
              : 'Detailed breakdown of occupant planets and incoming Parashari aspects for each house, detailing anatomical vulnerabilities, emotional temperament, and targeted dietary/nutritional remedies.'}
          </p>

          {/* Collapsible Content */}
          {showAllHousesDrishtiTable && (
            <div className="space-y-4 pt-2 border-t border-rose-200 dark:border-stone-800 animate-in fade-in">
              
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto border border-rose-200 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-900 shadow-sm">
                <table className="w-full text-left text-xs divide-y divide-stone-200 dark:divide-stone-800">
                  <thead className="bg-rose-50/80 dark:bg-stone-850 text-stone-900 dark:text-stone-100 font-bold font-serif">
                    <tr>
                      <th className="p-3 w-16 text-center">ಭಾವ (H)</th>
                      <th className="p-3 w-36">ರಾಶಿ & ಸ್ಥಿತಿ</th>
                      <th className="p-3 w-40">ಭಾವಸ್ಥ ಗ್ರಹಗಳು</th>
                      <th className="p-3">ದೃಷ್ಟಿ ಬೀರುವ ಗ್ರಹಗಳು (Drishtis)</th>
                      <th className="p-3 w-48">ಶಾರೀರಿಕ ಅಂಗಗಳು & ಆರೋಗ್ಯ</th>
                      <th className="p-3 w-48">ಮಾನಸಿಕ ಸ್ಥಿತಿ & ಆಹಾರ ಪರಿಹಾರ</th>
                      <th className="p-3 w-24 text-center">ಕ್ರಮ (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {allHousesDrishti.map((hAnalysis) => {
                      const isCurrent = hAnalysis.bhava === selectedBhavaNumber;
                      return (
                        <tr
                          key={hAnalysis.bhava}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-rose-50/80 dark:bg-rose-950/20 font-medium'
                              : 'hover:bg-amber-500/5'
                          }`}
                        >
                          {/* House Number */}
                          <td className="p-3 text-center">
                            <span className={`w-8 h-8 rounded-full font-mono font-bold text-xs inline-flex items-center justify-center ${
                              isCurrent
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                            }`}>
                              #{hAnalysis.bhava}
                            </span>
                          </td>

                          {/* Rashi & Category */}
                          <td className="p-3">
                            <div className="font-bold text-stone-900 dark:text-stone-100 font-serif">
                              {hAnalysis.rashiName[currentLang]}
                            </div>
                            <span className="text-[10px] font-mono text-stone-500">
                              {hAnalysis.overallDrishtiToneLocalized[currentLang]}
                            </span>
                          </td>

                          {/* Occupant Planets */}
                          <td className="p-3">
                            {hAnalysis.occupantPlanets.length === 0 ? (
                              <span className="text-stone-400 italic text-[11px]">ಖಾಲಿ (Empty)</span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {hAnalysis.occupantPlanets.map((p) => (
                                  <div
                                    key={p.name}
                                    className="flex items-center gap-1 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-stone-700"
                                  >
                                    <SvgGrahaIcon name={p.name} size={18} isRetrograde={p.isRetrograde} />
                                    <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                                      {p.sanskritName[currentLang]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Aspecting Grahas */}
                          <td className="p-3">
                            {hAnalysis.aspectingPlanets.length === 0 ? (
                              <span className="text-stone-400 italic text-[11px]">ನೇರ ದೃಷ್ಟಿಯಿಲ್ಲ (None)</span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {hAnalysis.aspectingPlanets.map((asp, idx) => (
                                  <div
                                    key={idx}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
                                      asp.nature === 'benefic'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-900'
                                    }`}
                                    title={asp.effectOnHouse[currentLang]}
                                  >
                                    <span>{asp.aspectingPlanet.sanskritName[currentLang]}</span>
                                    <span className="font-mono text-[9px]">({asp.distanceFromPlanet}H)</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Physical Health */}
                          <td className="p-3 text-[11px]">
                            <div className="font-semibold text-stone-800 dark:text-stone-200 line-clamp-2">
                              {hAnalysis.physicalImpact.governedOrgans[currentLang]}
                            </div>
                            <div className="text-stone-500 text-[10px] mt-0.5 line-clamp-1">
                              {hAnalysis.physicalImpact.vulnerabilities[currentLang]}
                            </div>
                          </td>

                          {/* Mental & Nutrition */}
                          <td className="p-3 text-[11px]">
                            <div className="text-stone-700 dark:text-stone-300 font-medium line-clamp-2">
                              {hAnalysis.mentalImpact.temperament[currentLang]}
                            </div>
                            <div className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold mt-0.5 line-clamp-1">
                              ಆಹಾರ: {hAnalysis.nutritionalTherapy.recommendedFoods[currentLang]}
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBhavaNumber(hAnalysis.bhava);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {isCurrent ? 'ಆಯ್ಕೆಯಾಗಿದೆ' : 'ವೀಕ್ಷಿಸಿ'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Small Screen Card Grid View */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3">
                {allHousesDrishti.map((hAnalysis) => {
                  const isCurrent = hAnalysis.bhava === selectedBhavaNumber;
                  return (
                    <div
                      key={hAnalysis.bhava}
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        isCurrent
                          ? 'bg-rose-50/90 dark:bg-stone-850 border-rose-400 dark:border-rose-800 shadow-md ring-2 ring-rose-400/50'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-full font-mono font-bold text-xs flex items-center justify-center ${
                            isCurrent ? 'bg-rose-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                          }`}>
                            #{hAnalysis.bhava}
                          </span>
                          <div>
                            <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                              {hAnalysis.bhavaName[currentLang]} ({hAnalysis.rashiName[currentLang]})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedBhavaNumber(hAnalysis.bhava)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
                        >
                          {isCurrent ? 'ಆಯ್ಕೆಯಾಗಿದೆ' : 'ವೀಕ್ಷಿಸಿ'}
                        </button>
                      </div>

                      {/* Seated Grahas */}
                      <div className="text-xs">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">
                          {currentLang === 'kn' ? 'ಭಾವಸ್ಥ ಗ್ರಹಗಳು:' : 'Occupant Grahas:'}
                        </span>
                        {hAnalysis.occupantPlanets.length === 0 ? (
                          <span className="text-stone-400 italic text-[11px]">ಖಾಲಿ (Empty)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {hAnalysis.occupantPlanets.map((p) => (
                              <span key={p.name} className="px-2 py-0.5 rounded bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 font-bold text-[11px]">
                                {p.sanskritName[currentLang]}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Drishtis */}
                      <div className="text-xs">
                        <span className="text-[10px] font-bold uppercase text-rose-500 block mb-0.5">
                          {currentLang === 'kn' ? 'ದೃಷ್ಟಿ ಬೀರುವ ಗ್ರಹಗಳು:' : 'Aspecting Grahas:'}
                        </span>
                        {hAnalysis.aspectingPlanets.length === 0 ? (
                          <span className="text-stone-400 italic text-[11px]">ನೇರ ದೃಷ್ಟಿಯಿಲ್ಲ (None)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {hAnalysis.aspectingPlanets.map((asp, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  asp.nature === 'benefic'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                }`}
                              >
                                {asp.aspectingPlanet.sanskritName[currentLang]} ({asp.distanceFromPlanet}H)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Physical & Nutrition summary */}
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 text-[11px] space-y-1">
                        <div>
                          <strong>ಅಂಗಗಳು:</strong> {hAnalysis.physicalImpact.governedOrgans[currentLang]}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          <strong>ಆಹಾರ:</strong> {hAnalysis.nutritionalTherapy.recommendedFoods[currentLang]}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* NEW SECTION: PLANETARY STRENGTH (BALA) BASED ON HOUSE PLACEMENT */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t-2 border-amber-200/70 dark:border-stone-800 space-y-6 page-break-inside-avoid">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                <Activity className="w-4 h-4" />
                <span>BHAVA BALA & STHANA BALA • ASTROLOGICAL INSIGHTS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-950 dark:text-white mt-1">
                {currentLang === 'kn' 
                  ? 'ಗ್ರಹ ಬಲ ವಿಶ್ಲೇಷಣೆ (Planetary Strength / Bala)' 
                  : currentLang === 'hi' 
                  ? 'ग्रह बल एवं भाव स्थिति विश्लेषण (Planetary Strength)' 
                  : 'Planetary Strength (Bala) by House Placement'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl">
                {currentLang === 'kn'
                  ? 'ಭಾವ ಸ್ಥಿತಿ (ಕೇಂದ್ರ, ತ್ರಿಕೋಣ, ಉಪಚಯ, ದುಃಸ್ಥಾನ), ದಿಗ್ಬಲ (ದಿಕ್ಕುಗಳ ಬಲ), ಉಚ್ಚ-ನೀಚ-ಸ್ವಕ್ಷೇತ್ರ ಮತ್ತು ಚೇಷ್ಟಾ ಬಲಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರತಿಯೊಂದು ಗ್ರಹದ ನಿಖರ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಶುಭ-ಅಶುಭ ಪ್ರಭಾವ.'
                  : currentLang === 'hi'
                  ? 'भाव स्थिति (केन्द्र, त्रिकोण, उपचय, त्रिक), दिग्बल, उच्च-नीच-स्वराशि एवं चेष्टा बल अनुसार नवग्रहों की वास्तविक शक्ति एवं फल।'
                  : 'Calculated using classical Vedic Jyotish principles: Sthana Bala (Sign Dignity), Bhava Bala (Angle/Trine Placement), Digbala (Directional Strength), and Cheshta Bala (Luminosity/Retrograde).'}
              </p>
            </div>

            {/* Quick Filter Buttons (Hidden in print) */}
            <div className="no-print inline-flex rounded-xl border border-stone-300 dark:border-stone-700 p-1 bg-stone-100 dark:bg-stone-800 text-xs font-bold self-start md:self-auto">
              <button
                onClick={() => setBalaFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳು' : currentLang === 'hi' ? 'सभी ९ ग्रह' : 'All 9 Grahas'}
              </button>
              <button
                onClick={() => setBalaFilter('strong')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'strong'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಬಲಿಷ್ಠ (Strong)' : currentLang === 'hi' ? 'बलवान (Strong)' : 'Strong'}
              </button>
              <button
                onClick={() => setBalaFilter('moderate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'moderate'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಮಧ್ಯಮ (Moderate)' : currentLang === 'hi' ? 'मध्यम' : 'Moderate'}
              </button>
              <button
                onClick={() => setBalaFilter('weak')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'weak'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ (Remedy)' : currentLang === 'hi' ? 'उपाय योग्य' : 'Remedy'}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* GRAHA BALA MASTER GUIDE: WHY IS THIS & HOW TO UNDERSTAND EACH */}
          {/* ========================================================================= */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 text-white border border-amber-500/40 shadow-2xl space-y-5 page-break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                    {currentLang === 'kn' ? 'ಗ್ರಹ ಬಲ ಮಾರ್ಗದರ್ಶಿ: ಇದು ಏಕೆ ಬೇಕು ಮತ್ತು ಪ್ರತಿಯೊಂದನ್ನು ಹೇಗೆ ಗ್ರಹಿಸಬೇಕು?' : currentLang === 'hi' ? 'ग्रह बल मार्गदर्शिका: इसका महत्व एवं प्रत्येक बल का विश्लेषण' : 'Graha Bala Guide: Why is This Required & How to Understand Each'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {currentLang === 'kn' ? 'ವೈದಿಕ ಷಡ್ಬಲ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ಗ್ರಹಗಳ ನೈಜ ಶಕ್ತಿ ಮತ್ತು ಕಾರಕತ್ವ ಫಲಿತಾಂಶಗಳ ರಹಸ್ಯ' : 'The classical Vedic principles of planetary potency and functional manifestation capability.'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                Vedic Shastra Guide
              </span>
            </div>

            {/* Part 1: Why is Graha Bala Required? */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{currentLang === 'kn' ? '೧. ಗ್ರಹ ಬಲ ಏಕೆ ಬೇಕು ಮತ್ತು ಇದರ ಮುಖ್ಯ ಉದ್ದೇಶವೇನು?' : '1. Why is Graha Bala Required & Its Purpose?'}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {currentLang === 'kn'
                  ? 'ಜಾತಕ ಕುಂಡಲಿಯಲ್ಲಿ ಒಂದು ಗ್ರಹವು ಕೇವಲ ಶುಭ ಭಾವದಲ್ಲಿದ್ದರೂ (ಉದಾಹರಣೆಗೆ ೧, ೫, ೯ ಅಥವಾ ೧೦ನೇ ಮನೆ), ಆ ಗ್ರಹಕ್ಕೆ ಫಲ ನೀಡುವ ನೈಜ ಶಕ್ತಿ (ಸಾಮರ್ಥ್ಯ) ಇಲ್ಲದಿದ್ದರೆ ಪೂರ್ಣ ಶುಭ ಫಲಗಳು ದೊರೆಯುವುದಿಲ್ಲ. ಉದಾಹರಣೆಗೆ, ನೀಚನಾದ ಅಥವಾ ಶತ್ರು ಕ್ಷೇತ್ರದಲ್ಲಿದ್ದು ಬಲಹೀನನಾದ ಗುರುವು ೧೦ನೇ ಮನೆಯಲ್ಲಿದ್ದರೂ ಉದ್ಯೋಗದಲ್ಲಿ ನಿರೀಕ್ಷಿತ ಯಶಸ್ಸು ತರಲಾರನು. ಅದೇ ರೀತಿ, ಬಲಿಷ್ಠವಾದ ಗ್ರಹವು ೬ನೇ ಮನೆಯಲ್ಲಿದ್ದರೂ ಶತ್ರುಗಳನ್ನು ಮತ್ತು ರೋಗಗಳನ್ನು ಮೆಟ್ಟಿ ನಿಲ್ಲುವ ಅಪಾರ ಜಯವನ್ನು ಕರುಣಿಸುತ್ತದೆ. ಆದ್ದರಿಂದ ಜಾತಕ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ "ಗ್ರಹ ಬಲ" ಅತ್ಯಂತ ನಿರ್ಣಾಯಕ.'
                  : 'In Vedic astrology, mere placement of a planet in an auspicious house (e.g. 1st, 5th, 9th, or 10th) is insufficient. Without adequate Bala (potency), a planet cannot deliver its promises. For instance, a debilitated or combust Jupiter in the 10th house may struggle to grant career authority, whereas a high-Bala planet in the 6th house bestows invincible victory over adversity and disease. Graha Bala calculates whether a planet acts as an empowered king or an enfeebled spectator.'}
              </p>
            </div>

            {/* Part 2: How to understand each component */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              
              {/* Sthana Bala */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 font-serif text-sm">
                    <span>👑</span> {currentLang === 'kn' ? 'ಸ್ಥಾನ ಬಲ (Sthana Bala)' : 'Sthana Bala (Positional Dignity)'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 font-bold">Sign Dignity</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  {currentLang === 'kn'
                    ? 'ಗ್ರಹವು ರಾಶಿಯಲ್ಲಿರುವ ಸ್ಥಿತಿ: ಉಚ್ಚ (Exalted - ೧೦೦%), ಮೂಲತ್ರಿಕೋಣ (೭೫%), ಸ್ವಕ್ಷೇತ್ರ (೬೦%), ಮಿತ್ರ ಕ್ಷೇತ್ರ (೪೦%), ಸಮ (೩೦%), ಶತ್ರು (೧೫%), ನೀಚ (Debilitated - ೦%). ಇದು ಗ್ರಹದ ಸ್ವಂತ ಸ್ವಾಭಿಮಾನ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ತೋರಿಸುತ್ತದೆ.'
                    : 'Ranks sign dignity: Exaltation (Uchha - 100%), Moolatrikona (75%), Own sign (Swakshetra - 60%), Friend (40%), Neutral (30%), Enemy (15%), Debilitation (Neecha - 0%). Reflects intrinsic self-esteem and resourcefulness.'}
                </p>
              </div>

              {/* Digbala */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-blue-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5 font-serif text-sm">
                    <Compass className="w-4 h-4 text-blue-400" /> {currentLang === 'kn' ? 'ದಿಗ್ಬಲ (Digbala - Directional)' : 'Digbala (Directional Strength)'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 font-bold">Cardinal Axes</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  {currentLang === 'kn'
                    ? '೧ನೇ ಭಾವ (ಪೂರ್ವ): ಗುರು & ಬುಧ (ಜ್ಞಾನ-ಬುದ್ಧಿ) • ೪ನೇ ಭಾವ (ಉತ್ತರ): ಚಂದ್ರ & ಶುಕ್ರ (ಮನಶ್ಶಾಂತಿ, ವಾಹನ) • ೭ನೇ ಭಾವ (ಪಶ್ಚಿಮ): ಶನಿ (ದಾಂಪತ್ಯ, ಶಿಸ್ತು) • ೧೦ನೇ ಭಾವ (ದಕ್ಷಿಣ): ಸೂರ್ಯ & ಕುಜ (ಅಧಿಕಾರ, ನಾಯಕತ್ವ).'
                    : 'House 1 (East): Guru & Budha (intellect & wisdom); House 4 (North): Chandra & Shukra (mind, emotional peace & comforts); House 7 (West): Shani (mass appeal & discipline); House 10 (South): Surya & Kuja (executive command & valor).'}
                </p>
              </div>

              {/* Kala & Cheshta Bala */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-purple-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5 font-serif text-sm">
                    <Flame className="w-4 h-4 text-purple-400" /> {currentLang === 'kn' ? 'ಕಾಲ & ಚೇಷ್ಟಾ ಬಲ (Cheshta Bala)' : 'Kala & Cheshta Bala (Motion)'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 font-bold">Vakri & Radiance</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  {currentLang === 'kn'
                    ? 'ಹಗಲು ಅಥವಾ ರಾತ್ರಿ ಜನನ ಬಲ (ದಿವಾ/ರಾತ್ರಿ ಬಲ) ಮತ್ತು ವಕ್ರಿ ಗತಿ (Retrograde motion). ವಕ್ರ ಗ್ರಹಗಳು ಭೂಮಿಗೆ ಅತ್ಯಂತ ಸಮೀಪದಲ್ಲಿದ್ದು, ಪ್ರಕಾಶಮಾನವಾಗಿರುವುದರಿಂದ ಅಗಾಧ ಚೇಷ್ಟಾ ಬಲ ಹೊಂದಿರುತ್ತವೆ.'
                    : 'Temporal day/night birth alignment (Diva/Ratri) and retrograde motion (Vakri). A retrograde planet is closest to Earth, fully illuminated by the Sun, and wields extraordinary Cheshta potency to impact life.'}
                </p>
              </div>

              {/* Bhava Bala & Score Interpretation */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 font-serif text-sm">
                    <Zap className="w-4 h-4 text-emerald-400" /> {currentLang === 'kn' ? 'ಭಾವ ಬಲ & ಅಂಕಗಳ ಓದುವಿಕೆ' : 'Bhava Bala & Score Guide'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 font-bold">100-Point Scale</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  {currentLang === 'kn'
                    ? 'ಕೇಂದ್ರ (೧, ೪, ೭, ೧೦) & ತ್ರಿಕೋಣ (೧, ೫, ೯) ಸ್ಥಿತಿ ಗ್ರಹಕ್ಕೆ ಶಕ್ತಿ ತುಂಬುತ್ತದೆ. ೭೫-೧೦೦% = ಅತ್ಯಧಿಕ ಬಲಿಷ್ಠ (Supreme), ೬೦-೭೪% = ಉತ್ತಮ (Strong), ೪೫-೫೯% = ಮಧ್ಯಮ (Moderate), <೪೫% = ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ (Remedy Needed).'
                    : 'Kendras (1, 4, 7, 10 - Vishnu Sthanas) & Trines (1, 5, 9 - Lakshmi Sthanas) multiply auspicious results. Scores: 75-100% = Supreme, 60-74% = Strong, 45-59% = Moderate, <45% = Weak (requires Vedic gemstones, mantras, or daana).'}
                </p>
              </div>

            </div>
          </div>

          {/* KPI Summary Cards */}
          {balaStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Strongest Planet */}
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಅತ್ಯಧಿಕ ಬಲಿಷ್ಠ ಗ್ರಹ:' : currentLang === 'hi' ? 'सर्वाधिक बलवान ग्रह:' : 'Strongest Graha:'}
                  </span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1 flex items-center gap-2">
                  <span>{balaStats.strongest.planet.sanskritName[currentLang]}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-mono font-bold">
                    {balaStats.strongest.totalScore}/100
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  ಭಾವ {balaStats.strongest.planet.bhava} • {balaStats.strongest.sthanaBala.dignityText[currentLang]}
                </p>
              </div>

              {/* 2. Digbala Planets */}
              <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ದಿಗ್ಬಲ ಪಡೆದ ಗ್ರಹಗಳು:' : currentLang === 'hi' ? 'दिग्बल प्राप्त ग्रह:' : 'Digbala Attained:'}
                  </span>
                  <Compass className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1">
                  {balaStats.digbalaPlanets.length > 0 ? (
                    balaStats.digbalaPlanets.map(b => b.planet.sanskritName[currentLang]).join(', ')
                  ) : (
                    currentLang === 'kn' ? 'ಸಮೀಪದ ದಿಗ್ಬಲ' : currentLang === 'hi' ? 'समीपस्थ दिग्बल' : 'Proximity Digbala'
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {currentLang === 'kn'
                    ? 'ಗುರು/ಬುಧ (೧), ಚಂದ್ರ/ಶುಕ್ರ (೪), ಶನಿ (೭), ಸೂರ್ಯ/ಕುಜ (೧೦)'
                    : 'Devaguru/Budh (1), Chandra/Shukra (4), Shani (7), Surya/Kuja (10)'}
                </p>
              </div>

              {/* 3. Kendra & Trikona Occupancy */}
              <div className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಕೇಂದ್ರ-ತ್ರಿಕೋಣ ಪ್ರಭಾವ:' : currentLang === 'hi' ? 'केन्द्र-त्रिकोण योग:' : 'Kendra & Trines:'}
                  </span>
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1">
                  {balaStats.kendraTrikonaCount} / 9 {currentLang === 'kn' ? 'ಗ್ರಹಗಳು' : currentLang === 'hi' ? 'ग्रह' : 'Grahas'}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {currentLang === 'kn' ? 'ಭಾವ ೧, ೪, ೫, ೭, ೯, ೧೦ ರಲ್ಲಿ ಸ್ಥಿತಿ' : currentLang === 'hi' ? 'शुभ स्तम्भ व भाग्य भाव' : 'Pillars of chart & Divine Lakshmi grace'}
                </p>
              </div>

              {/* 4. Chart Average Strength */}
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಸರಾಸರಿ ಕುಂಡಲಿ ಬಲ:' : currentLang === 'hi' ? 'औसत कुण्डली बल:' : 'Avg Chart Bala:'}
                  </span>
                  <Flame className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1 flex items-center gap-2">
                  <span>{balaStats.avgScore}%</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
                    {balaStats.avgScore >= 65 ? 'ಉತ್ತಮ (Strong)' : 'ಮಧ್ಯಮ (Balanced)'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {currentLang === 'kn' ? 'ಸಮಗ್ರ ಜ್ಯೋತಿಷ್ಯ ಬಲ ಸೂಚ್ಯಂಕ' : 'Composite Vedic planetary index'}
                </p>
              </div>

            </div>
          )}

          {/* Cards Grid: 9 Planets Detailed Bala & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBalas.map((bala) => {
              const p = bala.planet;
              return (
                <div
                  key={p.name}
                  className={`rounded-2xl border p-5 shadow-md flex flex-col justify-between transition-all hover:shadow-lg ${bala.colorTheme.bg} ${bala.colorTheme.border} page-break-inside-avoid`}
                >
                  
                  {/* Top: Planet Name, Symbol & Total Score Ring */}
                  <div>
                    <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <SvgGrahaIcon name={p.name} size={38} isRetrograde={p.isRetrograde} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-serif font-black text-base text-stone-950 dark:text-white leading-tight">
                              {p.sanskritName[currentLang]}
                            </h3>
                            {p.isRetrograde && (
                              <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded shadow-2xs" title="Retrograde (ವಕ್ರ)">
                                {currentLang === 'kn' ? 'ವಕ್ರ' : currentLang === 'hi' ? 'वक्री' : 'Vakri [R]'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {p.name} • {p.rashiName[currentLang]} ({p.degrees}°)
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className="font-mono font-black text-lg text-stone-900 dark:text-white leading-tight">
                          {bala.totalScore}<span className="text-xs font-normal text-stone-500">/100</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${bala.colorTheme.badge}`}>
                          {bala.levelText[currentLang]}
                        </span>
                      </div>
                    </div>

                    {/* House Placement & Dignity Tag */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        {bala.bhavaBala.houseTypeText[currentLang]}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-bold bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        {bala.sthanaBala.dignityText[currentLang]}
                      </span>
                      {bala.digbala.hasDigbala && (
                        <span className="px-2 py-0.5 rounded-md font-bold bg-blue-600 text-white shadow-2xs">
                          {currentLang === 'kn' ? 'ಪೂರ್ಣ ದಿಗ್ಬಲ' : currentLang === 'hi' ? 'पूर्ण दिग्बल' : 'Full Digbala'}
                        </span>
                      )}
                    </div>

                    {/* 4 Score Breakdown Bars */}
                    <div className="mt-4 space-y-2 text-xs">
                      
                      {/* Sthana Bala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ಸ್ಥಾನ ಬಲ (Sign Dignity)' : currentLang === 'hi' ? 'स्थान बल' : 'Sthana Bala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.sthanaBala.points}/{bala.sthanaBala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.sthanaBala.points / bala.sthanaBala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Bhava Bala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ಭಾವ ಬಲ (House Placement)' : currentLang === 'hi' ? 'भाव बल' : 'Bhava Bala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.bhavaBala.points}/{bala.bhavaBala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.bhavaBala.points / bala.bhavaBala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Digbala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ದಿಗ್ಬಲ (Directional Power)' : currentLang === 'hi' ? 'दिग्बल' : 'Digbala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.digbala.points}/{bala.digbala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.digbala.points / bala.digbala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Cheshta Bala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ಚೇಷ್ಟಾ ಬಲ (Motion/Luminosity)' : currentLang === 'hi' ? 'चेष्टा बल' : 'Cheshta Bala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.cheshtaBala.points}/{bala.cheshtaBala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.cheshtaBala.points / bala.cheshtaBala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Astrological Insight Quote */}
                    <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-black/5 dark:border-white/5 shadow-inner">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಫಲ:' : currentLang === 'hi' ? 'ज्योतिषीय फल:' : 'Astrological Insight:'}</span>
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                        {bala.insight[currentLang]}
                      </p>
                    </div>

                  </div>

                  {/* Remedial Guidance Box */}
                  <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] text-stone-700 dark:text-stone-300">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                      {currentLang === 'kn' ? 'ಉಪಾಧೇಯ / ಪರಿಹಾರ ಮಾರ್ಗ:' : currentLang === 'hi' ? 'उपाय एवं अनुकूलता:' : 'Remedy & Harmonization:'}
                    </span>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {bala.remedy[currentLang]}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
        </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VIMSHOTTARI DASHA & DASHA INSIGHTS WITH RECHARTS */}
        {/* ========================================================================= */}
        {activeSectionTab === 'dasha' && (
          !isAstroUnlocked ? (
            renderAstroGateLockScreen(
              currentLang === 'kn'
                ? 'ವ್ಯಕ್ತಿಯ ಜನ್ಮ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರಸ್ತುತ ವಿಂಶೋತ್ತರಿ ಮಹಾದಶಾ, ಅಂತರ್ದಶಾ ಮತ್ತು ಫಲಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.'
                : 'Enter password to unlock personalized Vimshottari Mahadasha, Antardasha, and lifecycle effects.'
            )
          ) : (
            <div className="space-y-6 animate-in fade-in">
              {/* ========================================================================= */}
              {/* DASHA DASHBOARD SECTION: AGGREGATES PIE CHART, TIMELINE & AI INTERPRETER */}
              {/* ========================================================================= */}
              <DashaDashboard
                currentLang={currentLang}
                vimshottariDasha={vimshottariDasha}
                planetaryBalas={planetaryBalas}
                kundaliData={kundaliData}
                janmaVivara={janmaVivara}
              />
            
            {/* ========================================================================= */}
            {/* VIMSHOTTARI DASHA: EDUCATIONAL EXPLANATION CARDS */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: What is Vimshottari Dasha */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white border border-purple-500/40 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-mono text-[11px]">೧</span>
                  <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಎಂದರೇನು?' : '1. What is Vimshottari Dasha?'}</span>
                </div>
                <h4 className="font-serif font-bold text-base text-amber-300">
                  {currentLang === 'kn' ? '೧೨೦ ವರ್ಷಗಳ ಮಾನವ ಆಯುಷ್ಯದ ಚಕ್ರ' : 'The 120-Year Human Life Cycle'}
                </h4>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ಪರಾಶರ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಮಾನವನ ಪೂರ್ಣ ಆಯುಷ್ಯವನ್ನು ೧೨೦ ವರ್ಷಗಳೆಂದು ಪರಿಗಣಿಸಿ, ಜನನ ಕಾಲದ ಚಂದ್ರ ನಕ್ಷತ್ರದ ಆಧಾರದ ಮೇಲೆ ೯ ಗ್ರಹಗಳಿಗೆ ನಿಗದಿತ ವರ್ಷಗಳನ್ನು ಹಂಚಲಾದ ಮಹಾದಶಾ ಪದ್ಧತಿ (ಕೇತು ೭, ಶುಕ್ರ ೨೦, ಸೂರ್ಯ ೬, ಚಂದ್ರ ೧೦, ಕುಜ ೭, ರಾಹು ೧೮, ಗುರು ೧೬, ಶನಿ ೧೯, ಬುಧ ೧೭ ವರ್ಷ).'
                    : 'The premier Parashari Vedic system dividing human potential into a 120-year cycle among 9 Grahas based on Moon natal Nakshatra at birth (Ketu 7y, Venus 20y, Sun 6y, Moon 10y, Mars 7y, Rahu 18y, Jupiter 16y, Saturn 19y, Mercury 17y).'}
                </p>
              </div>

              {/* Card 2: Why is this calculated */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-stone-950 text-white border border-indigo-500/40 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-200 flex items-center justify-center font-mono text-[11px]">೨</span>
                  <span>{currentLang === 'kn' ? 'ಇದನ್ನು ಏಕೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ?' : '2. Why is This Calculated?'}</span>
                </div>
                <h4 className="font-serif font-bold text-base text-amber-300">
                  {currentLang === 'kn' ? 'ಕರ್ಮ ಫಲಗಳು ಹಣ್ಣಾಗುವ ಕಾಲನಿರ್ಣಯ' : 'Timing the Fruition of Karma'}
                </h4>
                <p className="text-xs text-indigo-100/90 leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ಜಾತಕ ಕುಂಡಲಿಯು ವ್ಯಕ್ತಿಯ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಭವಿಷ್ಯದ ಬೀಜವಾದರೆ, ದಶೆಯು ಆ ಬೀಜ ಮೊಳಕೆಯೊಡೆದು ಫಲ ನೀಡುವ "ಖಗೋಳೀಯ ಋತುಮಾನ". ವಿವಾಹ, ಉದ್ಯೋಗ, ಸಂಪತ್ತು, ಸಂತಾನ, ರೋಗ ಅಥವಾ ಮುಕ್ತಿ ಯಾವಾಗ ಸಂಭವಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ದಶಾ ನಾಯಕ ಗ್ರಹ ನಿರ್ಧರಿಸುತ್ತಾನೆ.'
                    : 'While the birth Kundali is the seed of latent karma, Dasha is the cosmic season when that seed flowers into reality. It pinpoints the precise periods for marriage, promotions, wealth creation, major challenges, or spiritual awakenings.'}
                </p>
              </div>

              {/* Card 3: How to check this */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 text-white border border-amber-500/40 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-mono text-[11px]">೩</span>
                  <span>{currentLang === 'kn' ? 'ಇದನ್ನು ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?' : '3. How to Check & Interpret?'}</span>
                </div>
                <h4 className="font-serif font-bold text-base text-amber-300">
                  {currentLang === 'kn' ? 'ಹಂತ ಹಂತದ ಜ್ಯೋತಿಷ್ಯ ವಿಧಾನ' : 'Step-by-Step Analysis'}
                </h4>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {currentLang === 'kn'
                    ? '೧) ಜನನ ನಕ್ಷತ್ರ ಮತ್ತು ಚಂದ್ರನ ಅಂಶದಿಂದ ಜನನ ದಶಾ ಶೇಷ ತಿಳಿಯಿರಿ. ೨) ಪ್ರಸ್ತುತ ಮಹಾದಶೆ ಹಾಗೂ ಅಂತರ್ದಶೆಯ ನಾಯಕ ಗ್ರಹಗಳ ಕುಂಡಲಿ ಭಾವ, ಉಚ್ಚ-ನೀಚ ಮತ್ತು ಬಲ ಪರಿಶೀಲಿಸಿ. ೩) ಗುರು ಮತ್ತು ಶನಿಯ ಪ್ರಸ್ತುತ ಗೋಚಾರದೊಂದಿಗೆ ಹೋಲಿಸಿ ಸಮಗ್ರ ಫಲ ತಿಳಿಯಿರಿ.'
                    : '1) Note Moon Nakshatra at birth to compute initial Dasha balance. 2) Examine current Mahadasha and Antardasha lords placement, house lordship, and dignity in the drawn Kundali. 3) Synthesize with active Jupiter and Saturn transits.'}
                </p>
              </div>

            </div>

            {/* Dasha Date, Time, Country, City & GPS Controls with Synchronized Kundali Chart */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-purple-300 dark:border-purple-800 shadow-md space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ದಶಾ ಪರಿಶೀಲನಾ ಜನನ ವಿವರಗಳು (Birth Date, Time & Place)' : 'Dasha Birth Date, Time & Place Configurator'}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {currentLang === 'kn' ? 'ಯಾವುದೇ ವ್ಯಕ್ತಿಯ ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಅವರ ನಿಖರ ವಿಂಶೋತ್ತರಿ ದಶಾ ಚಕ್ರ ಮತ್ತು ಕುಂಡಲಿ ವೀಕ್ಷಿಸಿ.' : 'Enter birth details to compute exact Dasha cycle and draw corresponding birth chart.'}
                    </p>
                  </div>
                </div>

                {/* GPS Button */}
                <button
                  type="button"
                  onClick={handleDetectGpsLocation}
                  disabled={isGpsLoading}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50 shrink-0"
                >
                  {isGpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                  <span>{currentLang === 'kn' ? 'ಜಿಪಿಎಸ್ ಸ್ಥಳ (GPS)' : 'Use GPS Location'}</span>
                </button>
              </div>

              {/* Grid: Date, Time & Worldwide Place Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-3">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (Date of Birth):' : 'Date of Birth:'}
                  </label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {currentLang === 'kn' ? 'ಜನ್ಮ ಸಮಯ (Time of Birth):' : 'Time of Birth:'}
                  </label>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                  />
                </div>

                <div className="md:col-span-6">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center justify-between">
                    <span>{currentLang === 'kn' ? 'ಜನ್ಮ ಸ್ಥಳ (Place / Google Maps / GPS):' : 'Birth Place (Worldwide / Maps / GPS):'}</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Worldwide Geocoding</span>
                    </span>
                  </label>
                  <WorldwidePlacePicker
                    currentLang={currentLang}
                    selectedCity={selectedCity}
                    onSelectCity={onSelectCity}
                    selectedCountryCode={selectedCountryCode}
                    setSelectedCountryCode={setSelectedCountryCode}
                    compact={true}
                  />
                </div>
              </div>

              {/* Synchronized Drawn Kundali Chart inside Dasha Tab */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    {currentLang === 'kn' ? 'ದಶಾ ನಿರ್ಣಯದ ಜನ್ಮ ಕುಂಡಲಿ' : 'Birth Chart for Dasha Calculation'}:
                  </span>
                  <span>
                    Lagna: <strong>{kundaliData.houses[0].rashiName[currentLang]}</strong> • Moon Nakshatra: <strong>{kundaliData.planets.find(p => p.name === 'Moon')?.nakshatra[currentLang]}</strong>
                  </span>
                </div>

                <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
                  <button
                    onClick={() => setChartStyle('north')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      chartStyle === 'north' ? 'bg-purple-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    North Indian (Diamond)
                  </button>
                  <button
                    onClick={() => setChartStyle('south')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      chartStyle === 'south' ? 'bg-purple-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    South Indian (Square)
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              {chartStyle === 'north' ? (
                <div className="relative w-full aspect-square max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] mx-auto bg-amber-50/60 rounded-2xl p-1.5 border-2 border-purple-500 shadow-xl overflow-hidden select-none">
                  <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
                    <rect x="0" y="0" width="500" height="500" fill="#faf5ff" stroke="#7e22ce" strokeWidth="3" />
                    <line x1="0" y1="0" x2="500" y2="500" stroke="#9333ea" strokeWidth="2" />
                    <line x1="500" y1="0" x2="0" y2="500" stroke="#9333ea" strokeWidth="2" />
                    <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#7e22ce" strokeWidth="2.5" />
                  </svg>
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '25%', maxWidth: '130px' }}>
                      <span className="text-[9.5px] font-black uppercase text-purple-700 bg-purple-100 px-1 py-0.2 rounded shadow-2xs">LAGNA {getHouseRashiNum(1)}</span>
                      <div className="max-w-[125px] mt-0.5">{renderHousePlanets(1, 'diamond')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '9%', maxWidth: '80px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(2)}</span>
                      <div className="max-w-[78px]">{renderHousePlanets(2, 'horizontal')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '9%', top: '25%', maxWidth: '52px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(3)}</span>
                      <div className="max-w-[50px]">{renderHousePlanets(3, 'vertical')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '50%', maxWidth: '125px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 py-0.2 rounded">{getHouseRashiNum(4)}</span>
                      <div className="max-w-[120px]">{renderHousePlanets(4, 'diamond')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '9%', top: '75%', maxWidth: '52px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(5)}</span>
                      <div className="max-w-[50px]">{renderHousePlanets(5, 'vertical')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '91%', maxWidth: '80px' }}>
                      <div className="max-w-[78px] mb-0.5">{renderHousePlanets(6, 'horizontal')}</div>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(6)}</span>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '75%', maxWidth: '130px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 py-0.2 rounded">{getHouseRashiNum(7)}</span>
                      <div className="max-w-[125px]">{renderHousePlanets(7, 'diamond')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '91%', maxWidth: '80px' }}>
                      <div className="max-w-[78px] mb-0.5">{renderHousePlanets(8, 'horizontal')}</div>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(8)}</span>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '91%', top: '75%', maxWidth: '52px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(9)}</span>
                      <div className="max-w-[50px]">{renderHousePlanets(9, 'vertical')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '50%', maxWidth: '125px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 py-0.2 rounded">{getHouseRashiNum(10)}</span>
                      <div className="max-w-[120px]">{renderHousePlanets(10, 'diamond')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '91%', top: '25%', maxWidth: '52px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(11)}</span>
                      <div className="max-w-[50px]">{renderHousePlanets(11, 'vertical')}</div>
                    </div>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '9%', maxWidth: '80px' }}>
                      <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-1 rounded-xs">{getHouseRashiNum(12)}</span>
                      <div className="max-w-[78px]">{renderHousePlanets(12, 'horizontal')}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-square max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] mx-auto bg-purple-50 rounded-xl p-1.5 border-2 border-purple-600 shadow-xl">
                  <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-purple-100/70 border border-purple-300">
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Meena (12)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 11)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Mesha (1)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 0)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Vrishabha (2)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 1)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Mithuna (3)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 2)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Kumbha (11)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 10)?.bhava || 0)}</div>
                    </div>
                    <div className="col-span-2 row-span-2 p-3 border border-purple-400 rounded bg-purple-50 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-sm font-serif font-bold text-purple-950">Dasha Kundali</span>
                      <span className="text-[11px] text-purple-800 font-bold mt-1 bg-purple-200/60 px-2 py-0.5 rounded-md">
                        Lagna: {kundaliData.houses[0].rashiName[currentLang]}
                      </span>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Karka (4)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 3)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Makara (10)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 9)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Simha (5)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 4)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Dhanu (9)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 8)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Vrishchika (8)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 7)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Tula (7)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 6)?.bhava || 0)}</div>
                    </div>
                    <div className="p-1 border border-purple-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                      <span className="text-[9px] font-bold text-purple-900">Kanya (6)</span>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 5)?.bhava || 0)}</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
            
            {/* Current Active Mahadasha & Antardasha Highlight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 text-white shadow-xl border border-purple-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ದಶಾ ಅವಧಿ' : 'CURRENTLY ACTIVE DASHA PERIOD'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
                    <span>{vimshottariDasha.currentMahadasha.lord.sanskrit[currentLang]} ಮಹಾದಶಾ</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      ACTIVE
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
                    {vimshottariDasha.currentMahadasha.lord.generalSignificance[currentLang]}
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-purple-400/20 shrink-0 text-xs space-y-1.5">
                  <div>
                    <span className="text-purple-300 font-bold block">Current Sub-period (ಅಂತರ್ದಶಾ):</span>
                    <span className="text-base font-bold text-amber-300 font-serif">
                      {vimshottariDasha.currentAntardasha.lord.sanskrit[currentLang]} ಅಂತರ್ದಶಾ
                    </span>
                  </div>
                  <div className="text-stone-300 text-[11px] pt-1 border-t border-white/10">
                    <span>ರತ್ನ: <strong>{vimshottariDasha.currentMahadasha.lord.gemstone[currentLang]}</strong></span> • 
                    <span className="ml-1">ಮಂತ್ರ: <span className="font-mono text-purple-200">{vimshottariDasha.currentMahadasha.lord.mantra[currentLang]}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PERSONALIZED PRESENT VIMSHOTTARI DASHA EFFECTS & KARMIC ANALYSIS */}
            {/* ========================================================================= */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/15 dark:from-stone-900 dark:via-purple-950/40 dark:to-stone-900 border-2 border-purple-400/70 dark:border-purple-600/50 shadow-2xl space-y-5 page-break-inside-avoid">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-lg shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-950 dark:text-white flex items-center gap-2">
                      <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ವಿಂಶೋತ್ತರಿ ದಶೆಯ ವೈಯಕ್ತಿಕ ಜೀವನ ಪ್ರಭಾವ & ಫಲಗಳು' : currentLang === 'hi' ? 'वर्तमान विंशोत्तरी दशा का जातक पर प्रभाव एवं जीवन फल' : 'Personalized Effects of Present Vimshottari Dasha for Entered Native'}</span>
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {currentLang === 'kn'
                        ? `ಜನ್ಮ ದಿನಾಂಕ: ${janmaVivara.dateFormatted} (${janmaVivara.cityName}) • ಸಕ್ರಿಯ ದಶಾ ನಾಯಕರು: ${vimshottariDasha.currentMahadasha.lord.sanskrit[currentLang]} ಮಹಾದಶಾ - ${vimshottariDasha.currentAntardasha.lord.sanskrit[currentLang]} ಅಂತರ್ದಶಾ`
                        : `Entered Birth: ${janmaVivara.dateFormatted} at ${janmaVivara.cityName} • Running Period: ${vimshottariDasha.currentMahadasha.lord.name} MD - ${vimshottariDasha.currentAntardasha.lord.name} AD`}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-300/80 dark:border-purple-800 shrink-0">
                  <span>{vimshottariDasha.currentAntardasha.startDate.toISOString().split('T')[0]}</span>
                  <span className="mx-1.5 text-stone-400">➔</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">{vimshottariDasha.currentAntardasha.endDate.toISOString().split('T')[0]}</span>
                </div>
              </div>

              {/* 3 Core Impact Domains: Career/Wealth, Health/Mind, Family/Domestic */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Career & Wealth */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-800 shadow-md space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span>{currentLang === 'kn' ? '೧. ವೃತ್ತಿ & ಆರ್ಥಿಕ ಪ್ರಭಾವ' : '1. Career & Wealth Impact'}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {currentDashaInterpretation.careerTitle[currentLang]}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                      {currentDashaInterpretation.careerDesc[currentLang]}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                    <span>✨ {currentLang === 'kn' ? 'ಉದ್ಯೋಗ & ಹೂಡಿಕೆ ಫಲ' : 'Professional Alignment'}</span>
                  </div>
                </div>

                {/* 2. Health & Vitality */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-rose-300/80 dark:border-stone-800 shadow-md space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <Heart className="w-4 h-4 text-rose-600" />
                      <span>{currentLang === 'kn' ? '೨. ಆರೋಗ್ಯ & ದೈಹಿಕ ಶಕ್ತಿ' : '2. Health & Vitality'}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ಆಯುರ್ವೇದ ದೋಷ ಮತ್ತು ಮಾನಸಿಕ ಶಾಂತಿ' : 'Ayurvedic Constitution & Mental Calm'}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                      {currentDashaInterpretation.healthDesc[currentLang]}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-rose-800 dark:text-rose-300 font-semibold flex items-center gap-1">
                    <span>🌿 {currentLang === 'kn' ? 'ದೈನಂದಿನ ಸಾತ್ವಿಕ ದಿನಚರಿ ಪಾಲಿಸಿ' : 'Ayurvedic Care Recommended'}</span>
                  </div>
                </div>

                {/* 3. Domestic & Relationships */}
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-indigo-300/80 dark:border-stone-800 shadow-md space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{currentLang === 'kn' ? '೩. ಕುಟುಂಬ & ದಾಂಪತ್ಯ ಜೀವನ' : '3. Family & Relationships'}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ದಾಂಪತ್ಯ ಸೌಖ್ಯ ಮತ್ತು ಸಾಮಾಜಿಕ ಪ್ರತಿಷ್ಠೆ' : 'Domestic Harmony & Social Standing'}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                      {currentDashaInterpretation.domesticDesc[currentLang]}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-indigo-800 dark:text-indigo-300 font-semibold flex items-center gap-1">
                    <span>🕊️ {currentLang === 'kn' ? 'ಪರಸ್ಪರ ತಿಳುವಳಿಕೆ ಮತ್ತು ಧರ್ಮ ಮಾರ್ಗ' : 'Patience & Compassion'}</span>
                  </div>
                </div>

              </div>

              {/* Recommended Vedic Remedy Card for Current Period */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-purple-900/40 border border-purple-500/40 text-stone-900 dark:text-stone-100 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-800 dark:text-amber-300 block">
                      {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ದಶೆಗೆ ಶಾಂತಿ ಪರಿಹಾರ:' : 'Prescribed Remedy for Active Dasha:'}
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {currentLang === 'kn'
                        ? `${vimshottariDasha.currentMahadasha.lord.sanskrit[currentLang]} ನಾಯಕ ಗ್ರಹಕ್ಕೆ ರತ್ನ: ${vimshottariDasha.currentMahadasha.lord.gemstone[currentLang]} • ಮಂತ್ರ: ${vimshottariDasha.currentMahadasha.lord.mantra[currentLang]}`
                        : `Active Lord ${vimshottariDasha.currentMahadasha.lord.name}: Gemstone: ${vimshottariDasha.currentMahadasha.lord.gemstone.en} • Beeja Mantra: ${vimshottariDasha.currentMahadasha.lord.mantra.en}`}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-purple-800 dark:text-purple-300 bg-white/60 dark:bg-black/40 px-3 py-1.5 rounded-lg border border-purple-400/40 shrink-0">
                  {currentLang === 'kn' ? 'ನಿತ್ಯ ೧೦೮ ಬಾರಿ ಜಪಿಸಿ' : 'Recite 108 Times Daily'}
                </div>
              </div>

            </div>

            {/* Dasha Insights Recharts Visualization */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-purple-200 dark:border-purple-900/60 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span>{currentLang === 'kn' ? 'ದಶಾ ಪ್ರಭಾವ ಮತ್ತು ತೀವ್ರತೆಯ ಹರಿವು (Dasha Insights)' : currentLang === 'hi' ? 'दशा प्रभाव एवं प्रवाह विश्लेषण (Dasha Insights)' : 'Vimshottari Dasha Intensity & Planetary Flow (Dasha Insights)'}</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn' 
                      ? '೧೨೦ ವರ್ಷಗಳ ವಿಂಶೋತ್ತರಿ ಚಕ್ರದಲ್ಲಿ ಪ್ರತಿ ಗ್ರಹದ ಮಹಾದಶಾ ಅವಧಿ ಮತ್ತು ಪ್ರಭಾವ ತೀವ್ರತೆಯ ರೇಖಾಚಿತ್ರ' 
                      : 'Monthly & yearly planetary period intensity flow across the complete 120-year cycle.'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 shrink-0">
                  Total Cycle: 120 Years
                </span>
              </div>

              {/* AreaChart Component */}
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vimshottariDasha.chartData} margin={{ top: 10, right: 15, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="dashaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="periodName" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-stone-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-purple-500/40">
                              <p className="font-bold text-purple-300 font-serif text-sm">{data.lord} Mahadasha</p>
                              <p className="text-stone-300">Period: {data.yearStart} - {data.yearEnd}</p>
                              <p>Influence Intensity: <strong className="text-amber-300 font-bold">{data.intensity} / 100</strong></p>
                              {data.isActive && <p className="text-emerald-400 font-bold">● Currently Running</p>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="intensity" stroke="#7e22ce" strokeWidth={3} fillOpacity={1} fill="url(#dashaGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Complete 9 Mahadashas Lifecycle Breakdown Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-3">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>{currentLang === 'kn' ? '೯ ಗ್ರಹಗಳ ಮಹಾದಶಾ ಕಾಲಾವಧಿ ಕೋಷ್ಟಕ (Complete 9 Mahadashas)' : 'Complete 9 Planetary Mahadasha Periods (120 Years)'}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 font-bold">
                      <th className="py-2.5 px-3">Planet (ದಶಾ ನಾಯಕ)</th>
                      <th className="py-2.5 px-3">Duration (ವರ್ಷಗಳು)</th>
                      <th className="py-2.5 px-3">Start Date</th>
                      <th className="py-2.5 px-3">End Date</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {vimshottariDasha.mahadashas.map((md, idx) => {
                      const nowTime = new Date().getTime();
                      const isPast = md.endDate.getTime() < nowTime;
                      const isCurrent = md.isCurrent;

                      return (
                        <tr key={idx} className={isCurrent ? 'bg-purple-500/10 font-bold' : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'}>
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full shrink-0" 
                              style={{ backgroundColor: md.lord.color }} 
                            />
                            <span className="font-serif">{md.lord.sanskrit[currentLang]}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">{md.durationYears} Years</td>
                          <td className="py-2.5 px-3 font-mono">{md.startDate.toISOString().split('T')[0]}</td>
                          <td className="py-2.5 px-3 font-mono">{md.endDate.toISOString().split('T')[0]}</td>
                          <td className="py-2.5 px-3">
                            {isCurrent ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                Current Active
                              </span>
                            ) : isPast ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-500">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                Upcoming
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* SACRED ASTROLOGICAL TABS: PASSWORD GATE & TAB VIEWS */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* TAB 3: VEDIC REMEDIES & ADVANCED JYOTISHA (NESTS PRASHNA, GUNA MILAN & TRANSITS) */}
        {/* ========================================================================= */}
        {activeSectionTab === 'remedies' && (
          !isAstroUnlocked ? (
            renderAstroGateLockScreen()
          ) : (
            <div className="space-y-6">
              {/* Sacred Astrological Suite: Internal Sub-Tabs within Vedic Remedies */}
              {/* Sacred Astrological Suite: Internal Sub-Tabs within Vedic Remedies (Multi-tab visible wrap, zero horizontal scroll) */}
              <div className="no-print p-2.5 sm:p-3 rounded-2xl bg-amber-50/95 dark:bg-stone-900 border border-amber-300/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-800 dark:text-amber-400 px-1 shrink-0">
                    {currentLang === 'kn' ? 'ವೈದಿಕ ವಿಭಾಗಗಳು:' : 'Vedic Sections:'}
                  </span>

                  {/* 3.1 Vedic Remedies */}
                  <button
                    onClick={() => setRemediesSubTab('upayas')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      remediesSubTab === 'upayas'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>{currentLang === 'kn' ? '೩.೧ ವೈದಿಕ ಪರಿಹಾರಗಳು & ಜನ್ಮ ಕುಂಡಲಿ' : '3.1 Vedic Remedies & Kundali'}</span>
                  </button>

                  {/* 3.2 Vimshottari Dasha */}
                  <button
                    onClick={() => setRemediesSubTab('dasha')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      remediesSubTab === 'dasha'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-purple-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-purple-500" />
                    <span>{currentLang === 'kn' ? '೩.೨ ವಿಂಶೋತ್ತರಿ ದಶಾ (Dasha)' : '3.2 Vimshottari Dasha'}</span>
                  </button>

                  {/* 3.3 Gochar Transits */}
                  <button
                    onClick={() => setRemediesSubTab('transits')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      remediesSubTab === 'transits'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{currentLang === 'kn' ? '೩.೩ ಗ್ರಹ ಗೋಚಾರ (Gochar)' : '3.3 Gochar Transits'}</span>
                  </button>

                  {/* 3.4 Prashna Kundali */}
                  <button
                    onClick={() => setRemediesSubTab('prashna')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      remediesSubTab === 'prashna'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{currentLang === 'kn' ? '೩.೪ ಪ್ರಶ್ನ ಕುಂಡಲಿ' : '3.4 Prashna Kundali'}</span>
                  </button>

                  {/* 3.5 Guna Milan */}
                  <button
                    onClick={() => setRemediesSubTab('compatibility')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      remediesSubTab === 'compatibility'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>{currentLang === 'kn' ? '೩.೫ ಗುಣ ಮಿಲನ' : '3.5 Guna Milan'}</span>
                  </button>
                </div>

                <button
                  onClick={handleLockAstro}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 flex items-center gap-1 cursor-pointer shrink-0 self-end md:self-auto"
                  title="Lock Astrological Suite"
                >
                  <Lock className="w-3 h-3 text-red-600" />
                  <span>{currentLang === 'kn' ? 'ವಿಭಾಗ ಲಾಕ್ ಮಾಡಿ' : 'Lock Section'}</span>
                </button>
              </div>

              {/* SUB-TAB 1: VEDIC REMEDIES & KUNDALI & HORIZONTAL TIMELINE */}
              {remediesSubTab === 'upayas' && (
                <VedicRemediesSection
                  currentLang={currentLang}
                  remediesData={vedicRemediesData}
                  kundaliData={kundaliData}
                  dateStr={dateStr}
                  setDateStr={setDateStr}
                  timeStr={timeStr}
                  setTimeStr={setTimeStr}
                  selectedCountryCode={selectedCountryCode}
                  setSelectedCountryCode={setSelectedCountryCode}
                  selectedCity={selectedCity}
                  onSelectCity={onSelectCity}
                  onDetectGps={handleDetectGpsLocation}
                  isGpsLoading={isGpsLoading}
                  gpsStatus={gpsStatus}
                  chartStyle={chartStyle}
                  setChartStyle={setChartStyle}
                  renderHousePlanets={renderHousePlanets}
                  getHouseRashiNum={getHouseRashiNum}
                  vimshottariDasha={vimshottariDasha}
                  planetaryBalas={planetaryBalas}
                />
              )}

              {/* SUB-TAB 2: VIMSHOTTARI DASHA & DASHA INSIGHTS */}
              {remediesSubTab === 'dasha' && (
                <div className="space-y-6 animate-in fade-in">
                  <DashaDashboard
                    currentLang={currentLang}
                    vimshottariDasha={vimshottariDasha}
                    planetaryBalas={planetaryBalas}
                    kundaliData={kundaliData}
                    janmaVivara={janmaVivara}
                  />

                  {/* VIMSHOTTARI DASHA: EDUCATIONAL EXPLANATION CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: What is Vimshottari Dasha */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white border border-purple-500/40 shadow-xl space-y-2">
                      <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                        <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-mono text-[11px]">೧</span>
                        <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಎಂದರೇನು?' : '1. What is Vimshottari Dasha?'}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-amber-300">
                        {currentLang === 'kn' ? '೧೨೦ ವರ್ಷಗಳ ಮಾನವ ಆಯುಷ್ಯದ ಚಕ್ರ' : 'The 120-Year Human Life Cycle'}
                      </h4>
                      <p className="text-xs text-purple-100/90 leading-relaxed">
                        {currentLang === 'kn'
                          ? 'ಪರಾಶರ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಮಾನವನ ಪೂರ್ಣ ಆಯುಷ್ಯವನ್ನು ೧೨೦ ವರ್ಷಗಳೆಂದು ಪರಿಗಣಿಸಿ, ಜನನ ಕಾಲದ ಚಂದ್ರ ನಕ್ಷತ್ರದ ಆಧಾರದ ಮೇಲೆ ೯ ಗ್ರಹಗಳಿಗೆ ನಿಗದಿತ ವರ್ಷಗಳನ್ನು ಹಂಚಲಾದ ಮಹಾದಶಾ ಪದ್ಧತಿ (ಕೇತು ೭, ಶುಕ್ರ ೨೦, ಸೂರ್ಯ ೬, ಚಂದ್ರ ೧೦, ಕುಜ ೭, ರಾಹು ೧೮, ಗುರು ೧೬, ಶನಿ ೧೯, ಬುಧ ೧೭ ವರ್ಷ).'
                          : 'The premier Parashari Vedic system dividing human potential into a 120-year cycle among 9 Grahas based on Moon natal Nakshatra at birth (Ketu 7y, Venus 20y, Sun 6y, Moon 10y, Mars 7y, Rahu 18y, Jupiter 16y, Saturn 19y, Mercury 17y).'}
                      </p>
                    </div>

                    {/* Card 2: Why is this calculated */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-stone-950 text-white border border-indigo-500/40 shadow-xl space-y-2">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-200 flex items-center justify-center font-mono text-[11px]">೨</span>
                        <span>{currentLang === 'kn' ? 'ಇದನ್ನು ಏಕೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ?' : '2. Why is This Calculated?'}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-amber-300">
                        {currentLang === 'kn' ? 'ಕರ್ಮ ಫಲಗಳು ಹಣ್ಣಾಗುವ ಕಾಲನಿರ್ಣಯ' : 'Timing the Fruition of Karma'}
                      </h4>
                      <p className="text-xs text-indigo-100/90 leading-relaxed">
                        {currentLang === 'kn'
                          ? 'ಜಾತಕ ಕುಂಡಲಿಯು ವ್ಯಕ್ತಿಯ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಭವಿಷ್ಯದ ಬೀಜವಾದರೆ, ದಶೆಯು ಆ ಬೀಜ ಮೊಳಕೆಯೊಡೆದು ಫಲ ನೀಡುವ "ಖಗೋಳೀಯ ಋತುಮಾನ". ವಿವಾಹ, ಉದ್ಯೋಗ, ಸಂಪತ್ತು, ಸಂತಾನ, ರೋಗ ಅಥವಾ ಮುಕ್ತಿ ಯಾವಾಗ ಸಂಭವಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ದಶಾ ನಾಯಕ ಗ್ರಹ ನಿರ್ಧರಿಸುತ್ತಾನೆ.'
                          : 'While the birth Kundali is the seed of latent karma, Dasha is the cosmic season when that seed flowers into reality. It pinpoints the precise periods for marriage, promotions, wealth creation, major challenges, or spiritual awakenings.'}
                      </p>
                    </div>

                    {/* Card 3: How to check this */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 text-white border border-amber-500/40 shadow-xl space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-mono text-[11px]">೩</span>
                        <span>{currentLang === 'kn' ? 'ಇದನ್ನು ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?' : '3. How to Check & Interpret?'}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-amber-300">
                        {currentLang === 'kn' ? 'ಹಂತ ಹಂತದ ಜ್ಯೋತಿಷ್ಯ ವಿಧಾನ' : 'Step-by-Step Analysis'}
                      </h4>
                      <p className="text-xs text-amber-100/90 leading-relaxed">
                        {currentLang === 'kn'
                          ? '೧) ಜನನ ನಕ್ಷತ್ರ ಮತ್ತು ಚಂದ್ರನ ಅಂಶದಿಂದ ಜನನ ದಶಾ ಶೇಷ ತಿಳಿಯಿರಿ. ೨) ಪ್ರಸ್ತುತ ಮಹಾದಶೆ ಹಾಗೂ ಅಂತರ್ದಶೆಯ ನಾಯಕ ಗ್ರಹಗಳ ಕುಂಡಲಿ ಭಾವ, ಉಚ್ಚ-ನೀಚ ಮತ್ತು ಬಲ ಪರಿಶೀಲಿಸಿ. ೩) ಗುರು ಮತ್ತು ಶನಿಯ ಪ್ರಸ್ತುತ ಗೋಚಾರದೊಂದಿಗೆ ಹೋಲಿಸಿ ಸಮಗ್ರ ಫಲ ತಿಳಿಯಿರಿ.'
                          : '1) Note Moon Nakshatra at birth to compute initial Dasha balance. 2) Examine current Mahadasha and Antardasha lords placement, house lordship, and dignity in the drawn Kundali. 3) Synthesize with active Jupiter and Saturn transits.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: PRASHNA KUNDALI */}
              {remediesSubTab === 'prashna' && (
                <PrashnaKundaliSection
                  currentLang={currentLang}
                  prashnaResult={prashnaResult}
                  prashnaDateStr={prashnaDateStr}
                  onDateChange={setPrashnaDateStr}
                  prashnaTimeStr={prashnaTimeStr}
                  onTimeChange={setPrashnaTimeStr}
                  onSetNow={handleSetPrashnaNow}
                  selectedCategory={prashnaCategoryId}
                  onSelectCategory={setPrashnaCategoryId}
                  renderHousePlanets={renderHousePlanets}
                  getHouseRashiNum={getHouseRashiNum}
                />
              )}

              {/* SUB-TAB 3: GUNA MILAN */}
              {remediesSubTab === 'compatibility' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Header Banner with Lock Action */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-900 via-pink-900 to-amber-900 text-white shadow-xl border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  <Heart className="w-4 h-4 text-amber-300" />
                  <span>{currentLang === 'kn' ? 'ವೈದಿಕ ಜಾತಕ ಮೈತ್ರಿ • ಅಷ್ಟಕೂಟ ಗುಣ ಮಿಲನ' : 'ASHTAKOOTA GUNA MILAN • MARRIAGE COMPATIBILITY'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {currentLang === 'kn' ? 'ವರ ಮತ್ತು ವಧು ಜಾತಕ ಗುಣ ಮಿಲನ ಪರೀಕ್ಷಕ' : 'Groom & Bride Astrological Compatibility'}
                </h2>
                <p className="text-xs sm:text-sm text-rose-200 mt-1 max-w-2xl">
                  {currentLang === 'kn'
                    ? 'ನಕ್ಷತ್ರ ಮತ್ತು ರಾಶಿ ಆಧಾರಿತ ೩೬ ಗುಣಗಳ ಅಷ್ಟಕೂಟ (ವರ್ಣ, ವಶ್ಯ, ತಾರಾ, ಯೋನಿ, ಗ್ರಹಮೈತ್ರಿ, ಗಣ, ಭಕೂಟ, ನಾಡಿ) ಹಾಗೂ ಮಾಂಗಲ್ಯ ದೋಷ ವಿಶ್ಲೇಷಣೆ.'
                    : 'Traditional 36-point Guna Milan matching covering Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi with Manglik dosha.'}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={handleLockAstro}
                  className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-rose-200 border border-rose-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Lock Guna Milan"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-300" />
                  <span>{currentLang === 'kn' ? 'ಲಾಕ್ ಮಾಡಿ' : 'Lock Guna Milan'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Groom & Bride Profiles with DOB, Time, Country, City & Drawn Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Groom (ವರ) Profile & Chart Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-indigo-200 dark:border-indigo-900 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                    <Users className="w-5 h-5" />
                    <h3 className="font-serif text-base">{currentLang === 'kn' ? '೧. ವರನ ಜಾತಕ ವಿವರಗಳು (Groom Profile)' : '1. Groom Birth Profile'}</h3>
                  </div>

                  {/* Groom Chart Style Switcher */}
                  <div className="inline-flex rounded-lg border border-indigo-200 dark:border-stone-700 p-0.5 bg-indigo-50/50 dark:bg-stone-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setGroomChartStyle('north')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        groomChartStyle === 'north'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      North
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroomChartStyle('south')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        groomChartStyle === 'south'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      South
                    </button>
                  </div>
                </div>

                {/* Groom Inputs Grid: DOB, TOB, Country, City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (Date of Birth):' : 'Date of Birth:'}
                    </label>
                    <input
                      type="date"
                      value={groomDob}
                      onChange={(e) => setGroomDob(e.target.value)}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ಜನ್ಮ ಸಮಯ (Time of Birth):' : 'Time of Birth:'}
                    </label>
                    <input
                      type="time"
                      value={groomTob}
                      onChange={(e) => setGroomTob(e.target.value)}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ದೇಶ (Country):' : 'Country:'}
                    </label>
                    <select
                      value={groomCountryCode}
                      onChange={(e) => {
                        setGroomCountryCode(e.target.value);
                        const matched = COUNTRIES_AND_CITIES.find(c => c.code === e.target.value);
                        if (matched && matched.cities.length > 0) {
                          setGroomCity(matched.cities[0]);
                        }
                      }}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {COUNTRIES_AND_CITIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name[currentLang] || c.name.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ನಗರ (City of Birth):' : 'City:'}
                    </label>
                    <select
                      value={groomCity.name}
                      onChange={(e) => {
                        const c = groomCountry.cities.find(item => item.name === e.target.value) || CITIES.find(item => item.name === e.target.value);
                        if (c) setGroomCity(c);
                      }}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {groomCountry.cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.stateLocalized ? c.stateLocalized[currentLang] : c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Derived Astrological Facts for Groom */}
                <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-[11px] grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold block uppercase">Nakshatra:</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {RASHI_NAKSHATRA_CHART[useManualGunaOverride ? groomNakshatra : derivedGroomInfo.nakshatra]?.[currentLang === 'kn' ? 'nakshatraKn' : 'nakshatraEn']}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold block uppercase">Moon Rashi:</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {RASHIS[useManualGunaOverride ? groomRashi : derivedGroomInfo.rashi]?.[currentLang]}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold block uppercase">Mars (Manglik):</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      House {useManualGunaOverride ? groomMarsHouse : derivedGroomInfo.marsHouse}
                    </strong>
                  </div>
                </div>

                {/* Groom's Drawn Kundali Chart with Realistic Grahas */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1 text-center font-serif">
                    {currentLang === 'kn' ? 'ವರನ ಜನ್ಮ ಕುಂಡಲಿ (Groom Kundali)' : 'Groom Natal Kundali Chart'}
                  </div>
                  {groomChartStyle === 'north' ? renderMiniNorthChart(groomKundali) : renderMiniSouthChart(groomKundali)}
                </div>
              </div>

              {/* Bride (ವಧು) Profile & Chart Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-rose-200 dark:border-rose-900 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold">
                    <Users className="w-5 h-5" />
                    <h3 className="font-serif text-base">{currentLang === 'kn' ? '೨. ವಧುವಿನ ಜಾತಕ ವಿವರಗಳು (Bride Profile)' : '2. Bride Birth Profile'}</h3>
                  </div>

                  {/* Bride Chart Style Switcher */}
                  <div className="inline-flex rounded-lg border border-rose-200 dark:border-stone-700 p-0.5 bg-rose-50/50 dark:bg-stone-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setBrideChartStyle('north')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        brideChartStyle === 'north'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      North
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrideChartStyle('south')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        brideChartStyle === 'south'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      South
                    </button>
                  </div>
                </div>

                {/* Bride Inputs Grid: DOB, TOB, Country, City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (Date of Birth):' : 'Date of Birth:'}
                    </label>
                    <input
                      type="date"
                      value={brideDob}
                      onChange={(e) => setBrideDob(e.target.value)}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ಜನ್ಮ ಸಮಯ (Time of Birth):' : 'Time of Birth:'}
                    </label>
                    <input
                      type="time"
                      value={brideTob}
                      onChange={(e) => setBrideTob(e.target.value)}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ದೇಶ (Country):' : 'Country:'}
                    </label>
                    <select
                      value={brideCountryCode}
                      onChange={(e) => {
                        setBrideCountryCode(e.target.value);
                        const matched = COUNTRIES_AND_CITIES.find(c => c.code === e.target.value);
                        if (matched && matched.cities.length > 0) {
                          setBrideCity(matched.cities[0]);
                        }
                      }}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {COUNTRIES_AND_CITIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name[currentLang] || c.name.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ನಗರ (City of Birth):' : 'City:'}
                    </label>
                    <select
                      value={brideCity.name}
                      onChange={(e) => {
                        const c = brideCountry.cities.find(item => item.name === e.target.value) || CITIES.find(item => item.name === e.target.value);
                        if (c) setBrideCity(c);
                      }}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {brideCountry.cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.stateLocalized ? c.stateLocalized[currentLang] : c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Derived Astrological Facts for Bride */}
                <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-[11px] grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold block uppercase">Nakshatra:</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {RASHI_NAKSHATRA_CHART[useManualGunaOverride ? brideNakshatra : derivedBrideInfo.nakshatra]?.[currentLang === 'kn' ? 'nakshatraKn' : 'nakshatraEn']}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold block uppercase">Moon Rashi:</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {RASHIS[useManualGunaOverride ? brideRashi : derivedBrideInfo.rashi]?.[currentLang]}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold block uppercase">Mars (Manglik):</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      House {useManualGunaOverride ? brideMarsHouse : derivedBrideInfo.marsHouse}
                    </strong>
                  </div>
                </div>

                {/* Bride's Drawn Kundali Chart with Realistic Grahas */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-rose-900 dark:text-rose-300 mb-1 text-center font-serif">
                    {currentLang === 'kn' ? 'ವಧುವಿನ ಜನ್ಮ ಕುಂಡಲಿ (Bride Kundali)' : 'Bride Natal Kundali Chart'}
                  </div>
                  {brideChartStyle === 'north' ? renderMiniNorthChart(brideKundali) : renderMiniSouthChart(brideKundali)}
                </div>
              </div>

            </div>

            {/* Optional Manual Astrological Override Toggle */}
            <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="manualOverrideToggle"
                  checked={useManualGunaOverride}
                  onChange={(e) => setUseManualGunaOverride(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="manualOverrideToggle" className="font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                  {currentLang === 'kn'
                    ? 'ಜ್ಯೋತಿಷಿ ಹಸ್ತಚಾಲಿತ ಆಯ್ಕೆ (Manual Nakshatra & Rashi Override - ಜನ್ಮ ಸಮಯ ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ)'
                    : 'Manual Nakshatra & Rashi Selector (Enable if birth time is unavailable or for testing custom pairs)'}
                </label>
              </div>

              {useManualGunaOverride && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-400">Quick Test:</span>
                  <button
                    onClick={() => {
                      setGroomNakshatra(12);
                      setGroomRashi(5);
                      setBrideNakshatra(13);
                      setBrideRashi(6);
                    }}
                    className="px-2 py-1 rounded bg-white dark:bg-stone-700 border text-[11px] font-medium"
                  >
                    Hasta & Chitra
                  </button>
                  <button
                    onClick={() => {
                      setGroomNakshatra(3);
                      setGroomRashi(1);
                      setBrideNakshatra(4);
                      setBrideRashi(2);
                    }}
                    className="px-2 py-1 rounded bg-white dark:bg-stone-700 border text-[11px] font-medium"
                  >
                    Rohini & Mrigashira
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* TOTAL ASHTAKOOTA SCORECARD & DEEP LIFE RESULTS EXPLANATION */}
            {/* ========================================================================= */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-amber-400 dark:border-amber-700 shadow-2xl space-y-6">
              
              {/* Header: Score, Percentage & Classical Verdict */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-amber-300 dark:border-stone-700 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>TOTAL ASHTAKOOTA SCORE • ಸಮಗ್ರ ಅಷ್ಟಕೂಟ ಗುಣ ಮಿಲನ</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold font-serif text-stone-950 dark:text-white">
                      {gunaMilan.totalScore}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-stone-500 font-serif">
                      / 36 Points
                    </span>
                    <span className="text-base font-bold font-mono px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                      {gunaMilan.percentage}%
                    </span>
                  </div>
                </div>

                <div className="md:text-right space-y-1.5">
                  <span 
                    className="inline-block px-5 py-2 rounded-full text-white font-serif font-black text-base shadow-lg ring-2 ring-white/30"
                    style={{ backgroundColor: gunaMilan.verdictColor }}
                  >
                    {gunaMilan.verdict[currentLang]}
                  </span>
                  <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    {gunaMilan.totalScore >= 28 
                      ? (currentLang === 'kn' ? 'ಉತ್ತಮ ದಾಂಪತ್ಯ ಯೋಗ - ಸುಖ, ಶಾಂತಿ, ಸಂತಾನ ಮತ್ತು ಐಶ್ವರ್ಯ ವೃದ್ಧಿ.' : 'Excellent match for profound marital bliss, vitality, and wealth.')
                      : gunaMilan.totalScore >= 18 
                      ? (currentLang === 'kn' ? 'ಮಧ್ಯಮ ಗುಣ ಮಿಲನ - ಪರಸ್ಪರ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಅಗತ್ಯ ಜ್ಯೋತಿಷ್ಯ ಪರಿಹಾರಗಳಿಂದ ಶುಭ.' : 'Acceptable harmony; mutual accommodation and simple remedies recommended.')
                      : (currentLang === 'kn' ? 'ಅಧಮ / ಅಶುಭ ಮಿಲನ - ದಾಂಪತ್ಯ ಕಲಹ ಹಾಗೂ ಸಂತಾನ ಬಾಧೆ ನಿವಾರಣೆಗೆ ವಿಶೇಷ ಪರಿಹಾರ ಅಗತ್ಯ.' : 'Sub-optimal compatibility; requires thorough astrological remedial counsel.')}
                  </p>
                </div>
              </div>

              {/* What is Ashtakoota Score & Why is it Calculated */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-amber-300 dark:border-amber-700/60 shadow-xs space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider font-serif">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>
                    {currentLang === 'kn' 
                      ? 'ಅಷ್ಟಕೂಟ ಗುಣ ಮಿಲನ ಎಂದರೇನು ಮತ್ತು ಇದರ ಮಹತ್ವವೇನು?' 
                      : 'What is the Ashtakoota Score and Why is it Calculated?'}
                  </span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[11.5px]">
                  {currentLang === 'kn'
                    ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಮಾನವ ದಾಂಪತ್ಯ ಜೀವನದ ೮ ಪ್ರಮುಖ ಆಯಾಮಗಳನ್ನು (ಅಷ್ಟಕೂಟ) ೩೬ ಗರಿಷ್ಠ ಅಂಕಗಳ ಮಾನದಂಡದಲ್ಲಿ ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಕೂಟವು ಮಾನಸಿಕ, ದೈಹಿಕ, ಸಾಮಾಜಿಕ, ಆರ್ಥಿಕ ಹಾಗೂ ತಳಿಶಾಸ್ತ್ರೀಯ (Genetic) ಹೊಂದಾಣಿಕೆಯನ್ನು ಅಳೆಯುತ್ತದೆ. ೧೮ ಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂಕಗಳು ವಿವಾಹಕ್ಕೆ ಅಗತ್ಯ ಕನಿಷ್ಠ ಮಾನದಂಡವಾಗಿದ್ದು, ೨೮ ರಿಂದ ೩೬ ಅಂಕಗಳು ಅತ್ಯಂತ ಶುಭ ಮತ್ತು ದೀರ್ಘಾಯುಷ್ಯದ ದಾಂಪತ್ಯವನ್ನು ಸೂಚಿಸುತ್ತವೆ.'
                    : 'The Ashtakoota system evaluates 8 essential dimensions of married life totaling 36 points based on the bride and groom’s Janma Nakshatra and Moon sign. It measures spiritual ego, mutual magnetism, destiny luck, intimate biology, mental wavelength, daily lifestyle, family prosperity, and genetic progeny viability. A score above 18 is auspicious, while 28–36 represents supreme cosmic alignment.'}
                </p>
              </div>

              {/* In-depth Breakdown of the 8 Kootas & What Each Score Means in Life */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>
                    {currentLang === 'kn' ? '೮ ಕೂಟಗಳ ವಿವರಣೆ ಮತ್ತು ದಾಂಪತ್ಯ ಜೀವನದಲ್ಲಿ ಪ್ರತಿಯೊಂದು ಅಂಕದ ಫಲ:' : 'Detailed Ashtakoota Scores & Their Real-Life Impact:'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* 1. Varna Koota (1 pt) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.varna.name[currentLang]} (1 Point)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.varna.obtainedPoints} / 1
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.varna.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.varna.obtainedPoints === 1
                          ? (currentLang === 'kn' ? 'ದಂಪತಿಗಳಲ್ಲಿ ಸಮಾನ ಆಧ್ಯಾತ್ಮಿಕ ಗೌರವ ಇರುತ್ತದೆ. ಅಹಂಕಾರದ ಸಂಘರ್ಷವಿಲ್ಲದೆ ಒಟ್ಟಾಗಿ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಾರೆ.' : 'Balances spiritual ego and intellect. Spouses respect each other’s worldview without intellectual superiority or domestic power struggles.')
                          : (currentLang === 'kn' ? 'ವೈಚಾರಿಕ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಅಥವಾ ಒಬ್ಬರು ಇನ್ನೊಬ್ಬರ ಮೇಲೆ ಪ್ರಾಬಲ್ಯ ತೋರಲು ಯತ್ನಿಸುವ ಸಾಧ್ಯತೆ. ಪರಸ್ಪರ ಗೌರವದಿಂದ ನಿವಾರಿಸಬಹುದು.' : 'Ego friction or intellectual dominance tendencies. Overcome through conscious mutual deference in family decisions.')}
                      </span>
                    </div>
                  </div>

                  {/* 2. Vashya Koota (2 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.vashya.name[currentLang]} (2 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.vashya.obtainedPoints} / 2
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.vashya.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.vashya.obtainedPoints >= 1.5
                          ? (currentLang === 'kn' ? 'ಪರಸ್ಪರ ಆಕರ್ಷಣೆ, ಪ್ರೀತಿ ಮತ್ತು ಸಮರ್ಪಣಾ ಮನೋಭಾವ ದೃಢವಾಗಿರುತ್ತದೆ. ಒಬ್ಬರ ಮಾತಿಗೆ ಇನ್ನೊಬ್ಬರು ಮನ್ನಣೆ ನೀಡುತ್ತಾರೆ.' : 'Fosters natural magnetic attraction and emotional receptivity. Spouses willingly accommodate each other without feeling subjugated.')
                          : (currentLang === 'kn' ? 'ಆಧಿಪತ್ಯ ಸ್ಥಾಪಿಸುವ ಹಠ ಅಥವಾ ಒಬ್ಬರ ಇಚ್ಛೆಯನ್ನು ಇನ್ನೊಬ್ಬರು ವಿರೋಧಿಸುವ ಲಕ್ಷಣ. ಮುಕ್ತ ಸಂಭಾಷಣೆ ಅಗತ್ಯ.' : 'Potential domestic control struggles or defiance. Fostering patient listening and transparent dialogue balances this score.')}
                      </span>
                    </div>
                  </div>

                  {/* 3. Tara Koota (3 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.tara.name[currentLang]} (3 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.tara.obtainedPoints} / 3
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.tara.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.tara.obtainedPoints >= 2
                          ? (currentLang === 'kn' ? 'ಸಂಪತ್ತು, ಆರೋಗ್ಯ ಮತ್ತು ಅದೃಷ್ಟದಲ್ಲಿ ವೃದ್ಧಿ. ಆಕಸ್ಮಿಕ ವಿಪತ್ತುಗಳಿಂದ ಸಂರಕ್ಷಣೆ ಮತ್ತು ನಿರಂತರ ಅಭ್ಯುದಯ.' : 'Guarantees destiny alignment, shared prosperity, and health luck. Spouses act as mutual lucky charms shielding against sudden misfortunes.')
                          : (currentLang === 'kn' ? 'ಆರೋಗ್ಯ ಏರಿಳಿತ ಅಥವಾ ಕೆಲಸಗಳಲ್ಲಿ ಅಡೆತಡೆಗಳು ಎದುರಾಗಬಹುದು. ಶಿವ-ಪಾರ್ವತಿ ಪೂಜೆಯಿಂದ ಶುಭಫಲ.' : 'Vipat or Pratyak tara influences may cause occasional health lethargy or career delays. Regular Mahamrityunjaya chants harmonize destiny.')}
                      </span>
                    </div>
                  </div>

                  {/* 4. Yoni Koota (4 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.yoni.name[currentLang]} (4 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.yoni.obtainedPoints} / 4
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.yoni.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.yoni.obtainedPoints >= 3
                          ? (currentLang === 'kn' ? 'ದೈಹಿಕ ಮತ್ತು ಆಂತರಿಕ ತೃಪ್ತಿ, ಪ್ರಣಯ ಬಾಂಧವ್ಯದಲ್ಲಿ ಅಪಾರ ಸುಖ ಹಾಗೂ ನೈಸರ್ಗಿಕ ಆಕರ್ಷಣೆ.' : 'Deep biological and physical compatibility. Ensures fulfilling intimacy, reciprocal passion, and instinctive emotional warmth.')
                          : (currentLang === 'kn' ? 'ದೈಹಿಕ ಅಭಿರುಚಿಗಳಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಅಥವಾ ತೃಪ್ತಿಯ ಕೊರತೆ. ಪರಸ್ಪರ ತಾಳ್ಮೆ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಬೆಂಬಲ ಅಗತ್ಯ.' : 'Differences in intimate rhythms or biological temperaments. Cultivating tenderness, trust, and quality shared leisure dissolves friction.')}
                      </span>
                    </div>
                  </div>

                  {/* 5. Graha Maitri (5 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.grahaMaitri.name[currentLang]} (5 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.grahaMaitri.obtainedPoints} / 5
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.grahaMaitri.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.grahaMaitri.obtainedPoints >= 4
                          ? (currentLang === 'kn' ? 'ಉತ್ತಮ ಗೆಳೆತನ, ಸದಾ ಮುಕ್ತ ಮಾತುಕತೆ ಮತ್ತು ಮನಸ್ಸಿನ ತರಂಗಾಂತರಗಳ ಸಾಮ್ಯತೆ. ಕಷ್ಟಕಾಲದಲ್ಲಿ ಒಬ್ಬರಿಗೊಬ್ಬರು ಬಲವಾಗಿ ನಿಲ್ಲುತ್ತಾರೆ.' : 'Profound psychological harmony and best-friend rapport. Spouses communicate effortlessly, share ideals, and remain united through financial or family challenges.')
                          : (currentLang === 'kn' ? 'ಮನಸ್ಸಿನ ಆಲೋಚನಾ ಕ್ರಮದಲ್ಲಿ ಭಿನ್ನತೆ. ಮಾತಿನಲ್ಲಿ ತಪ್ಪು ತಿಳುವಳಿಕೆ ಉಂಟಾಗದಂತೆ ಎಚ್ಚರ ವಹಿಸಬೇಕು.' : 'Contrasting emotional outlooks. Intentional active listening and avoiding judgmental communication preserves marital peace.')}
                      </span>
                    </div>
                  </div>

                  {/* 6. Gana Koota (6 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.gana.name[currentLang]} (6 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.gana.obtainedPoints} / 6
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.gana.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.gana.obtainedPoints === 6
                          ? (currentLang === 'kn' ? 'ದೈನಂದಿನ ಜೀವನ ಶೈಲಿ, ಆಹಾರ-ವಿಹಾರ, ಸಾಮಾಜಿಕ ಆಚಾರ-ವಿಚಾರಗಳಲ್ಲಿ ಅದ್ಭುತ ಹೊಂದಾಣಿಕೆ. ಮನೆಯಲ್ಲಿ ಸದಾ ಶಾಂತಿ.' : 'Harmonious domestic habits, social lifestyle, and temperamental balance (Deva/Manushya/Rakshasa). Ensures peace in daily household routines.')
                          : (currentLang === 'kn' ? 'ಸ್ವಭಾವದಲ್ಲಿ ತೀವ್ರತೆ ಅಥವಾ ಜೀವನಶೈಲಿಯಲ್ಲಿ ಭಿನ್ನತೆ (ಗಣ ದೋಷ). ಪರಸ್ಪರ ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯವನ್ನು ಗೌರವಿಸುವುದು ಸೂಕ್ತ.' : 'Temperamental variance (Gana Dosha). Respecting each other’s personal pace and private space avoids friction.')}
                      </span>
                    </div>
                  </div>

                  {/* 7. Bhakoot Koota (7 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.bhakoot.name[currentLang]} (7 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.bhakoot.obtainedPoints} / 7
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.bhakoot.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ:' : 'Life Result:'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.bhakoot.obtainedPoints === 7
                          ? (currentLang === 'kn' ? 'ಕುಟುಂಬದ ಆರ್ಥಿಕ ಸಂಪತ್ತು, ಸಂತಾನ ವೃದ್ಧಿ ಮತ್ತು ದೀರ್ಘಾಯುಷ್ಯದ ಪ್ರೇಮ. ಸಂಸಾರದಲ್ಲಿ ಸಮೃದ್ಧಿ ಮತ್ತು ಕೌಟುಂಬಿಕ ಏಳಿಗೆ.' : 'Secures joint financial wealth accumulation, marital longevity, and fruitful progeny. Blesses the household with peace and social prestige.')
                          : (currentLang === 'kn' ? 'ಭಕೂಟ ದೋಷ (೨/೧೨ ವ್ಯಯ, ೬/೮ ಶತ್ರು ಅಥವಾ ೯/೫). ಆರ್ಥಿಕ ಅಸಮತೋಲನ ಅಥವಾ ಸಂತಾನ ವಿಳಂಬ ಸಾಧ್ಯತೆ. ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಾರಾಯಣ ಅತ್ಯುತ್ತಮ ಪರಿಹಾರ.' : 'Bhakoot Dosha (2/12, 6/8, or 9/5 moon relation). Can induce financial instability or parenting stresses; classical Vishnu Sahasranama chanting brings grace.')}
                      </span>
                    </div>
                  </div>

                  {/* 8. Nadi Koota (8 pts) */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-serif font-bold text-stone-950 dark:text-white text-sm">
                          {gunaMilan.kootas.nadi.name[currentLang]} (8 Points)
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {gunaMilan.kootas.nadi.obtainedPoints} / 8
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                        {gunaMilan.kootas.nadi.description[currentLang]}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-700 text-[11px] leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                        {currentLang === 'kn' ? 'ಜೀವನದಲ್ಲಿ ಇದರ ಫಲ (ಅತ್ಯುನ್ನತ ಮಹತ್ವ):' : 'Life Result (Highest Weightage):'}
                      </strong>
                      <span className="text-stone-700 dark:text-stone-300">
                        {gunaMilan.kootas.nadi.obtainedPoints === 8
                          ? (currentLang === 'kn' ? 'ಆರೋಗ್ಯವಂತ ಸಂತಾನ ಭಾಗ್ಯ, ದೃಢ ತಳಿಶಾಸ್ತ್ರೀಯ (Genetic) ಸಾಮರ್ಥ್ಯ ಮತ್ತು ನರಮಂಡಲದ ಸಾಮರಸ್ಯ. ದಂಪತಿಗಳ ಜೀವಕೋಶ ಶಕ್ತಿ ಪರಿಪೂರ್ಣ.' : 'Supreme genetic vitality and physiological resonance (Vata/Pitta/Kapha). Guarantees healthy progeny, strong lineage longevity, and physical stamina.')
                          : (currentLang === 'kn' ? 'ಏಕ ನಾಡಿ ದೋಷ (ಆದಿ, ಮಧ್ಯ ಅಥವಾ ಅಂತ್ಯ). ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಅಥವಾ ಗರ್ಭಧಾರಣೆಯ ವಿಳಂಬ ಸಾಧ್ಯತೆ. ಮಹಾಮೃತ್ಯುಂಜಯ ಹೋಮ ಅಥವಾ ಸ್ವರ್ಣ ದಾನದಿಂದ ಶಾಸ್ತ್ರೋಕ್ತ ನಿವಾರಣೆ.' : 'Single Nadi Dosha (same physiological constitution). May indicate reproductive delays or chronic fatigue. Mahamrityunjaya Homa dissolves classical afflictions.')}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Manglik Analysis Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 font-serif text-sm">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ಕುಜ (ಮಾಂಗಲ್ಯ) ದೋಷ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆ:' : 'Manglik Dosha Verification & Harmony:'}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                    gunaMilan.manglikStatus.isCompatible 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {gunaMilan.manglikStatus.isCompatible ? 'Harmonized / Balanced' : 'Requires Remedy'}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                  {gunaMilan.manglikStatus.description[currentLang]}
                </p>
              </div>

              {/* Classical Recommendations & Vedic Remedies */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <span className="font-bold text-amber-900 dark:text-amber-200 block font-serif text-sm">
                  {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೀಯ ಜ್ಯೋತಿಷ್ಯ ಸಲಹೆಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು (Vedic Remedies):' : 'Classical Astrological Guidance & Vedic Remedies:'}
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-700 dark:text-stone-300 text-[11.5px] leading-relaxed">
                  {gunaMilan.recommendations.map((rec, i) => (
                    <li key={i}>{rec[currentLang]}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}
              {/* SUB-TAB 4: PLANETARY TRANSITS (GOCHAR) ALERTS & KUNDALI */}
              {remediesSubTab === 'transits' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Transit Banner with Lock Action */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-800 via-orange-800 to-stone-900 text-white shadow-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>{currentLang === 'kn' ? 'ಗೋಚಾರ ಗ್ರಹ ಸಂಚಾರ & ನೈಜ ಕುಂಡಲಿ' : 'PLANETARY GOCHAR TRANSITS & KUNDALI'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                        {currentLang === 'kn' ? 'ಲಗ್ನ ಭಾವಗಳ ಮೇಲೆ ಮುಖ್ಯ ಗ್ರಹಗಳ ಸಂಚಾರ ಪ್ರಭಾವ' : 'Transit Alerts on Your Lagna House'}
                      </h2>
                      <p className="text-xs sm:text-sm text-amber-200 mt-1 max-w-2xl">
                        {currentLang === 'kn'
                          ? `ನಿಮ್ಮ ಲಗ್ನ ರಾಶಿ: ${kundaliData.houses[0].rashiName[currentLang]} (${kundaliData.lagnaDegree}°). ಗುರು, ಶನಿ, ರಾಹು ಮತ್ತು ಕೇತು ಸಂಚಾರಗಳು ನಿಮ್ಮ ಜೀವಮಾನದ ಲಗ್ನ ಭಾವಗಳ ಮೇಲೆ ಬೀರುವ ಪ್ರಭಾವಗಳು.`
                          : `Your Ascendant Lagna is ${kundaliData.houses[0].rashiName[currentLang]}. Real-time impact of Jupiter and Saturn entering new signs on your natal houses.`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={handleLockAstro}
                        className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        title="Lock Transit Alerts"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{currentLang === 'kn' ? 'ಲಾಕ್ ಮಾಡಿ' : 'Lock Transits'}</span>
                      </button>

                      <button
                        onClick={handleArmAlerts}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer ${
                          notificationArmed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-stone-900 hover:bg-amber-100'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                        <span>{notificationArmed ? 'Alerts Active' : 'Arm Browser Transit Alert'}</span>
                      </button>
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* GOCHAR MASTER GUIDE: WHAT IS GOCHAR, WHY REQUIRED, CALCULATION & INTERPRETATION */}
                  {/* ========================================================================= */}
                  <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-stone-900 via-amber-950/70 to-stone-900 text-white border-2 border-amber-500/50 shadow-2xl space-y-5 page-break-inside-avoid">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-serif text-lg font-bold shadow-lg shrink-0">
                          <Compass className="w-5 h-5 text-amber-200" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                            {currentLang === 'kn' ? 'ಗೋಚಾರ ಮಾರ್ಗದರ್ಶಿ: ಗೋಚಾರ ಎಂದರೇನು, ಏಕೆ ಬೇಕು, ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ಫಲ ತಿಳಿಯುವುದು ಹೇಗೆ?' : currentLang === 'hi' ? 'गोचर सम्पूर्ण मार्गदर्शिका: गोचर क्या है, क्यों आवश्यक है, गणना एवं फल कैसे समझें?' : 'Gochar Master Guide: What is Gochar, Why Required, Calculation & Interpretation'}
                          </h3>
                          <p className="text-xs text-stone-300">
                            {currentLang === 'kn' ? 'ಪರಾಶರ ವೈದಿಕ ಸಿದ್ಧಾಂತದ ಪ್ರಕಾರ ಗ್ರಹಗಳ ಚಲನೆಯ ನೈಜ ಪ್ರಭಾವ ಮತ್ತು ಫಲಿತಾಂಶಗಳ ರಹಸ್ಯ' : 'Classical Parashari principles of planetary transits and environmental karmic triggers.'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                        Vedic Gochar Siddhanta
                      </span>
                    </div>

                    {/* 4 In-Depth Core Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Card 1: What is Gochar */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                            <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center font-mono text-[11px]">೧</span>
                            <span>{currentLang === 'kn' ? 'ಗೋಚಾರ ಎಂದರೇನು? (What is Gochar?)' : '1. What is Gochar?'}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-stone-100">
                            {currentLang === 'kn' ? 'ಆಕಾಶದಲ್ಲಿ ಗ್ರಹಗಳ ಪ್ರಸ್ತುತ ನೈಜ ಸಂಚಾರ' : 'Real-Time Planetary Motion Across the Zodiac'}
                          </h4>
                          <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs mt-1.5">
                            {currentLang === 'kn'
                              ? 'ಸಂಸ್ಕೃತದಲ್ಲಿ "ಗೋ" ಎಂದರೆ ನಕ್ಷತ್ರ-ಗ್ರಹಗಳು ಅಥವಾ ರಶ್ಮಿಗಳು, "ಚಾರ" ಎಂದರೆ ಚಲನೆ ಅಥವಾ ಸಂಚಾರ. ಜನ್ಮ ಕುಂಡಲಿಯು ವ್ಯಕ್ತಿಯ ಜನನ ಕಾಲದ ಸ್ಥಿರ ನಕ್ಷೆಯಾದರೆ, ಗೋಚಾರವು ಪ್ರಸ್ತುತ ಆಕಾಶದಲ್ಲಿ ೧೨ ರಾಶಿಗಳ ಮೂಲಕ ನಿರಂತರವಾಗಿ ಚಲಿಸುತ್ತಿರುವ ಗ್ರಹಗಳ ನೈಜ ಸ್ಥಾನ. ಇದನ್ನು ವ್ಯಕ್ತಿಯ ಜನ್ಮ ರಾಶಿ (ಚಂದ್ರ ಲಗ್ನ) ಮತ್ತು ಜನ್ಮ ಲಗ್ನದಿಂದ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.'
                              : 'The word "Gochar" stems from Sanskrit: "Go" (celestial bodies/rays) + "Chara" (transit/movement). While your natal Kundali is a fixed blueprint of destiny, Gochar is the continuous real-time movement of planets through the 12 Zodiac signs relative to your natal Moon sign (Chandra Lagna) and Ascendant (Lagna).'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[10px] text-amber-300 font-mono">
                          {currentLang === 'kn' ? 'ಚಂದ್ರ ಲಗ್ನದಿಂದ ಗ್ರಹಗಳ ಚಲನೆಯ ಲೆಕ್ಕ' : 'Transits referenced from Moon Lagna'}
                        </div>
                      </div>

                      {/* Card 2: Why is Gochar Required */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-mono text-[11px]">೨</span>
                            <span>{currentLang === 'kn' ? 'ಗೋಚಾರ ಏಕೆ ಅವಶ್ಯಕ? (Why is it Required?)' : '2. Why is Gochar Required?'}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-stone-100">
                            {currentLang === 'kn' ? 'ದಶಾ ಫಲಗಳನ್ನು ಪ್ರಚೋದಿಸುವ "ಖಗೋಳೀಯ ಪ್ರಚೋದಕ"' : 'The Karmic Delivery Clock & Environmental Trigger'}
                          </h4>
                          <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs mt-1.5">
                            {currentLang === 'kn'
                              ? 'ಜನ್ಮ ಕುಂಡಲಿಯು ಬೀಜ, ವಿಂಶೋತ್ತರಿ ದಶೆಯು ಹವಾಮಾನ (ಋತು), ಆದರೆ ಗೋಚಾರವು ಮಳೆ ಅಥವಾ ಬಿಸಿಲಿನಂತೆ ಆ ಬೀಜ ಮೊಳಕೆಯೊಡೆಯಲು ನೀಡುವ "ತಕ್ಷಣದ ಪ್ರಚೋದಕ". ದಶೆಯು ಉತ್ತಮವಾಗಿದ್ದರೂ ಗೋಚಾರ ಪ್ರತಿಕೂಲವಾಗಿದ್ದರೆ ತಾತ್ಕಾಲಿಕ ಅಡೆತಡೆಗಳು ಎದುರಾಗುತ್ತವೆ; ಅದೇ ರೀತಿ ಅನುಕೂಲಕರ ಗುರು-ಶನಿ ಗೋಚಾರ ಒದಗಿಬಂದಾಗ ವಿವಾಹ, ಉದ್ಯೋಗ ಬಡ್ತಿ ಮತ್ತು ಭಾಗ್ಯೋದಯ ಸಂಭವಿಸುತ್ತದೆ.'
                              : 'Natal chart is the potential seed; Vimshottari Dasha is the broad season; Gochar is the instantaneous climatic trigger. A significant event manifests only when both Dasha and Gochar agree. Even during a favorable Dasha, a testing transit (like Sade Sati or 8th house Saturn) causes temporary roadblocks; conversely, a benevolent Jupiter transit can catalyze breakthroughs and fulfill long-cherished dreams.'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-300 font-mono">
                          {currentLang === 'kn' ? 'ದಶಾ + ಗೋಚಾರ ಸಮಾಗಮ = ಘಟನಾ ಸಿದ್ಧಿ' : 'Dasha + Gochar Alignment = Event Fruition'}
                        </div>
                      </div>

                      {/* Card 3: How Gochar is Calculated */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
                            <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-mono text-[11px]">೩</span>
                            <span>{currentLang === 'kn' ? 'ಗೋಚಾರವನ್ನು ಹೇಗೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ? (How is it Calculated?)' : '3. How is Gochar Calculated?'}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-stone-100">
                            {currentLang === 'kn' ? 'ಚಂದ್ರ ಲಗ್ನ, ಶುಭ ಸ್ಥಾನಗಳು & ವೇಧ ನಿಯಮ' : 'Moon Ascendant, Favorable Houses & Vedha'}
                          </h4>
                          <div className="text-stone-300 leading-relaxed text-[11px] sm:text-xs mt-1.5 space-y-1">
                            <p>
                              {currentLang === 'kn'
                                ? '• ಶುಭ ಸ್ಥಾನಗಳು: ಸೂರ್ಯ (೩, ೬, ೧೦, ೧೧), ಚಂದ್ರ (೧, ೩, ೬, ೭, ೧೦, ೧೧), ಕುಜ/ಶನಿ/ರಾಹು/ಕೇತು (೩, ೬, ೧೧), ಬುಧ (೨, ೪, ೬, ೮, ೧೦, ೧೧), ಗುರು (೨, ೫, ೭, ೯, ೧೧ - ಗುರು ಬಲ), ಶುಕ್ರ (೧-೫, ೮, ೯, ೧೧, ೧೨).'
                                : '• Benefic Houses: Sun (3, 6, 10, 11), Moon (1, 3, 6, 7, 10, 11), Mars/Saturn/Rahu/Ketu (3, 6, 11), Mercury (2, 4, 6, 8, 10, 11), Jupiter (2, 5, 7, 9, 11 - Guru Bala), Venus (1-5, 8, 9, 11, 12).'}
                            </p>
                            <p>
                              {currentLang === 'kn'
                                ? '• ವೇಧ ನಿಯಮ: ಶುಭ ಸ್ಥಾನದಲ್ಲಿರುವ ಗ್ರಹಕ್ಕೆ ನಿಗದಿತ ವೇಧ ಸ್ಥಾನದಲ್ಲಿ ಇನ್ನೊಂದು ಗ್ರಹ ಸಂಚರಿಸಿದರೆ ಶುಭ ಫಲಕ್ಕೆ ಅಡೆತಡೆ ಉಂಟಾಗುತ್ತದೆ. ಸಾಡೇ ಸಾತಿ (ಚಂದ್ರನ ೧೨, ೧, ೨ ರಲ್ಲಿ ಶನಿ) ಮತ್ತು ಅಷ್ಟಕವರ್ಗ ಬಿಂದುಗಳು (>೨೮ ಬಿಂದುಗಳು ಶುಭ) ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸುತ್ತವೆ.'
                                : '• Vedha Principle: An auspicious transit can be blocked if another planet enters the counter-transit (Vedha) house. Special conditions include Saturn Sade Sati (12th, 1st, 2nd from Moon), Ashtama Shani (8th), and Ashtakavarga Bindus (>28 is auspicious).'}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[10px] text-purple-300 font-mono">
                          {currentLang === 'kn' ? 'ವೇಧ ಮತ್ತು ಅಷ್ಟಕವರ್ಗ ಬಿಂದು ಪರಿಶೀಲನೆ' : 'Vedha Obstruction & Ashtakavarga Rules'}
                        </div>
                      </div>

                      {/* Card 4: How to Understand the Gochar Given Here */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                            <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-mono text-[11px]">೪</span>
                            <span>{currentLang === 'kn' ? 'ಇಲ್ಲಿ ನೀಡಿರುವ ಗೋಚಾರವನ್ನು ಹೇಗೆ ಅರ್ಥೈಸಿಕೊಳ್ಳಬೇಕು?' : '4. How to Understand the Gochar Given Here?'}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-stone-100">
                            {currentLang === 'kn' ? 'ನೈಜ ೩ಡಿ ಕುಂಡಲಿ, ಭಾವ ಪ್ರಭಾವ ಮತ್ತು ಶಾಂತಿ ಪರಿಹಾರಗಳು' : 'Interactive Transit Kundali, Bhavas & Actionable Remedies'}
                          </h4>
                          <div className="text-stone-300 leading-relaxed text-[11px] sm:text-xs mt-1.5 space-y-1">
                            <p>
                              {currentLang === 'kn'
                                ? '೧) ಕೆಳಗಿನ ನೈಜ ೩ಡಿ ಗೋಚಾರ ಕುಂಡಲಿಯನ್ನು ನೋಡಿ: ಇಂದಿನ ಖಗೋಳೀಯ ಗ್ರಹಗಳ ರಾಶಿ ಸ್ಥಾನಗಳನ್ನು ನಿಮ್ಮ ಜನ್ಮ ಲಗ್ನದ ಮೇಲೆ ಮ್ಯಾಪ್ ಮಾಡಲಾಗಿದೆ.'
                                : '1) Check the 3D Transit Kundali below: Live celestial Grahas mapped onto your natal Ascendant house.'}
                            </p>
                            <p>
                              {currentLang === 'kn'
                                ? '೨) ಗ್ರಹಗಳ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಭಾವ ಸಂಖ್ಯೆ (House From Lagna) ಪರಿಶೀಲಿಸಿ: ಗುರು ಮತ್ತು ಶನಿಯಂತಹ ಪ್ರಮುಖ ಗ್ರಹಗಳ ಪ್ರಸ್ತುತ ಪ್ರಭಾವ, ವೃತ್ತಿ/ಆರೋಗ್ಯ ಪರಿಣಾಮ ಹಾಗೂ ಶಾಂತಿ ಮಂತ್ರಗಳನ್ನು ಓದಿ.'
                                : '2) Note the "House from Lagna" tags: Review tailored impact analyses for Jupiter, Saturn, Rahu, and Ketu along with specific Vedic remedies.'}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[10px] text-amber-300 font-mono">
                          {currentLang === 'kn' ? 'ಬ್ರೌಸರ್ ಅಲರ್ಟ್‌ ಸಕ್ರಿಯಗೊಳಿಸಿ ಸಂಚಾರ ಎಚ್ಚರಿಕೆ ಪಡೆಯಿರಿ' : 'Arm browser alerts for transit notifications'}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* REALISTIC CELESTIAL TRANSIT KUNDALI CHART (Grahas in realistic 3D shapes with names inside) */}
                  <TransitKundaliChart 
                    kundaliData={kundaliData}
                    panchangDay={panchangDay}
                    currentLang={currentLang}
                  />

                  {/* Transit Alerts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transitAlerts.map((alert, idx) => (
                      <div 
                        key={idx}
                        className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold font-serif text-amber-700 dark:text-amber-300 text-sm">
                              {alert.symbol}
                            </div>
                            <div>
                              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm font-serif">
                                {alert.planet}
                              </h3>
                              <p className="text-[11px] text-stone-500">
                                Current Sign: {alert.currentRashi}
                              </p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                            House {alert.houseFromLagna}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-amber-800 dark:text-amber-300">
                            {alert.impactTitle[currentLang]}
                          </h4>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                            {alert.impactDesc[currentLang]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )
        )}

        {/* Printable Shanti Sloka & Blessing (Appears on print & PDF) */}
        <div className="print-only border-t-2 border-stone-300 pt-4 mt-6 text-center text-xs text-stone-600">
          <div className="font-serif font-bold text-sm text-stone-900 mb-1">
            ॥ ನವಗ್ರಹ ದೇವತಾಭ್ಯೋ ನಮಃ • ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು ॥
          </div>
          <div className="text-[10px] text-stone-500">
            HCMM Vedic Calendar & Panchanga Engine • Generated on {dateStr} at {timeStr} for {selectedCity.name}
          </div>
        </div>

      </div>

      {/* Bottom Navigation & Export Action Bar (Hidden in Print) */}
      <div className="no-print pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToCalendar}
          className="px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ (Back to Calendar)' : 'Back to Calendar'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportImage}
            disabled={isExportingImage}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isExportingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            <span>{isExportingImage ? 'Exporting Image...' : 'Export as Image (PNG)'}</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Export Kundali & Bala as PDF'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-500 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Chart</span>
          </button>
        </div>
      </div>

      {/* Worldwide Place Picker Modal */}
      {showWorldwideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-amber-500 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <Globe className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn' ? 'ಜಾಗತಿಕ ಸ್ಥಳ ಹುಡುಕಾಟ & ಗೂಗಲ್ ಮ್ಯಾಪ್' : 'Worldwide Place Search & Google Maps'}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn'
                      ? 'ಪ್ರಪಂಚದ ಯಾವುದೇ ನಗರವನ್ನು ಹುಡುಕಿ ಅಥವಾ ಗೂಗಲ್ ಮ್ಯಾಪ್ ಅಕ್ಷಾಂಶ-ರೇಖಾಂಶಗಳನ್ನು ನಮೂದಿಸಿ'
                      : 'Search any worldwide city, enter Google Maps coordinates, or use GPS detection.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWorldwideModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <WorldwidePlacePicker
              currentLang={currentLang}
              selectedCity={selectedCity}
              onSelectCity={(city) => {
                onSelectCity(city);
                setShowWorldwideModal(false);
              }}
              selectedCountryCode={selectedCountryCode}
              setSelectedCountryCode={setSelectedCountryCode}
              compact={false}
            />

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowWorldwideModal(false)}
                className="px-5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-300 cursor-pointer"
              >
                {currentLang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
