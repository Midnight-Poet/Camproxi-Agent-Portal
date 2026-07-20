import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import EmptyState from '../../../components/EmptyState';
import Avatar from '../../../components/Avatar';
import Spinner from '../../../components/spinner';
import { useApp } from '../../../context/AppContext';
import {
	useGetItemReviewsQuery,
	useReplyToReviewMutation,
} from '../../../redux/api/reviewsApiSlice';

export default function Reviews() {
	const navigate = useNavigate();
	const { listings, flash } = useApp();
	const [selectedItem, setSelectedItem] = useState(listings?.[0]?.id || listings?.[0]?._id || '');
	const [replyText, setReplyText] = useState({});
	const [replyingTo, setReplyingTo] = useState(null);

	const { data: reviewsData, isLoading, refetch } = useGetItemReviewsQuery(selectedItem, {
		skip: !selectedItem,
	});

	const [submitReply, { isLoading: isSubmitting }] = useReplyToReviewMutation();

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

	return (
		<Layout>
			<div className="flex flex-col h-full bg-transparent">
				<AppBar title="Reviews & Ratings" onBack={() => navigate('/profile')} />

				<div className="flex-1 overflow-y-auto">
					<div className="px-[18px] pb-6 pt-4">
						{/* Item Selector Dropdown */}
						{listings?.length > 0 ? (
							<div className="mb-6 glass-heavy rounded-[24px] border border-white/60 p-5 shadow-sm">
								<label className="block text-[13.5px] font-bold text-camtext mb-2.5">
									Select Listing to View Reviews
								</label>
								<select
									value={selectedItem}
									onChange={(e) => setSelectedItem(e.target.value)}
									className="w-full text-[15px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[16px] px-4 py-3.5 outline-none focus:border-primary focus:bg-white transition-all font-medium"
								>
									{listings.map((l) => (
										<option key={l.id || l._id} value={l.id || l._id}>
											{l.name} ({l.businessCategory || l.roomType || 'Listing'})
										</option>
									))}
								</select>
							</div>
						) : (
							<EmptyState
								icon="listings"
								title="No listings yet"
								body="Create a listing first to start receiving reviews and ratings."
							/>
						)}

						{selectedItem && (
							<div className="space-y-4">
								{isLoading ? (
									<div className="py-12 flex justify-center">
										<Spinner />
									</div>
								) : !reviewsData || reviewsData.length === 0 ? (
									<EmptyState
										icon="chat"
										title="No reviews yet"
										body="Students have not left any ratings or comments for this listing."
									/>
								) : (
									reviewsData.map((rev) => (
										<div
											key={rev.id || rev._id}
											className="glass-heavy rounded-[24px] border border-white/60 p-6 shadow-sm space-y-4"
										>
											{/* Review Header */}
											<div className="flex items-start justify-between">
												<div className="flex items-center gap-3">
													<Avatar
														name={
															rev.student
																? `${rev.student.firstName} ${rev.student.lastName}`
																: 'Student'
														}
														url={rev.student?.profileImage?.url}
														size={40}
													/>
													<div>
														<div className="font-extrabold text-[14.5px] text-ink">
															{rev.student
																? `${rev.student.firstName} ${rev.student.lastName}`
																: 'Verified Student'}
														</div>
														<div className="flex gap-0.5 mt-0.5">
															{[1, 2, 3, 4, 5].map((n) => (
																<Icon
																	key={n}
																	name="star"
																	size={13}
																	color={n <= rev.rating ? '#0d7a72' : '#e7edec'}
																	style={{ fill: n <= rev.rating ? '#0d7a72' : 'none' }}
																/>
															))}
														</div>
													</div>
												</div>
												<span className="text-faint text-[11.5px] font-semibold">
													{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Today'}
												</span>
											</div>

											{/* Comment */}
											<p className="text-muted text-[13.5px] leading-relaxed">
												{rev.comment}
											</p>

											{/* Existing Reply */}
											{rev.agentResponse ? (
												<div className="bg-primary/5 rounded-[16px] p-4.5 border border-primary/10 mt-2">
													<div className="flex items-center gap-2.5 mb-2">
														<div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-sm">
															<Icon name="user" size={11} color="#fff" />
														</div>
														<span className="font-extrabold text-[12.5px] text-primary-700">
															Your response
														</span>
													</div>
													<p className="text-camtext text-[13px] leading-relaxed">
														{rev.agentResponse}
													</p>
												</div>
											) : replyingTo === rev._id || replyingTo === rev.id ? (
												<div className="space-y-4 mt-4">
													<textarea
														className="w-full text-[14px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[16px] px-4 py-3.5 resize-none leading-relaxed focus:bg-white focus:border-primary focus:ring-[4px] focus:ring-primary/15 hover:bg-white/80 placeholder:text-faint font-medium transition-all"
														rows={3}
														placeholder="Type your reply to this student..."
														value={replyText[rev.id || rev._id] || ''}
														onChange={(e) =>
															setReplyText((prev) => ({
																...prev,
																[rev.id || rev._id]: e.target.value,
															}))
														}
													/>
													<div className="flex gap-3 justify-end">
														<button
															onClick={() => setReplyingTo(null)}
															className="px-5 py-2.5 font-bold text-[13.5px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[12px] cursor-pointer hover:bg-white transition-all shadow-sm"
														>
															Cancel
														</button>
														<button
															disabled={isSubmitting || !replyText[rev.id || rev._id]?.trim()}
															onClick={() => handleReplySubmit(rev.id || rev._id)}
															className="px-5 py-2.5 font-bold text-[13.5px] text-white bg-gradient-to-r from-primary to-primary-600 rounded-[12px] cursor-pointer disabled:opacity-45 hover:shadow-glow transition-all"
														>
															Submit Reply
														</button>
													</div>
												</div>
											) : (
												<button
													onClick={() => setReplyingTo(rev.id || rev._id)}
													className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:text-primary-700 transition-colors mt-1"
												>
													<Icon name="chat" size={14} /> Reply to review
												</button>
											)}
										</div>
									))
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}
