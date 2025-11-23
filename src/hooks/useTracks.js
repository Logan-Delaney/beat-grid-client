import { useState, useEffect, useCallback } from 'react'
import { generateTracksFromSamples } from "../utils/trackHelpers.js";
import { toggleNoteInTracks, changeBeatTypeInTracks } from "../utils/stateHelpers.js";

export const useTracks = (samplesRef, synthsRef, samplesLoaded, synthsLoaded, measures) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        if (samplesLoaded && samplesRef.current && synthsRef.current && synthsLoaded ) {
            const generated = generateTracksFromSamples(samplesRef.current, synthsRef.current, measures);
            setTracks(generated);
        }
    }, [samplesLoaded, samplesRef, synthsRef, synthsLoaded, measures]);

    const toggleNote = useCallback((trackIndex, beatIndex, subdivIndex) => {
        setTracks(prev => toggleNoteInTracks(prev, trackIndex, beatIndex, subdivIndex));
    }, []);

    const changeBeatType = useCallback((trackIndex, beatIndex, newType) => {
        setTracks(prev => changeBeatTypeInTracks(prev, trackIndex, beatIndex, newType));
    }, []);

    const clearTracks = useCallback(() => {
        setTracks(generateTracksFromSamples(samplesRef.current, synthsRef.current, measures));
    }, [samplesRef, synthsRef, measures]);

    return { tracks, setTracks, toggleNote, changeBeatType, clearTracks };
};