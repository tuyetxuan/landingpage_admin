import {Bounce, toast} from 'react-toastify';

const ToastNotification = ({type = 'error', title, message}) => {
	const toastOptions = {
		position: 'top-right',
		autoClose: 1000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'light',
		transition: Bounce,
	};
	
	const toastContent = (
		<div className="flex w-full flex-col items-start justify-start gap-1">
			<div className="text-base font-semibold">{title}</div>
			<div className="text-sm text-gray-500">{message}</div>
		</div>
	);
	
	switch (type) {
		case 'success':
			toast.success(toastContent, toastOptions);
			break;
		case 'warning':
			toast.warning(toastContent, toastOptions);
			break;
		case 'info':
			toast.info(toastContent, toastOptions);
			break;
		case 'error':
		default:
			toast.error(toastContent, toastOptions);
			break;
	}
};

export default ToastNotification;
