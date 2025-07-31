import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNavStore = create(
  persist(
    (set) => ({
      selectedOption: null,
      setSelectedOption: (option) => set({ selectedOption: option }),
    }),
    {
      name: 'nav-store', // clave que se usará en localStorage
    }
  )
)