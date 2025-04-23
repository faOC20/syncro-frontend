import {BACK_API} from "astro:env/client"

export const fetchBcvRate = async () => {
    const data = await fetch(`${BACK_API}/api/bcv-rate`	)
    const {dolar_rate, last_update} = await data.json()
    return {dolar_rate, last_update}
}