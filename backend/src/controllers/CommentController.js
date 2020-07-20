const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

module.exports = {
    create(req,res){
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if(err){
                res.sendStatus(401);
            }else{
				const user_id = authData.user._id
				const { eventId } = req.params
                //const { date , commentary } = req.body;
        
                const comment = await Comment.create({
                    user: user_id,
                    event: eventId
                   // commentary,
                   // date
                })
        
                await comment
                    .populate('event')
                    .populate('user','-password')//remove the password 
                    .execPopulate()
        
				//console.log(registration.event.user)
                comment.owner = comment.event.user;
                comment.eventTitle = comment.event.title;
                comment.eventDate = comment.event.date;
                comment.userEmail = comment.user.email;
                comment.save()

                //console.log(comment)

                const ownerSocket = req.connectUsers[comment.event.user]

                if (ownerSocket) {
                    req.io.to(ownerSocket).emit('comment_request', comment)
                }

                return res.json(comment);
        
            }
        });
    },
    async getComment( req , res) {

        const { comment_id } = req.params;

        try {

            const comment = await Comment.findById(comment_id)
            await comment
                .populate('event')
                .populate('user','-password')//remove the password 
                .execPopulate();

            return res.json(comment)

        } catch (error) {
            
            return res.status(400).json({message:"Comment Not Found"})

        }
    },
    getMyComments(req,res){
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if(err){
                res.sendStatus(401);
            }else{
            
                try {
                    const commentArr = await Comment.find({"owner": authData.user._id})
                    if(commentArr){
                        return res.json(commentArr)
                    }
                } catch (error) {
                    console.log(error)   
                }

            }
        })
    }
}