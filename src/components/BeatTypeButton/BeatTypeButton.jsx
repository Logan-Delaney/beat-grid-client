import React from 'react';
import './BeatTypeButton.css';

function BeatTypeButton({ onChangeBeat, beatType }) {
    return (
        <button
            className="rhythm-toggle-button"
            onClick={() => onChangeBeat(beatType)}
            aria-label="Change Beat Type"
        >
            {beatType === 'straight' ? 'All 4' : 'All 3'}
        </button>
    );
}

export default BeatTypeButton;