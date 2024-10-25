import React, { useEffect, useState, useCallback } from 'react';
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
import { SearchForm } from '../mercado_api';
import { buildUrl, fetchItemsFromAPI } from '../mercado_api/';

function MainTable() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banList, setBanList] = useState(
    () => JSON.parse(localStorage.getItem('banList')) || []
  );

  // Estado para los filtros de búsqueda
  const [searchParams, setSearchParams] = useState({
    category: 'MLM1648',
    query: 'procesadores',
    priceMin: '',
    priceMax: '',
    sort: 'relevance',
  });

  // Función para guardar las listas en localStorage
  const saveToLocalStorage = (list, key) => {
    localStorage.setItem(key, JSON.stringify(list));
  };

  // Función para marcar un producto como no deseado
  const markAsUndesired = (product) => {
    const title = product.title.toLowerCase();
    const matchedKeywords = title.split(' ');
    const newBanList = [...banList, ...matchedKeywords];
    setBanList(newBanList);
    saveToLocalStorage(newBanList, 'banList');
  };

  // Filtrar los productos
  const filterProducts = useCallback(
    (products) => {
      return products.filter((product) => {
        const title = product.title.toLowerCase();
        return !banList.some((bannedWord) => title.includes(bannedWord));
      });
    },
    [banList]
  );

  // Extraer especificaciones del título
  const extractSpecs = (title) => {
    const lowerTitle = title.toLowerCase();
    return {
      cores: lowerTitle.match(/(\d+)\s*(?:cores?|núcleos)/i)?.[1] || 'N/A',
      clockSpeed: lowerTitle.match(/(\d+\.?\d*)\s*(?:ghz)/i)?.[1] 
        ? `${lowerTitle.match(/(\d+\.?\d*)\s*(?:ghz)/i)[1]} GHz` 
        : 'N/A',
      boostClock: lowerTitle.match(/(?:boost|turbo).*?(\d+\.?\d*)\s*(?:ghz)/i)?.[1]
        ? `${lowerTitle.match(/(?:boost|turbo).*?(\d+\.?\d*)\s*(?:ghz)/i)[1]} GHz`
        : 'N/A',
      architecture: 
        lowerTitle.includes('zen') ? 'Zen' :
        lowerTitle.includes('alder lake') ? 'Alder Lake' :
        lowerTitle.includes('rocket lake') ? 'Rocket Lake' :
        'N/A',
      tdp: lowerTitle.match(/(\d+)\s*(?:w|watts?)/i)?.[1]
        ? `${lowerTitle.match(/(\d+)\s*(?:w|watts?)/i)[1]}W`
        : 'N/A',
    };
  };

  // Obtener productos
  const getProducts = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('No access token found. Please authenticate first.');
      return;
    }

    try {
      setLoading(true);
      const url = buildUrl(searchParams);
      const data = await fetchItemsFromAPI(url, accessToken);
      const filteredItems = filterProducts(data.results);
      setItems(filteredItems);
      setError(null);
    } catch (err) {
      setError(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [searchParams, filterProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getProducts();
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <SearchForm
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        handleSubmit={handleSubmit}
      />
      
      <Table aria-label="Tabla de Procesadores">
        <TableHeader>
          <TableColumn className="text-center">Modelo</TableColumn>
          <TableColumn className="text-center">No. de núcleos</TableColumn>
          <TableColumn className="text-center">Rendimiento de Clock</TableColumn>
          <TableColumn className="text-center">Rendimiento de Boost Clock</TableColumn>
          <TableColumn className="text-center">Microarquitectura</TableColumn>
          <TableColumn className="text-center">Potencia de Diseño Térmico</TableColumn>
          <TableColumn className="text-center">Rating</TableColumn>
          <TableColumn className="text-center">Precio</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const specs = extractSpecs(item.title);
            return (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Image 
                      alt={item.title}
                      src={item.thumbnail}
                      className="w-24 h-24 object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <button 
                        onClick={() => markAsUndesired(item)}
                        className="text-sm text-red-500 hover:text-red-700 mt-2"
                      >
                        Marcar como no deseado
                      </button>
                      <a
                        href={item.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Ver en Mercado Libre
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">{specs.cores}</TableCell>
                <TableCell className="text-center">{specs.clockSpeed}</TableCell>
                <TableCell className="text-center">{specs.boostClock}</TableCell>
                <TableCell className="text-center">{specs.architecture}</TableCell>
                <TableCell className="text-center">{specs.tdp}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, index) => (
                      <Star 
                        key={index} 
                        className={`w-4 h-4 ${
                          index < Math.floor(item.seller.seller_reputation.level_id) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({item.seller.seller_reputation.transactions.total})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  ${item.price.toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default MainTable;