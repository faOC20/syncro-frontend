import { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import { operationDateFilter } from '@lib/operationDateFilter';
import casheaLogo from '@icons/cashea-logo.avif'
import mileniumLogo from '../assets/logos/milenium.svg'





const columns = [
  { id: 'order_number', label: 'Nro de orden', minWidth: 120 },
  { id: 'creation_date', label: 'Fecha de creación', minWidth: 150 },
  { id: 'name', label: 'Cliente', minWidth: 150 },
  { id: 'dni', label: 'Cédula', minWidth: 120 },
  { id: 'products', label: 'Producto/s', minWidth: 150 },
  { id: 'operation_amount', label: 'Monto', minWidth: 120 },
  { id: 'state', label: 'Estado', minWidth: 120 },
  {id:'is_cashea', label: 'Tipo', minWidth: 120}
];




export default function OperationsTable() {

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredRows, setRows] = useState([]); // Inicializado como array vacío
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar carga

  useEffect(() => {
    const filterData = async () => {
      setIsLoading(true);
      try {
        const {data} = await operationDateFilter(currentDate);
        setRows(data || []); // Asegura que siempre sea un array
      } catch (error) {
        console.error('Error fetching data:', error);
        setRows([]); // En caso de error, mantener array vacío
      } finally {
        setIsLoading(false);
      }
    };
    filterData();
  }, [currentDate]);



  const handleRowClick = (rowData) => {
    // Aquí puedes manejar el click en la fila
    console.log('Fila clickeada:', rowData);
    window.location.href = `operation/${rowData.order_number}`

    // Ejemplo: abrir un modal con detalles
    // setSelectedOperation(rowData);
    // setOpenModal(true);
  };

  return (
    <section className='w-full flex flex-col'>
      <div className='w-full text-theme-black text-lg flex justify-between bg-white rounded-t-lg shadow-md px-6 py-7'>
        <h2 className='font-bold text-theme-light-blue text-xl'>Operaciones</h2>
        
        <input 
          max={new Date().toISOString().split('T')[0]}
          className='px-4 py-2.5 scheme-light text-theme-black  rounded-lg shadow-md border border-theme-ocean-blue focus:outline-none focus:ring-2 focus:ring-blue-300  duration-200 ease-in-out hover:bg-theme-ocean-blue hover:scheme-dark hover:text-theme-light-gray  cursor-pointer font-medium text-sm' 
          type="date" 
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          onClick={(e) => e.target.showPicker()}
        />
      </div>
   
      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: '0 0 10px 10px',
        fontFamily: 'PoppinsRegular'
      }}>
        <TableContainer sx={{ 
          maxHeight: 440,
         
        }}>
          <Table  stickyHeader aria-label="sticky table" sx={{ width: '100%', paddingX: '24px', paddingY:'20px' }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                isLoading ? (
                  ""
                ):(
                  filteredRows.map((row) => {
                    return (
                      <TableRow 
                        hover 
                        role="checkbox" 
                        tabIndex={-1} 
                        key={row.operationNumber}
                        onClick={() => handleRowClick(row)}
                        style={{ cursor: 'pointer'}}
                      >
                        {columns.map((column) => {

                          const opTypes = {
                            1: 'src/icons/cashea-logo.avif',
                            0: 'src/icons/milenium-logo.avif'
                          }

                          const value = row[column.id];
                          
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id == 'is_cashea'
                                ? 
                                    <div className='size-8' >
                                      <img src={opTypes[value]} alt="" className='rounded-sm size-full'/>
                                    </div>
                                
                                : value}
                                
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
    
      </Paper>
      
    </section>
  );
}
