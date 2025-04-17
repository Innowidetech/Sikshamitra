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

const baseOpts = {
  overwrite: true,
  invalidate: true,
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
          
          const uploadOpts = {
            ...baseOpts,
            resource_type: isPdf ? 'raw' : 'auto',
            format: isPdf ? 'pdf' : null,
            transformation: isPdf ? [{
              flags: "attachment:false"
            }] : null
          };

          cloudinary.uploader.upload_stream(uploadOpts, (error, result) => {
            if (result && result.secure_url) {
              return resolve(result.secure_url);
            }
            return reject(new Error(error ? error.message : 'Upload failed'));
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
