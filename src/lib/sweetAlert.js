import Swal from "sweetalert2";

export const successAlert = async (text) => {
    await Swal.fire({
        title: "¡Listo!",
        text: text,
        icon: "success",
        confirmButtonText: "Confirmar",
        timer: 4000,
        color: "var(--color-theme-ocean-blue)",
        iconColor: "var(--color-theme-ocean-blue)",
        confirmButtonColor: "var(--color-theme-ocean-blue)",
    })
}