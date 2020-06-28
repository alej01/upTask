import Swal from 'sweetalert2';

export const actualizarAvance = () =>{
    //Seleccionar tareas
    const tareas = document.querySelectorAll('li.tarea');
    if(tareas.length){
        //seleccionar tareas completas
        const tareasCompletadas = document.querySelectorAll('i.completo');
        //calcular avance
        const avance = Math.round((tareasCompletadas.length / tareas.length)*100);
        //mostrar progreso
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+"%";

        if (avance == 100) {
            Swal.fire(
                'Proyecto completado',
                'Se ha completado el proyecto.',
                'success'
            )
        }
    }
}
