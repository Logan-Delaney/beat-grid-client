import React from 'react';
import './Clear.css';

function Clear({ onClear }) {
    return (
        <button
            className="clear-button"
            onClick={onClear}
            aria-label="Clear all tracks"
        >
            Clear All
        </button>
    );
}

export default Clear;