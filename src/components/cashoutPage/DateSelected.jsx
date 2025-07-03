import { useDateStore } from "src/stores/dateStore"


export const DateSelected = ()=>{

    const date= useDateStore((state) => state.date)


    return (
        <div>
            {date}
        </div>
    )
}