import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import StatusBadge from '../../components/StatusBadge';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import EmptyState from '../../components/EmptyState';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';
import { TYPE_LABEL, priceLine } from '../../data';
import { useEffect } from 'react';
import CreateListing from './CreateListing';
import CreateListing2 from './createListingv2';
import { useDeleteProductMutation, useGetAllProductQuery } from '../../redux/api/productApiSlice';
import {
	useDeletePropertyMutation,
	useGetAllPropertyQuery,
} from '../../redux/api/propertyApiSlice';
import { useSelector } from 'react-redux';
import Spinner from '../../components/spinner';
import { useDeleteServiceMutation, useGetAllServiceQuery } from '../../redux/api/serviceApiSlice';
import Loading from '../../components/Loading';

const FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'active', label: 'Active' },
	{ id: 'pending', label: 'Pending' },
	{ id: 'taken', label: 'Taken' },
];

function CardActions({ onEdit, onDelete }) {
	return (
		<div className='flex gap-2'>
			<button
				className='flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[13.5px] font-bold text-camtext bg-white border border-line rounded-sm2 cursor-pointer hover:bg-bg transition-colors'
				onClick={onEdit}
			>
				<Icon name='edit' size={16} /> Edit
			</button>
			<button
				className='flex items-center justify-center w-10 text-danger bg-white border border-line rounded-sm2 cursor-pointer hover:bg-danger-bg transition-colors'
				onClick={onDelete}
				aria-label='Delete'
			>
				<Icon name='trash' size={17} color='#d2453d' />
			</button>
		</div>
	);
}

function RichCard({ l, onEdit, onDelete }) {
	let images = [];

	l.images[0]
		? l.images.forEach((item) => {
				images = [...images, item.url];
			})
		: (images = [...images, l.images.url]);
	return (
		<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-3.5 animate-fadeUp'>
			<div className='relative h-60'>
				<ImagePlaceholder images={images} label={l.i} />
				<div className='absolute top-3 left-3'>
					<StatusBadge status={l.status} />
				</div>
				{/* <div className='absolute top-3 right-3 bg-ink/60 text-white text-[11.5px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm'>
					<Icon name='tag' size={13} color='#fff' />{' '}
					{TYPE_LABEL[l.type]}
				</div> */}
			</div>
			<div className='p-[15px]'>
				<div className='flex justify-between items-start gap-2.5'>
					<div className='min-w-0'>
						<div className='font-extrabold text-base text-ink tracking-[-0.01em]'>
							{l.name}
						</div>
						<div className='font-medium capitalize text-base text-ink tracking-[-0.01em]'>
							{l.description}
						</div>
						{l.address && (
							<div className='text-muted text-[13px] flex items-center gap-1 mt-0.5'>
								<Icon name='pin' size={14} /> {l.address}
							</div>
						)}
					</div>
				</div>
				<div className='flex items-center gap-3.5 my-3'>
					<div className='font-extrabold text-[15px] text-primary-700'>
						{priceLine(l)}
					</div>
					<div className='ml-auto flex gap-3.5'>
						<span className='text-muted text-[12.5px] font-semibold flex items-center gap-1'>
							<Icon name='eye' size={15} /> {l.views || 0}
						</span>
						<span className='text-muted text-[12.5px] font-semibold flex items-center gap-1'>
							<Icon name='requests' size={15} /> {l.reqs || 0}
						</span>
					</div>
				</div>
				<CardActions onEdit={onEdit} onDelete={onDelete} />
			</div>
		</div>
	);
}

