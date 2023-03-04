import { Router } from "express";

const router = Router();

/**POST Methods */
router.route('/register').post((req, res) => {
    res.status(201).json("Register Route")
})
router.route('/registerMail').post();
router.route('/authenticate').post();
router.route('/login').post();


/**GET Methods */
router.route('users/:username').get();
router.route('/generateOTP').get();
router.route('/verifyOTP').get();
router.route('/createResetSession').get();

/** PUT Methods */

router.route('/updateUser').put();
router.route('/resetPassword').put();

export default router;