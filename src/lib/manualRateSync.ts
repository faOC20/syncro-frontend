import { BACK_API } from "astro:env/client"
export const manualRateSync =async ()=>{
    console.log('entre aqui')
    const result = await fetch(`${BACK_API}/api/manual-rate-sync`)
    const json = await result.json()
    console.log(json.status)
    window.location.reload()
}