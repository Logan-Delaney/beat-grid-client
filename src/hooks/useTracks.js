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

    const updateNotePitch = useCallback((trackIndex, beatIndex, subdivIndex, pitch) => {
        setTracks(prevTracks => {
            const newTracks = prevTracks.map((track, tIdx) => {
                if (tIdx !== trackIndex) return track;

                return {
                    ...track,
                    beats: track.beats.map((beat, bIdx) => {
                        if (bIdx !== beatIndex) return beat;

                        return {
                            ...beat,
                            notes: beat.notes.map((note, nIdx) => {
                                if (nIdx !== subdivIndex) return note;

                                if (note.active === 1 && note.pitch === pitch) {
                                    return { active: 0, pitch: null };
                                }
                                return { active: 1, pitch: pitch };
                            })
                        };
                    })
                };
            });

            return newTracks;
        });
    }, []);

    return { tracks, setTracks, toggleNote, changeBeatType, clearTracks, updateNotePitch };
};