const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')
const authorController = require('../controllers/authorController')

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "please send the token" })
        }

        let decodedToken = jwt.verify(token, "WaJaiDhi-radon", function (err, token) {
            if (err) {
                return undefined
            } else {
                return token
            }
        })

        if (decodedToken == undefined) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        }

        req["decodedToken"] = decodedToken
        next()

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



const authorization = async function (req, res, next) {
    try {
        let validAuthorId = req.decodedToken.authorId
        let id = req.params.blogId

        if (id.length != 24) {
            return res.status(400).send({ status: false, msg: "Please enter proper length of author Id (24)" })
        }

        let checkBlog = await blogModel.findById(id)

        if (!checkBlog) {
            return res.status(404).send({ status: false, msg: "no such blog exists" })
        }

        if (checkBlog.authorId != validAuthorId) {
            return res.status(403).send({ status: false, msg: "Author is not authorized" })
        }

        if (checkBlog.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "this document is have been deleted / (isDeleted : true)" })
        }

        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const authorizationForQuery = async function (req, res, next) {

    let validAuthor = req.decodedToken.authorId

    if (Object.keys(req.query).length == 0) {
        return res.status(400).send({status: false, msg : "please enter a query"})
    }

    let savedData = await blogModel.find(req.query)

    if (!savedData[0]) {
        return res.status(400).send({status: false, msg: "no blog exists with the given query"})
    }

    let arr = []
    for (let i = 0; i < savedData.length; i++) {
        if (savedData[i].authorId == validAuthor) {  
            arr.push(savedData[i].authorId)
        } 
    }
    
    if (arr[0] != validAuthor) {
        return res.status(403).send({status: false, msg:"you are not authorized"})
    } else {
    next()
}

}


module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authorizationForQuery = authorizationForQuery
