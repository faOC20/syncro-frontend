
import { checkDni } from "./checkDni";
import { newOperation } from "./newOperation";
import { useProductsStore } from "src/stores/productsStore";


const confirmSection = document.getElementById('check-info') as HTMLDivElement
const dialog = document.getElementById('additional-info-dialog') as HTMLDialogElement;
const confirmProducts = document.getElementById('confirmProducts') as HTMLTableElement
const customerInfo = document.getElementById('customer-info') as HTMLDivElement
const confirmTotal = document.getElementById('confirm-total') as HTMLDivElement
const saveConfirmedInfoButton = document.getElementById('save-confirmed-info') as HTMLButtonElement
const errorFormInfo = document.getElementById('error-form-info');

const cancelConfirm = document.getElementById('cancel-confirm') as HTMLButtonElement



let toSubmit = null

const getToSubmit = ()=>{
    return toSubmit
}

cancelConfirm.addEventListener('click', ()=>{
    confirmSection.classList.add('hidden')
    form.classList.remove('hidden')


})

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
       <span>
           <span class='text-gray-500'>Cliente: </span>${customerData.name}
        </span>
        <span>
            <span class='text-gray-500'>Cédula: </span> ${customerData.dni}
        </span>
    `
        confirmSection.classList.remove('hidden');
        form.classList.add('hidden')
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


const initial = document.getElementById('initial-label') as HTMLInputElement

const handleCashea = (e)=>{
    e.preventDefault();
    // const form = document.getElementById('operation-form') as HTMLFormElement;
    isCashea = !isCashea;
    console.log(Number(isCashea));
    
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


const inputsPayments = document.querySelectorAll('.payment-amount');
const confirmPayments = document.querySelectorAll('.payment-confirm')


const handleSubmit = async (e:any) => {
    
    e.preventDefault(); 
    console.log('a')
    
    if(isSubmitting) return
    isSubmitting = true
    payments = []
    console.log('a')
    inputsPayments.forEach((input)=>{
        
            input.setAttribute('disabled', '')
            input.value = ''
        
    })
    confirmPayments.forEach((confirm)=>{
        
        confirm.classList.remove('hidden')
        
    })

    paymentsCheckboxes.forEach((checkbox)=>{
        
            checkbox.removeAttribute('disabled')
            checkbox.checked = false;

        
    })

    
   

   
    const {dolar, cartProducts} = useProductsStore.getState()

    if (cartProducts.length < 1){
        
        isSubmitting = false
        return
    }
    
    confirmProducts.innerHTML = ''
    

    
    console.log(cartProducts)
    
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    data.isCashea = String(Number(isCashea)); 
    data.total = cartProducts.reduce((iteration, product)=>iteration+parseFloat(product.salePrice)*parseFloat(product.quantity), 0).toString()
    console.log(data)

    data.products = cartProducts.map((product) => ({code:product.code_product, name:product.name_product, amount:product.quantity, serial: product.serial, sale_price: product.salePrice, update_stock_data: product.stockUpdate}));
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
        console.log('ALOOOO')
        const customerData = isCustomer.data
        console.log(customerInfo)
        confirmSection.classList.remove('hidden');
        form.classList.add('hidden')

    customerInfo.innerHTML = `
        <span>
           <span class='text-gray-500'>Cliente: </span>${customerData.name}
        </span>
        <span>
            <span class='text-gray-500'>Cédula: </span> ${customerData.dni}
        </span>
    `
    }
    
    cartProducts.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'border border-gray-100';
      
        row.innerHTML = `
          <td class="text-theme-light-blue text-start p-1 font-bold">
            ${product.name_product}
          </td>
          <td class='p-1 text-center'>
            ${product.quantity}
          </td>
          <td class='p-1 text-end'>
            ${product.salePrice}
          </td>
        `;
      
        confirmProducts.appendChild(row);
      });
      

    if (isCashea){
        confirmTotal.innerHTML = `
        
        <div class = 'flex flex-col gap-1 items-end'>
            <span id='bs-products' class='text-4xl font-bold text-theme-light-blue text-end'>
                ${new Intl.NumberFormat('de-DE').format(parseFloat((parseFloat(data.initial) * dolar).toFixed(2)))} Bs
            </span>
            
            <span id='dolar-products' class='text-2xl font-bold text-gray-700 flex justify-end gap-1'>
                <span>
                    ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(data.initial))} $
                </span>
            </span>
           
        </div>
    `
    }

    else{
        confirmTotal.innerHTML = `
        
        <div class = 'flex flex-col gap-1 justify-end'>
            <span id='bs-products' class='text-4xl font-bold text-end text-theme-light-blue'>
            ${new Intl.NumberFormat('de-DE').format(parseFloat((parseFloat(data.total) * dolar).toFixed(2)))} Bs
            </span>

            <span id='dolar-products' class='text-2xl font-bold text-gray-700 flex justify-end gap-1'>
            
                <span>
                    ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(data.total))} $
                </span>
            
            </span>
            
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
        if( data != null && payments.length>0){

            const totalAmount = payments.reduce((acc, payment)=> acc + parseFloat(payment.paymentAmount), 0)
            
            
            if (isCashea && (totalAmount < parseFloat(data.initial))){
                errorFormInfo.innerText = 'el total de metodos de pago debe ser igual a la inicial'
                console.log('el total de metodos de pago debe ser igual a la inicial')
            }
            

            
            else if (!isCashea && (totalAmount < parseFloat(data.total))){
                errorFormInfo.innerText = 'el total de metodos de pago debe ser igual al total'
                console.log('el total de metodos de pago debe ser igual al total')
            }  
            
            else{
                console.log('aja y aahor')
                data.order = order
                data.paymentMethod = payments
                await newOperation(data)
            }
        }
        else{
            errorFormInfo.innerText = 'Debe tener al menos 1 método de pago'
            console.log('Debe tener al menos 1 método de pago')
        }
    }
    else{
        errorFormInfo.innerText = 'Inserte número de orden'
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

let payments:{}[] = []

const paymentsCheckboxes = document.querySelectorAll('.payment-method')





if (paymentsCheckboxes){
    paymentsCheckboxes.forEach((checkbox)=>{
        const container = checkbox.closest('.payment-container'); // ancestro común
        const inputPayment = container?.querySelector('.payment-amount') as HTMLInputElement; 
        // const confirmPayment = container?.querySelector('.payment-confirm')

        checkbox.addEventListener('change', (e)=>{
            if(e.target.checked){
                inputPayment.removeAttribute('disabled')
                inputPayment.focus()
               
            }
            else{
                inputPayment.value = ''
                inputPayment.setAttribute('disabled', '')
            }
        })


        
        inputPayment?.addEventListener('keydown', (e)=>{
            
            if (e.key == 'Enter'){
                
            const {dolar} = useProductsStore.getState()

            if(e.target.value == '0' || e.target?.value.trim() == ''){
                console.log('digite la cantidad')
                return
            }

            const productDolar = document.getElementById('dolar-products')
            const productBs = document.getElementById('bs-products')

            payments.push({
                'paymentId': checkbox.id.split('-')[0].trim(),
                'paymentAmount': inputPayment?.value
            })

            if (!isCashea){

                const {total} = getToSubmit()

                productDolar.innerText = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    parseFloat(
                      (total - payments.reduce((acc, method) =>
                        acc + (
                          method.paymentId == '3' || method.paymentId == '6'
                            ? parseFloat(method.paymentAmount)
                            : parseFloat(method.paymentAmount) / dolar
                        ), 0)
                    ).toFixed(2)
                  ))} $`;
                  

                  productBs.innerText = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    parseFloat(
                      ((parseFloat(total) * dolar) - payments.reduce((acc, method) =>
                        acc + (
                          method.paymentId == '3' || method.paymentId == '6'
                            ? parseFloat(method.paymentAmount) * dolar
                            : parseFloat(method.paymentAmount)
                        ), 0)
                    ).toFixed(2)
                  ))} Bs`;
                  
                

            }

            else{
                const {initial} = getToSubmit()
                productDolar.innerText = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    parseFloat(
                      (initial - payments.reduce((acc, method) =>
                        acc + (
                          method.paymentId === '3' || method.paymentId === '6'
                            ? parseFloat(method.paymentAmount)
                            : parseFloat(method.paymentAmount) / dolar
                        ), 0)
                    ).toFixed(2)
                  ))} $`;
                  

                  productBs.innerText = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    parseFloat(
                      ((parseFloat(initial) * dolar) - payments.reduce((acc, method) =>
                        acc + (
                          method.paymentId === '3' || method.paymentId === '6'
                            ? parseFloat(method.paymentAmount) * dolar
                            : parseFloat(method.paymentAmount)
                        ), 0)
                    ).toFixed(2)
                  ))} Bs`;
                  
            }
            
            

            checkbox.setAttribute('disabled', '')
            inputPayment?.setAttribute('disabled', '')
            confirmPayment?.classList.add('hidden')
            console.log(payments)
            }
            
            
        })

        
    })
}






