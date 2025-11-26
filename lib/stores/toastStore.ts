import { create } from 'zustand';

interface ToastState {
    message: string | null;
    isVisible: boolean;
    showToast: (message: string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    message: null,
    isVisible: false,
    showToast: (message) => {
        // Hide first to reset animation if needed, or just update content
        set({ isVisible: false });

        // Small timeout to allow "cancellation" visual effect or immediate update
        setTimeout(() => {
            set({ message, isVisible: true });
        }, 50);
    },
    hideToast: () => set({ isVisible: false }),
}));
