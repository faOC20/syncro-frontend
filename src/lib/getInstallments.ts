import { BACK_API } from "astro:env/client";

export const getInstallments = async (orderNumber: string | undefined) => {
    try {
        const result = await fetch(`${BACK_API}/api/get-installments`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderNumber)
        })

        if (result){
            const {data} = await result.json()
            return data
        }

        else{
            console.log("No result")
        }
    }

    catch (error) {
        console.log(error)
    }
}