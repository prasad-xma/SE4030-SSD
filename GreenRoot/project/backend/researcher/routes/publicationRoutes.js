const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const router = express.Router()

const {
    getPublications,
    getUserPublications,
    createPublication,
    deletePublication,
    downloadFile
} = require('../controller/publicationController')

const authenticateResearcher = require('../middleware/requireAuth');

//multer
const multer = require('multer');
const publicationUploadDir = path.join(__dirname, '..', 'private_uploads', 'publications');
const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdir(publicationUploadDir, { recursive: true }, (error) => {
            cb(error, publicationUploadDir);
        });
    },
    filename: (req, file, cb) => {
        cb(null, `${crypto.randomUUID()}.pdf`);
    }
});

const uploadMiddleware = multer({
    storage: uploadStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const hasPdfExtension = path.extname(file.originalname).toLowerCase() === '.pdf';
        const hasPdfMimeType = file.mimetype === 'application/pdf';

        if (!hasPdfExtension || !hasPdfMimeType) {
            const error = new Error('Only PDF files are allowed');
            error.code = 'INVALID_FILE_TYPE';
            return cb(error);
        }

        cb(null, true);
    }
});

const handlePublicationUpload = (req, res, next) => {
    uploadMiddleware.single('file')(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Publication file must be 10 MB or smaller' });
        }

        if (error.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }

        return res.status(400).json({ error: error.message || 'Invalid publication upload' });
    });
};

//Get all publications
router.get('/', getPublications)

//Get user publications
router.get('/my-publications', authenticateResearcher, getUserPublications)

//Create new publication
router.post('/', handlePublicationUpload, createPublication)

//Delete a publication
router.delete('/:id', deletePublication)

// Download original file
router.get('/download/:id', downloadFile);

module.exports = router