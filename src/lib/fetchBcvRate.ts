export const fetchBcvRate = async () => {
    const dolar = document.getElementById("dolar-bcv");
    const data = await fetch('http://localhost:5000/api/bcv-rate')
    const {dolar_rate} = await data.json()
    console.log(dolar_rate)
}