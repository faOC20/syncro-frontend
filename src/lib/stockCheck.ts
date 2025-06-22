import { BACK_API } from "astro:env/client"

export const stockCheck = async(data)=>{
    const result = await fetch(`${BACK_API}/api/stock-check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'

    })
    const json = await result.json()
    console.log(json.message)

    return json
    
}