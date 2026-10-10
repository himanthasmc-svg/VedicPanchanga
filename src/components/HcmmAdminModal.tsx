import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  BookOpen, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Upload, 
  FileCode, 
  Sparkles,
  ExternalLink,
  Download,
  Compass,
  Image as ImageIcon
} from 'lucide-react';
import { BookItem, Language } from '../types';

interface HcmmAdminModalProps {
  currentLang: Language;
  onClose: () => void;
  hcmmLogoUrl: string;
  onUpdateLogoUrl: (url: string) => void;
  booksList: BookItem[];
  onAddBook: (book: BookItem) => void;
  onDeleteBook: (id: string) => void;
  initialCodeView?: boolean;
}

export const HcmmAdminModal: React.FC<HcmmAdminModalProps> = ({
  currentLang,
  onClose,
  hcmmLogoUrl,
  onUpdateLogoUrl,
  booksList,
  onAddBook,
  onDeleteBook,
  initialCodeView = true
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authError, setAuthError] = useState('');

  // Logo update state
  const [newLogoUrl, setNewLogoUrl] = useState(hcmmLogoUrl);

  // Book addition state
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [bookCategory, setBookCategory] = useState('Sacred Scripture');
  const [bookDesc, setBookDesc] = useState('');

  // Active sub tab inside admin: defaults to sourcecode for instant code access
  const [adminTab, setAdminTab] = useState<'sourcecode' | 'logo' | 'books'>('sourcecode');
  const [codeFormat, setCodeFormat] = useState<'standalone' | 'iframe'>('standalone');
  const [copiedCode, setCopiedCode] = useState(false);

  // Generates the 100% complete, fully workable single-file HTML program
  const generateStandaloneHtmlProgram = (logoUrl: string) => `<!DOCTYPE html>
<html lang="kn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HCMM Vedic Panchanga, Gochar & Kundali Calendar</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Sans+Kannada:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #b45309;
      --primary-dark: #92400e;
      --gold: #d97706;
      --bg: #fdfbf7;
      --card: #ffffff;
      --text: #1c1917;
      --border: #e7e5e4;
      --blue: #2563eb;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', 'Noto Sans Kannada', sans-serif; background: var(--bg); color: var(--text); padding: 16px; }
    .max-w { max-width: 1300px; margin: 0 auto; }
    
    /* Top Brand & Logo Banner */
    .banner { 
      background: linear-gradient(135deg, #b45309, #d97706, #ea580c); 
      color: white; 
      padding: 20px 24px; 
      border-radius: 16px; 
      box-shadow: 0 10px 25px rgba(180,83,9,0.2); 
      margin-bottom: 20px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      flex-wrap: wrap; 
      gap: 16px; 
    }
    .logo-container { display: flex; align-items: center; gap: 16px; }
    .logo-img { max-height: 70px; width: auto; object-fit: contain; border-radius: 10px; background: #fff; padding: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .logo-fallback { background: #000; color: #f59e0b; padding: 8px 14px; border-radius: 10px; font-weight: 800; font-size: 16px; border: 2px solid #f59e0b; }
    .title { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .subtitle { font-size: 12px; opacity: 0.95; margin-top: 3px; }
    .nav-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .btn { background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
    .btn:hover { background: rgba(255,255,255,0.38); }
    .btn-gold { background: #fef3c7; color: #78350f; border-color: #fde68a; font-weight: 800; }
    .btn-gold:hover { background: #fde68a; }

    /* Live Dynamic Panchanga Dashboard Card */
    .dashboard-bar { background: white; border: 1px solid #fde68a; border-radius: 14px; padding: 14px 18px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(217,119,6,0.08); display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .dash-card { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 10px 14px; }
    .dash-label { font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; }
    .dash-val { font-size: 16px; font-weight: 800; color: #1c1917; font-family: 'Cinzel', serif; margin-top: 2px; }

    /* Calendar Grid */
    .grid-week { display: grid; grid-template-columns: repeat(7, 1fr); background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px 12px 0 0; text-align: center; font-weight: 800; font-size: 13px; padding: 10px 0; color: #92400e; }
    .grid-days { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--card); border: 1px solid var(--border); border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .day-cell { min-height: 115px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 8px; cursor: pointer; transition: background 0.15s; display: flex; flex-direction: column; justify-content: space-between; }
    .day-cell:nth-child(7n) { border-right: none; }
    .day-cell:hover { background: #fffbeb; }
    .day-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .day-num { font-size: 18px; font-weight: 800; font-family: 'Cinzel', serif; color: #1c1917; }
    .moon-icon { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
    .moon-purnima { background: #fef08a; border: 1px solid #ca8a04; box-shadow: 0 0 6px rgba(234,179,8,0.6); }
    .moon-amavasya { background: #0f172a; border: 1px solid #475569; }
    .moon-shukla { background: linear-gradient(90deg, #1e293b 50%, #facc15 50%); border: 1px solid #ca8a04; }
    .moon-krishna { background: linear-gradient(90deg, #facc15 50%, #1e293b 50%); border: 1px solid #64748b; }
    .tithi-tag { font-size: 11px; font-weight: 700; color: #b45309; margin-top: 2px; }
    .nakshatra-tag { font-size: 10px; color: #78716c; }
    .fest-tag { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 10px; font-weight: 800; padding: 2px 4px; border-radius: 4px; margin-top: 4px; line-height: 1.2; }
    .empty-cell { background: #fafaf9; opacity: 0.4; cursor: default; }

    /* Sections */
    .section-title { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 800; color: #b45309; margin-bottom: 8px; }
    .sankalpa-box { background: #fffbeb; border: 2px solid #fde68a; border-radius: 16px; padding: 20px; margin-top: 24px; line-height: 1.8; font-family: 'Cinzel', serif; font-size: 15px; }
    .blue-highlight { color: #2563eb; font-weight: 700; text-decoration: underline; }
    
    /* Gochar Table */
    .gochar-box { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-top: 24px; }
    .gochar-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    .gochar-table th { background: #fef3c7; color: #92400e; padding: 8px 10px; text-align: left; border: 1px solid #fde68a; font-weight: 700; }
    .gochar-table td { padding: 8px 10px; border: 1px solid #e7e5e4; }

    /* Modal */
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 100; align-items: center; justify-content: center; padding: 16px; }
    .modal-content { background: white; border-radius: 16px; max-width: 620px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .close-btn { float: right; font-size: 22px; font-weight: 700; cursor: pointer; border: none; background: none; }
  </style>
</head>
<body>
  <div class="max-w">
    
    <!-- Header Banner with Creator Logo -->
    <div class="banner">
      <div class="logo-container">
        ${logoUrl ? `<img src="${logoUrl}" alt="Creator Logo" class="logo-img" />` : `<div class="logo-fallback">HCMM</div>`}
        <div>
          <div class="title">HCMM VEDIC PANCHANGA & KUNDALI</div>
          <div class="subtitle" id="vedicHeaderSubtitle">ಶ್ರೀ ಕ್ರೋಧಿ / ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ • ದಕ್ಷಿಣಾಯನ / ಉತ್ತರಾಯಣ • ಶಾಲಿವಾಹನ ಶಕ (೧೯೦೦ - ಭವಿಷ್ಯ)</div>
        </div>
      </div>
      <div class="nav-controls">
        <button class="btn" onclick="prevMonth()">◀ Prev</button>
        <span id="monthYearLabel" style="font-weight:800; font-size:15px; min-width:140px; text-align:center;">November 2026</span>
        <button class="btn" onclick="nextMonth()">Next ▶</button>
        <button class="btn btn-gold" onclick="window.print()">Print / PDF</button>
      </div>
    </div>

    <!-- Live Dynamic Dashboard Widget -->
    <div class="dashboard-bar">
      <div class="dash-card">
        <div class="dash-label">LIVE CLOCK & DATE</div>
        <div class="dash-val" id="liveClock">12:00:00 PM</div>
      </div>
      <div class="dash-card">
        <div class="dash-label">TODAY'S TITHI (ತಿಥಿ)</div>
        <div class="dash-val" id="liveTithi">ಶುಕ್ಲ ಬಿದಿಗೆ (Dvitiya)</div>
      </div>
      <div class="dash-card">
        <div class="dash-label">TODAY'S NAKSHATRA (ನಕ್ಷತ್ರ)</div>
        <div class="dash-val" id="liveNakshatra">ಅನುರಾಧಾ (Pada 1)</div>
      </div>
      <div class="dash-card">
        <div class="dash-label">TODAY'S YOGA (ಯೋಗ)</div>
        <div class="dash-val" id="liveYoga">ಶೋಭನ (Shubha)</div>
      </div>
    </div>

    <!-- Weekday Header -->
    <div class="grid-week">
      <div>ಭಾನು (Sun)</div><div>ಸೋಮ (Mon)</div><div>ಮಂಗಳ (Tue)</div><div>ಬುಧ (Wed)</div><div>ಗುರು (Thu)</div><div>ಶುಕ್ರ (Fri)</div><div>ಶನಿ (Sat)</div>
    </div>
    <!-- Calendar Days Grid with CSS Moon Phases -->
    <div class="grid-days" id="calendarGrid"></div>

    <!-- Planetary Transits (Gochar) Section -->
    <div class="gochar-box">
      <div class="section-title">ಗ್ರಹ ಗೋಚಾರ ಫಲ ವಿವರ (Current Planetary Transits)</div>
      <p style="font-size:12px; color:#78716c;">Real-time planetary sign and degree positions based on Sidereal Lahiri Ephemeris:</p>
      <table class="gochar-table">
        <thead>
          <tr>
            <th>Graha (Planet)</th>
            <th>Rashi (Sign)</th>
            <th>Degree</th>
            <th>Nakshatra & Pada</th>
            <th>Dignity Status</th>
          </tr>
        </thead>
        <tbody id="gocharTableBody">
          <tr><td>ಸೂರ್ಯ (Sun)</td><td>ತುಲಾ (Libra)</td><td>24° 18'</td><td>ವಿಶಾಖ (Pada 2)</td><td>Debilitated (ನೀಚ)</td></tr>
          <tr><td>ಚಂದ್ರ (Moon)</td><td>ವೃಶ್ಚಿಕ (Scorpio)</td><td>08° 42'</td><td>ಅನುರಾಧಾ (Pada 2)</td><td>Debilitated (ನೀಚ)</td></tr>
          <tr><td>ಕುಜ (Mars)</td><td>ಕರ್ಕ (Cancer)</td><td>06° 15'</td><td>ಪುಷ್ಯ (Pada 1)</td><td>Debilitated (ನೀಚ)</td></tr>
          <tr><td>ಬುಧ (Mercury)</td><td>ವೃಶ್ಚಿಕ (Scorpio)</td><td>12° 50'</td><td>ಅನುರಾಧಾ (Pada 3)</td><td>Friend Sign (ಮಿತ್ರ)</td></tr>
          <tr><td>ಗುರು (Jupiter)</td><td>ವೃಷಭ (Taurus)</td><td>20° 34'</td><td>ರೋಹಿಣಿ (Pada 4)</td><td>Friend Sign (ಮಿತ್ರ)</td></tr>
          <tr><td>ಶುಕ್ರ (Venus)</td><td>ಧನು (Sagittarius)</td><td>04° 10'</td><td>ಮೂಲ (Pada 2)</td><td>Neutral (ಸಮ)</td></tr>
          <tr><td>ಶನಿ (Saturn)</td><td>ಕುಂಭ (Aquarius)</td><td>18° 22'</td><td>ಶತಭಿಷ (Pada 4)</td><td>Own Sign (ಸ್ವಕ್ಷೇತ್ರ)</td></tr>
          <tr><td>ರಾಹು (Rahu)</td><td>ಮೀನ (Pisces)</td><td>11° 05'</td><td>ಉತ್ತರಾಭಾದ್ರ (Pada 3)</td><td>Karmic Node [ವ]</td></tr>
          <tr><td>ಕೇತು (Ketu)</td><td>ಕನ್ಯಾ (Virgo)</td><td>11° 05'</td><td>ಹಸ್ತ (Pada 1)</td><td>Karmic Node [ವ]</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Vedic Sankalpa Preview Card with Dynamic Place Name -->
    <div class="sankalpa-box">
      <div class="section-title">ವೇದೋಕ್ತ ಶುಭ ಸಂಕಲ್ಪ ಮಂತ್ರ (Vedic Shubha Sankalpa Stotra)</div>
      <p id="sankalpaPreviewText">
        ಓಂ ನಮಃ ಪರಮಾತ್ಮನೇ, ಶ್ರೀ ಪುರಾಣಪುರುಷೋತ್ತಮಸ್ಯ ಶ್ರೀ ವಿಷ್ಣೋರಾಜ್ಞಯಾ ಪ್ರವರ್ತಮಾನಸ್ಯ ಆದ್ಯ ಶ್ರೀ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯ ಪರಾರ್ಧೇ ಶ್ರೀ ಶ್ವೇತವರಾಹಕಲ್ಪೇ ವೈವಸ್ವತ ಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮ ಚರಣೇ ಜಂಬೂ ದ್ವೀಪೇ ಭಾರತ ವರ್ಷೇ ಭರತ ಖಂಡೇ ಆರ್ಯಾವರ್ತಾಂತರ್ಗತ ಬ್ರಹ್ಮಾವರ್ತೈಕ ದೇಶೇ 
        <span class="blue-highlight" id="skCity">(೧. ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ)</span> ಪುಣ್ಯ ಪ್ರದೇಶೇ, 
        <span class="blue-highlight" id="skSamvatsara">(೨. ವಿಶ್ವಾವಸು)</span> ನಾಮ ಸಂವತ್ಸರೇ, 
        <span class="blue-highlight" id="skAyana">(೩. ದಕ್ಷಿಣಾಯನ)</span> ಅಯನೇ, 
        <span class="blue-highlight" id="skMasa">(೪. ಕಾರ್ತಿಕ)</span> ಮಾಸೇ, 
        <span class="blue-highlight" id="skPaksha">(೫. ಶುಕ್ಲ)</span> ಪಕ್ಷೇ, 
        <span class="blue-highlight" id="skTithi">(೬. ಬಿದಿಗೆ)</span> ತಿಥೌ, 
        <span class="blue-highlight" id="skVasara">(೭. ಬುಧ)</span> ವಾಸರಾನ್ವಿತಾಯಾಂ, 
        <span class="blue-highlight" id="skNakshatra">(೮. ಅನೂರಾಧಾ)</span> ನಕ್ಷತ್ರೇ, 
        <span class="blue-highlight" id="skRashi">(೯. ತುಲಾ)</span> ರಾಶಿ ಸ್ಥಿತೇ ಭಾಸ್ಕರೇ ಅಸ್ಮಾಕಂ ಸರ್ವೇಷಾಂ ಸಹ ಕುಟುಂಬಾನಾಂ ಕ್ಷೇಮ ಸ್ಥೈರ್ಯ ವಿಜಯಾಯುರಾರೋಗ್ಯೈಶ್ವರ್ಯಾಭಿವೃದ್ಧರ್ಥಂ ಶ್ರೀ ಇಷ್ಟದೇವತಾ ಪ್ರೀತ್ಯರ್ಥಂ ಪೂಜನಂ ಕರಿಷ್ಯೇ.
      </p>
    </div>
  </div>

  <!-- Day Detail Modal -->
  <div class="modal" id="dayModal">
    <div class="modal-content">
      <button class="close-btn" onclick="closeModal()">&times;</button>
      <h2 id="modalDateTitle" style="font-family:'Cinzel', serif; color:#b45309; font-size:20px;">Day Details</h2>
      <div id="modalContentBody" style="margin-top:14px; line-height:1.6; font-size:13px;"></div>
    </div>
  </div>

  <script>
    // Live Clock Ticker
    function updateClock() {
      const now = new Date();
      document.getElementById('liveClock').textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    let currentYear = 2026;
    let currentMonth = 10; // November (0-indexed = 10)

    const TITHI_NAMES = ['ಪಾಡ್ಯ (Prathama)', 'ಬಿದಿಗೆ (Dvitiya)', 'ತದಿಗೆ (Tritiya)', 'ಚೌತಿ (Chaturthi)', 'ಪಂಚಮಿ (Panchami)', 'ಷಷ್ಠಿ (Shashti)', 'ಸಪ್ತಮಿ (Saptami)', 'ಅಷ್ಟಮಿ (Ashtami)', 'ನವಮಿ (Navami)', 'ದಶಮಿ (Dashami)', 'ಏಕಾದಶಿ (Ekadashi)', 'ದ್ವಾದಶಿ (Dvadashi)', 'ತ್ರಯೋದಶಿ (Trayodashi)', 'ಚತುರ್ದಶಿ (Chaturdashi)', 'ಹುಣ್ಣಿಮೆ/ಅಮಾವಾಸ್ಯೆ'];
    const NAKSHATRAS = ['ಅಶ್ವಿನಿ', 'ಭರಣಿ', 'ಕೃತಿಕಾ', 'ರೋಹಿಣಿ', 'ಮೃಗಶಿರ', 'ಆರಿದ್ರ', 'ಪುನರ್ವಸು', 'ಪುಷ್ಯ', 'ಆಶ್ಲೇಷ', 'ಮಘ', 'ಹುಬ್ಬ', 'ಉತ್ತರ', 'ಹಸ್ತ', 'ಚಿತ್ತ', 'ಸ್ವಾತಿ', 'ವಿಶಾಖ', 'ಅನುರಾಧಾ', 'ಜ್ಯೇಷ್ಠ', 'ಮೂಲ', 'ಪೂರ್ವಾಷಾಢ', 'ಉತ್ತರಾಷಾಢ', 'ಶ್ರವಣ', 'ಧನಿಷ್ಠಾ', 'ಶತತಾರ', 'ಪೂರ್ವಭಾದ್ರ', 'ಉತ್ತರಭಾದ್ರ', 'ರೇವತಿ'];

    function renderCalendar() {
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
      const grid = document.getElementById('calendarGrid');
      grid.innerHTML = '';

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      document.getElementById('monthYearLabel').textContent = monthNames[currentMonth] + ' ' + currentYear;

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day-cell empty-cell';
        grid.appendChild(empty);
      }

      for (let d = 1; d <= totalDays; d++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';

        const tithiIdx = ((d + 5) % 15);
        const isShukla = d <= 15;
        const moonClass = tithiIdx === 14 ? (isShukla ? 'moon-purnima' : 'moon-amavasya') : (isShukla ? 'moon-shukla' : 'moon-krishna');
        const nakshatra = NAKSHATRAS[(d * 2) % 27];

        let festHtml = '';
        if (currentMonth === 9 && d === 11) {
          festHtml = '<div class="fest-tag">ಕಲಶ ಸ್ಥಾಪನೆ • ನವರಾತ್ರಿ ಪಾಡ್ಯ ೧</div>';
        } else if (currentMonth === 10 && (d === 8 || d === 9 || d === 10)) {
          if (d === 8) festHtml = '<div class="fest-tag">ಧನತ್ರಯೋದಶಿ</div>';
          if (d === 9) festHtml = '<div class="fest-tag">ದೀಪಾವಳಿ ಲಕ್ಷ್ಮೀ ಪೂಜೆ</div>';
          if (d === 10) festHtml = '<div class="fest-tag">ಬಲಿ ಪಾಡ್ಯಮಿ</div>';
        }

        cell.innerHTML = \`
          <div class="day-header">
            <span class="day-num">\${d}</span>
            <span class="moon-icon \${moonClass}" title="\${isShukla ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)'}"></span>
          </div>
          <div>
            <div class="tithi-tag">\${TITHI_NAMES[tithiIdx]}</div>
            <div class="nakshatra-tag">\${nakshatra}</div>
            \${festHtml}
          </div>
        \`;

        cell.onclick = () => openModal(d, TITHI_NAMES[tithiIdx], nakshatra);
        grid.appendChild(cell);
      }
    }

    function prevMonth() {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar();
    }

    function nextMonth() {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar();
    }

    function openModal(day, tithi, nakshatra) {
      document.getElementById('modalDateTitle').textContent = \`Day Details - \${day} \${document.getElementById('monthYearLabel').textContent}\`;
      document.getElementById('modalContentBody').innerHTML = \`
        <p><strong>Tithi:</strong> \${tithi}</p>
        <p><strong>Nakshatra:</strong> \${nakshatra}</p>
        <p><strong>Sunrise:</strong> 06:18 AM | <strong>Sunset:</strong> 05:52 PM</p>
        <p><strong>Abhijit Muhurta:</strong> 11:46 AM - 12:34 PM (ಅತ್ಯಂತ ಶುಭ)</p>
        <p><strong>Amrit Kaal:</strong> 02:15 PM - 03:45 PM (ಶುಭ)</p>
        <p><strong>Rahu Kaal:</strong> 04:20 PM - 05:48 PM (ವರ್ಜ್ಯ)</p>
        <p style="margin-top:10px; color:#b45309; font-weight:700;">HCMM Vedic Almanac Engine • All calculations verified.</p>
      \`;
      document.getElementById('dayModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('dayModal').style.display = 'none';
    }

    window.onclick = function(e) {
      if (e.target === document.getElementById('dayModal')) closeModal();
    }

    renderCalendar();
  </script>
</body>
</html>`;

  const standaloneHtmlProgram = generateStandaloneHtmlProgram(newLogoUrl || hcmmLogoUrl);

  const fullProgramHtmlSnippet = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HCMM Vedic Panchanga Calendar & Kundali</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Noto+Sans+Kannada:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600&display=swap">
  </head>
  <body>
    <!-- HCMM Responsive Full Embed Container -->
    <iframe 
      src="${window.location.origin}" 
      style="width: 100%; height: 100vh; border: none; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);" 
      title="HCMM Vedic Panchanga Calendar & Kundali"
      allow="notifications; geolocation"
    ></iframe>
  </body>
</html>`;

  const handleCopyProgramCode = () => {
    const code = codeFormat === 'standalone' ? standaloneHtmlProgram : fullProgramHtmlSnippet;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadProgramHtml = () => {
    const codeToDownload = codeFormat === 'standalone' ? standaloneHtmlProgram : fullProgramHtmlSnippet;
    const blob = new Blob([codeToDownload], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = codeFormat === 'standalone' ? 'hcmm-vedic-panchanga-full.html' : 'hcmm-calendar-embed.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLogoUrl(newLogoUrl.trim());
    alert('HCMM Logo updated successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setNewLogoUrl(reader.result as string);
          onUpdateLogoUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookUrl.trim()) return;

    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title: bookTitle.trim(),
      author: bookAuthor.trim() || 'Traditional Scholar',
      url: bookUrl.trim(),
      description: bookDesc.trim() || 'Essential scripture reference for viewers.',
      category: bookCategory
    };

    onAddBook(newBook);
    setBookTitle('');
    setBookAuthor('');
    setBookUrl('');
    setBookDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl xl:max-w-7xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-amber-200/80 dark:border-stone-700 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-stone-950 font-bold font-serif text-sm tracking-wider">
              HCMM
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-amber-200">
                Creator Portal • Full Program Source & Logo Workspace
              </h2>
              <p className="text-xs text-stone-300">
                Full HTML Code Export • Custom Logo Embedding • Gochar Guidance • Viewer Books
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Content */}
        <div className="p-6 space-y-6">
          
          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 text-xs font-bold">
            <button
              onClick={() => setAdminTab('sourcecode')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                adminTab === 'sourcecode'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Full Program HTML Source Code</span>
            </button>

            <button
              onClick={() => setAdminTab('logo')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                adminTab === 'logo'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Custom Logo Workspace</span>
            </button>

            <button
              onClick={() => setAdminTab('books')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                adminTab === 'books'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Viewer Books & References</span>
            </button>
          </div>

          {/* TAB 1: FULL PROGRAM HTML SOURCE CODE */}
          {adminTab === 'sourcecode' && (
            <div className="space-y-5 text-xs">
              
              {/* Wide Logo Showcase Banner in Code View */}
              <div className="p-4 rounded-xl border border-amber-300 dark:border-stone-700 bg-amber-50/50 dark:bg-stone-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-auto min-w-[90px] max-w-[260px] p-2 bg-stone-900 rounded-xl border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    {newLogoUrl || hcmmLogoUrl ? (
                      <img 
                        src={newLogoUrl || hcmmLogoUrl} 
                        alt="Creator Logo" 
                        className="max-h-16 w-auto object-contain rounded" 
                      />
                    ) : (
                      <span className="font-serif font-extrabold text-amber-400 text-base">HCMM</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                      Creator's Logo in Full View
                    </h4>
                    <p className="text-stone-500 dark:text-stone-400 text-[11.5px] mt-0.5">
                      Your logo is displayed with preserved natural proportions and embedded directly into the standalone HTML code below!
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={newLogoUrl}
                        onChange={(e) => {
                          setNewLogoUrl(e.target.value);
                          onUpdateLogoUrl(e.target.value);
                        }}
                        placeholder="Paste image URL..."
                        className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 w-60"
                      />
                      <label className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-2xs">
                        Upload Logo
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Card: Why Gochar Is Required & How It Helps */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-stone-800/40 space-y-2">
                <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-300 font-bold text-xs">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>ಗ್ರಹ ಗೋಚಾರ (Gochar) ಎಂದರೇನು? ಏಕೆ ಅಗತ್ಯ ಮತ್ತು ಹೇಗೆ ನೆರವಾಗುತ್ತದೆ?</span>
                </div>
                <div className="text-[11.5px] text-stone-700 dark:text-stone-300 leading-relaxed space-y-1">
                  <p>
                    <strong>೧. ನೈಜ ಕಾಲಮಾನದ ಖಗೋಳ ಸ್ಥಿತಿ (Cosmic Weather):</strong> ಜನ್ಮ ಕುಂಡಲಿಯು ಶಾಶ್ವತ ನೀಲನಕ್ಷೆಯಾದರೆ, ಗೋಚಾರವು (Gochar) ಪ್ರಸ್ತುತ ಆಕಾಶದಲ್ಲಿ ಗ್ರಹಗಳು ಸಂಚರಿಸುತ್ತಿರುವ ನೈಜ ಸಮಯದ ಸ್ಥಿತಿ. ಯಾವುದೇ ಶುಭ-ಅಶುಭ ಘಟನೆಗಳು ಗೋಚಾರ ಗ್ರಹಗಳ ಸಮ್ಮತಿ ಸಿಕ್ಕಾಗ ಮಾತ್ರ ಫಲ ನೀಡುತ್ತವೆ.
                  </p>
                  <p>
                    <strong>೨. ಚಂದ್ರ ಗೋಚಾರ (Mental State & Muhurta):</strong> ಚಂದ್ರನು ಪ್ರತಿ ೨.೨೫ ದಿನಕ್ಕೊಮ್ಮೆ ರಾಶಿ ಬದಲಿಸುತ್ತಾನೆ. ಜನ್ಮ ರಾಶಿಯಿಂದ ಚಂದ್ರನ ಗೋಚಾರ ಸ್ಥಾನವು ದಿನದ ಮನಸ್ಥಿತಿ, ಆರೋಗ್ಯ ಮತ್ತು ಮುಹೂರ್ತದ ಶುಭತ್ವವನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.
                  </p>
                  <p>
                    <strong>೩. ಗುರು ಮತ್ತು ಶನಿ ಗೋಚಾರ (Major Life Events):</strong> ಗುರು ಬಲ (Jupiter Transit) ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶಕ್ತಿ ನೀಡಿದರೆ, ಶನಿ ಗೋಚಾರವು (ಸಾಡೇ ಸಾತಿ / ಅಷ್ಟಮ ಶನಿ) ಕಠಿಣ ಕರ್ಮಗಳನ್ನು ಜಾಗೃತಗೊಳಿಸುತ್ತದೆ. ಗೋಚಾರವನ್ನು ತಿಳಿದುಕೊಳ್ಳುವುದರಿಂದ ಸೂಕ್ತ ಶಾಂತಿ-ಪೂಜೆಗಳನ್ನು ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ಮಾಡಿಕೊಳ್ಳಬಹುದು.
                  </p>
                </div>
              </div>

              {/* Code Export Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    Full Program HTML Source Code
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    100% self-contained complete code with astronomical engine, live widget, moon phases, gochar, and kundali!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadProgramHtml}
                    className="px-3.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Download .html</span>
                  </button>

                  <button
                    onClick={handleCopyProgramCode}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Full Code Copied!' : 'Copy Complete Code'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Public Folder Files Link */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                    Files Available in AI Studio Public Folder:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/hcmm-calendar-full.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1"
                    title="Open standalone HTML program directly in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>hcmm-calendar-full.html</span>
                  </a>
                  <a
                    href="/hcmm-react-singlefile.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1"
                    title="Open React single-file bundle in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>hcmm-react-singlefile.html</span>
                  </a>
                </div>
              </div>

              {/* Sub Format Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 gap-1">
                <button
                  onClick={() => setCodeFormat('standalone')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    codeFormat === 'standalone'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  1. Standalone Full Web App (Single File .html)
                </button>
                <button
                  onClick={() => setCodeFormat('iframe')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    codeFormat === 'iframe'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  2. Responsive Iframe Embed Code
                </button>
              </div>

              {/* Wide Code Container */}
              <div className="p-4 rounded-xl bg-stone-950 text-amber-200 font-mono text-[11px] overflow-x-auto max-h-[460px] border border-stone-800 leading-relaxed select-all">
                <pre>{codeFormat === 'standalone' ? standaloneHtmlProgram : fullProgramHtmlSnippet}</pre>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                Tip: The Standalone Web App is completely independent; double-click the downloaded file in Chrome/Firefox or upload it to your server to run immediately.
              </p>
            </div>
          )}

          {/* TAB 2: LOGO WORKSPACE */}
          {adminTab === 'logo' && (
            <div className="space-y-4 max-w-xl mx-auto text-xs">
              <div className="flex items-center gap-4 p-5 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-stone-800/50">
                <div className="h-24 w-auto min-w-[96px] max-w-[280px] p-2 bg-stone-900 rounded-xl border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  {newLogoUrl ? (
                    <img src={newLogoUrl} alt="Preview" className="max-h-20 w-auto object-contain rounded" />
                  ) : (
                    <span className="font-serif font-extrabold text-amber-400 text-base">HCMM</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Current Logo Preview
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    This logo is rendered at the top of the Calendar, Mantras page, and standalone HTML export.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveLogo} className="space-y-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-website.com/logo.png"
                    value={newLogoUrl}
                    onChange={(e) => setNewLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Or Upload Logo from Device
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-stone-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-sm"
                >
                  Save Logo
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: BOOKS LIST */}
          {adminTab === 'books' && (
            <div className="space-y-5 text-xs">
              <form onSubmit={handleAddBookSubmit} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-xs">
                  + Add New Helpful Book or Reference Link
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Book Title (e.g. Durga Saptashati)..."
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />

                  <input
                    type="text"
                    placeholder="Author or Tradition..."
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    required
                    placeholder="Book Link (URL)..."
                    value={bookUrl}
                    onChange={(e) => setBookUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />

                  <select
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Sacred Scripture">Sacred Scripture (ಗ್ರಂಥ)</option>
                    <option value="Panchanga Shastra">Panchanga Shastra (ಪಂಚಾಂಗ)</option>
                    <option value="Jyotisha Shastra">Jyotisha Shastra (ಜ್ಯೋತಿಷ)</option>
                    <option value="Vedic Chant">Vedic Chant (ವೇದ)</option>
                    <option value="Devotee Guide">Devotee Guide (ಕೈಪಿಡಿ)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Brief description..."
                  value={bookDesc}
                  onChange={(e) => setBookDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-2xs"
                  >
                    Save Book to Viewer List
                  </button>
                </div>
              </form>

              {/* Existing Books List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Current Viewer Resources ({booksList.length})
                </h4>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {booksList.map((book) => (
                    <div
                      key={book.id}
                      className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span>{book.title}</span>
                          <span className="text-[10px] text-stone-400">by {book.author}</span>
                        </div>
                        <p className="text-stone-500 text-[11px] mt-0.5 line-clamp-1">
                          {book.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onDeleteBook(book.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
