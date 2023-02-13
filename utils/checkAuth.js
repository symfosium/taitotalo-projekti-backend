import jwt from 'jsonwebtoken';

export default(req, res, next) => {
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

   if (token) {
      try {
         // Decoding token
         const decoded = jwt.verify(token, 'secret123');
         //Decoded token going to req
         req.userId = decoded._id;
         // If token decoded and it saved to req.userId, everything ok --> next function
         next();
      } catch(e) {
         return res.status(403).json({
            message: 'Ei ole pääsyä',
         })
      }
   } else {
     return res.status(403).json({
         message: 'Ei ole pääsyä',
      })
   }
}