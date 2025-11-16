import React from "react";
import './BPMControl.css';

function BPMControl({ bpm, onBpmChange }) {

    const handleSliderChange = (event) => {
        const newBPM = parseInt(event.target.value, 10);
        onBpmChange(newBPM);
    }

    const handleInputChange = (event) => {
        let newBPM = parseInt(event.target.value, 10);

        if (event.target.value === '') return;

        if (isNaN(newBPM)) return;

        if (newBPM < 60) newBPM = 60;
        if (newBPM > 250) newBPM = 250;

        onBpmChange(newBPM);
    }

    return (
        <div className="bpm-control">
            <label>BPM:</label>

            <input
                type="number"
                min={60}
                max={250}
                value={bpm}
                onChange={handleInputChange}
                className="bpm-input"
            />

            <input
                type="range"
                min={60}
                max={250}
                value={bpm}
                onChange={handleSliderChange}
                className="bpm-slider"
            />
        </div>
    );
}

export default BPMControl;