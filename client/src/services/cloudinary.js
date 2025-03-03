import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dm5suokyk';
const CLOUDINARY_UPLOAD_PRESET = 'user-pfp';


/**
 * Uploads an image to Cloudinary.
 *
 * @param {File} file - The image file to be uploaded.
 * @param {string} id - The public ID to assign to the uploaded image.
 * @returns The result of the upload operation.
 */
export const uploadImage = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log("Uploading image to Cloudinary: ", file, " at ", url);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(url, formData);
        console.log("Cloudinary upload response: ", response);
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error: ", error);
    }
};
