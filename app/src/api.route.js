const {Router} = require('express');
const multer = require('multer');
const upload = multer({dest: '../files/'}).single('file');
//const {createUpload, getUpload, getUploads, deleteUpload} = require('./postgres');
const {createUpload, getUpload, getUploads, deleteUpload} = require('./in-memory');

const router = Router();

router.get('/', (req, res) => {
    res.json('Hello World!');
});

// upload functionality for images. Use multer to handle the upload.
router.post('/uploads', upload, async (req, res) => {
    const {filename} = req.body
    const {mimetype, size} = req.file;
    const id = await createUpload(mimetype, size, filename);
    res.json({id});
});

router.get('/uploads', async (req, res) => {
    const uploads = await getUploads();
    res.json(uploads);
});

router.get('/uploads/:id', async (req, res) => {
    const upload = await getUpload(req.params.id);
    res.json(upload);
});

router.delete('/uploads/:id', async (req, res) => {
    await deleteUpload(req.params.id);
    res.json({message: 'ok'});
});

router.get('/file/:id', async (req, res) => {
    const upload = await getUpload(req.params.id);
    res.download(`../files/${upload.id}`);
});



module.exports = router;