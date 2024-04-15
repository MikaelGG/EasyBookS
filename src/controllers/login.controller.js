function logIn(req, res ) {
    res.render('login/index')
}
function signUp(req, res ) {
    res.render('login/signUp')
}

module.exports = {
    logIn: logIn,
    signUp: signUp,
}