import {useState, useRef, useEffect} from 'react';
import * as Tone from 'tone';
import BEAT_TYPES from '../constants/beatTypes';

const useSequencer = (track, bpm, samplesRef, isPlaying, measures) => {
    const [currentStep, setCurrentStep] = useState(0);
    const partRef = useRef(null);

    const buildEvents = (track) => {
        let events = [];

        for (let tracks = 0; tracks < track.length; tracks++) {
            let stepCounter = 0;

            for (let i = 0; i < track[tracks].beats.length; i++) {
                const beat = track[tracks].beats[i];
                const beatType = BEAT_TYPES[beat.type];
                const duration = beatType.duration;

                for (let j = 0; j < beat.notes.length; j++) {
                    if (beat.notes[j] === 1) {
                        let event = {
                            time: {
                                '4n': i,
                                [duration]: j
                            },
                            instrument: track[tracks].instrument,
                            stepNumber: stepCounter,
                            trackIndex: tracks,
                            beatIndex: i,
                            subdivIndex: j
                        }
                        events.push(event);
                    }
                    stepCounter++;
                }
            }
        }
        return events;
    }

    useEffect(() => {
        if (!isPlaying || !samplesRef.current) return;

        const transport = Tone.getTransport();
        transport.bpm.value = parseInt(bpm);

        const events = buildEvents(track);
        console.log('Built events:', events);

        const part = new Tone.Part((time, event) => {
            console.log('Event fired at time:', time, 'event:', event);
            samplesRef.current[event.instrument].start(time);
            setCurrentStep(event.stepNumber);
        }, events);

        part.loop = true;
        part.loopEnd = `${measures}:0:0`
        part.loopStart = 0;
        part.start(0);
        partRef.current = part;

        return () => {
            if (partRef.current) {
                partRef.current.dispose();
                partRef.current = null;
            }
        };
    }, [track, bpm, samplesRef, isPlaying, measures]);

    useEffect(() => {
        if (!samplesRef.current) return;

        if (isPlaying) {
            Tone.getTransport().start();
        } else {
            if (Tone.getTransport().state === 'started') {
                Tone.getTransport().pause();
            }
        }
    }, [isPlaying, samplesRef]);

    return { currentStep }
};

export default useSequencer;