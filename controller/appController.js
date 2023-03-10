import UserModel from '../model/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator';

/**Middleware for verigy username */

export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == 'GET' ? req.query : req.body;

        //check user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).json({ error: "Can't find User!" })
        next();
    } catch (error) {
        res.status(404).json({ error: "Authentication Failed!" })
    }
}

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
        const user = await UserModel.create({
            username,
            password: hashedPassword,
            email,
            profile: profile || ""
        })

        res.status(201).json({ msg: "success", data: user })
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

export async function getUser(req, res) {
    const { username } = req.params;

    try {
        //Check username
        const user = await UserModel.findOne({ _id: username });
        if (!user) {
            return res.status(402).json({ msg: "Please enter a valid username." });
        }
        //remove password and convert unwanted data and send only required data
        const { password, ...restData } = await Object.assign({}, user.toJSON());
        res.status(200).json({ msg: "Success", data: restData })


    } catch (error) {
        res.status(500).json({ msg: "No user found!" })
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
/*
export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        //we set req.user in the auth middleware
        const { userId } = req.user;
        console.log(req.user, req.body,id)

        if (userId) {
            const body = req.body;

            const updatedUser = await UserModel.findByIdAndUpdate({ _id: userId }, body);

            if (!updatedUser) {
                res.status(500).json({ msg: "No user Found..." })
            }

            res.status(200).json({ msg: "User updated successfully" })
        }
    } catch (error) {
        res.status(500).json({ msg: "No user Found..." })
    }
}
*/
export async function updateUser(req, res) {
    try {

        // const id = req.query.id;
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // update the data
            const result = await UserModel.updateOne({ _id: userId }, body)
            if (result) {
                res.status(200).send(Object.assign({}, result.toJSON()))
            }

        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

    res.status(201).json({ code: req.app.locals.OTP })
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    //OTP verification is for resetting passwords
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;//set otp to null again
        req.app.locals.resetSession = true;//enter resetPassword stage
        return res.status(201).send({ msg: 'Verififcation Success!' })
    } else {
        return res.status(400).json({ error: "Invalid OTP!" })
    }
}
// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;//only allow to reset once
        return res.status(200).json({ msg: "Access Granted!" })
    } else {
        return res.status(404).json({ msg: "Access Denied!" })
    }

}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    const { username, password } = req.body;
    if (!req.app.locals.resetSession) return res.status(404).json({ msg: "Session Expired!" })
    try {
        await UserModel.findOne({ username })
            .then(user => {
                bcrypt.hash(password, 12)
                    .then(async hashedPassword => {
                        const updated = await UserModel.updateOne({ username: user.username }, { password: hashedPassword })

                        if (updated) {
                            req.app.locals.resetSession = false;
                            return res.status(200).json({ msg: "success updated" })
                        }

                    })
                    .catch(err => {
                        return res.status(500).json({ message: "Error!" })
                    })
            })
            .catch(err => {
                return res.status(404).json({ message: err.message });
            })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
