import { ObjectId } from "mongodb";

export function idValidation(req, res, next) {
    console.log(Object.keys(req.params));
    for (const key of Object.keys(req.params)) {
        if (key.toLowerCase().includes('id')) {
            console.log('yes');
            if (!ObjectId.isValid(req.params[key])) {
                return res.status(400).send(`param "${key}" is invalid`);
            }
        }
    }
    next();
};
