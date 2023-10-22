const { User } = require('../db/credentials');
const { version, validate } = require('uuid');

function uuidValidate(uuid) {
    return validate(uuid) && version(uuid) === 1;
}


// Decode Header Middleware
const decodeHeader = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new console.error("No token provided.");
    }
    const token = authHeader.split(' ')[1];
    console.log("the uuid is: " +token);
    try {
        if (!uuidValidate(token)) {
            return res.json({ message: "The token is expired or invalid, please login again." });
        }
        else {
            const user = await User.findOne({ id: token });
            if (!user) {
                return res.status(400).send("User not found");
            }
            req.user = user;
            next();
        }
    } catch(err) {
        res.send(err);
    }
}

module.exports = decodeHeader;