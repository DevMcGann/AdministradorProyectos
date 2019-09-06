//importar el modelo de proyectos para tener acceso a la URl y para trabajar con la DB, Tareas tb es necesario
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

//CREAR
exports.agregarTarea = async (req,res,next) => {
    //buscamos el proyecto por medio de la URL
    const proyecto = await Proyectos.findOne({where:{url:req.params.url}});

    //leer el valor del input del Formulario (Name="tarea")
    const {tarea} = req.body;

    const estado = 0;
    const proyectoId = proyecto.id //importante que la variable se llame igual a como este en la DB para que se mapee correctamente.

    //Insertar en DB y redireccionar
   const resultado = await Tareas.create({tarea,estado,proyectoId});  //imporatnte respetar el orden a como esta en la DB

   if (!resultado){
       return next();
   }

   res.redirect(`/proyectos/${req.params.url}`); //recargar la pagina

}


//cambiar estado tarea
exports.cambiarEstadoTarea =async (req,res,next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: {id : id}})

    //cambiar estado
    let estado  = 0;
    if (tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send("Updated");
}


//ELIMINAR
exports.eliminarTarea = async (req, res, next) =>{
    const {id} = req.params;
    const resultado = await Tareas.destroy({where:{id:id}});

    if (!resultado) return next();

    res.status(200).send("Tarea Eliminada");

}