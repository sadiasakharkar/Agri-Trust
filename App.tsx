
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Leaf, ChevronRight, ChevronLeft, CheckCircle2, Info, ArrowRight, Loader2, Sparkles,
  ShieldCheck, FileText, Navigation, Globe, QrCode, ExternalLink, Download, Share2,
  Mic, Camera, Search, Wallet, User, BadgeCheck, Zap, LayoutGrid, Tractor, Trees,
  CloudRain, Map as MapIcon, Database, TrendingUp, History, Building2, Lock,
  ArrowUpRight, ShoppingBag, BarChart3, Fingerprint, Activity, Layers, Tag,
  AlertTriangle, CreditCard, ArrowDownRight, RefreshCcw, Printer, Award,
  Plus, X
} from 'lucide-react';
import { getTranslation, translations } from './translations';
import { Language, MRVState, CropType, TillagePractice, IndianState, Season, UserRole, Coordinates } from './types';
import FarmMap from './components/FarmMap';
import CameraModule from './components/CameraModule';
import { QRCodeComponent } from './components/QRCodeComponent';
import { fetchSatelliteData, estimateCarbon, generateDigitalTwin, generateSerialNumber } from './services/mrvService';

/**
 * 9-Layer Processing Tunnel Gate Configuration
 */
const AUDIT_GATES = [
  { id: 1, title: "Gate 1: Land Registry", log: "Bhu-Naksha parcellation matching confirmed..." },
  { id: 2, title: "Gate 2: AI Vision Audit", log: "Edge-AI photo blur & GPS overlap verified..." },
  { id: 3, title: "Gate 3: Spectrometry", log: "Soil CIELAB color-space analysis complete..." },
  { id: 4, title: "Gate 4: Radar Scan", log: "Sentinel-1 detecting Zero-Tillage practices..." },
  { id: 5, title: "Gate 5: Multi-Source Fusion", log: "Merging satellite and ground telemetry..." },
  { id: 6, title: "Gate 6: Model Calibration", log: "Calibrating RF Regressor for local soil type..." },
  { id: 7, title: "Gate 7: Fraud Detection", log: "Zero-Knowledge Proof audit trail established..." },
  { id: 8, title: "Gate 8: Conservatory Filter", log: "Applying 20th percentile risk buffer..." },
  { id: 9, title: "Gate 9: Blockchain Minting", log: "Assigning immutable credit serial numbers..." },
];

