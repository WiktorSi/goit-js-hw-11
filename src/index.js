// import axios from 'axios';
import Notiflix from 'notiflix';
import { getImages } from './js/getImages';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const inputForm = document.querySelector('input');
const buttonForm = document.querySelector('.form-button');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let totalImages;
let page = 1;
let query = '';
let lightbox = new SimpleLightbox('.gallery a', {
  captions: false,
});

const handleChange = e => query = e.target.value.trim();

const hideLoadMore = () => loadMore.className = 'load-more hidden';

const handleClick = async e => {
    e.preventDefault();
    hideLoadMore();
    page = 1;
    clearGallery();
    const data = await getImages(page, query);
    createGallery(data.hits);
    const { total, totalHits } = data;
    if (total && totalHits) {
        totalImages = total;
        if (totalImages - (page - 1) * 40 > 40) {
            loadMore.className = 'load-more';
        } else {
            loadMore.className = 'hidden';
        }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
};

const createGallery = data => {
  const images = data
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
        <div class="photo-card">
            <a href=${largeImageURL}><img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item"><b>Likes:</b> ${likes}</p>
                    <p class="info-item"><b>Views:</b> ${views}</p>
                    <p class="info-item"><b>Comments:</b>${comments}</p>
                    <p class="info-item"><b>Downloads:</b>${downloads}</p>
                </div>
            </a>
        </div>
            `;
    })
    .join(' ');
    gallery.insertAdjacentHTML('beforeend', images);
    lightbox.refresh();
};

const handleLoadMore = async () => {
    page++;
    const data = await getImages(page, query);
    createGallery(data.hits);
    const { total } = data;
    if (total - page * 40 > 40) {
        loadMore.className = 'load-more';
    } else {
        loadMore.className = 'hidden';
        Notiflix.Notify.warning(
            `We're sorry, but you've reached the end of search results.`
            );
        }
 
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
};

buttonForm.addEventListener('click', handleClick);
handleChange && inputForm.addEventListener('input', handleChange);

loadMore.addEventListener('click', handleLoadMore);

function clearGallery() {
    gallery.innerHTML = '';
}
