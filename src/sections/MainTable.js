import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { Image } from '@nextui-org/react';
import { Star } from 'lucide-react';

function MainTable() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableColumn className='text-1xl text-center'>Modelo </TableColumn>
          <TableColumn className='text-1xl text-center'>No. de núcleos</TableColumn>
          <TableColumn className='text-1xl text-center'>Rendimiento de Clock</TableColumn>
          <TableColumn className='text-1xl text-center'>Rendimiento de Boost Clock</TableColumn>
          <TableColumn className='text-1xl text-center'>Microarquitectura</TableColumn>
          <TableColumn className='text-1xl text-center'>Potencia de Diseño Térmico</TableColumn>
          <TableColumn className='text-1xl text-center'>Rating</TableColumn>
          <TableColumn className='text-1xl text-center'>Precio</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key={1}>
            <TableCell>
              <Image 
              alt='Ejemplo de Imagen'
              src='procesador.jpg'
              className='w-36 h-36 float-left'
              />
              <div className='float-right py-16 text-xl font-semibold'>
              AMD Ryzen 5 3400G
              </div>
            </TableCell>
            <TableCell className='text-xl text-center'>4</TableCell>
            <TableCell className='text-xl text-center'>3.7 GHz</TableCell>
            <TableCell className='text-xl text-center'>4.2 GHz</TableCell>
            <TableCell className='text-xl text-center'>Zen+</TableCell>
            <TableCell className='text-xl text-center'>65 W</TableCell>
            <TableCell className='text-xl text-center'>
              <div className="flex items-center justify-center">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">(65)</span>
              </div>
            </TableCell>
            <TableCell className='text-xl text-center'>$97</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
export default MainTable;
