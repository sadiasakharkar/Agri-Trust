
import React, { useState, useRef } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { getVoiceGuidance, decode, decodeAudioData } from '../services/geminiService';

interface VoiceAssistantProps {
  text: string;
  language: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ text, language }) => {
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handlePlay = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const base64Audio = await getVoiceGuidance(text, language);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 24000
          });
        }
        
        const ctx = audioContextRef.current;
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      } else {
         alert("Voice guidance unavailable.");
      }
    } catch (error) {
      console.error("Audio error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePlay}
      disabled={loading}
      className="fixed bottom-6 right-6 w-12 h-12 bg-white text-emerald-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 disabled:opacity-50 border border-emerald-100"
      aria-label="Play Voice Guidance"
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default VoiceAssistant;
