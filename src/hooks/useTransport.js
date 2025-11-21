import { useState, useCallback } from 'react';
import * as Tone from 'tone';

export const useTransport = (initialBpm = 120) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(initialBpm);

    const play = useCallback(() => {
        if (!isPlaying) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [isPlaying]);

    const stop = useCallback(() => {
        setIsPlaying(false);
        Tone.getTransport().stop();
    }, []);

    const setBpm = useCallback((newBpm) => {
        if (newBpm >= 60 && newBpm <= 250) {
            setTempo(newBpm);
        }
    }, []);

    return {
        isPlaying,
        tempo,
        play,
        stop,
        setBpm
    };
};