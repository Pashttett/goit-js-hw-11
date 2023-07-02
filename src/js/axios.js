const axios = require('axios').default;

const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`;

async function fetchData(page, perPage, searchQuery) {
  try {
    const params = new URLSearchParams({
      image_types: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: perPage,
      page,
    });

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&${params}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default fetchData;
