import { ROLES } from '@/auth';
import { ERROR } from '@/error';
import { createUser, findUser } from '@/postgres';
import { getSuperKey } from '@/superKey';
import { compareHash } from '@/utils/hash';

import { authUserChain, createSuperuserChain, createUserChain } from '@/validators';
import type { User } from '@prisma/client';
import express from 'express';
import { validationResult } from 'express-validator';

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("Hello, from auth route! What... are you doing here...");
  return
});

app.get(
  "/test_auth",
  async (req: express.Request, res: express.Response) => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ msg: "Not authorized." });
      return;
    }
    const user: User = req.session.user;
    res.status(200).json({ msg: `Welcome ${user.name} (${user.username})~ You are a ${ROLES[user.role[0]].toString()}.` });
    return;
  }
);

/**
 * Methods:
 * 1. Aquire authentication (login)
 * 2. De-authenticaion (logout)
 * 3. Registeration/superuser (signup)
 */

app.get(
  "/login",
  authUserChain(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Extract the necessary information & query our database
    const { username, password } = req.body;
    const user = await findUser(username);

    if (!user) {
      // 404 for not found.
      res.status(404).json({ msg: "User not found." });
      return;
    }

    const result = await compareHash(password, user.password!);

    if (result) {
      if (req.session) {
        // No need to strip the user because the actual content is stored
        // on the server, not the client
        // req.session.user = stripUser(user);
        req.session.user = user;
      } else {
        res.status(500).json({ msg: "Something went wrong." });
        return;
      }
      res.status(200).json({
        msg: "OK."
      });
      return;
    } else {
      if (req.session)
        req.session.destroy(err => {
          if (err) {
            console.error('Error destroying session:', err);
            // You might want to handle the error in a different way
          }

          // Check for a `redirect` query parameter and redirect accordingly
          const redirectUrl = req.query.redirect || '/';
          res.redirect(String(redirectUrl));
        });
      res.status(401).json({
        err_code: ERROR.WRONG_PASS,
        msg: "Invalid credentials."
      });
      return;
    }
  }
);

app.get(
  "/logout",
  async (req: express.Request, res: express.Response) => {
    if (!req.session) {
      const redirectUrl = req.query.redirect || '/';
      res.redirect(String(redirectUrl));
      return;
    }
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        // You might want to handle the error in a different way
      }

      // Check for a `redirect` query parameter and redirect accordingly
      const redirectUrl = req.query.redirect || '/';
      res.redirect(String(redirectUrl));
      return;
    });
  }

)

/**
 * Only admins can register new users
 */
app.get(
  "/register",
  createUserChain(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      username,
      password
    } = req.body;

    const [result, msg] = await createUser(name, username, password);

    if (result)
      res.status(200).json(msg);
    else {
      res.status(400).json(msg);
    }
  }
);

/**
 * This is the superuser method
 * This method is meant to be used on the backend to add superusers/admins
 */
app.get(
  "/createsuper",
  createSuperuserChain(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        err_code: ERROR.INVALID_FIELDS,
        errors: errors.array()
      });
      return;
    }

    // check super key
    const curSuperKey = getSuperKey();

    const {
      superkey,
      name,
      username,
      password,
      description,
      role,
      special_privledges
    } = req.body;

    if (!superkey || superkey != curSuperKey) {
      res.status(401).json({
        err_code: ERROR.INVALID_SUPERKEY,
        msg: "Superkey invalid or missing!"
      });
      return;
    }

    const [result, msg] = await createUser(
      name,
      username,
      password,
      !description ? "Superuser created by /createsuper" : description,
      role || [ROLES.ADMIN],
      special_privledges
    );

    if (result)
      res.status(200).json(msg);
    else
      res.status(400).json(msg);

    return;
  }
);

export default app;