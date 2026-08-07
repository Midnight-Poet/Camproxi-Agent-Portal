import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-bg px-4'>
			<div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary'>
				<Icon name='info' size={40} />
			</div>
			<h1 className='text-5xl font-extrabold text-ink mb-2'>404</h1>
			<p className='text-muted text-center max-w-sm mb-8 text-sm'>
				Oops! The page you're looking for doesn't exist or has been moved.
			</p>
			<button
				onClick={() => navigate('/')}
				className='bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-primary-600 transition-colors'
			>
				Go Home
			</button>
		</div>
	);
}
