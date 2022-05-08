exports.verAdministrador = function(req, res,next){
    if(req.user.rol !== "ROL_ADMINISTRADOR") return res.status(403).send({mesnaje:"Solo puede acceder el Administrador"})

    next();
}

exports.VerUsuario = function(req, res, next){
    if(req.user.rol !== "ROL_USUARIO") return res.status(403).send({mesnaje:"Solo puede acceder el usuario"})

    next();
}