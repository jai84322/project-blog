const jwt = require('jsonwebtoken')

const authentication = async function (req,res,next) {
  try {
    let token = req.headers["x-api-key" || "X-Api-Key"]
    
    if (!token) {
        return res.status(400).send({status: false, msg: "please send the token"})
    }

    let decodedToken = jwt.verify(token, "WaJaiDhi-radon")

    // if (!decodedToken) {
    //     return res.status(400).send({status: false, msg: "token is invalid"})
    // }

        next ()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
    }

module.exports.authentication = authentication