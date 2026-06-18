import React from 'react';
import { Pause, Play, Square, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const AudioPlayer = ({ text, title }) => {
  const { isSupported, isSpeaking, isPaused, speak, pause, resume, cancel } = useTextToSpeech();

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
    <div className="mb-8 flex items-center justify-between bg-neutral-50 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-700">
          <Volume2 size={24} />
        </div>
        <div>
          <h4 className="font-serif text-lg font-black text-neutral-900">Écouter l'article</h4>
          <p className="font-display text-sm text-neutral-500">Version audio générée par IA</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isSpeaking && !isPaused ? (
          <button onClick={handlePlay} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700" title="Lire">
            <Play size={18} fill="currentColor" />
          </button>
        ) : (
          <>
            {isSpeaking ? (
              <button onClick={pause} className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50" title="Pause">
                <Pause size={18} fill="currentColor" />
              </button>
            ) : (
              <button onClick={resume} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700" title="Reprendre">
                <Play size={18} fill="currentColor" />
              </button>
            )}
            <button onClick={cancel} className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300" title="Arrêter">
              <Square size={16} fill="currentColor" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
