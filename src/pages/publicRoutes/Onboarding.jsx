import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { AGENT_TYPES } from '../../data';
import { useApp } from '../../context/AppContext';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import Toast from '../../components/Toast';
import { useRegisterMutation } from '../../redux/api/agentApiSlice';
import { useGetSchoolsQuery } from '../../redux/api/adminApiSlice';
import { useDispatch } from 'react-redux';
import { setCredientials } from '../../redux/feautures/auth/authSlice';
import Loading from '../../components/Loading';
import DesktopBrandPanel from '../../components/shared/DesktopBrandPanel';
import Field, { inputCls } from '../../components/shared/Field';

import AgentTypeCard from '../../components/auth/AgentTypeCard';
import BrandMark from '../../components/shared/BrandMark';

function CampusSelect({ schoolsData, value, onChange }) {
    const [open, setOpen] = useState(false);
    
    const selectedText = value 
        ? (() => {
            const [sId, cName] = value.split('|');
            const school = schoolsData?.find(s => s.id === sId || s._id === sId);
            return school ? `${school.code} ${cName}` : '-- Choose Campus --';
          })()
        : '-- Choose Campus --';

    const options = schoolsData?.flatMap(s => 
        (s.campus || []).map((c, i) => ({
            id: `${s.id || s._id}|${c.name}`,
            label: `${s.code} ${c.name}`,
            schoolName: s.name
        }))
    ) || [];

    return (
        <div className="relative">
            <div 
                onClick={() => setOpen(!open)}
                className={`w-full text-[15px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] ${open ? 'border-primary ring-[4px] ring-primary/15 bg-white' : 'border-black/10 hover:bg-white/80'} rounded-xl px-4 py-3.5 transition-all cursor-pointer font-medium flex items-center justify-between shadow-sm`}
            >
                <div className="flex items-center gap-2">
                    <div className="text-muted"><Icon name="pin" size={18} /></div>
                    <span className={value ? 'text-ink font-bold' : 'text-faint'}>{selectedText}</span>
                </div>
                <div className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
					<Icon name="chevronDown" size={18} />
				</div>
            </div>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-xl border-[1.5px] border-white shadow-lg2 rounded-[20px] p-2 max-h-[280px] overflow-y-auto animate-fadeUp">
                        {options.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted font-bold">No campuses found</div>
                        ) : (
                            options.map(opt => (
                                <div 
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt.id);
                                        setOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-[14px] cursor-pointer transition-all duration-200 flex flex-col gap-0.5 ${value === opt.id ? 'bg-primary/10 text-primary-700' : 'hover:bg-black/5 text-ink'}`}
                                >
                                    <span className="font-extrabold text-[14px]">{opt.label}</span>
                                    <span className="text-[12px] opacity-70 truncate font-semibold">{opt.schoolName}</span>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function Onboarding() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [registerUser, { isSuccess, isError, isLoading, error }] =
		useRegisterMutation();
	const { data: schoolsData, isLoading: schoolsLoading } = useGetSchoolsQuery();
	const {
		setAgentType,
		passwordValidation,
		formValidation,
		loginValidation,
		deleteListing,
		flash,
		toast,
	} = useApp();
	const [step, setStep] = useState(0);
	const [agent, setAgent] = useState(null);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		// address: '',
		phone: '',
		whatsapp: '',
		companyName: '',
		category: '',
		schoolId: '',
		campusName: '',
	});
	const [confirmPassword, setConfirmPassword] = useState('');
	const [type, setType] = useState(true);
	const [type2, setType2] = useState(true);
	
	const [locationVerified, setLocationVerified] = useState(false);
	const [locationSelected, setLocationSelected] = useState(false);
	const [locationLoading, setLocationLoading] = useState(false);
	const [locationError, setLocationError] = useState('');
	const [manualSchoolSelect, setManualSchoolSelect] = useState(false);

	const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });
	const [dataValid, isDataValid] = useState(false);

	const detailsValid =
		// formData.address &&
		formData.companyName &&
		formData.firstName &&
		formData.lastName &&
		formData.username &&
		formData.password &&
		formData.phone &&
		formData.email &&
		confirmPassword;
	const canNext =
		step === 0 ? !!formData.category : step === 1 ? detailsValid : step === 2 ? locationVerified || locationSelected : true;
	const total = 3;

	const hasUppercase = (str) => /[A-Z]/.test(str);
	const validateForm = (e) => {
		e.preventDefault();
		const passwordValidType = hasUppercase(formData.password);
		const passwordValidLength = formData.password.length >= 8;
		const confirmPasswordValid = confirmPassword === formData.password;
		if (!detailsValid) {
			formValidation();
		} else if (!passwordValidLength) {
			passwordValidation('length');
		} else if (!passwordValidType) {
			passwordValidation('type');
		} else if (!confirmPasswordValid) {
			passwordValidation('mismatch');
		} else {
			next(e);
		}
	};
	const handleComplete = async (e) => {
		e.preventDefault();
        
        const categoryMap = {
            landlord: 'AGENT',
            business: 'VENDOR',
            provider: 'SERVICE_PROVIDER'
        };
        
        const payload = {
            ...formData,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            category: categoryMap[formData.category] || formData.category,
        };

        if (!payload.whatsapp) delete payload.whatsapp;
        if (!payload.campusName) delete payload.campusName;

		try {
			const res = await registerUser(payload).unwrap();
			flash('Successfully created account!');
			dispatch(setCredientials({ ...res }));
			navigate('/dashboard');
		} catch (err) {
			loginValidation(
				err?.data?.message || err?.message || 'Error occurred',
			);

			console.log(err);
		}
	};

	const verifyLocation = (e) => {
		e?.preventDefault();
		if (!schoolsData) return;
		
		setLocationLoading(true);
		setLocationError('');
		
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const R = 6371; // km
				let matchedSchool = null;
				let matchedCampus = null;
				
				for (const school of schoolsData) {
					if (school.campus && Array.isArray(school.campus)) {
						for (const campus of school.campus) {
							if (campus.location && campus.location.latitude && campus.location.longitude) {
								const dLat = (campus.location.latitude - latitude) * Math.PI / 180;
								const dLon = (campus.location.longitude - longitude) * Math.PI / 180;
								const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
										  Math.cos(latitude * Math.PI / 180) * Math.cos(campus.location.latitude * Math.PI / 180) *
										  Math.sin(dLon/2) * Math.sin(dLon/2);
								const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
								const d = R * c;
								if (d <= 20) {
									matchedSchool = school;
									matchedCampus = campus;
									break;
								}
							}
						}
						if (matchedSchool) break;
					}
				}
				
				if (matchedSchool && matchedCampus) {
					setFormData({ ...formData, schoolId: matchedSchool.id || matchedSchool._id, campusName: matchedCampus.name });
					setLocationVerified(true);
					setManualSchoolSelect(false);
				} else {
					// console.log(matchedSchool)
					setLocationError('Your location does not match any campuses in our system.');
					setManualSchoolSelect(true);
				}
				setLocationLoading(false);
			},
			(error) => {
				setLocationError('Location permission is required to verify your location. Please enable it and try again.');
				setManualSchoolSelect(false); // Must grant location permission
				setLocationLoading(false);
			},
			{ enableHighAccuracy: true }
		);
	};

	const next = (e) => {
		e.preventDefault();
		step < total - 1
			? setStep(step + 1)
			: step === 1
				? validateForm(e)
				: handleComplete(e);
	};
	const back = (e) => {
		e.preventDefault();
		setStep(Math.max(0, step - 1));
	};


	const TypeStep = (
		<div className='animate-fadeUp' key='type'>
			<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2'>
				Step 1 · Account type
			</div>
			<h2 className='m-0 mb-1 text-[22px] font-extrabold text-ink tracking-[-0.02em]'>
				What do you offer?
			</h2>
			<p className='text-muted text-sm mb-5'>
				Pick the type that fits you best. You can list more later.
			</p>
			<div className='flex items-center justify-between gap-3 sm:flex-row flex-col'>
				{AGENT_TYPES.map((t) => (
					<AgentTypeCard
						key={t.id}
						t={t}
						selected={formData.category === t.id}
						onClick={() =>
							setFormData({ ...formData, category: t.id })
						}
					/>
				))}
			</div>
		</div>
	);

	const DetailsStep = (
		<div className='animate-fadeUp' key='details'>
			<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2'>
				Step 2 · Your details
			</div>
			{/* <h2 className='m-0 mb-5 text-[22px] font-extrabold text-ink tracking-[-0.02em]'>
				Tell us about you
			</h2> */}
			<div className='w-full flex items-center justify-between flex-wrap gap-[1%]'>
				<Field label='First name' className={`w-full sm:w-[49%]`}>
					<input
						className={inputCls}
						placeholder='e.g. Adaeze'
						value={formData.firstName}
						onChange={set('firstName')}
					/>
				</Field>
				<Field label='last name' className={`w-full sm:w-[49%]`}>
					<input
						className={inputCls}
						placeholder='e.g. Okafor'
						value={formData.lastName}
						onChange={set('lastName')}
					/>
				</Field>
				<Field label='username' className={`w-full sm:w-[49%]`}>
					<input
						className={inputCls}
						// placeholder='e.g. Okafor'
						value={formData.username}
						onChange={set('username')}
					/>
				</Field>
				<Field
					className={`w-full sm:w-[49%]`}
					label={
						agent === 'landlord'
							? 'agency / Company name'
							: 'Business / Company name'
					}
				>
					<input
						className={inputCls}
						placeholder='e.g. Sunrise'
						value={formData.companyName}
						onChange={set('companyName')}
					/>
				</Field>
				<Field label='Email' className={`w-full`}>
					<input
						className={inputCls}
						type='email'
						placeholder='you@email.com'
						value={formData.email}
						onChange={set('email')}
					/>
				</Field>
				<Field label='Phone' className={`w-full sm:w-[49%]`}>
					<div className='relative'>
						<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-ink font-semibold text-[15px]'>
							+234
						</span>
						<input
							className={`${inputCls} pl-[54px]`}
							type='tel'
							placeholder='801 234 5678'
							value={formData.phone}
							onChange={set('phone')}
						/>
					</div>
				</Field>
				<Field label='Whatsapp' opt className={`w-full sm:w-[49%]`}>
					<div className='relative'>
						<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-ink font-semibold text-[15px]'>
							+234
						</span>
						<input
							className={`${inputCls} pl-[54px]`}
							type='tel'
							placeholder='801 234 5678'
							value={formData.whatsapp}
							onChange={set('whatsapp')}
						/>
					</div>
				</Field>
				{/* <Field label='Area near campus' className={`w-full`}>
					<div className='relative '>
						<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10'>
							<Icon name='pin' size={17} />
						</span>
						<input
							className={`${inputCls} pl-[38px]`}
							placeholder='e.g. Westgate, Tanke'
							value={formData.address}
							onChange={set('address')}
						/>
					</div>
				</Field> */}
				<Field label='Password' className={`w-full sm:w-[49%] `}>
					<div
						className={`w-full text-[15px] pr-2 text-ink bg-white border-[1.5px] border-line rounded-md2 overflow-hidden transition-all duration-500 focus-within::border-primary placeholder:text-faint flex items-center gap-1`}
					>
						<input
							className={`w-full  px-3.5 py-3`}
							type={type ? 'password' : 'text'}
							value={formData.password}
							onChange={set('password')}
						/>
						<div
							onClick={() => setType(!type)}
							className='hover:text-gray-500 cursor-pointer transition duration-500'
						>
							{type ? <Eye /> : <EyeOff />}
						</div>
					</div>
				</Field>
				<Field label='confirm Password' className={`w-full sm:w-[49%] `}>
					<div
						className={`w-full text-[15px] pr-2 text-ink bg-white border-[1.5px] border-line rounded-md2 overflow-hidden transition-all duration-500 focus-within::border-primary placeholder:text-faint flex items-center gap-1`}
					>
						<input
							className={`w-full  px-3.5 py-3`}
							type={type2 ? 'password' : 'text'}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<div
							onClick={() => setType2(!type2)}
							className='hover:text-gray-500 cursor-pointer transition duration-500'
						>
							{type2 ? <Eye /> : <EyeOff />}
						</div>
					</div>
				</Field>
			</div>
		</div>
	);

	const VerifyStep = (
		<div className='animate-fadeUp' key='verify'>
			<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2'>
				Step 3 · Verification
			</div>
			<h2 className='m-0 mb-1 text-[22px] font-extrabold text-ink tracking-[-0.02em]'>
				Verify Location
			</h2>
			<p className='text-muted text-sm mb-[18px]'>
				We need to verify your proximity to a campus to build trust with students.
			</p>

            {!locationVerified && !manualSchoolSelect && (
                <button
                    onClick={verifyLocation}
                    disabled={locationLoading || schoolsLoading}
                    className='w-full cursor-pointer bg-primary-tint rounded-card py-7 px-[18px] text-center flex flex-col items-center gap-2.5 disabled:opacity-50'
                    style={{ border: '1.5px dashed rgba(13,122,114,0.38)' }}
                    type="button"
                >
                    <div className='w-12 h-12 rounded-[14px] bg-primary-100 text-primary-700 flex items-center justify-center'>
                        <Icon name='pin' size={24} />
                    </div>
                    <div>
                        <div className='font-extrabold text-ink text-[15px]'>
                            {locationLoading ? 'Verifying...' : 'Verify My Location'}
                        </div>
                        <div className='text-muted text-[12.5px] mt-0.5'>
                            Requires location permission
                        </div>
                    </div>
                </button>
            )}

            {locationError && !manualSchoolSelect && (
                <div className='mt-3 text-red-500 text-[13px] font-bold text-center'>
                    {locationError}
                </div>
            )}

            {locationVerified && (
                <div className='bg-white rounded-card border shadow-sm2 flex flex-col gap-1 p-4' style={{ borderColor: 'rgba(13,122,114,0.3)' }}>
                    <div className='text-sm text-ok font-bold flex items-center gap-1.5'>
                        <div className='w-6 h-6 rounded-full bg-ok-bg text-ok flex items-center justify-center'>
                            <Icon name='check' size={14} stroke={3} />
                        </div>
                        Location Verified
                    </div>
                    <p className='text-[13px] text-muted ml-7.5'>
                        You are near {schoolsData?.find(s => s._id === formData.schoolId || s.id === formData.schoolId)?.code} {formData.campusName}.
                    </p>
                </div>
            )}

            {manualSchoolSelect && (
                <div className='mt-4 animate-fadeUp'>
                    <div className='bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-[12.5px] font-bold mb-4 flex gap-2'>
                        <div className="mt-0.5"><Icon name="info" size={16} /></div>
                        Caution: Location not verified. Your account will be pending manual review and users will be notified.
                    </div>
                    <Field label="Select your campus">
						<CampusSelect 
							schoolsData={schoolsData}
							value={formData.schoolId && formData.campusName ? `${formData.schoolId}|${formData.campusName}` : ""}
							onChange={(val) => {
								if (val) {
									const [sId, cName] = val.split('|');
                                	setFormData({ ...formData, schoolId: sId, campusName: cName });
								} else {
									setFormData({ ...formData, schoolId: '', campusName: '' });
								}
                                setLocationSelected(!!val);
							}}
						/>
                    </Field>
                </div>
            )}
		</div>
	);

	return (
		<div className='h-screen overflow-hidden bg-transparent flex relative'>
			{/* Decorative ambient glow */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none' />

			<DesktopBrandPanel />
			<form action='' className='md:w-3/5 w-full h-full flex flex-col relative z-10'>
				<div className='flex-1 flex flex-col overflow-hidden glass-heavy'>
					{/* Progress header */}
					<header className='flex-none py-5 px-6 border-b border-white/40'>
						<div className='flex items-center justify-between gap-3 mb-3'>
							<div className=''>
								<div className='flex items-center gap-2'>
									{step > 0 ? (
										<button
											className='flex items-center justify-center w-[38px] h-[38px] rounded-[11px] border border-line bg-white cursor-pointer'
											onClick={back}
											aria-label='Back'
										>
											<Icon
												name='chevronLeft'
												size={20}
											/>
										</button>
									) : (
										<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-sm md:hidden">
											<BrandMark size={24} color="#fff" />
										</div>
									)}
									<span className='font-black text-[22px] tracking-tight text-ink md:hidden'>
										Camproxi
									</span>
								</div>

								<p className='text-center capitalize text-sm text-muted mt-3 font-semibold'>
									Already have an account?
									<button
										onClick={() => navigate('/signin')}
										className='text-primary capitalize font-extrabold cursor-pointer bg-none border-none p-0'
									>
										sign in
									</button>
								</p>
							</div>
							<span className='ml-auto text-[13px] font-bold text-faint'>
								{step + 1} / {total}
							</span>
						</div>
						<div className='flex sm:flex-col sm:gap-1.5'>
							{Array.from({ length: total }).map((_, i) => (
								<div
									key={i}
									className='flex-1 h-[5px] rounded-full transition-colors duration-200'
									style={{
										background:
											i <= step ? '#0d7a72' : '#e7edec',
									}}
								/>
							))}
						</div>
					</header>

					<div className='flex-1 overflow-y-auto'>
						<div className='p-6 md:p-10 pb-5 max-w-[800px] mx-auto w-full'>
							{step === 0 && TypeStep}
							{step === 1 && DetailsStep}
							{step === 2 && VerifyStep}
						</div>
					</div>

					<div className='flex-none mt-auto px-6 py-5 border-t border-white/40 bg-white/30 backdrop-blur-md'>
						<button
							className='w-full max-w-[800px] mx-auto flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-[16px] rounded-xl disabled:opacity-50 cursor-pointer hover:shadow-glow transition-all duration-300 border-none group'
							disabled={!canNext}
							onClick={(e) => {
								step === 1
									? validateForm(e)
									: step !== 1
										? next(e)
										: e.preventDefault();
							}}
						>
							{step < total - 1
								? 'Continue'
								: locationVerified
									? 'Submit & finish'
									: 'Complete Location Verify'}
							<span className="transform group-hover:translate-x-1 transition-transform">
								<Icon name='arrowRight' size={18} color='#fff' />
							</span>
						</button>
					</div>
				</div>
				<Toast msg={toast} icon={'x'} danger={true} />
				<Loading show={isLoading} msg={'Creating Account'} />
			</form>
		</div>
	);
}
