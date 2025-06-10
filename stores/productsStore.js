import {create} from 'zustand'

export const useProductsStore = create((set) => ({
    total: 0,
    cartProducts: null,
    updateProducts: (cart) => {
        set({cartProducts:cart})}
  }))