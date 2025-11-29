import {useEffect, useRef, useState} from 'react';
import { getSamples, getSynths } from '../utils/audioEngine';

export const useAudioSamples = () => {
    const [samplesLoaded, setSamplesLoaded] = useState(false);
    const [synthsLoaded, setSynthsLoaded] = useState(false);
    const synthsRef = useRef(null);
    const samplesRef = useRef(null);

    useEffect(() => {
        const loadAudio = async () => {
            samplesRef.current = await getSamples();
            synthsRef.current = await getSynths();
            setSamplesLoaded(true);
            setSynthsLoaded(true);
        };
        loadAudio();
    }, []);

    return {
        samplesRef,
        synthsRef,
        samplesLoaded,
        synthsLoaded,
    };
};