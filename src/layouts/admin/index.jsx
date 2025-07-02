import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';
import routes from 'routes.js';
import { useGetUserQuery } from '../../features/user/user';

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState('Main Dashboard');
  const { data: InfoUser = [], error, isLoading } = useGetUserQuery();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userInfo = localStorage.getItem('clientId');
  if (!accessToken || !refreshToken || !userInfo) {
    navigate('/auth/sign-in', { replace: true });
  }
  React.useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true),
    );
  }, []);
  
  React.useEffect(() => {
    if (error) console.error('Error fetching user data:', error);
    else getActiveRoute(routes);
  }, [location.pathname, error]);
  
  const getActiveRoute = (routes) => {
    let activeRoute = 'Main Dashboard';
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + '/' + routes[i].path,
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === 'admin') {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={'Admin Dashboard'}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="mx-auto mb-auto h-full min-h-[84vh] p-3 pt-5">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={
                    location.pathname === '/admin' ? (
                      <Navigate to="/admin/dashboard" replace />
                    ) : null
                  }
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
