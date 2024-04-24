const bcrypt = require('bcrypt');

function home(req, res) {
    res.render('home')
}

function logIn(req, res ) {
    res.render('logIn')
}

function user(req, res){
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
                return res.status(500).send("Error interno del servidor");
            }
            conn.query('SELECT * FROM books', (err, books) => {
                if (err) {
                    console.error('Error al obtener los libros:', err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.render('user/user', { name: req.session.name, books });
            });
        });
    } else {
        res.redirect('/logIn'); // Redireccionar si el usuario no está autenticado
    }
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
                                res.redirect('/user')
                            } else if (element.tipo === 'administrador'){
                                res.redirect('/admin')
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
                                res.render('user/user', { name: req.session.name });
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
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    console.log(data);
                    
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            console.log('Consulta insertada')
                            if (data.tipo === 'administrador'){
                                if (req.session.loggedin){
                                    res.redirect('/admin')
                                }
                            }
                        });
                    });
                });
            }
        })
    })
}

function storeBook(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO books SET ?', [data])
        console.log('Consulta insertada')
        if (req.session.loggedin) {
            res.redirect('/admin')
        }
    })
}

// function showBooks(req, res) {
//     req.getConnection((err, conn) => {
//         if (req.session.loggedin) {
//             conn.query('SELECT * FROM books', (err, books) => {
//                 if (err){
//                     console.log('Error al obtener los libros', err);
//                     return res.status(500).send("Error interno del servidor");
//                     console.log(books)
//                 }
//                 res.render('admin/admin', { books })
//             })
//         }
//     })
// }

// function admin(req, res) {
//     if (req.session.loggedin) {   
//         res.render('admin/admin', { name: req.session.name})
//     }
// }

function admin(req, res) {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
                return res.status(500).send("Error interno del servidor");
            }
            conn.query('SELECT * FROM books', (err, books) => {
                if (err) {
                    console.error('Error al obtener los libros:', err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.render('admin/admin', { name: req.session.name, books });
            });
        });
    } else {
        res.redirect('/logIn'); // Redireccionar si el usuario no está autenticado
    }
}


function addBook(req, res) {
    if (req.session.loggedin) {
        res.render('admin/addBook', { name: req.session.name })
    }
}

function logOut(req, res) {
    if (req.session.loggedin == true) {
        req.session.destroy()
    }
    res.redirect('/home')
}

module.exports = {
    home,
    logIn,
    user,
    signUp,
    signUpAdmin,
    storeUser,
    storeAdmin,
    storeBook,
    addBook,
    auth,
    admin,
    logOut
}