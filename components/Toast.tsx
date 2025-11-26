import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, Platform } from 'react-native';
import { useToastStore } from '@/lib/stores/toastStore';

export function Toast() {
    const { message, isVisible, hideToast } = useToastStore();
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isVisible) {
            // Clear any existing timer to prevent early dismissal
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Animate In
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 12,
                    bounciness: 5,
                }),
            ]).start();

            // Auto hide after delay
            timerRef.current = setTimeout(() => {
                hideToast();
            }, 2000);
        } else {
            // Animate Out
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 20,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isVisible, message]); // Re-run when message changes to reset timer

    if (!message) return null;

    return (
        <Animated.View
            style={{
                opacity,
                transform: [{ translateY }],
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 50 : 30,
                left: 20,
                right: 20,
                alignItems: 'center',
                zIndex: 9999,
                pointerEvents: 'none', // Allows clicking through if needed, but usually we want it on top
            }}
        >
            <View className="bg-foreground/90 dark:bg-foreground-dark/90 px-6 py-3 rounded-full shadow-lg">
                <Text className="text-background dark:text-background-dark font-medium text-sm text-center">
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
}
