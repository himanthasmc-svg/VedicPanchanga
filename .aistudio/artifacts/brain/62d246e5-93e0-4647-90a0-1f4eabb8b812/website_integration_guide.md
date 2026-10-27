# Complete Website Integration Guide
## HCMM Vedic Panchanga Calendar & Vimshottari Dasha Calculator

The entire Vedic Panchanga Calendar, Lagna Kundali, and newly added **Vimshottari Dasha (Maha Dasha • Antardasha • Pratyantardasha) Calculator** is compiled into a **single, 100% self-contained HTML file** with all styles, icons, and JavaScript inlined.

File location in this project:
- `public/hcmm-react-singlefile.html`
- Artifact: `standalone_panchanga_website.html`

---

## 3 Easy Ways to Paste / Embed into Your Website

### Method 1: Direct File Upload (Recommended for Best Performance)
1. Download `standalone_panchanga_website.html` (or copy `public/hcmm-react-singlefile.html`).
2. Rename it to `index.html` (or `panchanga.html`).
3. Upload it to your web server (cPanel, GitHub Pages, Netlify, Vercel, AWS S3, or VPS) under any folder, e.g.:
   ```
   https://yourwebsite.com/panchanga/
   ```
4. It works immediately with offline support and zero external script dependencies!

---

### Method 2: Responsive Full-Page Iframe (For WordPress, Wix, Squarespace, Shopify)
Paste the following HTML code block directly into any Custom HTML / Embed block on your page:

```html
<div style="width: 100%; height: 100vh; min-height: 850px; overflow: hidden; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
  <iframe 
    src="hcmm-react-singlefile.html" 
    title="HCMM Vedic Panchanga & Vimshottari Dasha Calculator"
    style="width: 100%; height: 100%; min-height: 850px; border: none; display: block;"
    loading="lazy"
    allow="geolocation; clipboard-write"
    allowfullscreen>
  </iframe>
</div>
```
*(Replace `hcmm-react-singlefile.html` with the relative or absolute URL where you hosted the file).*

---

### Method 3: Direct In-Page Paste
Open `standalone_panchanga_website.html`, copy its entire content (`Ctrl+A`, `Ctrl+C`), and paste it as the complete source code of your page or within your template's layout.

---

## Features Included in the Single HTML File

- **Vimshottari Dasha Calculator**:
  - Live calculation of **Current Maha Dasha**, **Antardasha (Bhukti)**, and **Pratyantardasha** from user birth profile.
  - Days elapsed vs. days remaining with real-time percentage progress bars.
  - Parashara cosmic triad synthesis (Career, Health, Wealth, Relationships, Spirituality).
  - Prescribed Vedic Remedies: Beeja Mantras, Ratna (gemstone), Fasting Day, and Charity (Daana).
  - Interactive 120-year hierarchical timeline explorer (expand any Maha Dasha to see all 9 Antardashas, and any Antardasha to see all 9 Pratyantardashas).
  - Custom date query picker to check operating Dasha on past or future milestone dates.
- **Birth Profile Management**:
  - Store and edit Date of Birth, Time of Birth, and Place of Birth in `localStorage`.
  - Built-in presets (Swami Vivekananda, Sri Ramakrishna, Sri Krishna, User Default).
- **Panchanga & Ephemeris (1900–2125+)**:
  - Accurate Tithi, Nakshatra, Pada, Yoga, Karana, Rashi, Sunrise/Sunset, Rahu Kaal, Yamaganda, Gulika, and Abhijit Muhurta.
  - Multi-language support: Kannada (ಕನ್ನಡ), Hindi (हिंदी), English.
  - Dark / Light mode toggle.
