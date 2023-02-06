import {body} from 'express-validator';

export const loginValidation = [
   body('email', 'Väärä sähköposti').isEmail(),
   body('password', 'Väärä salasana').isLength({min: 5}),
];

export const registerValidation = [
   body('email', 'Väärä sähköposti').isEmail(),
   body('password', 'Väärä salasana').isLength({min: 5}),
   body('fullName', 'Laita nimi').isLength({min: 3}),
   body('avatarUrl', 'Väärä linkki avatariin').optional().isURL(),
];

export const postCreateValidation = [
   body('title', 'Laita otsikko').isLength({min: 3}).isString(),
   body('text', 'Laita artikkelin teksti').isLength({min: 3}).isString(),
   body('tags', 'Väärä formaatti').optional().isString(),
   body('imageUrl', 'Väärä kuvalinkki').optional().isString(),
];