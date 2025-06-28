import zIndex from "node_modules/@mui/material/esm/styles/zIndex";
import Swal from "sweetalert2";

export const successAlert = async (text) => {
    await Swal.fire({
        title: "¡Listo!",
        text: text,
        icon: "success",
        confirmButtonText: "Confirmar",
        timer: 2000,
        color: "var(--color-theme-ocean-blue)",
        iconColor: "var(--color-theme-ocean-blue)",
        confirmButtonColor: "var(--color-theme-ocean-blue)",
        didOpen: () => {
            document.body.style.overflow = 'hidden';
            // Configurar el z-index aquí, cuando el contenedor ya existe
            Swal.getContainer().style.zIndex = 10000;
        },
        willClose: () => {
            document.body.style.overflow = 'auto';
        }
    })
}


export const failedAlert = async (text) => {
    await Swal.fire({
        title: "¡Ups!",
        text: text,
        icon: "error",
        confirmButtonText: "Confirmar",
        timer: 2000,
        color: "var(--color-theme-error)",
        iconColor: "var(--color-theme-error)",
        confirmButtonColor: "var(--color-theme-error)",
        didOpen: () => {
            document.body.style.overflow = 'hidden';
            // Configurar el z-index aquí, cuando el contenedor ya existe
            Swal.getContainer().style.zIndex = 10000;
        },
        willClose: () => {
            document.body.style.overflow = 'auto';
        }
    })
}