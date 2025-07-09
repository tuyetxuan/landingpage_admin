import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {signIn} from '../features/auth/signIn';
import {user} from '../features/user/user';
import {banner} from '../features/banner/banner';
import {article} from '../features/article/article';
import {services} from '../features/service/service';
import {categoryArticle} from '../features/categoryArticle/categoryArticle';
import {categoryService} from '../features/categoryService/categoryService';
import {contact} from '../features/contact/contact';
import {statusContact} from '../features/statusContact/statusContact';
import {resetStore} from './resetStore';

const appReducer = combineReducers({
	[signIn.reducerPath]: signIn.reducer,
	[user.reducerPath]: user.reducer,
	[banner.reducerPath]: banner.reducer,
	[article.reducerPath]: article.reducer,
	[categoryArticle.reducerPath]: categoryArticle.reducer,
	[contact.reducerPath]: contact.reducer,
	[statusContact.reducerPath]: statusContact.reducer,
	[categoryService.reducerPath]: categoryService.reducer,
	[services.reducerPath]: services.reducer,
});

const rootReducer = (state, action) => {
	if (action.type === resetStore.type) {
		state = undefined;
	}
	return appReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(signIn.middleware)
			.concat(user.middleware)
			.concat(banner.middleware)
			.concat(article.middleware)
			.concat(categoryArticle.middleware)
			.concat(contact.middleware)
			.concat(statusContact.middleware)
			.concat(services.middleware)
			.concat(categoryService.middleware),
});

setupListeners(store.dispatch);
