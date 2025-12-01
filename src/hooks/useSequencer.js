import {useState, useRef, useEffect} from 'react';
import * as Tone from 'tone';
import BEAT_TYPES from '../constants/beatTypes';

const useSequencer = (track, bpm, samplesRef, synthsRef, isPlaying, measures, loop) => {
    const [currentStep, setCurrentStep] = useState({});
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
                    if (beat.notes[j].active === 1) {
                        let event = {
                            time: {
                                '4n': i,
                                [duration]: j
                            },
                            instrument: track[tracks].instrument,
                            stepNumber: stepCounter,
                            trackIndex: tracks,
                            beatIndex: i,
                            subdivIndex: j,
                            pitch: beat.notes[j].pitch,
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
        if (!isPlaying || !samplesRef.current || !synthsRef.current) return;

        const transport = Tone.getTransport();
        transport.bpm.value = parseInt(bpm);

        const events = buildEvents(track);
        console.log('Built events:', events);

        const part = new Tone.Part((time, event) => {
            console.log('Event fired at time:', time, 'event:', event);
            if (samplesRef.current[event.instrument]) {
                samplesRef.current[event.instrument].start(time);
            }
            else if (synthsRef.current[event.instrument]) {
                synthsRef.current[event.instrument].triggerAttackRelease(
                    event.pitch || 'C2',
                    '8n',
                    time,
                );
            }
        }, events);

        part.loop = loop;
        part.loopEnd = `${measures}:0:0`
        part.loopStart = 0;
        part.start(0);
        partRef.current = part;

        const positionUpdates = [];
        for (let trackIdx = 0; trackIdx < track.length; trackIdx++) {
            let stepCounter = 0;
            for (let i = 0; i < track[trackIdx].beats.length; i++) {
                const beat = track[trackIdx].beats[i];
                const beatType = BEAT_TYPES[beat.type];
                const duration = beatType.duration;

                for (let j = 0; j < beat.notes.length; j++) {
                    positionUpdates.push({
                        time: {
                            '4n': i,
                            [duration]: j
                        },
                        trackIndex: trackIdx,
                        stepNumber: stepCounter
                    });
                    stepCounter++;
                }
            }
        }

        const positionPart = new Tone.Part((time, update) => {
            setCurrentStep(prev => ({
                ...prev,
                [update.trackIndex]: update.stepNumber
            }));
        }, positionUpdates);

        positionPart.loop = loop;
        positionPart.loopEnd = `${measures}:0:0`;
        positionPart.loopStart = 0;
        positionPart.start(0);

        if (!loop) {
            transport.schedule(() => {
                transport.stop();
                setCurrentStep({});
            }, `${measures}:0:0`);
        }

        return () => {
            if (partRef.current) {
                partRef.current.dispose();
                partRef.current = null;
            }
            positionPart.dispose();
            transport.cancel();
        };
    }, [track, bpm, samplesRef, synthsRef, isPlaying, measures, loop]);

    useEffect(() => {
        if (!samplesRef.current || !synthsRef.current) return;

        if (isPlaying) {
            Tone.getTransport().start();
        } else {
            if (Tone.getTransport().state === 'started') {
                Tone.getTransport().pause();
            }
        }
    }, [isPlaying, samplesRef, synthsRef]);

    return { currentStep }
};

export default useSequencer;