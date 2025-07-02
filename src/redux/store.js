import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { signIn } from '../features/auth/signIn';
import { user } from '../features/user/user';
import { banner } from '../features/banner/banner';
import { article } from '../features/article/article';
import { categoryArticle } from '../features/categoryArticle/categoryArticle';
import { contact } from '../features/contact/contact';
import { statusContact } from '../features/statusContact/statusContact';

export const store = configureStore({
  reducer: {
    [signIn.reducerPath]: signIn.reducer,
    [user.reducerPath]: user.reducer,
    [banner.reducerPath]: banner.reducer,
    [article.reducerPath]: article.reducer,
    [categoryArticle.reducerPath]: categoryArticle.reducer,
    [contact.reducerPath]: contact.reducer,
    [statusContact.reducerPath]: statusContact.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(signIn.middleware)
      .concat(user.middleware)
      .concat(banner.middleware)
      .concat(article.middleware)
      .concat(categoryArticle.middleware)
      .concat(contact.middleware)
      .concat(statusContact.middleware);
  },
});

setupListeners(store.dispatch);
