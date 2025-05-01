import { BACK_API } from "astro:env/client"



export const operationDateFilter = async(date: any)=>{
    try{
        const result = await fetch(`${BACK_API}/api/get-operations`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(date)
        })
        const json = await result.json()
        console.log(json.data)
        return json
    }
    catch(error){
        console.log(error)
    }

}