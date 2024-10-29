export const buildUrl = (params) => {
  const baseUrl = 'https://api.mercadolibre.com/sites/MLM/search';
  
  // Limpiamos y validamos los parámetros de precio
  const priceMin = params.priceMin ? parseFloat(params.priceMin) : '';
  const priceMax = params.priceMax ? parseFloat(params.priceMax) : '';

  const queryParams = new URLSearchParams({
    category: params.category || 'MLM1648',
    q: params.query || 'procesadores',
    // Usamos los nombres correctos de los parámetros
    ...(priceMin && !isNaN(priceMin) && { price_min: priceMin.toString() }),
    ...(priceMax && !isNaN(priceMax) && { price_max: priceMax.toString() }),
    sort: params.sort || 'relevance'
  });

  return `${baseUrl}?${queryParams.toString()}`;
};