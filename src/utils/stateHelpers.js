export const toggleNoteInTracks = (tracks, trackIndex, beatIndex, subdivIndex) => {
    const newTracks = [...tracks];
    newTracks[trackIndex] = { ...tracks[trackIndex] };
    newTracks[trackIndex].beats = [...tracks[trackIndex].beats];
    newTracks[trackIndex].beats[beatIndex] = { ...tracks[trackIndex].beats[beatIndex] };
    newTracks[trackIndex].beats[beatIndex].notes = [...tracks[trackIndex].beats[beatIndex].notes];

    const currentValue = tracks[trackIndex].beats[beatIndex].notes[subdivIndex];
    newTracks[trackIndex].beats[beatIndex].notes[subdivIndex] = {
        active: currentValue.active === 1 ? 0 : 1,
        pitch: currentValue.pitch
    }
    return newTracks;
};

export const changeBeatTypeInTracks = (tracks, trackIndex, beatIndex, newType) => {
    const newTracks = [...tracks];
    newTracks[trackIndex] = { ...tracks[trackIndex] };
    newTracks[trackIndex].beats = [...tracks[trackIndex].beats];

    const subdivisions = newType === 'straight' ? 4 : 3;
    newTracks[trackIndex].beats[beatIndex] = {
        type: newType,
        notes: new Array(subdivisions).fill(null).map(() => ({
            active: 0,
            pitch: null,
        }))
    };

    return newTracks;
};