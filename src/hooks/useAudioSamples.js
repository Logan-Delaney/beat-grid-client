import {useEffect, useRef, useState} from 'react';
import getSamples from '../utils/audioEngine';

export const useAudioSamples = () => {
    const [samplesLoaded, setSamplesLoaded] = useState(false);
    const samplesRef = useRef(null);

    useEffect(() => {
        const loadAudio = async () => {
            samplesRef.current = await getSamples();
            setSamplesLoaded(true);
        };
        loadAudio();
    }, []);

    return {
        samplesRef,
        samplesLoaded,
    };
};