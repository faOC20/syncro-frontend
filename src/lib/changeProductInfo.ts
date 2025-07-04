import { BACK_API } from "astro:env/client"
import { successAlert } from "./sweetAlert"

const productInfoDialog = document.getElementById('product-info-dialog') as HTMLDialogElement
const errorChangeProduct = document.getElementById('error-change-product') as HTMLDivElement

// export interface ChangeData {
//     name: string | null,
//     newCode: string | null,
//     cost: string | null
//     category: string | null
//     color: string | null
    
// }

export const changeProductInfo = async(data)=>{
    const result = await fetch(`http://localhost:5000/api/change-product-info`, {
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