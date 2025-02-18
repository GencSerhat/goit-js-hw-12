console.log('merhaba');
// Dokümantasyonda belirtilen import
import iziToast from 'izitoast';
// Stil importu
import 'izitoast/dist/css/iziToast.min.css';

// Dokümantasyonda belirtilen import
import SimpleLightbox from 'simplelightbox';
// Stil importu
import 'simplelightbox/dist/simple-lightbox.min.css';

//axios importu
import axios from "axios";

const API_KEY = '48479056-b624f953eac1ddf8407abd187';
const BASE_URL = 'https://pixabay.com/api/';

// DOM öğelerimi seçtim

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-btn');
const imagesContainer = document.querySelector('.images-container');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector(".load-more-btn");

let currentPage=1;
let perPage = 40;
let currentQuery =""; // Mevcut arama sorgusunu saklamak için
let totalImages = 0; // Toplam resim sayısını saklamak için

//Butona tıklama olayı

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim(); // input değerini aldım.
  if (query) {
    currentQuery = query; // Yeni sorguyu sakla
   imagesContainer.innerHTML = ""; // Önceki içeriği temizle
    fetchImages(query); // resimleri getir
    totalImages = 0; // Toplam resim sayısını sıfırla
  } else {
    iziToast.warning({
      message: 'Please enter a search term.',
      position: 'topRight',
    });
  }
});



// Sayfa ve limit parametrelerini döndüren fonksiyon
function fetchPosts(query) {
  return new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: perPage, // API'nin desteklediği per_page parametresi
    page: currentPage, // Doğru sayfa numarası parametresi
  }).toString();
  }
//  Pixabay dan axios ile api çekme

async function fetchImages(query) {
  const url = `${BASE_URL}?${fetchPosts(query)}`;
  
    loader.style.visibility = "visible"; // Loader'ı göster
    try {
      const response = await axios.get(url);
  
      if (response.data.hits.length > 0) {
        displayImages(response.data.hits);
      } else {
        iziToast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
      }
      loadMoreBtn.style.visibility = "visible"; // Load More  Btn'u göster

      // totalhits
      if (totalImages >= response.data.totalHits) {
        loadMoreBtn.style.display = "none"; // Load More butonunu gizle
        iziToast.info({
          message: "Tüm resimler yüklendi! Başka sonuç yok.",
          position: "topRight",
        });
      }
    } catch (error) {
        iziToast.error({
            message:
              "We're sorry, but you've reached the end of search results",
            position: "topRight",
          });
          loadMoreBtn.style.visibility = "hidden"; // Load More  Btn'u gizle
      console.log("Hata :", error);
     
    } finally {
      loader.style.visibility = "hidden"; // Loader'ı gizle
    }
  }

  loadMoreBtn.addEventListener("click", () => {
    loader.style.visibility = "visible"; // Loader'ı göster
    currentPage++;
    
    fetchImages(currentQuery);
   
  });
  





// Resimleri ekrana bastım
function displayImages(images) {
  const markup = images

    .map(
      image => `
        <div class="image-card">
       <a href="${image.largeImageURL}"> <img src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}"></a>
         <div class="info">
             <p><strong>Likes:</strong><br> ${image.likes}</br></p>
                    <p><strong>Views:</strong> <br>${image.views}</br></p>
                    <p><strong>Comments:</strong> <br>${image.comments}</br></p>
                    <p><strong>Downloads:</strong><br> ${image.downloads}</br></p>
                </div>
            </div>

        `
    )
    

    .join('');
    imagesContainer.insertAdjacentHTML("beforeend", markup); // Yeni resimleri ekle

  const lightbox = new SimpleLightbox('.image-card a', {
    captionsData: 'alt', // Alt metnini göster
    captionDelay: 250, // Alt metnin görünme gecikmesi (ms)
    nav: true, //sağa/sola kaydırma
  });
  lightbox.refresh();
}