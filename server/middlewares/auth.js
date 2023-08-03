import jwt from 'jsonwebtoken'; // Importing the 'jsonwebtoken' library for JWT operations
import { values , connect } from '../config.js'; // Importing the 'values' object from the '../config.js' file

export const verifyToken = async (req, res, next) => { // Defining the 'verify' middleware function with 'req', 'res', and 'next' parameters
    connect()
    // console.log('in the veification of token function.')
    try {
        const token = req.cookies.accessCookie; // Extracting the 'accessCookie' value from the request cookies
        // console.log({ token }); // Logging the token value to the console for debugging purposes
        if (!token) return res.status(403).send({
            success: false,
            error: "You don't have enough permissions to access this page."
        })
        
        const result = await jwt.verify(token, values.jwt_secret); // Verifying the token using the 'jwt_secret' value from the 'values' object
        if (!result) return res.status(403).send({
            success: false,
            error: "You don't have enough permissions to access this page."
        })

        req.token = token; // Storing the token value in the 'req' object for future use
        req.id = result.id; // Storing the user ID from the decoded token in the 'req' object for future use
        next(); // Calling the 'next' function to pass control to the next middleware or route handler
    } catch (error) {
        console.log({ error }); // Logging any errors that occur during token verification to the console
        return res.status(500).send({
            success: false,
            error: error.message, // Sending a 500 status response with the error message if an error occurs
        });
    }
};


// export const verifyToken = async (req,res) => {
    // connect()
//    try {
//         const token = req.body.accessCookie; 
//         if (!token) return res.status(403).send({
//             success: false,
//             error: "You don't have enough permissions to access this page."
//         })
        
//         const result = await jwt.verify(token, values.jwt_secret); 
//         if (!result) return res.status(403).send({
//             success: false,
//             error: "You don't have enough permissions to access this page."
//         })

//         req.token = token; 
//         req.id = result.id;
//         next(); 
//     } catch (error) {
//         console.log({ error }); 
//         return res.status(500).send({
//             success: false,
//             error: error.message, 
//         });
//     }
// }