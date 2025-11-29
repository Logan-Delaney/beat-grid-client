import React from "react";
import './Beat.css';

function Beat({ tracks, trackIndex, beatIndex, onToggle, onTypeChange, currentStep, isPlaying }) {
    const track = tracks[trackIndex];
    const beat = track.beats[beatIndex];

    const getLocalStepIndex = () => {
        // Count steps from all previous beats in THIS track
        let stepCounter = 0;
        for (let i = 0; i < beatIndex; i++) {
            stepCounter += track.beats[i].notes.length;
        }

        const startStep = stepCounter;
        const endStep = stepCounter + beat.notes.length;

        if (currentStep >= startStep && currentStep < endStep) {
            return currentStep - startStep;
        }
        return null;
    }

    const handleCellClick = (subdivisionIndex) => {
        onToggle(trackIndex, beatIndex, subdivisionIndex);
    }

    const handleTypeChange = (event) => {
        onTypeChange(trackIndex, beatIndex, event.target.value);
    }

    const localStep = getLocalStepIndex();

    const beatNumber = ((beatIndex + 1) % 4) || 4;        // cycles 1–4
    const isFirstBeat = beatNumber === 1;
    const barNumber = (beatIndex + 4) / 4;

    return (
        <div className="beat-container">
            <div className="beat-header">
                <label className={`beat-label ${isFirstBeat ? 'beat-label--measure-start' : ''}`}>{isFirstBeat ? `Bar ${barNumber}` : `Beat ${beatNumber}`}</label>
                <button
                    className="beat-type-toggle"
                    onClick={() => {
                        const newType = beat.type === 'straight' ? 'triplet' : 'straight';
                        handleTypeChange({ target: { value: newType } });
                    }}
                    aria-label={`Switch to ${beat.type === 'straight' ? 'triplet' : 'straight'}`}
                >
                    {beat.type === 'straight' ? '4' : '3'}
                </button>
            </div>

            <div className="beat-grid">
                {beat.notes.map((note, index) => (
                    <button
                        key={index}
                        className={`beat-cell ${note.active === 1 ? 'beat-cell--active' : ''} ${localStep === index && isPlaying ? 'beat-cell--playing' : ''}`}
                        onClick={() => handleCellClick(index)}
                        aria-label={`Beat ${beatIndex + 1}, subdivision ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Beat;