import express from "express"
import productsRoutes from './routes/products.routes.js'
import sessionsRoutes from './routes/sessions.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import viewsRoutes from './routes/views.routes.js'
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { connectMongoDB } from "./database.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import { server } from "./database.js"

const app = express()
const PORT = 9090

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname+"/public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser("session"))
app.use(session({
    store: MongoStore.create({
        mongoUrl: server,
        mongoOptions:{useNewUrlParser:true, useUnifiedTopology: true},
        ttl: 2 * 60
    }),
    secret:"session",
    resave:false,
    saveUninitialized:false
}))

app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/sessions", sessionsRoutes)
app.use("/", viewsRoutes)

app.listen(PORT, () =>{
    console.log(`server running at port ${PORT}`);
})

connectMongoDB()