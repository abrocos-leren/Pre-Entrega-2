import Usermanager from "../services/db/usermanager.js"


class Sessioncontroller {
    newRegiteredUser = async (req, res) => {
    try {
        const {name, surname, email, password} = req.body
        const newUser = {
            name,
            surname,
            email,
            password
        }
        const newUserResult = await Usermanager.createNewUser(newUser)
        res.send({status:"cheto", payload:newUserResult})
    } catch (error) {
        res.status(201).send(error)  
    }}

    logInUser = async (req, res) =>{
        const {email, password} = req.body
        let user = {
            email:email,
            password:password
        }
        let logInResult = await Usermanager.findUser(user)
        if (logInResult){
            const {name, isAdmin} = logInResult
            req.session.user = name
            req.session.admin = isAdmin || false
            return res.status(200).json({ message: 'Inicio de sesión exitoso' })
        }else{
            return res.status(204).send()
        }
    }

    logOffUser = async (req, res) =>{
        console.log(req.session.name);
        req.session.destroy(error =>{
            if(error){
                return res.json({status:"error", message:`La sesion no pudo finalizarse: ${error}`})
            }
        })
        res.redirect('/home')
    }
}

export default new Sessioncontroller