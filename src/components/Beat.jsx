import React from "react";
import './Beat.css';

function Beat({ track, beatIndex, onToggle, onTypeChange, currentStep, isPlaying }) {
    const beat = track.beats[beatIndex];

    const getLocalStepIndex = () => {
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
        onToggle(beatIndex, subdivisionIndex);
    }

    const handleTypeChange = (event) => {
        onTypeChange(beatIndex, event.target.value);
    }

    const localStep = getLocalStepIndex();

    return (
        <div className="beat-container">
            <div className="beat-header">
                <label className="beat-label">{beatIndex + 1}</label>
                <select
                    className="beat-type-selector"
                    value={beat.type}
                    onChange={handleTypeChange}
                >
                    <option value="straight">Straight</option>
                    <option value="triplet">Triplet</option>
                </select>
            </div>

            <div className="beat-grid">
                {beat.notes.map((note, index) => (
                    <button
                        key={index}
                        className={`beat-cell ${note === 1 ? 'beat-cell--active' : ''} ${localStep === index && isPlaying ? 'beat-cell--playing' : ''}`}
                        onClick={() => handleCellClick(index)}
                        aria-label={`Beat ${beatIndex + 1}, subdivision ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Beat;