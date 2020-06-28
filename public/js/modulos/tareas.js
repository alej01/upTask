import axios from 'axios';
import Swal from 'sweetalert2';
import push from 'push.js'
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e=>{
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const tarea = icono.dataset.tarea;
            const url = `${location.origin}/tareas/${tarea}`
            
            axios.patch(url, { tarea })
                .then(function(res){
                    if (res.status === 200) {
                        
                        icono.classList.toggle('completo')
                        push.create("Tarea realizada", {
                            body: "Se cambio el estado de la tarea",
                            icon: '../../img/alarm.png',
                            timeout: 4000,
                            onClick: function () {
                                window.focus();
                                this.close();
                            }
                        });
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const icono = e.target;
            const tarea = icono.dataset.tarea;
            const url = `${location.origin}/tareas/${tarea}`

            console.log(icono.parentElement.parentElement.parentElement)
            Swal.fire({
                title: 'Estas seguro?',
                text: "Una vez eliminado la tarea, no se podra restaurar.",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, estoy seguro.',
                cancelButtonText: 'No, cancelar.'
            }).then(function(res){
                if (res.value) {
                    axios.delete(url,{ tarea }) 
                        .then(function(res){
                            Swal.fire(
                                'Hecho!',
                                res.data,
                                'success'
                            ).then(function(res){
                                icono.parentElement.parentElement.parentElement.removeChild(icono.parentElement.parentElement)
                                actualizarAvance();
                            })
                            
                        })
                }
            })
        }
    })
}
export default tareas;