import { useState } from 'react';
import BEAT_TYPES from './constants/beatTypes';

function App() {

    const [tempo, setTempo] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [track, setTrack] = useState({
        id: 'kick-track-1',
        instrument: 'kick',
        beats: [
            {type: 'straight', notes: [0, 0, 0, 0]},
            {type: 'straight', notes: [0, 0, 0, 0]},
            {type: 'straight', notes: [0, 0, 0, 0]},
            {type: 'straight', notes: [0, 0, 0, 0]}
        ]
    });

    const toggleNote = (beatIndex, subdivisionIndex) => {
        setTrack(prevTrack => ({
            ...prevTrack,  // Copy track object
            beats: prevTrack.beats.map((beat, i) =>
                i === beatIndex
                    ? {
                        ...beat,  // Copy the beat object
                        notes: beat.notes.map((note, j) =>
                            j === subdivisionIndex ? (note ? 0 : 1) : note  // Copy notes array
                        )
                    }
                    : beat  // Keep other beats unchanged
            )
        }));
    }

    const changeBeatType = (beatIndex, newType) => {
        setTrack(prevTrack => ({
            ...prevTrack,
            beats: prevTrack.beats.map((beat, i) =>
                i === beatIndex
                    ? {
                        type: newType,
                        notes: new Array(BEAT_TYPES[newType].subdivisions).fill(0)
                    }
                    : beat
            )
        }));
    }

    const handlePlay = () => {
        if (!isPlaying) {
            setIsPlaying(true);
        }
        else {
            setIsPlaying(false);
        }
    }

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentStep(0);
    }

    const handleBpmChange = (newBpm) => {
        if (newBpm >= 60 && newBpm <= 250) {
            setTempo(newBpm);
        }
    }

    return (
        <div className="App">
            <h1>BeatGrid</h1>
            <p>Drum sequencer coming soon...</p>
        </div>
    );
}

export default App;