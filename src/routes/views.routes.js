import { Router} from "express";
import Productcontroller from "../controllers/product.controller.js";
import Cartcontroller from "../controllers/cart.controller.js";
import { isAdminAuth } from "../middlewares/auth.js";
import { checkSession } from "../middlewares/auth.js";

const router = Router()

router.get('/', (req, res) =>{
    res.redirect('/home')
})
router.get('/home', (req, res) =>{
    res.render('home', {style:"index.css"})
})
router.get('/register', (req, res) =>{
    res.render('register', {style:'index.css'})
})
router.get('/products', checkSession, Productcontroller.viewProducts)
router.get('/products/:pid', checkSession, Productcontroller.viewProductsById)
router.get('/carts/:cid', checkSession, Cartcontroller.viewCartProducts)
router.get('/profile', isAdminAuth, (req, res)=>{
    const {user} = req.session
    res.render('profile', {user})
})

export default router