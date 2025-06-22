import { BACK_API } from "astro:env/client"
import { successAlert } from "./sweetAlert"

const productInfoDialog = document.getElementById('product-info-dialog') as HTMLDialogElement
const errorChangeProduct = document.getElementById('change-product-error') as HTMLParagraphElement

export interface ChangeData {
    name: string | null,
    newCode: string | null,
    cost: string | null
    amount: string | null
    category: string | null
    color: string | null
    warehouse: string | null
}

export const changeProductInfo = async(data: ChangeData)=>{
    const result = await fetch(`${BACK_API}/api/change-product-info`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    const json = await result.json()

    if (json.status == 'success'){
        productInfoDialog.close()
        await successAlert(json.message)
        window.location.reload()
    }

    if (json.status == 'failed'){
        errorChangeProduct.innerText = json.message
    }
}