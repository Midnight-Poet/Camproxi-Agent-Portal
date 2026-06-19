// CategorySelector.jsx
const categories = [
	'Food & Drinks',
	'Electronics & Tech',
	'Study & Office',
	'Personal Care',
	'Fashion',
	'Appliances',
	'Entertainment',
	'Transport',
];

export default function CategorySelector({ value, onChange, className }) {
	return (
		<div className={`mt-2 ${className}`}>
			<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
				{categories.map((category) => (
					<button
						key={category}
						onClick={() => onChange(category)}
						className={`
              px-4 py-4 rounded-lg font- text-sm md:text-base
              transition-all duration-200 ease-in-out
              capitalize text-center cursor-pointer
              border font-urbanist
              
              ${
					value === category
						? 'bg-primary-50 text-primary-700 border-primary/40'
						: 'bg-gray- text-black border-gray-200 hover:border-primary hover:bg-gray-50'
				}
            `}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	);
}
