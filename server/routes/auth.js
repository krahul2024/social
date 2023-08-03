import express from 'express'
import { login , register , logout} from '../controllers/auth.js'
import { verifyToken } from '../middlewares/auth.js'
import User from '../models/user.js'
const router = express.Router()


// for logging in the user 
router.post('/login', login)

// for registering the user 
router.post('/register', register)

// for logging out the user 
router.get('/logout' , verifyToken , logout) 



export default router