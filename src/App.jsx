import React, { useState } from 'react';
import './App.css';
import Transport from './components/Transport';
import BPMControl from './components/BPMControl';
import Beat from './components/Beat';
import getSamples from './utils/audioEngine';
import useSequencer from './hooks/useSequencer';
import * as Tone from 'tone';

function App() {
    const [samplesLoaded, setSamplesLoaded] = useState(false);
    const [samplesRef, setSamplesRef] = useState({ current: null });
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(120);
    const [tracks, setTracks] = useState([]);

    const { currentStep } = useSequencer(tracks, tempo, samplesRef, isPlaying);

    React.useEffect(() => {
        const loadAudio = async () => {
            const samples = await getSamples();
            samplesRef.current = samples;
            setSamplesRef({ current: samples });

            // Dynamically create tracks based on loaded samples
            const instrumentNames = Object.keys(samples);
            const generatedTracks = instrumentNames.map((instrumentName, index) => ({
                id: `${instrumentName}-track-${index}`,
                instrument: instrumentName,
                beats: [
                    { type: 'straight', notes: [0, 0, 0, 0] },
                    { type: 'straight', notes: [0, 0, 0, 0] },
                    { type: 'straight', notes: [0, 0, 0, 0] },
                    { type: 'straight', notes: [0, 0, 0, 0] }
                ]
            }));

            setTracks(generatedTracks);
            setSamplesLoaded(true);
        };
        loadAudio();
    }, []);

    const toggleNote = (trackIndex, beatIndex, subdivisionIndex) => {
        setTracks(prevTracks => {
            const newTracks = [...prevTracks];
            newTracks[trackIndex] = { ...prevTracks[trackIndex] };
            newTracks[trackIndex].beats = [...prevTracks[trackIndex].beats];
            newTracks[trackIndex].beats[beatIndex] = { ...prevTracks[trackIndex].beats[beatIndex] };
            newTracks[trackIndex].beats[beatIndex].notes = [...prevTracks[trackIndex].beats[beatIndex].notes];
            newTracks[trackIndex].beats[beatIndex].notes[subdivisionIndex] =
                prevTracks[trackIndex].beats[beatIndex].notes[subdivisionIndex] === 1 ? 0 : 1;
            return newTracks;
        });
    };

    const changeBeatType = (trackIndex, beatIndex, newType) => {
        setTracks(prevTracks => {
            const newTracks = [...prevTracks];
            newTracks[trackIndex] = { ...prevTracks[trackIndex] };
            newTracks[trackIndex].beats = [...prevTracks[trackIndex].beats];

            const subdivisions = newType === 'straight' ? 4 : 3;
            newTracks[trackIndex].beats[beatIndex] = {
                type: newType,
                notes: new Array(subdivisions).fill(0)
            };

            return newTracks;
        });
    };

    const handlePlay = () => {
        if (!isPlaying) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    const handleStop = () => {
        setIsPlaying(false);
        Tone.getTransport().stop();
    };

    const handleBpmChange = (newBpm) => {
        if (newBpm >= 60 && newBpm <= 250) {
            setTempo(newBpm);
        }
    };

    if (!samplesLoaded) {
        return (
            <div className="App">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading drum samples...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="app-header">
                <h1 className="app-title">Beat Grids</h1>
            </header>

            <main className="app-content">
                <section className="controls-section">
                    <div className="transport-wrapper">
                        <Transport
                            isPlaying={isPlaying}
                            onPlay={handlePlay}
                            onStop={handleStop}
                            samplesLoaded={samplesLoaded}
                        />
                    </div>

                    <div className="divider"></div>

                    <BPMControl
                        bpm={tempo}
                        onBpmChange={handleBpmChange}
                    />
                </section>

                <section className="sequencer-section">
                    <div className="sequencer-header">
                        <h2 className="sequencer-title">Drum Pattern</h2>
                        <p className="sequencer-subtitle">Click cells to toggle notes • Change beat types for mixed rhythms</p>
                    </div>

                    {tracks.map((track, trackIndex) => (
                        <div key={track.id} className="track-row">
                            <div className="track-label">{track.instrument}</div>
                            <div className="beats-container">
                                {track.beats.map((beat, beatIndex) => (
                                    <Beat
                                        key={beatIndex}
                                        tracks={tracks}
                                        trackIndex={trackIndex}
                                        beatIndex={beatIndex}
                                        onToggle={toggleNote}
                                        onTypeChange={changeBeatType}
                                        currentStep={currentStep}
                                        isPlaying={isPlaying}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default App;