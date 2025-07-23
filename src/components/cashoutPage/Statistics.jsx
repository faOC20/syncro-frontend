import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDateStore } from 'src/stores/dateStore';
import { usePaymentsStore } from 'src/stores/paymentsStore';
import { useProductsStore } from 'src/stores/productsStore';

const getDatedDolar = async (date)=>{
    const response = await fetch(`http://localhost:5000/api/get-dated-dolar`, {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(date)
    })
    const json = await response.json()

    if (json.status == 'not_match'){
      return null
    }

    const {data} = json
    return data
}

const DonutChart = () => {
  const {payments} = usePaymentsStore()
  const {date} = useDateStore()
  const {dolar: currentDolar} = useProductsStore()

  const[datedDolar, setDatedDolar] = useState(null)
  
  const [data, setData] = useState(null)
  const[total, setTotal] = useState(null)

  

  useEffect(()=>{
    let dolar = null
    const getDolar = async()=>{
      dolar = await getDatedDolar(date)
      console.log(`dolar de hoy: ${dolar}`)
      if(!dolar){
        dolar = currentDolar
      }

      setDatedDolar(dolar)
      const data = ((Object.entries(payments || {}).map(([label, value]) => {

        let dolarValue = value
        if(label != 'divisas' && label != 'zelle'){
            console.log(label)
            dolarValue = value/dolar
        }
        return(
            {
                name: label,
                value: Number(dolarValue.toFixed(2)),
                color: colors[label] || '#888',
            }
        )
        
      })))

      if(data.length > 0){
        setData(data)
        setTotal(data.reduce((acc, item) => acc + item.value, 0))
      }

      else{
        setDatedDolar(null)
        setData(null)
        setTotal(null)
      }

      
    }

    if(date!=null){
      getDolar()
    }
  },[date, payments])

  const colors = {
    efectivo: '#10B981',
    divisas: '#3B82F6',
    tarjeta: '#F97316',
    zelle: '#6366F1',
    pago_movil: '#56f1ed',
    transferencia: '#EF4444',
    biopago:'#FCA5A5'
  };

  return (
    data?(
      <div className='w-full h-full relative'>
      <ResponsiveContainer width="100%" height='100%'>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={120}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}`, `${name}`]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-2xl text-theme-ocean-blue'>
        {total? `${total.toFixed(2)} $` : ''}
      </div>
      {
        datedDolar?(
          <div className='absolute top-0 left-0 text-gray-700 font-semibold flex gap-2'>
            Tasa: 
            <span className='text-theme-ocean-blue font-bold'>
            {datedDolar.toFixed(2)} Bs
            </span>
          </div>
        ):
        (
          ""
        )
      }
    </div>
    ):(
      <div className='w-full h-full flex items-center justify-center text-theme-ocean-blue font-black text-xl'>
          No se encontraron datos
      </div>
    )
  );
};

export default DonutChart;
