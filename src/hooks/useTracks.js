import { useState, useEffect, useCallback } from 'react'
import { generateInitialTrack, createEmptyBeats } from "../utils/trackHelpers.js";
import { toggleNoteInTracks, changeBeatTypeInTracks } from "../utils/stateHelpers.js";

export const useTracks = (samplesRef, synthsRef, samplesLoaded, synthsLoaded, measures) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        if (samplesLoaded && samplesRef.current && synthsRef.current && synthsLoaded ) {
            const generated = generateInitialTrack(samplesRef.current, synthsRef.current, measures);
            setTracks(generated);
        }
    }, [samplesLoaded, samplesRef, synthsRef, synthsLoaded, measures]);

    const toggleNote = useCallback((trackIndex, beatIndex, subdivIndex) => {
        setTracks(prev => toggleNoteInTracks(prev, trackIndex, beatIndex, subdivIndex));
    }, []);

    const changeBeatType = useCallback((trackIndex, beatIndex, newType) => {
        setTracks(prev => changeBeatTypeInTracks(prev, trackIndex, beatIndex, newType));
    }, []);

    const setAllBeatsToType = useCallback((beatType) => {
        setTracks(prev => {
            return prev.map(track => ({
                ...track,
                beats: track.beats.map(beat => {
                    if (beat.type === beatType) {
                        return beat;
                    }

                    return {
                        ...beat,
                        type: beatType,
                        notes: beatType === 'straight'
                            ? Array(4).fill(null).map(() => ({ active: 0, pitch: null }))
                            : Array(3).fill(null).map(() => ({ active: 0, pitch: null }))
                    };
                })
            }));
        });
    }, []);

    const clearTracks = useCallback(() => {
        setTracks(prev => {
            return prev.map(track => ({
                ...track,
                beats: createEmptyBeats(measures * 4)
            }));
        });
    }, [measures]);

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

    const addTrack = useCallback((instrumentName, isPitched) => {
        setTracks(prev => {
            const newTrack = {
                id: `${instrumentName}-track-${Date.now()}`,
                instrument: instrumentName,
                isPitched: isPitched,
                beats: createEmptyBeats(measures * 4),
            };
            return [...prev, newTrack];
        });
    }, [measures]);

    const removeTrack = useCallback((trackIndex) => {
        setTracks(prev => {
            if (prev.length <= 1) {
                return prev;
            }
            return prev.filter((_, index) => index !== trackIndex);
        });
    }, []);

    return { tracks, setTracks, toggleNote, changeBeatType, clearTracks, updateNotePitch, addTrack, removeTrack, setAllBeatsToType };
};