import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [localSearchParams, setLocalSearchParams] = useState({
    query: '',
    priceMin: '',
    priceMax: '',
    sort: 'relevance'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      ...localSearchParams,
      priceMin: localSearchParams.priceMin ? Number(localSearchParams.priceMin) : undefined,
      priceMax: localSearchParams.priceMax ? Number(localSearchParams.priceMax) : undefined,
    };
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Palabra clave: </label>
        <input
          type="text"
          name="query"
          value={localSearchParams.query}
          onChange={handleInputChange}
          placeholder="procesadores"
        />
      </div>

      <div>
        <label>Precio mínimo: </label>
        <input
          type="number"
          name="priceMin"
          value={localSearchParams.priceMin}
          onChange={handleInputChange}
          placeholder="Ej: 1000"
        />
      </div>

      <div>
        <label>Precio máximo: </label>
        <input
          type="number"
          name="priceMax"
          value={localSearchParams.priceMax}
          onChange={handleInputChange}
          placeholder="Ej: 5000"
        />
      </div>

      <div>
        <label>Ordenar por: </label>
        <select
          name="sort"
          value={localSearchParams.sort}
          onChange={handleInputChange}
        >
          <option value="relevance">Relevancia</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>
      </div>

      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchForm;