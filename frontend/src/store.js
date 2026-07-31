import { create } from 'zustand';

const useStore = create((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  setTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  volume: 1,
  setVolume: (volume) => set({ volume }),
  
  isShuffle: false,
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  
  repeatMode: 0, // 0: off, 1: all, 2: one
  toggleRepeat: () => set((state) => ({ repeatMode: (state.repeatMode + 1) % 3 })),

  playNext: () => set((state) => {
    if (state.queue.length === 0) return state;
    
    // Repeat One
    if (state.repeatMode === 2) return { ...state }; // Return same state triggers replay in component if handled correctly, but typically we just reset currentTime. For state, it's the same track.
    
    // Shuffle
    if (state.isShuffle) {
      const randomIndex = Math.floor(Math.random() * state.queue.length);
      return { currentTrack: state.queue[randomIndex] };
    }
    
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
    if (currentIndex >= 0 && currentIndex < state.queue.length - 1) {
      return { currentTrack: state.queue[currentIndex + 1] };
    }
    
    // Repeat All
    if (state.repeatMode === 1 && state.queue.length > 0) {
      return { currentTrack: state.queue[0] };
    }
    
    return state;
  }),
  playPrev: () => set((state) => {
    if (state.queue.length === 0) return state;
    
    if (state.isShuffle) {
      const randomIndex = Math.floor(Math.random() * state.queue.length);
      return { currentTrack: state.queue[randomIndex] };
    }
    
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
    if (currentIndex > 0) {
      return { currentTrack: state.queue[currentIndex - 1] };
    }
    return state;
  })
}));

export default useStore;
