// Mario-style Sound Effects using Web Audio API
// No external sound files needed!

class MarioSounds {
    constructor() {
        this.audioContext = null;
        this.isMuted = false;
        this.musicGainNode = null;
        this.musicOscillators = [];
        this.isMusicPlaying = false;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Helper to create oscillator with envelope
    playTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.audioContext || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // Envelope for more natural sound
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Button click sound (Mario jump)
    click() {
        if (!this.audioContext || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'square';
        const now = this.audioContext.currentTime;

        // Quick rising tone
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    // Coin collect sound
    coin() {
        if (!this.audioContext || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'square';
        const now = this.audioContext.currentTime;

        // Two-tone coin sound
        oscillator.frequency.setValueAtTime(988, now);
        oscillator.frequency.setValueAtTime(1319, now + 0.1);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    // Success sound (power-up)
    success() {
        if (!this.audioContext || this.isMuted) return;

        const notes = [659, 784, 1047, 1319, 1568];
        const duration = 0.1;

        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, duration, 'square', 0.25);
            }, index * duration * 1000);
        });
    }

    // Error sound - FIXED WITH LOUDERMORE NOTICEABLE SOUND
    error() {
        if (!this.audioContext || this.isMuted) return;
        console.log('Playing error sound!'); // Debug

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        const now = this.audioContext.currentTime;

        // Louder, more noticeable descending tone
        oscillator.frequency.setValueAtTime(500, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.4);

        gainNode.gain.setValueAtTime(0.4, now); // Louder!
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        oscillator.start(now);
        oscillator.stop(now + 0.4);
    }

    // Level complete fanfare
    levelComplete() {
        if (!this.audioContext || this.isMuted) return;

        const melody = [
            { freq: 784, dur: 0.15 },
            { freq: 988, dur: 0.15 },
            { freq: 1175, dur: 0.15 },
            { freq: 1568, dur: 0.4 }
        ];

        let time = 0;
        melody.forEach(note => {
            setTimeout(() => {
                this.playTone(note.freq, note.dur, 'square', 0.3);
            }, time * 1000);
            time += note.dur;
        });
    }

    // Background music - 30-Second Lofi Gaming Track
    startMusic() {
        if (!this.audioContext || this.isMuted || this.isMusicPlaying) return;

        this.isMusicPlaying = true;
        this.musicGainNode = this.audioContext.createGain();
        this.musicGainNode.gain.value = 0.09; // Mellow volume for lofi vibe
        this.musicGainNode.connect(this.audioContext.destination);

        // Chill lofi melody - relaxed and atmospheric (~30 seconds)
        const melody = [
            // Intro - gentle start (4s)
            { note: 392, dur: 0.8 },  // G
            { note: 523, dur: 0.8 },  // C
            { note: 659, dur: 1.2 },  // E (hold)
            { note: 587, dur: 0.8 },  // D
            { note: 0, dur: 0.4 },    // Rest

            // Main phrase 1 (5s)
            { note: 523, dur: 0.6 },  // C
            { note: 659, dur: 0.6 },  // E
            { note: 784, dur: 1.0 },  // G (hold)
            { note: 698, dur: 0.6 },  // F
            { note: 659, dur: 0.8 },  // E
            { note: 587, dur: 1.0 },  // D (hold)
            { note: 0, dur: 0.4 },    // Rest

            // Build up (5s)
            { note: 659, dur: 0.7 },  // E
            { note: 698, dur: 0.7 },  // F
            { note: 784, dur: 0.8 },  // G
            { note: 880, dur: 1.2 },  // A (hold)
            { note: 784, dur: 0.6 },  // G
            { note: 698, dur: 1.0 },  // F (hold)
            { note: 0, dur: 0.5 },    // Rest

            // Peak melody (6s)
            { note: 784, dur: 0.8 },  // G
            { note: 880, dur: 0.8 },  // A
            { note: 1047, dur: 0.6 }, // C (high)
            { note: 880, dur: 0.8 },  // A
            { note: 784, dur: 0.8 },  // G
            { note: 659, dur: 1.2 },  // E (hold)
            { note: 698, dur: 0.8 },  // F
            { note: 0, dur: 0.4 },    // Rest

            // Resolution (5s)
            { note: 659, dur: 0.8 },  // E
            { note: 587, dur: 0.8 },  // D
            { note: 523, dur: 1.2 },  // C (hold)
            { note: 587, dur: 0.6 },  // D
            { note: 523, dur: 1.0 },  // C (hold)
            { note: 0, dur: 0.6 },    // Rest

            // Outro - gentle end (5s)
            { note: 392, dur: 0.8 },  // G (low)
            { note: 523, dur: 1.0 },  // C (hold)
            { note: 659, dur: 1.4 },  // E (long hold)
            { note: 523, dur: 1.2 },  // C (fade)
            { note: 0, dur: 0.6 }     // Final rest
        ];

        this.playMelodyLoop(melody);
    }

    playMelodyLoop(melody) {
        if (!this.isMusicPlaying) return;

        let time = 0;
        melody.forEach((note, index) => {
            setTimeout(() => {
                if (this.isMusicPlaying && note.note > 0) {
                    const osc = this.audioContext.createOscillator();
                    osc.connect(this.musicGainNode);
                    osc.type = 'sine'; // Softer, more soothing than square wave
                    osc.frequency.value = note.note;

                    const now = this.audioContext.currentTime;
                    osc.start(now);
                    osc.stop(now + note.dur);
                }

                // Loop when melody finishes
                if (index === melody.length - 1) {
                    setTimeout(() => this.playMelodyLoop(melody), note.dur * 1000 + 1200); // Chill pause for lofi atmosphere
                }
            }, time * 1000);
            time += note.dur;
        });
    }

    stopMusic() {
        this.isMusicPlaying = false;
        if (this.musicGainNode) {
            this.musicGainNode.disconnect();
            this.musicGainNode = null;
        }
    }

    toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
        return this.isMusicPlaying;
    }

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        }
        return this.isMuted;
    }
}

// Create global sound instance
const marioSound = new MarioSounds();

// Add click sound to all buttons automatically when page loads
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        // Don't add to mute or music buttons
        if (!button.id || (button.id !== 'muteBtn' && button.id !== 'musicBtn')) {
            button.addEventListener('click', () => marioSound.click());
        }
    });

    // Auto-start soothing music when page loads
    setTimeout(() => {
        marioSound.startMusic();
    }, 500); // Small delay to ensure audio context is ready
});
