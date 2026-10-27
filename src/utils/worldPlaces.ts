import { CityLocation, LocalizedString } from '../types';

export interface CountryData {
  code: string;
  name: LocalizedString;
  cities: CityLocation[];
}

export const COUNTRIES_AND_CITIES: CountryData[] = [
  {
    code: 'IN',
    name: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
    cities: [
      {
        name: 'Bengaluru',
        nameLocalized: { en: 'Bengaluru', kn: 'ಬೆಂಗಳೂರು', hi: 'बेंगलुरु' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Mysuru',
        nameLocalized: { en: 'Mysuru', kn: 'ಮೈಸೂರು', hi: 'मैसूरु' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 12.2958, lng: 76.6394, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Mangaluru',
        nameLocalized: { en: 'Mangaluru', kn: 'ಮಂಗಳೂರು', hi: 'मंगलुरु' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 12.9141, lng: 74.8560, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Hubballi-Dharwad',
        nameLocalized: { en: 'Hubballi-Dharwad', kn: 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ', hi: 'हुब्बल्ली-धारवाड़' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 15.3647, lng: 75.1240, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Belagavi',
        nameLocalized: { en: 'Belagavi', kn: 'ಬೆಳಗಾವಿ', hi: 'बेलगावी' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 15.8497, lng: 74.4977, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Kalaburagi (Gulbarga)',
        nameLocalized: { en: 'Kalaburagi', kn: 'ಕಲಬುರಗಿ', hi: 'कलबुर्गी' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 17.3297, lng: 76.8343, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Davanagere',
        nameLocalized: { en: 'Davanagere', kn: 'ದಾವಣಗೆರೆ', hi: 'दावणगेरे' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 14.4644, lng: 75.9218, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Shivamogga (Shimoga)',
        nameLocalized: { en: 'Shivamogga', kn: 'ಶಿವಮೊಗ್ಗ', hi: 'शिवमोग्गा' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 13.9299, lng: 75.5681, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Udupi',
        nameLocalized: { en: 'Udupi', kn: 'ಉಡುಪಿ', hi: 'उडुपी' },
        state: 'Karnataka',
        stateLocalized: { en: 'Karnataka', kn: 'ಕರ್ನಾಟಕ', hi: 'कर्नाटक' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 13.3409, lng: 74.7421, timezone: 'Asia/Kolkata'
      },
      {
        name: 'New Delhi',
        nameLocalized: { en: 'New Delhi', kn: 'ನವದೆಹಲಿ', hi: 'नई दिल्ली' },
        state: 'Delhi',
        stateLocalized: { en: 'Delhi', kn: 'ದೆಹಲಿ', hi: 'दिल्ली' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Mumbai',
        nameLocalized: { en: 'Mumbai', kn: 'ಮುಂಬೈ', hi: 'मुंबई' },
        state: 'Maharashtra',
        stateLocalized: { en: 'Maharashtra', kn: 'ಮಹಾರಾಷ್ಟ್ರ', hi: 'महाराष्ट्र' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Chennai',
        nameLocalized: { en: 'Chennai', kn: 'ಚೆನ್ನೈ', hi: 'चेन्नई' },
        state: 'Tamil Nadu',
        stateLocalized: { en: 'Tamil Nadu', kn: 'ತಮಿಳುನಾಡು', hi: 'तमिलनाडु' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Kolkata',
        nameLocalized: { en: 'Kolkata', kn: 'ಕೋಲ್ಕತ್ತಾ', hi: 'कोलकाता' },
        state: 'West Bengal',
        stateLocalized: { en: 'West Bengal', kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', hi: 'पश्चिम बंगाल' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Hyderabad',
        nameLocalized: { en: 'Hyderabad', kn: 'ಹೈದರಾಬಾದ್', hi: 'हैदराबाद' },
        state: 'Telangana',
        stateLocalized: { en: 'Telangana', kn: 'ತೆಲಂಗಾಣ', hi: 'तेलंगाना' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 17.3850, lng: 78.4867, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Pune',
        nameLocalized: { en: 'Pune', kn: 'ಪುಣೆ', hi: 'पुणे' },
        state: 'Maharashtra',
        stateLocalized: { en: 'Maharashtra', kn: 'ಮಹಾರಾಷ್ಟ್ರ', hi: 'महाराष्ट्र' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 18.5204, lng: 73.8567, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Ahmedabad',
        nameLocalized: { en: 'Ahmedabad', kn: 'ಅಹಮದಾಬಾದ್', hi: 'अहमदाबाद' },
        state: 'Gujarat',
        stateLocalized: { en: 'Gujarat', kn: 'ಗುಜರಾತ್', hi: 'गुजरात' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 23.0225, lng: 72.5714, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Varanasi (Kashi)',
        nameLocalized: { en: 'Varanasi', kn: 'ವಾರಾಣಸಿ (ಕಾಶಿ)', hi: 'वाराणसी (काशी)' },
        state: 'Uttar Pradesh',
        stateLocalized: { en: 'Uttar Pradesh', kn: 'ಉತ್ತರ ಪ್ರದೇಶ', hi: 'उत्तर प्रदेश' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 25.3176, lng: 82.9739, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Ayodhya',
        nameLocalized: { en: 'Ayodhya', kn: 'ಅಯೋಧ್ಯೆ', hi: 'अयोध्या' },
        state: 'Uttar Pradesh',
        stateLocalized: { en: 'Uttar Pradesh', kn: 'ಉತ್ತರ ಪ್ರದೇಶ', hi: 'उत्तर प्रदेश' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 26.7922, lng: 82.1998, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Tirupati',
        nameLocalized: { en: 'Tirupati', kn: 'ತಿರುಪತಿ', hi: 'तिरुपति' },
        state: 'Andhra Pradesh',
        stateLocalized: { en: 'Andhra Pradesh', kn: 'ಆಂಧ್ರಪ್ರದೇಶ', hi: 'आंध्र प्रदेश' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 13.6288, lng: 79.4192, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Haridwar',
        nameLocalized: { en: 'Haridwar', kn: 'ಹರಿದ್ವಾರ', hi: 'हरिद्वार' },
        state: 'Uttarakhand',
        stateLocalized: { en: 'Uttarakhand', kn: 'ಉತ್ತರಾಖಂಡ', hi: 'उत्तराखंड' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 29.9457, lng: 78.1642, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Jaipur',
        nameLocalized: { en: 'Jaipur', kn: 'ಜೈಪುರ', hi: 'जयपुर' },
        state: 'Rajasthan',
        stateLocalized: { en: 'Rajasthan', kn: 'ರಾಜಸ್ಥಾನ', hi: 'राजस्थान' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 26.9124, lng: 75.7873, timezone: 'Asia/Kolkata'
      },
      {
        name: 'Thiruvananthapuram',
        nameLocalized: { en: 'Thiruvananthapuram', kn: 'ತಿರುವನಂತಪುರಂ', hi: 'तिरुवनंतपुरम' },
        state: 'Kerala',
        stateLocalized: { en: 'Kerala', kn: 'ಕೇರಳ', hi: 'केरल' },
        country: 'India',
        countryLocalized: { en: 'India', kn: 'ಭಾರತ', hi: 'भारत' },
        lat: 8.5241, lng: 76.9366, timezone: 'Asia/Kolkata'
      }
    ]
  },
  {
    code: 'US',
    name: { en: 'United States', kn: 'ಅಮೆರಿಕ', hi: 'संयुक्त राज्य अमेरिका' },
    cities: [
      {
        name: 'New York',
        nameLocalized: { en: 'New York', kn: 'ನ್ಯೂಯಾರ್ಕ್', hi: 'न्यूयॉर्क' },
        state: 'New York',
        country: 'United States',
        lat: 40.7128, lng: -74.0060, timezone: 'America/New_York'
      },
      {
        name: 'San Francisco',
        nameLocalized: { en: 'San Francisco', kn: 'ಸ್ಯಾನ್ ಫ್ರಾನ್ಸಿಸ್ಕೋ', hi: 'सैन फ्रांसिस्को' },
        state: 'California',
        country: 'United States',
        lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles'
      },
      {
        name: 'Chicago',
        nameLocalized: { en: 'Chicago', kn: 'ಚಿಕಾಗೋ', hi: 'शिकागो' },
        state: 'Illinois',
        country: 'United States',
        lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago'
      },
      {
        name: 'Dallas',
        nameLocalized: { en: 'Dallas', kn: 'ಡಲ್ಲಾಸ್', hi: 'डलास' },
        state: 'Texas',
        country: 'United States',
        lat: 32.7767, lng: -96.7970, timezone: 'America/Chicago'
      },
      {
        name: 'Seattle',
        nameLocalized: { en: 'Seattle', kn: 'ಸಿಯಾಟಲ್', hi: 'सिएटल' },
        state: 'Washington',
        country: 'United States',
        lat: 47.6062, lng: -122.3321, timezone: 'America/Los_Angeles'
      }
    ]
  },
  {
    code: 'GB',
    name: { en: 'United Kingdom', kn: 'ಯುನೈಟೆಡ್ ಕಿಂಗ್‌ಡಮ್', hi: 'यूनाइटेड किंगडम' },
    cities: [
      {
        name: 'London',
        nameLocalized: { en: 'London', kn: 'ಲಂಡನ್', hi: 'लंदन' },
        state: 'England',
        country: 'United Kingdom',
        lat: 51.5074, lng: -0.1278, timezone: 'Europe/London'
      },
      {
        name: 'Birmingham',
        nameLocalized: { en: 'Birmingham', kn: 'ಬರ್ಮಿಂಗ್‌ಹ್ಯಾಮ್', hi: 'बर्मिंघम' },
        state: 'England',
        country: 'United Kingdom',
        lat: 52.4862, lng: -1.8904, timezone: 'Europe/London'
      }
    ]
  },
  {
    code: 'CA',
    name: { en: 'Canada', kn: 'ಕೆನಡಾ', hi: 'कनाडा' },
    cities: [
      {
        name: 'Toronto',
        nameLocalized: { en: 'Toronto', kn: 'ಟೊರೊಂಟೊ', hi: 'टोरंटो' },
        state: 'Ontario',
        country: 'Canada',
        lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto'
      },
      {
        name: 'Vancouver',
        nameLocalized: { en: 'Vancouver', kn: 'ವ್ಯಾಂಕೋವರ್', hi: 'वैंकूवर' },
        state: 'British Columbia',
        country: 'Canada',
        lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver'
      }
    ]
  },
  {
    code: 'AU',
    name: { en: 'Australia', kn: 'ಆಸ್ಟ್ರೇಲಿಯಾ', hi: 'ऑस्ट्रेलिया' },
    cities: [
      {
        name: 'Sydney',
        nameLocalized: { en: 'Sydney', kn: 'ಸಿಡ್ನಿ', hi: 'सिडनी' },
        state: 'New South Wales',
        country: 'Australia',
        lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney'
      },
      {
        name: 'Melbourne',
        nameLocalized: { en: 'Melbourne', kn: 'ಮೆಲ್ಬೋರ್ನ್', hi: 'मेलबर्न' },
        state: 'Victoria',
        country: 'Australia',
        lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne'
      }
    ]
  },
  {
    code: 'AE',
    name: { en: 'United Arab Emirates', kn: 'ಯುಎಇ (ದುಬೈ)', hi: 'संयुक्त अरब अमीरात' },
    cities: [
      {
        name: 'Dubai',
        nameLocalized: { en: 'Dubai', kn: 'ದುಬೈ', hi: 'दुबई' },
        state: 'Dubai',
        country: 'United Arab Emirates',
        lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai'
      },
      {
        name: 'Abu Dhabi',
        nameLocalized: { en: 'Abu Dhabi', kn: 'ಅಬುಧಾಬಿ', hi: 'अबू धाबी' },
        state: 'Abu Dhabi',
        country: 'United Arab Emirates',
        lat: 24.4539, lng: 54.3773, timezone: 'Asia/Dubai'
      }
    ]
  },
  {
    code: 'SG',
    name: { en: 'Singapore', kn: 'ಸಿಂಗಾಪುರ', hi: 'सिंगापुर' },
    cities: [
      {
        name: 'Singapore',
        nameLocalized: { en: 'Singapore', kn: 'ಸಿಂಗಾಪುರ', hi: 'सिंगापुर' },
        state: 'Singapore',
        country: 'Singapore',
        lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore'
      }
    ]
  },
  {
    code: 'MY',
    name: { en: 'Malaysia', kn: 'ಮಲೇಷ್ಯಾ', hi: 'मलेशिया' },
    cities: [
      {
        name: 'Kuala Lumpur',
        nameLocalized: { en: 'Kuala Lumpur', kn: 'ಕೌಲಾಲಂಪುರ', hi: 'क्वालालंपुर' },
        state: 'Federal Territory',
        country: 'Malaysia',
        lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur'
      }
    ]
  },
  {
    code: 'NP',
    name: { en: 'Nepal', kn: 'ನೇಪಾಳ', hi: 'नेपाल' },
    cities: [
      {
        name: 'Kathmandu',
        nameLocalized: { en: 'Kathmandu', kn: 'ಕಠ್ಮಂಡು', hi: 'काठमांडू' },
        state: 'Bagmati',
        country: 'Nepal',
        lat: 27.7172, lng: 85.3240, timezone: 'Asia/Kathmandu'
      }
    ]
  },
  {
    code: 'LK',
    name: { en: 'Sri Lanka', kn: 'ಶ್ರೀಲಂಕಾ', hi: 'श्रीलंका' },
    cities: [
      {
        name: 'Colombo',
        nameLocalized: { en: 'Colombo', kn: 'ಕೊಲಂಬೊ', hi: 'कोलंबो' },
        state: 'Western',
        country: 'Sri Lanka',
        lat: 6.9271, lng: 79.8612, timezone: 'Asia/Colombo'
      }
    ]
  },
  {
    code: 'DE',
    name: { en: 'Germany', kn: 'ಜರ್ಮನಿ', hi: 'जर्मनी' },
    cities: [
      {
        name: 'Frankfurt',
        nameLocalized: { en: 'Frankfurt', kn: 'ಫ್ರಾಂಕ್‌ಫರ್ಟ್', hi: 'फ्रैंकफर्ट' },
        state: 'Hesse',
        country: 'Germany',
        lat: 50.1109, lng: 8.6821, timezone: 'Europe/Berlin'
      }
    ]
  }
];

/**
 * Finds the closest city to a given latitude and longitude
 */
export function findClosestCity(lat: number, lng: number): CityLocation {
  let minDistance = Infinity;
  let bestMatch: CityLocation = COUNTRIES_AND_CITIES[0].cities[0];

  for (const country of COUNTRIES_AND_CITIES) {
    for (const city of country.cities) {
      const dLat = (city.lat - lat);
      const dLng = (city.lng - lng);
      const dist = dLat * dLat + dLng * dLng;
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = city;
      }
    }
  }

  return bestMatch;
}
