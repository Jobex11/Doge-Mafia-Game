
import { useCallback, useState, useEffect } from 'react';
import soundManager from '@/utils/soundEffects';

export const useSound = () => {
  const [muted, setMuted] = useState<boolean>(() => soundManager.isSoundMuted());

  useEffect(() => {
    // Initialize mute state from localStorage if available
    const savedMuteState = localStorage.getItem('soundMuted');
    if (savedMuteState !== null) {
      const isMuted = savedMuteState === 'true';
      soundManager.setMute(isMuted);
      setMuted(isMuted);
    }
  }, []);

  const playSound = useCallback((soundId: string) => {
    soundManager.playSound(soundId);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuteState = soundManager.toggleMute();
    setMuted(newMuteState);
    localStorage.setItem('soundMuted', String(newMuteState));
    return newMuteState;
  }, []);

  const setMute = useCallback((mute: boolean) => {
    soundManager.setMute(mute);
    setMuted(mute);
    localStorage.setItem('soundMuted', String(mute));
  }, []);

  const isMuted = useCallback(() => {
    return soundManager.isSoundMuted();
  }, []);

  return {
    playSound,
    toggleMute,
    setMute,
    isMuted,
    muted
  };
};
