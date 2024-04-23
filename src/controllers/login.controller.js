const bcrypt = require('bcrypt');

function home(req, res) {
    res.render('home')
}

function logIn(req, res ) {
    res.render('login/index')
}

function user(req, res){
    res.render('user')
}

function auth(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                        if (!isMatch) {
                            res.render('login/index', { error: "¡ Error: Constraseña incorrecta !" });
                        } else {
                            req.session.loggedin = true;
                            req.session.name = element.name;
                            if (element.tipo === 'usuario'){
                                res.render('user', { name: req.session.name })
                            } else if (element.tipo === 'administrador'){
                                res.render('admin/admin', { name: req.session.name})
                            }
                        }
                    })
                });
            }else {
                res.render('login/index', { error: "¡ Error: El Email NO existe !", });
            }
        });  
    });  
}

function signUp(req, res ) {
    res.render('login/signUp')
}

function signUpAdmin(req, res ) {
    if (req.session.loggedin) {
        res.render('admin/signUp', { name: req.session.name} );    
    }
}

function storeUser(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                res.render('login/signUp', { error: "¡ Error: El Email ya existe !", });
            }else {
                bcrypt.hash(data.password, 12) .then(hash => {
                    data.password = hash;
                    console.log(data);
                    
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            console.log('Consulta insertada')
                            req.session.loggedin = true;
                            req.session.name = data.name;
                            if (data.tipo === 'usuario'){
                                res.render('user', { name: req.session.name })
                            } else if (data.tipo === 'administrador'){
                                res.render('admin/admin', { name: req.session.name})
                            }
                        });
                    });
                });
            }
        })
    })
}

function storeAdmin(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                res.render('admin/signUp', { error: "¡ Error: El Email ya existe !", });
            }else {
                bcrypt.hash(data.password, 12) .then(hash => {
                    data.password = hash;
                    console.log(data);
                    
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            console.log('Consulta insertada')
                            if (data.tipo === 'administrador'){
                                if (req.session.loggedin){
                                    res.render('admin/admin', { name: req.session.name})
                                }
                            }
                        });
                    });
                });
            }
        })
    })
}

function admin(req, res) {
    res.render('admin/admin')
}

function logOut(req, res) {
    if (req.session.loggedin == true) {
        req.session.destroy()
    }
    res.redirect('logIn')
}

module.exports = {
    home,
    logIn,
    user,
    signUp,
    signUpAdmin,
    storeUser,
    storeAdmin,
    auth,
    admin,
    logOut
}