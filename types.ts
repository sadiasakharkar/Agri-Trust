
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'kn' | 'ml' | 'mr' | 'pa' | 'gu' | 'or' | 'as';

export type IndianState = 'Punjab' | 'Andhra Pradesh' | 'Maharashtra' | 'Tamil Nadu' | 'Karnataka' | 'Gujarat' | 'Uttar Pradesh' | 'Other';

export type Season = 'KHARIF' | 'RABI' | 'ZAID';

export enum CropType {
  Paddy = 'PADDY',
  Wheat = 'WHEAT',
  Cotton = 'COTTON',
  Sugarcane = 'SUGARCANE',
  Maize = 'MAIZE',
  Mustard = 'MUSTARD',
  Pulse = 'PULSE',
  Soybean = 'SOYBEAN',
  Millet = 'MILLET'
}

export enum TillagePractice {
  Traditional = 'TRADITIONAL',
  NoTill = 'NO_TILL',
  ReducedTill = 'REDUCED_TILL'
}

export interface FarmMetadata {
  farmerName: string;
  farmerId: string;
  phone: string;
  state: IndianState;
  khasraNumber: string; 
  farmSize: number; 
  season: Season;
  cropType: CropType;
  intercropping: boolean;
  tillage: TillagePractice;
  treeCount: number;
  hasSolarPump: boolean;
  fertilizerUsage: string;
  agriStackId?: string;
  landVerified?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DigitalTwinMetrics {
  socValue: number; 
  biomassIndex: number;
  tillageDetected: boolean;
  carbonSequestrationRate: number;
  confidenceScore: number;
  preMrvCredits: number;
}

export interface SatelliteHistoryPoint {
  date: string;
  ndvi: number;
}

export interface MRVState {
  layer: number;
  metadata: FarmMetadata | null;
  boundary: Coordinates[] | null;
  images: Array<{
    category: 'soil' | 'crop' | 'tree' | 'pump';
    data: string;
    verified: boolean;
    location: Coordinates;
    timestamp: number;
    spectrometerData?: { r2: number; cielab: string };
  }>;
  satelliteData: {
    ndvi: number;
    evi: number;
    radarBackscatter: number;
    sarImageUrl?: string;
    opticalImageUrl?: string;
    history: SatelliteHistoryPoint[];
  } | null;
  results: {
    carbonScore: number;
    credits: number;
    anomalies: string[];
    isVerified: boolean;
    digitalTwin?: DigitalTwinMetrics;
    blockchainTx?: string;
    serialNumber?: string;
  } | null;
}

export type UserRole = 'FARMER' | 'BUYER';

export interface BuyerProfile {
  companyName: string;
  kycStatus: 'VERIFIED' | 'PENDING';
  totalCreditsPurchased: number;
  compliance: string[];
}
