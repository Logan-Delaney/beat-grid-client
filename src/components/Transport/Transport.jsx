import { useState } from 'react';
import * as Tone from 'tone';

function Transport({ isPlaying, onPlay, onStop, samplesLoaded }){
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
        </div>
    );
}

export default Transport;