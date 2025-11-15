import * as Tone from 'tone';

const getSamples = async () => {
    try {
        const samples = {
            kick: new Tone.Player('/sounds/instruments/808-drums/kick.wav').toDestination(),
            clap: new Tone.Player('/sounds/instruments/808-drums/clap.wav').toDestination(),
            cowbell: new Tone.Player('/sounds/instruments/808-drums/cowbell.wav').toDestination(),
            crash: new Tone.Player('/sounds/instruments/808-drums/crash.wav').toDestination(),
            hihat: new Tone.Player('/sounds/instruments/808-drums/hihat.wav').toDestination(),
            openhat: new Tone.Player('/sounds/instruments/808-drums/openhat.wav').toDestination(),
            perc: new Tone.Player('/sounds/instruments/808-drums/perc.wav').toDestination(),
            snare: new Tone.Player('/sounds/instruments/808-drums/snare.wav').toDestination(),
            tom: new Tone.Player('/sounds/instruments/808-drums/tom.wav').toDestination()
        }

        await Tone.loaded();
        return samples;
    }
    catch (error) {
        console.error('Error loading samples:', error);
        throw error;
    }
}

export default getSamples;