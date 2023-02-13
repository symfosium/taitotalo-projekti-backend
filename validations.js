import {body} from 'express-validator';

export const loginValidation = [
   body('email', 'Väärä sähköposti').isEmail(),
   body('password', 'Väärä salasana').isLength({min: 5}),
];

// Registration
export const registerValidation = [
   // Is there email, if not 'Väärä sähköposti'
   body('email', 'Väärä sähköposti').isEmail(),
   // If password's length min 5 symbols - Ok, if less express-validator get error
   body('password', 'Väärä salasana').isLength({min: 5}),
   // Name must be more than 3 symbols
   body('fullName', 'Laita nimi').isLength({min: 3}),
   // Optional, but if comes, check is it URL
   body('avatarUrl', 'Väärä linkki avatariin').optional().isURL(),
];

// Creating post
export const postCreateValidation = [
   body('title', 'Laita otsikko').isLength({min: 3}).isString(),
   body('text', 'Laita artikkelin teksti').isLength({min: 3}).isString(),
   body('tags', 'Väärä formaatti').optional().isString(),
   body('imageUrl', 'Väärä kuvalinkki').optional().isString(),
];