
import { MRVState, TillagePractice, DigitalTwinMetrics, CropType } from '../types';

const CROP_COEFFICIENTS: Record<CropType, number> = {
  [CropType.Paddy]: 1.2,
  [CropType.Wheat]: 1.1,
  [CropType.Cotton]: 1.3,
  [CropType.Sugarcane]: 2.1,
  [CropType.Maize]: 1.4,
  [CropType.Mustard]: 1.2,
  [CropType.Pulse]: 1.8, // Nitrogen fixing bonus
  [CropType.Soybean]: 1.6,
  [CropType.Millet]: 1.5
};

export async function fetchSatelliteData(boundary: any[]) {
  await new Promise(r => setTimeout(r, 1500));
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const history = months.map(m => ({
    date: `${m} 2024`,
    ndvi: 0.3 + Math.random() * 0.5
  }));

  return {
    ndvi: 0.65 + (Math.random() * 0.15),
    evi: 0.42 + (Math.random() * 0.08),
    radarBackscatter: -12.5 + (Math.random() * 2.0),
    opticalImageUrl: "https://images.unsplash.com/photo-1500382017468-9049fee7802f?auto=format&fit=crop&q=80&w=400",
    sarImageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400",
    history
  };
}

export function generateSerialNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `AGR-${timestamp}-${random}`;
}

export function estimateCarbon(state: MRVState) {
  if (!state.metadata || !state.satelliteData) return 0;
  
  const farmSize = state.metadata.farmSize;
  const cropCoeff = CROP_COEFFICIENTS[state.metadata.cropType] || 1.0;
  
  let score = farmSize * 2.2 * cropCoeff;
  
  // Tillage Bonus
  if (state.metadata.tillage === TillagePractice.NoTill) score *= 1.45;
  else if (state.metadata.tillage === TillagePractice.ReducedTill) score *= 1.2;
  
  // Intercropping Bonus
  if (state.metadata.intercropping) score *= 1.25;
  
  // Solar Pump Bonus
  if (state.metadata.hasSolarPump) score += 2.5;
  
  // Satellite Factor
  score *= (state.satelliteData.ndvi * 1.1);
  
  return parseFloat(score.toFixed(2));
}

export function generateDigitalTwin(state: MRVState): DigitalTwinMetrics {
  const farmSize = state.metadata?.farmSize || 1;
  const score = estimateCarbon(state);
  return {
    socValue: 1.8 + (Math.random() * 0.4),
    biomassIndex: 0.6 + (Math.random() * 0.2),
    tillageDetected: state.metadata?.tillage !== TillagePractice.NoTill,
    carbonSequestrationRate: score / 5,
    confidenceScore: 0.92,
    preMrvCredits: Math.floor(score * 1.05)
  };
}
