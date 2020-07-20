const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')

module.exports = {
	approval(req, res) {
		jwt.verify(req.token, 'secret', async (err, authData) => {
			if (err) {
				res.sendStatus(401)
			} else {
				const { comment_id } = req.params
				
				try {
					const comment = await Comment.findById(comment_id);

					if (comment ) {
						comment.approved = true
						await comment.save()
					
						return res.json(comment)
					} 

				} catch (error) {
					return res.status(400).json(error)
				}
			}
		})
	}
}