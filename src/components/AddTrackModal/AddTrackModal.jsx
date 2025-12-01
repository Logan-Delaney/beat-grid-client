import { useState } from 'react';
import './AddTrackModal.css';

function AddTrackModal({ isOpen, onClose, onAddTrack, existingInstruments, samples, synths }) {
    const [category, setCategory] = useState('drums');

    const handleBackdropClick = () => {
        onClose();
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleAddInstrument = (instrumentName, isPitched) => {
        onAddTrack(instrumentName, isPitched);
        onClose();
    };

    if (!isOpen || !samples.current || !synths.current) return null;

    const drumInstruments = Object.keys(samples.current);
    const synthInstruments = Object.keys(synths.current);

    return (
        <div className="add-track-backdrop" onClick={handleBackdropClick}>
            <div className="add-track-modal" onClick={handleModalClick}>
                <div className="add-track-header">
                    <h2>Add Track</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="category-tabs">
                    <button
                        className={`category-tab ${category === 'drums' ? 'category-tab--active' : ''}`}
                        onClick={() => setCategory('drums')}
                    >
                        Drums
                    </button>
                    <button
                        className={`category-tab ${category === 'synths' ? 'category-tab--active' : ''}`}
                        onClick={() => setCategory('synths')}
                    >
                        Synths
                    </button>
                </div>

                <div className="instruments-list">
                    {category === 'drums' && drumInstruments.map((instrument) => {
                        const isDisabled = existingInstruments.includes(instrument);
                        return (
                            <button
                                key={instrument}
                                className={`instrument-button ${isDisabled ? 'instrument-button--disabled' : ''}`}
                                onClick={() => !isDisabled && handleAddInstrument(instrument, false)}
                                disabled={isDisabled}
                            >
                                {instrument.toUpperCase()}
                                {isDisabled && <span className="already-added"> (Added)</span>}
                            </button>
                        );
                    })}

                    {category === 'synths' && synthInstruments.map((instrument) => {
                        const isDisabled = existingInstruments.includes(instrument);
                        return (
                            <button
                                key={instrument}
                                className={`instrument-button ${isDisabled ? 'instrument-button--disabled' : ''}`}
                                onClick={() => !isDisabled && handleAddInstrument(instrument, true)}
                                disabled={isDisabled}
                            >
                                {instrument.toUpperCase()}
                                {isDisabled && <span className="already-added"> (Added)</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default AddTrackModal;