import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './script/photo-markup';
import smoothScroll from './script/scroll';

const axios = require('axios').default;

const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`;

const searchForm = document.querySelector('.search-form');
const searchList = document.querySelector('.search-list-js');
const searchInput = document.querySelector('input[name="searchQuery"]');
const targetElement = document.querySelector('.js-guard');

let itemsPerPage = 40;
let gallerySlider;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0
};

async function fetchData(page, perPage) {
  try {
    const params = new URLSearchParams({
      image_types: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: perPage,
      page,
    });
    const searchQuery = searchInput.value.trim();
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&${params}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

let observer = new IntersectionObserver(onLoad, options);
let currentPage = 1;

searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  getImages(1, 40);
}

async function getImages(page, perPage) {
  if (searchInput.value.trim() === '') {
    return Notiflix.Notify.failure(`Request cannot be empty`);
  }

  try {
    const response = await fetchData(page, perPage);
    
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(`Oooops! No images found for query <i>'${searchInput.value}</i>'`);
      searchList.innerHTML = `<p>Oooops! No images found for query <i>'${searchInput.value}</i>'. Try again!</p>`;
      return;
    }
    
    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images`);
    
    console.log(response.data);
    
    searchList.innerHTML = createMarkup(response.data.hits);
    
    observer.observe(targetElement);
        
    gallerySlider = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 950,
      navText: ['❮', '❯']
    });

  } catch (error) {
    console.error(error);
  }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entries);
      currentPage += 1;
      fetchData(currentPage, itemsPerPage)
        .then(response => {
          console.log(response);
          searchList.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
          gallerySlider.refresh();
          if (currentPage * itemsPerPage >= response.data.totalHits && currentPage !== 2) {
            setTimeout(() => {
              Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
            }, 2000);
            observer.unobserve(targetElement);
            return;
          }
          
          observer.observe(targetElement);
          
          smoothScroll();
          
        })
        .catch(error => console.log(error));
    }
  });
}