function CompactCard({ l, onEdit, onDelete }) {
	const iconMap = {
		lodge: 'home',
		food: 'fork',
		groceries: 'bag',
		service: 'wrench',
	};
	return (
		<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-3 p-3 flex gap-3.5 animate-fadeUp'>
			<ImagePlaceholder
				style={{
					width: 84,
					height: 84,
					borderRadius: 14,
					flexShrink: 0,
				}}
			>
				<Icon name={iconMap[l.type]} size={26} color='#aab8b4' />
			</ImagePlaceholder>
			<div className='flex-1 min-w-0 flex flex-col'>
				<div className='flex justify-between gap-2 items-start'>
					<div className='font-extrabold text-[15px] text-ink min-w-0 truncate'>
						{l.title}
					</div>
				</div>
				<div className='text-muted text-[12.5px] flex items-center gap-1 mt-0.5'>
					<Icon name='pin' size={13} />{' '}
					<span className='truncate'>{l.area}</span>
				</div>
				<div className='flex items-center gap-2 mt-1.5'>
					<StatusBadge status={l.status} />
					<span className='font-extrabold text-[13.5px] text-primary-700 ml-auto'>
						{priceLine(l)}
					</span>
				</div>
				<div className='flex gap-2 mt-2.5'>
					<button
						className='flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] font-bold text-primary-700 bg-primary-50 rounded-sm2 cursor-pointer hover:bg-primary-100 transition-colors'
						onClick={onEdit}
					>
						<Icon name='edit' size={15} /> Edit
					</button>
					<button
						className='flex items-center justify-center w-9 text-danger bg-white border border-line rounded-sm2 cursor-pointer'
						onClick={onDelete}
					>
						<Icon name='trash' size={16} color='#d2453d' />
					</button>
				</div>
			</div>
		</div>
	);
}

