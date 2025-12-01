import React from 'react';
import './App.css';
import Transport from './components/Transport/Transport.jsx';
import BPMControl from './components/BPMControl/BPMControl.jsx';
import Beat from './components/Beat/Beat.jsx';
import useSequencer from './hooks/useSequencer';
import Footer from "./components/Footer/Footer.jsx";
import { useAudioSamples } from "./hooks/useAudioSamples.js";
import { useTracks } from "./hooks/useTracks.js";
import {useTransport} from "./hooks/useTransport.js";
import MeasureControl from "./components/MeasureControl/MeasureControl.jsx";
import Clear from "./components/Clear/Clear.jsx";
import PianoRollModal from "./components/PianoRollModal/PianoRollModal.jsx";
import AddTrackModal from "./components/AddTrackModal/AddTrackModal.jsx";

function App() {
    const { samplesRef, synthsRef, samplesLoaded, synthsLoaded} = useAudioSamples();
    const { isPlaying, tempo, play, stop, setBpm, measures, setBars, loop, toggleLoop } = useTransport(120, 1)
    const { tracks, toggleNote, changeBeatType, clearTracks, updateNotePitch, addTrack, removeTrack, setAllBeatsToType } = useTracks(samplesRef, synthsRef, samplesLoaded, synthsLoaded, measures);
    const { currentStep } = useSequencer(tracks, tempo, samplesRef, synthsRef, isPlaying, measures, loop);

    const [pianoRollOpen, setPianoRollOpen] = React.useState(false);
    const [pianoRollTrackIndex, setPianoRollTrackIndex] = React.useState(0);
    const [pianoRollBeatIndex, setPianoRollBeatIndex] = React.useState(0);
    const [addTrackModalOpen, setAddTrackModalOpen] = React.useState(false);

    const openPianoRollModal = (trackIndex, beatIndex) => {
        setPianoRollOpen(true);
        setPianoRollTrackIndex(trackIndex);
        setPianoRollBeatIndex(beatIndex);
    }

    const closePianoRollModal = () => {
        setPianoRollOpen(false);
        setPianoRollTrackIndex(0);
        setPianoRollBeatIndex(0);
    }

    const openAddTrackModal = () => {
        setAddTrackModalOpen(true);
    }

    const closeAddTrackModal = () => {
        setAddTrackModalOpen(false);
    }

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
                            loop={loop}
                            onToggleLoop={toggleLoop}
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
                            <div className="sequencer-inner-header">
                                <h2 className="sequencer-title">Sequencer</h2>
                                <p className="sequencer-subtitle">Click cells to toggle notes</p>
                            </div>
                            <div className="header-controls">
                                <div className="header-controls">
                                    <button
                                        className="rhythm-toggle-button"
                                        onClick={() => setAllBeatsToType('straight')}
                                    >
                                        All 4
                                    </button>
                                    <button
                                        className="rhythm-toggle-button"
                                        onClick={() => setAllBeatsToType('triplet')}
                                    >
                                        All 3
                                    </button>
                                    <Clear onClear={clearTracks} />
                                </div>
                            </div>
                        </div>

                        {tracks.map((track, trackIndex) => (
                            <div key={track.id} className="track-row">
                                <div className="track-label-wrapper">
                                    <div className="track-label">{track.instrument}</div>
                                    {tracks.length > 1 && (
                                        <button
                                            className="remove-track-button"
                                            onClick={() => removeTrack(trackIndex)}
                                            aria-label="Remove track"
                                        >
                                            ×
                                        </button>
                                    )}
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
                                            onOpenPianoRoll={openPianoRollModal}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </section>
                {tracks.length < 12 && (
                    <div className="add-track-row">
                        <button className="add-track-button" onClick={openAddTrackModal}>
                            ➕ Add Track
                        </button>
                    </div>
                )}
                <Footer />
                {pianoRollOpen && (
                    <PianoRollModal
                        isOpen={pianoRollOpen}
                        onClose={closePianoRollModal}
                        trackIndex={pianoRollTrackIndex}
                        beatIndex={pianoRollBeatIndex}
                        tracks={tracks}
                        onUpdateNote={updateNotePitch}
                    />
                )}
                {addTrackModalOpen && (
                    <AddTrackModal
                        isOpen={addTrackModalOpen}
                        onClose={closeAddTrackModal}
                        onAddTrack={addTrack}
                        existingInstruments={tracks.map(t => t.instrument)}
                        samples={samplesRef}
                        synths={synthsRef}
                    />
                )}
            </main>
        </div>
    );
}

export default App;