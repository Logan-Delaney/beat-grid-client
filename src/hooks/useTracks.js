import { useState, useEffect, useCallback } from 'react'
import { generateTracksFromSamples } from "../utils/trackHelpers.js";
import { toggleNoteInTracks, changeBeatTypeInTracks } from "../utils/stateHelpers.js";

export const useTracks = (samplesRef, samplesLoaded, measures) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        if (samplesLoaded && samplesRef.current) {
            const generated = generateTracksFromSamples(samplesRef.current, measures);
            setTracks(generated);
        }
    }, [samplesLoaded, samplesRef, measures]);

    const toggleNote = useCallback((trackIndex, beatIndex, subdivIndex) => {
        setTracks(prev => toggleNoteInTracks(prev, trackIndex, beatIndex, subdivIndex));
    }, []);

    const changeBeatType = useCallback((trackIndex, beatIndex, newType) => {
        setTracks(prev => changeBeatTypeInTracks(prev, trackIndex, beatIndex, newType));
    }, []);

    return { tracks, setTracks, toggleNote, changeBeatType };
};