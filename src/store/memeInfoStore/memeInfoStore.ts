import { create } from 'zustand';

interface MemeInfoStore {
    memeItem: CrazyMemeHome.Item | null;
    setMemeItem: (item: CrazyMemeHome.Item | null) => void;
    updateFollowStatus: (status: boolean) => void;
}

const useMemeInfoStore = create<MemeInfoStore>((set) => ({
    memeItem: null,
    setMemeItem: (item) => set({ memeItem: item }),
    updateFollowStatus: (status) =>
        set((state) => ({
            memeItem: state.memeItem ? { ...state.memeItem, followed: status } : null,
        })),
}));

export default useMemeInfoStore;
