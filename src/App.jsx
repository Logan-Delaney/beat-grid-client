import {useState, useRef, useEffect} from 'react';
import BEAT_TYPES from './constants/beatTypes';
import getSamples from './utils/audioEngine';
import useSequencer from "./hooks/useSequencer.js";
import * as Tone from 'tone';
import Transport from './components/Transport';

function App() {

    const [tempo, setTempo] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [samplesLoaded, setSamplesLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState(null);
    const [track, setTrack] = useState({
        id: 'kick-track-1',
        instrument: 'kick',
        beats: [
            {type: 'straight', notes: [1, 0, 0, 0]},
            {type: 'straight', notes: [1, 0, 0, 0]},
            {type: 'straight', notes: [1, 0, 0, 0]},
            {type: 'straight', notes: [1, 0, 0, 0]}
        ]
    });

    const samplesRef = useRef(null);

    const { currentStep } = useSequencer(track, tempo, samplesRef, isPlaying);

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

    const handlePlay = async () => {
        if (!isPlaying) {
            await Tone.start();  // Call Tone.start() FIRST
            setIsPlaying(true);
        }
        else {
            setIsPlaying(false);
        }
    }

    const handleStop = () => {
        setIsPlaying(false);
        Tone.getTransport().stop();
    }

    const handleBpmChange = (newBpm) => {
        if (newBpm >= 60 && newBpm <= 250) {
            setTempo(newBpm);
        }
    }

    useEffect(() => {
        const initAudio = async () => {
            try {
                const samples = await getSamples();
                samplesRef.current = samples;
                setSamplesLoaded(true);
            }
            catch (error) {
                setLoadingError(error.message);
            }
        }
        initAudio();
    }, []);


    if (loadingError) {
        return (
            <div className="App">
                <h1>BeatGrid</h1>
                <p style={{color: 'red'}}>Error loading samples: {loadingError}</p>
                <p>Check the console for details.</p>
            </div>
        );
    }

    if (!samplesLoaded) {
        return (
            <div className="App">
                <h1>BeatGrid</h1>
                <p>Loading drum samples...</p>
            </div>
        );
    }

// Normal UI once loaded
    return (
        <div>
            <h1>BeatGrid</h1>
            <p>Samples loaded: {samplesLoaded ? 'Yes' : 'No'}</p>
            <p>Current Step: {currentStep}</p>
            <Transport
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onStop={handleStop}
                samplesLoaded={samplesLoaded}
            />
        </div>
    );
}

export default App;