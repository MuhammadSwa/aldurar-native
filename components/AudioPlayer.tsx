import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { IconIon } from '@/components/Icons';
import { useAudioStore } from '@/lib/stores/audioStore';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import Slider from '@react-native-community/slider';

export function AudioPlayer({ inline = false }: { inline?: boolean }) {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);
  const {
    isPlaying,
    isLoading: storeIsLoading,
    duration,
    position,
    playbackSpeed,
    currentTrackTitle,
    currentTrackUrl,
    togglePlayPause,
    seekTo,
    setPlaybackSpeed,
    closePlayer,
    setPlayer,
    updateProgress,
  } = useAudioStore();

  const isBuffering = status.isBuffering || (!!currentTrackUrl && !status.isLoaded);

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isSeeking, setIsSeeking] = React.useState(false);
  const [seekPosition, setSeekPosition] = React.useState(0);
  const [showSpeedDialog, setShowSpeedDialog] = React.useState(false);
  const [tempSpeed, setTempSpeed] = React.useState(playbackSpeed);

  // Initialize player in the store
  useEffect(() => {
    setPlayer(player);
  }, [player, setPlayer]);

  // Configure audio for background playback
  useEffect(() => {
    async function configureAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionModeAndroid: 'duckOthers',
          interruptionMode: 'mixWithOthers'
        });
      } catch (error) {
        console.error('Failed to set audio mode:', error);
      }
    }
    configureAudio();
  }, []);

  // Monitor player state
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && currentTrackUrl) {
        updateProgress(
          player.currentTime,
          player.duration,
          player.playing
        );
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [player, currentTrackUrl, updateProgress]);

  // Don't render if no track is loaded
  if (!currentTrackUrl) {
    return null;
  }

  // Format time in MM:SS
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    setSeekPosition(position);
  };

  const handleSeekChange = (value: number) => {
    setSeekPosition(value);
  };

  const handleSeekComplete = (value: number) => {
    setIsSeeking(false);
    seekTo(value / 1000); // Convert milliseconds to seconds
  };

  const handleSpeedDialogOpen = () => {
    setTempSpeed(playbackSpeed);
    setShowSpeedDialog(true);
  };

  const handleSpeedChange = (value: number) => {
    setTempSpeed(value);
    setPlaybackSpeed(value);
  };

  const currentPosition = isSeeking ? seekPosition : position;
  const progress = duration > 0 ? (currentPosition / duration) * 100 : 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutDown.duration(300)}
      layout={Layout.duration(300)}
      className={`${inline ? 'w-full px-3' : 'absolute bottom-0 left-0 right-0 pb-6 px-3 z-50'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        paddingBottom: inline ? 12 : 24, // Extra padding for Android nav bar only when not inline
      }}
    >
      <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Progress Bar - Only show when collapsed */}
        {!isExpanded && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="h-1 bg-slate-200 dark:bg-slate-700"
          >
            <View
              className="h-full bg-emerald-600 dark:bg-emerald-500"
              style={{ width: `${progress}%` }}
            />
          </Animated.View>
        )}

        {/* Main Player Content */}
        <View className="px-4 py-4 pb-5">
          {/* Top Row: Title and Close */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 ml-2">
              <Text
                className="text-sm font-bold text-slate-800 dark:text-slate-100"
                numberOfLines={1}
              >
                {currentTrackTitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={closePlayer}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="p-2"
            >
              <IconIon name="close" size={22} className="text-slate-600 dark:text-slate-400" />
            </TouchableOpacity>
          </View>

          {/* Slider and Time */}
          {isExpanded && (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              className="mb-4"
            >
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={duration}
                value={currentPosition}
                onValueChange={handleSeekChange}
                onSlidingStart={handleSeekStart}
                onSlidingComplete={handleSeekComplete}
                minimumTrackTintColor="#10b981"
                maximumTrackTintColor="#cbd5e1"
                thumbTintColor="#10b981"
              />
              <View className="flex-row justify-between px-1">
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTime(currentPosition)}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTime(duration)}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Controls */}
          <View className="flex-row items-center justify-between px-2">
            {/* Playback Speed */}
            <TouchableOpacity
              onPress={handleSpeedDialogOpen}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg min-w-[60px] items-center"
            >
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {parseFloat(playbackSpeed.toFixed(2))}x
              </Text>
            </TouchableOpacity>

            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={togglePlayPause}
              disabled={isBuffering}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="w-16 h-16 rounded-full bg-emerald-600 dark:bg-emerald-700 items-center justify-center"
              style={{
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              {isBuffering ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <IconIon
                  name={isPlaying ? 'pause' : 'play'}
                  size={30}
                  className="text-white"
                  style={{ marginLeft: isPlaying ? 0 : 2 }}
                />
              )}
            </TouchableOpacity>

            {/* Expand/Collapse Toggle */}
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg min-w-[60px] items-center"
            >
              <IconIon
                name={isExpanded ? 'chevron-down' : 'chevron-up'}
                size={22}
                className="text-slate-700 dark:text-slate-300"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Speed Adjustment Dialog */}
        <Modal
          visible={showSpeedDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSpeedDialog(false)}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={() => setShowSpeedDialog(false)}
          >
            <Pressable
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 mx-6 w-80 max-w-[90%]"
              onPress={(e) => e.stopPropagation()}
              style={{ direction: 'rtl' }}
            >
              <View className="items-center mb-6">
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  سرعة التشغيل
                </Text>
                <Text className="text-4xl font-bold text-emerald-600 dark:text-emerald-500">
                  {tempSpeed.toFixed(2)}x
                </Text>
              </View>

              <View className="mb-6">
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0.5}
                  maximumValue={1.5}
                  value={tempSpeed}
                  step={0.05}
                  onValueChange={handleSpeedChange}
                  minimumTrackTintColor="#10b981"
                  maximumTrackTintColor="#cbd5e1"
                  thumbTintColor="#10b981"
                />
                <View className="flex-row justify-between px-1 mt-2" style={{ direction: 'ltr' }}>
                  <Text className="text-sm text-slate-500 dark:text-slate-400">0.5x</Text>
                  <Text className="text-sm text-slate-500 dark:text-slate-400">1.5x</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowSpeedDialog(false)}
                className="bg-emerald-600 dark:bg-emerald-700 py-4 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-base">تم</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </Animated.View>
  );
}
