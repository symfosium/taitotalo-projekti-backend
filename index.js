import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import {registerValidation, loginValidation, postCreateValidation} from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController, CommentController } from './controllers/index.js';

import User from './models/User.js';

mongoose
.connect(process.env.MONGODB_URI)
// if connect to db ok 
.then(() => console.log('DB ok'))
// if error
.catch((err) => console.log('DB error', err))

const app = express();

//Creating storage
const storage = multer.diskStorage({
   destination: (_, __, cb) => {
     if (!fs.existsSync('uploads')) {
       fs.mkdirSync('uploads');
     }
     cb(null, 'uploads');
   },
   filename: (_, file, cb) => {
     cb(null, file.originalname);
   },
 });

const upload = multer({storage});

// reading json files in express
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Route to authorization
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
// Route to registration
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
// Route to getting me
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
     url: `/uploads/${req.file.originalname}`,
   });
 });

 app.get('/tags', PostController.getLastTags);

// Route to posts
 app.get('/posts', PostController.getAll);
 app.get('/posts/tags', PostController.getLastTags);
 app.get('/posts/:id', PostController.getOne);
 app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
 app.post('/posts/:id/comment', checkAuth, CommentController.addComment);
 app.get('/posts/:id/comments', CommentController.getAll);
 app.delete('/posts/:id', checkAuth, PostController.remove);
 app.patch(
   '/posts/:id',
   checkAuth,
   postCreateValidation,
   handleValidationErrors,
   PostController.update,
 );



// If server works - Server Ok, if not - error
app.listen(process.env.PORT || 4444, (err) => {
   if(err) {
      return console.log(err);
   }
   console.log('Server OK!');
});