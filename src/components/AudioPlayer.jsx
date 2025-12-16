
import React from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const AudioPlayer = ({ text, title }) => {
  const { isSupported, isSpeaking, isPaused, speak, pause, resume, cancel } = useTextToSpeech();

  if (!isSupported) return null;

  // clean text for better speech
  const cleanText = `${title}. ${text}`.replace(/<[^>]*>?/gm, '');

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else {
      speak(cleanText);
    }
  };

  return (
    <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between border border-neutral-100 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary-100 p-2 rounded-full text-primary-600">
            <Volume2 size={24} />
        </div>
        <div>
            <h4 className="font-bold text-neutral-800 text-sm">Écouter l'article</h4>
            <p className="text-xs text-neutral-500">Version audio générée par IA</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isSpeaking && !isPaused ? (
             <button 
             onClick={handlePlay}
             className="w-10 h-10 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
             title="Lire"
           >
             <Play size={18} fill="currentColor" />
           </button>
        ) : (
            <>
                 {isSpeaking ? (
                    <button 
                        onClick={pause}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-50 transition-colors"
                        title="Pause"
                    >
                        <Pause size={18} fill="currentColor" />
                    </button>
                 ) : (
                    <button 
                        onClick={resume}
                        className="w-10 h-10 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                        title="Reprendre"
                    >
                        <Play size={18} fill="currentColor" />
                    </button>
                 )}

                <button 
                    onClick={cancel}
                    className="w-10 h-10 flex items-center justify-center bg-neutral-200 text-neutral-600 rounded-full hover:bg-neutral-300 transition-colors"
                    title="Arrêter"
                >
                    <Square size={16} fill="currentColor" />
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
