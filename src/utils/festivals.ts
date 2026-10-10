import { Festival } from '../types';

export const FESTIVALS_CATALOG: Festival[] = [
  // -------------------------------------------------------------
  // SHARANNAVARATRI / DASEA - ALL 10 AUSPICIOUS DAYS EXPLAINED
  // -------------------------------------------------------------
  {
    id: 'navaratri_day1',
    name: {
      en: 'Kalasha Sthapana • Navaratri Day 1 (Shailaputri Puja)',
      kn: 'ಕಲಶ ಸ್ಥಾಪನೆ • ನವರಾತ್ರಿ ಪಾಡ್ಯ ದಿನ ೧ (ಶೈಲಪುತ್ರಿ ಪೂಜೆ)',
      hi: 'कलश स्थापना • नवरात्रि पड़वा दिवस १ (शैलपुत्री पूजन)'
    },
    tagColor: '#dc2626',
    badgeBg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
    shortDesc: {
      en: 'Commencement of Sharannavaratri (Dasera): Ghatasthapana / Kalasha Sthapana during auspicious Abhijit Muhurta (~12 PM) and worship of Goddess Shailaputri.',
      kn: 'ಶರನ್ನವರಾತ್ರಿ (ದಸರಾ) ಆರಂಭ: ಶುಭ ಅಭಿಜಿತ್ ಮುಹೂರ್ತದಲ್ಲಿ ಕಲಶ ಸ್ಥಾಪನೆ, ನಂದಾದೀಪ ಪ್ರಜ್ವಲನೆ ಹಾಗೂ ಪ್ರಥಮ ದುರ್ಗೆಯಾದ ಮಾತೆ ಶೈಲಪುತ್ರಿಯ ಆರಾಧನೆ.',
      hi: 'शारदीय नवरात्रि (दशहरा) शुभारम्भ: अभिजित मुहूर्त में घट/कलश स्थापना, अखण्ड ज्योति एवं माँ शैलपुत्री का पूजन।'
    },
    howCelebrated: {
      en: 'Devotees clean their homes and Puja altars early at dawn. Fasting (Vrata) commences with single Sattvik meal. Copper or silver Kalasha is placed on a bed of sacred grains (Navadhanya), topped with mango leaves and coconut wrapped in red silk. Garba and Chandi Path commence with Vedic devotion.',
      kn: 'ಬೆಳಗಿನ ಜಾವ ಪವಿತ್ರ ಸ್ನಾನ ಮಾಡಿ, ಪೂಜಾ ಕೋಣೆಯಲ್ಲಿ ನವಧಾನ್ಯಗಳನ್ನು ಹರಡಿ ಅದರ ಮೇಲೆ ತಾಮ್ರದ ಕಲಶವನ್ನು ಗಂಗಾಜಲ, ನಾಣ್ಯ, ಮಾವಿನೆಲೆ ಮತ್ತು ತೆಂಗಿನಕಾಯಿಯೊಂದಿಗೆ ಸ್ಥಾಪಿಸುತ್ತಾರೆ. ಅಖಂಡ ದೀಪವನ್ನು ಹಚ್ಚಿ ಶೈಲಪುತ್ರಿ ದೇವಿಯನ್ನು ಆರಾಧಿಸಲಾಗುತ್ತದೆ.',
      hi: 'प्रातःकाल पवित्र स्नान कर नवधान्य की वेदी पर गंगाजल युक्त तांबे के कलश की स्थापना की जाती है। अखण्ड ज्योति प्रज्वलित कर प्रथम देवी शैलपुत्री की स्तुति की जाती है।'
    },
    story: {
      en: 'Goddess Shailaputri is the daughter of Himavat (King of the Himalayas) and embodiment of pristine nature (Prakriti). Riding on sacred Nandi the bull, She holds a Trident and Lotus, teaching devotees steadfast spiritual grounding and perseverance.',
      kn: 'ಹಿಮವಂತ ರಾಜನ ಪುತ್ರಿಯಾಗಿ ಪಾರ್ವತಿಯು ಶೈಲಪುತ್ರಿಯಾಗಿ ಅವತರಿಸಿದಳು. ವೃಷಭ ವಾಹನಾರೂಢಳಾಗಿ ತ್ರಿಶೂಲ ಮತ್ತು ಕಮಲವನ್ನು ಧರಿಸಿರುವ ಈಕೆಯು ಭಕ್ತರಿಗೆ ಸ್ಥಿರವಾದ ಆಧ್ಯಾತ್ಮಿಕ ಶಕ್ತಿಯನ್ನು ಕರುಣಿಸುತ್ತಾಳೆ.',
      hi: 'हिमालय राज की पुत्री होने के कारण इन्हें शैलपुत्री कहा गया। वृषभ पर आरूढ़, हाथ में त्रिशूल व कमल धारण करने वाली माता साधना की प्रथम आधार हैं।'
    },
    mantras: [
      {
        en: 'Vande Vanchhitalabhaya Chandrardhakritashekharam, Vrisharudham Shuladharam Shailaputrim Yashasvinim',
        kn: 'ವಂದೇ ವಾಂಛಿತಲಾಭಾಯ ಚಂದ್ರಾರ್ಧಕೃತಶೇಖರಾಮ್ | ವೃಷಾರೂಢಾಂ ಶೂಲಧರಾಂ ಶೈಲಪುತ್ರೀಂ ಯಶಸ್ವಿನೀಮ್ ||',
        hi: 'वन्दे वाञ्छितलाभाय चन्द्रार्धकृतशेखराम् । वृषारूढां शूलधरां शैलपुत्रीं यशस्विनीम् ॥'
      },
      {
        en: 'Om Hreem Shreem Kleem Durgayai Namah',
        kn: 'ಓಂ ಹ್ರೀಂ ಶ್ರೀಂ ಕ್ಲೀಂ ದುರ್ಗಾಯೈ ನಮಃ',
        hi: 'ॐ ह्रीं श्रीं क्लीं दुर्गायै नमः'
      }
    ],
    poojaVidhi: [
      {
        en: 'Ghatasthapana Muhurta: Install the Kalasha preferably in Abhijit Muhurta (~12:00 PM). Perform Dinyasa, Karanyasa, Anganyasa. Light Akhanda Deepa.',
        kn: 'ಕಲಶ ಸ್ಥಾಪನೆ: ಅಭಿಜಿತ್ ಮುಹೂರ್ತದಲ್ಲಿ (ಮಧ್ಯಾಹ್ನ ೧೨ ಕ್ಕೆ) ಕಲಶ ಸ್ಥಾಪಿಸಿ. ದಿಗ್ರ್ಯಾಸ, ಕರನ್ಯಾಸ, ಅಂಗನ್ಯಾಸ ನಡೆಸಿ ಅಖಂಡ ದೀಪ ಬೆಳಗಿ.',
        hi: 'कलश स्थापना: अभिजित काल (दोपहर १२ बजे) में कलश स्थापना करें। दिग्न्यास, करन्यास, अंगन्यास कर अखण्ड दीपक प्रज्वलित करें।'
      },
      {
        en: 'Devi Mahatmyam Recitation: Begin Chapter 1 & 2 of Sri Durga Saptashati following preliminary Kavacha, Argalastotram, and Kilakam.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆ ಪಾರಾಯಣ: ಕವಚ, ಅರ್ಗಲಾ ಮತ್ತು ಕೀಲಕ ಸ್ತೋತ್ರದೊಂದಿಗೆ ೧ ಮತ್ತು ೨ನೆಯ ಅಧ್ಯಾಯಗಳ ಪಾರಾಯಣ ಆರಂಭಿಸಿ.',
        hi: 'देवी महात्म्य: कवच, अर्गला व कीलक के उपरांत प्रथम व द्वितीय अध्याय का पाठ करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Kalasha: Copper, silver, or brass pot (ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶ ಪಾತ್ರೆ)',
        kn: '೧. ಕಲಶ ಪಾತ್ರೆ: ಶುದ್ಧ ತಾಮ್ರ, ಹಿತ್ತಾಳೆ ಅಥವಾ ಬೆಳ್ಳಿಯ ಕಲಶ',
        hi: '१. कलश पात्र: तांबा, पीतल अथवा चांदी का पवित्र कलश'
      },
      {
        en: '2. Sacred Water: Pure Ganga water / clean drinking water (ಗಂಗಾಜಲ / ತೀರ್ಥೋದಕ)',
        kn: '೨. ತೀರ್ಥೋದಕ: ಗಂಗಾಜಲ ಅಥವಾ ಶುದ್ಧ ನೀರು (ಸುಗಂಧ ಪರಿಮಳ ದ್ರವ್ಯ, ಏಲಕ್ಕಿ, ಲವಂಗ ಬೆರೆಸಿದ ನೀರು)',
        hi: '२. पवित्र जल: गंगाजल अथवा शुद्ध जल (इलायची, लौंग युक्त)'
      },
      {
        en: '3. Fresh Coconut: Whole unbroken coconut with intact husk (ಕುಡಿ ಇರುವ ಪೂರ್ಣ ತೆಂಗಿನಕಾಯಿ)',
        kn: '೩. ತೆಂಗಿನಕಾಯಿ: ಶಾಖೆ/ಕುಡಿ ಇರುವ ಅಖಂಡ ಶ್ರೀಫಲ',
        hi: '३. नारियल: जटा व शिखा युक्त पूर्ण श्रीफल'
      },
      {
        en: '4. Mango / Betel Leaves: 5 fresh mango leaves or betel leaves for Kalasha mouth (೫ ಮಾವಿನೆಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳು)',
        kn: '೪. ಮಾವಿನೆಲೆಗಳು: ೫ ಅಥವಾ ೭ ತಾಜಾ ಮಾವಿನ ಚಿಗುರೆಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳು',
        hi: '४. आम्रपल्लव: ५ या ७ ताजे आम के पत्ते अथवा पान के पत्ते'
      },
      {
        en: '5. Navadhanya (9 Sacred Grains): Wheat, Rice, Tuvar, Moong, Chana, Urad, Sesame, Horsegram, Rajma (ನವಧಾನ್ಯಗಳು)',
        kn: '೫. ನವಧಾನ್ಯಗಳು: ಗೋಧಿ, ಭತ್ತ/ಅಕ್ಕಿ, ತೊಗರಿ, ಹೆಸರು, ಕಡಲೆ, ಉದ್ದು, ಎಳ್ಳು, ಹುರುಳಿ, ಅವರೆ',
        hi: '५. नवधान्य: जौ, गेहूँ, धान, मूँग, चना, उड़द, तिल, कुलथी, मसूर'
      },
      {
        en: '6. Soil & Earthen Base: Clay plate / wide earthen tray for sowing Navadhanya (ನವಧಾನ್ಯ ಬಿತ್ತಲು ಮಣ್ಣಿನ ತಟ್ಟೆ / ಪೀಠ)',
        kn: '೬. ಸಪ್ತಮೃತ್ತಿಕಾ ಹಾಗೂ ಮಣ್ಣಿನ ತಟ್ಟೆ: ನವಧಾನ್ಯಗಳನ್ನು ಬಿತ್ತಿ ಮೊಳಕೆ ತರಿಸಲು ಶುದ್ಧ ಮಣ್ಣು ಮತ್ತು ತಟ್ಟೆ',
        hi: '६. सप्तमृत्तिका एवं वेदी: नवधान्य बोने हेतु शुद्ध मिट्टी एवं कलश वेदी'
      },
      {
        en: '7. Red Silk Cloth: Red cloth / vastram to wrap around Kalasha and coconut (ಕೆಂಪು ರೇಷ್ಮೆ ಕಣ / ವಸ್ತ್ರ)',
        kn: '೭. ಕೆಂಪು ರೇಷ್ಮೆ ವಸ್ತ್ರ: ಕಲಶಕ್ಕೆ ಹೊದಿಸಲು ಕೆಂಪು ಕಣ ಹಾಗೂ ತೆಂಗಿನಕಾಯಿಗೆ ಕಟ್ಟಲು ವಸ್ತ್ರ',
        hi: '७. लाल रेशमी वस्त्र / चुनरी: कलश एवं नारियल पर लपेटने हेतु'
      },
      {
        en: '8. Akshata: Sacred raw rice grains mixed with turmeric and ghee (ಅಕ್ಷತೆ ಕಾಳುಗಳು)',
        kn: '೮. ಅಕ್ಷತೆ: ಅರಿಶಿನ-ತುಪ್ಪ ಬೆರೆಸಿದ ಮುರಿಯದ ಶುದ್ಧ ಅಕ್ಕಿ ಕಾಳುಗಳು',
        hi: '८. अक्षत: हल्दी मिश्रित अखण्ड चावल'
      },
      {
        en: '9. Haldi, Kumkuma & Chandana: Turmeric powder, vermilion, and sandalwood paste (ಅರಿಶಿನ, ಕುಂಕುಮ ಮತ್ತು ಶ್ರೀಗಂಧ)',
        kn: '೯. ಮಂಗಳ ದ್ರವ್ಯಗಳು: ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಜವ್ರಾದಿ ಪರಿಮಳ ಪುಡಿ',
        hi: '९. मंगल द्रव्य: रोली, कुमकुम, हल्दी, अष्टगन्ध, चन्दन'
      },
      {
        en: '10. Sacred Thread (Moli/Kalawa): Sacred red-yellow cotton string (ಕಂಕಣ ದಾರ / ಜನಿವಾರ / ಮೌಲಿ)',
        kn: '೧೦. ಮೌಲಿ / ಕಂಕಣ ಸೂತ್ರ: ಕಲಶದ ಕೊರಳಿಗೆ ಕಟ್ಟಲು ಕೆಂಪು-ಹಳದಿ ದಾರ',
        hi: '१०. रक्षासूत्र (मौली/कलावा): कलश के कण्ठ में बांधने हेतु'
      },
      {
        en: '11. Coins & Betel Nuts: Silver/copper coins and whole Supari to place inside Kalasha (ನಾಣ್ಯ ಮತ್ತು ಅಡಿಕೆ)',
        kn: '೧೧. ನಾಣ್ಯ ಮತ್ತು ಅಡಿಕೆ: ಕಲಶದೊಳಗೆ ಹಾಕಲು ನಾಣ್ಯಗಳು, ಪೂರ್ಣ ಅಡಿಕೆ ಮತ್ತು ಚಿನ್ನ/ಬೆಳ್ಳಿ ನಾಣ್ಯ',
        hi: '११. द्रव्य एवं सुपारी: कलश के भीतर अर्पण हेतु सिक्के व अखण्ड सुपारी'
      },
      {
        en: '12. Akhanda Deepa & Pure Ghee: Brass/clay lamp and pure cow ghee / sesame oil (ನಂದಾದೀಪ ಮತ್ತು ತುಪ್ಪ)',
        kn: '೧೨. ಅಖಂಡ ದೀಪ: ೯ ದಿನ ಬೆಳಗಲು ಹಿತ್ತಾಳೆ/ಮಣ್ಣಿನ ನಂದಾದೀಪ, ಹತ್ತಿಯ ಬತ್ತಿಗಳು ಮತ್ತು ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ',
        hi: '१२. अखण्ड ज्योति: पीतल/मिट्टी का अखण्ड दीपक, रुई की बत्ती एवं शुद्ध गाय का घी'
      },
      {
        en: '13. Fresh Flowers & Garlands: Red hibiscus, lotus, marigold, and roses (ಕೆಂಪು ದಾಸವಾಳ, ಕಮಲ ಹಾಗೂ ಹೂಮಾಲೆ)',
        kn: '೧೩. ಪುಷ್ಪಗಳು: ದೇವಿಗೆ ಪ್ರಿಯವಾದ ಕೆಂಪು ದಾಸವಾಳ, ಕಮಲದ ಹೂವು, ಸೇವಂತಿಗೆ, ಮಲ್ಲಿಗೆ, ಗರಿಕೆ ಹಾಗೂ ಹೂಮಾಲೆ',
        hi: '१३. पुष्प एवं माला: लाल गुड़हल (जासवंद), कमल पुष्प, गुलाब, गेंदा एवं ताजी पुष्पमाला'
      },
      {
        en: '14. Incense & Camphor: Dhoopa, Agarbatti, and pure Bhimseni Karpura (ಧೂಪ, ಅಗರಬತ್ತಿ ಮತ್ತು ಕರ್ಪೂರ)',
        kn: '೧೪. ಧೂಪ-ದೀಪ-ಕರ್ಪೂರ: ಸಾಂಬ್ರಾಣಿ ಧೂಪ, ಅಗರಬತ್ತಿ, ದೀಪಾರತಿ ಹಾಗೂ ಆರತಿಗೆ ಭೀಮಸೇನಿ ಕರ್ಪೂರ',
        hi: '१४. धूप, अगरबत्ती एवं कर्पूर: आरती हेतु शुद्ध कर्पूर व सुगन्धित धूप'
      },
      {
        en: '15. Panchamrita: Cow Milk, Curd, Cow Ghee, Honey, Sugar (ಪಂಚಾಮೃತ)',
        kn: '೧೫. ಪಂಚಾಮೃತ: ಹಸುವಿನ ಹಾಲು, ಮೊಸರು, ತುಪ್ಪ, ಜೇನುತುಪ್ಪ ಮತ್ತು ಕಲ್ಲುಸಕ್ಕರೆ',
        hi: '१५. पञ्चामृत: गाय का दूध, दही, घी, शहद एवं शर्करा (मिश्री)'
      },
      {
        en: '16. Naivedya & Fruits: Bananas, Pomegranate, Dry fruits, Payasa/Kheer, Betel leaves with Supari (ಮಹಾ ನೈವೇದ್ಯ)',
        kn: '೧೬. ನೈವೇದ್ಯ ಮತ್ತು ಫಲಾವಳಿ: ಬಾಳೆಹಣ್ಣು, ದಾಳಿಂಬೆ, ಪಾಯಸ, ಒಣಹಣ್ಣುಗಳು, ತಾಂಬೂಲ (ವೀಳ್ಯದೆಲೆ-ಅಡಿಕೆ)',
        hi: '१६. नैवेद्य एवं फल: केला, अनार, पंचमेवा, खीर, ऋतुफल एवं ताम्बूल (पान-सुपारी)'
      },
      {
        en: '17. Pooja Utensils: Bell (Ghanti), Conch (Shankha), Arghya Patra, Achamana spoon and cup (ಪೂಜಾ ಪಾತ್ರೆಗಳು)',
        kn: '೧೭. ಪೂಜಾ ಪರಿಕರಗಳು: ಪಂಚಪಾತ್ರೆ-ಉದ್ಧರಣೆ, ಘಂಟೆ, ಶಂಖ, ಅರ್ಘ್ಯ ಪಾತ್ರೆ, ಆರತಿ ತಟ್ಟೆ, ಆಸನ',
        hi: '१७. पूजा उपकरण: आचमनी, पंचपात्र, शंख, घंटी, आरती थाल एवं शुद्ध ऊनी आसन'
      }
    ],
    ritualTimings: [
      {
        periodName: {
          en: 'Brahma Muhurta (ಉಷಃಕಾಲ / ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ)',
          kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ (ಉಷಃಕಾಲ)',
          hi: 'ब्रह्म मुहूर्त (उषःकाल)'
        },
        approxTime: '04:30 AM - 05:20 AM',
        significance: {
          en: 'Most auspicious pre-dawn cosmic window with sattva guna for cleansing, vow taking, and altar sanctification.',
          kn: 'ಸತ್ತ್ವಗುಣದ ಪರಮ ಪವಿತ್ರ ಮುಹೂರ್ತ; ಸಂಕಲ್ಪ, ಪೂಜಾ ಮಂದಿರ ಶುದ್ಧೀಕರಣ ಹಾಗೂ ಆತ್ಮಚಿಂತನೆಗೆ ಶ್ರೇಷ್ಠ.',
          hi: 'सत्त्वगुण सम्पन्न अमृत बेला; घर-मन्दिर शुद्धि एवं व्रत संकल्प हेतु सर्वश्रेष्ठ।'
        },
        recommendedRituals: {
          en: 'Early sacred bath, cleansing of the puja area with Gomaya/Gangajal, lighting morning lamp, and taking Navaratri Mahasankalpa.',
          kn: 'ಪವಿತ್ರ ಸ್ನಾನ, ಪೂಜಾ ಕೋಣೆಯನ್ನು ಗಂಗಾಜಲದಿಂದ ಶುದ್ಧೀಕರಿಸುವುದು ಹಾಗೂ ೯ ದಿನಗಳ ನವರಾತ್ರಿ ವ್ರತ ಮಹಾಸಂಕಲ್ಪ.',
          hi: 'पवित्र स्नान, पूजा स्थल का गंगाजल से अभिषेक एवं ९ दिवसीय शारदीय नवरात्रि महासंकल्प ग्रहण।'
        }
      },
      {
        periodName: {
          en: 'Pratah Sandhya & Surya Namaskar (ಪ್ರಾತಃ ಸಂಧ್ಯಾ ಕಾಲ)',
          kn: 'ಪ್ರಾತಃ ಸಂಧ್ಯಾ & ಸೂರ್ಯೋದಯ ಪೂಜೆ',
          hi: 'प्रातः सन्ध्या एवं सूर्योपासाना'
        },
        approxTime: '06:05 AM - 07:15 AM',
        significance: {
          en: 'Sunrise transition where cosmic vitality awakens; solar energies align for life force enhancement.',
          kn: 'ಸೂರ್ಯೋದಯದ ಪುಣ್ಯಕಾಲ; ಪ್ರಾಣಶಕ್ತಿಯ ಪುನಶ್ಚೇತನ ಮತ್ತು ಸೂರ್ಯ ಗಾಯತ್ರಿ ಜಪ.',
          hi: 'सूर्योदय वेला; जीवन ऊर्जा की वृद्धि एवं आदित्य हृदय स्तोत्र पाठ।'
        },
        recommendedRituals: {
          en: 'Pratah Sandhyavandana, offering Arghya to Surya Bhagavan in a copper pot with red flowers and Akshata.',
          kn: 'ಸೂರ್ಯನಿಗೆ ತಾಮ್ರದ ಪಾತ್ರೆಯಿಂದ ಅರ್ಘ್ಯ ಪ್ರದಾನ, ಗಾಯತ್ರಿ ಜಪ ಮತ್ತು ಗಣಪತಿ ಧ್ಯಾನ.',
          hi: 'सूर्यदेव को ताम्बे के पात्र से जल अर्घ्य, गायत्री जप एवं विघ्नहर्ता गणेश पूजन।'
        }
      },
      {
        periodName: {
          en: 'Ghatasthapana / Kalasha Sthapana Muhurta (ಶುಭ ಘಟಸ್ಥಾಪನಾ ಮುಹೂರ್ತ)',
          kn: 'ಘಟಸ್ಥಾಪನೆ ಮತ್ತು ಅಭಿಜಿತ್ ಮುಹೂರ್ತ',
          hi: 'घटस्थापना एवं अभिजित मुहूर्त'
        },
        approxTime: '06:15 AM - 10:15 AM / 11:45 AM - 12:35 PM (Abhijit)',
        significance: {
          en: 'Chief astrological window ordained by Shastras for invoking Goddess Durga into the Kalasha on Pratipada.',
          kn: 'ಶಾಸ್ತ್ರೋಕ್ತ ಕಲಶ ಸ್ಥಾಪನೆ ಹಾಗೂ ದೇವೀ ಆವಾಹನೆಗೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾದ ಶುಭ ಮುಹೂರ್ತ.',
          hi: 'शास्त्र सम्मत कलश स्थापना एवं देवी आवाहन हेतु परम श्रेष्ठ शुभ योग।'
        },
        recommendedRituals: {
          en: 'Sowing Navadhanya in earthen tray, filling Kalasha with Gangajal & coins, placing mango leaves & coconut with red silk, lighting Akhanda Deepa, and invocation of Devi Shailaputri.',
          kn: 'ಮಣ್ಣಿನ ತಟ್ಟೆಯಲ್ಲಿ ನವಧಾನ್ಯ ಬಿತ್ತುವುದು, ಕಲಶಕ್ಕೆ ಗಂಗಾಜಲ-ನಾಣ್ಯ-ಮಾವಿನೆಲೆ ಇಟ್ಟು ತೆಂಗಿನಕಾಯಿ ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ಅಖಂಡ ಜ್ಯೋತಿ ಬೆಳಗಿ ಶೈಲಪುತ್ರಿ ದೇವಿಯ ಷೋಡಶೋಪಚಾರ ಪೂಜೆ.',
          hi: 'नवधान्य वेदी पर कलश प्रतिष्ठा, पल्लव व श्रीफल स्थापन, अखण्ड ज्योति प्रज्वलन एवं माँ शैलपुत्री का षोडशोपचार पूजन।'
        }
      },
      {
        periodName: {
          en: 'Madhyahna Devi Mahatmyam & Chandi Path (ಮಧ್ಯಾಹ್ನ ಪಾರಾಯಣ)',
          kn: 'ಮಧ್ಯಾಹ್ನ ಸಪ್ತಶತೀ ಪಾರಾಯಣ ಕಾಲ',
          hi: 'मध्याह्न दुर्गा सप्तशती पाठ'
        },
        approxTime: '12:00 PM - 01:30 PM',
        significance: {
          en: 'Midday stillness ideal for deep recitation of Durga Saptashati / Devi Bhagavata chapters.',
          kn: 'ಶಾಂತ ಚಿತ್ತದಿಂದ ಶ್ರೀ ದುರ್ಗಾ ಸಪ್ತಶತಿ ಹಾಗೂ ಕವಚ-ಕೀಲಕ ಸ್ತೋತ್ರಗಳ ಪಠಣಕ್ಕೆ ಪ್ರಶಸ್ತ ಕಾಲ.',
          hi: 'कवच, अर्गला, कीलक एवं दुर्गा सप्तशती के प्रथम-द्वितीय अध्याय पाठ का पुण्यकाल।'
        },
        recommendedRituals: {
          en: 'Recite Kavacha, Argala, Kilaka, Navarna Japa (108 times), and Chapter 1 & 2 of Sri Devi Mahatmyam.',
          kn: 'ದೇವಿ ಕವಚ, ಅರ್ಗಲಾ ಸ್ತೋತ್ರ, ನವಾರ್ಣ ಮಂತ್ರ ೧೦೮ ಜಪ ಹಾಗೂ ೧ ಮತ್ತು ೨ನೆಯ ಅಧ್ಯಾಯಗಳ ಪಾರಾಯಣ.',
          hi: 'दुर्गा सप्तशती के प्रथम व द्वितीय अध्याय का पारायण एवं १०८ बार नवार्ण मन्त्र जप।'
        }
      },
      {
        periodName: {
          en: 'Sayankala Pradosha Sandhya & Maha Mangalarati (ಸಾಯಂ ಪ್ರದೋಷ ಆರತಿ)',
          kn: 'ಸಾಯಂಕಾಲ ಪ್ರದೋಷ & ಮಹಾ ಮಂಗಳಾರತಿ',
          hi: 'सायंकाल प्रदोष वेला एवं महाआरती'
        },
        approxTime: '06:00 PM - 07:30 PM',
        significance: {
          en: 'Dusk twilight where Goddess Shakti blesses households with peace, eradicating darkness.',
          kn: 'ಸೂರ್ಯಾಸ್ತದ ಪ್ರದೋಷ ಕಾಲ; ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳ ನಿವಾರಣೆ ಮತ್ತು ಮನೆಗೆ ಮಹಾಲಕ್ಷ್ಮಿಯ ಆಗಮನ.',
          hi: 'गोधूलि वेला; दीप प्रज्वलन, समस्त नकारात्मकता का शमन एवं माँ की कृपा प्राप्ति।'
        },
        recommendedRituals: {
          en: 'Lighting ghee lamps in all rooms and threshold, singing Devi Bhajans, offering sweet Kheer naivedya, and grand Karpura Mangalarati with conch blowing.',
          kn: 'ಮನೆಯ ಹೊಸ್ತಿಲು ಮತ್ತು ಪೂಜಾ ಕೋಣೆಯಲ್ಲಿ ದೀಪಗಳನ್ನು ಬೆಳಗುವುದು, ದೇವಿ ಭಜನೆ, ಪಾಯಸ ನೈವೇದ್ಯ ಹಾಗೂ ಶಂಖನಾದದೊಂದಿಗೆ ಭೀಮಸೇನಿ ಕರ್ಪೂರ ಮಂಗಳಾರತಿ.',
          hi: 'घर के मुख्य द्वार व मन्दिर में दीपमाला, कर्पूर आरती, शंखनाद एवं सात्त्विक खीर का भोग।'
        }
      },
      {
        periodName: {
          en: 'Nishita Kala Devi Dhyana & Akhanda Deepa Care (ನಿಶೀಥ ಕಾಲ ಧ್ಯಾನ)',
          kn: 'ನಿಶೀಥ ಕಾಲ (ರಾತ್ರಿ ಧ್ಯಾನ & ನಂದಾದೀಪ ಪೋಷಣೆ)',
          hi: 'निशीथ काल (मध्यरात्रि ध्यान व अखण्ड ज्योति दर्शन)'
        },
        approxTime: '11:40 PM - 12:30 AM',
        significance: {
          en: 'Tantrik and Yogic nocturnal hour supreme for inner stillness and mantra siddhi.',
          kn: 'ಯೋಗಿ-ಸಾಧಕರಿಗೆ ಅತೀ ಪ್ರಿಯವಾದ ನಿಶೀಥ ಕಾಲ; ನವಾರ್ಣ ಮಂತ್ರ ಸಿದ್ಧಿ ಮತ್ತು ದೇವೀ ಧ್ಯಾನಕ್ಕೆ ಅಪ್ರತಿಮ.',
          hi: 'साधकों हेतु मन्त्र सिद्धि व अन्तर्मुखी ध्यान का सर्वश्रेष्ठ निशीथ काल।'
        },
        recommendedRituals: {
          en: 'Replenishing cow ghee in Akhanda Deepa, mental chanting of Chamunda Navarna mantra, and seeking forgiveness for the day.',
          kn: 'ಅಖಂಡ ದೀಪಕ್ಕೆ ತುಪ್ಪ ಹಾಕಿ ಜ್ಯೋತಿಯನ್ನು ಸಂರಕ್ಷಿಸುವುದು, ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಮತ್ತು ಅಪರಾಧ ಕ್ಷಮಾಪಣಾ ಸ್ತೋತ್ರ ಪಠಣ.',
          hi: 'अखण्ड ज्योति में घृत पूरण, मानसिक नवार्ण मन्त्र जप एवं देवी अपराध क्षमापन स्तोत्र पाठ।'
        }
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day2',
    name: {
      en: 'Sharannavaratri / Dasera Day 2: Goddess Brahmacharini Puja',
      kn: 'ಶರನ್ನವರಾತ್ರಿ / ದಸರಾ ದಿನ ೨: ಬ್ರಹ್ಮಚಾರಿಣಿ ದೇವಿ ಪೂಜೆ',
      hi: 'शारदीय नवरात्रि / दशहरा दिवस २: माँ ब्रह्मचारिणी पूजन'
    },
    tagColor: '#ea580c',
    badgeBg: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    shortDesc: {
      en: 'Second day of Navaratri honoring Goddess Brahmacharini, who performed severe penance (Tapas) to attain Lord Shiva.',
      kn: 'ಪರಶಿವನನ್ನು ಪತಿಯಾಗಿ ಪಡೆಯಲು ಕಠಿಣ ತಪಸ್ಸನ್ನಾಚರಿಸಿದ ಜಪಮಾಲೆ ಮತ್ತು ಕಮಂಡಲಧಾರಿಣಿ ಶ್ರೀ ಬ್ರಹ್ಮಚಾರಿಣಿಯ ಪೂಜೆ.',
      hi: 'कठोर तपस्या द्वारा भगवान शिव को प्राप्त करने वाली माँ ब्रह्मचारिणी की आराधना।'
    },
    howCelebrated: {
      en: 'Devotees wear orange / yellow, offering white flowers and sugar or Panchamrita naivedya. The focus is on self-discipline, inner peace, and intellectual clarity.',
      kn: 'ಬಿಳಿ ಹೂವುಗಳು, ಸಕ್ಕರೆ ಹಾಗೂ ಪಂಚಾಮೃತ ನೈವೇದ್ಯ ಅರ್ಪಿಸಿ, ಜಪ-ತಪ ಮತ್ತು ಧ್ಯಾನದಿಂದ ಶಾಂತಚಿತ್ತರಾಗಿ ಆರಾಧಿಸಲಾಗುತ್ತದೆ.',
      hi: 'श्वेत पुष्प, मिश्री एवं शर्करा का भोग लगाकर साधक स्वाध्याय और तपस्या में रत रहते हैं।'
    },
    story: {
      en: 'Brahmacharini spent thousands of years living on bilva leaves, roots, and air in intense penance, earning the name Aparna and proving that devotion conquers all obstacles.',
      kn: 'ಸಹಸ್ರಾರು ವರ್ಷಗಳ ಕಾಲ ಕೇವಲ ಬಿಲ್ವಪತ್ರೆ ಹಾಗೂ ಗಾಳಿಯನ್ನು ಸೇವಿಸಿ ತಪಸ್ಸನ್ನಾಚರಿಸಿ "ಅಪರ್ಣಾ" ಎಂಬ ನಾಮಧೇಯವನ್ನು ಗಳಿಸಿದ ಕಥೆಯಿದು.',
      hi: 'सहस्रों वर्षों तक निराहार रहकर शिव जी को प्रसन्न करने वाली देवी अपर्णा रूप में विख्यात हुईं।'
    },
    mantras: [
      {
        en: 'Dadhana Karapadmabhyam Akshamala Kamandalu, Devi Praseedatu Mayi Brahmacharinyanuttama',
        kn: 'ದಧಾನಾ ಕರಪದ್ಮಾಭ್ಯಾಮಕ್ಷಮಾಲಾ ಕಮಂಡಲೂ | ದೇವೀ ಪ್ರಸೀದತು ಮಯಿ ಬ್ರಹ್ಮಚಾರಿಣ್ಯನುತ್ತಮಾ ||',
        hi: 'दधाना करपद्माभ्यामक्षमालाकमण्डलू । देवी प्रसीदतु मयि ब्रह्मचारिण्यनुत्तमा ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapters 3 and 4 of Sri Devi Mahatmyam. Chant Gayatri and Navarna mantras 108 times.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೩ ಮತ್ತು ೪ನೆಯ ಅಧ್ಯಾಯಗಳನ್ನು ಓದಿ ೧೦೮ ಬಾರಿ ನವಾರ್ಣ ಮಂತ್ರ ಜಪಿಸಿ.',
        hi: 'दुर्गा सप्तशती के तृतीय एवं चतुर्थ अध्याय का पाठ कर १०८ बार नवार्ण मन्त्र जपें।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day3',
    name: {
      en: 'Sharannavaratri / Dasera Day 3: Goddess Chandraghanta Puja',
      kn: 'ಶರನ್ನವರಾತ್ರಿ / ದಸರಾ ದಿನ ೩: ಚಂದ್ರಘಂಟಾ ದೇವಿ ಪೂಜೆ',
      hi: 'शारदीय नवरात्रि / दशहरा दिवस ३: माँ चन्द्रघण्टा पूजन'
    },
    tagColor: '#d97706',
    badgeBg: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
    shortDesc: {
      en: 'Third auspicious night dedicated to Mother Chandraghanta, adorned with crescent bell moon, destroyer of evil forces.',
      kn: 'ಹಣೆಮೇಲೆ ಅರ್ಧಚಂದ್ರನ ಘಂಟೆಯನ್ನು ಧರಿಸಿ, ಸಿಂಹವಾಹಿನಿಯಾಗಿ ರಕ್ಕಸರನ್ನು ಸಂಹರಿಸುವ ಚಂದ್ರಘಂಟಾ ದೇವಿಯ ಆರಾಧನೆ.',
      hi: 'मस्तक पर घंटे के आकार का चन्द्रमा धारण करने वाली दुष्टदलिनी माँ चन्द्रघण्टा का पावन दिवस।'
    },
    howCelebrated: {
      en: 'Offer milk sweets and red lotus/hibiscus. Wearing grey or golden attire brings fearlessness and removes planetary afflictions.',
      kn: 'ಹಾಲು, ಪಾಯಸ ನೈವೇದ್ಯ ಹಾಗೂ ಕೆಂಪು ದಾಸವಾಳ ಅರ್ಪಿಸಿ ಭಕ್ತಿ-ಶಕ್ತಿಯ ಸಂಕೇತವಾಗಿ ಪೂಜಿಸಲಾಗುತ್ತದೆ.',
      hi: 'दुग्ध निर्मित मिष्ठान व लाल पुष्प अर्पित कर निर्भयता व शांति की प्रार्थना की जाती है।'
    },
    story: {
      en: 'When Lord Shiva came with horrifying Ganas for the wedding, Mother assumed this formidable ten-armed Chandraghanta form to protect Her family, transforming terror into serene grace.',
      kn: 'ಶಿವನ ವಿವಾಹದ ಸಂದರ್ಭದಲ್ಲಿ ಭಯಾನಕ ಗಣಗಳನ್ನು ಕಂಡು ಹೆದರಿದವರಿಗೆ ಅಭಯ ನೀಡಲು ದೇವಿಯು ಚಂದ್ರಘಂಟಾ ರೂಪ ತಾಳಿದಳು.',
      hi: 'शिव-विवाह के समय माता ने चन्द्रघण्टा रूप धारण कर समस्त विघ्नों का नाश किया था।'
    },
    mantras: [
      {
        en: 'Pindaja Pravararudha Chandakopastrakairyuta, Prasadam Tanute Mahyam Chandraghanteti Vishruta',
        kn: 'ಪಿಂಡಜ ಪ್ರವರಾರೂಢಾ ಚಂಡಕೋಪಾಸ್ತ್ರಕೈರ್ಯುತಾ | ಪ್ರಸಾದಂ ತನುತೇ ಮಹ್ಯಂ ಚಂದ್ರಘಂಟೇತಿ ವಿಶ್ರುತಾ ||',
        hi: 'पिण्डजप्रवरारूढा चण्डकोपास्त्रकैर्युता । प्रसादं तनुते मह्यं चन्द्रघण्टेति विश्रुता ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapter 5 of Sri Devi Mahatmyam. Offer Kheer made of cow milk.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೫ನೆಯ ಅಧ್ಯಾಯ ಓದಿ ಹಸುವಿನ ಹಾಲಿನ ಪಾಯಸ ನೈವೇದ್ಯ ಮಾಡಿ.',
        hi: 'सप्तशती के पंचम अध्याय का पाठ कर गाय के दूध की खीर का भोग लगाएँ।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day4',
    name: {
      en: 'Sharannavaratri / Dasera Day 4: Goddess Kushmanda Puja',
      kn: 'ಶರನ್ನವರಾತ್ರಿ / ದಸರಾ ದಿನ ೪: ಕೂಷ್ಮಾಂಡಾ ದೇವಿ ಪೂಜೆ',
      hi: 'शारदीय नवरात्रि / दशहरा दिवस ४: माँ कूष्माण्डा पूजन'
    },
    tagColor: '#059669',
    badgeBg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    shortDesc: {
      en: 'Fourth day worshiping Kushmanda Devi, whose radiant cosmic smile manifested the entire Brahmanda (Universe).',
      kn: 'ತನ್ನ ಮುಗುಳುನಗೆಯಿಂದಲೇ ಸಮಸ್ತ ಅಂಡ-ಪಿಂಡ ಬ್ರಹ್ಮಾಂಡವನ್ನು ಸೃಷ್ಟಿಸಿದ ಸೂರ್ಯಮಂಡಲವಾಸಿನಿ ಶ್ರೀ ಕೂಷ್ಮಾಂಡಾ ದೇವಿಯ ಪೂಜೆ.',
      hi: 'अपनी मन्द मुस्कान से ब्रह्माण्ड की रचना करने वाली आदिशक्ति माँ कूष्माण्डा का पूजन।'
    },
    howCelebrated: {
      en: 'Devotees offer Malpua and ash gourd (Kushmanda), lighting lamps of pure ghee for good health and cosmic radiance.',
      kn: 'ಮಾಲ್ಪುಆ ಮತ್ತು ಕುಂಬಳಕಾಯಿ ನೈವೇದ್ಯ, ತುಪ್ಪದ ದೀಪಗಳನ್ನು ಬೆಳಗಿ ಆರೋಗ್ಯ ಮತ್ತು ಆಯಸ್ಸಿಗಾಗಿ ಪ್ರಾರ್ಥನೆ.',
      hi: 'मालपुआ एवं कुम्हड़ा (पेठा) का भोग लगाकर उत्तम स्वास्थ्य व तेज की प्राप्ति हेतु पूजन।'
    },
    story: {
      en: 'When darkness enveloped all existence before creation, Mother Kushmanda smiled softly, producing blinding illumination and giving birth to the solar system and celestial gods.',
      kn: 'ಸೃಷ್ಟಿಗೆ ಮುನ್ನ ಕತ್ತಲಾವರಿಸಿದ್ದಾಗ ದೇವಿಯು ಮುಗುಳುನಕ್ಕು ಸೂರ್ಯನ ತೇಜಸ್ಸಿನಿಂದ ಈ ಬ್ರಹ್ಮಾಂಡವನ್ನು ಸೃಷ್ಟಿಸಿದಳು.',
      hi: 'सृष्टि के आरम्भ में जब अंधकार था, तब देवी ने मंद हास्य से संपूर्ण ब्रह्माण्ड को आलोकित किया।'
    },
    mantras: [
      {
        en: 'Surasampurna Kalasham Rudhiraplutameva Cha, Dadhana Hastapadmabhyam Kushmanda Shubhadastu Me',
        kn: 'ಸುರಾಸಂಪೂರ್ಣ ಕಲಶಂ ರುಧಿರಪ್ಲುತಮೇವ ಚ | ದಧಾನಾ ಹಸ್ತಪದ್ಮಾಭ್ಯಾಂ ಕೂಷ್ಮಾಂಡಾ ಶುಭದಾಸ್ತು ಮೇ ||',
        hi: 'सुरासम्पूर्णकलशं रुधिराप्लुतमेव च । दधाना हस्तपद्माभ्यां कूष्माण्डा शुभदास्तु मे ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapter 6 of Devi Mahatmyam. Offer green cardamom and pumpkin sweets.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೬ನೆಯ ಅಧ್ಯಾಯ ಪಠಿಸಿ ಏಲಕ್ಕಿ ಮಿಶ್ರಿತ ಸಿಹಿ ನೈವೇದ್ಯ ಅರ್ಪಿಸಿ.',
        hi: 'सप्तशती के षष्ठ अध्याय का पाठ करें।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day5',
    name: {
      en: 'Sharannavaratri Day 5: Goddess Skandamata & Lalita Vrata (Oct 15)',
      kn: 'ಶರನ್ನವರಾತ್ರಿ ದಿನ ೫: ಸ್ಕಂದಮಾತಾ ಪೂಜೆ ಮತ್ತು ಉಪಾಂಗ ಲಲಿತಾ ವ್ರತ (ಅಕ್ಟೋಬರ್ ೧೫)',
      hi: 'शारदीय नवरात्रि दिवस ५: माँ स्कन्दमाता एवं उपांग ललिता व्रत (१५ अक्टूबर)'
    },
    tagColor: '#2563eb',
    badgeBg: 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30',
    shortDesc: {
      en: 'Fifth sacred night honoring Mother Skandamata holding infant Lord Kartikeya, bestower of salvation and family prosperity.',
      kn: 'ಮಡಿಲಲ್ಲಿ ಬಾಲ ಕಾರ್ತಿಕೇಯನನ್ನು (ಸ್ಕಂದ) ಹಿಡಿದು ಆಶೀರ್ವದಿಸುವ ಜಗನ್ಮಾತೆ ಸ್ಕಂದಮಾತೆ ಹಾಗೂ ಲಲಿತಾ ಪಂಚಮಿ ಆರಾಧನೆ.',
      hi: 'गोद में बाल स्कन्द (कार्तिकेय) को धारण करने वाली वात्सल्यमयी माँ स्कन्दमाता का पूजन।'
    },
    howCelebrated: {
      en: 'Devotees offer yellow bananas and chant Lalita Sahasranama Stotram. Mothers pray for their children’s wisdom, health, and prosperity.',
      kn: 'ಬಾಳೆಹಣ್ಣು ನೈವೇದ್ಯ, ಲಲಿತಾ ಸಹಸ್ರನಾಮ ಪಠಣ ಹಾಗೂ ಮಕ್ಕಳ ಶ್ರೇಯಸ್ಸಿಗಾಗಿ ಮಾತೃ ಆರಾಧನೆ.',
      hi: 'केले का भोग, ललिता सहस्रनाम पाठ एवं सन्तान की दीर्घायु हेतु प्रार्थना।'
    },
    story: {
      en: 'As the commander-in-chief who destroyed demon Tarakasura, Lord Skanda was nurtured by Mother Parvati, who is re-honored as Skandamata.',
      kn: 'ತಾರಕಾಸುರನನ್ನು ಸಂಹರಿಸಿದ ದೇವಸೇನಾಪತಿ ಸುಬ್ರಹ್ಮಣ್ಯನಿಗೆ ಶಕ್ತಿ ತುಂಬಿದ ತಾಯಿಯಾದ ಸ್ಕಂದಮಾತೆಯ ದಿವ್ಯ ಕಥೆ.',
      hi: 'तारकासुर का संहार करने वाले भगवान कार्तिकेय की माता के रूप में देवी की पूजा होती है।'
    },
    mantras: [
      {
        en: 'Simhasanagata Nityam Padmashritakaradvaya, Shubhadastu Sada Devi Skandamata Yashasvini',
        kn: 'ಸಿಂಹಾಸನಗತಾ ನಿತ್ಯಂ ಪದ್ಮಾಶ್ರಿತಕರದ್ವಯಾ | ಶುಭದಾಸ್ತು ಸದಾ ದೇವೀ ಸ್ಕಂದಮಾತಾ ಯಶಸ್ವಿನೀ ||',
        hi: 'सिंहासनगता नित्यं पद्माश्रितकरद्वया । शुभदास्तु सदा देवी स्कन्दमाता यशस्विनी ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapter 7 of Sri Devi Mahatmyam. Perform Archana with yellow lotus/flowers.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೭ನೆಯ ಅಧ್ಯಾಯ ಓದಿ ಹಳದಿ ಪುಷ್ಪಗಳಿಂದ ಅಷ್ಟೋತ್ತರ ಅರ್ಚನೆ ಮಾಡಿ.',
        hi: 'सप्तम अध्याय का पाठ कर पीले पुष्पों से माँ की अर्चना करें।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day6',
    name: {
      en: 'Sharannavaratri Day 6: Goddess Katyayani & Bilva Nimantrana (Oct 16)',
      kn: 'ಶರನ್ನವರಾತ್ರಿ ದಿನ ೬: ಕಾತ್ಯಾಯನೀ ದೇವಿ ಪೂಜೆ ಮತ್ತು ಬಿಲ್ವ ನಿಮಂತ್ರಣ (ಅಕ್ಟೋಬರ್ ೧೬)',
      hi: 'शारदीय नवरात्रि दिवस ६: माँ कात्यायनी एवं बिल्व निमंत्रण (१६ अक्टूबर)'
    },
    tagColor: '#7c3aed',
    badgeBg: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30',
    shortDesc: {
      en: 'Sixth night worshiping warrior Goddess Katyayani, born to sage Katyayana, and the traditional Bilva tree invocation.',
      kn: 'ಕಾತ್ಯಾಯನ ಮಹರ್ಷಿಗಳ ತಪಸ್ಸಿಗೆ ಮೆಚ್ಚಿ ಅವರ ಮಗಳಾಗಿ ಜನಿಸಿದ ಮಹಿಷಾಸುರ ಮರ್ಧಿನಿ ಕಾತ್ಯಾಯನಿ ಮತ್ತು ಶಮೀ-ಬಿಲ್ವ ಆಹ್ವಾನ.',
      hi: 'महर्षि कात्यायन की तपस्या से प्रादुर्भूत पराक्रमी माँ कात्यायनी की पूजा एवं बिल्व निमंत्रण।'
    },
    howCelebrated: {
      en: 'Offering sweet honey and red garments. Young men and women pray for harmonious marriages and removal of Manglik doshas.',
      kn: 'ಜೇನುತುಪ್ಪದ ನೈವೇದ್ಯ, ಬಿಲ್ವಪತ್ರೆ ಅರ್ಪಣೆ ಹಾಗೂ ಕಂಕಣ ಭಾಗ್ಯ, ವಿವಾಹ ದೋಷ ಪರಿಹಾರಕ್ಕಾಗಿ ವಿಶೇಷ ಪ್ರಾರ್ಥನೆ.',
      hi: 'शहद का भोग, विवाह बाधा निवारण एवं सुखद गृहस्थ जीवन हेतु विशेष पूजन।'
    },
    story: {
      en: 'The Gopis of Vrindavan worshipped Goddess Katyayani with fasting on the banks of Yamuna to obtain Lord Sri Krishna as their beloved.',
      kn: 'ವ್ರಜದ ಗೋಪಿಯರು ಶ್ರೀಕೃಷ್ಣನನ್ನು ಪತಿಯಾಗಿ ಪಡೆಯಲು ಯಮುನಾ ತೀರದಲ್ಲಿ ಕಾತ್ಯಾಯನೀ ವ್ರತವನ್ನು ಆಚರಿಸಿದ್ದರು.',
      hi: 'गोपियों ने श्रीकृष्ण को पति रूप में पाने के लिए कालिन्दी तट पर कात्यायनी व्रत रखा था।'
    },
    mantras: [
      {
        en: 'Chandrahasojjvalakara Shardulavaravahana, Katyayani Shubham Dadyad Devi Danavaghatini',
        kn: 'ಚಂದ್ರಹಾಸೋಜ್ಜ್ವಲಕರಾ ಶಾರ್ದೂಲವರವಾಹನಾ | ಕಾತ್ಯಾಯನೀ ಶುಭಂ ದದ್ಯಾದ್ ದೇವೀ ದಾನವಘಾತಿನೀ ||',
        hi: 'चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना । कात्यायनी शुभं दद्याद् देवी दानवघातिनी ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapter 8 (Mahishasura Vadha prep) of Devi Mahatmyam. Offer pure wild honey in silver bowl.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೮ನೆಯ ಅಧ್ಯಾಯದ ಮುನ್ನಡೆ ಓದಿ ಶುದ್ಧ ಜೇನುತುಪ್ಪ ಸಮರ್ಪಿಸಿ.',
        hi: 'अष्टम अध्याय का पाठ कर शुद्ध मधु (शहद) का नैवेद्य अर्पित करें।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day7',
    name: {
      en: 'Sharannavaratri Day 7: Goddess Kalaratri & Saraswati Avahana (Oct 17)',
      kn: 'ಶರನ್ನವರಾತ್ರಿ ದಿನ ೭: ಕಾಳರಾತ್ರಿ ದೇವಿ ಪೂಜೆ ಮತ್ತು ಸರಸ್ವತಿ ಆವಾಹನೆ (ಅಕ್ಟೋಬರ್ ೧೭)',
      hi: 'शारदीय नवरात्रि दिवस ७: माँ कालरात्रि एवं सरस्वती आवाहन (१७ अक्टूबर)'
    },
    tagColor: '#1e293b',
    badgeBg: 'bg-slate-500/15 text-slate-800 dark:text-slate-300 border-slate-500/30',
    shortDesc: {
      en: 'Fierce seventh night of Kalaratri who swallows the blood of demon Raktabija, bringing supreme fearlessness to devotees.',
      kn: 'ರಕ್ತಬೀಜನನ್ನು ಸಂಹರಿಸಿದ ಅತ್ಯುಗ್ರ ರೂಪದ ಶುಭಂಕರೀ ಕಾಳರಾತ್ರಿ ಆರಾಧನೆ ಹಾಗೂ ಮಹಾಸರಸ್ವತಿ ಆವಾಹನೆ.',
      hi: 'रक्तबीज का संहार करने वाली महाभयनाशिनी माँ कालरात्रि की निशा पूजा एवं सरस्वती आवाहन।'
    },
    howCelebrated: {
      en: 'Nighttime Tantrokta and Vaidik prayers, offering jaggery sweets. Books, musical instruments, and manuscripts are consecrated for Saraswati Puja.',
      kn: 'ರಾತ್ರಿ ಸಮಯದಲ್ಲಿ ಗೂಳಿಯ ಮೇಲೆ ಕುಳಿತ ಕಾಳರಾತ್ರಿಗೆ ಬೆಲ್ಲದ ನೈವೇದ್ಯ, ಗ್ರಂಥಗಳು ಹಾಗೂ ವಾದ್ಯಗಳನ್ನು ಸರಸ್ವತಿ ಪೂಜೆಗೆ ಇರಿಸುವುದು.',
      hi: 'गुड़ का भोग, रात्रिकालीन दीपदान एवं विद्यारम्भ हेतु ग्रन्थों की सरस्वती प्रतिष्ठा।'
    },
    story: {
      en: 'When demon Raktabija multiplied from each drop of blood that hit the earth, Devi stretched Her tongue across the horizon to swallow every drop, destroying darkness completely.',
      kn: 'ರಕ್ತಬೀಜನ ಪ್ರತಿಯೊಂದು ರಕ್ತದ ಹನಿಯಿಂದ ಸಾವಿರಾರು ರಕ್ಕಸರು ಹುಟ್ಟುತ್ತಿದ್ದಾಗ, ದೇವಿಯು ಕಾಳರಾತ್ರಿ ರೂಪದಿಂದ ರಕ್ತವನ್ನು ಹೀರಿ ರಕ್ಷಿಸಿದಳು.',
      hi: 'रक्तबीज के रक्त की एक-एक बूंद का पान कर माँ ने धर्म की रक्षा की।'
    },
    mantras: [
      {
        en: 'Ekaveni Japakarnapura Nagna Kharasthita, Lamboshthi Karnikakarni Tailabhyaktasharirini, Vamapadollasallohalatakanthakabhushana, Vardhanamurdhadhwaja Krishna Kalaratrirbhayankari',
        kn: 'ಏಕವೇಣೀ ಜಪಾಕರ್ಣಪೂರಾ ನಗ್ನಾ ಖರಸ್ಥಿತಾ | ಲಂಬೋಷ್ಠೀ ಕರ್ಣಿಕಾಕರ್ಣೀ ತೈಲಾಭ್ಯಕ್ತಶರೀರಿಣೀ ... ಕಾಳರಾತ್ರಿರ್ಭಯಂಕರೀ ||',
        hi: 'एकवेणी जपाकर्णपूरा नग्ना खरास्थिता । लम्बोष्ठी कर्णिकाकर्णी तैलाभ्यक्तशरीरिणी ... कालरात्रिर्भयंकरी ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapters 9 & 10 of Sri Devi Mahatmyam. Offer jaggery and camphor Arati.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೯ ಮತ್ತು ೧೦ನೆಯ ಅಧ್ಯಾಯಗಳನ್ನು ಓದಿ ಕರ್ಪೂರಾರತಿ ಮಾಡಿ.',
        hi: 'नवम व दशम अध्याय का पाठ कर गुड़ का भोग लगाएँ।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day8',
    name: {
      en: 'Sharannavaratri Day 8: Maha Ashtami, Mahagauri & Kushmanda Bali (Oct 18)',
      kn: 'ಶರನ್ನವರಾತ್ರಿ ದಿನ ೮: ಮಹಾ ಅಷ್ಟಮೀ, ಮಹಾಗೌರೀ ಪೂಜೆ ಮತ್ತು ಕೂಷ್ಮಾಂಡ ಬಲಿ (ಅಕ್ಟೋಬರ್ ೧೮)',
      hi: 'शारदीय नवरात्रि दिवस ८: महाष्टमी, महागौरी पूजन एवं कूष्माण्ड बलि (१८ अक्टूबर)'
    },
    tagColor: '#ec4899',
    badgeBg: 'bg-pink-500/15 text-pink-800 dark:text-pink-300 border-pink-500/30',
    shortDesc: {
      en: 'Most auspicious Maha Ashtami night: Mahagauri Puja, Kanya Puja (worship of 9 young girls), and offering of sliced Kushmanda (ash gourd) Sattvik bali.',
      kn: 'ಅತ್ಯಂತ ಪವಿತ್ರ ಮಹಾಷ್ಟಮಿ: ಶುಭ್ರ ಶ್ವೇತವರ್ಣದ ಮಹಾಗೌರಿ ಪೂಜೆ, ಕನ್ಯಾ ಪೂಜೆ ಹಾಗೂ ರಾತ್ರಿ ಕೂಷ್ಮಾಂಡ (ಕುಂಬಳಕಾಯಿ) ಬಲಿ ಸಮರ್ಪಣೆ.',
      hi: 'महाष्टमी का महापर्व: महागौरी पूजन, कन्या पूजन एवं रात्रि में कूष्माण्ड (पेठा) की सात्त्विक बलि।'
    },
    howCelebrated: {
      en: 'Kanya Poojan of young girls representing the Nine Durgas, washing their feet and offering Halwa, Puri, Chana, and gifts. At night, the Mahishasura Mardana chapter is recited and an ash gourd (Kushmanda) sliced with vermilion as sacred non-violent bali.',
      kn: '೯ ಜನ ಪುಟ್ಟ ಕನ್ಯೆಯರಿಗೆ ಪಾದಪೂಜೆ ಮಾಡಿ ಹಲ್ವಾ-ಪೂರಿ, ಉಡುಗೊರೆಗಳನ್ನು ನೀಡುವುದು. ರಾತ್ರಿ ೮ನೇ ಅಧ್ಯಾಯ (ಮಹಿಷಾಸುರ ಮರ್ದನ) ಓದಿ ಕುಂಬಳಕಾಯಿಗೆ ಕುಂಕುಮ ಲೇಪಿಸಿ ಸಾತ್ವಿಕ ಬಲಿ ಕೊಡುವುದು (ಫೋಟೋ ಪ್ರತಿಯಲ್ಲಿ ಉಲ್ಲೇಖಿಸಿದಂತೆ).',
      hi: '९ कन्याओं का चरण-पूजन कर हलवा-चना-पूरी का भोग। रात्रि में अष्टम अध्याय पाठ कर कूष्माण्ड (पेठा) की बलि अर्पण।'
    },
    story: {
      en: 'After severe austerities turned Her body dark, Lord Shiva washed Her with the sacred waters of Ganga, making Her radiant like lightning—hence named Mahagauri.',
      kn: 'ಶಿವನ ತಪಸ್ಸಿನಿಂದ ಕಪ್ಪಾಗಿದ್ದ ದೇವಿಯ ಶರೀರವನ್ನು ಗಂಗಾಜಲದಿಂದ ಶಿವನು ಅಭಿಷೇಕಿಸಿದಾಗ ಆಕೆಯು ಮಿಂಚಿನಂತೆ ಧವಳ ಶ್ವೇತವರ್ಣದ ಮಹಾಗೌರಿಯಾದಳು.',
      hi: 'कठोर तपस्या के उपरांत गंगा जल से स्नान कर देवी का वर्ण गौर हो गया, जिससे वे महागौरी कहलाईं।'
    },
    mantras: [
      {
        en: 'Shwete Vrishesamarudha Shwetambaradhara Shuchih, Mahagauri Shubham Dadyan Mahadevopramodada',
        kn: 'ಶ್ವೇತೇ ವೃಷೇಸಮಾರೂಢಾ ಶ್ವೇತಾಂಬರಧರಾ ಶುಚಿಃ | ಮಹಾಗೌರೀ ಶುಭಂ ದದ್ಯೋನ್ಮಹಾದೇವಪ್ರಮೋದದಾ ||',
        hi: 'श्वेते वृषे समारूढा श्वेताम्बरधरा शुचिः । महागौरी शुभं दद्यान्महादेवप्रमोददा ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Read Chapter 8 (Mahishasura Mardana) at night and perform Kushmanda (ash gourd) sliced bali.',
        kn: 'ರಾತ್ರಿ ೮ನೇ ಅಧ್ಯಾಯವನ್ನು (ಮಹಿಷಾಸುರ ಮರ್ದನ) ಓದಿ ಕುಂಬಳಕಾಯಿ (ಕೂಷ್ಮಾಂಡ) ಯನ್ನು ಕೊಯ್ದು ದೇವಿಗೆ ಬಲಿಯನ್ನು ಸಮರ್ಪಿಸಬೇಕು.',
        hi: 'रात्रि में अष्टम अध्याय का पाठ कर कूष्माण्ड फल काटकर सात्त्विक बलि समर्पित करें।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day9',
    name: {
      en: 'Sharannavaratri Day 9: Maha Navami, Siddhidatri & Ayudha Puja (Oct 19)',
      kn: 'ಶರನ್ನವರಾತ್ರಿ ದಿನ ೯: ಮಹಾ ನವಮೀ, ಸಿದ್ಧಿದಾತ್ರಿ ಪೂಜೆ ಮತ್ತು ಆಯುಧ ಪೂಜೆ (ಅಕ್ಟೋಬರ್ ೧೯)',
      hi: 'शारदीय नवरात्रि दिवस ९: महानवमी, सिद्धिदात्री पूजन एवं आयुध/सरस्वती पूजा (१९ अक्टूबर)'
    },
    tagColor: '#0284c7',
    badgeBg: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30',
    shortDesc: {
      en: 'Maha Navami honoring Goddess Siddhidatri, bestowal of all 18 Siddhis; Ayudha Puja worship of tools, books, and vehicles.',
      kn: 'ಸರ್ವ ಸಿದ್ಧಿಗಳನ್ನು ಕರುಣಿಸುವ ಸಿದ್ಧಿದಾತ್ರಿ ದೇವಿಯ ಆರಾಧನೆ, ಆಯುಧ ಪೂಜೆ, ವಾಹನ ಪೂಜೆ ಮತ್ತು ಮಹಾಸರಸ್ವತಿ ಮಹಾಪೂಜೆ.',
      hi: 'समस्त अष्ट-सिद्धियों की दात्री माँ सिद्धिदात्री का पूजन एवं आयुध (शस्त्र/वाहन/यन्त्र) पूजा।'
    },
    howCelebrated: {
      en: 'Worship of all work instruments, computers, vehicles, and artisanal tools with Chandana, Kumkuma, flower garlands, and lemons. Chandi Homa is solemnly concluded in temples.',
      kn: 'ಮನೆಯ ವಾಹನಗಳು, ಯಂತ್ರಗಳು, ಲೇಖನಿ ಹಾಗೂ ಪರಿಕರಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ ಗಂಧ-ಕುಂಕುಮ, ಬೂದುಕುಂಬಳಕಾಯಿ, ನಿಂಬೆಹಣ್ಣು ಹಾಗೂ ಹೂಮಾಲೆಗಳಿಂದ ಆಯುಧ ಪೂಜೆ ನಡೆಸಲಾಗುತ್ತದೆ.',
      hi: 'वाहन, ग्रन्थ, औजारों एवं यन्त्रों का चन्दन, पुष्प व नींबू से पूजन कर चण्डी महायज्ञ की पूर्णाहुति दी जाती है।'
    },
    story: {
      en: 'Lord Shiva attained all supernatural Siddhis through the grace of Siddhidatri, merging Her half-form into Himself as Ardhanarishwara.',
      kn: 'ಸಿದ್ಧಿದಾತ್ರಿ ದೇವಿಯ ಕೃಪೆಯಿಂದಲೇ ಪರಮೇಶ್ವರನು ಸಮಸ್ತ ಸಿದ್ಧಿಗಳನ್ನು ಪಡೆದು ಅರ್ಧನಾರೀಶ್ವರನಾದನೆಂದು ಶಿವಪುರಾಣವು ಸಾರುತ್ತದೆ.',
      hi: 'भगवान शिव ने भी इन्हीं की कृपा से समस्त सिद्धियाँ प्राप्त कर अर्धनारीश्वर स्वरूप धारण किया था।'
    },
    mantras: [
      {
        en: 'Siddha Gandharva Yakshadyairasurairamarairapi, Sevyamana Sada Bhuyat Siddhida Siddhidayini',
        kn: 'ಸಿದ್ಧ ಗಂಧರ್ವ ಯಕ್ಷಾದ್ಯೈರಸುರೈರಮರೈರಪಿ | ಸೇವ್ಯಮಾನಾ ಸದಾ ಭೂಯಾತ್ ಸಿದ್ಧಿದಾ ಸಿದ್ಧಿದಾಯಿನೀ ||',
        hi: 'सिद्धगन्धर्वयक्षाद्यैरसुरैरमरैरपि । सेव्यमाना सदा भूयात् सिद्धिदा सिद्धिदायिनी ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Complete Chapters 11, 12 & 13 of Devi Mahatmyam and Chandi Homa Purnahuti.',
        kn: 'ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆಯ ೧೧, ೧೨ ಮತ್ತು ೧೩ನೆಯ ಅಧ್ಯಾಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ಮಹಾ ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ.',
        hi: 'एकादश, द्वादश व त्रयोदश अध्याय का पाठ कर चण्डी पूर्णाहुति करें।'
      }
    ],
    isNavaratri: true
  },
  {
    id: 'navaratri_day10',
    name: {
      en: 'Sharannavaratri Day 10: Vijayadashami / Dasera (Oct 20)',
      kn: 'ಶರನ್ನವರಾತ್ರಿ ದಿನ ೧೦: ವಿಜಯದಶಮಿ / ದಸರಾ ಹಬ್ಬ (ಅಕ್ಟೋಬರ್ ೨೦)',
      hi: 'शारदीय नवरात्रि दिवस १०: विजयादशमी / दशहरा (२० अक्टूबर)'
    },
    tagColor: '#b45309',
    badgeBg: 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30',
    shortDesc: {
      en: 'Triumph of Goodness over Evil: Grand culmination of Sharannavaratri, Aparajita Puja, Shami (Banni) leaf exchange, and Kalasha Visarjana.',
      kn: 'ಅಧರ್ಮದ ಮೇಲೆ ಧರ್ಮದ ವಿಜಯೋತ್ಸವ: ಶರನ್ನವರಾತ್ರಿಯ ಮಂಗಲ ಮಹೋತ್ಸವ, ಅಪರಾಜಿತಾ ಪೂಜೆ, ಬನ್ನಿ ಹಂಚಿಕೆ, ಅಕ್ಷರಾಭ್ಯಾಸ ಮತ್ತು ಕಲಶ ವಿಸರ್ಜನೆ.',
      hi: 'बुराई पर अच्छाई की विजय: दशहरा महोत्सव, शमी पूजन, स्वर्ण प्रतीक शमी पत्र आदान-प्रदान एवं कलश विसर्जन।'
    },
    howCelebrated: {
      en: 'Mysuru Dasara Jumboo Savari, burning of Ravana effigies, Vidyarambham (Aksharabhyasa) for children, exchanging Shami leaves ("Banni thagoli bangaradhangiri"), and solemn Kalasha Visarjana.',
      kn: 'ಮೈಸೂರು ದಸರಾ ಜಂಬೂ ಸವಾರಿ, ಶಮೀ ವೃಕ್ಷಕ್ಕೆ ಪೂಜೆ ಸಲ್ಲಿಸಿ "ಬನ್ನಿ ತಗೋಳಿ ಬಂಗಾರ್ದಂಗಿರಿ" ಎಂದು ಹಿರಿಯರಿಗೆ ಬನ್ನಿ ಕೊಟ್ಟು ನಮಸ್ಕರಿಸುವುದು, ದೇವೀ ಕಲಶವನ್ನು ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಚಲಿಸಿ ವಿಸರ್ಜಿಸುವುದು.',
      hi: 'रावण दहन, शमी (अपराजिता) वृक्ष पूजन, बच्चों का अक्षराभ्यास एवं विधिवत कलश विसर्जन।'
    },
    story: {
      en: 'On this tenth day, Devi Durga slayed demon Mahishasura. Simultaneously, Lord Sri Rama worshipped Goddess Aparajita and the sacred Shami tree to vanquish Ravana.',
      kn: 'ದುರ್ಗಾದೇವಿಯು ಮಹಿಷಾಸುರನನ್ನು ಸಂಹರಿಸಿದ ಮತ್ತು ಶ್ರೀರಾಮನು ರಾವಣನನ್ನು ಸಂಹರಿಸಿ ಧರ್ಮವನ್ನು ಮರುಸ್ಥಾಪಿಸಿದ ಪರಮ ಪವಿತ್ರ ದಿನ.',
      hi: 'माँ दुर्गा द्वारा महिषासुर संहार एवं प्रभु श्रीराम द्वारा रावण वध का परम पावन विजय दिवस।'
    },
    mantras: [
      {
        en: 'Shami Shamayate Papam Shami Shatru Vinashini, Arjunasya Dhanurdhari Ramasya Priya Darshini',
        kn: 'ಶಮೀ ಶಮಯತೇ ಪಾಪಂ ಶಮೀ ಶತ್ರು ವಿನಾಶಿನೀ | ಅರ್ಜುನಸ್ಯ ಧನುರ್ಧಾರಿ ರಾಮಸ್ಯ ಪ್ರಿಯದರ್ಶಿನೀ ||',
        hi: 'शमी शमयते पापं शमी शत्रुविनाशिनी । अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Complete conclusion verses of Devi Purana, offer sweet Naivedya, perform Pradakshina, and move the Kalasha northward with heartfelt reverence for Visarjana.',
        kn: 'ದೇವಿ ಪುರಾಣದ ಸಮರ್ಪಣಾ ಶ್ಲೋಕಗಳನ್ನು ಹೇಳಿ, ಮಹಾ ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ, ಪ್ರದಕ್ಷಿಣೆ ಬಂದು ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಕಲಶವನ್ನು ಚಲಿಸಿ ವಿಸರ್ಜಿಸುವುದು (ಫೋಟೋ ಪ್ರತಿಯ ೧೦ನೆಯ ಅಂಶದಂತೆ).',
        hi: 'समापन स्तोत्र पाठ कर, उत्तर दिशा में कलश हिलाकर विधिपूर्वक विसर्जन सम्पन्न करें।'
      }
    ],
    isNavaratri: true
  },

  // -------------------------------------------------------------
  // OTHER MAJOR VEDIC FESTIVALS (INCL. DEEPAVALI IN NOVEMBER)
  // -------------------------------------------------------------
  {
    id: 'mahalaya_amavasya',
    name: {
      en: 'Mahalaya Amavasya (Sarvapitri Amavasya)',
      kn: 'ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ (ಸರ್ವಪಿತೃ ಅಮಾವಾಸ್ಯೆ)',
      hi: 'महालय अमावस्या (सर्वपितृ अमावस्या)'
    },
    tagColor: '#64748b',
    badgeBg: 'bg-slate-500/15 text-slate-800 dark:text-slate-300 border-slate-500/30',
    shortDesc: {
      en: 'Sacred culmination of Pitru Paksha. Performing Tarpan, Anna Daana, and Tilodaka for departed ancestors before Navaratri begins.',
      kn: 'ಪಿತೃ ಪಕ್ಷದ ಮಹಾ ಸಮಾರೋಪ ದಿನ. ಪೂರ್ವಜರ ತೃಪ್ತಿಗಾಗಿ ತಿಲತರ್ಪಣ, ಶ್ರಾದ್ಧ, ಪಿಂಡಪ್ರದಾನ ಮತ್ತು ಅನ್ನದಾನ ಮಾಡುವ ಪರಮ ಪುಣ್ಯದಿನ.',
      hi: 'पितृ पक्ष की पूर्णाहुति। समस्त ज्ञात-अज्ञात पितरों के निमित्त श्राद्ध, तर्पण एवं अन्नदान का पावन दिवस।'
    },
    howCelebrated: {
      en: 'Devotees offer sacred bath, sesame water (Tilodaka Tarpan), offer food to cows, crows, and priests, and pray for ancestral peace.',
      kn: 'ನದಿ-ತೀರ್ಥ ಸ್ನಾನ, ಎಳ್ಳು-ನೀರು ಬಿಟ್ಟು ತರ್ಪಣ, ಗೋವುಗಳಿಗೆ ಗ್ರಾಸ್, ಕಾಗೆಗಳಿಗೆ ಅನ್ನ ಬಲಿ ಹಾಗೂ ಬ್ರಾಹ್ಮಣ ಭೋಜನ-ದಾನ.',
      hi: 'पवित्र तीर्थ स्नान, तिल मिश्रित जल से तर्पण, गोमाता एवं विप्रों को भोजन समर्पण।'
    },
    story: {
      en: 'According to scriptures, during Pitru Paksha, souls of departed ancestors visit their descendants. Offering shraddha on Mahalaya Amavasya liberates ancestors for generations.',
      kn: 'ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆಯಂದು ಶ್ರಾದ್ಧ-ತರ್ಪಣ ಮಾಡಿದರೆ ಇಡೀ ವರ್ಷದ ಪಿತೃಋಣ ಪರಿಹಾರವಾಗಿ ಕುಲಕ್ಕೆ ವೃದ್ಧಿ ಲಭಿಸುತ್ತದೆ.',
      hi: 'महाभारत के अनुसार कर्ण को यमलोक में सुवर्ण के स्थान पर अन्नदान का महत्व ज्ञात हुआ और उन्होंने महालय में तर्पण किया।'
    },
    mantras: [
      {
        en: 'Om Pitruganaya Vidmahe Jagaddharine Dhimahi Tanno Pitro Prachodayat',
        kn: 'ಓಂ ಪಿತೃಗಣಾಯ ವಿದ್ಮಹೇ ಜಗದ್ಧಾರಿಣೇ ಧೀಮಹಿ ತನ್ನೋ ಪಿತೃಃ ಪ್ರಚೋದಯಾತ್ ||',
        hi: 'ॐ पितृगणाय विद्महे जगद्धारिणे धीमहि तन्नो पितृः प्रचोदयात् ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Morning sacred snana, Tilodaka tarpan with Kusha grass facing south, Anna daana, and lighting of evening pitru deepa.',
        kn: 'ಬೆಳಿಗ್ಗೆ ತೀರ್ಥಸ್ನಾನ, ದರ್ಭೆ ಹಿಡಿದು ದಕ್ಷಿಣಾಭಿಮುಖವಾಗಿ ತಿಲತರ್ಪಣ, ಮಹಾನೈವೇದ್ಯ-ಅನ್ನದಾನ, ಸಂಜೆ ಪಿತೃದೀಪ ಬೆಳಗುವುದು.',
        hi: 'प्रातः स्नान, कुशा एवं तिल से दक्षिणाभिमुख तर्पण, ब्राह्मभोजन एवं सायं पितृ दीपदान।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Darbha / Kusha Grass & Pavitra ring',
        kn: '೧. ದರ್ಭೆ ಮತ್ತು ಪವಿತ್ರ (Kusha grass)',
        hi: '१. कुशा एवं पवित्रक अंगूठी'
      },
      {
        en: '2. Black sesame seeds (Kala Til / ಕಪ್ಪು ಎಳ್ಳು)',
        kn: '೨. ಕಪ್ಪು ಎಳ್ಳು (Black Til)',
        hi: '२. काले तिल'
      },
      {
        en: '3. Copper Arghya vessel and water',
        kn: '೩. ತಾಮ್ರದ ಅರ್ಘ್ಯ ಪಾತ್ರೆ ಮತ್ತು ಶುದ್ಧೋದಕ',
        hi: '३. तांबे का तर्पण पात्र एवं गंगाजल'
      },
      {
        en: '4. White flowers, barley (Yava), Chandana',
        kn: '೪. ಬಿಳಿ ಹೂವುಗಳು, ಯವಧಾನ್ಯ, ಬಿಳಿ ಚಂದನ',
        hi: '४. श्वेत पुष्प, यव एवं चन्दन'
      },
      {
        en: '5. Food for offering (cooked rice, kheer, fruits)',
        kn: '೫. ಪಿಂಡಪ್ರದಾನ ನೈವೇದ್ಯ, ಅನ್ನ, ಪಾಯಸ, ಹಣ್ಣುಗಳು',
        hi: '५. पिण्डदानार्थ खीर, पक्वान्न एवं फल'
      }
    ]
  },
  {
    id: 'dhanteras',
    name: {
      en: 'Dhanteras / Dhantrayodashi (Yamadeepadaana)',
      kn: 'ಧನತ್ರಯೋದಶಿ (ಧನ್ವಂತರಿ ಜಯಂತಿ ಮತ್ತು ಯಮದೀಪ)',
      hi: 'धनतेरस / धनत्रयोदशी (यमदीपदान एवं धन्वन्तरि जयन्ती)'
    },
    tagColor: '#eab308',
    badgeBg: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30',
    shortDesc: {
      en: 'Auspicious first day of Deepavali: Worship of Lord Dhanvantari (deity of health), purchasing utensils/gold, and South-facing Yama Deepa.',
      kn: 'ದೀಪಾವಳಿಯ ಪ್ರಥಮ ದಿನ: ಆಯುರ್ವೇದ ಪ್ರವರ್ತಕ ಶ್ರೀ ಧನ್ವಂತರಿ ಪೂಜೆ, ಹೊಸ ಪಾತ್ರೆ-ಚಿನ್ನ ಖರೀದಿ ಹಾಗೂ ದಕ್ಷಿಣ ದಿಕ್ಕಿಗೆ ಯಮದೀಪ ದಾನ.',
      hi: 'दीपावली का प्रथम दिवस: भगवान धन्वन्तरि पूजन, स्वर्ण/बर्तन क्रय एवं अकाल मृत्यु निवारणार्थ यमदीपदान।'
    },
    howCelebrated: {
      en: 'Families purchase new utensils, silver, or gold. In the evening, an oil lamp with 4 wicks is lit and placed facing South outside the threshold as Yama Deepa.',
      kn: 'ಹೊಸ ಪಾತ್ರೆಗಳು ಅಥವಾ ಆಭರಣಗಳನ್ನು ಖರೀದಿಸಿ ಪೂಜಿಸುವುದು, ಸಂಜೆ ಯಮದೇವನಿಗೆ ಪ್ರಾರ್ಥಿಸುತ್ತಾ ದಕ್ಷಿಣಾಭಿಮುಖವಾಗಿ ದೀಪ ಬೆಳಗುವುದು.',
      hi: 'नवीन बर्तन एवं आभूषण क्रय करना तथा सायंकाल दक्षिण दिशा में यमराज के निमित्त चौमुखा दीपक प्रज्वलित करना।'
    },
    story: {
      en: 'During Samudra Manthana, Lord Dhanvantari emerged holding the pot of Amrita (nectar). King Hima’s son was saved from premature death on this night by the radiance of lamps.',
      kn: 'ಸಮುದ್ರ ಮಂಥನದ ವೇಳೆ ಅಮೃತ ಕಲಶವನ್ನು ಹಿಡಿದು ಧನ್ವಂತರಿ ಭಗವಂತನು ಅವತರಿಸಿದ ದಿನ.',
      hi: 'समुद्र मन्थन से अमृत कलश लेकर भगवान धन्वन्तरि का प्राकट्य हुआ।'
    },
    mantras: [
      {
        en: 'Om Namo Bhagavate Vasudevaya Dhanvantaraye Amritakalashahastaya Sarvamayavinashaya Trailokyanathaya Sri Mahavishnave Namah',
        kn: 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ ಧನ್ವಂತರಯೇ ಅಮೃತಕಲಶಹಸ್ತಾಯ ಸರ್ವಾಮಯವಿನಾಶಾಯ ತ್ರೈಲೋಕ್ಯನಾಥಾಯ ಶ್ರೀ ಮಹಾವಿಷ್ಣವೇ ನಮಃ',
        hi: 'ॐ नमो भगवते वासुदेवाय धन्वन्तरये अमृतकलशहस्ताय सर्वामयविनाशाय त्रैलोक्यनाथाय श्री महाविष्णवे नमः'
      }
    ],
    poojaVidhi: [
      {
        en: 'Worship Dhanvantari idol, clean entrance, light 13 lamps with sesame oil facing South.',
        kn: 'ಧನ್ವಂತರಿ ಪೂಜೆ, ಸಂಜೆ ಎಳ್ಳೆಣ್ಣೆಯ ೧೩ ದೀಪಗಳನ್ನು ಹೊಸ್ತಿಲ ಬಳಿ ಇಟ್ಟು ಯಮದೀಪ ಸಮರ್ಪಿಸಿ.',
        hi: 'धन्वन्तरि व कुबेर पूजन कर १३ दीप प्रज्वलित करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Dhanvantari / Kuber idol or photo',
        kn: '೧. ಧನ್ವಂತರಿ / ಕುಬೇರ ಫೋಟೋ ಅಥವಾ ಮೂರ್ತಿ',
        hi: '१. भगवान धन्वन्तरि एवं कुबेर की प्रतिमा'
      },
      {
        en: '2. 13 Clay Diyas with sesame oil and cotton wicks',
        kn: '೨. ೧೩ ಮಣ್ಣಿನ ಹಣತೆಗಳು, ಎಳ್ಳೆಣ್ಣೆ ಮತ್ತು ಹತ್ತಿ ಬತ್ತಿಗಳು',
        hi: '२. १३ मिट्टी के दीपक, तिल का तेल एवं रुई की बत्ती'
      },
      {
        en: '3. Whole coriander seeds (Dhania) and jaggery',
        kn: '೩. ಒಣ ಕೊತ್ತಂಬರಿ ಕಾಳುಗಳು ಮತ್ತು ಬೆಲ್ಲದ ನೈವೇದ್ಯ',
        hi: '३. साबुत धनिया एवं गुड़ का नैवेद्य'
      },
      {
        en: '4. New metallic utensil / coin for Puja',
        kn: '೪. ಪೂಜೆಗೆ ಹೊಸ ಲೋಹದ ಪಾತ್ರೆ ಅಥವಾ ನಾಣ್ಯ',
        hi: '४. नवीन धातु का बर्तन अथवा सिक्का'
      }
    ]
  },
  {
    id: 'naraka_chaturdashi',
    name: {
      en: 'Naraka Chaturdashi (Abhyanga Taila Snana & Chhoti Diwali)',
      kn: 'ನರಕ ಚತುರ್ದಶಿ (ಎಣ್ಣೆನೀರು - ಅಭ್ಯಂಜನ ಸ್ನಾನ)',
      hi: 'नरक चतुर्दशी (रूप चौदस एवं अभ्यंग स्नान)'
    },
    tagColor: '#f97316',
    badgeBg: 'bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30',
    shortDesc: {
      en: 'Second day of Deepavali commemorating Sri Krishna vanquishing demon Narakasura; dawn sacred fragrant oil bath (Abhyanga Snanam).',
      kn: 'ನಸುಕಿನಲ್ಲಿ ತೈಲಾಭ್ಯಂಗನ ಸ್ನಾನ (ಎಣ್ಣೆನೀರು), ಅಂಧಕಾರದ ನಿವಾರಣೆ ಹಾಗೂ ಕೃಷ್ಣ-ಸತ್ಯಭಾಮೆಯರ ವಿಜಯೋತ್ಸವ.',
      hi: 'भगवान श्रीकृष्ण द्वारा नरकासुर वध; अरुणोदय काल में उबटन व तैल लगाकर अभ्यंग स्नान।'
    },
    howCelebrated: {
      en: 'Before dawn (~5 AM), elders apply fragrant sesame oil and Utane on family members, followed by hot water bath with sacred herbs, lighting dawn Diyas and wearing new attire.',
      kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತದಲ್ಲಿ ಎಳ್ಳೆಣ್ಣೆ ಹಚ್ಚಿ, ಅರಿಶಿನ-ಸುಗಂಧ ದ್ರವ್ಯಗಳಿಂದ ಸ್ನಾನ ಮಾಡಿ, ಹೊಸ್ತಿಲು ಪೂಜಿಸಿ ಹೊಸ ವಸ್ತ್ರ ಧರಿಸಿ ಸಿಹಿ ಹಂಚುವುದು.',
      hi: 'ब्रह्ममुहूर्त में तैल-उबटन स्नान, नवीन वस्त्र धारण एवं घर-घर दीप प्रज्वलन।'
    },
    story: {
      en: 'Lord Krishna with Queen Satyabhama destroyed tyrant Narakasura. Dying Narakasura requested that this day be celebrated with joy and illuminating lamps rather than sorrow.',
      kn: 'ಶ್ರೀಕೃಷ್ಣ ಮತ್ತು ಸತ್ಯಭಾಮೆಯರು ನರಕಾಸುರನನ್ನು ಸಂಹರಿಸಿ ೧೬,೧೦೦ ಕನ್ಯೆಯರನ್ನು ಸೆರೆಯಿಂದ ಮುಕ್ತಗೊಳಿಸಿದ ಪುಣ್ಯ ದಿನ.',
      hi: 'भगवान श्रीकृष्ण ने नरकासुर का संहार कर धर्म की स्थापना की थी।'
    },
    mantras: [
      {
        en: 'Tailam Chaitte Jagannatha Samastakilbisha Pahrit, Snanam Karomi Devesha Tvam Mam Raksha Janardana',
        kn: 'ತೈಲಂ ಚೈತ್ತೇ ಜಗನ್ನಾಥ ಸಮಸ್ತಕಲ್ಬಿಷ ಪಾಹೃತ್ | ಸ್ನಾನಂ ಕರೋಮಿ ದೇವೇಶ ತ್ವಂ ಮಾಂ ರಕ್ಷ ಜನಾರ್ದನ ||',
        hi: 'तैलं चैत्ते जगन्नाथ समस्तकिल्बिष पाहृत् । स्नानं करोमि देवेश त्वं मां रक्ष जनार्दन ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Perform early morning Abhyanga Snana, offer Arghya to Lord Yama, light 14 oil lamps at twilight.',
        kn: 'ಮುಂಜಾನೆ ಅಭ್ಯಂಗನ ಸ್ನಾನ, ಯಮ ತರ್ಪಣ, ಸಂಜೆ ೧೪ ದೀಪಗಳನ್ನು ಬೆಳಗಿ.',
        hi: 'प्रातः अभ्यंग स्नान एवं सायंकाल १४ दीपक प्रज्वलित करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Fragrant sesame oil & herbal Utane / Sugandhi churnam',
        kn: '೧. ಪರಿಮಳ ಎಳ್ಳೆಣ್ಣೆ ಮತ್ತು ಸುಗಂಧ ಉಟಣೆ ಪುಡಿ',
        hi: '१. तिल का तैल एवं सुगन्धित उबटन'
      },
      {
        en: '2. 14 Clay oil lamps (Diyas)',
        kn: '೨. ೧೪ ಮಣ್ಣಿನ ಹಣತೆಗಳು',
        hi: '२. १४ मिट्टी के दीये'
      },
      {
        en: '3. Camphor, betel leaves, vermilion & flowers',
        kn: '೩. ಕರ್ಪೂರ, ವೀಳ್ಯದೆಲೆ, ಕುಂಕುಮ ಮತ್ತು ಹೂವುಗಳು',
        hi: '३. कर्पूर, पान, रोली व पुष्प'
      }
    ]
  },
  {
    id: 'deepavali',
    name: {
      en: 'Deepavali & Maha Lakshmi Puja (Amavasya)',
      kn: 'ದೀಪಾವಳಿ ಮತ್ತು ಮಹಾಲಕ್ಷ್ಮೀ ಪೂಜೆ (ಅಮಾವಾಸ್ಯೆ)',
      hi: 'दीपावली एवं महालक्ष्मी पूजन (अमावस्या)'
    },
    tagColor: '#f59e0b',
    badgeBg: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30',
    shortDesc: {
      en: 'Grand Festival of Lights on Amavasya: Pradosha-kala Maha Lakshmi and Ganesha Puja, illumination with clay Diyas across every household.',
      kn: 'ಬೆಳಕಿನ ಮಹಾಪರ್ವ: ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಮಹಾಲಕ್ಷ್ಮಿ, ಮಹಾಗಣೇಶ ಹಾಗೂ ಕುಬೇರ ಪೂಜೆ, ಅಖಂಡ ದೀಪಾಲಂಕಾರ.',
      hi: 'प्रकाश का महापर्व: प्रदोष काल में महालक्ष्मी-गणेश-कुबेर पूजन एवं घर-घर दीपमाला।'
    },
    howCelebrated: {
      en: 'Illuminating clay oil lamps (Diyas), Rangoli with flowers and powders, evening Pradosha Lakshmi Puja with lotus, coins, and sweets, sharing festive dishes with relatives.',
      kn: 'ಮನೆಯಂಗಳದಲ್ಲಿ ಮಣ್ಣಿನ ಹಣತೆ ದೀಪಗಳನ್ನು ಬೆಳಗುವುದು, ಬಾಗಿಲಿಗೆ ರಂಗೋಲಿ-ತೋರಣ, ಪ್ರದೋಷದಲ್ಲಿ ಧನಲಕ್ಷ್ಮಿ ಪೂಜೆ, ಕಮಲದ ಹೂವು ಸಮರ್ಪಣೆ.',
      hi: 'मिट्टी के दीये प्रज्वलित करना, कमल पुष्प से लक्ष्मी पूजन, बही-खाता पूजन और मिठाइयाँ बाँटना।'
    },
    story: {
      en: 'On this sacred Amavasya night, Goddess Maha Lakshmi emerged from the churning of Kshirasagara (Cosmic Ocean) and chose Lord Vishnu as Her eternal consort. Also celebrates Sri Rama’s triumphant return to Ayodhya.',
      kn: 'ಕ್ಷೀರಸಾಗರ ಮಂಥನದ ವೇಳೆ ಈ ಅಮಾವಾಸ್ಯೆಯಂದೇ ಮಹಾಲಕ್ಷ್ಮಿಯು ಪ್ರಕಟವಾಗಿ ವಿಷ್ಣುವನ್ನು ವರಿಸಿದಳು. ಶ್ರೀರಾಮನು ಅಯೋಧ್ಯೆಗೆ ಮರಳಿದ ಸಂಭ್ರಮದ ದಿನ.',
      hi: 'समुद्र मन्थन से माता महालक्ष्मी का प्राकट्य तथा प्रभु श्रीराम का १४ वर्ष उपरान्त अयोध्या आगमन।'
    },
    mantras: [
      {
        en: 'Om Shreem Hreem Shreem Kamale Kamalalaye Praseeda Praseeda Shreem Hreem Shreem Om Mahalakshmyai Namah',
        kn: 'ಓಂ ಶ್ರೀಂ ಹ್ರೀಂ ಶ್ರೀಂ ಕಮಲೇ ಕಮಲಾಲಯೇ ಪ್ರಸೀದ ಪ್ರಸೀದ ಶ್ರೀಂ ಹ್ರೀಂ ಶ್ರೀಂ ಓಂ ಮಹಾಲಕ್ಷ್ಮ್ಯೈ ನಮಃ',
        hi: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः'
      }
    ],
    poojaVidhi: [
      {
        en: 'Pradosha Kala Lakshmi Puja: Cleanse home, draw lotus Rangoli, arrange Ashta Lakshmi idols, offer lotus flower, Panchamrita, Kheer, and light 16 ghee lamps.',
        kn: 'ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಮಹಾಲಕ್ಷ್ಮಿ ಪೂಜೆ: ಪದ್ಮ ರಂಗೋಲಿ ಹಾಕಿ, ಲಕ್ಷ್ಮಿ-ಗಣೇಶರನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ ಕಮಲದ ಹೂವು, ಪಂಚಾಮೃತ ಹಾಗೂ ಪಾಯಸ ನೈವೇದ್ಯ ಮಾಡಿ ೧೬ ತುಪ್ಪದ ದೀಪಗಳನ್ನು ಬೆಳಗಿಸಿ.',
        hi: 'प्रदोष काल में महालक्ष्मी पूजन: घर को दीपों से सजाकर कमल पुष्प, खीर, धूप-दीप व शंखनाद से श्रीसूक्त पाठ करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Lakshmi & Ganesha Idols / Photo (ಲಕ್ಷ್ಮಿ-ಗಣಪತಿ ಮೂರ್ತಿ)',
        kn: '೧. ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ, ಮಹಾಗಣಪತಿ ಮತ್ತು ಕುಬೇರ ಮೂರ್ತಿ ಅಥವಾ ಫೋಟೋ',
        hi: '१. श्री महालक्ष्मी, गणेश एवं कुबेर की पावन प्रतिमा'
      },
      {
        en: '2. Pink Lotus & Red Flowers (ಕಮಲದ ಹೂವು ಮತ್ತು ಪುಷ್ಪಗಳು)',
        kn: '೨. ದೇವಿಗೆ ಪ್ರಿಯವಾದ ಗುಲಾಬಿ ಕಮಲದ ಹೂವು, ಸೇವಂತಿಗೆ, ದಾಸವಾಳ, ಕನಕಾಂಬರ',
        hi: '२. कमल के ताजे पुष्प, लाल गुलाब एवं गेंदे की माला'
      },
      {
        en: '3. 16/21 Clay Diyas, pure cow ghee and cotton wicks',
        kn: '೩. ೧೬ ಅಥವಾ ೨೧ ಮಣ್ಣಿನ ಹಣತೆಗಳು, ಹಸುವಿನ ತುಪ್ಪ ಮತ್ತು ಹತ್ತಿ ಬತ್ತಿಗಳು',
        hi: '३. १६ या २१ मिट्टी के दीये, शुद्ध गाय का घी व लंबी रुई बत्तियाँ'
      },
      {
        en: '4. Silver / Gold Coins and Gomati Chakra (ನಾಣ್ಯಗಳು ಮತ್ತು ಗೋಮತಿ ಚಕ್ರ)',
        kn: '೪. ಪೂಜೆಗೆ ಚಿನ್ನ/ಬೆಳ್ಳಿ ನಾಣ್ಯಗಳು, ಗೋಮತಿ ಚಕ್ರ, ಕವಡೆಗಳು',
        hi: '४. चांदी/सोने के सिक्के, गोमती चक्र एवं पीली कौड़ियाँ'
      },
      {
        en: '5. Haldi, Kumkuma, Chandana, Akshata, Camphor & Dhoop',
        kn: '೫. ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಅಕ್ಷತೆ, ಕರ್ಪೂರ ಮತ್ತು ಸಾಂಬ್ರಾಣಿ ಧೂಪ',
        hi: '५. रोली, कुमकुम, चन्दन, अक्षत, कर्पूर एवं धूप'
      },
      {
        en: '6. Naivedya: Kheer, Puffed rice (Pori/Avalakki), Batasha, Sweets & Fruits',
        kn: '೬. ನೈವೇದ್ಯ: ಪಾಯಸ, ಅರಳು, ಬೆಲ್ಲದ ಬತ್ತಾಸು, ಲಡ್ಡು, ಬಾಳೆಹಣ್ಣು, ದಾಳಿಂಬೆ, ತೆಂಗಿನಕಾಯಿ',
        hi: '६. नैवेद्य: खीर, खील-बताशे, मोदक, ऋतुफल एवं पंचमेवा'
      }
    ],
    ritualTimings: [
      {
        periodName: {
          en: 'Brahma Muhurta & Alakshmi Nivarana (ಉಷಃಕಾಲ ಸಂಸ್ಕಾರ)',
          kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ (ಅಲಕ್ಷ್ಮೀ ನಿಸ್ಸಾರಣ)',
          hi: 'ब्रह्म मुहूर्त एवं अलक्ष्मी निस्सारण'
        },
        approxTime: '04:30 AM - 05:25 AM',
        significance: {
          en: 'Dispelling poverty, lethargy, and negative vibrations out of the household before sunrise.',
          kn: 'ಮನೆಯಿಂದ ದಾರಿದ್ರ್ಯ, ಜಡತ್ವ ಮತ್ತು ಅಲಕ್ಷ್ಮೀಯನ್ನು ಹೊರದಬ್ಬಿ ಮಂಗಳ ಉಂಟುಮಾಡುವ ಪವಿತ್ರ ಸಮಯ.',
          hi: 'घर से दरिद्रता एवं तामसिक ऊर्जा के निष्कासन की पावन बेला।'
        },
        recommendedRituals: {
          en: 'Sweeping house, sounding bell, taking fragrant bath, and discarding old items to usher in Goddess Lakshmi.',
          kn: 'ಮನೆ ಕಸಗುಡಿಸಿ ಕಹಳೆ/ಘಂಟಾನಾದ ಮೊಳಗಿಸಿ ಸುಗಂಧ ತೈಲಸ್ನಾನ ಮಾಡುವುದು ಮತ್ತು ರಂಗೋಲಿ ರಚಿಸುವುದು.',
          hi: 'घर की शुद्धि, शूर्प-वादन, सुगन्धित स्नान एवं देहरी पर माँ लक्ष्मी के पावन पदचिह्न बनाना।'
        }
      },
      {
        periodName: {
          en: 'Pratah Shodashopachara Ganesha & Kuber Pujan (ಪ್ರಾತಃ ಪೂಜೆ)',
          kn: 'ಪ್ರಾತಃ ಗಣೇಶ & ಕುಬೇರ ಆರಾಧನೆ',
          hi: 'प्रातः गणेश व कुबेर पूजन'
        },
        approxTime: '08:30 AM - 10:30 AM',
        significance: {
          en: 'Morning invocation of Lord Ganesha (remover of obstacles) and Kubera (treasurer of heavens).',
          kn: 'ಕಾರ್ಯಾರಂಭದ ವಿಘ್ನ ನಿವಾರಕ ಗಣೇಶ ಹಾಗೂ ಧನಪಾಲಕ ಯಕ್ಷರಾಜ ಕುಬೇರನ ಆರಾಧನೆ.',
          hi: 'विघ्नहर्ता गणेश एवं धनपति कुबेर का षोडशोपचार प्रातः पूजन।'
        },
        recommendedRituals: {
          en: 'Placing ledgers/account books (Chopda), silver coins, and offering Modaka and Durva grass.',
          kn: 'ಖಾತಾ ಪುಸ್ತಕಗಳು, ಚಿನ್ನ-ಬೆಳ್ಳಿ ನಾಣ್ಯಗಳ ಮೇಲೆ ಸ್ವಸ್ತಿಕ ಬರೆದು ಕುಬೇರ ಯಂತ್ರ ಪೂಜಿಸುವುದು.',
          hi: 'बहीखाता पूजन (चोपड़ा), तिजोरी पूजन एवं कुबेर मन्त्र जप।'
        }
      },
      {
        periodName: {
          en: 'Pradosha Kala Maha Lakshmi Puja (ಪ್ರದೋಷ ಕಾಲ ಮಹಾಪೂಜೆ - ಮುಖ್ಯ ಮುಹೂರ್ತ)',
          kn: 'ಪ್ರದೋಷ ಕಾಲ ಮಹಾಲಕ್ಷ್ಮಿ ಪೂಜೆ (ಮುಖ್ಯ ಕಾಲ)',
          hi: 'प्रदोष काल महालक्ष्मी पूजन (मुख्य मुहूर्त)'
        },
        approxTime: '05:45 PM - 08:15 PM',
        significance: {
          en: 'The prime astrological window commended by all scriptures where Goddess Lakshmi traverses the earth and enters clean, illuminated homes.',
          kn: 'ಶಾಸ್ತ್ರ ಸಮ್ಮತ ಪರಮ ಪ್ರಶಸ್ತ ಮುಹೂರ್ತ; ಜಗನ್ಮಾತೆ ಮಹಾಲಕ್ಷ್ಮಿಯು ಭೂಲೋಕದಲ್ಲಿ ಸಂಚರಿಸಿ ಮನೆಗಳಿಗೆ ಅನುಗ್ರಹಿಸುವ ಕಾಲ.',
          hi: 'शास्त्रोक्त सर्वश्रेष्ठ मुहूर्त; माँ महालक्ष्मी का भूलोक आगमन एवं अष्टलक्ष्मी वरदान।'
        },
        recommendedRituals: {
          en: 'Drawing lotus mandala, installing Ashta Lakshmi idols, offering pink lotus, recitation of Sri Suktam and Kanakadhara Stotram, lighting 16/21 cow ghee diyas, and distributing sweets.',
          kn: 'ಅಷ್ಟದಳ ಕಮಲ ರಂಗೋಲಿ ಹಾಕಿ, ಗುಲಾಬಿ ಕಮಲ ಸಮರ್ಪಿಸಿ, ಶ್ರೀಸೂಕ್ತ-ಕನಕಧಾರಾ ಸ್ತೋತ್ರ ಪಠಣ, ತುಪ್ಪದ ದೀಪಗಳ ಸಾಲು ಹಚ್ಚಿ ಪಾಯಸ-ಅರಳು ನೈವೇದ್ಯ.',
          hi: 'कमल पुष्प अर्पण, श्रीसूक्त व कनकधारा पाठ, १६/२१ घृत दीपक प्रज्वलन एवं खील-बताशा का महाभोग।'
        }
      },
      {
        periodName: {
          en: 'Nishita Kala Tantrik & Mahakali Dhyana (ನಿಶೀಥ ಕಾಲ ಮಹಾಕಾಳಿ ಆರಾಧನೆ)',
          kn: 'ನಿಶೀಥ ಕಾಲ (ಮಹಾಕಾಳಿ & ಮಂತ್ರ ಸಿದ್ಧಿ)',
          hi: 'निशीथ काल (काली पूजन व तन्त्र साधना)'
        },
        approxTime: '11:38 PM - 12:30 AM',
        significance: {
          en: 'Auspicious midnight window for Kali Puja, victory over inner demons, and intense Lakshmi mantra sadhana.',
          kn: 'ಅಂಧಕಾರ ಸಂಹಾರಿಣಿ ಮಹಾಕಾಳಿಯ ಆರಾಧನೆ, ಲಕ್ಷ್ಮಿ ಗಾಯತ್ರಿ ಜಪ ಹಾಗೂ ಮಂತ್ರ ಸಿದ್ಧಿ ಕಾಲ.',
          hi: 'महाकाली प्राकट्य वेला; तन्त्रोक्त साधना एवं कमल गट्टे की माला से ॐ श्रीं ह्रीं श्रीं कमले कमलालये जप।'
        },
        recommendedRituals: {
          en: 'Chanting Kamalagatta mala Lakshmi Beeja mantra 1008 times, offering camphor arati, and maintaining vigil.',
          kn: 'ಕಮಲದ ಬೀಜದ ಮಾಲೆಯಿಂದ ಲಕ್ಷ್ಮಿ ಬೀಜಾಕ್ಷರ ಜಪ, ಕರ್ಪೂರಾರತಿ ಮತ್ತು ಜಾಗರಣೆ.',
          hi: 'कमलगट्टे की माला से कमलनयनी लक्ष्मी जप, कर्पूर आरती एवं रात्रि जागरण।'
        }
      }
    ]
  },
  {
    id: 'bali_padyami',
    name: {
      en: 'Bali Padyami & Govardhan Puja (Kartika Shukla 1)',
      kn: 'ಬಲಿ ಪಾಡ್ಯಮಿ, ಗೋಪೂಜೆ ಮತ್ತು ಗೋವರ್ಧನ ಪೂಜೆ',
      hi: 'बलि प्रतिपदा, गोवर्धन पूजा एवं अन्नकूट'
    },
    tagColor: '#16a34a',
    badgeBg: 'bg-green-500/15 text-green-800 dark:text-green-300 border-green-500/30',
    shortDesc: {
      en: 'Fourth day of Deepavali: Welcome to virtuous King Bali, Go-puja (sacred cow worship), and Govardhan mountain worship.',
      kn: 'ದಾನಶೂರ ಬಲಿ ಚಕ್ರವರ್ತಿಯ ಸ್ವಾಗತ, ಹಸು-ಕರುಗಳಿಗೆ ಪೂಜೆ (ಗೋಪೂಜೆ), ಗೋಧನ ಅಲಂಕಾರ ಮತ್ತು ಗೋವರ್ಧನ ಪೂಜೆ.',
      hi: 'दानवीर राजा बलि का सत्कार, गोमाता पूजन (गोधन) एवं भगवान श्रीकृष्ण की गोवर्धन लीला।'
    },
    howCelebrated: {
      en: 'Worshipping Gomata (cows) with garlands and haldi-kumkum, drawing King Bali in colorful Rangoli, preparing Annakoot feast, and honoring spouses.',
      kn: 'ಹಸುಗಳಿಗೆ ಅರಿಶಿನ-ಕುಂಕುಮ ಹಚ್ಚಿ ಹೂವಿನ ಹಾರ ಹಾಕಿ ಹಣ್ಣು-ಮೇವು ತಿನ್ನಿಸುವುದು, ಮನೆಯ ಮುಂದೆ ಬಲಿ ಚಕ್ರವರ್ತಿಯ ರಂಗೋಲಿ ರಚಿಸಿ ಪೂಜಿಸುವುದು.',
      hi: 'गोमाता का पूजन, अन्नकूट छप्पन भोग एवं राजा बलि की स्मृति में दीपदान।'
    },
    story: {
      en: 'Lord Vamana granted King Bali the boon to visit his beloved subjects on earth once every year on Kartika Shukla Pratipada. Lord Sri Krishna lifted Mount Govardhan on this day to shield Gokula.',
      kn: 'ವಾಮನಾವತಾರದಲ್ಲಿ ಭಗವಂತನು ನೀಡಿದ ವರದಂತೆ ಬಲಿ ಚಕ್ರವರ್ತಿಯು ವರ್ಷಕ್ಕೊಮ್ಮೆ ತನ್ನ ಪ್ರಜೆಗಳನ್ನು ನೋಡಲು ಭೂಮಿಗೆ ಬರುವ ದಿನ.',
      hi: 'वामन भगवान के वरदान से राजा बलि का भूलोक आगमन एवं श्रीकृष्ण द्वारा गोवर्धन पर्वत धारण।'
    },
    mantras: [
      {
        en: 'Baliraja Namastestu Virochana Suta Prabho, Bhavishyendra Surarathe Poojam Charu Grahaname',
        kn: 'ಬಲಿರಾಜ ನಮಸ್ತೇಸ್ತು ವಿರೋಚನ ಸುತ ಪ್ರಭೋ | ಭವಿಷ್ಯೇಂದ್ರ ಸುರಾರಾತೇ ಪೂಜಾಂ ಚಾರು ಗೃಹಾಣಮೇ ||',
        hi: 'बलिराज नमस्तेऽस्तु विरोचनसुत प्रभो । भविष्येन्द्र सुराराते पूजां चारु गृहाण मे ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Feed sacred cows, draw King Bali figure at entrance, light ghee lamps and offer Annakoot naivedya.',
        kn: 'ಗೋವುಗಳಿಗೆ ಪೂಜೆ, ಬಲಿ ಚಕ್ರವರ್ತಿಗೆ ನೈವೇದ್ಯ ಹಾಗೂ ಸಂಜೆ ವಿಶೇಷ ದೀಪ ಬೆಳಗಿ.',
        hi: 'गोमाता को ग्रास देकर अन्नकूट का भोग लगाएँ।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Colorful Rangoli powders & flowers for King Bali drawing',
        kn: '೧. ಬಲಿ ಚಕ್ರವರ್ತಿಯ ಚಿತ್ರ ರಚಿಸಲು ಬಣ್ಣದ ರಂಗೋಲಿ ಪುಡಿ ಮತ್ತು ಪುಷ್ಪಗಳು',
        hi: '१. राजा बलि की आकृति हेतु रंगोली व पुष्प'
      },
      {
        en: '2. Turmeric, kumkuma and flower garlands for cow worship',
        kn: '೨. ಗೋಪೂಜೆಗಾಗಿ ಅರಿಶಿನ, ಕುಂಕುಮ, ಹೂಮಾಲೆ ಮತ್ತು ಬೆಲ್ಲ-ಬಾಳೆಹಣ್ಣು',
        hi: '२. गोमाता के पूजन हेतु रोली, माला एवं गुड़-घास'
      },
      {
        en: '3. Annakoot dishes / diverse sweets & savories',
        kn: '೩. ಅನ್ನಕೂಟ ನೈವೇದ್ಯಕ್ಕೆ ವಿವಿಧ ಭಕ್ಷ್ಯಗಳು',
        hi: '३. अन्नकूट नैवेद्य हेतु विविध पकवान'
      }
    ]
  },
  {
    id: 'yama_dvitiya',
    name: {
      en: 'Yama Dvitiya / Bhratri Dvitiya (Yama Bidigi & Bhai Dooj)',
      kn: 'ಯಮ ದ್ವಿತೀಯಾ / ಭ್ರಾತೃ ದ್ವಿತೀಯಾ (ಯಮ ಬಿದಿಗೆ & ಭಾಯಿದೂಜ್)',
      hi: 'यम द्वितीया / भ्रातृ द्वितीया (भाई दूज)'
    },
    tagColor: '#8b5cf6',
    badgeBg: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30',
    shortDesc: {
      en: 'Fifth sacred day of Deepavali: Celebration of brother-sister bond; Lord Yama dined with sister Yamuna granting freedom from untimely death.',
      kn: 'ದೀಪಾವಳಿಯ ಪವಿತ್ರ ಬಿದಿಗೆ: ಸಹೋದರ-ಸಹೋದರಿಯರ ಪ್ರೇಮದ ದಿನ. ಯಮಧರ್ಮರಾಜನು ತಂಗಿ ಯಮುನೆಯ ಮನೆಯಲ್ಲಿ ಭೋಜನ ಸ್ವೀಕರಿಸಿ ಅಪಮೃತ್ಯು ನಿವಾರಣೆಯ ವರ ನೀಡಿದ ಪವಿತ್ರ ದಿನ.',
      hi: 'भाई-बहन के पवित्र प्रेम का महापर्व; यमराज ने अपनी बहन यमुना के घर भोजन कर अकाल मृत्यु निवारण का वरदान दिया।'
    },
    howCelebrated: {
      en: 'Sisters invite brothers for festive feast, apply auspicious tilak, and pray for longevity; brothers present gifts and seek blessings.',
      kn: 'ತಂಗಿಯರು ಅಣ್ಣ-ತಮ್ಮಂದಿರನ್ನು ಮನೆಗೆ ಕರೆದು ತಿಲಕವಿಟ್ಟು ಆರತಿ ಬೆಳಗಿ ಮೃಷ್ಟಾನ್ನ ಬಡಿಸುವುದು; ಸಹೋದರರು ಉಡುಗೊರೆ ನೀಡಿ ಆಶೀರ್ವಾದ ಪಡೆಯುವುದು.',
      hi: 'बहनें भाइयों को तिलक कर मंगल आरती करती हैं व दीर्घायु की कामना करती हैं; भाई स्नेहपूर्वक उपहार भेंट करते हैं।'
    },
    story: {
      en: 'On Kartika Shukla Dvitiya (Bidigi), Lord Yama visited Devi Yamuna. Blessed by her hospitality, he declared that any brother dining with his sister on this Bidigi shall be freed from fear of premature death.',
      kn: 'ಕಾರ್ತಿಕ ಶುಕ್ಲ ಬಿದಿಗೆಯಂದು ಯಮುನಾ ದೇವಿಯು ಯಮನನ್ನು ಆದರದಿಂದ ಸತ್ಕರಿಸಿದಳು. ಸಂತುಷ್ಟನಾದ ಯಮನು ಈ ದಿನ ಸಹೋದರಿಯ ಕೈಯಿಂದ ಭೋಜನ ಸ್ವೀಕರಿಸುವವರಿಗೆ ಯಮಭಯವಿಲ್ಲ ಎಂದು ವರವಿತ್ತನು.',
      hi: 'कार्तिक शुक्ल द्वितीया को यमराज अपनी बहन यमुना के घर पधारे और प्रसन्न होकर वरदान दिया कि जो भाई आज बहन के हाथ से भोजन करेगा उसे यम भय नहीं होगा।'
    },
    mantras: [
      {
        en: 'Bhratustavanujataham Bhrata Me Shighramagatah, Snehena Poojito Bhaktya Dirghayurastu Sarvada',
        kn: 'ಭ್ರಾತುಸ್ತವಾನುಜಾತಾಹಂ ಭ್ರಾತಾ ಮೇ ಶೀಘ್ರಮಾಗತಃ | ಸ್ನೇಹೇನ ಪೂಜಿತೋ ಭಕ್ತ್ಯಾ ದೀರ್ಘಾಯುರಸ್ತು ಸರ್ವದಾ ||',
        hi: 'भ्रातुस्तवानुजाताहं भ्राता मे शीघ्रमागतः । स्नेहेन पूजितो भक्त्या दीर्घायुरस्तु सर्वदा ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Brothers dine at sister’s home after sacred tilak and arati, followed by prayers to Yamuna and Yama Dharmaraja.',
        kn: 'ಸಹೋದರಿಗೆ ಗೌರವ, ತಿಲಕಧಾರಣೆ, ಆರತಿ ಬೆಳಗುವುದು ಹಾಗೂ ಯಮುನಾ ನದಿ/ಯಮದೇವರಿಗೆ ನಮಸ್ಕಾರ.',
        hi: 'बहन द्वारा भाई का तिलक, आरती एवं यम-यमुना जी का ध्यान।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Kumkuma, Akshata and fresh flower garland for Tilak',
        kn: '೧. ತಿಲಕಕ್ಕಾಗಿ ಕುಂಕುಮ, ಅಕ್ಷತೆ ಮತ್ತು ಹೂಮಾಲೆ',
        hi: '१. तिलक हेतु कुमकुम, अक्षत एवं पुष्प'
      },
      {
        en: '2. Deepa for Arati & festive sweets',
        kn: '೨. ಆರತಿ ತಟ್ಟೆ, ಮಂಗಳಾರತಿ ದೀಪ ಮತ್ತು ಮೃಷ್ಟಾನ್ನ ಸಿಹಿತಿಂಡಿ',
        hi: '२. आरती दीप एवं मिष्ठान्न'
      }
    ]
  },
  {
    id: 'ugadi',
    name: {
      en: 'Ugadi / Gudi Padwa (Vedic New Year)',
      kn: 'ಯುಗಾದಿ ಹಬ್ಬ (ಹೊಸ ವರ್ಷಾರಂಭ)',
      hi: 'युगादि / गुड़ी पड़वा (नव संवत्सर)'
    },
    tagColor: '#10b981',
    badgeBg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    shortDesc: {
      en: 'Commencement of the new Samvatsara; creation of cosmos by Lord Brahma.',
      kn: 'ಹೊಸ ಸಂವತ್ಸರದ ಆರಂಭ ಮತ್ತು ಸೃಷ್ಟಿಯ ಆದಿ ದಿನ; ಬೇವು-ಬೆಲ್ಲ ಸೇವನೆ ಮತ್ತು ಪಂಚಾಂಗ ಶ್ರವಣ.',
      hi: 'चैत्र शुक्ल प्रतिपदा: नव संवत्सर का शुभारम्भ, नीम-गुड़ प्राशन एवं नव पंचांग श्रवण।'
    },
    howCelebrated: {
      en: 'Consuming Bevu-Bella symbolizing joy and sorrow balance, hanging mango torana, and listening to Panchanga Shravana.',
      kn: 'ಸುಖ-ದುಃಖಗಳ ಸಮಾನತೆಯ ಸಂಕೇತವಾಗಿ ಬೇವು-ಬೆಲ್ಲ ಹಂಚಿ ತಿನ್ನುವುದು, ಮಾವಿನ ತೋರಣ ಕಟ್ಟುವುದು, ಪಂಚಾಂಗ ಶ್ರವಣ ಮಾಡುವುದು.',
      hi: 'नीम और गुड़ का प्रसाद ग्रहण करना, आम के पत्तों का तोरण लगाना और वर्ष फल जानने हेतु पंचांग श्रवण करना।'
    },
    story: {
      en: 'Lord Brahma commenced creation of this universe on Chaitra Shukla Pratipada at sunrise.',
      kn: 'ಬ್ರಹ್ಮದೇವನು ಚೈತ್ರ ಶುಕ್ಲ ಪಾಡ್ಯದ ಸೂರ್ಯೋದಯದಂದು ಈ ಸೃಷ್ಟಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿದನೆಂದು ಪುರಾಣಗಳು ತಿಳಿಸುತ್ತವೆ.',
      hi: 'ब्रह्मा जी ने चैत्र शुक्ल प्रतिपदा के सूर्योदय पर इस सृष्टि का सृजन प्रारंभ किया था।'
    },
    mantras: [
      {
        en: 'Shatayur Vajra Dehatvam Sarva Sampat Karodbhavah, Sarvarishta Vinashashcha Nimbakam Dala Bhakshanam',
        kn: 'ಶತಾಯುರ್ ವಜ್ರದೇಹತ್ವಂ ಸರ್ವಸಂಪತ್ ಕರೋದ್ಭವಃ | ಸರ್ವಾರಿಷ್ಟ ವಿನಾಶಶ್ಚ ನಿಂಬಕಂದಲ ಭಕ್ಷಣಂ ||',
        hi: 'शतायुर्वज्रदेहत्वं सर्वसम्पत्करोद्भवः । सर्वारिष्टविनाशश्च निम्बकन्दलभक्षणम् ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Take oil bath, raise victory flag, pray to Sun God, consume Bevu-Bella, and listen to Panchanga.',
        kn: 'ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುನ್ನ ಎದ್ದು ಎಣ್ಣೆಸ್ನಾನ ಮಾಡಿ, ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಬೇವು-ಬೆಲ್ಲ ನೈವೇದ್ಯ ಮಾಡಿ ಕುಟುಂಬದೊಂದಿಗೆ ಪಂಚಾಂಗ ಶ್ರವಣ ನಡೆಸಿ.',
        hi: 'प्रातःकाल अभ्यंग स्नान कर ध्वजारोहण करें, नीम-गुड़ भोग लगाकर परिवार सहित पंचांग श्रवण करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Fresh Neem leaves & tender flowers (ಬೇವು ಎಲೆಗಳು ಮತ್ತು ಹೂವು)',
        kn: '೧. ತಾಜಾ ಬೇವು ಎಲೆ ಮತ್ತು ಹೂವು (ಕಹಿಯ ಪ್ರತೀಕ)',
        hi: '१. ताजी नीम की पत्तियाँ एवं कोपलें'
      },
      {
        en: '2. Pure Organic Jaggery (ಶುದ್ಧ ಸಾವಯವ ಬೆಲ್ಲ)',
        kn: '೨. ಹೊಸ ಬೆಲ್ಲ (ಸಿಹಿಯ ಪ್ರತೀಕ)',
        hi: '२. शुद्ध नया गुड़'
      },
      {
        en: '3. Fresh Mango leaves & floral Torana for entrance (ಮಾವಿನೆಲೆ ತೋರಣ)',
        kn: '೩. ಮನೆಯ ಮುಖ್ಯದ್ವಾರಕ್ಕೆ ಕಟ್ಟಲು ಮಾವಿನೆಲೆ ಮತ್ತು ಸೇವಂತಿಗೆ ಹೂವಿನ ತೋರಣ',
        hi: '३. आम्रपल्लव एवं गेंदे के फूलों का द्वार तोरण'
      },
      {
        en: '4. New Panchanga book for reading (ಹೊಸ ವರ್ಷದ ಪಂಚಾಂಗ ಪುಸ್ತಕ)',
        kn: '೪. ಪೂಜಿಸಿ ಶ್ರವಣ ಮಾಡಲು ಹೊಸ ವರ್ಷದ ಪಂಚಾಂಗ ಪುಸ್ತಕ',
        hi: '೪. नववर्षीय पंचांग ग्रन्थ'
      },
      {
        en: '5. Haldi, Kumkuma, Akshata, Sandalwood paste, Ghee lamps & Camphor',
        kn: '೫. ಅರಿಶಿನ, ಕುಂಕುಮ, ಅಕ್ಷತೆ, ಶ್ರೀಗಂಧ, ತುಪ್ಪದ ದೀಪ ಮತ್ತು ಕರ್ಪೂರ',
        hi: '५. रोली, कुमकुम, अक्षत, चन्दन, घृतदीप एवं कर्पूर'
      },
      {
        en: '6. Sweet Obbattu / Holige & traditional festive feast',
        kn: '೬. ನೈವೇದ್ಯಕ್ಕೆ ಹೋಳಿಗೆ / ಒಬ್ಬಟ್ಟು, ಪಾಯಸ, ಮಾವಿನಕಾಯಿ ಚಿತ್ರಾನ್ನ',
        hi: '೬. पूरनपोली, खीर एवं नैवेद्य सामग्री'
      }
    ]
  },
  {
    id: 'maha_shivaratri',
    name: {
      en: 'Maha Shivaratri',
      kn: 'ಮಹಾ ಶಿವರಾತ್ರಿ',
      hi: 'महा शिवरात्रि'
    },
    tagColor: '#6366f1',
    badgeBg: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30',
    shortDesc: {
      en: 'The Great Night of Lord Shiva: Lingodbhava and cosmic vigilance.',
      kn: 'ಪರಶಿವನ ಲಿಂಗೋದ್ಭವ ಕಾಲ ಹಾಗೂ ಜಾಗರಣೆಯ ಮಹಾ ಪರ್ವ.',
      hi: 'देवाधिदेव महादेव का पावन प्राकट्य पर्व एवं शिव-पार्वती परिणयोत्सव।'
    },
    howCelebrated: {
      en: 'All-night vigil (Jagaran), continuous chanting of Om Namah Shivaya, Maha Rudrabhisheka, and Bilva archana.',
      kn: 'ರಾತ್ರಿಯಿಡೀ ನಿದ್ದೆಗೆಡದೆ ಜಾಗರಣೆ, ೪ ಯಾಮಗಳಲ್ಲೂ ಶಿವಾಭಿಷೇಕ, ಬಿಲ್ವಪತ್ರೆ ಅರ್ಪಣೆ ಮತ್ತು ಓಂ ನಮಃ ಶಿವಾಯ ಜಪ.',
      hi: 'रात्रि जागरण, चारों प्रहर में रुद्राभिषेक, बिल्वपत्र व धतूरा अर्पण एवं पञ्चाक्षर मन्त्र का अखण्ड जाप।'
    },
    story: {
      en: 'Lord Shiva manifested as the infinite Pillar of Fire (Jyotirlinga) and drank Halahala poison to save the cosmos.',
      kn: 'ಬ್ರಹ್ಮ ಮತ್ತು ವಿಷ್ಣುಗಳ ಮುಂದೆ ಈಶ್ವರನು ಅನಂತ ಲಿಂಗರೂಪಿಯಾಗಿ ಪ್ರಕಟವಾದ ರಾತ್ರಿ.',
      hi: 'भगवान शिव का अनादि ज्योतिर्लिंग स्वरूप में प्राकट्य हुआ।'
    },
    mantras: [
      {
        en: 'Om Tryambakam Yajamahe Sugandhim Pushti Vardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Mamritat',
        kn: 'ಓಂ ತ್ರ್ಯಂಬಕಂ ಯಜಾಮಹೇ ಸುಗಂಧಿಂ ಪುಷ್ಟಿವರ್ಧನಂ | ಉರ್ವಾರುಕಮಿವ ಬಂಧನಾನ್ ಮೃತ್ಯೋರ್ಮುಕ್ಷೀಯ ಮಾಮೃತಾತ್ ||',
        hi: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्यgroupोर्मुक्षीय मामृतात् ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Perform 4-Yama Abhisheka with milk, curd, ghee, honey, followed by Bilva Archana.',
        kn: '೪ ಪ್ರಹರಗಳಲ್ಲೂ ಪಂಚಾಮೃತ ಅಭಿಷೇಕ, ೧೦೮ ಬಿಲ್ವಪತ್ರೆಗಳಿಂದ ಶಿವನಾಮಾವಳಿ ಅರ್ಚನೆ ಮಾಡಿ.',
        hi: 'चारों प्रहर में दुग्ध, दधि, घृत, मधु से अभिषेक कर १०८ बेलपत्र अर्पित करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Sacred Shiva Linga & Jaladhari (ಶಿವಲಿಂಗ ಮತ್ತು ಜಲಧಾರೆ ಪಾತ್ರೆ)',
        kn: '೧. ಪಾರ್ವತಿ-ಪರಮೇಶ್ವರ ಅಥವಾ ಪಂಚಲೋಹ/ಸ್ಪಟಿಕ/ಶಿಲಾ ಶಿವಲಿಂಗ',
        hi: '१. पावन शिवलिंग एवं अभिषेक जलाधारी'
      },
      {
        en: '2. Bilva Leaves (108 fresh intact Bel patra - ೧೦೮ ಬಿಲ್ವಪತ್ರೆ)',
        kn: '೨. ಅಖಂಡ ತ್ರಿಪತ್ರ ಉಳ್ಳ ೧೦೮ ತಾಜಾ ಬಿಲ್ವದಳಗಳು',
        hi: '२. १०८ अखण्ड त्रिदल बेलपत्र'
      },
      {
        en: '3. Panchamrita (Cow Milk, Curd, Ghee, Honey, Sugar Cane Juice, Ganga Jal)',
        kn: '೩. ಅಭಿಷೇಕ ದ್ರವ್ಯಗಳು: ಹಸುವಿನ ಹಾಲು, ಮೊಸರು, ತುಪ್ಪ, ಜೇನು, ಕಬ್ಬಿನ ಹಾಲು, ಎಳನೀರು, ಗಂಗಾಜಲ',
        hi: '३. पञ्चामृत (दुग्ध, दधि, घृत, मधु, शर्करा) एवं गंगाजल'
      },
      {
        en: '4. Bhasma / Vibhuti, Sandalwood paste, Akshata',
        kn: '೪. ಶುದ್ಧ ವಿಭೂತಿ, ಶ್ರೀಗಂಧದ ಲೇಪನ ಮತ್ತು ಬಿಳಿ ಅಕ್ಷತೆ',
        hi: '४. भस्म (विभूति), श्वेत चन्दन एवं अक्षत'
      },
      {
        en: '5. Dhatura flower, Dhatura fruit, White Kaner flowers & Shami leaves',
        kn: '೫. ಧತ್ತೂರ ಹೂವು, ಕಾಯಿ, ಬಿಳಿ ಕಣಗಿಲೆ ಮತ್ತು ಶಮಿ ಎಲೆಗಳು',
        hi: '५. धतूरा, मदार, श्वेत कनेर एवं शमीपत्र'
      },
      {
        en: '6. Akhanda Deepa, Camphor, Dhoop, and Rudraksha mala for Japa',
        kn: '೬. ತುಪ್ಪದ ದೀಪ, ಭೀಮಸೇನಿ ಕರ್ಪೂರ, ಧೂಪ ಮತ್ತು ಜಪಕ್ಕೆ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ',
        hi: '६. घृत दीप, कर्पूर, गुग्गुल धूप एवं रुद्राक्ष माला'
      }
    ]
  },
  {
    id: 'ganesha_chaturthi',
    name: {
      en: 'Ganesha Chaturthi',
      kn: 'ಗಣೇಶ ಚತುರ್ಥಿ (ವಿನಾಯಕ ಚವಿಥಿ)',
      hi: 'गणेश चतुर्थी (विनायक चतुर्थी)'
    },
    tagColor: '#ea580c',
    badgeBg: 'bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30',
    shortDesc: {
      en: 'Appearance day of Lord Ganesha, the remover of all obstacles.',
      kn: 'ಸರ್ವ ವಿಘ್ನನಿವಾರಕ, ಬುದ್ಧಿದಾತ ಶ್ರೀ ಗಣಪತಿಯ ಅವತಾರ ಮಹೋತ್ಸವ.',
      hi: 'विघ्नहर्ता भगवान श्री गणेश का जन्मोत्सव।'
    },
    howCelebrated: {
      en: 'Installing eco-friendly clay Ganesha idols, performing 21-patra archana, offering Modakas.',
      kn: 'ಮಣ್ಣಿನ ಗಣೇಶನ ಮೂರ್ತಿ ಪ್ರತಿಷ್ಠಾಪನೆ, ೨೧ ಬಗೆಯ ಪತ್ರೆಗಳಿಂದ ಅರ್ಚನೆ, ಗರಿಕೆಯ ಹಾರ, ಮೋದಕ ಹಾಗೂ ಕಡುಬು ನೈವೇದ್ಯ.',
      hi: 'मिट्टी की गणेश प्रतिमा की प्राण प्रतिष्ठा, २१ मोदक भोग, दूर्वा एवं लाल पुष्प समर्पण।'
    },
    story: {
      en: 'Goddess Parvati created Ganesha from turmeric paste and breathed life into him. Lord Shiva blessed him as Prathama Pujya.',
      kn: 'ಪಾರ್ವತಿ ದೇವಿಯು ಸೃಷ್ಟಿಸಿದ ಬಾಲಕನಿಗೆ ಶಿವನು ಗಜಮುಖ ನೀಡಿ ಸರ್ವಪ್ರಥಮ ಪೂಜಕನಾಗಿ ವರವಿತ್ತನು.',
      hi: 'माता पार्वती द्वारा निर्मित गणेश जी को देवाधिदेव शिव ने गजमुख प्रदान कर अग्रपूज्य होने का वरदान दिया।'
    },
    mantras: [
      {
        en: 'Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada',
        kn: 'ವಕ್ರತುಂಡ ಮಹಾಕಾಯ ಸೂರ್ಯಕೋಟಿ ಸಮಪ್ರಭ | ನಿರ್ವಿಘ್ನಂ ಕುರು ಮೇ ದೇವ ಸರ್ವಕಾರ್ಯೇಷು ಸರ್ವದಾ ||',
        hi: 'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Prana Pratishtha at noon, 21 Durva grass offering, Modaka naivedya, and Aarti.',
        kn: 'ಮಧ್ಯಾಹ್ನ ಪ್ರಾಣ ಪ್ರತಿಷ್ಠಾಪನೆ, ಷೋಡಶೋಪಚಾರ ಪೂಜೆ, ಗರಿಕೆ ಅರ್ಪಣೆ, ೨೧ ಮೋದಕಗಳ ನೈವೇದ್ಯ.',
        hi: 'मध्याह्न काल में षोडशोपचार पूजन कर २१ दूर्वा व मोदक अर्पित करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Eco-friendly Clay Ganesha Idol (ಮಣ್ಣಿನ ಗಣೇಶನ ಮೂರ್ತಿ)',
        kn: '೧. ಬಣ್ಣರಹಿತ ನೈಸರ್ಗಿಕ ಮಣ್ಣಿನ ಗಣೇಶ ಮೂರ್ತಿ',
        hi: '१. पर्यावरण-अनुकूल मिट्टी की गणेश प्रतिमा'
      },
      {
        en: '2. 21 Durva Grass Sprigs & Red Hibiscus (೨೧ ಗರಿಕೆ ಎಸಳುಗಳು ಮತ್ತು ಕೆಂಪು ದಾಸವಾಳ)',
        kn: '೨. ಗಣೇಶನಿಗೆ ಪ್ರಿಯವಾದ ೨೧ ಗರಿಕೆ ಹುಲ್ಲಿನ ಎಸಳು ಮತ್ತು ಕೆಂಪು ದಾಸವಾಳದ ಹೂವು',
        hi: '२. २१ दूर्वा दल एवं लाल गुड़हल पुष्प'
      },
      {
        en: '3. Ekavimshati Patra (21 Sacred Leaves for Archana - ೨೧ ಬಗೆಯ ಪತ್ರೆಗಳು)',
        kn: '೩. ೨೧ ಬಗೆಯ ಪವಿತ್ರ ಪತ್ರೆಗಳು (ತುಳಸಿ ಹೊರತುಪಡಿಸಿ: ಬಿಲ್ವ, ಶಮಿ, ಜಾಜಿ, ಮಾವು, ದವನ, ಮಲ್ಲಿಗೆ ಇತ್ಯಾದಿ)',
        hi: '३. २१ प्रकार के पावन पत्र (शमी, भृंगराज, बिल्व, जामुन, कनेर आदि)'
      },
      {
        en: '4. 21 Steamed Modakas, Kadubu, Laddus & Panchakajjaya (ಮೋದಕ-ಕಡುಬು ನೈವೇದ್ಯ)',
        kn: '೪. ೨೧ ಮೋದಕಗಳು, ಕಡುಬು, ಮೋದಕ-ಲಡ್ಡು, ಪಂಚಕಜ್ಜಾಯ ಮತ್ತು ಅವಲಕ್ಕಿ-ಬೆಲ್ಲ',
        hi: '४. २१ उकडीचे मोदक, बेसन के लड्डू एवं पंचमेवा'
      },
      {
        en: '5. Haldi, Kumkuma, Sandalwood paste, Sacred thread (Janivara), Vastram',
        kn: '೫. ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಜನಿವಾರ ಮತ್ತು ಕೆಂಪು/ಹಳದಿ ವಸ್ತ್ರ',
        hi: '೫. रोली, कुमकुम, चन्दन, यज्ञोपवीत (जनेऊ) एवं वस्त्र'
      },
      {
        en: '6. Coconut, 5 types of seasonal fruits, Betel leaves and Supari',
        kn: '೬. ತೆಂಗಿನಕಾಯಿ, ೫ ಬಗೆಯ ಹಣ್ಣುಗಳು, ವೀಳ್ಯದೆಲೆ, ಅಡಿಕೆ ಮತ್ತು ನಾಣ್ಯ',
        hi: '೬. श्रीफल, पंचफल, पान-सुपारी एवं दक्षिणा'
      }
    ]
  },
  {
    id: 'krishna_janmashtami',
    name: {
      en: 'Sri Krishna Janmashtami',
      kn: 'ಶ್ರೀ ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ (ಗೋಕುಲಾಷ್ಟಮಿ)',
      hi: 'श्री कृष्ण जन्माष्टमी'
    },
    tagColor: '#0284c7',
    badgeBg: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30',
    shortDesc: {
      en: 'Midnight descent of Supreme Bhagavan Sri Krishna in Mathura.',
      kn: 'ರೋಹಿಣಿ ನಕ್ಷತ್ರದ ಶ್ರಾವಣ ಕೃಷ್ಣಾಷ್ಟಮಿಯ ಮಧ್ಯರಾತ್ರಿ ಶ್ರೀಕೃಷ್ಣನ ಅವತಾರ.',
      hi: 'ಭಾದ್ರಪದ ಕೃಷ್ಣ ಅಷ್ಟಮಿಯ ಮಧ್ಯರಾತ್ರಿ ಶ್ರೀಕೃಷ್ಣನ ಅವತಾರ.'
    },
    howCelebrated: {
      en: 'Fasting until midnight, baby footprints drawing, cradle rocking, and Makhan naivedya.',
      kn: 'ಮಧ್ಯರಾತ್ರಿಯವರೆಗೆ ಉಪವಾಸ, ಪುಟ್ಟ ಹೆಜ್ಜೆಗಳನ್ನು ಬಿಡಿಸುವುದು, ತೊಟ್ಟಿಲು ಪೂಜೆ, ಬೆಣ್ಣೆ ನೈವೇದ್ಯ.',
      hi: 'मध्यरात्रि तक उपवास, घर में बाल-पगचिह्न बनाना, झूला झुलाना एवं माखन-मिश्री भोग।'
    },
    story: {
      en: 'To restore righteousness and vanquish Kamsa, Sri Krishna was born to Devaki and Vasudeva.',
      kn: 'ಕಂಸನ ದುಷ್ಟ ಆಡಳಿತವನ್ನು ಅಂತ್ಯಗೊಳಿಸಿ ಧರ್ಮೋದ್ಧಾರ ಮಾಡಲು ಕೃಷ್ಣಾವತಾರವಾಯಿತು.',
      hi: 'कंस के अत्याचारों से मुक्ति और धर्म की स्थापना हेतु प्रभु का अवतार हुआ।'
    },
    mantras: [
      {
        en: 'Om Namo Bhagavate Vasudevaya',
        kn: 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ',
        hi: 'ॐ नमो भगवते वासुदेवाय'
      }
    ],
    poojaVidhi: [
      {
        en: 'Abhisheka at 12:00 midnight with milk, offering butter and singing bhajans.',
        kn: 'ಮಧ್ಯರಾತ್ರಿ ೧೨ ಗಂಟೆಗೆ ಪಂಚಾಮೃತ ಅಭಿಷೇಕ, ತೊಟ್ಟಿಲು ಪೂಜೆ, ಬೆಣ್ಣೆ ನೈವೇದ್ಯ.',
        hi: 'मध्यरात्रि १२ बजे पञ्चामृत स्नान, झूला पूजन, माखन-मिश्री भोग लगाएँ।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Laddu Gopal / Balakrishna idol and decorated cradle (ತೊಟ್ಟಿಲು ಮತ್ತು ಬಾಲಕೃಷ್ಣ)',
        kn: '೧. ಬಾಲಕೃಷ್ಣನ ಮೂರ್ತಿ ಮತ್ತು ಸುಂದರವಾದ ತೊಟ್ಟಿಲು (ಜೋಕಾಲಿ)',
        hi: '१. लड्डू गोपाल प्रतिमा एवं सुसज्जित झूला'
      },
      {
        en: '2. Fresh White Butter (Makhan) & Mishri / Rock sugar (ಬೆಣ್ಣೆ ಮತ್ತು ಕಲ್ಲುಸಕ್ಕರೆ)',
        kn: '೨. ಮನೆಯಲ್ಲೇ ಕಡೆದ ತಾಜಾ ಬೆಣ್ಣೆ, ಕಲ್ಲುಸಕ್ಕರೆ ಮತ್ತು ಜೇನುತುಪ್ಪ',
        hi: '२. ताजा मक्खन (माखन) एवं मिश्री'
      },
      {
        en: '3. Tulasi Leaves (Manjari) and fresh flowers (ತುಳಸಿ ದಳಗಳು)',
        kn: '೩. ಶ್ರೀಕೃಷ್ಣನಿಗೆ ಅತ್ಯಂತ ಪ್ರಿಯವಾದ ಮಂಜರಿ ಸಹಿತ ತುಳಸಿ ದಳಗಳು ಮತ್ತು ಹೂಗಳು',
        hi: '३. तुलसीदल एवं मंजरी, वैजयंती माला'
      },
      {
        en: '4. Panchamrita (Milk, Curd, Ghee, Honey, Ganga Jal) and conch for Abhisheka',
        kn: '೪. ಪಂಚಾಮೃತ ಮತ್ತು ಅಭಿಷೇಕಕ್ಕೆ ಶಂಖ (ದಕ್ಷಿಣಾವರ್ತ ಶಂಖ)',
        hi: '೪. पञ्चामृत एवं शंखाभिषेक पात्र'
      },
      {
        en: '5. Yellow silk attire (Pitambara), Peacock feather (Mayura pinchha), Flute',
        kn: '೫. ಪೀತಾಂಬರ, ನವಿಲುಗರಿ, ಪುಟ್ಟ ಕೊಳಲು (ವೇಣು) ಮತ್ತು ಕಿರೀಟ',
        hi: '५. पीताम्बर, मयूरपंख, नन्हीं बाँसुरी एवं मुकुट'
      },
      {
        en: '6. Poha (Avalakki), Chakli, Laddus, Seedai & fruit naivedya',
        kn: '೬. ಅವಲಕ್ಕಿ ಪ್ರಸಾದ, ಚಕ್ಕುಲಿ, ಕೋಡುಬಳೆ, ಲಡ್ಡು ಮತ್ತು ಹಣ್ಣುಗಳು',
        hi: '೬. धनिया पंजीरी, पोहा, माखन पेड़ा एवं ऋतुफल'
      }
    ]
  },
  {
    id: 'makar_sankranti',
    name: {
      en: 'Makar Sankranti / Pongal / Uttarayana',
      kn: 'ಮಕರ ಸಂಕ್ರಾಂತಿ / ಪೊಂಗಲ್ (ಉತ್ತರಾಯಣ ಪುಣ್ಯಕಾಲ)',
      hi: 'मकर संक्रांति / पोंगल (उत्तरायण)'
    },
    tagColor: '#eab308',
    badgeBg: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30',
    shortDesc: {
      en: 'Sun enters Capricorn (Makara Rashi) commencing auspicious Uttarayana.',
      kn: 'ಸೂರ್ಯನು ಮಕರ ರಾಶಿಯನ್ನು ಪ್ರವೇಶಿಸಿ ಉತ್ತರಾಯಣ ಪುಣ್ಯಕಾಲ ಆರಂಭವಾಗುವ ಪರ್ವದಿನ; ಎಳ್ಳು-ಬೆಲ್ಲ ಹಂಚುವ ಹಬ್ಬ.',
      hi: 'सूर्य का मकर राशि में प्रवेश एवं उत्तरायण का पावन आरम्भ।'
    },
    howCelebrated: {
      en: 'Exchanging Ellu-Bella ("Ellu bella thindu olle mathadi"), flying kites, harvest prayers.',
      kn: '"ಎಳ್ಳು-ಬೆಲ್ಲ ತಿಂದು ಒಳ್ಳೆ ಮಾತಾಡಿ" ಎಂದು ಎಳ್ಳು-ಬೆಲ್ಲ, ಕಬ್ಬು ಹಂಚುವುದು, ಕಿಚ್ಚು ಹಾಯಿಸುವುದು.',
      hi: 'तिल-गुड़ के लड्डू, खिचड़ी दान, पवित्र स्नान एवं पतंगबाजी।'
    },
    story: {
      en: 'Surya Bhagavan enters Makara, home of son Shani. Bhishma waited for Uttarayana for salvation.',
      kn: 'ಸೂರ್ಯದೇವನು ಶನಿಯ ಮನೆಯಾದ ಮಕರ ರಾಶಿಗೆ ಪ್ರವೇಶಿಸುವ ದಿನ. ಭೀಷ್ಮರು ಮುಕ್ತಿ ಪಡೆದ ಪುಣ್ಯಕಾಲ.',
      hi: 'सूर्यदेव अपने पुत्र शनि की राशि में प्रवेश करते हैं। भीष्म ने इसी काल में देहत्याग किया था।'
    },
    mantras: [
      {
        en: 'Om Suryaya Namah, Om Adityaya Namah',
        kn: 'ಓಂ ಸೂರ್ಯಾಯ ನಮಃ | ಓಂ ಆದಿತ್ಯಾಯ ನಮಃ ||',
        hi: 'ॐ सूर्याय नमः । ॐ आदित्याय नमः ॥'
      }
    ],
    poojaVidhi: [
      {
        en: 'Surya Arghya at dawn with copper vessel and distribute sesame sweets.',
        kn: 'ಬೆಳಗಿನ ಜಾವ ಸೂರ್ಯನಿಗೆ ಅರ್ಘ್ಯ ಸಮರ್ಪಿಸಿ, ಎಳ್ಳು ಬೆಲ್ಲ ನೈವೇದ್ಯ ಮಾಡಿ ಹಂಚಿರಿ.',
        hi: 'प्रातः सूर्य को जल अर्घ्य दें एवं तिल-खिचड़ी का दान करें।'
      }
    ],
    poojaSamagri: [
      {
        en: '1. Traditional Ellu-Bella mixture: White sesame, jaggery, coconut, roasted gram, peanuts (ಎಳ್ಳು-ಬೆಲ್ಲ)',
        kn: '೧. ಸಾಂಪ್ರದಾಯಿಕ ಎಳ್ಳು-ಬೆಲ್ಲ: ಬಿಳಿ ಎಳ್ಳು, ಬೆಲ್ಲ, ಹುರಿಗಡಲೆ, ಕೊಬ್ಬರಿ, ಶೇಂಗಾ ಮತ್ತು ಸಕ್ಕರೆ ಅಚ್ಚು',
        hi: '१. तिल-गुड़ के लड्डू एवं रेवड़ी'
      },
      {
        en: '2. Sugar cane pieces (ಕಬ್ಬಿನ ಜಲ್ಲೆ ತುಂಡುಗಳು)',
        kn: '೨. ಕಬ್ಬಿನ ಜಲ್ಲೆ, ಬಾಳೆಹಣ್ಣು ಮತ್ತು ಎಲಚಿ ಹಣ್ಣು (ಬೋರೆಹಣ್ಣು)',
        hi: '२. गन्ने के टुकड़े एवं ऋतुफल'
      },
      {
        en: '3. Copper vessel for Surya Arghya with water, red flowers, and Kumkum',
        kn: '೩. ಸೂರ್ಯನಿಗೆ ತರ್ಪಣ/ಅರ್ಘ್ಯ ನೀಡಲು ತಾಮ್ರದ ಕಲಶ, ಕೆಂಪು ಹೂವು ಮತ್ತು ಅಕ್ಷತೆ',
        hi: '३. सूर्य अर्घ्य हेतु तांबे का लोटा, लाल पुष्प व रोली'
      },
      {
        en: '4. Pongal ingredients: Raw rice, Moong dal, Jaggery, Ghee, Cashews, Cardamom',
        kn: '೪. ಸಿಹಿ ಪೊಂಗಲ್ ಪದಾರ್ಥಗಳು: ಹೊಸ ಅಕ್ಕಿ, ಹೆಸರುಬೇಳೆ, ಬೆಲ್ಲ, ತುಪ್ಪ, ಗೋಡಂಬಿ, ದ್ರಾಕ್ಷಿ, ಏಲಕ್ಕಿ',
        hi: '೪. खिचड़ी व पोंगल सामग्री (चावल, मूंग दाल, गुड़, घृत)'
      }
    ]
  }
];
