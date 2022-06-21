const authorModel = require('../models/authorModel')


const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let { fname, lname, title, email, password } = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please enter data in the request" })

        }


        if (!fname) {
            return res.status(400).send({ status: false, msg: "fname is missing" })
        }

        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is missing" })
        }

        if (!title) {
            return res.status(400).send({ status: false, msg: "title is missing" })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "email is missing" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        }

        let uniqueEmail = await authorModel.findOne({ email: email })

        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "This email is already exist" })

        }



        let savedData = await authorModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }


}

module.exports.createAuthor = createAuthor