import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { getClassicalVedicTip } from './src/utils/geminiDailyInsights';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const STORE_FILE = path.join(__dirname, 'data', 'hcmm_store.json');

// Initialize Gemini SDK with User-Agent 'aistudio-build' for telemetry
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// Ensure data directory exists
const dataDir = path.dirname(STORE_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to read store
function readStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store:', err);
  }
  return {
    logoUrl: '',
    mantrasList: [],
    booksList: [],
    customEvents: []
  };
}

// Helper to write store
function writeStore(data: any) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing store:', err);
    return false;
  }
}

// Allow large payloads for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Gemini AI Daily Astrological Insight endpoint
app.post('/api/gemini/daily-insight', async (req, res) => {
  const { 
    tithiName = '', 
    tithiPaksha = 'Shukla', 
    nakshatraName = '', 
    padaNumber, 
    rashiName = '', 
    dateStr = '', 
    language = 'en' 
  } = req.body;

  const langCode = (language || 'en').toLowerCase();
  const langPromptInstruction = langCode === 'kn'
    ? 'Respond strictly in authentic, elegant, and grammatically pure Kannada (ಕನ್ನಡ).'
    : langCode === 'hi'
    ? 'Respond strictly in authentic, devotional, and grammatically pure Hindi (हिन्दी).'
    : 'Respond strictly in clear, inspiring English.';

  const padaText = padaNumber ? `Pada ${padaNumber}` : '';
  const prompt = `Panchanga Celestial Alignment:
Date: ${dateStr || 'Current Day'}
Tithi: ${tithiName} (${tithiPaksha} Paksha)
Nakshatra: ${nakshatraName} ${padaText}
Chandra Rashi: ${rashiName}

Task: Based on classical Vedic Jyotisha and Muhurtha Shastra, provide exactly ONE auspicious, uplifting, and actionable sentence (15 to 25 words max) giving an astrological tip and spiritual/practical guidance for the day. ${langPromptInstruction}
Requirements:
1. Strict Hindu Vedic Astrological traditions only.
2. Output ONLY the single sentence.
3. No quotes, no markdown bolding, no prefixes like "Tip:" or "Insight:", no bullet points.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an authentic Vedic Jyotisha scholar (ಜ್ಯೋತಿಷ್ಯ ವಿದ್ವಾನ್). Provide exactly one concise, spiritually uplifting and actionable astrological tip for the day based on the celestial Tithi and Nakshatra. Never include quotes, headers, prefixes, or bullet points.',
          temperature: 0.7,
        }
      });

      const generatedTip = response.text ? response.text.trim().replace(/^["']|["']$/g, '').replace(/^(Tip|Astrological Tip|Insight|Note):\s*/i, '') : null;
      if (generatedTip && generatedTip.length > 5) {
        return res.json({
          success: true,
          tip: generatedTip,
          source: 'gemini',
          model: 'gemini-3.8-flash'
        });
      }
    } catch (err: any) {
      console.error('[Gemini Daily Insight Error]:', err?.message || err);
    }
  }

  // Authentic classical Jyotisha fallback
  const fallbackTip = getClassicalVedicTip(
    tithiName,
    tithiPaksha,
    nakshatraName,
    padaNumber,
    langCode as any
  );

  return res.json({
    success: true,
    tip: fallbackTip,
    source: 'classical_jyotisha',
    model: 'classical-rules'
  });
});

// Global Data API endpoints
app.get('/api/sync', (req, res) => {
  const store = readStore();
  res.json(store);
});

app.post('/api/sync', (req, res) => {
  const current = readStore();
  const updated = {
    ...current,
    ...req.body
  };
  writeStore(updated);
  res.json({ success: true, store: updated });
});

// Update Logo endpoint
app.post('/api/logo', (req, res) => {
  const { logoUrl } = req.body;
  const current = readStore();
  current.logoUrl = logoUrl || '';
  writeStore(current);
  res.json({ success: true, logoUrl: current.logoUrl });
});

// Add Mantra endpoint
app.post('/api/mantras', (req, res) => {
  const { mantra } = req.body;
  if (!mantra || !mantra.title || !mantra.url) {
    return res.status(400).json({ error: 'Invalid mantra data' });
  }
  const current = readStore();
  if (!Array.isArray(current.mantrasList)) {
    current.mantrasList = [];
  }
  // If exists, replace; else prepend
  const existingIdx = current.mantrasList.findIndex((m: any) => m.id === mantra.id);
  if (existingIdx >= 0) {
    current.mantrasList[existingIdx] = mantra;
  } else {
    current.mantrasList.unshift(mantra);
  }
  writeStore(current);
  res.json({ success: true, mantrasList: current.mantrasList });
});

// Delete Mantra endpoint
app.delete('/api/mantras/:id', (req, res) => {
  const id = req.params.id;
  const current = readStore();
  if (Array.isArray(current.mantrasList)) {
    current.mantrasList = current.mantrasList.filter((m: any) => m.id !== id);
    writeStore(current);
  }
  res.json({ success: true, mantrasList: current.mantrasList });
});

// Sync from Sri Himanth CMM Blog endpoint
app.post('/api/sync-blog-mantras', async (req, res) => {
  const current = readStore();
  if (!Array.isArray(current.mantrasList)) {
    current.mantrasList = [];
  }

  // Predefined verified list of all Himanth CMM blog articles
  const blogArticles = [
    {
      id: 'hcmm-nityapooja-sanskruth',
      title: 'NityaPooja Sanskruth (ನಿತ್ಯಪೂಜಾ ಸಂಸ್ಕೃತ & ಶ್ರೀ ರುದ್ರ)',
      description: 'Complete Sanskrit Nitya Pooja Vidhana, Sri Rudram chanting, and daily Vedic upasana vidhi from Sri Himanth CMM blog.',
      url: 'https://www.himanthacmm.com/myblog/nityapoojaandrudra',
      category: 'Nitya Pooja'
    },
    {
      id: 'hcmm-nitya-pooja-vidhi',
      title: 'Nitya Pooja Vidhi (ದೈನಂದಿನ ನಿತ್ಯ ಪೂಜಾ ವಿಧಾನ)',
      description: 'Detailed step-by-step daily devotional pooja procedure, deepa prajwalana, sankalpa, dhyana, and naivedya.',
      url: 'https://www.himanthacmm.com/myblog/nityapoojavidhi',
      category: 'Nitya Pooja'
    },
    {
      id: 'hcmm-sankalpa-vidhi',
      title: 'Sankalpa Vidhi (ವೇದೋಕ್ತ ಶುಭ ಸಂಕಲ್ಪ ವಿಧಾನ)',
      description: 'Comprehensive guidance on taking authentic Vedic Sankalpa with samvatsara, ayana, masa, and astronomical tithi.',
      url: 'https://www.himanthacmm.com/sanklpa',
      category: 'Sankalpa Vidhi'
    },
    {
      id: 'hcmm-ganesha-pooja',
      title: 'Shree Ganesha Pooja (ಶ್ರೀ ಮಹಾಗಣಪತಿ ಪೂಜಾ ವಿಧಾನ)',
      description: 'Sacred Ganesha invocation, Modaka naivedya, 21 Durva offering, and Vighnaharta stotras for auspicious beginnings.',
      url: 'https://www.himanthacmm.com/myblog/shreeganeshpoojavidhi',
      category: 'Vrata & Pooja'
    },
    {
      id: 'hcmm-varamahalakshmi',
      title: 'Vara Mahalakshmi Vrata (ಶ್ರೀ ವರಮಹಾಲಕ್ಷ್ಮೀ ವ್ರತ ವಿಧಾನ)',
      description: 'Complete Sravana Shukla Vara Mahalakshmi vrata katha, kalasha sthapana, and doragranthi pooja for wealth and prosperity.',
      url: 'https://www.himanthacmm.com/mahalakshmivrata',
      category: 'Vrata & Pooja'
    },
    {
      id: 'hcmm-mangalagauri',
      title: 'Mangalagauri Vrata (ಶ್ರೀ ಮಂಗಳಗೌರೀ ವ್ರತ ವಿಧಾನ)',
      description: 'Sravana Tuesday Mangalagauri vrata rituals for marital bliss, sowbhagya, and family prosperity.',
      url: 'https://www.himanthacmm.com/mangalgaurivrata',
      category: 'Vrata & Pooja'
    },
    {
      id: 'hcmm-shiva-pooja',
      title: 'Shiva Pooja Vidhi (ಶ್ರೀ ಪರಮೇಶ್ವರ ಲಿಂಗ ಪೂಜಾ ವಿಧಾನ)',
      description: 'Shiva Linga abhisheka with panchamrita, Bilva patra archana, and Mahamrityunjaya japa vidhana for spiritual liberation.',
      url: 'https://www.himanthacmm.com/shivapoojavidhi',
      category: 'Shiva Stotra'
    },
    {
      id: 'hcmm-devi-purana',
      title: 'Devi Purana (ಶ್ರೀ ದೇವಿ ಪುರಾಣ & ದೇವೀ ಮಹಿಮೆ)',
      description: 'Cosmic triumphs of Divine Mother Mahashakti, Chandi parayana, and Sri Devi Mahatmya reflections.',
      url: 'https://www.himanthacmm.com/devipurana',
      category: 'Puranas & Stotras'
    },
    {
      id: 'hcmm-navadurga',
      title: 'Navadurga (ಶ್ರೀ ನವದುರ್ಗಾ ಧ್ಯಾನ & ನವರಾತ್ರಿ ಆರಾಧನೆ)',
      description: 'Detailed 9 divine forms of Goddess Durga worshipped during Sharannavaratri from Shailaputri to Siddhidatri.',
      url: 'https://www.himanthacmm.com/navadurga',
      category: 'Devi Stotra'
    },
    {
      id: 'hcmm-rudraadhyay',
      title: 'Shree Rudraadhyay (ಶ್ರೀ ನಮಕ-ಚಮಕ ರುದ್ರಾಧ್ಯಾಯ)',
      description: 'Sacred Yajurvedic Namaka and Chamaka Prashnas of Sri Rudradhyaya for cosmic peace and supreme healing.',
      url: 'https://www.himanthacmm.com/myblog/shreerudraadhyaaya',
      category: 'Vedic Sukta'
    },
    {
      id: 'hcmm-nagar-panchami',
      title: 'Nagar Panchami Pooja (ಶ್ರೀ ನಾಗದೇವತಾ ಪೂಜಾ ವಿಧಾನ)',
      description: 'Shravana Shukla Panchami Nagadevata pooja, halu-eredu rituals, sarpa dosha shanti, and sacred protective mantras.',
      url: 'https://www.himanthacmm.com/nagarapamchami',
      category: 'Vrata & Pooja'
    },
    {
      id: 'hcmm-navagraha-pooja',
      title: 'Navagraha Pooja (ನವಗ್ರಹ ಶಾಂತಿ & ಪೂಜಾ ವಿಧಾನ)',
      description: 'Nine planetary deities propitiation, Beeja mantras, dhanya grains, and samidha homa vidhana for planetary harmony.',
      url: 'https://www.himanthacmm.com/myblog/navagraha',
      category: 'Navagraha'
    },
    {
      id: 'hcmm-pitru-tarpana',
      title: 'Pitru Tarpana (ಪಿತೃ ತರ್ಪಣ & ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ ವಿಧಿ)',
      description: 'Vedic tilodaka tarpana procedures, pitru gayatri, and Mahalaya paksha shraddha guidelines for ancestral blessings.',
      url: 'https://www.himanthacmm.com/tarpanavidhi',
      category: 'Pitru Vidhi'
    },
    {
      id: 'hcmm-small-stories',
      title: 'Appa Helida Sanna Kathegalu (ಅಪ್ಪ ಹೇಳಿದ ಸಣ್ಣ ಕಥೆಗಳು)',
      description: 'Inspiring moral, spiritual, and dharmic short stories illustrating eternal truths of Sanatana Dharma.',
      url: 'https://www.himanthacmm.com/smallstories',
      category: 'Vedic Stories'
    },
    {
      id: 'hcmm-panchanga-blog',
      title: 'Panchanga (ಜ್ಯೋತಿಷ್ಯ ಪಂಚಾಂಗ ಜ್ಞಾನ & ಗಣಿತ)',
      description: 'Astrological significance of Tithi, Vara, Nakshatra, Yoga, and Karana explained from Sri Himanth CMM blog.',
      url: 'https://www.himanthacmm.com/myblog/panchang',
      category: 'Panchanga'
    }
  ];

  // Attempt live crawl of https://www.himanthacmm.com/myblog to discover any newly added blog posts
  try {
    const blogResp = await fetch('https://www.himanthacmm.com/myblog', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (blogResp.ok) {
      const html = await blogResp.text();
      // Match anchor tags href and inner text
      const linkRegex = /<a[^>]+href=["'](https?:\/\/(?:www\.)?himanthacmm\.com\/[^"']+)["'][^>]*>(.*?)<\/a>/gi;
      let match;
      const discovered: any[] = [];
      while ((match = linkRegex.exec(html)) !== null) {
        const url = match[1].trim();
        const rawTitle = match[2].replace(/<[^>]+>/g, '').trim();
        if (url && rawTitle && rawTitle.length > 2 && !url.endsWith('.css') && !url.endsWith('.js') && !url.endsWith('.jpg') && !url.endsWith('.png')) {
          if (!blogArticles.some(a => a.url === url) && !current.mantrasList.some((m: any) => m.url === url)) {
            const cleanTitle = rawTitle.replace(/\s+/g, ' ');
            discovered.push({
              id: `blog-live-${Date.now()}-${discovered.length}`,
              title: cleanTitle,
              description: `Latest publication dynamically synchronized from ${url}`,
              url,
              category: 'Blog Mantra'
            });
          }
        }
      }
      if (discovered.length > 0) {
        blogArticles.unshift(...discovered);
      }
    }
  } catch (crawlErr) {
    // If external blog is unreachable or slow, gracefully proceed with curated catalog
    console.log('Live blog sync fetch note: using pre-configured comprehensive blog list');
  }

  // Merge so existing user edits/custom pictures are preserved, while ensuring all blog links are present
  for (const art of blogArticles) {
    const existingIdx = current.mantrasList.findIndex((m: any) => m.url === art.url || m.id === art.id);
    if (existingIdx >= 0) {
      current.mantrasList[existingIdx] = {
        ...art,
        ...current.mantrasList[existingIdx]
      };
    } else {
      current.mantrasList.unshift(art);
    }
  }

  writeStore(current);
  res.json({ 
    success: true, 
    mantrasList: current.mantrasList, 
    message: 'Successfully synchronized with Sri Himanth CMM blog (himanthacmm.com/myblog)' 
  });
});

// Update Password & Recovery endpoint
app.post('/api/password', (req, res) => {
  const { password, recoveryCode, securityQuestion, securityAnswer } = req.body;
  const current = readStore();
  if (password) current.userPassword = password;
  if (recoveryCode) current.recoveryCode = recoveryCode;
  if (securityQuestion) current.securityQuestion = securityQuestion;
  if (securityAnswer) current.securityAnswer = securityAnswer;
  writeStore(current);
  res.json({ success: true });
});

// =========================================================================
// ASTROHIMANTH DUAL EMAIL & MOBILE AUTHENTICATION
// Strictly for himanthasmc@gmail.com and mobile +91 9483480312 (India)
// =========================================================================
const ALLOWED_EMAIL = 'himanthasmc@gmail.com';
const ALLOWED_PHONE = '+919483480312';
const SENDER_NAME = 'AstroHimanth';

let activeOtp: { code: string; email: string; phone: string; expiresAt: number } | null = null;

// Send OTP endpoint - Strictly constrained to himanthasmc@gmail.com & 9483480312
app.post('/api/send-otp', async (req, res) => {
  const { email, phone } = req.body;
  const targetEmail = (email || ALLOWED_EMAIL).trim().toLowerCase();
  const targetPhone = (phone || ALLOWED_PHONE).trim();

  // Enforce strictly himanthasmc@gmail.com
  if (targetEmail !== ALLOWED_EMAIL) {
    return res.status(403).json({
      error: `Access denied. Verification codes can only be dispatched to ${ALLOWED_EMAIL}.`
    });
  }

  // Generate 6-digit numeric OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins validity
  activeOtp = { code, email: targetEmail, phone: targetPhone, expiresAt };

  // Read persistent store configuration
  const store = readStore();
  const smsConfig = store.smsConfig || {};
  const emailConfig = store.emailConfig || {};

  store.lastOtp = { code, email: targetEmail, phone: targetPhone, expiresAt };
  writeStore(store);

  console.log(`[AstroHimanth AUTH] Generated OTP code for ${targetEmail} / ${targetPhone}: ${code}`);

  let emailSent = false;
  let emailStatus = '';

  // Attempt Email Dispatch with AstroHimanth Sender Branding
  try {
    const { default: nodemailer } = await import('nodemailer');
    const smtpHost = process.env.SMTP_HOST || emailConfig.smtpHost;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || emailConfig.smtpUser || emailConfig.gmailUser;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || emailConfig.smtpPass || emailConfig.gmailAppPassword;

    let transporter;
    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(emailConfig.smtpPort || process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true' || emailConfig.smtpSecure === true,
        auth: { user: smtpUser, pass: smtpPass }
      });
      const senderEmail = smtpUser;
      const mailOptions = {
        from: `"${SENDER_NAME}" <${senderEmail}>`,
        to: targetEmail,
        subject: `AstroHimanth: Your Jyotisha Verification Code is ${code}`,
        text: `Namaste,\n\nYour 6-digit verification code from AstroHimanth to unlock Vedic Remedies, Prashna Kundali, Guna Milan, and Transit Alerts is:\n\n${code}\n\nThis code is valid for 15 minutes.\n\nBlessings,\nAstroHimanth Sri Vedic Jyotisha Engine`,
        html: `
          <div style="font-family: serif, sans-serif; background: #fffbeb; padding: 24px; border-radius: 16px; border: 2px solid #f59e0b; max-width: 520px; color: #451a03; margin: 0 auto;">
            <h2 style="color: #b45309; margin-top: 0; text-align: center;">॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥</h2>
            <div style="text-align: center; margin-bottom: 12px;">
              <span style="background: #b45309; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                From: ${SENDER_NAME}
              </span>
            </div>
            <h3 style="color: #78350f; text-align: center; margin-bottom: 8px;">AstroHimanth Sacred Jyotisha Access Passcode</h3>
            <p style="font-size: 14px; line-height: 1.6; text-align: center;">
              You requested a secure verification code from <strong>AstroHimanth</strong> to unlock <strong>Vedic Remedies, Prashna Kundali, Guna Milan, and Transit Alerts</strong>.
            </p>
            <div style="background: #ffffff; border: 2px dashed #d97706; padding: 18px; text-align: center; font-size: 38px; font-weight: bold; letter-spacing: 8px; color: #b45309; border-radius: 12px; margin: 24px 0; font-family: monospace;">
              ${code}
            </div>
            <p style="font-size: 13px; color: #78350f; text-align: center;">
              This verification code is strictly valid for 15 minutes.
            </p>
            <hr style="border: 0; border-top: 1px solid #fde68a; margin: 20px 0;" />
            <p style="font-size: 11px; color: #92400e; text-align: center; margin-bottom: 0;">
              DISPATCHED BY ${SENDER_NAME} • EXCLUSIVE TO ${targetEmail} & ${ALLOWED_PHONE}
            </p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      emailSent = true;
      emailStatus = `Delivered to ${targetEmail} via SMTP`;
      console.log(`[AstroHimanth AUTH] Email successfully sent to ${targetEmail}`);
    } else if (smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass }
      });
      const mailOptions = {
        from: `"${SENDER_NAME}" <${smtpUser}>`,
        to: targetEmail,
        subject: `AstroHimanth: Your Jyotisha Verification Code is ${code}`,
        text: `Namaste,\n\nYour 6-digit verification code from AstroHimanth is ${code}.\n\nValid for 15 minutes.\n\nBlessings,\nAstroHimanth`,
        html: `
          <div style="font-family: serif, sans-serif; background: #fffbeb; padding: 24px; border-radius: 16px; border: 2px solid #f59e0b; max-width: 520px; color: #451a03; margin: 0 auto;">
            <h2 style="color: #b45309; margin-top: 0; text-align: center;">॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥</h2>
            <div style="text-align: center; margin-bottom: 12px;">
              <span style="background: #b45309; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-transform: uppercase;">From: ${SENDER_NAME}</span>
            </div>
            <h3 style="color: #78350f; text-align: center;">AstroHimanth Sacred Jyotisha Access Passcode</h3>
            <div style="background: #ffffff; border: 2px dashed #d97706; padding: 18px; text-align: center; font-size: 38px; font-weight: bold; letter-spacing: 8px; color: #b45309; border-radius: 12px; margin: 24px 0; font-family: monospace;">
              ${code}
            </div>
            <p style="font-size: 12px; color: #92400e; text-align: center;">Dispatched to ${targetEmail} by ${SENDER_NAME}</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      emailSent = true;
      emailStatus = `Delivered to ${targetEmail} via Gmail`;
      console.log(`[AstroHimanth AUTH] Gmail message successfully dispatched to ${targetEmail}`);
    } else {
      emailStatus = 'Gmail/SMTP App Password not yet configured. Use 1-Tap Auto-Unlock, SMS, or configure Gmail in Settings below.';
      console.log('[AstroHimanth AUTH] Live email skipped: GMAIL_USER/GMAIL_APP_PASSWORD not set.');
    }
  } catch (err: any) {
    console.error('[AstroHimanth AUTH] Email dispatch error:', err);
    emailStatus = `Email error: ${err.message || 'Check SMTP/Gmail App Password'}`;
  }

  // Mobile SMS Dispatch formatting with AstroHimanth sender name
  const smsBody = `AstroHimanth: Your Jyotisha verification code is ${code}. Valid for 15 minutes to unlock Vedic Remedies, Prashna Kundali & Guna Milan.`;
  const smsUri = `sms:${ALLOWED_PHONE}?body=${encodeURIComponent(smsBody)}`;
  const whatsappUri = `https://wa.me/919483480312?text=${encodeURIComponent(smsBody)}`;

  // Multi-Provider SMS Dispatch (Twilio primary, Fast2SMS India gateway fallback)
  let smsDispatched = false;
  let smsProvider = 'Pending API Credentials';
  let smsDetails = '';

  // Provider 1: Twilio SMS Service Integration
  const twilioSid = process.env.TWILIO_ACCOUNT_SID || smsConfig.twilioSid;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN || smsConfig.twilioToken;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER || smsConfig.twilioFrom || process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (twilioSid && twilioToken) {
    try {
      const { default: twilio } = await import('twilio');
      const client = twilio(twilioSid, twilioToken);
      
      // Attempt 1: Try Alphanumeric Sender ID 'AstroHimanth' if no specific number, or with twilioFrom
      const preferredFrom = twilioFrom || SENDER_NAME;
      try {
        const twilioMsg = await client.messages.create({
          body: smsBody,
          from: preferredFrom,
          to: ALLOWED_PHONE
        });
        smsDispatched = true;
        smsProvider = 'Twilio SMS API';
        smsDetails = `Dispatched to ${ALLOWED_PHONE} via Twilio (${preferredFrom}). SID: ${twilioMsg.sid}`;
        console.log(`[AstroHimanth Twilio] Message successfully sent to ${ALLOWED_PHONE}, SID: ${twilioMsg.sid}`);
      } catch (innerErr: any) {
        // If alphanumeric sender ID failed (common for Indian mobile numbers due to DLT regulation), retry with registered phone number
        if (twilioFrom && preferredFrom !== twilioFrom) {
          const fallbackMsg = await client.messages.create({
            body: smsBody,
            from: twilioFrom,
            to: ALLOWED_PHONE
          });
          smsDispatched = true;
          smsProvider = 'Twilio SMS API';
          smsDetails = `Dispatched to ${ALLOWED_PHONE} via Twilio (${twilioFrom}). SID: ${fallbackMsg.sid}`;
          console.log(`[AstroHimanth Twilio Retry] Message sent via ${twilioFrom}`);
        } else {
          throw innerErr;
        }
      }
    } catch (twilioErr: any) {
      console.error('[AstroHimanth Twilio] Error sending SMS:', twilioErr.message);
      smsDetails = `Twilio Error: ${twilioErr.message}`;
    }
  }

  // Provider 2: Fast2SMS API Integration (India SMS Gateway)
  const fast2smsKey = process.env.FAST2SMS_API_KEY || smsConfig.fast2smsKey;
  if (!smsDispatched && fast2smsKey) {
    try {
      const cleanIndianNumber = ALLOWED_PHONE.replace(/^\+91/, '').replace(/\D/g, '');
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: smsBody,
          language: 'english',
          flash: 0,
          numbers: cleanIndianNumber
        })
      });
      const data = await response.json();
      if (data.return) {
        smsDispatched = true;
        smsProvider = 'Fast2SMS India Gateway';
        smsDetails = `Dispatched to ${cleanIndianNumber} via Fast2SMS. Request ID: ${data.request_id}`;
        console.log(`[AstroHimanth Fast2SMS] Dispatched to ${cleanIndianNumber}`);
      } else {
        smsDetails = data.message ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : 'Fast2SMS dispatch pending';
      }
    } catch (smsErr: any) {
      console.error('[AstroHimanth SMS] Fast2SMS dispatch error:', smsErr.message);
      smsDetails = `Fast2SMS Error: ${smsErr.message}`;
    }
  }

  if (!smsDispatched && !smsDetails) {
    smsDetails = 'Twilio SMS & Fast2SMS Gateway integrated. Enter credentials in Settings to enable direct cellular SMS, or use instant 1-Tap Auto-Unlock / Mobile deep-links.';
  }

  res.json({
    success: true,
    sender: SENDER_NAME,
    message: `Verification code generated by ${SENDER_NAME} for ${targetEmail} and ${ALLOWED_PHONE}`,
    email: targetEmail,
    phone: ALLOWED_PHONE,
    emailSent,
    emailStatus,
    smsDispatched,
    smsProvider,
    smsDetails,
    smsUri,
    whatsappUri,
    smsBody,
    codeHint: code
  });
});

