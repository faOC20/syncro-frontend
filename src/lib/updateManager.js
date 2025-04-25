// Almacena todas las funciones de actualización
const updateFunctions = new Set();

// Función para calcular el tiempo hasta la próxima actualización
const getNextUpdateTime = () => {
    const now = new Date();
    const nextUpdate = new Date(
        now.getFullYear(),
        now.getMonth(),
        // Si es después de las 22:00 (10 PM), programar para mañana a las 22:00
        now.getHours() >= 6 ? now.getDate() + 1 : now.getDate(),
        6, // 10pm (22:00)
        0,  // 0 minutos
        0   // 0 segundos
    );

    // Si la fecha calculada es anterior a la actual, ajustar al día siguiente
    if (nextUpdate < now) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
    }

    return nextUpdate.getTime() - now.getTime();
};

// Función para programar la próxima actualización
const scheduleNextUpdate = () => {
    const timeUntilNext = getNextUpdateTime();
    console.log('Próxima actualización en (ms):', timeUntilNext);
    
    setTimeout(() => {
        // Ejecutar todas las funciones registradas
        updateFunctions.forEach(fn => fn());
        // Programar la siguiente actualización
        scheduleNextUpdate();
    }, timeUntilNext);
};

// Función para registrar nuevas funciones de actualización
export function registerUpdate(updateFn) {
    updateFunctions.add(updateFn);
    // Ejecuta la función inmediatamente al registrarla
    updateFn();
    return () => updateFunctions.delete(updateFn);
}

// Iniciar el sistema de actualizaciones
scheduleNextUpdate();
