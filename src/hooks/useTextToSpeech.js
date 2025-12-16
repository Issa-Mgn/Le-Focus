
import { useState, useEffect, useRef } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsSupported(true);
        }

        // Cleanup on unmount
        return () => {
            cancel();
        };
    }, []);

    const speak = (text) => {
        if (!isSupported) return;

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR'; // French by default
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const pause = () => {
        if (!isSupported) return;
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsSpeaking(false); // Visually paused
        }
    };

    const resume = () => {
        if (!isSupported) return;
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        }
    };

    const cancel = () => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    return { isSupported, isSpeaking, isPaused, speak, pause, resume, cancel };
};
