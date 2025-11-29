import {useEffect, useState} from 'react'
import './PianoRollModal.css';
import { getNotesInOctave, getBeatsInMeasure } from "../../utils/pianoRollHelpers.js";
import NOTES from "../../constants/notes.js";

function PianoRollModal({ isOpen, onClose, trackIndex, beatIndex, tracks, onUpdateNote }) {
    const measureIndex = Math.floor(beatIndex / 4);
    const [measure, setMeasure] = useState(measureIndex);
    const [octave, setOctave] = useState(2);

    const handleBackdropClick = () => {
        onClose();
    }

    const handleModalClick = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const track = tracks[trackIndex];
    const totalMeasures = Math.ceil(track.beats.length / 4);
    const currentMeasureBeats = getBeatsInMeasure(track.beats, measure);
    const noteNames = NOTES;
    const notePitches = getNotesInOctave(octave);

    const handleCellClick = (beatIdxInMeasure, subdivIndex, pitch) => {
        const actualBeatIndex = (measure * 4) + beatIdxInMeasure;
        onUpdateNote(trackIndex, actualBeatIndex, subdivIndex, pitch);
    }

    const handlePreviousMeasure = () => {
        if (measure > 0){
            setMeasure(measure - 1);
        }
    }

    const handleNextMeasure = () => {
        if (measure < totalMeasures - 1) {
            setMeasure(measure + 1);
        }
    }

    const handleOctaveDown = () => {
        if (octave > 1){
            setOctave(octave - 1);
        }
    }

    const handleOctaveUp = () => {
        if (octave < 5){
            setOctave(octave + 1);
        }
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container" onClick={handleModalClick}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {track.instrument} - Piano Roll
                    </h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="measure-navigation">
                    <button
                        className="nav-button"
                        onClick={handlePreviousMeasure}
                        disabled={measure === 0}
                        >← Prev
                    </button>
                    <span className="measure-display">
                        Measure {measure + 1} / {totalMeasures}
                    </span>
                    <button
                        className="nav-button"
                        onClick={handleNextMeasure}
                        disabled={measure === totalMeasures - 1}
                        >Next →
                    </button>
                </div>
                <div className="octave-controls">
                    <button
                        className="octave-button"
                        onClick={handleOctaveDown}
                        disabled={octave === 1}
                        >↓
                    </button>
                    <span className="octave-display">Octave {octave}</span>
                    <button
                        className="octave-button"
                        onClick={handleOctaveUp}
                        disabled={octave === 5}
                        >↑
                    </button>
                </div>
                <div className="piano-roll-grid">
                    <div className="note-labels">
                        {noteNames.map((noteName, index) => (
                            <div key={index} className="note-label">
                                {noteName}
                            </div>
                        ))}
                    </div>

                    <div className="grid-area">
                        {noteNames.map((noteName, rowIndex) => (
                            <div key={rowIndex} className="grid-row">
                                {currentMeasureBeats.map((beat, beatIdx) => {
                                    const notePitch = notePitches[rowIndex];

                                    return (
                                        <div key={beatIdx} className="beat-column">
                                            {beat.notes.map((note, subdivIdx) => {
                                                const isActive = note.active === 1 && note.pitch === notePitch;

                                                return (
                                                    <div
                                                        key={subdivIdx}
                                                        className={`grid-cell ${isActive ? 'grid-cell--active' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleCellClick(beatIdx, subdivIdx, notePitch);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PianoRollModal;