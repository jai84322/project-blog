const blogModel = require('../models/blogModel');
const authorModel = require('../models/authorModel');

const createBlog = async function (req, res) {

    try {
        let data = req.body;
        let { title, body, authorId, category } = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please request data to be created" })
        }
        if (!title) {
            return res.status(400).send({ status: false, msg: "Please enter title" })
        }
        if (!body) {
            return res.status(400).send({ status: false, msg: "Please enter body" })
        }
        if (!authorId) {
            return res.status(400).send({ status: false, msg: "Please enter authorId" })
        }
        if (authorId.length !== 24) {
            return res.status(400).send({ status: false, msg: "Please enter the valid authorId" })
        }
        if (!category) {
            return res.status(400).send({ status: false, msg: "Please enter category" })
        }
        let validAuthor = await authorModel.findById(authorId)
        if (!validAuthor) {
            return res.status(400).send({ status: false, msg: "Please enter the valid authorId" })
        }

        let createdBlog = await blogModel.create(data)
        res.status(201).send({ status: true, msg: createdBlog })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}

const getBlogs = async function (req, res) {
    try {
        let data = req.query
        let blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, data] })

        if (!blog[0]) {
            return res.status(404).send({ status: false, msg: "no document found" })
        }

        return res.status(200).send({ status: true, data: blog })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const updateBlogs = async function (req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId
        console.log(blogId)
        let updatedData = await blogModel.findOneAndUpdate(
            { _id: blogId },
            data,
            { new: true }
        )
        res.status(200).send({ status: true, data: updatedData })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



const deleteBlogByPathParam = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "please enter blogId" })
        }

        if (blogId.length !== 24) {
            return res.status(400).send({ status: false, msg: "please enter valid authorId with length 24" })
        }

        let checkBlog = await blogModel.findById(blogId)
        console.log(checkBlog);

        if (!checkBlog) {
            return res.status(404).send({ status: false, msg: "document not found" })
        }

        if (checkBlog.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "this document is already deleted" })
        }

        let deletedBlog = await blogModel.updateOne({ _id: blogId, isDeleted: false }, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, data: deletedBlog })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


const deleteBlogsByQuery = async function (req, res) {

    try {
        let data = req.query

        let deleteData = await blogModel.updateMany(
            { isDeleted: false, data },
            { isDeleted: true },
            { new: true }
        )
        res.status(200).send({ status: true, msg: deleteData })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



module.exports.deleteBlogByPathParam = deleteBlogByPathParam
module.exports.deleteBlogsByQuery = deleteBlogsByQuery
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;