import cloudinary from 'cloudinary';

export const rollbackCloudinaryUpload = async (folderPath) => {
	if (!folderPath) return;

	try {
		// 1. Delete all resources in that folder
		await cloudinary.v2.api.delete_resources_by_prefix(folderPath);

		// 2. Delete the empty folder
		await cloudinary.api.delete_folder(folderPath);

		console.log(
			`Successfully rolled back Cloudinary folder: ${folderPath}`,
		);
	} catch (error) {
		console.error(
			`Cloudinary Rollback Failed for ${folderPath}:`,
			error.message,
		);
	}
};

export const rollbackCloudinaryUploadImage = async (item) => {
	if (!item) return;
	try {
		await cloudinary.v2.api.delete_resources(item, {
			resource_type: 'image',
			invalidate: true, // 👈 Important: Clears the CDN cache
		});
		console.log(`Successfully rolled back Cloudinary file: ${item}`);
	} catch (error) {
		console.error(`Cloudinary Rollback Failed for ${item}:`, error.message);
	}
};
