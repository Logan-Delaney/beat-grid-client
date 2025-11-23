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
            perc: new Tone.Player('/sounds/instruments/808-drums/perc.wav').connect(masterLimiter),
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
            bass : new Tone.MembraneSynth({
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