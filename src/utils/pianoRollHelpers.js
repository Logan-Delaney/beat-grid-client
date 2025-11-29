import NOTES from "../constants/notes.js";

const getNotesInOctave = (octave) => {
    let octaveNotes = [];
    for (let note of NOTES){
        octaveNotes.push(note + octave);
    }
    return octaveNotes;
}

const getBeatsInMeasure = (allBeats, measureIndex) => {
    let startingIndex = measureIndex * 4;
    let endingIndex = startingIndex + 4;
    return allBeats.slice(startingIndex, endingIndex);
}

export {  getNotesInOctave, getBeatsInMeasure };