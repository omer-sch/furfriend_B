import express from 'express';
const router = express.Router();
import multer from "multer";

const base = "https://193.106.55.173:4000/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext);
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), function(req, res) {
    console.log("router.post(/file: " + base + req.file.path);
    //make sure to send as url 
    res.status(200).send({ url: base + req.file.path });
});

export = router
