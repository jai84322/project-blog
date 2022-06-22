const authorModel = require('../models/authorModel')
const validator = require('email-validator')
const passwordValidator = require('password-validator');

// API- 1 || TO CREATE AUTHORS
 
const createAuthor = async function (req, res) {
    try {
        
        let data = req.body;
        let { fname, lname, title, email, password } = req.body
        let schema = new passwordValidator();
        schema.is().min(8).is().is().max(100).has().uppercase().has().lowercase().has().digits(2).has().not().spaces().is().not().oneOf(['Passw0rd', 'Password123','mypassword']);
        let checkPassword = schema.validate(password)
        
        
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

        let checkEmail = validator.validate(email)
        if(!checkEmail) {
            return res.status(400).send({status: false, msg : "please enter email in valid format "})
        }

        let uniqueEmail = await authorModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "This email already exists" })
        }
        

        if (!password) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        }

        if (checkPassword === false) {
            return res.status(400).send({status: false, msg:"password should have min 8 character + one Uppercase + one lowercase + min 2 digits + should not have any space + should not be one of these : Passw0rd, Password123,mypassword"})
        }


        let savedData = await authorModel.create(data)
        return res.status(201).send({ status: true, data: savedData })

    } catch (err) {
       return res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports.createAuthor = createAuthor