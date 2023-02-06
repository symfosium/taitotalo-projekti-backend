import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
   try {
      //Crypting password
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
 
     const doc = new UserModel({
       email: req.body.email,
       fullName: req.body.fullName,
       avatarUrl: req.body.avatarUrl,
       passwordHash: hash,
     });


    const user = await doc.save();

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

export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
         return res.status(404).json({
            message: 'Käyttäjää ei löydetty',
         })
      }

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
      const user = await UserModel.findById(req.userId);

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