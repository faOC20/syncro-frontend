import { newOperation } from "./newOperation";
import { useProductsStore } from "stores/productsStore";




const saveAditionalInfo = async (data) => {
    try{
      //Evento para guardar la info adicional
                      
      document.getElementById('save-additional-info')?.addEventListener('click', async () => {
            const nameInput = document.getElementById('name') as HTMLInputElement;
              const phoneInput = document.getElementById('phone') as HTMLInputElement;
              
              const additionalData = {
                  name: nameInput.value,
                  phone: phoneInput.value
              };
              
              await newOperation(JSON.stringify({...data, ...additionalData}));
              
             
              
            })
    }

    catch(e){
      console.log(e);
    }
  }

const casheaModeButton = document.getElementById('cashea-mode') as HTMLButtonElement;
const form = document.getElementById("operation-form");
let isCashea = true

const handleCashea = (e)=>{
    e.preventDefault();
    // const form = document.getElementById('operation-form') as HTMLFormElement;
    isCashea = !isCashea;
    console.log(Number(isCashea));
    const initial = document.getElementById('initial-label') as HTMLInputElement
    
    if(!isCashea){
    casheaModeButton.classList.add('opacity-30')
    initial?.setAttribute('disabled', 'true')
    initial.value = ''
    initial.classList.add('bg-gray-200')
    }

    else{
    casheaModeButton.classList.remove('opacity-30')
    initial?.removeAttribute('disabled')
    initial.classList.remove('bg-gray-200')
    }
}

const handleSubmit = async (e:any) => {
    const {cartProducts} = useProductsStore.getState()
    console.log(cartProducts)
    e.preventDefault(); 
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    data.isCashea = String(Number(isCashea)); 
    data.total = cartProducts.reduce((iteration, product)=>iteration+parseFloat(product.salePrice)*parseFloat(product.quantity), 0).toString()

    data.products = cartProducts.map((product) => ({code:product.code_product, name:product.name_product, amount:product.quantity, serial: product.serial, sale_price: product.salePrice}));
    

    const status = await newOperation(JSON.stringify(data)); 
    
    if(status == 'customer_not_found'){
        //Muestra el dialogo
        const dialog = document.getElementById('additional-info-dialog');
        if (dialog) {
            (dialog as HTMLDialogElement).showModal();
        }

        saveAditionalInfo(data);
    } 
  
    console.log(data);
    // form?.removeEventListener("submit", handleSubmit); mousekiherramienta, recarga la pagina
};



export const sendNewOperation = async () => {
try{
        
    casheaModeButton.removeEventListener('click', handleCashea)
    casheaModeButton.addEventListener('click', handleCashea)

    form?.removeEventListener("submit", handleSubmit);
    form?.addEventListener("submit", handleSubmit)

    

    
    }
    catch(e){
        console.log(e);
    };
}


