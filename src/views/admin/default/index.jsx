import { MdBarChart, MdGroups } from 'react-icons/md';
import AnimatedNumbers from 'react-animated-numbers';
import Widget from 'components/widget/Widget';
import UserProfileCard from './UserProfileCard';
import { useGetUserQuery } from '../../../features/user/user';
import { TypeAnimation } from 'react-type-animation';

const Dashboard = () => {
  const {
    data: InfoUser = [],
    error,
    isLoading: userIsLoading,
  } = useGetUserQuery();
  return (
    <div>
      <div className="mt-3 grid grid-cols-6 gap-4">
        <Widget
          icon={<MdBarChart className="h-9 w-9" />}
          title={'Total Users'}
          subtitle={(
            <AnimatedNumbers
              useThousandsSeparator
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.3,
              })}
              animateToNumber={123}
            />
          )}
        />
        <Widget
          icon={<MdBarChart className="h-9 w-9" />}
          title={'Total Contact'}
          subtitle={(
            <AnimatedNumbers
              useThousandsSeparator
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.3,
              })}
              animateToNumber={123}
            />
          )}
        />
        <Widget
          icon={<MdBarChart className="h-9 w-9" />}
          title={'Total Services'}
          subtitle={(
            <AnimatedNumbers
              useThousandsSeparator
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.3,
              })}
              animateToNumber={123}
            />
          )}
        />
        <Widget
          icon={<MdBarChart className="h-9 w-9" />}
          title={'Total Posts'}
          subtitle={(
            <AnimatedNumbers
              useThousandsSeparator
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.3,
              })}
              animateToNumber={123}
            />
          )}
        />
        <Widget
          icon={<MdGroups className="h-9 w-9" />}
          title={'Total Users Admin'}
          subtitle={(
            <AnimatedNumbers
              useThousandsSeparator
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.3,
              })}
              animateToNumber={123}
            />
          )}
        />
        <Widget
          icon={<MdGroups className="h-9 w-9" />}
          title={'Total Users Editors'}
          subtitle={(
            <AnimatedNumbers
              useThousandsSeparator
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.3,
              })}
              animateToNumber={123}
            />
          )}
        />
      </div>
      <div className="flex items-center justify-center min-h-[100px] mt-4 rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
        <TypeAnimation
          sequence={[
            'Chào mừng bạn đến với trang quản trị của chúng tôi',
            1000,
            'Chúc bạn có một ngày làm việc hiệu quả',
            1000,
            'Đừng quên kiểm tra các thông tin đăng ký tư vấn mới nhất',
            1000,
            'Chúng tôi luôn sẵn sàng hỗ trợ bạn',
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: '2em', display: 'inline-block', color: '#432AFB', fontWeight: 'bold', fontFamily: 'Pacifico, cursive' }}
          repeat={Infinity}
        />
      </div>
      <div className="grid grid-cols-12 gap-4 min-h-[500px] mt-4">
        <div className="col-span-9 flex items-center justify-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
        
        </div>
        <div className="col-span-3 flex items-center justify-center rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
          <UserProfileCard user={
            {
              username: InfoUser?.user?.username || 'N/A',
              email: InfoUser?.user?.email || 'N/A',
              first_name: InfoUser?.user?.first_name || 'N/A',
              last_name: InfoUser?.user?.last_name || 'N/A',
              profile_image: InfoUser?.user?.profile_image || 'https://via.placeholder.com/150',
              gender: InfoUser?.user?.gender === 'nam' ? 'Nam' : InfoUser?.user?.gender === 'nu' ? 'Nữ' : 'Khác',
              role: InfoUser?.user?.role || 'N/A',
              is_active: InfoUser?.user?.is_active ? 'Đang hoạt động' : 'Không hoạt động',
              created_at: InfoUser?.user?.created_at,
            }
          } />
        </div>
      </div>
    </div>
  
  );
};

export default Dashboard;
