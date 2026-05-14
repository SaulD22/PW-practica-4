# **Conceptos clave** 🤖

## `Diferencias técnica:` ¿Cómo cambia la lógica del servidor al consumir una API de base de datos vs. una API de IA (como Gemini)?

La diferencia principal radica en la naturaleza de la respuesta y la latencia:

- API de Base de Datos: Opera bajo una lógica determinista y de acceso estructurado (CRUD). El servidor solicita datos específicos (ej. un registro de usuario) y recibe una respuesta predecible y casi instantánea. La lógica se centra en la integridad de los datos y la velocidad de consulta.

- API de IA (ej. Gemini): Opera bajo una lógica probabilística y no estructurada. El servidor envía un prompt y la API genera contenido nuevo. Esto implica una latencia mayor debido al tiempo de procesamiento del modelo y requiere que el servidor gestione flujos de datos (streaming) y validaciones de contenido (safety settings) que no existen en una base de datos tradicional.

## `Seguridad:` ¿Por qué es una vulnerabilidad grave exponer una API Key en el frontend y cómo ayuda el backend a protegerla?

La exposición de una clave de API en el lado del cliente (navegador) constituye una vulnerabilidad crítica por las siguientes razones:

Acceso no autorizado: Cualquier usuario puede inspeccionar el código fuente o el tráfico de red, extraer la clave y suplantar la identidad de la aplicación, agotando cuotas de uso o generando costos económicos.

Rol del Backend como intermediario: El backend actúa como un proxy seguro. La API Key se almacena en variables de entorno del servidor, fuera del alcance del navegador. El frontend realiza peticiones al servidor propio, y este, tras autenticar al usuario, adjunta la clave de forma privada para comunicarse con el proveedor externo.

## `Herramientas:` ¿Qué es Google AI Studio y para qué sirve en el flujo de desarrollo?
