import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer, folder = "problem-banners") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result)
            }
        ).end(buffer)
    })
}