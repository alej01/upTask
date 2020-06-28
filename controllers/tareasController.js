const Tareas = require('../model/Tareas');
const Proyecto = require('../model/Proyectos');

exports.eliminarTarea = async (req, res, next) =>{
    let tarea = await Tareas.destroy({
        where:{id: req.params.id}
    })
    if (!tarea) {
        return next();
    }
    res.send("Realizado correctamente") 
}

exports.modificarEstado = async (req, res)=>{

    let estado = 0;
    const tarea = await Tareas.findOne(
        {where: {id: req.params.id}
    });

    if (tarea.estado === estado) {
        estado = 1;
    }
     tarea.estado = estado;
    const accion = await tarea.save();

    if (accion) {
        res.send("Realizado correctamente.")
    }else{
        res.send("ha ocurrido un error")
    }
        
}

exports.crearTareas = async (req, res) => {
    const { tarea } = req.body;
    const tareaCreada = await Tareas.create({tarea, estado: 0, proyectoId: req.params.id});
    const proyecto = await Proyecto.findOne({
        where:{
            id: tareaCreada.proyectoId
        }
    })
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({ where:{ usuarioId } });
    const tareasP = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        incluide:[
            { model: Proyecto }
        ]
    })
    if (tareaCreada) {
        res.render("tareasProyecto", {
            nombrePagina: proyecto.nombre,
            proyecto,
            proyectos,
            estado: true,
            tareasP 
        })
    }else{
        res.render("tareasProyecto", {
            nombrePagina: proyecto.nombre,
            proyecto,
            proyectos,
            estado: false,
            tareasP 
        })
    }
    
}