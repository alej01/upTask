import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminarProyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', e =>{

        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: 'Estas seguro?',
            text: "Una vez eliminado el proyecto, no se podra restaurar.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro.',
            cancelButtonText: 'No, cancelar.'
        }).then((result) => {
        if (result.value) {

            let url = `${location.origin}${location.pathname}`;

            axios.delete(url, { params: {urlProyecto}})
                .then(function(respuesta){
                    Swal.fire(
                        'Hecho!',
                        respuesta.data,
                        'success'
                    );
                        
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                })
                .catch(
                    Swal.fire({
                        title: 'Hubo un error',
                        text: "No se pudo eliminar",
                        type: 'error',
                    })
                )
        }
        })
    })
}
export default btnEliminar;
