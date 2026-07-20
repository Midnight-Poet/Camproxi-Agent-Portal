import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import StatusBadge from '../../components/StatusBadge';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import EmptyState from '../../components/EmptyState';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';
import { priceLine } from '../../data';
import CreateListingModal from '../../components/listings/CreateListingModal';
import { useDeleteProductMutation, useGetAllProductQuery } from '../../redux/api/productApiSlice';
import {
	useDeletePropertyMutation,
	useGetAllPropertyQuery,
} from '../../redux/api/propertyApiSlice';
import { useSelector } from 'react-redux';
import Spinner from '../../components/spinner';
import { useDeleteServiceMutation, useGetAllServiceQuery } from '../../redux/api/serviceApiSlice';
import Loading from '../../components/Loading';
import RichCard from '../../components/listings/RichCard';

const FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'active', label: 'Active' },
	{ id: 'pending', label: 'Pending' },
	{ id: 'taken', label: 'Taken' },
];


export default function MyListings() {
	const { userInfo } = useSelector((state) => state.auth);
	const category = userInfo?.category;

	// Fetch all three data sets unconditionally (RTK Query skips invalid role calls)
	const { data, refetch, isLoading: loadingProducts } = useGetAllProductQuery();
	const { data: propertyData, refetch: refetchProperty, isLoading: loadingProperties } =
		useGetAllPropertyQuery();
	const { data: serviceData, refetch: refetchService, isLoading: loadingServices } =
		useGetAllServiceQuery();

	// Call all three delete mutations unconditionally (no conditional hook calls)
	const [deleteProduct, { isLoading: deletingProduct }] = useDeleteProductMutation();
	const [deleteProperty, { isLoading: deletingProperty }] = useDeletePropertyMutation();
	const [deleteService, { isLoading: deletingService }] = useDeleteServiceMutation();
	const deleting = deletingProduct || deletingProperty || deletingService;

	// Derive the correct data set based on category
	const displayedData =
		category === 'VENDOR'
			? data
			: category === 'AGENT'
				? propertyData
				: serviceData;

	const isLoading = loadingProducts || loadingProperties || loadingServices;

	const navigate = useNavigate();
	const [id, setId] = useState();
	const { flash } = useApp();
	const [filter, setFilter] = useState('all');
	const [confirm, setConfirm] = useState(null);
	const [newListing, setNewListing] = useState(false);
	const [editListing, setEditListing] = useState(false);

	const shown = displayedData?.filter(
		(l) => filter === 'all' || l.status === filter,
	);
	const counts = displayedData?.reduce((a, l) => {
		a[l.status] = (a[l.status] || 0) + 1;
		return a;
	}, {});

	const deleteListing = async (listing) => {
		const itemId = listing.id || listing._id;
		try {
			if (category === 'VENDOR') {
				await deleteProduct(itemId).unwrap();
				refetch();
			} else if (category === 'AGENT') {
				await deleteProperty(itemId).unwrap();
				refetchProperty();
			} else {
				await deleteService(itemId).unwrap();
				refetchService();
			}
			setConfirm(null);
			flash('Successfully deleted!');
		} catch (err) {
			console.log(err);
			flash('Failed to delete listing.');
		}
	};


	return (
		<Layout>
			<div className='flex flex-col h-full'>
				<AppBar
					title='My Listings'
					sub={`${displayedData?.length ?? 0} total · ${(displayedData?.filter(l => l.status === 'available').length) ?? 0} active`}
				/>

				{/* Filter chips */}
				<div className='flex-none flex gap-2 px-4 sm:px-6 py-4 glass border-b border-white/40 overflow-x-auto scrollbar-hide relative z-10'>
					{FILTERS.map((f) => (
						<button
							key={f.id}
							className={`flex-shrink-0 text-[13.5px] font-semibold px-4 py-2.5 rounded-full border-[1.5px] transition-all duration-300 cursor-pointer ${
								filter === f.id
									? 'bg-gradient-to-r from-primary to-primary-600 text-white border-transparent shadow-glow'
									: 'bg-white/60 backdrop-blur-sm text-ink border-black/10 shadow-sm hover:bg-white/80'
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

				<div className='flex-1 overflow-y-auto w-full bg-transparent'>
					{isLoading ? (
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
						<div className='px-[18px] py-[18px] pb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
							{shown?.map((l) => (
								<RichCard
									key={l.id || l._id}
									l={l}
									onEdit={() => {
										setId(l.id || l._id);
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
				<CreateListingModal
					setState={() => {
						setNewListing(false);
					}}
					refetchData={() => {
						if (category === 'VENDOR') refetch();
						else if (category === 'AGENT') refetchProperty();
						else refetchService();
					}}
				/>
			)}
			<Loading
				show={deleting}
				msg={'Deleting...'}
			/>
			{editListing && (
				<CreateListingModal
					id={id}
					setState={() => {
						setEditListing(false);
					}}
					refetchData={() => {
						if (category === 'VENDOR') refetch();
						else if (category === 'AGENT') refetchProperty();
						else refetchService();
					}}
				/>
			)}
		</Layout>
	);
}
