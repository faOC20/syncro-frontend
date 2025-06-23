import {BACK_API} from "astro:env/client"
import { useProductsStore } from "src/stores/productsStore";

export const fetchBcvRate = async () => {
    const {updateDolar} = useProductsStore.getState()
    const data = await fetch(`http://localhost:5000/api/bcv-rate`	)
    const {dolar_rate, last_update} = await data.json()
    updateDolar(parseFloat(dolar_rate))
    return {dolar_rate, last_update}
}