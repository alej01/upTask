const Proyectos = require('../model/Proyectos');

exports.proyectosHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where:{ usuarioId } });
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where:{ usuarioId } });
    
    res.render('nuevoProyecto', {
        nombrePagina : 'Nuevo Proyecto',
        btnText: 'Agregar',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where:{ usuarioId } });

    const { nombre } = req.body;
    let snOk = false;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre'});
    }
    if (nombre.length < 8) {
        errores.push({'texto': 'El nombre debe tener mas de 8 caracteres'});
    }
    if (errores.length>0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto', 
            errores,
            proyectos
        });
    }else{
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
            snOk = true

            if (snOk) {
                const proyectos = await Proyectos.findAll();
                res.render('nuevoProyecto', {
                    nombrePagina : 'Nuevo Proyecto', 
                    snOk,
                    proyectos
                });
            }
    }
    
}

exports.guardarProyecto = async (req, res) => {
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where:{ usuarioId } });

    const { nombre } = req.body;
    let snOk = false;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre'});
    }
    if (nombre.length < 8) {
        errores.push({'texto': 'El nombre debe tener mas de 8 caracteres'});
    }
    if (errores.length>0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto', 
            errores,
            proyectos
        });
    }else{
        await Proyectos.update(
            { nombre: nombre },
            {where: {id:req.params.id}}
            );
            snOk = true

            if (snOk) {
                const proyectos = await Proyectos.findAll();
                res.render('nuevoProyecto', {
                    nombrePagina : 'Nuevo Proyecto', 
                    snOk,
                    proyectos
                });
            }
    }
    
}

exports.proyectoPorURL = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where:{ usuarioId } });
    const Tareas = require('../model/Tareas');
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    const tareasP = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        //incluide:[
        //    { model: Proyectos }
        //]
    })  
    if (!proyecto) return next();

   res.render("tareasProyecto", {
       nombrePagina: proyecto.nombre,
       proyecto,
       proyectos,
       tareasP 
   })
}

exports.editarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where:{ usuarioId } });
    const proyecto = await Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto, 
        btnText: 'Editar'
    });
}

exports.eliminarProyecto = async (req, res, next) =>{
    //console.log(req);
    
const {urlProyecto} = req.query;
const eliminarProyecto = await Proyectos.destroy({where: {url:urlProyecto}});

if(!eliminarProyecto){
    return next();
}

res.status(200).send('Proyecto eliminado exitosamente');

}