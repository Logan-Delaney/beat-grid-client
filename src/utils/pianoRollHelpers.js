import NOTES from "../constants/notes.js";

const getNotesInOctave = (octave) => {
    let octaveNotes = [];
    for (let note of NOTES){
        octaveNotes.push(note + octave);
    }
    return octaveNotes;
}

const calculateTotalColumns = (beatsArray) => {
    let columns = 0;
    for (let beat of beatsArray) {
        columns += beat.notes.length;
    }
    return columns;
}

const getPitchFromNoteAndOctave = (note, octave) => {
    return note + String(octave);
}

const getBeatsInMeasure = (allBeats, measureIndex) => {
    let startingIndex = measureIndex * 4;
    let endingIndex = startingIndex + 4;
    return allBeats.slice(startingIndex, endingIndex);
}

export {  getNotesInOctave, calculateTotalColumns, getPitchFromNoteAndOctave, getBeatsInMeasure };