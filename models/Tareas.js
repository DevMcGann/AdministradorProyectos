const Sequelize = require('sequelize');
const db= require('../config/db');
const Proyectos = require('./Proyectos'); //impor el mod de proyectos para usar como clave foranea

const Tareas = db.define('tareas', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement:true
    },
    tarea:Sequelize.STRING(100),
    estado:Sequelize.INTEGER(1)
});

Tareas.belongsTo(Proyectos); //Las tareas pertenecen a 1 proyecto(id).   Tambien podria ser Proyectos.ManyToOne(Tareas)


module.exports = Tareas;
