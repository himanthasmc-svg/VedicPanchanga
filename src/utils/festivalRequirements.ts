import { LocalizedString, RitualTimingItem } from '../types';

export const UNIVERSAL_FESTIVAL_SAMAGRI: Record<string, LocalizedString[]> = {
  navaratri_kalash_sthapana: [
    {
      en: '1. Kalasha: Pure copper, silver, or brass sacred pot (ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶ ಪಾತ್ರೆ)',
      kn: '೧. ಕಲಶ ಪಾತ್ರೆ: ಶುದ್ಧ ತಾಮ್ರ, ಹಿತ್ತಾಳೆ ಅಥವಾ ಬೆಳ್ಳಿಯ ಕಲಶ',
      hi: '१. कलश पात्र: तांबा, पीतल अथवा चांदी का पवित्र कलಶ'
    },
    {
      en: '2. Sacred Water: Pure Ganga Jal / fresh fragrant water with cardamom & clove (ತೀರ್ಥೋದಕ)',
      kn: '೨. ತೀರ್ಥೋದಕ: ಗಂಗಾಜಲ ಅಥವಾ ಶುದ್ಧ ನೀರು (ಸುಗಂಧ ಪರಿಮಳ ದ್ರವ್ಯ, ಏಲಕ್ಕಿ, ಲವಂಗ ಬೆರೆಸಿದ ನೀರು)',
      hi: '२. पवित्र जल: गंगाजल अथवा शुद्ध जल (इलायची, लौंग युक्त)'
    },
    {
      en: '3. Fresh Coconut: Whole unbroken coconut with intact husk & tuft (ಕುಡಿ ಇರುವ ಪೂರ್ಣ ತೆಂಗಿನಕಾಯಿ)',
      kn: '೩. ತೆಂಗಿನಕಾಯಿ: ಶಾಖೆ/ಕುಡಿ ಇರುವ ಅಖಂಡ ಶ್ರೀಫಲ',
      hi: '३. नारियल: जटा व शिखा युक्त पूर्ण श्रीफल'
    },
    {
      en: '4. Mango / Betel Leaves: 5 to 7 fresh mango leaves for Kalasha mouth (೫-೭ ಮಾವಿನೆಲೆಗಳು / ವೀಳ್ಯದೆಲೆಗಳು)',
      kn: '೪. ಮಾವಿನೆಲೆಗಳು: ೫ ಅಥವಾ ೭ ತಾಜಾ ಮಾವಿನ ಚಿಗುರೆಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳು',
      hi: '४. आम्रपल्लव: ५ या ७ ताजे आम के पत्ते अथवा पान के पत्ते'
    },
    {
      en: '5. Navadhanya (9 Sacred Grains): Wheat, Rice, Tuvar, Moong, Chana, Urad, Sesame, Horsegram, Rajma (ನವಧಾನ್ಯಗಳು)',
      kn: '೫. ನವಧಾನ್ಯಗಳು: ಗೋಧಿ, ಭತ್ತ/ಅಕ್ಕಿ, ತೊಗರಿ, ಹೆಸರು, ಕಡಲೆ, ಉದ್ದು, ಎಳ್ಳು, ಹುರುಳಿ, ಅವರೆ',
      hi: '५. नवधान्य: जौ, गेहूँ, धान, मूँग, चना, उड़द, तिल, कुलथी, मसूर'
    },
    {
      en: '6. Soil & Earthen Tray: Clay plate / wide earthen tray for sowing Navadhanya (ನವಧಾನ್ಯ ಬಿತ್ತಲು ಮಣ್ಣಿನ ತಟ್ಟೆ / ಪೀಠ)',
      kn: '೬. ಸಪ್ತಮೃತ್ತಿಕಾ ಹಾಗೂ ಮಣ್ಣಿನ ತಟ್ಟೆ: ನವಧಾನ್ಯಗಳನ್ನು ಬಿತ್ತಿ ಮೊಳಕೆ ತರಿಸಲು ಶುದ್ಧ ಮಣ್ಣು ಮತ್ತು ತಟ್ಟೆ',
      hi: '६. सप्तमृत्तिका एवं वेदी: नवधान्य बोने हेतु शुद्ध मिट्टी एवं कलश वेदी'
    },
    {
      en: '7. Red Silk Cloth: Red cloth / vastram / chunari to wrap around Kalasha and coconut (ಕೆಂಪು ರೇಷ್ಮೆ ಕಣ / ವಸ್ತ್ರ)',
      kn: '೭. ಕೆಂಪು ರೇಷ್ಮೆ ವಸ್ತ್ರ: ಕಲಶಕ್ಕೆ ಹೊದಿಸಲು ಕೆಂಪು ಕಣ ಹಾಗೂ ತೆಂಗಿನಕಾಯಿಗೆ ಕಟ್ಟಲು ವಸ್ತ್ರ',
      hi: '७. लाल रेशमी वस्त्र / चुनरी: कलश एवं नारियल पर लपेटने हेतु'
    },
    {
      en: '8. Akshata: Sacred raw rice grains mixed with turmeric and cow ghee (ಅಕ್ಷತೆ ಕಾಳುಗಳು)',
      kn: '೮. ಅಕ್ಷತೆ: ಅರಿಶಿನ-ತುಪ್ಪ ಬೆರೆಸಿದ ಮುರಿಯದ ಶುದ್ಧ ಅಕ್ಕಿ ಕಾಳುಗಳು',
      hi: '८. अक्षत: हल्दी मिश्रित अखण्ड चावल'
    },
    {
      en: '9. Haldi, Kumkuma & Chandana: Pure turmeric, vermilion, and sandalwood paste (ಅರಿಶಿನ, ಕುಂಕುಮ ಮತ್ತು ಶ್ರೀಗಂಧ)',
      kn: '೯. ಮಂಗಳ ದ್ರವ್ಯಗಳು: ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಜವ್ರಾದಿ ಪರಿಮಳ ಪುಡಿ',
      hi: '९. मंगल द्रव्य: रोली, कुमकुम, हल्दी, अष्टगन्ध, चन्दन'
    },
    {
      en: '10. Sacred Thread (Moli/Kalawa): Sacred red-yellow cotton protective cord (ಕಂಕಣ ದಾರ / ರಕ್ಷಾಸೂತ್ರ)',
      kn: '೧೦. ಮೌಲಿ / ಕಂಕಣ ಸೂತ್ರ: ಕಲಶದ ಕೊರಳಿಗೆ ಕಟ್ಟಲು ಕೆಂಪು-ಹಳದಿ ದಾರ',
      hi: '१०. रक्षासूत्र (मौली/कलावा): कलश के कण्ठ में बांधने हेतु'
    },
    {
      en: '11. Coins & Betel Nuts: Silver/copper coins and intact Supari inside Kalasha (ನಾಣ್ಯ ಮತ್ತು ಅಡಿಕೆ)',
      kn: '೧೧. ನಾಣ್ಯ ಮತ್ತು ಅಡಿಕೆ: ಕಲಶದೊಳಗೆ ಹಾಕಲು ನಾಣ್ಯಗಳು, ಪೂರ್ಣ ಅಡಿಕೆ ಮತ್ತು ಚಿನ್ನ/ಬೆಳ್ಳಿ ನಾಣ್ಯ',
      hi: '११. द्रव्य एवं सुपारी: कलश के भीतर अर्पण हेतु सिक्के व अखण्ड सुपारी'
    },
    {
      en: '12. Akhanda Deepa & Pure Ghee: Brass/clay lamp and pure cow ghee / sesame oil (ನಂದಾದೀಪ ಮತ್ತು ಹಸುವಿನ ತುಪ್ಪ)',
      kn: '೧೨. ಅಖಂಡ ದೀಪ: ೯ ದಿನ ಬೆಳಗಲು ಹಿತ್ತಾಳೆ/ಮಣ್ಣಿನ ನಂದಾದೀಪ, ಹತ್ತಿಯ ಬತ್ತಿಗಳು ಮತ್ತು ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ',
      hi: '१२. अखण्ड ज्योति: पीतल/मिट्टी का अखण्ड दीपक, रुई की बत्ती एवं शुद्ध गाय का घी'
    },
    {
      en: '13. Fresh Flowers & Garlands: Red hibiscus, lotus, marigold, and fresh fragrant garlands (ಕೆಂಪು ದಾಸವಾಳ, ಕಮಲ ಹಾಗೂ ಹೂಮಾಲೆ)',
      kn: '೧೩. ಪುಷ್ಪಗಳು: ದೇವಿಗೆ ಪ್ರಿಯವಾದ ಕೆಂಪು ದಾಸವಾಳ, ಕಮಲದ ಹೂವು, ಸೇವಂತಿಗೆ, ಮಲ್ಲಿಗೆ, ಗರಿಕೆ ಹಾಗೂ ಹೂಮಾಲೆ',
      hi: '१३. पुष्प एवं माला: लाल गुड़हल (जासवंद), कमल पुष्प, गुलाब, गेंदा एवं ताजी पुष्पमाला'
    },
    {
      en: '14. Incense & Camphor: Dhoopa, Agarbatti, and pure Bhimseni Karpura for Aarti (ಧೂಪ, ಅಗರಬತ್ತಿ ಮತ್ತು ಕರ್ಪೂರ)',
      kn: '೧೪. ಧೂಪ-ದೀಪ-ಕರ್ಪೂರ: ಸಾಂಬ್ರಾಣಿ ಧೂಪ, ಅಗರಬತ್ತಿ, ದೀಪಾರತಿ ಹಾಗೂ ಆರತಿಗೆ ಭೀಮಸೇನಿ ಕರ್ಪೂರ',
      hi: '१४. धूप, अगरबत्ती एवं कर्पूर: आरती हेतु शुद्ध कर्पूर व सुगन्धित धूप'
    },
    {
      en: '15. Panchamrita: Cow Milk, Curd, Cow Ghee, Honey, Rock Sugar / Mishri (ಪಂಚಾಮೃತ)',
      kn: '೧೫. ಪಂಚಾಮೃತ: ಹಸುವಿನ ಹಾಲು, ಮೊಸರು, ತುಪ್ಪ, ಜೇನುತುಪ್ಪ ಮತ್ತು ಕಲ್ಲುಸಕ್ಕರೆ',
      hi: '१५. पञ्चामृत: गाय का दूध, दही, घी, शहद एवं शर्करा (मिश्री)'
    },
    {
      en: '16. Maha Naivedya & Fruits: Bananas, Pomegranate, Dry fruits, Kheer, Betel leaves with Supari (ಮಹಾ ನೈವೇದ್ಯ)',
      kn: '೧೬. ನೈವೇದ್ಯ ಮತ್ತು ಫಲಾವಳಿ: ಬಾಳೆಹಣ್ಣು, ದಾಳಿಂಬೆ, ಪಾಯಸ, ಒಣಹಣ್ಣುಗಳು, ತಾಂಬೂಲ (ವೀಳ್ಯದೆಲೆ-ಅಡಿಕೆ)',
      hi: '१६. नैवेद्य एवं फल: केला, अनार, पंचमेवा, खीर, ऋतुफल एवं ताम्बूल (पान-सुपारी)'
    },
    {
      en: '17. Puja Utensils: Bell (Ghanti), Conch (Shankha), Arghya Patra, Achamana spoon, plate, Asana (ಪೂಜಾ ಪರಿಕರಗಳು)',
      kn: '೧೭. ಪೂಜಾ ಪರಿಕರಗಳು: ಪಂಚಪಾತ್ರೆ-ಉದ್ಧರಣೆ, ಘಂಟೆ, ಶಂಖ, ಅರ್ಘ್ಯ ಪಾತ್ರೆ, ಆರತಿ ತಟ್ಟೆ, ಆಸನ',
      hi: '१७. पूजा उपकरण: आचमनी, पंचपात्र, शंख, घंटी, आरती थाल एवं शुद्ध ऊनी आसन'
    }
  ],

  generic_puja_essentials: [
    {
      en: '1. Deity Idol / Sacred Photo or Yantra (ದೇವತಾ ಮೂರ್ತಿ / ಚಿತ್ರಪಟ)',
      kn: '೧. ದೇವತಾ ಮೂರ್ತಿ ಅಥವಾ ಸುಂದರವಾದ ಪೂಜಾ ಚಿತ್ರಪಟ',
      hi: '१. पावन विग्रह अथवा प्रतिष्ठित चित्रपट'
    },
    {
      en: '2. Ganga Jal & Holy Water Vessel (ಪಂಚಪಾತ್ರೆ-ಉದ್ಧರಣೆ ಮತ್ತು ಗಂಗಾಜಲ)',
      kn: '೨. ಪಂಚಪಾತ್ರೆ, ಉದ್ಧರಣೆ, ಅರ್ಘ್ಯ ಪಾತ್ರೆ ಮತ್ತು ಗಂಗಾಜಲ',
      hi: '२. आचमनी, पंचपात्र एवं शुद्ध गंगाजल'
    },
    {
      en: '3. Pure Cow Ghee / Sesame Oil Lamps & Cotton Wicks (ತುಪ್ಪದ ದೀಪ ಮತ್ತು ಹತ್ತಿ ಬತ್ತಿ)',
      kn: '೩. ಹಿತ್ತಾಳೆ ಅಥವಾ ಮಣ್ಣಿನ ದೀಪಗಳು, ಹಸುವಿನ ತುಪ್ಪ ಮತ್ತು ಹತ್ತಿ ಬತ್ತಿಗಳು',
      hi: '३. घृत दीप, तिल का तेल एवं रुई की बत्तियाँ'
    },
    {
      en: '4. Kumkum, Haldi, Chandana & Akshata (ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಅಕ್ಷತೆ)',
      kn: '೪. ಶುದ್ಧ ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ ಲೇಪನ ಮತ್ತು ಮಂತ್ರಾಕ್ಷತೆ',
      hi: '४. रोली, कुमकुम, हल्दी, चन्दन एवं अक्षत'
    },
    {
      en: '5. Fresh Fragrant Flowers & Basil/Bilva leaves (ತಾಜಾ ಹೂಗಳು ಮತ್ತು ತುಳಸಿ/ಬಿಲ್ವ)',
      kn: '೫. ತಾಜಾ ಪುಷ್ಪಗಳು, ಹೂಮಾಲೆ, ತುಳಸಿ ದಳಗಳು ಅಥವಾ ಬಿಲ್ವಪತ್ರೆ',
      hi: '५. ताजे सुगन्धित पुष्प, माला, तुलसीदल एवं बिल्वपत्र'
    },
    {
      en: '6. Dhoop, Agarbatti & Bhimseni Camphor (ಧೂಪ, ಅಗರಬತ್ತಿ ಮತ್ತು ಕರ್ಪೂರ)',
      kn: '೬. ಸುಗಂಧಿ ಧೂಪ, ಅಗರಬತ್ತಿ ಮತ್ತು ಭೀಮಸೇನಿ ಕರ್ಪೂರ',
      hi: '६. गुग्गुल धूप, अगरबत्ती एवं शुद्ध कर्पूर'
    },
    {
      en: '7. Festive Maha Naivedya, Seasonal Fruits, Coconut & Tambula (ನೈವೇದ್ಯ, ತೆಂಗಿನಕಾಯಿ ಮತ್ತು ತಾಂಬೂಲ)',
      kn: '೭. ಪಾಯಸ/ಸಿಹಿ ನೈವೇದ್ಯ, ೫ ಬಗೆಯ ಹಣ್ಣುಗಳು, ತೆಂಗಿನಕಾಯಿ ಮತ್ತು ವೀಳ್ಯದೆಲೆ-ಅಡಿಕೆ',
      hi: '७. मिष्ठान नैवेद्य, पंचामृत, ऋतुफल, श्रीफल एवं ताम्बूल'
    },
    {
      en: '8. Bell (Ghanti), Conch (Shankha) & Arati Platter (ಘಂಟೆ, ಶಂಖ ಮತ್ತು ಆರತಿ ತಟ್ಟೆ)',
      kn: '೮. ಪೂಜಾ ಘಂಟೆ, ಮಂಗಳ ಶಂಖ ಮತ್ತು ಮಂಗಳಾರತಿ ತಟ್ಟೆ',
      hi: '८. पूजा घण्टी, पावन शंख एवं आरती थाल'
    }
  ]
};

