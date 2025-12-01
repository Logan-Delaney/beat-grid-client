import { useState } from 'react';
import * as Tone from 'tone';
import './Transport.css';

function Transport({ isPlaying, onPlay, onStop, samplesLoaded, loop, onToggleLoop }) {
    const [audioInitialized, setAudioInitialized] = useState(false);

    const handlePlay = async () => {
        if (!audioInitialized) {
            await Tone.start()
            setAudioInitialized(true);
        }
        onPlay();
    }

    const handleStop = () => {
        onStop();
    }

    return (
        <div className="transport-controls">
            <button
                onClick={handlePlay}
                disabled={!samplesLoaded}
            >
                {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
                onClick={handleStop}
                disabled={!samplesLoaded || !isPlaying}
            >
                Stop
            </button>

            <button
                className={`transport-button transport-button--loop ${loop ? 'transport-button--loop-active' : ''}`}
                onClick={onToggleLoop}
                disabled={!samplesLoaded || isPlaying}
                title={loop ? 'Loop: On' : 'Loop: Off'}
            >
                LOOP
            </button>
        </div>
    );
}

export default Transport;