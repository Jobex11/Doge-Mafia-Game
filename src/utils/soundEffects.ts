
// Sound effects utility for game audio

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    // Pre-load common game sounds
    this.preloadSound('button', '/sounds/button-click.mp3');
    this.preloadSound('card', '/sounds/card-flip.mp3');
    this.preloadSound('success', '/sounds/success.mp3');
    this.preloadSound('error', '/sounds/error.mp3');
    this.preloadSound('coin', '/sounds/coin.mp3');
    this.preloadSound('night', '/sounds/night-phase.mp3');
    this.preloadSound('day', '/sounds/day-phase.mp3');
    
    // Asian-themed sounds
    this.preloadSound('gong', '/sounds/asian-gong.mp3');
    this.preloadSound('flute', '/sounds/asian-flute.mp3');
    this.preloadSound('drum', '/sounds/asian-drum.mp3');
    this.preloadSound('gacha', '/sounds/gacha-pull.mp3');
    this.preloadSound('levelup', '/sounds/level-up.mp3');
    this.preloadSound('unlock', '/sounds/character-unlock.mp3');
  }

  preloadSound(id: string, url: string): void {
    try {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      this.sounds.set(id, audio);
    } catch (error) {
      console.error(`Failed to preload sound: ${id}`, error);
    }
  }

  playSound(id: string): void {
    if (this.isMuted) return;
    
    try {
      const sound = this.sounds.get(id);
      if (sound) {
        // Create a clone to allow overlapping sounds
        const soundClone = sound.cloneNode(true) as HTMLAudioElement;
        soundClone.volume = 0.5; // Set volume to 50%
        soundClone.play().catch(err => console.error('Error playing sound:', err));
      } else {
        console.warn(`Sound not found: ${id}`);
      }
    } catch (error) {
      console.error(`Error playing sound: ${id}`, error);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMute(mute: boolean): void {
    this.isMuted = mute;
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }
}

// Create singleton instance
const soundManager = new SoundManager();
export default soundManager;
