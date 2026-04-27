import { create } from 'zustand'

export type ScrollState = 'IDLE' | 'READING' | 'TRANSITIONING'

export interface SectionMetrics {
  id: string
  top: number
  bottom: number    // top + height + transition zone if applicable
  height: number    // actual physical height
  transitionStart: number // where the crossfade out begins (usually bottom of content)
}

interface ScrollStore {
  state: ScrollState
  sections: SectionMetrics[]
  activeSectionId: string

  /**
   * Raw transition progress for the active section's exit zone.
   * 0.0 = just entered the transition zone
   * 1.0 = section fully exited
   * Resets to 0 when scroll returns to reading zone.
   */
  transitionProgress: number

  /**
   * Normalized OUT progress (0 → 1) for the CURRENT section.
   * Active during the first half of the transition zone (progress 0.0 → 0.5).
   * Drives the exit animation of the active section.
   */
  outProgress: number

  /**
   * Normalized IN progress (0 → 1) for the NEXT section.
   * Active during the second half of the transition zone (progress 0.5 → 1.0).
   * Drives the entrance animation of the next section.
   */
  inProgress: number

  // Actions
  setState: (newState: ScrollState) => void
  setSections: (metrics: SectionMetrics[]) => void
  setActiveSectionId: (id: string) => void
  setTransitionProgress: (progress: number) => void
  getSection: (id: string) => SectionMetrics | undefined
  getNextSection: (currentId: string) => SectionMetrics | undefined
  getPrevSection: (currentId: string) => SectionMetrics | undefined
}

export const useScrollStore = create<ScrollStore>((set, get) => ({
  state: 'IDLE',
  sections: [],
  activeSectionId: 'hero',
  transitionProgress: 0,
  outProgress: 0,
  inProgress: 0,

  setState: (newState) => set({ state: newState }),

  setSections: (metrics) => set({ sections: metrics }),

  setActiveSectionId: (id) => set({ activeSectionId: id }),

  setTransitionProgress: (progress) => {
    // outProgress: 0→1 while progress goes 0.0→0.5
    const outProgress = Math.min(progress / 0.5, 1)
    // inProgress:  0→1 while progress goes 0.5→1.0
    const inProgress  = Math.min(Math.max((progress - 0.5) / 0.5, 0), 1)
    set({ transitionProgress: progress, outProgress, inProgress })
  },
  
  getSection: (id) => get().sections.find((s) => s.id === id),
  
  getNextSection: (currentId) => {
    const list = get().sections
    const idx = list.findIndex(s => s.id === currentId)
    if (idx === -1 || idx === list.length - 1) return undefined
    return list[idx + 1]
  },
  
  getPrevSection: (currentId) => {
    const list = get().sections
    const idx = list.findIndex(s => s.id === currentId)
    if (idx <= 0) return undefined
    return list[idx - 1]
  }
}))
