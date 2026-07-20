import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import Spinner from '../../components/spinner';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import { useApp } from '../../context/AppContext';
import { priceLine } from '../../data';
import {
	useGetItemReviewsQuery,
	useGetItemRatingsQuery,
	useReplyToReviewMutation,
} from '../../redux/api/reviewsApiSlice';

export default function ListingDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { listings, flash } = useApp();
	const [replyText, setReplyText] = useState({});
	const [replyingTo, setReplyingTo] = useState(null);

	const l = listings.find((item) => item.id === id || item._id === id);

	const { data: reviewsData, isLoading, refetch } = useGetItemReviewsQuery(id, {
		skip: !id,
	});
	const { data: ratingsData } = useGetItemRatingsQuery(id, { skip: !id });

	const [submitReply, { isLoading: isSubmitting }] = useReplyToReviewMutation();

	if (!l) {
		return (
			<Layout>
				<AppBar title="Listing Details" onBack={() => navigate('/listings')} />
				<div className="p-8">
					<EmptyState
						icon="listings"
						title="Listing not found"
						body="This item does not exist or you do not have permission to view it."
					/>
				</div>
			</Layout>
		);
	}

	const handleReplySubmit = async (reviewId) => {
		const message = replyText[reviewId];
		if (!message || !message.trim()) return;

		try {
			await submitReply({ id: reviewId, responseMessage: message }).unwrap();
			flash('Reply posted successfully!');
			setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
			setReplyingTo(null);
			refetch();
		} catch (err) {
			flash('Failed to post reply.');
		}
	};

	let images = [];
	if (Array.isArray(l.images)) {
		l.images.forEach((item) => {
			if (item) images.push(item.url || item);
		});
	} else if (l.images?.url) {
		images.push(l.images.url);
	} else if (typeof l.images === 'string') {
		images.push(l.images);
	}

	// Calculate average rating securely preventing NaN
	let avgRating = null;
	const sourceData = Array.isArray(ratingsData) ? ratingsData : (Array.isArray(reviewsData) ? reviewsData : []);
	
	const numericRatings = sourceData
		.map(r => typeof r === 'number' ? r : Number(r?.rating))
		.filter(r => !isNaN(r) && r > 0);
		
	if (numericRatings.length > 0) {
		avgRating = (numericRatings.reduce((acc, val) => acc + val, 0) / numericRatings.length).toFixed(1);
	}

	return (
		<Layout>
			<div className="flex flex-col h-full bg-transparent">
				<AppBar title={l.name || 'Listing Details'} onBack={() => navigate('/listings')} />

				<div className="flex-1 overflow-y-auto">
					<div className="px-[18px] pb-8 pt-4 flex flex-col lg:flex-row gap-6 items-start">
						{/* Left Pane - Details */}
						<div className="w-full lg:w-3/5 space-y-6">
							{/* Cover Images */}
							<div className="relative h-72 sm:h-96 rounded-card overflow-hidden shadow-sm border border-line2">
								<ImagePlaceholder images={images} label={l.i} />
							</div>

							{/* Specifications Card */}
							<div className="glass-heavy rounded-[24px] border border-white/60 p-6 md:p-8 shadow-sm space-y-4 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
								<div className="relative z-10 flex justify-between items-start gap-4">
									<div>
										<h2 className="text-2xl font-black text-ink tracking-tight">{l.name}</h2>
										<p className="text-[13px] font-bold text-primary uppercase mt-1 tracking-wider">
											{l.businessCategory || l.roomType || 'Active Listing'}
										</p>
									</div>
									<div className="text-right">
										<div className="text-xl font-black text-primary-700">{priceLine(l)}</div>
										{l.perUnit && <div className="text-faint text-[12px] font-bold">per {l.perUnit}</div>}
									</div>
								</div>

								<div className="h-px bg-white/40 my-2 relative z-10" />

								{/* Dynamic Fields */}
								<div className="grid grid-cols-2 gap-5 relative z-10">
									{l.address && (
										<div>
											<span className="text-[12px] text-faint font-bold uppercase block">Address</span>
											<span className="text-camtext text-[14px] font-semibold mt-0.5 inline-flex items-center gap-1">
												<Icon name="pin" size={14} /> {l.address}
											</span>
										</div>
									)}
									{l.unitQuantity !== undefined && (
										<div>
											<span className="text-[12px] text-faint font-bold uppercase block">Available Units</span>
											<span className="text-camtext text-[14px] font-semibold mt-0.5 inline-flex items-center gap-1">
												<Icon name="home" size={14} /> {l.unitQuantity} units
											</span>
										</div>
									)}
									{l.delivery?.option && (
										<div>
											<span className="text-[12px] text-faint font-bold uppercase block">Delivery Mode</span>
											<span className="text-camtext text-[14px] font-semibold mt-0.5 inline-flex items-center gap-1 capitalize">
												<Icon name="tag" size={14} /> {l.delivery.option.toLowerCase()}
											</span>
										</div>
									)}
									{l.time?.startTime && (
										<div>
											<span className="text-[12px] text-faint font-bold uppercase block">Operating Hours</span>
											<span className="text-camtext text-[14px] font-semibold mt-0.5 inline-flex items-center gap-1">
												<Icon name="clock" size={14} /> {l.time.startTime} - {l.time.endTime}
											</span>
										</div>
									)}
								</div>

								{/* Amenities (Agent/Properties only) */}
								{l.amenities?.length > 0 && (
									<div className="pt-3 relative z-10">
										<span className="text-[12px] text-faint font-bold uppercase block mb-2">Amenities</span>
										<div className="flex flex-wrap gap-1.5">
											{l.amenities.map((a) => (
												<span key={a} className="text-[12.5px] font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary/10">
													{a}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Available Days (Service Provider only) */}
								{l.availableDays?.length > 0 && (
									<div className="pt-3 relative z-10">
										<span className="text-[12px] text-faint font-bold uppercase block mb-2">Available Days</span>
										<div className="flex gap-1">
											{l.availableDays.map((d) => (
												<span key={d} className="text-[12.5px] font-extrabold text-white bg-primary w-8 h-8 rounded-full flex items-center justify-center">
													{d[0]}
												</span>
											))}
										</div>
									</div>
								)}

								<div className="h-px bg-white/40 my-2 relative z-10" />

								<div className="relative z-10">
									<span className="text-[12px] text-faint font-bold uppercase block mb-1">Description</span>
									<p className="text-muted text-[14px] leading-relaxed whitespace-pre-line">{l.description}</p>
								</div>
							</div>
						</div>

						{/* Right Pane - Reviews & Ratings */}
						<div className="w-full lg:w-2/5 space-y-6">
							{/* Ratings Summary Card */}
							<div className="glass-heavy rounded-[24px] border border-white/60 p-6 md:p-8 shadow-sm flex items-center justify-between">
								<div>
									<h3 className="text-[16px] font-black text-ink">Reviews & Ratings</h3>
									<p className="text-muted text-[13px] mt-0.5">
										{reviewsData?.length || 0} reviews received
									</p>
								</div>
								{avgRating ? (
									<div className="flex items-center gap-2.5">
										<div className="text-[34px] font-black text-ink leading-none">{avgRating}</div>
										<div>
											<div className="flex gap-0.5">
												{[1, 2, 3, 4, 5].map((n) => (
													<Icon
														key={n}
														name="star"
														size={13}
														color={n <= Math.round(Number(avgRating)) ? '#0d7a72' : '#e7edec'}
														style={{ fill: n <= Math.round(Number(avgRating)) ? '#0d7a72' : 'none' }}
													/>
												))}
											</div>
											<span className="text-faint text-[11px] font-bold block mt-0.5 uppercase tracking-wider">Average</span>
										</div>
									</div>
								) : (
									<div className="text-[13px] font-bold text-faint">No Ratings Yet</div>
								)}
							</div>

							{/* Reviews List */}
							<div className="space-y-4">
								{isLoading ? (
									<div className="py-12 flex justify-center glass-heavy rounded-[24px] border border-white/60">
										<Spinner />
									</div>
								) : !reviewsData || reviewsData.length === 0 ? (
									<div className="glass-heavy rounded-[24px] border border-white/60">
										<EmptyState
											icon="chat"
											title="No comments left"
											body="Feedback left by students will show up here."
										/>
									</div>
								) : (
									reviewsData.map((rev) => (
										<div
											key={rev.id || rev._id}
											className="glass-heavy rounded-[24px] border border-white/60 p-5 md:p-6 shadow-sm space-y-4"
										>
											<div className="flex items-start justify-between">
												<div className="flex items-center gap-3">
													<Avatar
														name={rev.student ? `${rev.student.firstName} ${rev.student.lastName}` : 'Student'}
														url={rev.student?.profileImage?.url}
														size={36}
													/>
													<div>
														<div className="font-extrabold text-[13.5px] text-ink">
															{rev.student ? `${rev.student.firstName} ${rev.student.lastName}` : 'Verified Student'}
														</div>
														<div className="flex gap-0.5 mt-0.5">
															{[1, 2, 3, 4, 5].map((n) => (
																<Icon
																	key={n}
																	name="star"
																	size={11}
																	color={n <= rev.rating ? '#0d7a72' : '#e7edec'}
																	style={{ fill: n <= rev.rating ? '#0d7a72' : 'none' }}
																/>
															))}
														</div>
													</div>
												</div>
												<span className="text-faint text-[11px] font-semibold">
													{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Today'}
												</span>
											</div>

											<p className="text-muted text-[13px] leading-relaxed">
												{rev.comment}
											</p>

											{/* Reply Block */}
											{rev.agentResponse ? (
												<div className="bg-primary/5 rounded-[16px] p-4 border border-primary/10">
													<div className="flex items-center gap-1.5 mb-1">
														<div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
															<Icon name="user" size={8} color="#fff" />
														</div>
														<span className="font-extrabold text-[11.5px] text-primary-700">
															Your response
														</span>
													</div>
													<p className="text-camtext text-[12.5px] leading-relaxed">
														{rev.agentResponse}
													</p>
												</div>
											) : replyingTo === rev._id || replyingTo === rev.id ? (
												<div className="space-y-3 mt-3">
													<textarea
														className="w-full text-[13.5px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[12px] px-4 py-3 resize-none leading-relaxed focus:bg-white focus:border-primary focus:ring-[4px] focus:ring-primary/15 hover:bg-white/80 placeholder:text-faint font-medium transition-all"
														rows={2.5}
														placeholder="Reply to this feedback..."
														value={replyText[rev.id || rev._id] || ''}
														onChange={(e) =>
															setReplyText((prev) => ({
																...prev,
																[rev.id || rev._id]: e.target.value,
															}))
														}
													/>
													<div className="flex gap-2 justify-end">
														<button
															onClick={() => setReplyingTo(null)}
															className="px-3 py-1.5 font-bold text-[12px] text-camtext bg-white border border-line rounded-sm2 cursor-pointer"
														>
															Cancel
														</button>
														<button
															disabled={isSubmitting || !replyText[rev.id || rev._id]?.trim()}
															onClick={() => handleReplySubmit(rev.id || rev._id)}
															className="px-3 py-1.5 font-bold text-[12px] text-white bg-primary rounded-sm2 cursor-pointer disabled:opacity-45"
														>
															Submit
														</button>
													</div>
												</div>
											) : (
												<button
													onClick={() => setReplyingTo(rev.id || rev._id)}
													className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:text-primary-700 transition-colors"
												>
													<Icon name="chat" size={13} /> Reply to review
												</button>
											)}
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
