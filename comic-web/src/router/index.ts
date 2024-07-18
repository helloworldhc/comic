import { createRouter, createWebHashHistory } from 'vue-router'
import LibraryView from '../views/LibraryView.vue';
import MainView from '../views/MainView.vue';
const LibraryComicView = () => import('../views/LibraryComicView.vue')
const ComicView = () => import('../views/ComicView.vue')
const ComicReadingView = () => import('../views/ComicReadingView.vue')
const SearchResultView = () => import('../views/SearchResultView.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    component: MainView,
    children: [{
      path: '',
      name: 'libraries',
      component: LibraryView,
    }, {
      path: '/libraries/:id',
      name: 'libraryComic',
      component: LibraryComicView,
    }, {
      path: '/libraries/:id/comic/:comicId',
      name: 'comic',
      component: ComicView,
    }, {
      path: '/search/:search',
      name: 'searchResult',
      component: SearchResultView,
      props: true
    }]
  }, {
    path: '/comic/:id/read',
    name: 'comicRead',
    component: ComicReadingView,
    props: true
  }]
})

export default router;