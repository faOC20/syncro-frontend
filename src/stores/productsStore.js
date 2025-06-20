import {create} from 'zustand'

export const useProductsStore = create((set) => ({
    total: 0,
    cartProducts: null,
    dolar: 0,
    updateProducts: (cart) => {
        set({cartProducts:cart})},
    
    updateDolar: (price)=>{
        set({dolar:price})
    }
}))