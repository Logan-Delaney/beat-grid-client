import {useState, useRef, useEffect} from 'react';
import * as Tone from 'tone';
import BEAT_TYPES from '../constants/beatTypes';

const useSequencer = (track, bpm, samplesRef, isPlaying) => {
    const [currentStep, setCurrentStep] = useState(0);
    const partRef = useRef(null);

    const buildEvents = (track) => {
        let events = [];
        let currentTime = 0;
        let stepCounter = 0;

        for (let i = 0; i < track.beats.length; i++) {
            const beat = track.beats[i];
            const beatType = BEAT_TYPES[beat.type];
            const subdivisions = beatType.subdivisions;
            const subdivisionDuration = 1 / subdivisions;

            for (let j = 0; j < beat.notes.length; j++) {
                let noteTime = currentTime + (j * subdivisionDuration);
                if (beat.notes[j] === 1){
                    let event = {
                        time : noteTime.toFixed(3) + 'i',
                        instrument: track.instrument,
                        stepNumber: stepCounter,
                    }
                    events.push(event);
                }
                stepCounter++;
            }
            currentTime += 1;
        }
        return events;
    }

    useEffect(() => {
        if (!isPlaying || !samplesRef.current) return;

        const transport = Tone.getTransport();
        transport.bpm.value = bpm;

        const events = buildEvents(track);
        console.log('Built events:', events);

        const part = new Tone.Part((time, event) => {
            console.log('Event fired at time:', time, 'event:', event);
            samplesRef.current[event.instrument].start(time);
            setCurrentStep(event.stepNumber);
        }, events);

        part.loop = true;
        part.loopEnd = 4;
        part.loopStart = 0;
        part.start(0);
        partRef.current = part;

        return () => {
            if (partRef.current) {
                partRef.current.dispose();
                partRef.current = null;
            }
        };
    }, [track, bpm, samplesRef, isPlaying]);

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