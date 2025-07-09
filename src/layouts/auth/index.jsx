import { Route, Routes } from 'react-router-dom';
import routes from 'routes.js';

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === 'auth') {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex  min-h-[100vh] w-full max-w-[1383px] flex-col  justify-start md:max-w-[100%]">
              <Routes>
                {getRoutes(routes)}
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
