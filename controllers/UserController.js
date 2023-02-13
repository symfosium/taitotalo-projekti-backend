import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
   try {
      //Crypting password
     const password = req.body.password;
     // Creating salt(algorhytm) for password
     const salt = await bcrypt.genSalt(10);
     // in hash variable crypted password
     const hash = await bcrypt.hash(password, salt);
 
     // Creating new User
     const doc = new UserModel({
       email: req.body.email,
       fullName: req.body.fullName,
       avatarUrl: req.body.avatarUrl,
       passwordHash: hash,
     });

     // Saving User to DB
    const user = await doc.save();
   
    // Creating jwt token, inside of jwt info - user's id
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

      const {passwordHash, ...userData} = user._doc; 
    
      res.json({
         ...userData,
         token,
      })
   } catch(err) {
      // Error for dev
      console.log(err)
      // Message for user
      res.status(500).json({
         message: 'Rekisteröinti ei onnistunut'
      })
   }
};

// Searching for user in DB
export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
         return res.status(404).json({
            message: 'Käyttäjää ei löydetty',
         })
      }

      // Checking password's identity
      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPass) {
         return res.status(400).json({
            message: 'Väärä käyttäjätunnus tai salasana',
         })
      }

      
      const token = jwt.sign({
         //_id: user._doc._id
         _id: user._id
      }, 'secret123', {
         expiresIn: '30d',
      });

      const { passwordHash, ...userData } = user._doc;
    
      res.json({
         ...userData,
         token,
      })

   } catch (err) {
            // Error for dev
            console.log(err)
            // Message for user
            res.status(500).json({
               message: 'Kirjautuminen ei onnistunut'
            })
   }
};

export const getMe = async (req, res) => {
   try {
      // Find user in db by id 
      const user = await UserModel.findById(req.userId);

      // If user not found
      if(!user) {
         return res.status(404).json({
            message: 'Käyttäjää ei löydetty',
         })
      }

      const {passwordHash, ...userData} = user._doc; 
    
      res.json(userData);
   } catch(err) {
            // Error for dev
            console.log(err)
            // Message for user
            res.status(500).json({
               message: 'Ei ole pääsyä',
            })
   }
};