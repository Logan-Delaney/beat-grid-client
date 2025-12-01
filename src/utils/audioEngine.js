import * as Tone from 'tone';

const masterLimiter = new Tone.Limiter(-10).toDestination();

const getSamples = async () => {
    try {
        const samples = {
            kick: new Tone.Player('/sounds/instruments/808-drums/kick.wav').connect(masterLimiter),
            clap: new Tone.Player('/sounds/instruments/808-drums/clap.wav').connect(masterLimiter),
            cowbell: new Tone.Player('/sounds/instruments/808-drums/cowbell.wav').connect(masterLimiter),
            crash: new Tone.Player('/sounds/instruments/808-drums/crash.wav').connect(masterLimiter),
            hihat: new Tone.Player('/sounds/instruments/808-drums/hihat.wav').connect(masterLimiter),
            openhat: new Tone.Player('/sounds/instruments/808-drums/openhat.wav').connect(masterLimiter),
            claves: new Tone.Player('/sounds/instruments/808-drums/perc.wav').connect(masterLimiter),
            snare: new Tone.Player('/sounds/instruments/808-drums/snare.wav').connect(masterLimiter),
            tom: new Tone.Player('/sounds/instruments/808-drums/tom.wav').connect(masterLimiter),
        }

        await Tone.loaded();
        return samples;
    }
    catch (error) {
        console.error('Error loading samples:', error);
        throw error;
    }
}

const getSynths = async () => {
    try {
        const synths = {
            '808-bass' : new Tone.MembraneSynth({
                pitchDecay: 0.009,
                octaves: 10,
                oscillator: { type: 'sine' },
                envelope: {
                    attack: .01,
                    decay: .01,
                    sustain: .4,
                    release: .75,
                }
            }).connect(masterLimiter),
            'pluck': new Tone.PluckSynth({
                attackNoise: 1,
                dampening: 4000,
                resonance: 0.7
            }).connect(masterLimiter),
            'am synth': new Tone.AMSynth({
                volume: 12,
                harmonicity: 2,
                oscillator: {
                    type: "sine"
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0.1,
                    release: 0.8
                },
                modulation: {
                    type: "square"
                },
                modulationEnvelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0,
                    release: 0.5
                }
            }).connect(masterLimiter),
            'fm synth': new Tone.FMSynth({
                harmonicity: 3,
                modulationIndex: 10,
                oscillator: {
                    type: "sine"
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0,
                    release: 0.5
                },
                modulation: {
                    type: "square"
                },
                modulationEnvelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0,
                    release: 0.3
                }
            }).connect(masterLimiter),
            'mono synth': new Tone.MonoSynth({
                volume: -12,
                oscillator: {
                    type: "sawtooth"
                },
                filter: {
                    Q: 6,
                    type: "lowpass",
                    rolloff: -24
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.3,
                    sustain: 0.0,
                    release: 0.8
                },
                filterEnvelope: {
                    attack: 0.001,
                    decay: 0.3,
                    sustain: 0.0,
                    release: 0.8,
                    baseFrequency: 200,
                    octaves: 4
                }
            }).connect(masterLimiter),
        }

        await Tone.loaded();
        return synths;
    }
    catch (error) {
        console.error('Error loading samples:', error);
        throw error;
    }
}

export { getSamples, getSynths };