type FlowStep = 'login' | 'info' | 'map' | 'evidence' | 'verifying' | 'dashboard' | 'certificate' | 'wallet' | 'dbt' | 'buyer';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [step, setStep] = useState<FlowStep>('login');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [mapLayer, setMapLayer] = useState<'optical' | 'sar' | 'soc'>('optical');
  const [currentAuditGate, setCurrentAuditGate] = useState(-1);
  const [verifyingLand, setVerifyingLand] = useState(false);
  const [showBuyerOffer, setShowBuyerOffer] = useState(false);
  const [activeCamera, setActiveCamera] = useState<'soil' | 'crop' | 'tree' | 'pump' | null>(null);
  
  const [mrvState, setMrvState] = useState<MRVState>({
    layer: 0,
    metadata: {
      farmerName: '',
      farmerId: '',
      phone: '',
      state: 'Maharashtra',
      khasraNumber: '',
      farmSize: 2.5,
      season: 'KHARIF',
      cropType: CropType.Paddy,
      intercropping: false,
      tillage: TillagePractice.NoTill,
      treeCount: 0,
      hasSolarPump: false,
      fertilizerUsage: 'Organic',
      landVerified: false
    },
    boundary: [],
    images: [],
    satelliteData: null,
    results: null
  });

  const [selectedCrops, setSelectedCrops] = useState<CropType[]>([]);

  const t = useMemo(() => ({
    get: (key: string) => getTranslation(lang, key)
  }), [lang]);

  const seasonalCrops = useMemo(() => {
    switch(mrvState.metadata?.season) {
      case 'KHARIF': return [CropType.Paddy, CropType.Maize, CropType.Cotton, CropType.Soybean];
      case 'RABI': return [CropType.Wheat, CropType.Mustard, CropType.Pulse];
      case 'ZAID': return [CropType.Millet, CropType.Pulse];
      default: return [CropType.Paddy];
    }
  }, [mrvState.metadata?.season]);

  const hectares = useMemo(() => {
    if (!mrvState.boundary || mrvState.boundary.length < 3) return 0;
    return (mrvState.metadata?.farmSize || 2.5) * 0.4047; 
  }, [mrvState.boundary, mrvState.metadata?.farmSize]);

  const trustScore = useMemo(() => {
    if (mrvState.results?.digitalTwin?.confidenceScore) {
      return Math.round(mrvState.results.digitalTwin.confidenceScore * 100);
    }
    return 85; 
  }, [mrvState.results]);

  useEffect(() => {
    if (step === 'dashboard' && mrvState.results) {
      const timer = setTimeout(() => setShowBuyerOffer(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [step, mrvState.results]);

  const handleLandVerification = async () => {
    if (!mrvState.metadata?.khasraNumber) return alert("Enter Khasra.");
    setVerifyingLand(true);
    await new Promise(r => setTimeout(r, 2000));
    setVerifyingLand(false);
    setMrvState(prev => ({ ...prev, metadata: { ...prev.metadata!, landVerified: true } }));
  };

  const toggleCrop = (crop: CropType) => {
    setSelectedCrops(prev => {
      if (prev.includes(crop)) {
        return prev.filter(c => c !== crop);
      }
      return [...prev, crop];
    });
  };

  const handleStartAnalysis = async () => {
    setStep('verifying');
    setCurrentAuditGate(0);
    
    // Animate the 9-layer tunnel
    for (let i = 0; i < AUDIT_GATES.length; i++) {
      setCurrentAuditGate(i);
      await new Promise(r => setTimeout(r, 800));
    }

    const sat = await fetchSatelliteData(mrvState.boundary || []);
    const score = estimateCarbon({ ...mrvState, satelliteData: sat });
    const twin = generateDigitalTwin({ ...mrvState, satelliteData: sat });
    
    setMrvState(prev => ({
      ...prev,
      satelliteData: sat,
      results: {
        carbonScore: score,
        credits: Math.floor(score),
        anomalies: [],
        isVerified: true,
        digitalTwin: twin,
        blockchainTx: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
        serialNumber: generateSerialNumber()
      }
    }));
    setStep('dashboard');
  };

  const handleImageCapture = (category: 'soil' | 'crop' | 'tree' | 'pump', base64: string) => {
    const newImage = {
      category,
      data: base64,
      verified: true,
      location: mrvState.boundary?.[0] || { lat: 18.5204, lng: 73.8567 },
      timestamp: Date.now()
    };
    setMrvState(prev => ({
      ...prev,
      images: [...prev.images.filter(img => img.category !== category), newImage]
    }));
    setActiveCamera(null);
  };

  const StepHeader = ({ title, backStep, transparent = false }: { title: string, backStep?: FlowStep, transparent?: boolean }) => (
    <header className={`px-6 py-6 flex items-center justify-between sticky top-0 z-50 ${transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md border-b border-slate-100'}`}>
      <div className="flex items-center gap-4">
        {backStep && (
          <button onClick={() => setStep(backStep)} className={`p-3 rounded-xl ${transparent ? 'bg-white/10 text-white backdrop-blur-md' : 'bg-slate-50 text-slate-600'}`}>
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className={`text-lg font-bold tracking-tight ${transparent ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
      </div>
      <button 
        onClick={() => setStep(role === 'FARMER' ? 'buyer' : 'login')}
        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${transparent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-900'}`}
      >
        {role === 'FARMER' ? 'Buyer Portal' : 'Farmer Portal'}
      </button>
    </header>
  );

  // --- RENDERING LOGIC ---

  if (step === 'login') return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 z-10">
        <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200">
          <Leaf size={48} className="text-white" />
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Agri-Trust</h1>
          <p className="text-slate-500 font-medium text-lg leading-snug">India's First Smallholder<br/>Carbon Registry</p>
        </div>
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.get('loginLabel')}</label>
            <input 
              type="text" 
              placeholder="E.g. KT-99212"
              className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 shadow-sm outline-none font-bold text-lg"
              value={mrvState.metadata?.farmerId}
              onChange={(e) => setMrvState(prev => ({...prev, metadata: {...prev.metadata!, farmerId: e.target.value}}))}
            />
          </div>
          <button 
            onClick={() => { setRole('FARMER'); setStep('info'); }}
            className="w-full btn-primary bg-emerald-600 text-white shadow-xl shadow-emerald-200 text-lg gap-3"
          >
            {t.get('verify')} <ChevronRight size={22} />
          </button>
          <button onClick={() => { setRole('BUYER'); setStep('buyer'); }} className="w-full h-14 font-bold text-slate-400 flex items-center justify-center gap-2 hover:text-slate-600">
            <ShoppingBag size={20}/> Industry Buyer Access
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 'info') return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StepHeader title={t.get('step_info')} backStep="login" />
      <div className="flex-1 p-6 space-y-6 max-w-md mx-auto w-full overflow-y-auto pb-32">
        <div className="dpi-card p-6 space-y-5 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Database size={20}/></div>
            <h3 className="font-bold text-slate-900">Land Record Sync</h3>
          </div>
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <select className="h-12 px-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none">
                  <option>Maharashtra</option><option>Punjab</option><option>Gujarat</option>
                </select>
                <input 
                  type="text" 
                  className="h-12 px-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" 
                  placeholder="Khasra Number"
                  value={mrvState.metadata?.khasraNumber}
                  onChange={e => setMrvState(p => ({...p, metadata: {...p.metadata!, khasraNumber: e.target.value}}))}
                />
             </div>
             <button 
                onClick={handleLandVerification}
                disabled={verifyingLand || mrvState.metadata?.landVerified}
                className={`w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mrvState.metadata?.landVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-white'}`}
             >
                {verifyingLand ? <Loader2 className="animate-spin" size={14}/> : mrvState.metadata?.landVerified ? <CheckCircle2 size={14}/> : <RefreshCcw size={14}/>}
                {mrvState.metadata?.landVerified ? t.get('landVerified') : t.get('verifyLand')}
             </button>
          </div>
        </div>

        <div className="dpi-card p-6 space-y-5 bg-white">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CloudRain size={20}/></div>
             <h3 className="font-bold text-slate-900">Crop Cycle</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['KHARIF', 'RABI', 'ZAID'] as Season[]).map(s => (
              <button key={s} onClick={() => {
                setMrvState(p => ({...p, metadata: {...p.metadata!, season: s}}));
                setSelectedCrops([]); // Reset crops when season changes
              }} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${mrvState.metadata?.season === s ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Add Crops Section - Appears after selecting cycle */}
        {mrvState.metadata?.season && (
          <div className="dpi-card p-6 space-y-5 bg-white animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Tractor size={20}/></div>
                 <h3 className="font-bold text-slate-900">Add Crops</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select {mrvState.metadata.season} Crops</span>
            </div>
            
            <p className="text-[11px] text-slate-500 font-medium">Select your main crop and any intercrops to maximize carbon credits.</p>

            <div className="grid grid-cols-2 gap-3">
              {seasonalCrops.map(crop => (
                <button 
                  key={crop} 
                  onClick={() => toggleCrop(crop)} 
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                    selectedCrops.includes(crop) 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {selectedCrops.includes(crop) && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5">
                      <CheckCircle2 size={12}/>
                    </div>
                  )}
                  <div className={`p-3 rounded-xl ${selectedCrops.includes(crop) ? 'bg-emerald-100' : 'bg-slate-50'}`}>
                     <Leaf size={20} className={selectedCrops.includes(crop) ? 'text-emerald-600' : 'text-slate-300'} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight">{crop}</span>
                </button>
              ))}
              <button className="p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 opacity-60">
                 <Plus size={24}/>
                 <span className="text-[10px] font-bold uppercase">Other</span>
              </button>
            </div>

            {selectedCrops.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                 <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Selected Pattern</p>
                 <div className="flex flex-wrap gap-2">
                    {selectedCrops.map((c, i) => (
                      <div key={c} className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-emerald-200 flex items-center gap-2">
                         <span className="text-[10px] font-black text-emerald-700">{c}</span>
                         {i === 0 ? <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">MAIN</span> : null}
                         <X size={10} className="text-slate-300 cursor-pointer" onClick={() => toggleCrop(c)}/>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6 sticky bottom-0 bg-white/90 border-t border-slate-100 backdrop-blur-md z-[60]">
        <button 
          disabled={!mrvState.metadata?.landVerified || selectedCrops.length === 0} 
          onClick={() => {
            setMrvState(p => ({
              ...p, 
              metadata: {
                ...p.metadata!, 
                cropType: selectedCrops[0], 
                intercropping: selectedCrops.length > 1
              }
            }));
            setStep('map');
          }} 
          className="w-full btn-primary bg-emerald-600 text-white shadow-xl shadow-emerald-200 text-lg gap-3 disabled:opacity-50 transition-all"
        >
          {selectedCrops.length > 0 ? 'Confirm Farm Pattern' : 'Select Crops First'} <ChevronRight />
        </button>
      </div>
    </div>
  );

  if (step === 'verifying') return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-8 overflow-hidden">
      <div className="mt-12 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-2xl shadow-emerald-500/30">
               <ShieldCheck className="text-white" size={32}/>
            </div>
            <div className="flex flex-col text-white">
               <h2 className="text-2xl font-black tracking-tight">Processing Tunnel</h2>
               <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">9-Layer Security Verification</p>
            </div>
         </div>
      </div>

      <div className="flex-1 mt-10 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
         {AUDIT_GATES.map((gate, idx) => {
           const isComplete = idx < currentAuditGate;
           const isActive = idx === currentAuditGate;
           return (
             <div key={gate.id} className={`p-5 rounded-[2rem] border transition-all duration-700 ${isActive ? 'bg-white border-white scale-[1.02] shadow-2xl' : isComplete ? 'bg-emerald-900/10 border-emerald-800/30 opacity-100' : 'opacity-10'}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isActive ? 'bg-emerald-600 text-white animate-pulse' : isComplete ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-600'}`}>
                      {isComplete ? <CheckCircle2 size={16}/> : gate.id}
                   </div>
                   <h4 className={`text-sm font-black tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>{gate.title}</h4>
                </div>
                {isActive && (
                   <p className="mt-3 text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                     {gate.log}
                   </p>
                )}
             </div>
           );
         })}
      </div>
      
      <div className="h-2 w-full bg-slate-800 rounded-full mt-8 overflow-hidden">
         <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${(currentAuditGate / (AUDIT_GATES.length - 1)) * 100}%` }} />
      </div>
    </div>
  );

  if (step === 'dashboard') return (
    <div className="min-h-screen bg-slate-50 pb-32 relative">
      <header className="bg-emerald-600 pt-16 pb-44 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[1.2rem] border border-white/20 flex items-center justify-center">
                 <BadgeCheck size={32} />
              </div>
              <div>
                 <h1 className="text-xl font-black">Seller Hub</h1>
                 <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">{mrvState.metadata?.farmerId || 'KT-99212'}</p>
              </div>
           </div>
           <button onClick={() => setStep('certificate')} className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 active:scale-90 transition-all">
             <Award size={24}/>
           </button>
        </div>

        {/* Primary Wallet UI */}
        <div className="relative z-10 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/5 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-emerald-600 rounded-2xl"><Wallet size={24}/></div>
                 <h3 className="font-bold text-white uppercase text-xs tracking-widest">{t.get('credits')}</h3>
              </div>
              <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live Market Rate</span>
              </div>
           </div>
           
           <div className="flex flex-col items-center">
              <p className="text-6xl font-black text-white tracking-tighter tabular-nums">{mrvState.results?.credits || 0}</p>
              <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">tCO2e Available</p>
           </div>

           <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">{t.get('earnings')}</span>
                 <span className="text-xl font-black text-white">₹{((mrvState.results?.credits || 0) * 1850).toLocaleString()}</span>
              </div>
              <button onClick={() => setStep('wallet')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                Withdraw
              </button>
           </div>
        </div>
      </header>

      <div className="px-6 -mt-10 space-y-6 relative z-20">
        {/* Farm Inventory */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2"><LayoutGrid size={18}/> {t.get('inventory')}</h3>
              <span className="text-[10px] font-bold text-slate-400">1 Active Parcel</span>
           </div>
           <div className="dpi-card p-5 bg-white flex items-center justify-between border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <MapIcon size={24}/>
                 </div>
                 <div>
                    <p className="text-sm font-black text-slate-900">Parcel #{mrvState.metadata?.khasraNumber || '42/1'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{selectedCrops.join(' + ') || mrvState.metadata?.cropType} • {mrvState.metadata?.season}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-xs font-black text-emerald-600">{(mrvState.results?.credits || 0)} Credits</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase">Verified</p>
              </div>
           </div>
        </div>

        {/* Nudges */}
        <div className="dpi-card p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white space-y-3 shadow-xl">
           <div className="flex items-center gap-3">
              <Sparkles className="text-amber-400" size={20}/>
              <h3 className="font-black text-xs uppercase tracking-widest">{t.get('nudges')}</h3>
           </div>
           <p className="text-xs font-medium leading-relaxed opacity-90">
             Switch to <span className="font-black text-white underline">No-Till farming</span> for the next Rabi season to earn an additional <span className="font-black text-white">2.5 credits</span> per hectare.
           </p>
        </div>
      </div>

      {/* Buyer Request Overlay */}
      {showBuyerOffer && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-8 animate-in slide-in-from-bottom duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                    <ShoppingBag size={40} />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Credit Offer</h3>
                    <p className="text-sm font-medium text-slate-500">Industry Buyer Purchase Request</p>
                 </div>
              </div>

              <div className="dpi-card p-6 bg-slate-50 space-y-5">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <img src="https://logodownload.org/wp-content/uploads/2014/11/tata-logo-0.png" className="w-8 grayscale" />
                       <div>
                          <p className="text-xs font-black text-slate-900">Tata Motors India</p>
                          <div className="flex items-center gap-1.5">
                             <ShieldCheck size={12} className="text-emerald-500" />
                             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">ESG RATING: AAA</span>
                          </div>
                       </div>
                    </div>
                    <div className="px-2 py-1 bg-blue-100 text-[8px] font-black text-blue-700 rounded uppercase">VCMI Compliant</div>
                 </div>

                 <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">Total Sale Value</span>
                    <span className="text-2xl font-black text-slate-900">₹18,500</span>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowBuyerOffer(false)} className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                    {t.get('decline')}
                 </button>
                 <button 
                  onClick={() => { setShowBuyerOffer(false); setStep('wallet'); }} 
                  className="flex-2 w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                 >
                    {t.get('accept')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Floating Assistant */}
      <button className="fixed bottom-28 right-8 w-20 h-20 bg-emerald-600 text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center gap-1 fab-mic z-[100] active:scale-90 transition-all border-4 border-white">
         <Mic size={32} />
         <span className="text-[8px] font-black uppercase tracking-tighter">Bhashini</span>
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 z-50">
         <div onClick={() => setStep('dashboard')} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${(step as string) === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <LayoutGrid size={24}/>
            <span className="text-[9px] font-black uppercase">Home</span>
         </div>
         <div onClick={() => setStep('map')} className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer">
            <MapIcon size={24}/>
            <span className="text-[9px] font-black uppercase">Field</span>
         </div>
         <div onClick={() => setStep('wallet')} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${(step as string) === 'wallet' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <Wallet size={24}/>
            <span className="text-[9px] font-black uppercase">Khata</span>
         </div>
      </nav>
    </div>
  );

  if (step === 'certificate') return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StepHeader title="Digital Trust Certificate" backStep="dashboard" />
      <div className="flex-1 p-6 flex flex-col items-center space-y-8 animate-in fade-in duration-500">
         
         <div className="w-full bg-white border-8 border-double border-emerald-600 p-8 shadow-2xl relative space-y-8">
            {/* Certificate Header */}
            <div className="text-center space-y-2">
               <Leaf className="mx-auto text-emerald-600 mb-4" size={48} />
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Carbon Sequestration Certificate</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Agri-Trust National Registry</p>
            </div>

            <div className="border-t border-b border-slate-100 py-6 text-center space-y-4">
               <p className="text-sm font-medium text-slate-500 italic">This document certifies that the farm belonging to</p>
               <h3 className="text-2xl font-black text-slate-900 border-b-2 border-slate-900 inline-block px-4">{mrvState.metadata?.farmerName || 'S. Patel'}</h3>
               <p className="text-xs font-bold text-slate-500 uppercase">Kisan ID: {mrvState.metadata?.farmerId}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center">
               <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Sequestration</p>
                  <p className="text-2xl font-black text-emerald-600">{mrvState.results?.credits || 0} tCO2e</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</p>
                  <p className="text-2xl font-black text-blue-600">{trustScore}%</p>
               </div>
            </div>

            {/* Robust QR and Trust Data */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-4">
               <QRCodeComponent data={mrvState.results?.blockchainTx || 'AGRI-TRUST-VERIFIED'} size={140} />
               <div className="text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Audit Proof (Blockchain Hash)</p>
                  <p className="text-[10px] font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-full mt-1">
                    {mrvState.results?.blockchainTx || '0x71C...4F31'}
                  </p>
               </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 leading-relaxed italic px-4">
              "This QR code is your digital proof. Buyers scan this to verify your farm's carbon data and the 9-layer verification integrity."
            </p>
         </div>

         <div className="w-full flex gap-4">
            <button className="flex-1 btn-primary bg-slate-900 text-white gap-2">
               <Download size={20}/> Download PDF
            </button>
            <button className="flex-1 btn-primary bg-emerald-600 text-white gap-2">
               <Printer size={20}/> Print
            </button>
         </div>
      </div>
    </div>
  );

  // --- REUSED STEPS ---

  if (step === 'map') return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <StepHeader title={t.get('step_map')} backStep="info" />
      <div className="flex-1 p-6 flex flex-col space-y-4">
        <div className="flex-1 relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
          <FarmMap 
            boundary={mrvState.boundary} 
            onBoundaryChange={c => setMrvState(p => ({...p, boundary: c}))} 
            layerMode={mapLayer}
          />
          <div className="absolute top-4 left-4 z-[1000] glass-morphism p-1.5 rounded-2xl flex gap-1">
            {(['optical', 'sar', 'soc'] as const).map(l => (
              <button key={l} onClick={() => setMapLayer(l)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mapLayer === l ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <button disabled={!mrvState.boundary || mrvState.boundary.length < 3} onClick={() => setStep('evidence')} className="w-full btn-primary bg-emerald-600 text-white shadow-xl shadow-emerald-200 text-lg gap-3">
          Confirm Boundaries <ChevronRight />
        </button>
      </div>
    </div>
  );

  if (step === 'evidence') return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StepHeader title={t.get('step_evidence')} backStep="map" />
      
      {activeCamera && (
        <CameraModule 
          category={activeCamera}
          farmerId={mrvState.metadata?.farmerId || "N/A"}
          location={mrvState.boundary?.[0] || null}
          onCapture={(base64) => handleImageCapture(activeCamera, base64)}
          onClose={() => setActiveCamera(null)}
        />
      )}

      <div className="flex-1 p-6 space-y-8 max-w-md mx-auto w-full">
         <div className="grid grid-cols-2 gap-4">
            {(['soil', 'crop', 'tree', 'pump'] as const).map(cat => {
              const hasImg = mrvState.images.find(img => img.category === cat);
              return (
                <button 
                  key={cat} 
                  onClick={() => setActiveCamera(cat)}
                  className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative ${
                    hasImg ? 'border-emerald-500 bg-white shadow-lg' : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  {hasImg ? (
                    <>
                      <img src={hasImg.data} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <CheckCircle2 size={32} className="text-emerald-600 relative z-10" />
                    </>
                  ) : (
                    <Camera className="text-slate-300" size={32}/>
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 relative z-10">{cat}</span>
                </button>
              );
            })}
         </div>
         <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
            <Info className="text-amber-600 shrink-0"/>
            <p className="text-xs font-bold text-amber-800 leading-tight">Professional Audit: Photos prove sustainable practices to buyers.</p>
         </div>
      </div>
      <div className="p-6">
         <button 
          onClick={handleStartAnalysis} 
          className="w-full btn-primary bg-slate-900 text-white shadow-xl text-lg gap-3"
         >
            Submit for 9-Layer Audit <ArrowRight />
         </button>
      </div>
    </div>
  );

  if (step === 'wallet') return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-slate-900 pt-16 pb-32 px-6 text-white relative">
         <StepHeader title="Khata / Wallet" backStep="dashboard" transparent />
         <div className="mt-8 flex flex-col items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total tradable value</span>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black">₹{((mrvState.results?.credits || 0) * 1850).toLocaleString()}</span>
               <span className="text-emerald-400 text-sm font-bold">INR</span>
            </div>
         </div>
      </header>
      <div className="px-6 -mt-16 space-y-6 relative z-10">
         <div className="dpi-card p-6 bg-white space-y-6 shadow-xl">
            <button onClick={() => setStep('dbt')} className="w-full btn-primary bg-emerald-600 text-white shadow-xl shadow-emerald-200">
               Transfer to Bank <ArrowUpRight className="ml-2" size={20}/>
            </button>
         </div>
      </div>
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 z-50">
         <div onClick={() => setStep('dashboard')} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${(step as string) === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <LayoutGrid size={24}/>
            <span className="text-[9px] font-black uppercase">Home</span>
         </div>
         <div onClick={() => setStep('map')} className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer">
            <MapIcon size={24}/>
            <span className="text-[9px] font-black uppercase">Field</span>
         </div>
         <div onClick={() => setStep('wallet')} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${(step as string) === 'wallet' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <Wallet size={24}/>
            <span className="text-[9px] font-black uppercase">Khata</span>
         </div>
      </nav>
    </div>
  );

  if (step === 'dbt') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center space-y-10">
       <ShieldCheck size={80} className="text-emerald-600 animate-bounce" />
       <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transfer Sent</h2>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto text-sm">
             Transfer sent to your Aadhaar-linked account.
          </p>
       </div>
       <button onClick={() => setStep('dashboard')} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          Back to Seller Hub
       </button>
    </div>
  );

  if (step === 'buyer') return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-slate-900 pt-16 pb-32 px-6 text-white relative">
         <StepHeader title="Credit Marketplace" backStep="login" transparent />
      </header>
      <div className="px-6 -mt-20 space-y-6 relative z-10 text-center text-slate-500 font-bold p-12 bg-white rounded-3xl">
         Coming Soon: Buyer ESG Scoring Engine
      </div>
    </div>
  );

  return null;
};

export default App;
