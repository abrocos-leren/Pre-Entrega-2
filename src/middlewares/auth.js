export const isAdminAuth = (req, res, next) => {
    if(req.session.admin === true){
        return next()
    }
    res.render("error")
}

export const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
      next()
    } else {
        res.redirect('/home')
    }
}