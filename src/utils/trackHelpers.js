export const createEmptyBeats = (count = 4) => {
    return Array(count).fill(null).map(() => ({
        type: 'straight',
        notes: [0, 0, 0, 0]
    }));
};

export const generateTracksFromSamples = (samples, measures) => {
    const beats = measures * 4;
    const instrumentNames = Object.keys(samples);
    return instrumentNames.map((instrumentName, index) => ({
        id: `${instrumentName}-track-${index}`,
        instrument: instrumentName,
        beats: createEmptyBeats(beats)
    }));
};