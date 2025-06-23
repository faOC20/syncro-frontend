import { BACK_API } from "astro:env/client"

export const getProducts = async()=>{
    const result = await fetch(`http://localhost:5000/api/get-products`, {
        method: 'GET',
        credentials: "include" 
    })
    const json = await result.json()
    return json
}