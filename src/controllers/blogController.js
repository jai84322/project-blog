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
            return res.status(400).send({ status: false, msg: "Please enter proper length of author Id (24)" })
        }
        
        let validAuthor = await authorModel.findById(authorId)
        if (!validAuthor) {
            return res.status(400).send({ status: false, msg: "Please enter the valid authorId" })
        }

        if (!category) {
            return res.status(400).send({ status: false, msg: "Please enter category" })
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
        let {title, body, authorId, category, isPublished, tags, subcategory} = req.body
        let blogId = req.params.blogId

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please enter the data in the request body" })
        }

        let updatedData = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted : false },
            { 
                title: title,
                body: body,
                category:category,
                isPublished: isPublished, 
                authorId: authorId,
                $push: { tags: tags, subcategory : subcategory}
                },  
            { new: true }
        ) 

        if (updatedData.isPublished === true) {
            updatedData.publishedAt = Date.now()
            await updatedData.save()
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

        // let checkBlog = await blogModel.findById(blogId)

        let deletedBlog = await blogModel.updateOne(
            { _id: blogId, isDeleted: false }, 
            {$set:  {isDeleted: true}, deletedAt : Date.now()}, 
            { new: true })
        return res.status(200).send({ status: true, data: deletedBlog })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// API- 6 || DELETE BLOGS WITH QUERY PARAMETERS 

const deleteBlogsByQuery = async function (req, res) {

    try {
        let {category, authorId, tags, subcategory, isPublished} = req.query

        let deleteData = await blogModel.updateMany({ 

            authorId : req.decodedToken.authorId, 
            isDeleted: false, $or: [{ authorId: authorId },
            { isPublished: isPublished },
            { tags: tags },
            { category: category },
            { subcategory: subcategory }] 
        }, 
        {$set:  {isDeleted: true}, deletedAt : Date.now()}, 
            { new: true })

        if (!deleteData[0]) {
            return res.status(404).send({status: false, msg : "document already deleted"})
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