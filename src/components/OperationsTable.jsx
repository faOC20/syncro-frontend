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




// Columnas de ejemplo - REEMPLAZAR con tus columnas reales
const columns = [
  { id: 'order_number', label: 'Nro Operación', minWidth: 120 },
  { id: 'creation_date', label: 'Fecha de creación', minWidth: 150 },
  { id: 'name', label: 'Cliente', minWidth: 150 },
  { id: 'dni', label: 'Cédula', minWidth: 120 },
  { id: 'products', label: 'Producto/s', minWidth: 200 },
  { id: 'operation_amount', label: 'Monto', minWidth: 120, align: 'right' },
  { id: 'state', label: 'Estado', minWidth: 120 }
];

// Datos de ejemplo - REEMPLAZAR con los datos de tu base de datos



export default function OperationsTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (rowData) => {
    // Aquí puedes manejar el click en la fila
    console.log('Fila clickeada:', rowData);
    // Ejemplo: abrir un modal con detalles
    // setSelectedOperation(rowData);
    // setOpenModal(true);
  };

  return (
    <section className='w-full flex flex-col'>
      <div className='w-full text-theme-light-gray bg-theme-black rounded-t-2xl text-lg flex justify-between'>
        <h2 className='font-bold py-2 pl-8'>Operaciones</h2>
        <input 
          max={new Date().toISOString().split('T')[0]}
          className='pr-5 scheme-dark' 
          type="date" 
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
        />
      </div>
      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: '0 0 10px 10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <TableContainer sx={{ 
          maxHeight: 440,
         
        }}>
          <Table stickyHeader aria-label="sticky table" sx={{ width: '100%' }}>
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
                  <TableRow>
                    <TableCell colSpan={columns.length}>Cargando...</TableCell>
                  </TableRow>
                ):(
                  filteredRows.map((row) => {
                    return (
                      <TableRow 
                        hover 
                        role="checkbox" 
                        tabIndex={-1} 
                        key={row.operationNumber}
                        onClick={() => handleRowClick(row)}
                        style={{ cursor: 'pointer' }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}  // Cambiado de rows a filteredRows
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </section>
  );
}

