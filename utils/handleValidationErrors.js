import { validationResult } from 'express-validator';

export default (req, res, next) => {
  // If everythink ok, 
  const errors = validationResult(req);
  // If erros in validation
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
