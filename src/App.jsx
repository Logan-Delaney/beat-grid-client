import React from 'react';
import './App.css';
import Transport from './components/Transport';
import BPMControl from './components/BPMControl';
import Beat from './components/Beat';
import useSequencer from './hooks/useSequencer';
import * as Tone from 'tone';
import Footer from "./components/Footer.jsx";
import { useAudioSamples } from "./hooks/useAudioSamples.js";
import { useTracks } from "./hooks/useTracks.js";
import {useTransport} from "./hooks/useTransport.js";
import MeasureControl from "./components/MeasureControl.jsx";

function App() {
    const { samplesRef, samplesLoaded} = useAudioSamples();
    const { isPlaying, tempo, play, stop, setBpm, measures, setBars } = useTransport(120, 1)
    const { tracks, toggleNote, changeBeatType } = useTracks(samplesRef, samplesLoaded, measures);
    const { currentStep } = useSequencer(tracks, tempo, samplesRef, isPlaying, measures);

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
                            onPlay={play}
                            onStop={stop}
                            samplesLoaded={samplesLoaded}
                        />
                    </div>

                    <div className="divider"></div>

                    <BPMControl
                        bpm={tempo}
                        onBpmChange={setBpm}
                    />

                    <div className="divider"></div>

                    <MeasureControl
                        measures={measures}
                        onMeasuresChange={setBars}
                    />
                </section>

                <section className="sequencer-section">
                    <div className="sequencer-inner">
                        <div className="sequencer-header">
                            <h2 className="sequencer-title">Sequencer</h2>
                            <p className="sequencer-subtitle">Click cells to toggle notes • Change beat types for mixed rhythms</p>
                        </div>

                        {tracks.map((track, trackIndex) => (
                            <div key={track.id} className="track-row">
                                <div className="track-label-wrapper">
                                    <div className="track-label">{track.instrument}</div>
                                </div>
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
                    </div>
                </section>
                <Footer />
            </main>
        </div>
    );
}

export default App;