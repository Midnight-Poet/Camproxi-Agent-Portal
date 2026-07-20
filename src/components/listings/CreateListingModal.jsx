import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, Home, Store, X } from 'lucide-react';
import Icon from '../Icon';
import CheckItem from '../CheckItem';
import Switch from '../Switch';
import { inputCls } from '../shared/Field';
import Loading from '../Loading';
import { useApp } from '../../context/AppContext';
import imageCompression from 'browser-image-compression';
import { AMENITIES, ROOM_TYPES, SERVICE_CATS, DAYS } from '../../data';
import CategorySelector from '../clickableSelect';
import MapContainer from '../mapContainer';
import MapMarkersController from '../mapMarkersController';
import PhotoGallery from './PhotoGallery';
import SectionLabel from './SectionLabel';
import {
	useCreateProductMutation,
	useUpdateProductMutation,
} from '../../redux/api/productApiSlice';
import {
	useCreatePropertyMutation,
	useUpdatePropertyMutation,
} from '../../redux/api/propertyApiSlice';
import {
	useCreateServiceMutation,
	useUpdateServiceMutation,
} from '../../redux/api/serviceApiSlice';

export default function CreateListingModal({ setState, id, refetchData }) {
	const { userInfo } = useSelector((state) => state.auth);
	const { listings, flash } = useApp();

	// Robust category resolution
	const rawCat = (
		userInfo?.agent?.category ||
		userInfo?.category ||
		''
	).toUpperCase();
	const category = ['VENDOR', 'BUSINESS'].includes(rawCat)
		? 'VENDOR'
		: ['AGENT', 'LANDLORD'].includes(rawCat)
			? 'AGENT'
			: 'SERVICE_PROVIDER';

	const editing = id
		? listings.find((l) => l._id === id || l.id === id)
		: null;

	const [createProduct, { isLoading: cProd }] = useCreateProductMutation();
	const [updateProduct, { isLoading: uProd }] = useUpdateProductMutation();
	const [createProperty, { isLoading: cProp }] = useCreatePropertyMutation();
	const [updateProperty, { isLoading: uProp }] = useUpdatePropertyMutation();
	const [createService, { isLoading: cServ }] = useCreateServiceMutation();
	const [updateService, { isLoading: uServ }] = useUpdateServiceMutation();

	const isLoading = cProd || uProd || cProp || uProp || cServ || uServ;

	const [form, setForm] = useState({
		name: editing?.name || editing?.title || '',
		price: editing?.price ? String(editing.price) : '',
		description: editing?.description || '',
		status: editing?.status || 'active',
		isAvailable: editing ? editing.status !== 'taken' : true,

		// Property
		address: editing?.address || editing?.area || '',
		lat: editing?.location?.lat || editing?.lat || 9.536989,
		lng: editing?.location?.lng || editing?.lng || 6.465372,
		roomType: editing?.roomType || editing?.room || 'Self-contain',
		amenities: editing?.amenities || ['Wi-Fi', 'Water'],
		unitQuantity: editing?.unitQuantity || 1,
		propertyId: editing?.propertyId,

		// Service
		serviceCategory: editing?.serviceCategory || editing?.cat || '',
		perUnit: editing?.perUnit || 'Hour',
		availableDays: editing?.availableDays ||
			editing?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
		startTime: editing?.time?.startTime || editing?.startTime || '08:00',
		endTime: editing?.time?.endTime || editing?.endTime || '18:00',
		serviceId: editing?.serviceId,

		// Product
		businessCategory: editing?.businessCategory || editing?.category || '',
		deliveryOption: editing?.delivery?.option || 'PICKUP',
		deliveryPrice: editing?.delivery?.price || '',
		deliveryDays: editing?.delivery?.duration
			? Math.floor(editing.delivery.duration / 1440)
			: '',
		deliveryHours: editing?.delivery?.duration
			? Math.floor((editing.delivery.duration % 1440) / 60)
			: '',
		deliveryMinutes: editing?.delivery?.duration
			? editing.delivery.duration % 60
			: '',
		productId: editing?.productId,
	});

	const [photos, setPhotos] = useState(editing?.images || []);
	const [newPhotos, setNewPhotos] = useState([]);
	const [removedPhotos, setRemovedPhotos] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const toggleArray = (arrName, val) => {
		setForm((prev) => {
			const arr = prev[arrName];
			return {
				...prev,
				[arrName]: arr.includes(val)
					? arr.filter((x) => x !== val)
					: [...arr, val],
			};
		});
	};

	const handleAddPhoto = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const newPhoto = { file, url: URL.createObjectURL(file) };
			setNewPhotos([...newPhotos, newPhoto]);
			setPhotos([...photos, newPhoto]);
		}
	};

	const handleRemovePhoto = (index) => {
		const photoToRemove = photos[index];
		if (!photoToRemove.file && photoToRemove.public_id) {
			setRemovedPhotos([...removedPhotos, photoToRemove]);
		} else {
			setNewPhotos(newPhotos.filter((p) => p.url !== photoToRemove.url));
		}
		setPhotos(photos.filter((_, i) => i !== index));
	};

	const getLocation = (e) => {
		e.preventDefault();
		navigator.geolocation.getCurrentPosition(
			(pos) =>
				setForm((prev) => ({
					...prev,
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				})),
			(err) => console.error(err.message),
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
		);
	};

	const validateForm = () => {
		if (!form.name || !form.price || !form.description) return false;
		if (category === 'VENDOR') {
			if (!form.businessCategory) return false;
			if (
				['CAMPUS', 'HOME'].includes(form.deliveryOption) &&
				!form.deliveryPrice
			)
				return false;
		}
		if (
			category === 'SERVICE_PROVIDER' &&
			(!form.serviceCategory || !form.address)
		)
			return false;
		if (category === 'AGENT' && (!form.address || !form.roomType))
			return false;
		return true;
	};

	const handleSave = async () => {
		if (!validateForm()) {
			flash('Please fill in all required fields.');
			return;
		}

		const formData = new FormData();

		const appendField = (key, value, originalValue) => {
			if (
				!id ||
				JSON.stringify(value) !== JSON.stringify(originalValue)
			) {
				formData.append(key, value);
			}
		};

		const appendArray = (key, arr, originalArr) => {
			if (!id || JSON.stringify(arr) !== JSON.stringify(originalArr)) {
				arr.forEach((item) => formData.append(key, item));
			}
		};

		appendField('name', form.name, editing?.name || editing?.title);
		appendField(
			'price',
			form.price,
			editing?.price ? String(editing.price) : undefined,
		);
		appendField('description', form.description, editing?.description);

		if (category === 'AGENT') {
			// appendField('isVacant', form.isAvailable, editing?.isVacant);
			appendField(
				'address',
				form.address,
				editing?.address || editing?.area,
			);
			appendField(
				'roomType',
				form.roomType,
				editing?.roomType || editing?.room,
			);
			appendField(
				'unitQuantity',
				form.unitQuantity,
				editing?.unitQuantity,
			);
			appendField(
				'location',
				JSON.stringify({ lat: form.lat, lng: form.lng }),
				JSON.stringify(
					editing?.location || {
						lat: editing?.lat,
						lng: editing?.lng,
					},
				),
			);
			appendArray('amenities', form.amenities, editing?.amenities);
		} else if (category === 'VENDOR') {
			appendField('isAvailable', form.isAvailable, editing?.isAvailable);
			appendField(
				'businessCategory',
				form.businessCategory,
				editing?.businessCategory || editing?.category,
			);
			const duration =
				Number(form.deliveryDays || 0) * 1440 +
				Number(form.deliveryHours || 0) * 60 +
				Number(form.deliveryMinutes || 0);
			appendField(
				'delivery',
				JSON.stringify({
					option: form.deliveryOption,
					price: Number(form.deliveryPrice || 0),
					duration: duration,
				}),
				JSON.stringify(editing?.delivery),
			);
		} else if (category === 'SERVICE_PROVIDER') {
			appendField('isAvailable', form.isAvailable, editing?.isAvailable);
			appendField('address', form.address, editing?.address);
			appendField(
				'serviceCategory',
				form.serviceCategory,
				editing?.serviceCategory || editing?.cat,
			);
			appendField('perUnit', form.perUnit, editing?.perUnit);
			appendField(
				'time',
				JSON.stringify({
					startTime: form.startTime,
					endTime: form.endTime,
				}),
				JSON.stringify(editing?.time),
			);
			appendArray(
				'availableDays',
				form.availableDays,
				editing?.availableDays || editing?.days,
			);
		}

		if (id) {
			const idField =
				category === 'VENDOR'
					? 'productId'
					: category === 'AGENT'
						? 'propertyId'
						: 'serviceId';
			formData.append(idField, editing[idField] || id);
			// formData.append('id', id);
		}

		if (removedPhotos.length > 0) {
			const publicIds = removedPhotos.map((p) => p.public_id);
			formData.append('imagesToDelete', JSON.stringify(publicIds));
		}

		await Promise.all(
			newPhotos.map(async (photo, index) => {
				const fileName = photo.file.name
					.split('.')[0]
					.replace(/[^\w\-]+/g, '');
				// if (index === 0 && photos[0].url === photo.url) formData.append('coverImageId', fileName);
				const compressed = await imageCompression(photo.file, {
					maxSizeMB: 1,
					maxWidthOrHeight: 1600,
					useWebWorker: true,
				});
				id
					? formData.append('newImages', compressed)
					: formData.append('images', compressed); // nestjs multer expects "images" or "newImages"
			}),
		);

		try {
			for (const [key, value] of formData.entries()) {
				console.log(key, value);
			}
			// console.log(formData instanceof FormData)
			if (id) {
				if (category === 'VENDOR')
					await updateProduct({ id, data: formData }).unwrap();
				if (category === 'AGENT')
					await updateProperty({ id, data: formData }).unwrap();
				if (category === 'SERVICE_PROVIDER')
					await updateService({ id, data: formData }).unwrap();
			} else {
				if (category === 'VENDOR')
					await createProduct(formData).unwrap();
				if (category === 'AGENT')
					await createProperty(formData).unwrap();
				if (category === 'SERVICE_PROVIDER')
					await createService(formData).unwrap();
			}
			flash(id ? 'Listing updated successfully!' : 'Listing created successfully!');
			refetchData && refetchData();
			setState();
		} catch (err) {
			flash('Error saving listing.');
			console.error(err);
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeUp'>
			<div className='bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-line2 bg-white z-10 relative'>
					<div>
						<h2 className='text-[20px] font-extrabold text-ink tracking-tight'>
							{id ? 'Edit Listing' : 'Create Listing'}
						</h2>
						<p className='text-[13px] font-medium text-muted mt-0.5'>
							{category === 'VENDOR'
								? 'Product & Delivery'
								: category === 'AGENT'
									? 'Property Details'
									: 'Service Offering'}
						</p>
					</div>
					<button
						onClick={setState}
						className='p-2 -mr-2 text-faint hover:text-ink transition-colors rounded-full hover:bg-bg'
					>
						<X size={22} strokeWidth={2.5} />
					</button>
				</div>

				{/* Body */}
				<div className='flex-1 overflow-y-auto px-6 py-5 bg-bg/30'>
					{/* Basic Info */}
					<SectionLabel icon='info'>Basic Details</SectionLabel>
					<div className='flex flex-col sm:flex-row gap-4 mb-4'>
						<div className='flex-1'>
							<label className='block text-[13px] font-bold text-camtext mb-1.5'>
								Title / Name
							</label>
							<input
								className={inputCls}
								name='name'
								placeholder='e.g. Premium Space'
								value={form.name}
								onChange={handleInputChange}
							/>
						</div>
						<div className='w-full sm:w-1/3'>
							<label className='block text-[13px] font-bold text-camtext mb-1.5'>
								Price (₦)
							</label>
							<input
								className={inputCls}
								name='price'
								type='number'
								placeholder='0'
								value={form.price}
								onChange={handleInputChange}
							/>
						</div>
					</div>

					<div className='mb-6'>
						<label className='block text-[13px] font-bold text-camtext mb-1.5'>
							Description
						</label>
						<textarea
							className={`${inputCls} resize-none`}
							name='description'
							rows={3}
							placeholder='Describe the listing...'
							value={form.description}
							onChange={handleInputChange}
						/>
					</div>

					{/* AGENT Fields */}
					{category === 'AGENT' && (
						<div className='animate-fadeUp'>
							<SectionLabel icon='home'>
								Property Details
							</SectionLabel>
							<div className='flex flex-col sm:flex-row gap-4 mb-4'>
								<div className='flex-1'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Address / Area
									</label>
									<input
										className={inputCls}
										name='address'
										placeholder='e.g. Westgate, 4 min to campus'
										value={form.address}
										onChange={handleInputChange}
									/>
								</div>
								<div className='w-full sm:w-1/3'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Unit Quantity
									</label>
									<input
										className={inputCls}
										name='unitQuantity'
										type='number'
										min='1'
										value={form.unitQuantity}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className='mb-4'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Room Type
								</label>
								<div className='flex flex-wrap gap-2'>
									{ROOM_TYPES.map((r) => (
										<button
											key={r}
											type='button'
											onClick={() =>
												setForm((p) => ({
													...p,
													roomType: r,
												}))
											}
											className={`text-[13px] font-semibold px-4 py-2 rounded-full border-[1.5px] transition-colors ${form.roomType === r ? 'bg-primary-50 text-primary-700 border-primary/40' : 'bg-white text-camtext border-line'}`}
										>
											{r}
										</button>
									))}
								</div>
							</div>

							<div className='mb-6'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Amenities
								</label>
								<div className='grid grid-cols-2 gap-2'>
									{AMENITIES.map((a) => (
										<CheckItem
											key={a}
											label={a}
											checked={form.amenities.includes(a)}
											onClick={() =>
												toggleArray('amenities', a)
											}
										/>
									))}
								</div>
							</div>

							<div className='mb-6 relative h-[250px] rounded-xl overflow-hidden shadow-sm border border-line'>
								<button
									className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 font-bold text-white text-[13px] bg-ink rounded-full shadow-lg hover:bg-black transition-colors'
									onClick={getLocation}
								>
									Pin Current Location
								</button>
								<MapContainer
									location={{ lat: form.lat, lng: form.lng }}
								>
									{(map) => (
										<MapMarkersController
											map={map}
											location={{
												lat: form.lat,
												lng: form.lng,
											}}
										/>
									)}
								</MapContainer>
							</div>
						</div>
					)}

					{/* VENDOR Fields */}
					{category === 'VENDOR' && (
						<div className='animate-fadeUp'>
							<SectionLabel icon='tag'>
								Product Details
							</SectionLabel>
							<div className='mb-6'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Business Category
								</label>
								<CategorySelector
									value={form.businessCategory}
									onChange={(v) =>
										setForm((p) => ({
											...p,
											businessCategory: v,
										}))
									}
								/>
							</div>

							<SectionLabel icon='truck'>
								Delivery Options
							</SectionLabel>
							<div className='grid grid-cols-3 gap-3 mb-4'>
								{[
									{
										id: 'PICKUP',
										label: 'Pickup',
										icon: Store,
									},
									{
										id: 'CAMPUS',
										label: 'Campus',
										icon: GraduationCap,
									},
									{
										id: 'HOME',
										label: 'Doorstep',
										icon: Home,
									},
								].map((opt) => (
									<div
										key={opt.id}
										onClick={() =>
											setForm((p) => ({
												...p,
												deliveryOption: opt.id,
											}))
										}
										className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-[1.5px] cursor-pointer transition-all ${form.deliveryOption === opt.id ? 'bg-primary-50 border-primary shadow-sm text-primary-700' : 'bg-white border-line text-camtext hover:bg-bg'}`}
									>
										<opt.icon size={26} strokeWidth={1.8} />
										<span className='font-bold text-[12.5px]'>
											{opt.label}
										</span>
									</div>
								))}
							</div>

							{form.deliveryOption !== 'PICKUP' && (
								<div className='flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl border border-line2 shadow-sm'>
									<div className='w-full sm:w-1/3'>
										<label className='block text-[12.5px] font-bold text-camtext mb-1.5'>
											Delivery Fee (₦)
										</label>
										<input
											className={inputCls}
											type='number'
											name='deliveryPrice'
											placeholder='0'
											value={form.deliveryPrice}
											onChange={handleInputChange}
										/>
									</div>
									<div className='flex-1'>
										<label className='block text-[12.5px] font-bold text-camtext mb-1.5'>
											Est. Duration (Days/Hrs/Mins)
										</label>
										<div className='flex gap-2'>
											<input
												className={inputCls}
												type='number'
												name='deliveryDays'
												placeholder='D'
												value={form.deliveryDays}
												onChange={handleInputChange}
											/>
											<input
												className={inputCls}
												type='number'
												name='deliveryHours'
												placeholder='H'
												value={form.deliveryHours}
												onChange={handleInputChange}
											/>
											<input
												className={inputCls}
												type='number'
												name='deliveryMinutes'
												placeholder='M'
												value={form.deliveryMinutes}
												onChange={handleInputChange}
											/>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* SERVICE PROVIDER Fields */}
					{category === 'SERVICE_PROVIDER' && (
						<div className='animate-fadeUp'>
							<SectionLabel icon='wrench'>
								Service Details
							</SectionLabel>
							<div className='flex flex-col sm:flex-row gap-4 mb-4'>
								<div className='flex-1'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Address
									</label>
									<input
										className={inputCls}
										name='address'
										placeholder='e.g. Shop 12, Main Street'
										value={form.address}
										onChange={handleInputChange}
									/>
								</div>
								<div className='w-full sm:w-1/3'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Per Unit
									</label>
									<input
										className={inputCls}
										name='perUnit'
										placeholder='e.g. Hour, Session'
										value={form.perUnit}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className='mb-4'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Service Category
								</label>
								<div className='flex flex-wrap gap-2'>
									{SERVICE_CATS.map((c) => (
										<button
											key={c}
											type='button'
											onClick={() =>
												setForm((p) => ({
													...p,
													serviceCategory: c,
												}))
											}
											className={`text-[13px] font-semibold px-4 py-2 rounded-full border-[1.5px] transition-colors ${form.serviceCategory === c ? 'bg-primary-50 text-primary-700 border-primary/40' : 'bg-white text-camtext border-line'}`}
										>
											{c}
										</button>
									))}
								</div>
							</div>

							<div className='mb-4'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Available Days
								</label>
								<div className='flex gap-1.5'>
									{DAYS.map((d) => (
										<button
											key={d}
											type='button'
											onClick={() =>
												toggleArray('availableDays', d)
											}
											className={`flex-1 py-2.5 rounded-lg font-bold text-[12.5px] border-[1.5px] transition-colors ${form.availableDays.includes(d) ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-line text-camtext hover:bg-bg'}`}
										>
											{d[0]}
										</button>
									))}
								</div>
							</div>

							<div className='mb-6'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Operating Hours
								</label>
								<div className='flex items-center gap-3'>
									<input
										className={inputCls}
										type='time'
										name='startTime'
										value={form.startTime}
										onChange={handleInputChange}
									/>
									<span className='font-bold text-muted text-[13px]'>
										TO
									</span>
									<input
										className={inputCls}
										type='time'
										name='endTime'
										value={form.endTime}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Photos */}
					<SectionLabel icon='camera'>Photos</SectionLabel>
					<p className='text-[12.5px] text-muted mb-3 -mt-1.5'>
						First photo is your cover. You can add up to 8 images.
					</p>
					<PhotoGallery
						photos={photos}
						onAdd={handleAddPhoto}
						onRemove={handleRemovePhoto}
					/>

					{/* Availability Toggle */}
					<div className='flex items-center gap-3.5 p-4 bg-white rounded-xl border border-line2 shadow-sm mt-6 mb-2'>
						<div
							className={`w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0 transition-colors ${form.isAvailable ? 'bg-ok-bg text-ok' : 'bg-gone-bg text-gone'}`}
						>
							<Icon
								name={form.isAvailable ? 'check' : 'x'}
								size={20}
							/>
						</div>
						<div className='flex-1'>
							<div className='font-extrabold text-[14.5px] text-ink'>
								Active & Visible
							</div>
							<div className='text-muted text-[12.5px]'>
								Students can see and request this listing.
							</div>
						</div>
						<Switch
							checked={form.isAvailable}
							onChange={(val) =>
								setForm((p) => ({ ...p, isAvailable: val }))
							}
							id='availSwitch'
						/>
					</div>
				</div>

				{/* Footer */}
				<div className='px-6 py-4 bg-white border-t border-line2 flex gap-3 z-10 relative'>
					<button
						onClick={setState}
						className='px-6 py-3.5 font-bold text-[14px] text-camtext bg-white border border-line rounded-xl hover:bg-bg transition-colors'
					>
						Cancel
					</button>
					<button
						disabled={!validateForm() || isLoading}
						onClick={handleSave}
						className='flex-1 flex items-center justify-center py-3.5 font-bold text-[14px] text-white bg-primary rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-all shadow-[0_4px_14px_rgba(13,122,114,0.3)]'
					>
						{isLoading
							? 'Saving...'
							: id
								? 'Save Changes'
								: 'Publish Listing'}
					</button>
				</div>
			</div>
			<Loading show={isLoading} msg='Processing...' />
		</div>
	);
}
