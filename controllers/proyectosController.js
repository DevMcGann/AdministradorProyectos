const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async (req,res) => {
    const proyectos = await Proyectos.findAll();
    res.render('index.pug', {
        nombrePagina: 'Proyectos Admin',
        proyectos
    })
}

exports.formularioProyecto = async  (req,res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto.pug', {
        nombrePagina:'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res) =>{
    const proyectos = await Proyectos.findAll();
    //validar campo nombre tenga algo en el input
    const {nombre} = req.body;

    let errores = [];

    if (!nombre){
        errores.push({'texto' : 'Agrega un nombre al Proyecto'})
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto.pug', {
            nombrePagina : "Nuevo Proyecto",
            errores,
            proyectos
        })
    }else {
        //no hay problema
        //insertar a BD
       
        await Proyectos.create ({nombre});
        res.redirect('/')
        
      
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise =  Proyectos.findAll();
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url:req.params.url //url tiene que ser igual a como lo definimos en el router
        }
    });

    const[proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);


    //****TAAREAS****** */
    //Consultar TAREAS del PROYECTo ACTUAL
    const tareas = await Tareas.findAll({
        where:{
            proyectoId : proyecto.id
        }/*,
        include: [              //opcional, para que tb muestre a que proyecto pertenece la tarea. Tipo Join
            {model:Proyectos}
        ]*/
    });

    //pasarle a la vista
    if(!proyecto) return next();
    res.render('tareas.pug', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req,res) => {
    const proyectosPromise =  Proyectos.findAll();
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id:req.params.id  //id tiene que ser igual a como lo definimos en el router
        }
    });

    const[proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    res.render('nuevoProyecto.pug', {
        nombrePagina:'Editar Proyecto',
        proyectos,
        proyecto
    })
}



exports.actualizarProyecto = async (req,res) =>{
    const proyectos = await Proyectos.findAll();
    const {nombre} = req.body;
    let errores = [];

    if (!nombre){
        errores.push({'texto' : 'Agrega un nombre al Proyecto'})
    }

    //si hay errore
    if (errores.length > 0) {
        res.render('nuevoProyecto.pug', {
            nombrePagina : "Nuevo Proyecto",
            errores,
            proyectos
        })
    }else {
        await Proyectos.update(
            {nombre:nombre},
            {where: {id: req.params.id}}
            );
        res.redirect('/')
    }
}


exports.eliminarProyecto = async (req, res, next) => {
    // Se puede por query o params
    //console.log (req.query) y va a devolver como hayamos nombrado en proyectos.js  axios.delete(url, { params: {urlProyecto}})
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url:urlProyecto}});
    res.status(200).send('El proyecto ha sido Eliminado')
}
