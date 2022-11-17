import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { jwtSecret } from "../config.js";

const router = express.Router();

// Login de l'utilisateur
router.post("/login", function (req, res, next) {
    User.findOne({ email: req.body.email }).exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.sendStatus(401);
        }
        bcrypt.compare(req.body.password, user.password, function (err, valid) {
            if (err) {
                return next(err);
            } else if (!valid) {
                return res.sendStatus(401);
            }
            // Generate a valid JWT which expires in 7 days.
            const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
            const payload = {
                sub: user._id.toString(),
                exp: exp,
                scope: user.role
            };

            jwt.sign(payload, jwtSecret, function (err, token) {
                if (err) { return next(err); }
                res.send({ token: token }); // Send the token to the client.
            });
        });
    })
});

export default router

export function authenticate(req, res, next) {
    // Ensure the header is present.
    const authorization = req.get("Authorization");
    if (!authorization) {
        return res.status(401).send("Authorization header is missing");
    }
    // Check that the header has the correct format.
    const match = authorization.match(/^Bearer (.+)$/);
    if (!match) {
        return res.status(401).send("Authorization header is not a bearer token");
    }
    // Extract and verify the JWT.
    const token = match[1];
    jwt.verify(token, jwtSecret, function (err, payload) {
        if (err) {
            return res.status(401).send("Your token is invalid or has expired");
        } else {
            req.currentUserId = payload.sub;

            // Obtain the list of permissions from the "scope" claim.
            const scope = payload.scope;
            // console.log(payload);
            req.currentUserPermissions = scope ? scope.split(" ") : [];
            // console.log(req.currentUserPermissions);

            next(); // Pass the ID of the authenticated user to the next middleware.
        }
    });
}

export function authorize(requiredPermission) {
    // Create an return an authorization middleware. The required permission
    // will be available in the returned function because it is a closure.
    return function authorizationMiddleware(req, res, next) {
        if (!req.currentUserPermissions) {
            // The user is not authenticated or has no permissions.
            // console.log(1);
            return res.sendStatus(403);
        }
        // console.log(req.currentUserPermissions);
        const authorized = req.currentUserPermissions.includes(requiredPermission);
        if (!authorized) {
            // console.log(2);
            // The user is authenticated but does not have the required permission.
            return res.sendStatus(403);
        }
        // The user is authorized.
        next();
    };
}