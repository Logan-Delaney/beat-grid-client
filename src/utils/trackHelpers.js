export const createEmptyBeats = (count = 4) => {
    return Array(count).fill(null).map(() => ({
        type: 'straight',
        notes: Array.from({ length: 4 }, () => ({
            active: 0,
            pitch: null
        })),
    }));
};

export const generateTracksFromSamples = (samples, synths, measures) => {
    const beats = measures * 4;
    const instrumentNames = [
        ...Object.keys(samples),
        ...Object.keys(synths)
    ];
    return instrumentNames.map((instrumentName, index) => ({
        id: `${instrumentName}-track-${index}`,
        instrument: instrumentName,
        isPitched: !!synths[instrumentName],
        beats: createEmptyBeats(beats),
    }));
};