import { signIn } from '../../features/auth/signIn';
import { user } from '../../features/user/user';
import { banner } from '../../features/banner/banner';
import { article } from '../../features/article/article';
import { categoryArticle } from '../../features/categoryArticle/categoryArticle';
import { contact } from '../../features/contact/contact';
import { statusContact } from '../../features/statusContact/statusContact';
import { resetStore } from '../../redux/resetStore';

export const handleLogout = async (dispatch) => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('clientId');
    dispatch(signIn.util.resetApiState());
    dispatch(user.util.resetApiState());
    dispatch(banner.util.resetApiState());
    dispatch(article.util.resetApiState());
    dispatch(categoryArticle.util.resetApiState());
    dispatch(contact.util.resetApiState());
    dispatch(statusContact.util.resetApiState());
    dispatch(resetStore());
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