export const UNIVERSAL_FESTIVAL_TIMINGS: Record<string, RitualTimingItem[]> = {
  navaratri_daily: [
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
        kn: 'ಪವಿತ್ರ ಸ್ನಾನ, ಪೂಜಾ ಕೋಣೆಯನ್ನು ಗಂಗಾಜಲದಿಂದ ಶುದ್ಧೀಕರಿಸುವುದು ಹಾಗೂ ನವರಾತ್ರಿ ವ್ರತ ಸಂಕಲ್ಪ.',
        hi: 'पवित्र स्नान, पूजा स्थल का गंगाजल से अभिषेक एवं नवरात्रि व्रत संकल्प ग्रहण।'
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
        en: 'Abhijit Muhurta & Shodashopachara Devi Puja (ಅಭಿಜಿತ್ ಮುಹೂರ್ತ)',
        kn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ & ದೇವೀ ಷೋಡಶೋಪಚಾರ ಪೂಜೆ',
        hi: 'अभिजित मुहूर्त एवं षोडशोपचार पूजन'
      },
      approxTime: '11:45 AM - 12:35 PM',
      significance: {
        en: 'Auspicious midday window ordained by Shastras for invoking Goddess Shakti and reading Chandi Mahatmyam.',
        kn: 'ಶಾಸ್ತ್ರೋಕ್ತ ಕಲಶ ಆರಾಧನೆ, ಷೋಡಶೋಪಚಾರ ಪೂಜೆ ಹಾಗೂ ದೇವಿ ಸಪ್ತಶತಿ ಪಾರಾಯಣಕ್ಕೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತ ಮುಹೂರ್ತ.',
        hi: 'शास्त्र सम्मत कलश पूजन एवं देवी आवाहन हेतु परम श्रेष्ठ शुभ योग।'
      },
      recommendedRituals: {
        en: 'Abhisheka, offering red hibiscus and kumkuma archana, recitation of Devi Mahatmyam chapters, and naivedya.',
        kn: 'ದೇವಿಗೆ ಪಂಚಾಮೃತ ಅಭಿಷೇಕ, ಕುಂಕುಮಾರ್ಚನೆ, ಕೆಂಪು ಹೂಗಳ ಸಮರ್ಪಣೆ ಮತ್ತು ದೇವಿ ಮಾಹಾತ್ಮ್ಯೆ ಪಾರಾಯಣ.',
        hi: 'पञ्चामृत अभिषेक, कुंकुमार्चन, दुर्गा सप्तशती पाठ एवं सात्त्विक भोग समर्पण।'
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

  generic_vedic_festival: [
    {
      periodName: {
        en: 'Brahma Muhurta (ಉಷಃಕಾಲ / ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ)',
        kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ (ಉಷಃಕಾಲ)',
        hi: 'ब्रह्म मुहूर्त (उषःकाल)'
      },
      approxTime: '04:30 AM - 05:20 AM',
      significance: {
        en: 'Divine hour of peace and purity; cosmic doors open for spiritual alignment and vows.',
        kn: 'ದೈವೀ ಪ್ರಶಾಂತತೆ ಮತ್ತು ಪವಿತ್ರತೆಯ ಕಾಲ; ಸಂಕಲ್ಪ ಮತ್ತು ಆಂತರಿಕ ಜಾಗೃತಿಗೆ ಅತ್ಯುತ್ತಮ.',
        hi: 'दैवीय ऊर्जा से युक्त परम पावन समय; शुद्धि एवं संकल्प हेतु सर्वश्रेष्ठ।'
      },
      recommendedRituals: {
        en: 'Pre-dawn bath (Abhyanga snanam where applicable), cleaning altar, drawing rangoli at threshold, and mental invocation.',
        kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತದ ಪವಿತ್ರ ಸ್ನಾನ, ಮನೆ-ಹೊಸ್ತಿಲಿನಲ್ಲಿ ರಂಗೋಲಿ, ಪೂಜಾ ಮಂದಿರ ಅಲಂಕಾರ.',
        hi: 'पवित्र स्नान, देहरी पर रंगोली, मन्दिर सज्जा एवं इष्टदेव ध्यान।'
      }
    },
    {
      periodName: {
        en: 'Pratah Kala Shodashopachara Puja (ಪ್ರಾತಃಕಾಲ ಷೋಡಶೋಪಚಾರ ಪೂಜೆ)',
        kn: 'ಪ್ರಾತಃಕಾಲ ಮುಖ್ಯ ಪೂಜಾ ಮುಹೂರ್ತ',
        hi: 'प्रातःकाल मुख्य षोडशोपचार पूजन'
      },
      approxTime: '07:00 AM - 10:00 AM',
      significance: {
        en: 'Morning period ideal for invoking deities, offering vastra, yajnopavita, flowers, and naivedya.',
        kn: 'ದೇವರಿಗೆ ೧೬ ಉಪಚಾರಗಳಿಂದ ಪೂಜೆ ಸಲ್ಲಿಸಿ ಫಲ-ಪುಷ್ಪ-ನೈವೇದ್ಯ ಸಮರ್ಪಿಸುವ ಮುಖ್ಯ ಕಾಲ.',
        hi: 'आवाहन, पाद्य, अर्घ्य, स्नान, वस्त्र, नैवेद्य आदि षोडशोपचार का मुख्य काल।'
      },
      recommendedRituals: {
        en: 'Lighting deepa, Ganapati puja, Kalasha archana, Stotra chanting, offering festive sweets, and family prayers.',
        kn: 'ದೀಪ ಪ್ರಜ್ವಲನೆ, ಗಣಪತಿ ಪೂಜೆ, ಕಲಶಾರ್ಚನೆ, ಸ್ತೋತ್ರ ಪಠಣ, ಹಬ್ಬದ ಸಿಹಿ ನೈವೇದ್ಯ ಮತ್ತು ಕುಟುಂಬದೊಡನೆ ಪ್ರಾರ್ಥನೆ.',
        hi: 'दीप प्रज्वलन, गणेश पूजन, कलशार्चन, स्तोत्र पाठ एवं मिष्ठान भोग अर्पण।'
      }
    },
    {
      periodName: {
        en: 'Madhyahna / Abhijit Muhurta (ಮಧ್ಯಾಹ್ನ / ಅಭಿಜಿತ್ ಮುಹೂರ್ತ)',
        kn: 'ಮಧ್ಯಾಹ್ನ ಮಹಾ ನೈವೇದ್ಯ ಕಾಲ',
        hi: 'मध्याह्न अभिजित काल एवं महाभोग'
      },
      approxTime: '11:45 AM - 12:45 PM',
      significance: {
        en: 'Victory window ruled by Lord Vishnu that counteracts all planetary blemishes.',
        kn: 'ಸರ್ವ ದೋಷ ನಿವಾರಕವಾದ ಅಭಿಜಿತ್ ಕಾಲ; ಮಹಾನೈವೇದ್ಯ ಮತ್ತು ಪಂಚಾಂಗ ಶ್ರವಣಕ್ಕೆ ಪ್ರಶಸ್ತ.',
        hi: 'भगवान विष्णु का विजय मुहूर्त; महाभोग एवं प्रसाद वितरण हेतु शुभ।'
      },
      recommendedRituals: {
        en: 'Offering Maha Prasada, feeding cows and elders, Panchanga shravana, and consuming consecrated prasad.',
        kn: 'ಮಹಾ ನೈವೇದ್ಯ ಅರ್ಪಿಸಿ, ಗೋವುಗಳಿಗೆ ಆಹಾರ ನೀಡಿ, ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಪಡೆದು ಪ್ರಸಾದ ಸ್ವೀಕಾರ.',
        hi: 'महाप्रसाद भोग, गोमाता को ग्रास, बड़ों का चरण-स्पर्श एवं प्रसाद ग्रहण।'
      }
    },
    {
      periodName: {
        en: 'Sayankala Pradosha Sandhya (ಸಾಯಂಕಾಲ ಪ್ರದೋಷ & ದೀಪಾರಾಧನೆ)',
        kn: 'ಸಾಯಂಕಾಲ ಪ್ರದೋಷ ಕಾಲ & ಮಂಗಳಾರತಿ',
        hi: 'सायंकाल प्रदोष काल एवं दीपदान'
      },
      approxTime: '06:00 PM - 07:30 PM',
      significance: {
        en: 'Twilight convergence dispelling darkness, welcoming Lakshmi and auspicious vibrations.',
        kn: 'ಸಂಧ್ಯಾ ಕಾಲದ ದೀಪಾರಾಧನೆ; ಲಕ್ಷ್ಮಿ ಕೃಪೆ ಮತ್ತು ದುಷ್ಟ ಶಕ್ತಿಗಳ ನಿವಾರಣೆ.',
        hi: 'संध्या दीप प्रज्वलन, लक्ष्मी कृपा एवं पारिवारिक सुख-शांति का काल।'
      },
      recommendedRituals: {
        en: 'Lighting oil/ghee lamps at entrance, Tulasi worship, Karpura arati with bell and conch, and kirtan.',
        kn: 'ತುಳಸಿ ಪೂಜೆ, ಹೊಸ್ತಿಲಿನಲ್ಲಿ ದೀಪಗಳು, ಶಂಖ-ಘಂಟಾನಾದದೊಂದಿಗೆ ಕರ್ಪೂರ ಮಂಗಳಾರತಿ ಮತ್ತು ಸಂಕೀರ್ತನೆ.',
        hi: 'तुलसी पूजन, देहरी पर दीपमाला, शंख-घंटी सहित कर्पूर आरती एवं संकीर्तन।'
      }
    }
  ]
};
