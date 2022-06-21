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
        res.status(500).send({ status: false, error: err.message})
    }

}


module.exports.createBlog = createBlog;
