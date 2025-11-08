export default function autorizarUsuarios ( perfilAutorizados = [] ) {

    return (req, res, next) => {
        const usuario = req.user;
        const tipoUsuario = usuario?.tipo_usuario !== undefined
            ? Number(usuario.tipo_usuario)
            : undefined;

        if(!usuario || Number.isNaN(tipoUsuario) || !perfilAutorizados.includes(tipoUsuario)) {
            return res.status(403).json({
                estado:"Error",
                mesaje:"Acceso denegado."
            })
        }
        next();
    }
}