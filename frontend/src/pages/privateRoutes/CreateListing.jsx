import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import CheckItem from '../../components/CheckItem';
import Switch from '../../components/Switch';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';
import {
	LISTING_TYPES,
	AMENITIES,
	ROOM_TYPES,
	SERVICE_CATS,
	DAYS,
	PRICE_UNIT,
} from '../../data';
import { useSelector } from 'react-redux';
import { GraduationCap, Home, Store } from 'lucide-react';
import CategorySelector from '../../components/clickableSelect';

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

function PhotoGallery({ photos, onAdd, onRemove }) {
	return (
		<div className='grid grid-cols-3 gap-2.5'>
			<button
				type='button'
				onClick={onAdd}
				className='aspect-square cursor-pointer rounded-md2 flex flex-col items-center justify-center gap-1.5 text-primary-700'
				style={{
					border: '1.5px dashed rgba(13,122,114,0.38)',
					background: '#f3f9f8',
				}}
			>
				<Icon name='camera' size={24} color='#084f49' />
				<span className='text-[11.5px] font-bold'>Add photo</span>
			</button>
			{photos.map((_, i) => (
				<div key={i} className='relative aspect-square'>
					<ImagePlaceholder
						style={{
							width: '100%',
							height: '100%',
							borderRadius: 14,
						}}
					>
						<Icon name='camera' size={20} color='#b3bfbb' />
					</ImagePlaceholder>
					{i === 0 && (
						<span className='absolute bottom-1.5 left-1.5 bg-primary text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-[6px] tracking-[0.03em]'>
							COVER
						</span>
					)}
					<button
						type='button'
						onClick={() => onRemove(i)}
						aria-label='Remove'
						className='absolute top-1 right-1 w-[22px] h-[22px] rounded-full border-none bg-ink/70 text-white cursor-pointer flex items-center justify-center'
					>
						<Icon name='x' size={13} color='#fff' stroke={2.4} />
					</button>
				</div>
			))}
		</div>
	);
}

const inputCls =
	'w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 transition-all focus:border-primary placeholder:text-faint';

