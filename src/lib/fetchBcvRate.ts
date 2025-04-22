export const fetchBcvRate = async () => {
    const dolar = document.getElementById("dolar-bcv");
    const data = await fetch('http://localhost:5000/api/bcv-rate')
    const {dolar_rate, last_update} = await data.json()
    return {dolar_rate, last_update}
}