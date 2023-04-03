import axios from 'axios';
import Notiflix from 'notiflix';

const API_URL = 'https://pixabay.com/api';
const API_KEY = '34988315-aad964ae3cba36a43e5c60760';
let totalHits = 0;

export const getImages= async (page, query) => {
  const endPoint = API_URL + `/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    const response = await axios.get(endPoint);
    if (response.data.totalHits === 0){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return {};
  }
    const { data } = response;
   return data;
};