/**
 * Función de ayuda para la navegación basada en estado
 * @param {string} viewId - El ID de la vista a la que navegar
 * @param {function} setActiveView - Función para establecer la vista activa
 * @returns {function} Función para manejar la navegación
 */
const useHandlerNavigate = (viewId, setActiveView) => {
    return () => {
        setActiveView(viewId);
    };
};

export default useHandlerNavigate;
