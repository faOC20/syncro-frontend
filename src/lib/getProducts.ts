import { BACK_API } from "astro:env/client"

export const getProducts = async()=>{
    const result = await fetch(`${BACK_API}/api/get-products`, {
        method: 'GET',
        credentials: "include" 
    })
    const json = await result.json()
    return json
}