const { cloudinary } = require("../config/cloudinary.config");

exports.uploadToCloudinary = async (
  fileBuffer,
  folder = "FlowDesk",
  resourceType = "image",
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};
