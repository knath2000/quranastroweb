## Depuración y Mejora de UI de Audio

### Patrones de Implementación de Audio
- **Gestión de Instancias de Audio:** Al reproducir audio, es crucial detener y limpiar todas las instancias de `HTMLAudioElement` activas antes de crear una nueva o reutilizar una existente. Esto previene la superposición de audio y el consumo excesivo de recursos.
- **Desactivación de Controles Nativos:** Asegurarse de que las instancias de `HTMLAudioElement` se creen sin el atributo `controls` para evitar la imposición de controles de audio no deseados en la interfaz de usuario.
- **Sincronización de Estado Global:** Utilizar un store global (e.g., `nanostores`) para gestionar el estado de actividad del audio (`audioActive`). Es fundamental que este estado se desactive explícitamente cuando la reproducción finaliza (incluso sin autoplay) o cuando se detiene el audio.
- **Patrón de Audio Pool:** Reutilización de instancias de `HTMLAudioElement` para reducir la latencia y el consumo de recursos al cambiar de audio.
- **Estado Unificado con `useReducer`:** Gestión centralizada y predecible del estado del reproductor de audio, mejorando la consistencia y el debug.
- **Optimización de Event Listeners:** Uso de un hook dedicado (`useAudioEventManager`) para añadir y remover listeners de forma eficiente, previniendo memory leaks y mejorando el rendimiento.
- **Preloading Inteligente:** Precarga del siguiente verso durante la reproducción actual para eliminar la latencia de carga y asegurar transiciones más rápidas y fluidas.
- **Transiciones Suaves (Crossfade):** Implementación de `fadeIn` y `fadeOut` para una experiencia de audio sin interrupciones entre versos.

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
- **Patrón de Animación Secuencial:** Para animaciones de lista o elementos secuenciales, definir clases de animación (`animate-list-item`, `animate-item-X`) y keyframes (`fadeSlideIn`) en un archivo CSS global (e.g., `global.css`) para asegurar la consistencia y el rendimiento.
- **Optimización de Rendimiento en Animaciones:** Utilizar la propiedad CSS `will-change` en elementos animados para informar al navegador sobre las propiedades que se animarán, permitiendo optimizaciones de renderizado.

### Gestión de Estado de Animaciones
- **Sincronización de Estado de Animación y Reproducción:** Es fundamental que el estado de la animación se sincronice con el estado de reproducción en todos los puntos de control de audio (inicio, pausa, reanudación, búsqueda, finalización, error y limpieza) para garantizar un comportamiento consistente.

### Claridad Visual y Simplificación de UI
- **Priorizar la Simplicidad Visual:** Eliminar elementos animados o visualmente complejos que no añaden valor funcional o que pueden distraer al usuario, especialmente en interfaces centradas en la lectura.
- **Patrón de Animación Secuencial:** Para listas de elementos, usar clases predefinidas como `animate-list-item` y `animate-item-X` (donde X es el índice del elemento) para aplicar animaciones secuenciales con delays escalonados. Esto centraliza la definición de la animación en `global.css` y optimiza el rendimiento con `will-change`.

### Flujo de Trabajo
- **Verificación de Procesos en Ejecución:** Antes de intentar iniciar un proceso (e.g., servidor de desarrollo), verificar si ya está en ejecución para evitar intentos redundantes.

## Hidratación y Configuración de Componentes

### Problemas de Hidratación en Astro con Preact
- **Causa Común:** Conflictos en la configuración de integraciones de frameworks (e.g., React y Preact configurados para incluir los mismos archivos `.tsx`) o componentes interactivos fuera del flujo de hidratación principal.
- **Síntomas:** Eventos de clic no disparados, `console.log` dentro de `onClick` no visibles, componentes que no responden a la interacción del usuario.

### Soluciones para Hidratación
- **Simplificación de `astro.config.mjs`:** Asegurarse de que solo una integración de framework (e.g., `@astrojs/preact`) esté configurada para manejar los archivos `.tsx` para evitar conflictos.
- **Posicionamiento de Componentes Interactivos:** Colocar los componentes interactivos (que usan directivas `client:*`) dentro del `<main>` o un contenedor principal que sea parte del flujo de renderizado e hidratación esperado.
- **Directivas de Hidratación:** Utilizar la directiva `client:visible` para componentes que deben hidratarse cuando son visibles en el viewport, o `client:load` si deben hidratarse tan pronto como la página carga.

### Patrón de Navegación
- **Uso de `history.back()`:** Para la funcionalidad de "volver atrás" en la navegación del navegador, es preferible usar `window.history.back()` en lugar de redirigir a rutas fijas (`window.location.href`). Esto proporciona una experiencia de usuario más intuitiva y consistente con el historial de navegación.

## Patrones de Inicialización de Hooks y Variables Derivadas
- **Orden de Declaración de Hooks:** Declarar todos los hooks en la parte superior del componente antes de cualquier lógica condicional o cálculo de valores derivados.
- **Uso de `useMemo` para Valores Derivados:** Cuando se calculan valores derivados a partir de los resultados de los hooks (ej. `currentVerse` a partir de `verses` y `currentVerseKey`), usar `useMemo`. Esto asegura que el valor se recalcule solo cuando sus dependencias cambian y que las dependencias estén inicializadas.
- **Manejo de Valores No Inicializados:** Implementar verificaciones de `null` o `undefined` o proporcionar valores por defecto (`[]` para arrays) para las variables que provienen de hooks, especialmente antes de realizar operaciones como `find()`. Esto previene errores de "Cannot access before initialization" (Temporal Dead Zone).
- **Conditional Rendering:** Usar renderizado condicional (`if (isLoading || !data) return <Loading />`) para mostrar un estado de carga o un fallback mientras los datos de los hooks se inicializan.
