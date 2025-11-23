import React from "react";
import './BPMControl.css';

function MeasureControl({ measures, onMeasuresChange }) {
    const [value, setValue] = React.useState(measures);

    const handleInputChange = (event) => {
        let newMeasures = event.target.value;
        setValue(newMeasures);
    }

    const handleBlur = () => {
        let num = Number(value);
        if (Number.isNaN(num)) {
            setValue(1);
        }
        if (num < 1){
            setValue(1);
        }
        if (num > 16){
            setValue(16);
        }
        onMeasuresChange(value);
    }

    return (
        <div className="bpm-control">
            <label>Measures:</label>

            <input
                type="number"
                min={1}
                max={16}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="bpm-input"
            />
        </div>
    );
}

export default MeasureControl;