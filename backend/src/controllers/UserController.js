const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
//comment
module.exports = {
    async createUser(req,res){
        try{
            //console.log(req.body)
            const {email, firstName, lastName, password} = req.body;
            const existentUser = await User.findOne({email});

            if(!existentUser){
				//console.log("ceating user")
                const hashedPassword = await bcrypt.hash(password,10);
                const userResponse = await User.create({
                        email,
                        firstName,
                        lastName,
                        password:hashedPassword
                });

                return jwt.sign({ user: userResponse }, 'secret', (err, token) => {
                    //console.log(err, token)
					return res.json({
						user: token,
						user_id: userResponse._id
					})
				})
			} else {
				return res.status(400).json({
					message:'email already exist! would you like to login instead? ',
				})
			}
		} catch (err) {
			throw Error(`Error while Registering new user :  ${err}`)
		}
	},

	async getUserById(req, res) {
		const { userId } = req.params

		try {
			const user = await User.findById(userId)
			return res.json(user)
		} catch (error) {
			return res.status(400).json({
				message:'User ID does not exist, would you like to register instead?',
			})
		}
	}
}