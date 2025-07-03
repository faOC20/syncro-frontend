import {create} from 'zustand'

export const usePaymentsStore = create((set) => ({
    payments: {},
    updatePayments: (methods)=>{
        set({payments:methods})
    }
}))

