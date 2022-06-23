const blogModel = require('../models/blogModel');
const authorModel = require('../models/authorModel');

//  API - 2 || TO CREATE BLOGS

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
        if (body.length < 4) {
            return res.status(400).send({status: false, msg: "body length should be more than 4 characters"})
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
        res.status(201).send({ status: true, data: createdBlog })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

// API- 3 || TO GET ALL BLOGS 

const getBlogs = async function (req, res) {
    try {
        let data = req.query
        let blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, data] })

        if (!blog[0]) {
            return res.status(404).send({ status: false, msg: "no such document found" })
        }

        return res.status(200).send({ status: true, data: blog })
    } catch (err) {
       return res.status(500).send({ status: false, msg: err.message })
    }
}

// API- 4 || TO UPDATE BLOGS 

const updateBlogs = async function (req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId
        let {tags, subcategory} = req.body

        if(!blogId) {
            return res.status(400).send({status: false, msg : "please enter the blog Id"})
        }
        
        if(blogId.length !== 24) {
            return res.status(400).send({status: false, msg : "please enter valid length of blog Id (24)"}) 
        }

        let checkBlogId = await blogModel.findById(blogId)
        
        if (!checkBlogId) {
            return res.status(404).send({status: false, msg : "no such blog exists"}) 
        }

        let updatedData = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted : false },
             data,   //$push: { tags: tags, subcategory : subcategory}
            { new: true }
        )

        if (updatedData.isPublished === true) {
            updatedData.publishedAt = Date.now()
            return res.status(200).send({status:true, data: updatedData})
        }

        return res.status(200).send({ status: true, data: updatedData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// API- 5 || TO DELETE BLOGS WITH PATH PARAMETER

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

        if (!checkBlog) {
            return res.status(404).send({ status: false, msg: "document not found" })
        }

        if (checkBlog.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "this document is already deleted" })
        }

        let deletedBlog = await blogModel.updateOne({ _id: blogId, isDeleted: false }, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, data: deletedBlog })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// API- 6 || DELETE BLOGS WITH QUERY PARAMETERS 

const deleteBlogsByQuery = async function (req, res) {

    try {
        let data = req.query

        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg : "please enter a query"})
        }

        let deleteData = await blogModel.updateMany(
            { isDeleted: false, data },
            { isDeleted: true },
            { new: true }
        )

        if (!deleteData[0]) {
            return res.status(404).send({status: false, msg : "no document found"})
        }

        return res.status(200).send({ status: true, data: deleteData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlogByPathParam = deleteBlogByPathParam
module.exports.deleteBlogsByQuery = deleteBlogsByQuery