import React from "react";
import './BPMControl.css';

function BPMControl({ bpm, onBpmChange }) {
    const [value, setValue] = React.useState(bpm);

    const handleSliderChange = (event) => {
        const newBPM = parseInt(event.target.value, 10);
        onBpmChange(newBPM);
    }

    const handleInputChange = (event) => {
        let newBPM = event.target.value;
        setValue(newBPM);
    }

    const handleBlur = () => {
        let num = Number(value);
        if (Number.isNaN(num)) {
            setValue(120);
        }
        if (num < 60){
            setValue(60);
        }
        if (num > 250){
            setValue(250);
        }
        onBpmChange(value);
    }

    return (
        <div className="bpm-control">
            <label>BPM:</label>

            <input
                type="number"
                min={60}
                max={250}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
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