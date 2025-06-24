
import { checkDni } from "./checkDni";
import { newOperation } from "./newOperation";
import { useProductsStore } from "src/stores/productsStore";


const confirmDialog = document.getElementById('check-info') as HTMLDialogElement
const dialog = document.getElementById('additional-info-dialog') as HTMLDialogElement;
const confirmProducts = document.getElementById('confirm-products') as HTMLDivElement
const customerInfo = document.getElementById('customer-info') as HTMLDivElement
const confirmTotal = document.getElementById('confirm-total') as HTMLDivElement
const saveConfirmedInfoButton = document.getElementById('save-confirmed-info') as HTMLButtonElement

let toSubmit = null

const getToSubmit = ()=>{
    return toSubmit
}

const setToSubmit = (data)=>{
    toSubmit = data
}

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

    console.log(isChecked)

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

const orderInput = document.getElementById('orden_number') as HTMLInputElement

let order: string | null = null
const getOrder  = ()=>{
    return order
}
const setOrder = (inputOrder: string)=>{
    order = inputOrder
}

orderInput.addEventListener('input', (e)=>{
    setOrder(e.target?.value.trim())
})

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

let isSubmitting = false

const handleSubmit = async (e:any) => {
    e.preventDefault(); 
    if(isSubmitting) return

    isSubmitting = true

    const {dolar, cartProducts} = useProductsStore.getState()
    // const confirmProducts = document.getElementById('confirm-products') as HTMLDivElement
    confirmProducts.innerHTML = ''
    

    
    console.log(cartProducts)
    
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    data.isCashea = String(Number(isCashea)); 
    data.total = cartProducts.reduce((iteration, product)=>iteration+parseFloat(product.salePrice)*parseFloat(product.quantity), 0).toString()
    console.log(data)

    data.products = cartProducts.map((product) => ({code:product.code_product, name:product.name_product, amount:product.quantity, serial: product.serial, sale_price: product.salePrice}));
    setToSubmit(data)
    const isCustomer = await checkDni(data)
    
    console.log(isCustomer)

    if (isCustomer.status == 'invalid_initial'){
        isSubmitting = false
        return
    }


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
    
    console.log(cartProducts.length)
    cartProducts.forEach(product => {
        
        const productContainer = document.createElement('div')
        productContainer.innerHTML = `
            <div class = 'flex flex-col text-sm border-b gap-2 pb-3'>
                <b class='text-theme-light-blue '>
                    ${product.name_product}
                </b>
                <span class=''>
                    cantidad: ${product.quantity}
                </span>
                <span>
                    precio de venta por unidad: ${product.salePrice}
                </span>
            </div>
        `      
        confirmProducts.appendChild(productContainer)
    });

    if (isCashea){
        confirmTotal.innerHTML = `
        
        <div class = 'flex flex-col'>
            <span class='font-medium text-theme-black'>${data.initial}$ × ${dolar.toFixed(2)}</span>
            <span class='font-bold text-theme-light-blue'>${(parseFloat(data.initial)*dolar).toFixed(2)}Bs</span>
        </div>
    `
    }

    else{
        confirmTotal.innerHTML = `
        
        <div class = 'flex flex-col'>
            <span class='font-medium text-theme-black'>${data.total}$ × ${dolar.toFixed(2)}</span>
            <span class='font-bold text-theme-light-blue'>${(parseFloat(data.total)*dolar).toFixed(2)}Bs</span>
        </div>
    `
    }

    

    
    isSubmitting = false
    
};

saveConfirmedInfoButton.addEventListener('click', async()=>{
    saveConfirmedInfoButton.disabled = true
    const order = getOrder()
    
    if(order!=null && order!= ''){
        const data = getToSubmit()
        if( data != null){
            data.order = order
            await newOperation(data)
        }
    }
    else{
        console.log('la orden esta vacia')
    }
     
    saveConfirmedInfoButton.disabled= false
})


export const sendNewOperation = async () => {
    try{
        casheaModeButton.removeEventListener('click', handleCashea)
    casheaModeButton.addEventListener('click', handleCashea)
    
    form?.removeEventListener("submit", handleSubmit);
    form?.addEventListener("submit", handleSubmit)
    }

    catch(e){
        console.log(e);
    }
    
}







