import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //req hacia /taeras/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url,{idTarea})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toogle('completo');
                        actualizarAvance();
                    }
                })
        }


        //eliminar
        if (e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title:"Deseas eliminar esta tarea?",
                text:"Si eliminas la tarea no podrá recuperarse",
                type:"warning",
                showCancelButton:true,
                confirmButtonColor:"#3085d6",
                cancelButtonColor:"#d33",
                confirmButtonText:"Si, eliminar",
                cancelButtonText:"Cancelar"
            }).then((result) => {
                if (result.value){
                    //enviar el delete por axios
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {params: {idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status === 200){
                                //eliminar el nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //opcional alerta
                                Swal.fire(
                                   "Tarea Eliminada",
                                   respuesta.data,
                                   "success" 
                                )

                                actualizarAvance();
                            }
                        })
                }
            })
        }

    })
}


export default tareas;
