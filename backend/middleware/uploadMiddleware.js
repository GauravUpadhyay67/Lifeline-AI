const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Configure upload limits and filter
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images Only!'));
        }
    }
});

// Export a robust middleware function
const uploadProfilePic = (req, res, next) => {
    console.log("-> Entering uploadProfilePic middleware");
    const uploadSingle = upload.single('profilePic');

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error("Multer Error:", err);
            return res.status(400).json({ message: `Image Upload Error: ${err.message}` });
        } else if (err) {
            console.error("Unknown Upload Error:", err);
            return res.status(400).json({ message: err.message });
        }
        console.log("-> Upload successful, calling next()");
        next();
    });
};

module.exports = { uploadProfilePic };
