import User from "../models/user.js"
import jwt from "jsonwebtoken"
import Group from "../models/group.js";

export const cleanUpDatabase = async function () {
	await Promise.all([
		User.deleteMany(),
		Group.deleteMany()
	]);
};

export function generateValidJwt(user) {
	// Generate a valid JWT which expires in 7 days.
	const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;

	const claims = {
		sub: user._id.toString(),
		exp: exp,
		scope: user.role
	};
	return new Promise((resolve, reject) => {
		jwt.sign(claims, process.env.JWT_SECRET, function (err, token) {
			if (err) {
				return reject(err);
			}
			resolve(token);
		});
	});
}