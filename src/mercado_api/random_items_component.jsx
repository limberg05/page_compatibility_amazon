import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SearchForm, buildUrl, fetchItemsFromAPI } from './';
import debounce from 'lodash/debounce';

const RandomItemsComponent = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banList, setBanList] = useState(
    () => JSON.parse(localStorage.getItem('banList')) || []
  );

  const [searchParams, setSearchParams] = useState({
    category: 'MLM1648',
    query: 'procesadores',
    priceMin: '',
    priceMax: '',
    sort: 'relevance',
  });

  const saveToLocalStorage = (list, key) => {
    localStorage.setItem(key, JSON.stringify(list));
  };

  const markAsUndesired = (product) => {
    const title = product.title.toLowerCase();
    const matchedKeywords = title.split(' ');

    const newBanList = [...banList, ...matchedKeywords];
    setBanList(newBanList);
    saveToLocalStorage(newBanList, 'banList');
  };

  const filterProducts = useCallback((products) => {
    return products.filter((product) => {
      const title = product.title.toLowerCase();
      return !banList.some((bannedWord) => title.includes(bannedWord));
    });
  }, [banList]);

  const getRandomItems = useCallback(async (params) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (!accessToken) {
      setError('No access token found. Please authenticate first.');
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      const url = buildUrl(params);
      const data = await fetchItemsFromAPI(url, accessToken);
      
      // Aplicamos un filtro adicional para respetar los límites de precio
      const priceFilteredItems = data.results.filter(item => {
        const itemPrice = parseFloat(item.price);
        const minPrice = params.priceMin ? parseFloat(params.priceMin) : -Infinity;
        const maxPrice = params.priceMax ? parseFloat(params.priceMax) : Infinity;
        return itemPrice >= minPrice && itemPrice <= maxPrice;
      });
  
      const filteredItems = filterProducts(priceFilteredItems);
      setItems(filteredItems);
      setError(null);
    } catch (err) {
      setError(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filterProducts]);

  // Usar useMemo para crear la función debounced
  const debouncedSearch = useMemo(
    () => debounce((params) => {
      getRandomItems(params);
    }, 300),
    [getRandomItems]
  );

  // Limpiar el debounce cuando el componente se desmonte
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback((newSearchParams) => {
    setSearchParams(newSearchParams);
    debouncedSearch(newSearchParams);
  }, [debouncedSearch]);

  useEffect(() => {
    debouncedSearch(searchParams);
  }, [debouncedSearch, searchParams]);

  return (
    <div>
      <h1>Buscar Procesadores</h1>
      <SearchForm onSearch={handleSearch} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : items.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} style={{ marginBottom: '20px' }}>
              <h2>{item.title}</h2>
              <img src={item.thumbnail} alt={item.title} />
              <p>Precio: ${item.price}</p>
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver producto
              </a>
              <button onClick={() => markAsUndesired(item)}>
                Marcar como no deseado
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RandomItemsComponent;