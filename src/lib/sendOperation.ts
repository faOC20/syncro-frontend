
import { checkDni } from "./checkDni";
import { newOperation } from "./newOperation";
import { useProductsStore } from "stores/productsStore";


const confirmDialog = document.getElementById('check-info') as HTMLDialogElement
const dialog = document.getElementById('additional-info-dialog') as HTMLDialogElement;
const confirmProducts = document.getElementById('confirm-products') as HTMLDivElement
const customerInfo = document.getElementById('customer-info') as HTMLDivElement

const saveAditionalInfo = (data) => {
    
    const saveBtn = document.getElementById('save-additional-info');

    const handler = async () => {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;

    const additionalData = {
        name: nameInput.value,
        phone: phoneInput.value
    };

    const isChecked = await checkDni({ ...data, ...additionalData });

    if (isChecked.status === 'success') {
        
        if (dialog && dialog.open) {
            dialog.close();
        }
        const customerData = isChecked.data
        
        customerInfo.innerHTML = `
            <b class='text-sm text-theme-light-blue'>
                ${customerData.name}
            </b>
            <span class = 'text-sm'>
                ${customerData.dni}
            </span>
        `
        confirmDialog.showModal();
    }
      
    };


    saveBtn?.removeEventListener('click', handler);
    saveBtn?.addEventListener('click', handler);
    
  };
  

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
    // const confirmProducts = document.getElementById('confirm-products') as HTMLDivElement
    confirmProducts.innerHTML = ''
    const saveConfirmedInfoButton = document.getElementById('save-confirmed-info') as HTMLButtonElement
    
    console.log(cartProducts)
    e.preventDefault(); 
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    data.isCashea = String(Number(isCashea)); 
    data.total = cartProducts.reduce((iteration, product)=>iteration+parseFloat(product.salePrice)*parseFloat(product.quantity), 0).toString()
    console.log(data)

    data.products = cartProducts.map((product) => ({code:product.code_product, name:product.name_product, amount:product.quantity, serial: product.serial, sale_price: product.salePrice}));

    const isCustomer = await checkDni(data)
    
   
    if(isCustomer.status == 'customer_not_found'){
        const dialog = document.getElementById('additional-info-dialog') as HTMLDialogElement;
        if (dialog) {
            
            dialog.showModal();
            
        }

        saveAditionalInfo(data);

        
    }

    else{
        const customerData = isCustomer.data
        console.log(customerInfo)
        confirmDialog.showModal();

        customerInfo.innerHTML = `
            <b class='text-sm text-theme-light-blue'>
                ${customerData.name}
            </b>
            <span class = 'text-sm'>
                ${customerData.dni}
            </span>
        `
    }
     
    cartProducts.forEach(product => {
        const productContainer = document.createElement('div')
        productContainer.innerHTML = `
            <div class = 'flex flex-col text-sm border-b pb-3'>
                <b class='text-theme-light-blue '>
                    ${product.name_product}
                </b>
                <span class=''>
                    cantidad: ${product.quantity}
                </span>
                <span>
                    precio de venta: ${product.salePrice}
                </span>
            </div>
        `      
        confirmProducts.appendChild(productContainer)
    });

    saveConfirmedInfoButton.onclick = ()=>{
        newOperation(data)
    }



     

    
};

// const status = await newOperation(JSON.stringify(data)); 
    
    // if(status == 'customer_not_found'){
    //     //Muestra el dialogo
    //     const dialog = document.getElementById('additional-info-dialog');
    //     if (dialog) {
    //         (dialog as HTMLDialogElement).showModal();
    //     }

    //     saveAditionalInfo(data);
    // } 
  
    // console.log(data);
    // form?.removeEventListener("submit", handleSubmit); mousekiherramienta, recarga la pagina

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


