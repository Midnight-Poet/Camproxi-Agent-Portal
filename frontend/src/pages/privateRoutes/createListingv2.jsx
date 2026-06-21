import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, Home, Store } from 'lucide-react';
import Icon from '../../components/Icon';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import CheckItem from '../../components/CheckItem';
import Switch from '../../components/Switch';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import { useApp } from '../../context/AppContext';
import imageCompression from 'browser-image-compression';
import {
	AMENITIES,
	ROOM_TYPES,
	SERVICE_CATS,
	DAYS,
	PRICE_UNIT,
} from '../../data';
import CategorySelector from '../../components/clickableSelect';
import {
	formatWithCommas,
	handleChange,
	handleChange2,
} from '../../components/functions';
import {
	useCreateProductMutation,
	useUpdateProductMutation,
} from '../../redux/api/productApiSlice';
import MapContainer from '../../components/mapContainer';
import MapMarkersController from '../../components/mapMarkersController';
import {
	useCreatePropertyMutation,
	useUpdatePropertyMutation,
} from '../../redux/api/propertyApiSlice';
import {
	useCreateServiceMutation,
	useUpdateServiceMutation,
} from '../../redux/api/serviceApiSlice';

const inputCls =
	'capitalize w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md px-3.5 py-3 transition-all focus:border-primary placeholder:text-faint';

function SectionLabel({ children, icon }) {
	return (
		<div className='flex items-center gap-2 mt-6 mb-3.5'>
			{icon && <Icon name={icon} size={18} color='#0d7a72' />}
			<h2 className='m-0 text-base font-extrabold text-ink tracking-[-0.01em]'>
				{children}
			</h2>
		</div>
	);
}

function PhotoGallery({ photos, onAdd, onRemove, onPreview }) {
	return (
		<div className='grid grid-cols-3 gap-2.5'>
			<label
				className='aspect-square cursor-pointer rounded-md flex flex-col items-center justify-center gap-1.5 text-primary-700 hover:bg-primary/5 transition'
				style={{
					border: '1.5px dashed rgba(13,122,114,0.38)',
					background: '#f3f9f8',
				}}
			>
				<Icon name='camera' size={24} color='#084f49' />
				<span className='text-[11.5px] font-bold'>Add photo</span>
				<input
					type='file'
					accept='image/*'
					onChange={onAdd}
					className='hidden'
					multiple={false}
				/>
			</label>
			{photos.map((photo, i) => (
				<div key={i} className='relative aspect-square group'>
					<img
						src={photo.url || photo}
						alt={`photo-${i}`}
						className='w-full h-full object-cover rounded-md'
					/>
					{i === 0 && (
						<span className='absolute bottom-1.5 left-1.5 bg-primary text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-[6px]'>
							COVER
						</span>
					)}
					<button
						type='button'
						onClick={() => onRemove(i)}
						aria-label='Remove'
						className='absolute top-1 right-1 w-[22px] h-[22px] rounded-full border-none bg-ink/70 text-white cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition'
					>
						<Icon name='x' size={13} color='#fff' stroke={2.4} />
					</button>
				</div>
			))}
		</div>
	);
}

