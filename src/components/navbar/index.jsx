import React from 'react';
import Dropdown from 'components/dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUserQuery, useLogOutMutation } from '../../features/user/user';
import { Spin } from 'antd';
import { Icon } from '@iconify/react';

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const { data: InfoUser = [], error, isLoading } = useGetUserQuery();
  const [submitLogOut, { isLoading: isLoadingLogOut }] = useLogOutMutation();
  const navigate = useNavigate();
  
  
  return (
    <>
      {isLoadingLogOut && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Spin size="large" />
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: '#3024db',
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            Đang đăng xuất, vui lòng đợi...
          </span>
        </div>
      )}
      <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
        <div className="ml-[6px]">
          <div className="h-6 w-[224px] pt-1">
            <a
              className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
              href=" "
            >
              Pages
              <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {' '}
                /{' '}
            </span>
            </a>
            <Link
              className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
              to="#"
            >
              {brandText}
            </Link>
          </div>
          <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
            <Link
              to="#"
              className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
            >
              {brandText}
            </Link>
          </p>
        </div>
        
        <div className="relative mt-[3px] flex h-[61px] flex-grow-0 cursor-pointer items-center justify-around gap-3 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:shadow-none">
          <div className="flex h-full items-center rounded-full bg-lightPrimary px-2 text-navy-700 hover:bg-brand-500 hover:text-white">
            <p className="text-l px-2  ">
              👋 Hey,{' '}
              {InfoUser?.user?.first_name + ' ' + InfoUser?.user?.last_name}
            </p>
          </div>
          <Dropdown
            button={
              <img
                className="h-10 w-10 rounded-full"
                src={
                  InfoUser?.user?.profile_image ||
                  'https://i.imgur.com/8z4d2bH.png'
                }
                alt={InfoUser?.user?.first_name + ' ' + InfoUser?.user?.last_name}
              />
            }
            children={
              <>
                <div className="flex w-70  flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-3xl shadow-shadow-500">
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        👋 Hey,{' '}
                        {InfoUser?.user?.first_name +
                          ' ' +
                          InfoUser?.user?.last_name}
                      </p>{' '}
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />
                  
                  <div className="flex flex-col p-4">
                    <a
                      href=" "
                      className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                    >
                      Email: {InfoUser?.user?.email || 'Email not available'}
                    </a>
                    <a
                      href=" "
                      className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                    >
                      Gender: {InfoUser?.user?.gender === 'nam' ? 'Nam' : InfoUser?.user?.gender === 'nu' ? 'Nữ' : 'Khác'}
                    </a>
                    <a
                      href=" "
                      className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                    >
                      Role: {InfoUser?.user?.role === 'admin' ? 'Admin' : 'Editor'}
                    </a>
                    <a
                      href=" "
                      className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                    >
                      Status: {InfoUser?.user?.is_active ? 'Active' : 'Inactive'}
                    </a>
                    <button
                      onClick={async () => {
                        try {
                          const response = await submitLogOut({
                            id: InfoUser?.user?.id,
                          }).unwrap();
                          if (response) {
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('clientId');
                            navigate('/auth/sign-in', {
                              replace: true,
                            });
                          }
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      className="mt-3 text-sm p-2 rounded-xl font-medium text-red-500 transition duration-150 ease-out hover:bg-red-200 hover:ease-in"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <Icon icon="solar:logout-bold-duotone" width="24" height="24" style={{ color: 'red' }} />
                        <span>Log Out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            }
            classNames={'py-2 top-8 -left-[180px] w-max'}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
