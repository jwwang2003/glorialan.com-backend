import { body } from 'express-validator';

////////////////////////////////////////////////////////////////////////////////
//////////                      Authentication                        //////////
////////////////////////////////////////////////////////////////////////////////

export const authUserChain = () => [
  body().isObject(),
  body('username').isString(),
  body('password').isString().isLength({ min: 8 }),
];

////////////////////////////////////////////////////////////////////////////////
//////////                        Validation                          //////////
////////////////////////////////////////////////////////////////////////////////

export const createSuperuserChain = () => [
  body('superkey').isString(),
  ...createUserChain()
];

export const createUserChain = () => [
  body().isObject(),
  body('name').isString(),
  body('username').isString(),
  body('password').isString().isLength({ min: 8 }),

  // optional fields
  body('description').optional().isString(),
  body('role').optional().isArray(),
  body('special_privledges').optional().isArray()
];
