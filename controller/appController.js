import UserModel from '../model/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, email, profile } = req.body;

        //Check for existing user using email and username
        const existingUser = await UserModel.findOne({ username })
        if (existingUser) {
            return res.status(401).json({ message: "Username already taken!" })
        }
        const existingEmail = await UserModel.findOne({ email })
        if (existingEmail) {
            return res.status(401).json({ message: "Email already taken!" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        await UserModel.create({
            username,
            password: hashedPassword,
            email,
            profile: profile || ""
        })

        res.status(201).json({ msg: "success" })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    try {
        const { username, password } = req.body;

        //Check username
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(402).json({ msg: "Please enter a valid username and password." });
        }

        //if correct username then check password
        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            return res.status(402).json({ msg: "Please enter a valid username and password." });
        }

        //assign jwt token
        const jwtToken = await jwt.sign({ username, userId: user._id }, "32CharAcTeRSLoNGGGG", { expiresIn: '24h' })

        //send Token as response
        res.status(201).json({
            msg: "Login Success",
            username,
            token: jwtToken
        })

    } catch (error) {
        res.status(500).json({
            msg: "Login Failed",
            error
        })
    }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    res.json("Update User Route")
}


export async function getUser(req, res) {
    res.json("Get User Route")
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    res.json("generateOTP Route")
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    res.json("VerifyOTP Route")
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    res.json("ResetSession Route")
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    res.json("ResetPassword Route")
}