export default function CreateListing({ setState, id }) {
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.auth);

	const [propertyForm, setForm] = useState({});
	const [deliveryOption, setDeliveryOption] = useState('pickup');
	const [category, setCategory] = useState('');
	// const id = id;
	const { listings, saveListing } = useApp();
	const editing = id ? listings.find((l) => l.id === id) : null;

	const [type, setType] = useState(editing?.type || 'lodge');
	const [title, setTitle] = useState(editing?.title || '');
	const [area, setArea] = useState(editing?.area || '');
	const [price, setPrice] = useState(
		editing?.price ? String(editing.price) : '',
	);
	const [desc, setDesc] = useState('');
	const [available, setAvailable] = useState(
		editing ? editing.status !== 'taken' : true,
	);
	const [photos, setPhotos] = useState(editing ? [0, 1] : []);
	const [room, setRoom] = useState(editing?.room || 'Self-contain');
	const [amenities, setAmenities] = useState(
		editing?.amenities || ['Wi-Fi', 'Water'],
	);
	const [cat, setCat] = useState(editing?.category || 'Laundry & Dry-clean');
	const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

	const toggle = (arr, set, v) =>
		set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
	const valid = title && area && (type === 'groceries' || price);

	const handleSave = () => {
		// saveListing({
		// 	id: editing?.id,
		// 	type,
		// 	title,
		// 	area,
		// 	price: type === 'groceries' ? 0 : Number(price) || 0,
		// 	unit: PRICE_UNIT[type],
		// 	status: available
		// 		? editing?.status === 'pending'
		// 			? 'pending'
		// 			: 'active'
		// 		: 'taken',
		// 	views: editing?.views || 0,
		// 	reqs: editing?.reqs || 0,
		// 	img:
		// 		editing?.img ||
		// 		(type === 'lodge'
		// 			? 'Lodge photo'
		// 			: type === 'food'
		// 				? 'Food photo'
		// 				: 'Listing photo'),
		// 	room: type === 'lodge' ? room : undefined,
		// 	amenities: type === 'lodge' ? amenities : undefined,
		// 	category: type === 'service' ? cat : undefined,
		// });
		navigate('/listings');

	};

	return (
		<>
			<div className='flex flex-col h-[80%] w-[95%] sm:w-[80%] md:max-w-[60%] bg-white p-3 rounded-md'>
				<div className='flex-1 overflow-y-auto'>
					<div className='px-[18px] py-[18px] pb-6'>
						{/* Type selector */}
						{/* <h2 className='m-0 mb-3 text-base font-extrabold text-ink'>
							Listing type
						</h2>
						<div className='grid grid-cols-2 gap-2.5'>
							{LISTING_TYPES.map((t) => {
								const on = userInfo?.category === t.id;
								return (
									<button
										key={t.id}
										type='button'
										onClick={() => setType(t.id)}
										className={`flex items-center gap-2.5 p-3.5 rounded-card cursor-pointer text-left border-[1.5px] transition-all ${
											on
												? 'border-primary bg-primary-tint shadow-[0_0_0_3px_rgba(13,122,114,0.12)]'
												: 'border-line2 bg-white shadow-sm2'
										}`}
									>
										<div
											className={`w-[38px] h-[38px] rounded-[11px] flex-shrink-0 flex items-center justify-center ${on ? 'bg-primary' : 'bg-primary-50'}`}
										>
											<Icon
												name={t.icon}
												size={20}
												stroke={1.9}
												color={on ? '#fff' : '#084f49'}
											/>
										</div>
										<div className='min-w-0'>
											<div className='font-extrabold text-[14px] text-ink'>
												{t.label}
											</div>
											<div className='text-muted text-[11.5px]'>
												{t.hint}
											</div>
										</div>
									</button>
								);
							})}
						</div> */}
						{/* Details */}
						<SectionLabel icon='info'>Details</SectionLabel>
						<div className='flex flex-wrap justify-between items-center gap-5'>
							<div className='w-[48%]'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Name
								</label>
								<input
									className={inputCls}
									placeholder={
										type === 'lodge'
											? 'e.g. Sunrise Self-Contain'
											: type === 'food'
												? "e.g. Mama T's Kitchen"
												: 'Give it a clear name'
									}
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className='w-[48%]'>
								<label className='block text-[13px] font-bold text-camtext mb-1.5'>
									Price{' '}
									<span className='text-faint font-semibold'>
										· per {PRICE_UNIT[type]}
									</span>
								</label>
								<div className='relative'>
									<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold'>
										₦
									</span>
									<input
										className={`${inputCls} pl-8`}
										type='number'
										inputMode='numeric'
										placeholder='0'
										value={price}
										onChange={(e) =>
											setPrice(e.target.value)
										}
									/>
								</div>
							</div>
							{userInfo?.category === 'agent' && (
								<div className='w-full'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Location near campus
									</label>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
											<Icon name='pin' size={17} />
										</span>
										<input
											className={`${inputCls} pl-[38px]`}
											placeholder='e.g. Westgate, 4 min to campus'
											value={area}
											onChange={(e) =>
												setArea(e.target.value)
											}
										/>
									</div>
								</div>
							)}
							{userInfo?.category === 'business' && (
								<div className='w-full flex flex-col gap-1'>
									<SectionLabel icon='info'>
										Category
									</SectionLabel>
									<CategorySelector
										value={category}
										onChange={setCategory}
									/>
								</div>
							)}
						</div>
						{/* Photos */}
						<SectionLabel icon='camera'>Photos</SectionLabel>
						<p className='text-muted text-[12.5px] -mt-1.5 mb-3.5'>
							First photo is your cover. Add up to 8.
						</p>
						<PhotoGallery
							photos={photos}
							onAdd={() => setPhotos([...photos, photos.length])}
							onRemove={(i) =>
								setPhotos(photos.filter((_, j) => j !== i))
							}
						/>

						{/* Lodge-specific */}
						{userInfo?.category === 'agent' && (
							<div className='animate-fadeUp'>
								<SectionLabel icon='home'>
									Room details
								</SectionLabel>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Room type
									</label>
									<div className='flex flex-wrap gap-2'>
										{ROOM_TYPES.map((r) => (
											<button
												key={r}
												type='button'
												className={`text-[13.5px] font-semibold px-3.5 py-2 rounded-full border-[1.5px] cursor-pointer transition-all ${
													room === r
														? 'bg-primary-50 text-primary-700 border-primary/40'
														: 'bg-white text-camtext border-line'
												}`}
												onClick={() => setRoom(r)}
											>
												{r}
											</button>
										))}
									</div>
								</div>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Amenities
									</label>
									<div className='grid grid-cols-2 gap-2'>
										{AMENITIES.map((a) => (
											<CheckItem
												key={a}
												label={a}
												checked={amenities.includes(a)}
												onClick={() =>
													toggle(
														amenities,
														setAmenities,
														a,
													)
												}
											/>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Service-specific */}
						{userInfo?.category === 'services' && (
							<div className='animate-fadeUp'>
								<SectionLabel icon='wrench'>
									Service details
								</SectionLabel>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Service category
									</label>
									<div className='flex flex-wrap gap-2'>
										{SERVICE_CATS.map((c) => (
											<button
												key={c}
												type='button'
												className={`text-[13.5px] font-semibold px-3.5 py-2 rounded-full border-[1.5px] cursor-pointer transition-all ${
													cat === c
														? 'bg-primary-50 text-primary-700 border-primary/40'
														: 'bg-white text-camtext border-line'
												}`}
												onClick={() => setCat(c)}
											>
												{c}
											</button>
										))}
									</div>
								</div>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Available days
									</label>
									<div className='flex gap-1.5'>
										{DAYS.map((d) => {
											const on = days.includes(d);
											return (
												<button
													key={d}
													type='button'
													onClick={() =>
														toggle(days, setDays, d)
													}
													className='flex-1 py-2.5 cursor-pointer rounded-[11px] font-bold text-[12.5px] transition-all border'
													style={{
														border: on
															? 'none'
															: '1.5px solid #e7edec',
														background: on
															? '#0d7a72'
															: '#fff',
														color: on
															? '#fff'
															: '#677975',
													}}
												>
													{d[0]}
												</button>
											);
										})}
									</div>
								</div>
								<div className='mb-4'>
									<label className='block text-[13px] font-bold text-camtext mb-1.5'>
										Hours
									</label>
									<div className='flex gap-2.5 items-center'>
										<input
											className={inputCls}
											defaultValue='08:00'
										/>
										<span className='text-muted font-bold'>
											to
										</span>
										<input
											className={inputCls}
											defaultValue='18:00'
										/>
									</div>
								</div>
							</div>
						)}

						{userInfo?.category === 'business' && (
							<div className='flex items-center justify-between gap-5 mt-5'>
								<div
									onClick={() => setDeliveryOption('pickup')}
									className={`${deliveryOption === 'pickup' ? 'bg-primary-50 text-primary-700 border-primary/40' : 'text-black'} border  flex flex-col hover:bg-gray-100 cursor-pointer duration-500 transition rounded-lg gap-2 items-center w-1/3  py-10 justify-center`}
								>
									<Store className='size-10 ' />
									<h5 className='text-xl font-urbanist font-medium capitalize '>
										pickup
									</h5>
								</div>
								<div
									onClick={() =>
										setDeliveryOption('campus delivery')
									}
									className={`${deliveryOption === 'campus delivery' ? 'bg-primary-50 text-primary-700 border-primary/40' : 'text-black'} border  flex flex-col hover:bg-gray-100 cursor-pointer duration-500 transition rounded-lg gap-2 items-center w-1/3  py-10 justify-center`}
								>
									<GraduationCap className='size-10 ' />
									<h5 className='text-xl font-urbanist font-medium capitalize'>
										campus delivery
									</h5>
								</div>
								<div
									onClick={() =>
										setDeliveryOption('doorstep')
									}
									className={`${deliveryOption === 'doorstep' ? 'bg-primary-50 text-primary-700 border-primary/40' : 'text-black'} border  flex flex-col hover:bg-gray-100 cursor-pointer duration-500 transition rounded-lg gap-2 items-center w-1/3  py-10 justify-center`}
								>
									<Home className='size-10 ' />
									<h5 className='text-xl font-urbanist font-medium capitalize '>
										doorstep
									</h5>
								</div>
							</div>
						)}
						{(deliveryOption === 'campus delivery' ||
							deliveryOption === 'doorstep') && (
							<div className='flex items-center justify-between gap-5 w-full mt-5'>
								<div className='flex flex-col items-start  w-full sm:w-2/3'>
									<label
										htmlFor='name'
										className='uppercase font-semibold text-primary text-xs '
									>
										delivery Price
									</label>
									<div className='flex w-full items-center mt-2 text-base gap-2 px-3 border border-transparent py-2 rounded-md bg-gray-200'>
										{/* <TbCurrencyNaira className='w-max text-3xl' /> */}
										<input
											type='text'
											// value={formatWithCommas(
											// 	deliveryPrice,
											// )}
											// onChange={(e) =>
											// 	handleChange(
											// 		e,
											// 		setDeliveryPrice,
											// 	)
											// }
											className='w-full font-urbanist font-medium'
										/>
									</div>
								</div>
								<div className='flex flex-col items-start  w-full sm:w-1/3'>
									<label
										htmlFor='name'
										className='uppercase font-semibold text-primary text-xs '
									>
										maximum delivery time
									</label>
									<div className='flex items-center justify-between gap-1 w-full rounded-md font-urbanist bg-gray-200  text-base font-medium mt-2'>
										<input
											type='number'
											placeholder='Days'
											// onChange={(e) =>
											// 	setDeliveryDurationDay(
											// 		e.target.value,
											// 	)
											// }
											className='p-3 w-1/3 outline-none capitalize focus:border-primary border-transparent border rounded-md'
										/>
										<input
											type='number'
											placeholder='hours'
											// onChange={(e) =>
											// 	setDeliveryDurationHour(
											// 		e.target.value,
											// 	)
											// }
											className='p-3 w-1/3 outline-none capitalize focus:border-primary border-transparent border rounded-md'
										/>
										<input
											type='number'
											placeholder='minutes'
											// onChange={(e) =>
											// 	setDeliveryDurationMinute(
											// 		e.target.value,
											// 	)
											// }
											className='p-3 w-1/3 outline-none capitalize focus:border-primary border-transparent border rounded-md'
										/>
									</div>
								</div>
							</div>
						)}

						{/* Description */}
						<SectionLabel>Description</SectionLabel>
						<textarea
							className='w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 resize-none leading-relaxed transition-all focus:border-primary placeholder:text-faint -mt-1'
							rows={4}
							placeholder='Describe what makes this great for students...'
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
						/>

						{/* Availability */}
						<div className='flex items-center gap-3.5 p-[15px] bg-white rounded-card border border-line2 shadow-sm2 mt-[18px]'>
							<div
								className={`w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0 ${available ? 'bg-ok-bg text-ok' : 'bg-gone-bg text-gone'}`}
							>
								<Icon
									name='bolt'
									size={20}
									color={available ? '#1f9d6b' : '#7d8d89'}
								/>
							</div>
							<div className='flex-1'>
								<div className='font-extrabold text-[14.5px] text-ink'>
									Available now
								</div>
								<div className='text-muted text-[12.5px]'>
									{available
										? 'Visible to students immediately'
										: 'Hidden — marked as taken'}
								</div>
							</div>
							<Switch
								checked={available}
								onChange={setAvailable}
								id='avail'
							/>
						</div>
					</div>
				</div>

				{/* Sticky save */}
				<div className='flex-none px-[18px] py-3.5 bg-white border-t border-line flex gap-2.5'>
					<button
						className='flex-none px-[22px] py-3.5 font-bold text-camtext bg-white border border-line rounded-md2 cursor-pointer hover:bg-bg transition-colors'
						onClick={setState}
					>
						Cancel
					</button>
					<button
						className='flex-1 flex items-center justify-center py-3.5 font-bold text-white bg-primary rounded-md2 cursor-pointer disabled:opacity-45 hover:bg-primary-600 transition-colors'
						style={{
							boxShadow: '0 3px 10px rgba(13,122,114,0.28)',
						}}
						disabled={!valid}
						onClick={handleSave}
					>
						{editing ? 'Save changes' : 'Publish listing'}
					</button>
				</div>
			</div>
		</>
	);
}
