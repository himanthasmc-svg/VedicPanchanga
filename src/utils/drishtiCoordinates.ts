import { KundaliData } from '../types';

export interface HouseCoord {
  x: number;
  y: number;
}

export const NORTH_INDIAN_HOUSE_CENTERS: Record<number, HouseCoord> = {
  1: { x: 250, y: 125 },
  2: { x: 125, y: 62.5 },
  3: { x: 62.5, y: 125 },
  4: { x: 125, y: 250 },
  5: { x: 62.5, y: 375 },
  6: { x: 125, y: 437.5 },
  7: { x: 250, y: 375 },
  8: { x: 375, y: 437.5 },
  9: { x: 437.5, y: 375 },
  10: { x: 375, y: 250 },
  11: { x: 437.5, y: 125 },
  12: { x: 375, y: 62.5 }
};

export const SOUTH_INDIAN_RASHI_CENTERS: Record<number, HouseCoord> = {
  0: { x: 187.5, y: 62.5 },   // Aries (Mesha)
  1: { x: 312.5, y: 62.5 },   // Taurus (Vrishabha)
  2: { x: 437.5, y: 62.5 },   // Gemini (Mithuna)
  3: { x: 437.5, y: 187.5 },  // Cancer (Karka)
  4: { x: 437.5, y: 312.5 },  // Leo (Simha)
  5: { x: 437.5, y: 437.5 },  // Virgo (Kanya)
  6: { x: 312.5, y: 437.5 },  // Libra (Tula)
  7: { x: 187.5, y: 437.5 },  // Scorpio (Vrishchika)
  8: { x: 62.5, y: 437.5 },   // Sagittarius (Dhanu)
  9: { x: 62.5, y: 312.5 },   // Capricorn (Makara)
  10: { x: 62.5, y: 187.5 },  // Aquarius (Kumbha)
  11: { x: 62.5, y: 62.5 }    // Pisces (Meena)
};

export function getHouseCoord(chartStyle: 'north' | 'south', bhava: number, kundaliData: KundaliData): HouseCoord {
  if (chartStyle === 'north') {
    return NORTH_INDIAN_HOUSE_CENTERS[bhava] || { x: 250, y: 250 };
  }
  const houseObj = kundaliData.houses.find(h => h.bhava === bhava);
  const rashiIdx = houseObj ? houseObj.rashiIndex : (bhava - 1) % 12;
  return SOUTH_INDIAN_RASHI_CENTERS[rashiIdx] || { x: 250, y: 250 };
}