// GET /api/auth-config - View current SMS and Email integration status
app.get('/api/auth-config', (req, res) => {
  const store = readStore();
  const sms = store.smsConfig || {};
  const email = store.emailConfig || {};

  const twilioSid = process.env.TWILIO_ACCOUNT_SID || sms.twilioSid;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER || sms.twilioFrom;
  const fast2smsKey = process.env.FAST2SMS_API_KEY || sms.fast2smsKey;
  const gmailUser = process.env.GMAIL_USER || email.gmailUser || email.smtpUser;

  res.json({
    senderName: SENDER_NAME,
    allowedEmail: ALLOWED_EMAIL,
    allowedPhone: ALLOWED_PHONE,
    hasTwilio: Boolean(twilioSid && (process.env.TWILIO_AUTH_TOKEN || sms.twilioToken)),
    twilioSidMasked: twilioSid ? `${twilioSid.slice(0, 6)}...${twilioSid.slice(-4)}` : '',
    twilioFrom: twilioFrom || '',
    hasFast2sms: Boolean(fast2smsKey),
    hasEmailConfigured: Boolean(gmailUser && (process.env.GMAIL_APP_PASSWORD || email.gmailAppPassword || email.smtpPass)),
    gmailUser: gmailUser || ''
  });
});

// POST /api/auth-config - Update SMS and Email credentials into persistent store
app.post('/api/auth-config', (req, res) => {
  const { twilioSid, twilioToken, twilioFrom, fast2smsKey, gmailUser, gmailAppPassword, smtpHost, smtpPort } = req.body;
  const store = readStore();

  if (!store.smsConfig) store.smsConfig = {};
  if (!store.emailConfig) store.emailConfig = {};

  if (twilioSid !== undefined) store.smsConfig.twilioSid = twilioSid.trim();
  if (twilioToken !== undefined) store.smsConfig.twilioToken = twilioToken.trim();
  if (twilioFrom !== undefined) store.smsConfig.twilioFrom = twilioFrom.trim();
  if (fast2smsKey !== undefined) store.smsConfig.fast2smsKey = fast2smsKey.trim();

  if (gmailUser !== undefined) store.emailConfig.gmailUser = gmailUser.trim();
  if (gmailAppPassword !== undefined) store.emailConfig.gmailAppPassword = gmailAppPassword.trim();
  if (smtpHost !== undefined) store.emailConfig.smtpHost = smtpHost.trim();
  if (smtpPort !== undefined) store.emailConfig.smtpPort = smtpPort.trim();

  writeStore(store);
  res.json({ success: true, message: 'AstroHimanth SMS & Email credentials successfully updated.' });
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { code } = req.body;
  const store = readStore();
  const candidate = (code || '').trim();

  const currentOtp = activeOtp || store.lastOtp;

  if (!candidate) {
    return res.status(400).json({ error: 'Please enter the verification code.' });
  }

  // Allow emergency backup fallback HCMM or active recovery code
  const activePass = (store.userPassword || 'HCMM').trim().toUpperCase();
  const activeRescue = (store.recoveryCode || 'HCMM-RECOVERY-2026').trim().toUpperCase();
  if (candidate.toUpperCase() === activePass || candidate.toUpperCase() === activeRescue) {
    return res.json({ success: true, verified: true });
  }

  if (!currentOtp) {
    return res.status(400).json({ error: 'No active verification code found. Please click "Send Access Code to himanthasmc@gmail.com".' });
  }

  if (Date.now() > currentOtp.expiresAt) {
    return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
  }

  if (candidate === currentOtp.code) {
    activeOtp = null;
    if (store.lastOtp) {
      delete store.lastOtp;
      writeStore(store);
    }
    return res.json({ success: true, verified: true });
  }

  return res.status(400).json({ error: 'Invalid code. Please enter the 6-digit code sent to himanthasmc@gmail.com.' });
});

