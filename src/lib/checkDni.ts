import { BACK_API } from "astro:env/client"



export const checkDni = async (data)=>{

    const errorInfo = document.getElementById('error-info');
    const errorFormInfo = document.getElementById('error-form-info');

    const result = await fetch(`${BACK_API}/api/customer-check`, {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await result.json()
    console.log(json)

    if (json.status === 'invalid_phone'){
            
            
        errorInfo?.classList.remove('invisible');
        if (errorInfo) {
            errorInfo.textContent = json.message;
        }
    }

    if (json.status === 'repeated_phone'){
        console.log('hola')
        errorInfo?.classList.remove('invisible');
        if (errorInfo) {
            errorInfo.textContent = json.message;
        }
    }

    if (json.status === 'repeated_order'){
        errorFormInfo?.classList.remove('invisible');
        if (errorFormInfo) {
            errorFormInfo.textContent = json.message;
        }
    }

    return json
}