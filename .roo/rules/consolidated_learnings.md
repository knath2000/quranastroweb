## Depuración y Mejora de UI de Audio

### Patrones de Implementación de Audio
- **Gestión de Instancias de Audio:** Al reproducir audio, es crucial detener y limpiar todas las instancias de `HTMLAudioElement` activas antes de crear una nueva o reutilizar una existente. Esto previene la superposición de audio y el consumo excesivo de recursos.
- **Desactivación de Controles Nativos:** Asegurarse de que las instancias de `HTMLAudioElement` se creen sin el atributo `controls` para evitar la imposición de controles de audio no deseados en la interfaz de usuario.
- **Sincronización de Estado Global:** Utilizar un store global (e.g., `nanostores`) para gestionar el estado de actividad del audio (`audioActive`). Es fundamental que este estado se desactive explícitamente cuando la reproducción finaliza (incluso sin autoplay) o cuando se detiene el audio.

### Refactorización de Componentes de UI
- **Eliminación Completa de Props Obsoletas:** Al refactorizar componentes y eliminar funcionalidades (e.g., controles de audio), es vital eliminar no solo el marcado HTML, sino también las props relacionadas de la interfaz del componente y de cualquier componente padre que las pase. Esto evita errores de tipado y mantiene la limpieza del código.
- **Verificación de Referencias:** Al eliminar referencias (e.g., `audioDebugRef`), asegurarse de que todas las instancias de uso de esa referencia sean eliminadas o actualizadas para evitar errores de "Cannot find name".

### Estrategias de Herramientas
- **`replace_in_file` vs. `write_to_file`:** Para cambios pequeños y localizados, `replace_in_file` es preferible. Sin embargo, para refactorizaciones extensas o cuando `replace_in_file` falla repetidamente debido a problemas de coincidencia, `write_to_file` es un fallback válido y a menudo más eficiente para reescribir secciones completas o archivos.

## Patrones de Diseño y Animación

### Gestión de Contenedores para Scroll y Posicionamiento
- **Contenedores con Altura Definida:** Para componentes que utilizan scroll interno (`overflow-y-auto`) o posicionamiento absoluto (`absolute inset-x-0 top-0 bottom-0`), es crucial que sus contenedores padres tengan una altura explícitamente definida (e.g., `h-full`). Esto asegura que el componente pueda calcular y ocupar el espacio vertical correctamente.

### Consistencia en Animaciones de TailwindCSS
- **Uso Consistente de Clases de Animación:** Al aplicar animaciones y delays con TailwindCSS, utilizar el formato `animate-[nombre-animacion]` y `animation-delay-[valor-ms]` para asegurar la consistencia y el correcto funcionamiento. Evitar clases como `fade-in delay-100` si el framework está configurado para el formato `animate-*` y `animation-delay-*`.
