const express = require('express');
const multer = require('multer');
const verifyToken = require('./config/verifyToken');
//CONTROL AND FILES
const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const DashboardController = require('./controllers/DashboardController')
const CommentController = require('./controllers/CommentController')
const LoginController = require('./controllers/LoginController')
//const RegistrationController = require('./controllers/RegistrationController')
const uploadConfig = require('./config/upload')

//INSTANCES
const routes = express.Router();
const upload = multer(uploadConfig)

routes.get('/status', (req,res)=>{
    res.send({status:200});
})


//TODO: get a comment by ID CommentController
//TODO: Comment ApprovalController 
//TODO: Comment RejectionController 

//COMMENT
routes.post('/comment/:eventId', verifyToken, CommentController.create)
routes.get('/comment/:comment_id',CommentController.getComment)

//LOGIN
routes.post('/login',LoginController.store)

//DASHBOARD
routes.get('/dashboard/:category', verifyToken, DashboardController.getAllEvents)
routes.get('/dashboard', verifyToken, DashboardController.getAllEvents)
routes.get('/user/events', verifyToken, DashboardController.getEventsByUserId)
routes.get('/event/:eventId', verifyToken, DashboardController.getEventById)
//EVENT
routes.post('/event',  verifyToken, upload.single("thumbnail"),EventController.createEvent)
routes.delete('/event/:eventId', verifyToken, EventController.delete)

//USER
routes.post('/user/register', UserController.createUser)
routes.get('/user/:userId', UserController.getUserById)

module.exports = routes;
