import { create } from 'zustand';
import { useAudioPlayer } from 'expo-audio';

interface AudioState {
    // Audio state
    player: ReturnType<typeof useAudioPlayer> | null;
    isPlaying: boolean;
    isLoading: boolean;
    duration: number;
    position: number;
    playbackSpeed: number;
    currentTrackUrl: string | null;
    currentTrackTitle: string | null;

    // Actions
    loadAndPlayAudio: (url: string, title: string) => Promise<void>;
    togglePlayPause: () => void;
    seekTo: (position: number) => void;
    setPlaybackSpeed: (speed: number) => void;
    closePlayer: () => void;
    setPlayer: (player: ReturnType<typeof useAudioPlayer>) => void;
    updateProgress: (position: number, duration: number, playing: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    // Initial state
    player: null,
    isPlaying: false,
    isLoading: false,
    duration: 0,
    position: 0,
    playbackSpeed: 1,
    currentTrackUrl: null,
    currentTrackTitle: null,

    // Set the player instance
    setPlayer: (player) => {
        set({ player });
    },

    // Load and play audio
    loadAndPlayAudio: async (url: string, title: string) => {
        const { player, currentTrackUrl } = get();

        if (!player) {
            console.error('Player not initialized');
            return;
        }

        try {
            // If same track is already loaded, just toggle play/pause
            if (currentTrackUrl === url) {
                if (player.playing) {
                    player.pause();
                    set({ isPlaying: false });
                } else {
                    player.play();
                    set({ isPlaying: true });
                }
                return;
            }

            set({ isLoading: true });

            // Load and play new audio
            player.replace(url);
            player.play();

            set({
                currentTrackUrl: url,
                currentTrackTitle: title,
                isPlaying: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error loading audio:', error);
            set({ isLoading: false, isPlaying: false });
        }
    },

    // Toggle play/pause
    togglePlayPause: () => {
        const { player, isPlaying } = get();
        if (!player) return;

        try {
            if (isPlaying) {
                player.pause();
                set({ isPlaying: false });
            } else {
                player.play();
                set({ isPlaying: true });
            }
        } catch (error) {
            console.error('Error toggling playback:', error);
        }
    },

    // Seek to position (in seconds)
    seekTo: (positionSeconds: number) => {
        const { player } = get();
        if (!player) return;

        try {
            player.seekTo(positionSeconds);
            set({ position: positionSeconds * 1000 }); // Convert to milliseconds for consistency
        } catch (error) {
            console.error('Error seeking:', error);
        }
    },

    // Set playback speed
    setPlaybackSpeed: (speed: number) => {
        const { player } = get();
        if (!player) return;

        try {
            // Set playback rate and enable pitch correction to maintain natural sound
            player.setPlaybackRate(speed, 'high');
            player.shouldCorrectPitch = true;
            set({ playbackSpeed: speed });
        } catch (error) {
            console.error('Error setting playback speed:', error);
        }
    },

    // Close player and stop audio
    closePlayer: () => {
        const { player } = get();
        if (player) {
            try {
                player.pause();
                player.remove();
            } catch (error) {
                console.error('Error closing player:', error);
            }
        }
        set({
            isPlaying: false,
            duration: 0,
            position: 0,
            currentTrackUrl: null,
            currentTrackTitle: null,
        });
    },

    // Update progress
    updateProgress: (position: number, duration: number, playing: boolean) => {
        set({
            position: position * 1000, // Convert to milliseconds
            duration: duration * 1000, // Convert to milliseconds
            isPlaying: playing,
        });
    },
}));
