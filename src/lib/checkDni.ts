import { BACK_API } from "astro:env/client"



export const checkDni = async (data)=>{

    const errorInfo = document.getElementById('error-info');
    const errorFormInfo = document.getElementById('error-form-principal');

    const result = await fetch(`http://localhost:5000/api/customer-check`, {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data),
        credentials: 'include'
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

    if(json.status === 'invalid_initial'){
        errorFormInfo.innerText = json.message
    }

    return json
}