import { create } from 'zustand';

const useStore = create((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  setTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue }),
  playNext: () => set((state) => {
    // Simple next logic
    if (state.queue.length === 0) return state;
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
    if (currentIndex >= 0 && currentIndex < state.queue.length - 1) {
      return { currentTrack: state.queue[currentIndex + 1] };
    }
    return state;
  }),
  playPrev: () => set((state) => {
    if (state.queue.length === 0) return state;
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
    if (currentIndex > 0) {
      return { currentTrack: state.queue[currentIndex - 1] };
    }
    return state;
  })
}));

export default useStore;
