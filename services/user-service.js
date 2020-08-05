//form validation
function registerValidation(data) {
    const { name, email, password, password2 } = data;
    let errors = [];
    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Por favor completa todos los campos" });
    }

    //password + de 6 caracteres
    if (password.length < 6) {
        errors.push({
            message: "La contraseña debe tener al menos 6 caracteres",
        });
    }

    //check password match
    if (password !== password2) {
        errors.push({ message: "Las contraseñas no coinciden" });
    }

    //checkear si tenemos errores
    if (errors.length > 0) {
        //hay errores
        
    } else {
        //no hay errores. continuar
    }
}
