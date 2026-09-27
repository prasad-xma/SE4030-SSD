const publication = require('../model/publications')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const publicationStorageRoot = path.join(__dirname, '..', 'private_uploads', 'publications')

const removeUploadedFile = async (filePath) => {
    if (!filePath) {
        return
    }

    try {
        await fs.promises.unlink(filePath)
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Unable to remove invalid publication upload:', error.message)
        }
    }
}

const hasPdfSignature = async (filePath) => {
    const signature = Buffer.alloc(5)
    const fileHandle = await fs.promises.open(filePath, 'r')

    try {
        const { bytesRead } = await fileHandle.read(signature, 0, signature.length, 0)
        return bytesRead === signature.length && signature.toString('ascii') === '%PDF-'
    } finally {
        await fileHandle.close()
    }
}

//Get all publications
const getPublications = async (req, res) => {

    const Pub = await publication.find({})

    res.status(200).json(Pub)
}

//Get publications created by the authenticated user
const getUserPublications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userPubs = await publication.find({ user_id: req.user.userId }); // Fetch publications for the authenticated user
        res.status(200).json(userPubs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//create new publication
const createPublication = async (req, res) => {
    let newPath = null
    let uploadedFilePath = null

    if (req.file) {
        uploadedFilePath = req.file.path

        try {
            if (!(await hasPdfSignature(uploadedFilePath))) {
                await removeUploadedFile(uploadedFilePath)
                return res.status(400).json({ error: 'Uploaded file is not a valid PDF' })
            }
        } catch (error) {
            await removeUploadedFile(uploadedFilePath)
            return res.status(400).json({ error: 'Unable to validate uploaded PDF' })
        }

        newPath = path.join('private_uploads', 'publications', req.file.filename)
    }

    const {title, author, user_id } = req.body

    try {
        const createPub = await publication.create({title, author, user_id, file: newPath})
        res.status(200).json(createPub)
    } catch (error) {
        await removeUploadedFile(uploadedFilePath)
        res.status(400).json({error: error.message})
    }
}

//Delete publication
const deletePublication = async (req, res) => {

    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){  
        return res.status(404).json({error: "no such a id"})
    }

    const dPub = await publication.findByIdAndDelete({_id: id})

    if(!dPub) {
        return res.status(404).json({error: "No such file"})
    }

    res.status(200).json(dPub)
}

// Download original file
const downloadFile = async (req, res) => {
    try {
        const pub = await publication.findById(req.params.id);
        if (!pub || !pub.file) {
            return res.status(404).json({ error: "File not found" });
        }

        const filePath = path.join(__dirname, '..', pub.file);

        if (!filePath.startsWith(`${publicationStorageRoot}${path.sep}`)) {
            return res.status(400).json({ error: "Invalid publication file path" });
        }

        res.download(filePath); // Browser will prompt download
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getPublications,
    getUserPublications,
    createPublication,
    deletePublication,
    downloadFile
}