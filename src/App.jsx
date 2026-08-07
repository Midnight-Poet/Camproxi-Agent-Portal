import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';
import SignIn from './pages/publicRoutes/SignIn';
import Onboarding from './pages/publicRoutes/Onboarding';
import Dashboard from './pages/privateRoutes/Dashboard';
import MyListings from './pages/privateRoutes/MyListings';

import Requests from './pages/privateRoutes/Requests';
import Profile from './pages/privateRoutes/Profile';
import EditProfile from './pages/privateRoutes/settings/EditProfile';
import Verification from './pages/privateRoutes/settings/Verification';
import NotifSettings from './pages/privateRoutes/settings/NotifSettings';
import HelpCenter from './pages/privateRoutes/settings/HelpCenter';
import SendFeedback from './pages/privateRoutes/settings/SendFeedback';
import Reviews from './pages/privateRoutes/settings/Reviews';
import ListingDetails from './pages/privateRoutes/ListingDetails';
import StudentProfile from './pages/privateRoutes/StudentProfile';
import MessagesPage from './pages/privateRoutes/Messages';
import Notifications from './pages/privateRoutes/Notifications';
import NotFound from './pages/NotFound';
import { PublicRoute } from './pages/publicRoutes';
import { PrivateRoute } from './pages/privateRoutes';
import AuthWrapper from './components/auth/AuthWrapper';

export default function App() {
	return (
		<BrowserRouter>
			<AppProvider>
				<NotificationProvider>
					<ChatProvider>
						<AuthWrapper>
							<Routes>
								<Route element={<PublicRoute />}>
								<Route
									path='/'
									element={<Navigate to='/signin' replace />}
								/>
								<Route path='/signin' element={<SignIn />} />
								<Route path='/onboarding' element={<Onboarding />} />
							</Route>
							<Route element={<PrivateRoute />}>
								<Route path='/dashboard' element={<Dashboard />} />
								<Route path='/listings' element={<MyListings />} />
								<Route path='/listings/:id' element={<ListingDetails />} />
								<Route path='/requests' element={<Requests />} />
								<Route path='/student/:id' element={<StudentProfile />} />
								<Route path='/messages' element={<MessagesPage />} />
								<Route path='/messages/:id' element={<MessagesPage />} />
								<Route path='/notifications' element={<Notifications />} />
								<Route path='/profile' element={<Profile />} />
								<Route path='/profile/edit' element={<EditProfile />} />
								<Route
									path='/profile/verification'
									element={<Verification />}
								/>
								<Route path='/profile/notifications' element={<NotifSettings />} />
								<Route path='/profile/help' element={<HelpCenter />} />
								<Route
									path='/profile/feedback'
									element={<SendFeedback />}
								/>
								{/* <Route
									path='/profile/reviews'
									element={<Reviews />}
								/> */}
							</Route>
							<Route path='*' element={<NotFound />} />
							</Routes>
						</AuthWrapper>
					</ChatProvider>
				</NotificationProvider>
			</AppProvider>
		</BrowserRouter>
	);
}