export default function CreateListing2({ setState, id }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const { listings, flash } = useApp();
	const [createProduct, { isLoading, isSuccess, isError, error }] =
		useCreateProductMutation();
	const [
		createProperty,
		{
			isLoading: creatingProperty,
			isSuccess: createdProperty,
			isError: failedCreatingProperty,
			error: creatingPropertyError,
		},
	] = useCreatePropertyMutation();
	const [
		createService,
		{
			isLoading: creatingService,
			isSuccess: createdService,
			isError: failedCreatingService,
			error: creatingServiceError,
		},
	] = useCreateServiceMutation();
	const [
		updateService,
		{
			isLoading: updatingService,
			isSuccess: updatedService,
			isError: failedUpdatingService,
			error: updatingServiceError,
		},
	] = useUpdateServiceMutation();
	const [
		updateProduct,
		{
			isLoading: updatingProduct,
			isSuccess: updatedProduct,
			isError: failedUpdatingProduct,
			error: updatingProductError,
		},
	] = useUpdateProductMutation();
	const [
		updateProperty,
		{
			isLoading: updatingProperty,
			isSuccess: updatedProperty,
			isError: failedUpdatingProperty,
			error: updatingPropertyError,
		},
	] = useUpdatePropertyMutation();

	const editing = id ? listings.find((l) => l._id === id) : null;
	const category = userInfo?.category; // 'agent', 'business', or 'services'
	const [streetAddress, setStreetAddress] = useState('');

	// Main form state
	function formatMinutes(totalMinutes) {
		const days = Math.floor(totalMinutes / 1440);
		const hours = Math.floor((totalMinutes % 1440) / 60);
		const minutes = totalMinutes % 60;

		setDeliveryDurationDay(days);
		setDeliveryDurationHour(hours);
		setDeliveryDurationMinute(minutes);
	}
	const [form, setForm] = useState({
		// Common fields
		title: editing?.name || '',
		price: editing?.price ? editing.price : '',
		description: editing?.description || '',
		available: editing?.status !== 'taken' ? true : false,
		photos: editing?.photos || [],

		// Agent fields
		address: editing?.address || '',
		lat: editing?.lat || 9.536989,
		lng: editing?.lng || 6.465372,
		unitQuantity: editing?.unitQuantity || 0,
		roomType: editing?.roomType || 'Self-contain',
		amenities: editing?.amenities || ['Wi-Fi', 'Water'],

		// Business fields
		businessCategory: editing?.businessCategory || '',
		deliveryOption: editing?.delivery?.option || 'pickup',
		deliveryPrice: editing?.delivery?.price || '',
		deliveryDays:
			Math.floor(editing?.delivery?.deliveryDuration / 1440) || '',
		deliveryHours:
			Math.floor((editing?.delivery?.duration % 1440) / 60) || '',
		deliveryMinutes: editing?.delivery?.duration % 60 || '',

		// Service fields
		serviceCategory: editing?.serviceCategory || '',
		availableDays: editing?.availableDays || [
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
		],
		perUnit: editing?.perUnit || '',
		startTime: editing?.startTime || '08:00',
		endTime: editing?.endTime || '18:00',
	});

	const [currentLocation, setCurrentLocation] = useState({
		lat: editing?.location?.lat || 9.536989,
		lng: editing?.location?.lng || 6.465372,
	});
	const [price, setPrice] = useState('');
	const [deliveryPrice, setDeliveryPrice] = useState('');
	const [photos, setPhotos] = useState(editing?.images || []);
	const [newPhotos, setNewPhotos] = useState([]); // Track new files
	const [removedPhotos, setRemovedPhotos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({ msg: '', danger: false });

	const getLocation = (e) => {
		let position;
		e.preventDefault();
		// setOrigin();
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				setCurrentLocation({ lat, lng });
				setForm((prev) => ({ ...prev, lat: lat, lng: lng }));
				// console.log(lat, lng);
			},
			(error) => {
				console.error(error.message);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	};

	const showToast = (msg, danger = false) => {
		setToast({ msg, danger });
		setTimeout(() => setToast({ msg: '', danger: false }), 3000);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handlePhotoAdd = (e) => {
		const file = e.target.files?.[0];
		let exisitingImage = [];
		editing?.images.forEach(
			(image) => (exisitingImage = [...exisitingImage, image.url]),
		);
		if (file) {
			// Store both file and preview
			const preview = URL.createObjectURL(file);
			setNewPhotos((prev) => [...prev, { file, preview }]);
			setPhotos((prev) => [...prev, preview]);
		}
	};

	const handlePhotoRemove = (index) => {
		const removedImage = photos.filter((_, i) => i === index);
		setRemovedPhotos((prev) => [...prev, ...removedImage]);
		setPhotos((prev) => prev.filter((_, i) => i !== index));
		setNewPhotos((prev) => prev.filter((_, i) => i !== index));
	};
	const toggleArray = (arr, value) => {
		return arr.includes(value)
			? arr.filter((x) => x !== value)
			: [...arr, value];
	};

	const validateForm = () => {
		if (!form.title.trim()) {
			showToast('Name is required', true);
			return false;
		}
		if (!form.description.trim()) {
			showToast('Description is required', true);
			return false;
		}

		if (photos.length === 0) {
			showToast('Add at least one photo', true);
			return false;
		}

		if (category === 'landlord') {
			if (!form.address.trim()) {
				showToast('Location is required', true);
				return false;
			}
			if (!form.price) {
				showToast('Price is required', true);
				return false;
			}
		} else if (category === 'business') {
			if (!form.businessCategory) {
				showToast('Category is required', true);
				return false;
			}
			if (!form.price) {
				showToast('Price is required', true);
				return false;
			}
			if (['campus delivery', 'doorstep'].includes(form.deliveryOption)) {
				if (!form.deliveryPrice) {
					showToast('Delivery price is required', true);
					return false;
				}
			}
		} else if (category === 'services') {
			if (!form.serviceCategory) {
				showToast('Service category is required', true);
				return false;
			}
			if (!form.price) {
				showToast('Price is required', true);
				return false;
			}
		}

		return true;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		// setLoading(true);

		const formData = new FormData();
		const deliveryDuration =
			Number(form.deliveryDays || 0) * 24 * 60 +
			Number(form.deliveryHours || 0) * 60 +
			Number(form.deliveryMinutes || 0);

		// Common fields
		formData.append('name', form.title);
		formData.append('price', form.price);
		formData.append('description', form.description);
		formData.append('isAvailable', form.available);
		formData.append('category', category);

		// Add new photos
		if (id) {
			category === 'provider'
				? formData.append('serviceId', editing.serviceId)
				: category === 'business'
					? formData.append('productId', editing.productId)
					: formData.append('propertyId', editing.propertyId);
		}
		// newPhotos.forEach(async (photo, index) => {
		// 	const fileName = photo.file.name
		// 		.split('.')[0]
		// 		.replace(/[^\w\-]+/g, '');
		// 	index === 0 ? formData.append('coverImage', fileName) : null;
		// 	const image = await imageCompression(photo.file, {
		//       maxSizeMB: 1,
		//       maxWidthOrHeight: 1600,
		//       useWebWorker: true,
		//     })
		// 	formData.append(`images`, await image);
		// });
		await Promise.all(
			newPhotos.map(async (photo, index) => {
				const fileName = photo.file.name
					.split('.')[0]
					.replace(/[^\w\-]+/g, '');

				if (index === 0) formData.append('coverImage', fileName);

				const image = await imageCompression(photo.file, {
					maxSizeMB: 1,
					maxWidthOrHeight: 1600,
					useWebWorker: true,
				});

				formData.append('images', image);
			}),
		);
		id ? formData.append('id', id) : null;
		let publicIds = [];
		removedPhotos.forEach(
			(item) => (publicIds = [...publicIds, item.public_id]),
		);
		// console.log(publicIds )
		// removedPhotos.forEach(item => {
		// 	const publicIds = item.public_id
		formData.append('publicIds', JSON.stringify(publicIds));
		// })

		// Category-specific fields
		if (category === 'landlord') {
			// formData.append('area', form.area);
			formData.append('roomType', form.roomType);
			formData.append('address', form.address);
			formData.append('unitQuantity', form.unitQuantity);
			formData.append('amenities', JSON.stringify(form.amenities));
			formData.append('lat', form.lat);
			formData.append('lng', form.lng);
		} else if (category === 'business') {
			formData.append('businessCategory', form.businessCategory);
			formData.append('deliveryOption', form.deliveryOption);
			if (['campus delivery', 'doorstep'].includes(form.deliveryOption)) {
				formData.append('deliveryPrice', form.deliveryPrice);
				formData.append('deliveryDuration', deliveryDuration);
			}
		} else if (category === 'provider') {
			formData.append('address', form.address);
			formData.append('perUnit', form.perUnit);
			formData.append('serviceCategory', form.serviceCategory);
			formData.append(
				'availableDays',
				JSON.stringify(form.availableDays),
			);
			formData.append('startTime', form.startTime);
			formData.append('endTime', form.endTime);
		}
		try {
			if (id) {
				if (category === 'business') {
					await updateProduct(formData).unwrap();
				} else if (category === 'landlord') {
					await updateProperty(formData).unwrap();
					// for (const [key, value] of formData.entries()) {
					// 	console.log(key, value);
					// }
				} else if (category === 'provider') {
					const serviceId = editing.serviceId;
					await updateService(formData).unwrap();
				}
			} else {
				if (category === 'business') {
					await createProduct(formData).unwrap();
				} else if (category === 'landlord') {
					await createProperty(formData).unwrap();
				} else if (category === 'provider') {
					await createService(formData).unwrap();
					// for (const [key, value] of formData.entries()) {
					// 	console.log(key, value);
					// }
				}
			}

			category === 'business'
				? flash('Product Listed!')
				: category === 'landlord'
					? flash('Lodge Listed!')
					: flash('Services Listed!');
			setState(false);
		} catch (err) {
			showToast(err.message, true);
			console.error(err);
		}
	};

	return (
		<>
			<div className='flex relative flex-col h-[80%] w-[95%] sm:w-[80%] md:max-w-[60%] mx-auto bg-white rounded-lg shadow-lg'>
				{/* <AppBar title={editing ? 'Edit Listing' : 'Create Listing'} onClose={setState} /> */}
				<div className='flex-1 overflow-y-auto'>
					<div className='px-6 py-6 pb-32'>
						{/* Details Section */}
						<SectionLabel icon='info'>Details</SectionLabel>
						<div className='grid animate-fadeUp grid-cols-1 md:grid-cols-2 gap-5'>
							<div>
								<label className='block text-[13px] font-bold text-ink mb-1.5'>
									Name
								</label>
								<input
									className={inputCls}
									name='title'
									placeholder='Give it a clear name'
									value={form.title}
									onChange={handleInputChange}
								/>
							</div>
							<div>
								<label className='block text-[13px] font-bold text-ink mb-1.5'>
									Price{' '}
									{category === 'landlord' ? (
										<span className='text-faint font-semibold'>
											per year
										</span>
									) : category === 'services' ? (
										<span className='text-faint font-semibold'>
											per session
										</span>
									) : (
										''
									)}
								</label>
								<div className='relative'>
									<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold'>
										₦
									</span>
									<input
										className={`${inputCls} pl-8`}
										name='price'
										type='text'
										inputMode='numeric'
										placeholder='0'
										value={formatWithCommas(form.price)}
										onChange={(e) => {
											setForm((prev) => ({
												...prev,
												price: handleChange2(e),
											}));
										}}
									/>
								</div>
							</div>
							{category === 'landlord' && (
								<>
									<div>
										<label className='block text-[13px] font-bold text-ink mb-1.5'>
											Number of Units
										</label>
										<input
											className={inputCls}
											name='unitNumber'
											// placeholder='Give it a clear name'
											value={formatWithCommas(
												form.unitQuantity,
											)}
											onChange={(e) => {
												setForm((prev) => ({
													...prev,
													unitQuantity:
														handleChange2(e),
												}));
											}}
										/>
									</div>
									<div>
										<label className='block text-[13px] font-bold text-ink mb-1.5'>
											Address
										</label>
										<input
											className={inputCls}
											name='address'
											// placeholder='Give it a clear name'
											value={form.address}
											// disabled
											name='address'
											onChange={handleInputChange}
										/>
									</div>
								</>
							)}
							{category === 'provider' && (
								<>
									<div>
										<label className='block text-[13px] font-bold text-ink mb-1.5'>
											Per
										</label>
										<input
											className={inputCls}
											name='perUnit'
											// placeholder='Give it a clear name'
											value={form.perUnit}
											onChange={handleInputChange}
										/>
									</div>
									<div>
										<label className='block text-[13px] font-bold text-ink mb-1.5'>
											Address
										</label>
										<input
											className={inputCls}
											name='address'
											// placeholder='Give it a clear name'
											value={form.address}
											// disabled
											name='address'
											onChange={handleInputChange}
										/>
									</div>
								</>
							)}
							{category === 'landlord' && (
								<div className='mb-4 relative min-w-full col-span-2'>
									<button
										// style={{ zIndex: '10' }}
										className='absolute bottom-0 z-10 left-0 w-full capitalize flex-1 flex items-center justify-center py-3.5 font-bold text-white bg-primary rounded-b-md cursor-pointer disabled:opacity-45 hover:bg-primary-600 transition-colors'
										onClick={getLocation}
									>
										get current location
									</button>
									<MapContainer
										location={currentLocation}
										// onAddressFetch={setStreetAddress}
									>
										{(mapInstance) => (
											<MapMarkersController
												map={mapInstance}
												location={currentLocation}
											/>
										)}
									</MapContainer>
								</div>
							)}

							{/* Agent: Location */}
							{/* {category === 'agent' && (
								<div className='md:col-span-2'>
									<label className='block text-[13px] font-bold text-ink mb-1.5'>
										Location near campus
									</label>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
											<Icon name='pin' size={17} />
										</span>
										<input
											className={`${inputCls} pl-[38px]`}
											name='area'
											placeholder='e.g. Westgate, 4 min to campus'
											value={form.area}
											onChange={handleInputChange}
										/>
									</div>
								</div>
							)} */}
							{/* Business: Category */}
							{category === 'business' && (
								<div className='md:col-span-2'>
									<SectionLabel icon='info'>
										Category
									</SectionLabel>
									<CategorySelector
										value={form.businessCategory}
										onChange={(value) =>
											setForm((prev) => ({
												...prev,
												businessCategory: value,
											}))
										}
									/>
								</div>
							)}
						</div>

						{/* Photos Section */}
						<SectionLabel icon='camera'>Photos</SectionLabel>
						<p className='text-muted text-[12.5px] -mt-1.5 mb-3.5'>
							First photo is your cover. Add up to 8.
						</p>
						<PhotoGallery
							photos={photos}
							onAdd={handlePhotoAdd}
							onRemove={handlePhotoRemove}
						/>

						{/* Agent: Room Details */}
						{category === 'landlord' && (
							<div className='animate-fadeUp'>
								<SectionLabel icon='home'>
									Room Details
								</SectionLabel>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-ink mb-1.5'>
										Room type
									</label>
									<div className='flex flex-wrap gap-2'>
										{ROOM_TYPES.map((r) => (
											<button
												key={r}
												type='button'
												className={`text-[13.5px] font-semibold px-3.5 py-2 rounded-full border-[1.5px] cursor-pointer transition-all ${
													form.roomType === r
														? 'bg-primary-50 text-primary-700 border-primary/40'
														: 'bg-white text-ink border-line'
												}`}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														roomType: r,
													}))
												}
											>
												{r}
											</button>
										))}
									</div>
								</div>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-ink mb-1.5'>
										Amenities
									</label>
									<div className='grid grid-cols-2 gap-2'>
										{AMENITIES.map((a) => (
											<CheckItem
												key={a}
												label={a}
												checked={form.amenities.includes(
													a,
												)}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														amenities: toggleArray(
															prev.amenities,
															a,
														),
													}))
												}
											/>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Business: Delivery Options */}
						{category === 'business' && (
							<div className='animate-fadeUp'>
								<SectionLabel>Delivery Options</SectionLabel>
								<div className='grid grid-cols-3 gap-4'>
									{[
										{
											value: 'pickup',
											label: 'Pickup',
											icon: Store,
										},
										{
											value: 'campus delivery',
											label: 'Campus Delivery',
											icon: GraduationCap,
										},
										{
											value: 'doorstep',
											label: 'Doorstep',
											icon: Home,
										},
									].map(
										({ value, label, icon: IconComp }) => (
											<button
												key={value}
												type='button'
												onClick={() =>
													setForm((prev) => ({
														...prev,
														deliveryOption: value,
													}))
												}
												className={`flex flex-col gap-2 items-center justify-center py-6 rounded-lg border-2 transition ${
													form.deliveryOption ===
													value
														? 'bg-primary-50 text-primary-700 border-primary/40'
														: 'bg-white text-ink border-line hover:border-primary'
												}`}
											>
												<IconComp className='w-8 h-8' />
												<span className='font-semibold text-sm capitalize'>
													{label}
												</span>
											</button>
										),
									)}
								</div>

								{/* Delivery Details */}
								{['campus delivery', 'doorstep'].includes(
									form.deliveryOption,
								) && (
									<div className='mt-5 space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<label className='block text-[13px] font-bold text-ink mb-1.5'>
													Delivery Price
												</label>
												<div className='relative'>
													<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold'>
														₦
													</span>
													<input
														className={`${inputCls} pl-8`}
														name='deliveryPrice'
														type='text'
														placeholder='0'
														value={formatWithCommas(
															form.deliveryPrice,
														)}
														onChange={(e) => {
															setForm((prev) => ({
																...prev,
																deliveryPrice:
																	handleChange2(
																		e,
																	),
															}));
														}}
													/>
												</div>
											</div>
										</div>

										<div>
											<label className='block text-[13px] font-bold text-ink mb-1.5'>
												Maximum Delivery Time
											</label>
											<div className='flex gap-2'>
												<div className='flex-1'>
													<input
														type='text'
														placeholder='Days'
														name='deliveryDays'
														value={
															form.deliveryDays
														}
														onChange={(e) => {
															setForm((prev) => ({
																...prev,
																deliveryDays:
																	handleChange2(
																		e,
																	),
															}));
														}}
														className={inputCls}
													/>
												</div>
												<div className='flex-1'>
													<input
														type='text'
														placeholder='Hours'
														name='deliveryHours'
														value={
															form.deliveryHours
														}
														onChange={(e) => {
															setForm((prev) => ({
																...prev,
																deliveryHours:
																	handleChange2(
																		e,
																	),
															}));
														}}
														className={inputCls}
													/>
												</div>
												<div className='flex-1'>
													<input
														type='text'
														placeholder='Minutes'
														name='deliveryMinutes'
														value={
															form.deliveryMinutes
														}
														onChange={(e) => {
															setForm((prev) => ({
																...prev,
																deliveryMinutes:
																	handleChange2(
																		e,
																	),
															}));
														}}
														className={inputCls}
													/>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Services: Service Details */}
						{category === 'provider' && (
							<div className='animate-fadeUp'>
								<SectionLabel icon='wrench'>
									Service Details
								</SectionLabel>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-ink mb-1.5'>
										Service Category
									</label>
									<div className='flex flex-wrap gap-2'>
										{SERVICE_CATS.map((c) => (
											<button
												key={c}
												type='button'
												className={`text-[13.5px] font-semibold px-3.5 py-2 rounded-full border-[1.5px] cursor-pointer transition-all ${
													form.serviceCategory === c
														? 'bg-primary-50 text-primary-700 border-primary/40'
														: 'bg-white text-ink border-line'
												}`}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														serviceCategory: c,
													}))
												}
											>
												{c}
											</button>
										))}
									</div>
								</div>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-ink mb-1.5'>
										Available Days
									</label>
									<div className='flex gap-1.5'>
										{DAYS.map((d) => (
											<button
												key={d}
												type='button'
												onClick={() =>
													setForm((prev) => ({
														...prev,
														availableDays:
															toggleArray(
																prev.availableDays,
																d,
															),
													}))
												}
												className='flex-1 py-2.5 cursor-pointer rounded-md font-bold text-[12.5px] transition-all border'
												style={{
													border: form.availableDays.includes(
														d,
													)
														? 'none'
														: '1.5px solid #e7edec',
													background:
														form.availableDays.includes(
															d,
														)
															? '#0d7a72'
															: '#fff',
													color: form.availableDays.includes(
														d,
													)
														? '#fff'
														: '#677975',
												}}
											>
												{d[0]}
											</button>
										))}
									</div>
								</div>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-ink mb-1.5'>
										Operating Hours
									</label>
									<div className='flex gap-2.5 items-center'>
										<input
											name='startTime'
											type='time'
											value={form.startTime}
											onChange={handleInputChange}
											className={inputCls}
										/>
										<span className='text-muted font-bold whitespace-nowrap'>
											to
										</span>
										<input
											name='endTime'
											type='time'
											value={form.endTime}
											onChange={handleInputChange}
											className={inputCls}
										/>
									</div>
								</div>
							</div>
						)}

						{/* Description */}
						<SectionLabel>Description</SectionLabel>
						<textarea
							className='w-full capitalize text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md px-3.5 py-3 resize-none leading-relaxed transition-all focus:border-primary placeholder:text-faint -mt-1'
							name='description'
							rows={4}
							placeholder='Describe what makes this great for students...'
							value={form.description}
							onChange={handleInputChange}
						/>

						{/* Availability */}
						<div className='flex items-center gap-3.5 p-[15px] bg-white rounded-lg border border-line shadow-sm mt-[18px]'>
							<div
								className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${form.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
							>
								<Icon
									name='bolt'
									size={20}
									color={
										form.available ? '#059669' : '#9CA3AF'
									}
								/>
							</div>
							<div className='flex-1'>
								<div className='font-extrabold text-[14.5px] text-ink'>
									Available now
								</div>
								<div className='text-muted text-[12.5px]'>
									{form.available
										? 'Visible to students immediately'
										: 'Hidden — marked as unavailable'}
								</div>
							</div>
							<Switch
								checked={form.available}
								onChange={() =>
									setForm((prev) => ({
										...prev,
										available: !prev.available,
									}))
								}
								id='avail'
							/>
						</div>
					</div>
				</div>

				{/* Sticky Footer */}
				<div
					// style={{ zIndex: '20' }}
					className='absolute z-1000!  bottom-0 left-0 right-0 px-6 py-3.5 bg-white border-t border-line flex gap-2.5 max-w-4xl mx-auto rounded-b-lg'
				>
					<button
						className='flex-none px-6 py-3.5 font-bold text-ink bg-white border border-line rounded-md cursor-pointer hover:bg-gray-50 transition-colors'
						onClick={setState}
						disabled={loading}
					>
						Cancel
					</button>
					<button
						className='flex-1 flex items-center justify-center py-3.5 font-bold text-white bg-primary rounded-md cursor-pointer disabled:opacity-45 hover:bg-primary-600 transition-colors'
						disabled={
							isLoading ||
							creatingProperty ||
							creatingService ||
							updatingService
						}
						onClick={handleSave}
					>
						{loading
							? 'Saving...'
							: editing
								? 'Save changes'
								: 'Publish listing'}
					</button>
				</div>

				{id ? (
					<Loading
						show={
							category === 'business'
								? updatingProduct
								: category === 'landlord'
									? updatingProperty
									: updatingService
						}
						msg={
							editing
								? 'Updating listing...'
								: 'Publishing listing...'
						}
					/>
				) : (
					<Loading
						show={
							category === 'business'
								? isLoading
								: category === 'landlord'
									? creatingProperty
									: creatingService
						}
						msg={
							editing
								? 'Updating listing...'
								: 'Publishing listing...'
						}
					/>
				)}
				<Toast msg={toast.msg} danger={toast.danger} />
			</div>
		</>
	);
}
