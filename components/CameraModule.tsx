
import React, { useState, useRef, useEffect } from 'react';
/* Added Loader2 to imports from lucide-react */
import { Camera, X, Zap, RefreshCcw, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Coordinates } from '../types';

interface CameraModuleProps {
  category: 'soil' | 'crop' | 'tree' | 'pump';
  farmerId: string;
  location: Coordinates | null;
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CATEGORY_META = {
  soil: {
    prompt: "Place a standard coin or ID card next to the soil for scale.",
    overlay: "circle",
    label: "Soil Texture"
  },
  crop: {
    prompt: "Center the camera on a representative healthy plant.",
    overlay: "grid",
    label: "Crop Health"
  },
  tree: {
    prompt: "Capture the full height of the tree from 5 meters away.",
    overlay: "silhouette",
    label: "Tree Count"
  },
  pump: {
    prompt: "Photograph the solar panel and pump controller clearly.",
    overlay: "square",
    label: "Solar Pump"
  }
};

const CameraModule: React.FC<CameraModuleProps> = ({ category, farmerId, location, onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMsg, setValidationMsg] = useState<{ type: 'error' | 'success' | 'info', text: string } | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      setError("Camera access denied. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const checkBrightness = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      colorSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const brightness = colorSum / (width * height);
    return brightness > 40; // Threshold for "too dark"
  };

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsValidating(true);
    setValidationMsg(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 1. Brightness Validation (Layer 1)
    const isBrightEnough = checkBrightness(ctx, canvas.width, canvas.height);
    if (!isBrightEnough) {
      setValidationMsg({ 
        type: 'error', 
        text: "Too Dark! Please take the photo in bright daylight for verification." 
      });
      setIsValidating(false);
      return;
    }

    // 2. Simulated Blur Check
    // For the demo, we simulate a "Hold Steady" if the user triggers capture while moving (random chance)
    if (Math.random() < 0.1) {
      setValidationMsg({ 
        type: 'error', 
        text: "Blur Detected! Hold steady and retake the photo." 
      });
      setIsValidating(false);
      return;
    }

    // 3. Watermarking (Layer 2 - Fraud Prevention)
    const timestamp = new Date().toLocaleString();
    const locStr = location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "GPS Data Pending";
    
    // Background for text legibility
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    
    // Text watermark
    ctx.fillStyle = "white";
    ctx.font = "bold 16px 'Plus Jakarta Sans'";
    ctx.fillText(`FARMER ID: ${farmerId}`, 20, canvas.height - 50);
    ctx.fillText(`LOC: ${locStr} | TIME: ${timestamp}`, 20, canvas.height - 25);
    ctx.fillText(`MODULE: ${CATEGORY_META[category].label} | AGRI-TRUST MRV`, 20, canvas.height - 5);

    // Final Success
    setValidationMsg({ type: 'success', text: "Verification Successful!" });
    
    setTimeout(() => {
      onCapture(canvas.toDataURL('image/jpeg', 0.8));
      setIsValidating(false);
    }, 1000);
  };

  const meta = CATEGORY_META[category];

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between glass-morphism border-none rounded-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">{meta.label} Capture</h3>
            <p className="text-[10px] opacity-60 font-medium">Layer 1: Edge Validation</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <X size={24} />
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-900">
        {error ? (
          <div className="p-8 text-center space-y-4">
            <AlertTriangle size={48} className="mx-auto text-amber-500" />
            <p className="font-bold">{error}</p>
            <button onClick={startCamera} className="px-6 py-2 bg-emerald-600 rounded-xl font-bold">Retry</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Ghost Frame Overlays */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {category === 'soil' && (
                <div className="w-64 h-64 border-2 border-dashed border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-white/20 rounded-full" />
                </div>
              )}
              {category === 'crop' && (
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white/10" />
                  ))}
                </div>
              )}
              {category === 'tree' && (
                <div className="w-1/2 h-4/5 border-2 border-white/20 rounded-full relative bottom-[-10%] opacity-30">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-white/10" />
                </div>
              )}
              {category === 'pump' && (
                <div className="w-4/5 h-1/2 border-2 border-white/30 rounded-3xl" />
              )}
            </div>

            {/* Validation Feedback */}
            {validationMsg && (
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-2xl ${
                validationMsg.type === 'error' ? 'bg-red-500 text-white' : 
                validationMsg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {validationMsg.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                <p className="text-xs font-bold leading-tight">{validationMsg.text}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Controls */}
      <div className="bg-black/80 backdrop-blur-xl p-8 space-y-6">
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <Info className="text-emerald-400 shrink-0" size={20} />
          <p className="text-[11px] font-medium leading-relaxed opacity-80">
            {meta.prompt}
          </p>
        </div>

        <div className="flex items-center justify-center gap-10">
          <button className="p-4 bg-white/5 rounded-full opacity-40 cursor-not-allowed">
            <RefreshCcw size={28} />
          </button>
          
          <button 
            onClick={capture}
            disabled={isValidating || !!error}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
              isValidating ? 'bg-white/20' : 'bg-white active:scale-90 shadow-2xl shadow-white/20'
            }`}
          >
            {isValidating ? (
              <Loader2 className="animate-spin text-white" size={32} />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-slate-900" />
            )}
          </button>

          <button onClick={startCamera} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <RefreshCcw size={28} />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraModule;
