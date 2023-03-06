import jwt from 'jsonwebtoken'
/**AUTH MIDDLEWARE */

export default async function (req, res, next) {
    try {
        //access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        //retrieve the user details to validate request
        const decodedToken = await jwt.verify(token, "32CharAcTeRSLoNGGGG")

        req.user = decodedToken;
        // res.json(decodedToken);
        // console.log(req.user)
        next();

    } catch (error) {
        res.status(401).json({ err: error })
    }
}

export function localVariables(req, res, next) {
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next();
}