export default function MyListings() {
	const { userInfo } = useSelector((state) => state.auth);
	const category = userInfo.category;
	const { data, refetch } = useGetAllProductQuery();
	const { data: propertyData, refetch: refetchProperty } =
		useGetAllPropertyQuery();
	const { data: serviceData, refetch: refetchService } =
		useGetAllServiceQuery();

	// Delete item
	const [
		deleteItem,
		{
			isLoading: deleting,
			isSuccess: deleted,
			isError: errorDeleting,
			error: deleteError,
		},
	] =
		category === 'business'
			? useDeleteProductMutation()
			: category === 'landlord'
				? useDeletePropertyMutation()
				: useDeleteServiceMutation()

	const [displayedData, setDisplayedData] = useState();
	const navigate = useNavigate();
	const [id, setId] = useState();
	const { listings, flash } = useApp();
	const [filter, setFilter] = useState('all');
	const [confirm, setConfirm] = useState(null);
	const [newListing, setNewListing] = useState(false);
	const [editListing, setEditListing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		category === 'business'
			? setDisplayedData(data)
			: category === 'landlord'
				? setDisplayedData(propertyData)
				: setDisplayedData(serviceData);
		displayedData ? setLoading(false) : null;
	}, [data, propertyData, displayedData, serviceData]);
	const shown = displayedData?.filter(
		(l) => filter === 'all' || l.status === filter,
	);
	const counts = displayedData?.reduce((a, l) => {
		a[l.status] = (a[l.status] || 0) + 1;
		return a;
	}, {});

	const deleteListing = async (listing) => {
		const data = { propertyId: listing.propertyId, id: listing._id };
		try {
			await deleteItem(data).unwrap();
			setConfirm(null);
			category === 'business'
				? refetch()
				: category === 'landlord'
					? refetchProperty()
					: refetchService();
			flash('Successfully deleted!');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='flex flex-col h-full'>
				<AppBar
					title='My Listings'
					sub={`${displayedData?.length} total · ${counts?.active || 0} active`}
				/>

				{/* Filter chips */}
				<div className='flex-none flex gap-2 px-[18px] py-3 bg-white border-b border-line overflow-x-auto scrollbar-hide'>
					{FILTERS.map((f) => (
						<button
							key={f.id}
							className={`flex-shrink-0 text-[13.5px] font-semibold px-3.5 py-2 rounded-full border-[1.5px] transition-all duration-150 cursor-pointer ${
								filter === f.id
									? 'bg-primary-50 text-primary-700 border-primary/40'
									: 'bg-white text-camtext border-line'
							}`}
							onClick={() => setFilter(f.id)}
						>
							{f.label}
							{/* <span></span> */}
							{f.id !== 'all' && counts && counts[f.id]
								? ' · ' + counts[f.id]
								: ' '}
						</button>
					))}
					<button
						onClick={() => {
							setNewListing(true);
						}}
						className='flex ml-auto items-center gap-1.5 px-3 py-2 bg-primary text-white text-[13px] font-bold rounded-[12px] cursor-pointer hover:bg-primary-600 transition-colors'
						style={{
							boxShadow: '0 2px 8px rgba(13,122,114,0.28)',
						}}
					>
						<Icon name='plus' size={17} color='#fff' /> New
					</button>
				</div>

				<div className='flex-1 overflow-y-auto'>
					{loading ? (
						<Spinner />
					) : shown?.length === 0 ? (
						<div className='px-[18px] py-[18px] pb-7 flex flex-wrap items-center justify-center gap-5 [&>div]:w-[32%]'>
							{
								<EmptyState
									icon='listings'
									title='Nothing here yet'
									body={
										filter === 'all'
											? 'Create your first listing to start receiving student requests.'
											: `No ${filter} listings right now.`
									}
									action={
										<button
											onClick={() => setNewListing(true)}
											className='flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-md2 cursor-pointer hover:bg-primary-600 transition-colors'
											style={{
												boxShadow:
													'0 3px 10px rgba(13,122,114,0.28)',
											}}
										>
											<Icon
												name='plus'
												size={18}
												color='#fff'
											/>{' '}
											Add Listing
										</button>
									}
								/>
							}
						</div>
					) : (
						<div className='px-[18px] py-[18px] pb-7 flex flex-wrap items-center gap-5 [&>div]:w-[32%]'>
							{shown?.map((l) => (
								<RichCard
									key={l._id}
									l={l}
									onEdit={() => {
										setId(l._id);
										setEditListing(true);
									}}
									onDelete={() => setConfirm(l)}
								/>
							))}
						</div>
					)}
				</div>

				{/* FAB on mobile */}
				<button
					onClick={() => {
						setNewListing(true);
						e;
					}}
					className='md:hidden fixed right-[18px] z-30 w-14 h-14 rounded-[18px] bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-all active:scale-95'
					style={{
						bottom: 'calc(72px + 14px)',
						boxShadow: '0 12px 34px rgba(20,32,30,.12)',
					}}
				>
					<Icon name='plus' size={26} color='#fff' stroke={2.2} />
				</button>

				{/* Delete confirm sheet */}
				{confirm && (
					<div
						className='fixed inset-0 sm:bg-black/30 sm:flex sm:items-center sm:justify-center sm:backdrop-blur-sm sm z-40 bg-ink/42 flex items-end'
						onClick={() => setConfirm(null)}
					>
						<div
							className='w-full sm:w-1/4 sm:h-max bg-white rounded-t-3xl sm:rounded-3xl p-[10px_18px_34px] animate-sheetUp'
							onClick={(e) => e.stopPropagation()}
						>
							{/* <div className='w-9 h-1 rounded-full bg-line mx-auto mb-3.5' /> */}
							<div className='text-center px-1.5 py-1'>
								<div className='w-14 h-14 rounded-[16px] bg-danger-bg text-danger flex items-center justify-center mx-auto mb-3.5'>
									<Icon
										name='trash'
										size={26}
										color='#d2453d'
									/>
								</div>
								<div className='font-extrabold text-[18px] text-ink'>
									Delete this listing?
								</div>
								<div className='text-muted text-sm mt-1.5 mb-5'>
									"{confirm.name}" will be permanently
									removed.
								</div>
								<div className='flex gap-2.5'>
									<button
										className='flex-1 py-3.5 font-bold text-base text-camtext bg-white border border-line rounded-md2 cursor-pointer'
										onClick={() => setConfirm(null)}
									>
										Cancel
									</button>
									<button
										className='flex-1 py-3.5 font-bold text-base text-white bg-danger rounded-md2 cursor-pointer'
										onClick={() => {
											deleteListing(confirm);
											// setConfirm(null);
										}}
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			{newListing && (
				<div className='transition-opacity duration-500 animate-fadeUp fixed top-0 left-0 z-999 h-screen w-full bg-black/20 flex items-center justify-center'>
					<CreateListing2
						setState={() => {
							setNewListing(false);
							category === 'business'
								? refetch()
								: category === 'landlord'
									? refetchProperty()
									: refetchService();
						}}
					/>
				</div>
			)}
			<Loading
				show={deleting}
				msg={'Deleting...'}
			/>
			{editListing && (
				<div className='transition-opacity duration-500 animate-fadeUp fixed top-0 left-0 z-999 h-screen w-full bg-black/20 flex items-center justify-center'>
					<CreateListing2
						id={id}
						setState={() => {
							setEditListing(false);
							category === 'business'
								? refetch()
								: category === 'landlord'
									? refetchProperty()
									: refetchService();
						}}
					/>
				</div>
			)}
		</Layout>
	);
}
