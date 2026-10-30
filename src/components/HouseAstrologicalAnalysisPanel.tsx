import React from 'react';
import { 
  Eye, 
  Sparkles, 
  Heart, 
  Activity, 
  Brain, 
  Salad, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Info,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { KundaliData, Language, PlanetPosition } from '../types';
import { calculateHouseDrishti, HouseDrishtiAnalysis } from '../utils/grahaDrishti';
import { SvgGrahaIcon } from './RealisticGraha';

export interface HouseAstrologicalAnalysisPanelProps {
  currentLang: Language;
  kundaliData: KundaliData;
  selectedBhavaNumber: number;
  onSelectBhava: (bhava: number) => void;
  onSelectPlanet?: (planetName: string) => void;
}

export const HouseAstrologicalAnalysisPanel: React.FC<HouseAstrologicalAnalysisPanelProps> = ({
  currentLang,
  kundaliData,
  selectedBhavaNumber,
  onSelectBhava,
  onSelectPlanet
}) => {
  // Dynamically calculate Parashari Drishti, physical/mental impact, nutrition, and remedies for selected house
  const analysis: HouseDrishtiAnalysis = React.useMemo(() => {
    return calculateHouseDrishti(kundaliData, selectedBhavaNumber);
  }, [kundaliData, selectedBhavaNumber]);

  const BHAVA_TITLES: Record<number, { kn: string; hi: string; en: string }> = {
    1: { kn: '೧ನೇ ಭಾವ: ತನು ಭಾವ (ಲಗ್ನ - ಶರೀರ & ವ್ಯಕ್ತಿತ್ವ)', hi: 'प्रथम भाव: तनु भाव (लग्न - शरीर व व्यक्तित्व)', en: 'House 1: Tanu Bhava (Ascendant - Body & Self)' },
    2: { kn: '೨ನೇ ಭಾವ: ಧನ ಭಾವ (ಕುಟುಂಬ, ವಾಣಿ & ಸಂಪತ್ತು)', hi: 'द्वितीय भाव: धन भाव (परिवार, वाणी व कोष)', en: 'House 2: Dhana Bhava (Wealth, Family & Speech)' },
    3: { kn: '೩ನೇ ಭಾವ: ಭ್ರಾತೃ / ಸಹಜ ಭಾವ (ಸಾಹಸ, ಧೈರ್ಯ & ಕಿರಿಯರು)', hi: 'तृतीय भाव: सहज भाव (पराक्रम, साहस व अनुज)', en: 'House 3: Sahaja Bhava (Courage, Siblings & Effort)' },
    4: { kn: '೪ನೇ ಭಾವ: ಸುಖ / ಮಾತೃ ಭಾವ (ತಾಯಿ, ವಾಹನ, ಆಸ್ತಿ & ಮನಸ್ಸು)', hi: 'चतुर्थ भाव: सुख भाव (माता, गृह, वाहन व मन)', en: 'House 4: Sukha Bhava (Mother, Home, Vehicles & Heart)' },
    5: { kn: '೫ನೇ ಭಾವ: ಪುತ್ರ / ಪೂರ್ವಪುಣ್ಯ ಭಾವ (ಬುದ್ಧಿ, ಸಂತಾನ & ಜ್ಞಾನ)', hi: 'पंचम भाव: सुत भाव (संतान, बुद्धि, ज्ञान व पूर्वपुण्य)', en: 'House 5: Putra Bhava (Intellect, Progeny & Past Merits)' },
    6: { kn: '೬ನೇ ಭಾವ: ಶತ್ರು / ರೋಗ ಭಾವ (ಆರೋಗ್ಯ, ಸಾಲ, ಸ್ಪರ್ಧೆ & ಸೇವೆ)', hi: 'षष्ठ भाव: रिपु भाव (रोग, ऋण, शत्रु व सेवा)', en: 'House 6: Ari Bhava (Health, Debts, Enemies & Service)' },
    7: { kn: '೭ನೇ ಭಾವ: ಕಳತ್ರ / ಜಾಯಾ ಭಾವ (ದಾಂಪತ್ಯ, ಸಂಗಾತಿ & ಪಾಲುದಾರಿಕೆ)', hi: 'सप्तम भाव: जाया भाव (दाम्पत्य, जीवनसाथी व व्यापार)', en: 'House 7: Kalatra Bhava (Spouse, Marriage & Partnerships)' },
    8: { kn: '೮ನೇ ಭಾವ: ಆಯುಷ್ಯ / ರಂಧ್ರ ಭಾವ (ಆಯುಸ್ಸು, ರಹಸ್ಯ, ಪರಿವರ್ತನೆ & ಅಡೆತಡೆ)', hi: 'अष्टम भाव: आयु भाव (दीर्घायु, गूढ़ ज्ञान व परिवर्तन)', en: 'House 8: Ayur Bhava (Longevity, Transformation & Mysteries)' },
    9: { kn: '೯ನೇ ಭಾವ: ಭಾಗ್ಯ / ಧರ್ಮ ಭಾವ (ದೈವಕೃಪೆ, ತಂದೆ, ಗುರು & ಉನ್ನತ ವಿದ್ಯಾ)', hi: 'नवम भाव: भाग्य भाव (धर्म, गुरु, पिता व तीर्थाटन)', en: 'House 9: Bhagya Bhava (Fortune, Dharma, Guru & Higher Truth)' },
    10: { kn: '೧೦ನೇ ಭಾವ: ಕರ್ಮ ಭಾವ (ಉದ್ಯೋಗ, ಅಧಿಕಾರ, ಕೀರ್ತಿ & ಸ್ಥಾನಮಾನ)', hi: 'दशम भाव: कर्म भाव (व्यवसाय, पद, प्रतिष्ठा व शासन)', en: 'House 10: Karma Bhava (Profession, Status, Career & Authority)' },
    11: { kn: '೧೧ನೇ ಭಾವ: ಲಾಭ / ಆಯ ಭಾವ (ಆದಾಯ, ಮಿತ್ರರು, ಆಕಾಂಕ್ಷೆ ಸಿದ್ಧಿ)', hi: 'एकादश भाव: लाभ भाव (आय, मित्र, उपलब्धि व ज्येष्ठ भ्राता)', en: 'House 11: Labha Bhava (Gains, Income, Friends & Desires)' },
    12: { kn: '೧೨ನೇ ಭಾವ: ವ್ಯಯ / ಮೋಕ್ಷ ಭಾವ (ಖರ್ಚು, ವಿದೇಶ, ಧ್ಯಾನ & ಮುಕ್ತಿ)', hi: 'द्वादश भाव: व्यय भाव (मोक्ष, विदेश, व्यय व शयन सुख)', en: 'House 12: Vyaya Bhava (Expenditures, Foreign Lands & Moksha)' }
  };

  return (
    <div id="astrological-analysis-panel" className="no-print my-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white border-2 border-amber-500 shadow-2xl p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header with House Quick Selector & Basic Badges */}
      <div className="border-b border-amber-500/30 pb-4 space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-lg shadow-md shrink-0">
              <Eye className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {currentLang === 'kn' ? 'ಗ್ರಹ ದೃಷ್ಟಿ & ವೈದಿಕ ವಿಶ್ಲೇಷಣೆ' : currentLang === 'hi' ? 'ग्रह दृष्टि एवं वैदिक विश्लेषण' : 'Astrological House Analysis'}
                </span>
                <span className="text-[10px] font-mono text-stone-300">
                  {analysis.rashiName[currentLang]} ({analysis.rashiName.en})
                </span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-100 mt-0.5">
                {BHAVA_TITLES[selectedBhavaNumber]?.[currentLang] || `House ${selectedBhavaNumber}`}
              </h3>
            </div>
          </div>

          {/* Drishti Tone Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              analysis.overallDrishtiTone === 'highly_auspicious' || analysis.overallDrishtiTone === 'auspicious'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : analysis.overallDrishtiTone === 'challenging' || analysis.overallDrishtiTone === 'intense'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{analysis.overallDrishtiToneLocalized[currentLang]}</span>
            </span>

            <span className="text-[11px] font-mono bg-black/40 px-2.5 py-1 rounded-xl border border-stone-700 text-stone-300">
              {currentLang === 'kn' ? `ದೃಷ್ಟಿಗಳು: ${analysis.aspectingPlanets.length}` : `Aspects: ${analysis.aspectingPlanets.length}`}
            </span>
          </div>
        </div>

        {/* 12 House Selector Buttons for Direct Interactive Navigation */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-1.5">
            <span>{currentLang === 'kn' ? 'ಭಾವ ಆಯ್ಕೆ ಮಾಡಿ (Click any House):' : 'Select House to Analyze:'}</span>
            <span className="font-mono text-amber-400">House {selectedBhavaNumber} Active</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(hNum => {
              const isSelected = hNum === selectedBhavaNumber;
              const hasOccupants = kundaliData.planets.some(p => p.bhava === hNum);

              return (
                <button
                  key={hNum}
                  onClick={() => onSelectBhava(hNum)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer border relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-black scale-105 z-10'
                      : 'bg-stone-800/80 hover:bg-stone-750 text-stone-300 border-stone-700'
                  }`}
                  title={`Select House ${hNum}`}
                >
                  <span>H{hNum}</span>
                  {hasOccupants && (
                    <span className={`block w-1 h-1 rounded-full mx-auto mt-0.5 ${isSelected ? 'bg-stone-950' : 'bg-amber-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Planetary Occupants and Aspects (Drishti) Breakdown */}
      <div className="space-y-4">
        
        {/* Occupants vs Aspecting Grahas Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Occupants in this House */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-stone-800 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-amber-400 block tracking-wider">
              {currentLang === 'kn' ? '೧. ಈ ಭಾವದಲ್ಲಿರುವ ಗ್ರಹಗಳು (Occupants):' : '1. Occupant Grahas in this House:'}
            </span>

            {analysis.occupantPlanets.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.occupantPlanets.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectPlanet?.(p.name)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-stone-800/90 border border-amber-500/30 text-xs cursor-pointer hover:border-amber-400 transition-colors shadow-xs"
                    title={`Click to view ${p.name}`}
                  >
                    <SvgGrahaIcon name={p.name} size={18} />
                    <span className="font-bold text-amber-200">{p.sanskritName[currentLang]}</span>
                    <span className="text-[10px] font-mono text-stone-400">({p.degrees.toFixed(2)}°)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic pt-1">
                {currentLang === 'kn' ? 'ಈ ಭಾವದಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹಗಳು ನೆಲೆಸಿಲ್ಲ (ಭಾವವು ಖಾಲಿಯಾಗಿದೆ).' : 'No planets are currently situated in this house.'}
              </p>
            )}
          </div>

          {/* Aspect Count & Energy Balance */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-stone-800 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-amber-400 block tracking-wider">
              {currentLang === 'kn' ? '೨. ದೃಷ್ಟಿ ಪ್ರಭಾವಗಳ ಸಾರಾಂಶ (Aspect Breakdown):' : '2. Aspect Counts & Polarities:'}
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-300 font-semibold">{currentLang === 'kn' ? 'ಶುಭ ದೃಷ್ಟಿಗಳು' : 'Benefic Aspects'}</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">{analysis.beneficAspectCount}</span>
              </div>

              <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                <span className="text-rose-300 font-semibold">{currentLang === 'kn' ? 'ಪಾಪ/ತೀವ್ರ ದೃಷ್ಟಿಗಳು' : 'Malefic/Intense'}</span>
                <span className="text-rose-400 font-mono font-bold text-sm">{analysis.maleficAspectCount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Aspects List Casting on This House */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase font-bold text-amber-400 block tracking-wider px-1">
            {currentLang === 'kn' ? '೩. ಈ ಭಾವದ ಮೇಲೆ ಬೀಳುತ್ತಿರುವ ಗ್ರಹ ದೃಷ್ಟಿಗಳ ವಿವರ (Planetary Aspects on this House):' : '3. Planetary Aspects (Drishti) Affecting this House:'}
          </span>

          {analysis.aspectingPlanets.length > 0 ? (
            <div className="space-y-2.5">
              {analysis.aspectingPlanets.map((asp, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-2xl bg-black/30 border border-stone-800 hover:border-amber-500/40 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2">
                    <div className="flex items-center gap-2">
                      <SvgGrahaIcon name={asp.aspectingPlanet.name} size={20} />
                      <span className="font-serif font-bold text-sm text-amber-200">
                        {asp.aspectingPlanet.sanskritName[currentLang]} ({asp.aspectingPlanet.name})
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        ({currentLang === 'kn' ? `${asp.aspectingPlanet.bhava}ನೇ ಭಾವದಿಂದ` : `from House ${asp.aspectingPlanet.bhava}`})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-800 text-amber-300 border border-stone-700">
                        {asp.aspectTypeLocalized[currentLang]}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        asp.nature === 'benefic'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : asp.nature === 'malefic'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {asp.natureLocalized[currentLang]}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif">
                    {asp.effectOnHouse[currentLang]}
                  </p>

                  {asp.effectOnOccupants && (
                    <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                      <strong>{currentLang === 'kn' ? 'ನಿವಾಸಿ ಗ್ರಹಗಳ ಸಂಯೋಗ ಪ್ರಭಾವ:' : 'Impact on Occupants:'} </strong>
                      {asp.effectOnOccupants[currentLang]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-black/20 border border-stone-800 text-xs text-stone-400 italic">
              {currentLang === 'kn'
                ? 'ಯಾವುದೇ ಗ್ರಹಗಳು ನೇರವಾಗಿ ಈ ಭಾವದ ಮೇಲೆ ಪರಾಶರಿ ದೃಷ್ಟಿಯನ್ನು ಬೀರುತ್ತಿಲ್ಲ. ಈ ಭಾವವು ಸ್ವತಂತ್ರವಾಗಿ ತನ್ನ ರಾಶ್ಯಾಧಿಪತಿಯ ಬಲದ ಮೇಲೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.'
                : 'No planets are currently casting direct Parashari aspects onto this house. Its vitality primarily depends on its sign lord and resident dignity.'}
            </div>
          )}
        </div>

      </div>

      {/* 3. Physical & Mental Health Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Physical Health Impact */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-black/50 to-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm font-serif">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>{currentLang === 'kn' ? '೪. ಶಾರೀರಿಕ ಆರೋಗ್ಯ & ಅಂಗಾಂಗ ಪ್ರಭಾವ' : '4. Physical Health & Organ Impact'}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                {currentLang === 'kn' ? 'ಆಡಳಿತಕ್ಕೊಳಪಟ್ಟ ಅಂಗಗಳು (Governed Organs):' : 'Governed Organs:'}
              </span>
              <p className="font-semibold text-stone-200 mt-0.5">
                {analysis.physicalImpact.governedOrgans[currentLang]}
              </p>
            </div>

            <div className="pt-1 border-t border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block">
                {currentLang === 'kn' ? 'ಗಮನಿಸಬೇಕಾದ ಲಕ್ಷಣಗಳು (Vulnerabilities):' : 'Vulnerabilities to Monitor:'}
              </span>
              <p className="text-stone-300 mt-0.5 leading-relaxed">
                {analysis.physicalImpact.vulnerabilities[currentLang]}
              </p>
            </div>

            <div className="pt-1 border-t border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                {currentLang === 'kn' ? 'ಜೀವಕೋಶೀಯ ಚೈತನ್ಯದ ಪ್ರಭಾವ (Vitality Impact):' : 'Vitality & Tissue Effect:'}
              </span>
              <p className="text-stone-300 mt-0.5 leading-relaxed font-serif">
                {analysis.physicalImpact.vitalityEffect[currentLang]}
              </p>
            </div>
          </div>
        </div>

        {/* Mental Health & Psychological Conditioning */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-black/50 to-indigo-950/20 border border-indigo-500/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm font-serif">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>{currentLang === 'kn' ? '೫. ಮಾನಸಿಕ ಸ್ಥಿತಿ & ಭಾವನಾತ್ಮಕ ಪ್ರಭಾವ' : '5. Mental Temperament & Stress Triggers'}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                {currentLang === 'kn' ? 'ಮನೋಧರ್ಮ & ಪ್ರಕೃತಿ (Temperament):' : 'Temperament & Mindset:'}
              </span>
              <p className="font-semibold text-stone-200 mt-0.5">
                {analysis.mentalImpact.temperament[currentLang]}
              </p>
            </div>

            <div className="pt-1 border-t border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block">
                {currentLang === 'kn' ? 'ಮಾನಸಿಕ ಒತ್ತಡದ ಪ್ರಚೋದಕಗಳು (Stress Triggers):' : 'Stress & Fatigue Triggers:'}
              </span>
              <p className="text-stone-300 mt-0.5 leading-relaxed">
                {analysis.mentalImpact.stressTriggers[currentLang]}
              </p>
            </div>

            <div className="pt-1 border-t border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block">
                {currentLang === 'kn' ? 'ಬುದ್ಧಿಶಕ್ತಿ & ಅಂತಃಪ್ರಜ್ಞೆ (Cognitive Strength):' : 'Cognitive & Intuitive Strengths:'}
              </span>
              <p className="text-stone-300 mt-0.5 leading-relaxed font-serif">
                {analysis.mentalImpact.cognitiveStrength[currentLang]}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Nutritional Therapy & Ayurvedic Dietary Protocol */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-black/50 to-amber-950/30 border border-amber-500/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-serif">
          <Salad className="w-4 h-4 text-amber-400" />
          <span>{currentLang === 'kn' ? '೬. ಜ್ಯೋತಿಷ್ಯ ಪೌಷ್ಟಿಕಾಂಶ & ಆಯುರ್ವೇದ ಆಹಾರ ಚಿಕಿತ್ಸೆ (Nutritional Remedies)' : '6. Astrological Nutrition & Ayurvedic Dietary Therapy'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-black/30 border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
              ✅ {currentLang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಆಹಾರಗಳು (Recommended Foods):' : 'Recommended Sattvic Foods:'}
            </span>
            <p className="text-stone-200 leading-relaxed">
              {analysis.nutritionalTherapy.recommendedFoods[currentLang]}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-400 block">
              ❌ {currentLang === 'kn' ? 'ವರ್ಜ್ಯ ಆಹಾರಗಳು (Foods to Avoid/Reduce):' : 'Foods to Restrict/Avoid:'}
            </span>
            <p className="text-stone-200 leading-relaxed">
              {analysis.nutritionalTherapy.foodsToAvoid[currentLang]}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-300 block">
              🌿 {currentLang === 'kn' ? 'ಆಯುರ್ವೇದ ಗಿಡಮೂಲಿಕೆಗಳು (Ayurvedic Rasayanas):' : 'Ayurvedic Herbs & Rasayanas:'}
            </span>
            <p className="text-stone-200 leading-relaxed font-serif">
              {analysis.nutritionalTherapy.ayurvedicHerbs[currentLang]}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-sky-300 block">
              💊 {currentLang === 'kn' ? 'ಅಗತ್ಯ ವಿಟಮಿನ್ & ಖನಿಜಗಳು (Vitamins & Nutrients):' : 'Key Vitamins & Minerals:'}
            </span>
            <p className="text-stone-200 leading-relaxed">
              {analysis.nutritionalTherapy.vitaminsAndNutrients[currentLang]}
            </p>
          </div>

        </div>

        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-stone-300 font-serif">
          <strong>{currentLang === 'kn' ? 'ಆಹಾರ ಸೇವನೆಯ ನೇಮ:' : 'Dining Consciousness: '}</strong>
          {analysis.nutritionalTherapy.dietaryRitual[currentLang]}
        </div>
      </div>

      {/* 5. Specific Astrological & Vedic Lifestyle Remedies */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-black/50 via-stone-900 to-amber-950/40 border-2 border-amber-500/60 space-y-4">
        <div className="flex items-center gap-2 text-amber-200 font-bold text-sm sm:text-base font-serif">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>{currentLang === 'kn' ? '೭. ಈ ಭಾವದ ಶಾಂತಿ & ದೋಷ ಪರಿಹಾರ ಉಪಾಯಗಳು (Vedic Remedies)' : '7. Vedic Astrological Remedies & Lifestyle Upayas'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          
          {/* Vedic Mantra */}
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
              🕉️ {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವೈದಿಕ ಮಂತ್ರ (Sacred Mantra):' : 'Prescribed Vedic Mantra:'}
            </span>
            <p className="font-mono text-amber-200 font-bold text-xs sm:text-sm">
              {analysis.astrologicalRemedies.vedicMantra[currentLang]}
            </p>
          </div>

          {/* Gemstone & Rudraksha */}
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
              💎 {currentLang === 'kn' ? 'ರತ್ನ & ರುದ್ರಾಕ್ಷಿ (Gemstone & Rudraksha):' : 'Gemstone & Rudraksha:'}
            </span>
            <p className="text-stone-200 font-serif">
              {analysis.astrologicalRemedies.gemstoneAndRudraksha[currentLang]}
            </p>
          </div>

          {/* Daanam / Charity */}
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
              🌾 {currentLang === 'kn' ? 'ದಾನ & ಸತ್ಕರ್ಮ (Charity / Daanam):' : 'Charity & Donation:'}
            </span>
            <p className="text-stone-200 leading-relaxed font-serif">
              {analysis.astrologicalRemedies.daanamCharity[currentLang]}
            </p>
          </div>

          {/* Spiritual Practice */}
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
              🪔 {currentLang === 'kn' ? 'ನಿತ್ಯ ಜೀವನ ಶೈಲಿ ಅಭ್ಯಾಸ (Lifestyle Practice):' : 'Vedic Daily Routine:'}
            </span>
            <p className="text-stone-200 leading-relaxed font-serif">
              {analysis.astrologicalRemedies.spiritualPractice[currentLang]}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
