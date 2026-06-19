import React from 'react';
import { Pause, Play, Square, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import SpinnerSmall from './SpinnerSmall';

const AudioPlayer = ({ text, title }) => {
  const { isSupported, isSpeaking, isPaused, isLoading, speak, pause, resume, cancel } = useTextToSpeech();

  if (!isSupported) return null;

  const cleanText = `${title}. ${text}`.replace(/<[^>]*>?/gm, '');

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else {
      speak(cleanText);
    }
  };

  return (
    <div className="mb-8 flex items-center justify-between bg-neutral-50 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary-500-temp">
          <Volume2 size={20} />
        </div>
        <div>
          <h4 className="font-serif text-[16px] font-black text-neutral-900">Écouter l'article</h4>
          <p className="font-display text-xs text-neutral-500">Version audio générée par IA</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <button disabled className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white opacity-70">
            <SpinnerSmall size={16} color="#ffffff" />
          </button>
        ) : !isSpeaking && !isPaused ? (
          <button onClick={handlePlay} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-500-temp" title="Lire">
            <Play size={16} fill="currentColor" />
          </button>
        ) : (
          <>
            {isSpeaking ? (
              <button onClick={pause} className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50" title="Pause">
                <Pause size={16} fill="currentColor" />
              </button>
            ) : (
              <button onClick={resume} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-500-temp" title="Reprendre">
                <Play size={16} fill="currentColor" />
              </button>
            )}
            <button onClick={cancel} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300" title="Arrêter">
              <Square size={14} fill="currentColor" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
