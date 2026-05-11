import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            error: error.message,
          });
        }

        return res.status(200).json({
          imageUrl: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(file.buffer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
