require('dotenv').config();
const cloudinary = require("cloudinary").v2;

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
  access_mode: 'public',
};

exports.uploadImage = async (files) => {
  try {
    if (!Array.isArray(files)) {
      files = [files];
    }
    const uploadedFiles = await Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const isPdf = file.mimetype === 'application/pdf';
          const uploadOptions = {...opts, resource_type: isPdf ? "raw" : "auto" };
          cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (result && result.secure_url) {
              return resolve(result.secure_url);
            }
            return reject(new Error(error.message));
          })
            .end(file.buffer);
        })
      )
    );
    return uploadedFiles;
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.deleteImage = async (imageUrls) => {
  try {
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

    const deletePromises = urls.map(url => {
      const segments = url.split('/');
      const resourceTypeIndex = segments.findIndex(seg => seg === 'upload') - 1;
      const resourceType = segments[resourceTypeIndex];

      const publicIdWithExtension = segments[segments.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];

      return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType || 'image',
      });
    });

    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete image(s): ${error.message}`);
  }
};