// Download 100% self-contained single-file HTML program
app.get('/download-full-html', (req, res) => {
  const publicBundle = path.join(__dirname, 'public', 'hcmm-react-singlefile.html');
  const distBundle = path.join(__dirname, 'dist', 'index-singlefile.html');

  if (fs.existsSync(publicBundle)) {
    res.download(publicBundle, 'HCMM-Vedic-Panchanga-Full-Program.html');
    return;
  }
  if (fs.existsSync(distBundle)) {
    res.download(distBundle, 'HCMM-Vedic-Panchanga-Full-Program.html');
    return;
  }

  // Fallback to index.html
  const indexHtml = path.join(__dirname, 'index.html');
  res.download(indexHtml, 'HCMM-Vedic-Panchanga.html');
});

// Direct link to view/run single-file HTML bundle
app.get('/hcmm-react-singlefile.html', (req, res) => {
  const publicBundle = path.join(__dirname, 'public', 'hcmm-react-singlefile.html');
  if (fs.existsSync(publicBundle)) {
    res.sendFile(publicBundle);
    return;
  }
  const distBundle = path.join(__dirname, 'dist', 'index-singlefile.html');
  if (fs.existsSync(distBundle)) {
    res.sendFile(distBundle);
    return;
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HCMM Vedic Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
