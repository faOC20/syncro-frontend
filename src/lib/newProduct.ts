import type { Product } from "@components/operationPage/OperationInfo.astro"
import { BACK_API } from "astro:env/client"
import { successAlert } from "./sweetAlert"

const addProductDialog = document.getElementById('add-product-dialog') as HTMLDialogElement
const errorNewProduct = document.getElementById('product-info-error-form') as HTMLParagraphElement


export const newProduct = async(data)=>{
    
    const result = await fetch(`${BACK_API}/api/new-product`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    const json = await result.json()

    if (json.status == 'success'){
        addProductDialog.close()
        await successAlert(json.message)
        window.location.reload()
    }

    if (json.status == 'failed'){
        errorNewProduct.innerText = json.message
    }
}