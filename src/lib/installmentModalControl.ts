export const installmentModalControl = (index: number)=>{
    const forms = document.querySelectorAll('form')
    const select = document.querySelector(`#installment-select-${index}`) as HTMLSelectElement

    forms.forEach((form)=>{
      form.addEventListener('submit', async (e)=>{
        e.preventDefault()
        console.log('Estado seleccionado:', select.value)
      })
    })
  }