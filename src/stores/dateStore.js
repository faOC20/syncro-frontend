import {create} from 'zustand'
export const useDateStore = create((set)=>({
    date: null,
    updateDate: (selectedDate)=>{
        set({date:selectedDate})
    }
}))