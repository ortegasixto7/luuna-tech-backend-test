# luuna-tech-backend-test

### **Deployment del proyecto**

URL: https://luuna-backend-test-sixto.fly.dev

- **Nota:**
  Cabe destacar que es un servicio compartido de minimos recursos tanto la base de datos como el server de la aplicacion, por lo que siempre la primera request va a tardar un monton, luego las demas si serán mas rápidas.
  Si lo van a testear desde local, no olviden descomentar las lineas del dotenv que estan comentadas y actualizarlas tambien, recuerden que el archivo debe llamarse .env

- **_Como se puede mejorar o escalar esta API?_**
  Se puede mejorar en los siguientes sentidos:
  - Implementar paginacion en las busquedas de datos
  - Agregar un proveedor de authenticacion externo para de esta manera no exponer los datos sensibles a la internet
  - En el envio de mensajes se puede agregar un servicio de messaging que ponga en una cola los mensajes a enviar

### **Preguntas que pudieran realizarse**

- **_Porque decidiste crear la documentación en postman y no por codigo como por ejemplo Swagger?_**
  Ya que utilizando Swagger tendria que agregar metadatos a cada endpoint desarrollado y en mi parecer eso es enbasurar el codigo, siguiendo las practicas de clean code opté por desarrollarlo en Postman y lo bueno de postman es que me da una url publica para compartir
  https://documenter.getpostman.com/view/22596886/2s8ZDX4NgQ

- **_Porque el versionado de los endpoints los realizas al final del endpoint y no al principio?_**
  Esto es así, ya que las versiones cuando cambian en su mayoria lo hacen los algunos paths y no toda la implementacion, me explico:
  Si tuviesemos en un controlador /api/v1/products cuando se tenga que realizar un cambio en el crear producto tendriamos que actualizar ese endpoint a lo siguiente /api/v2/products y con sigo todo el controlador, entonces de la manera en como lo propuse el versionado por path, solamente se veria afectado el path create en cuestion y no todo lo que engloba a /api/v1/products

- **_Porque se utiliza constantes como mensajes de respuesta para los codigos de error en vez de un String?_**
  Se realiza de esta manera para poder mandar un mensaje que pueda ser manipulado por el cliente que lo consuma (Web/Mobile) y este puede representarlo en el idioma que haya seleccionado el usuario, mas que todo para temas de internationalization

- **_A la hora de validar el token de acceso del usuario porque no utilizaste un middleware?_**
  Ya que para el escalado a futuro del codigo de authentication, si se decidiera utilizar un proveedor de terceros como Firebase Auth, Amazon Cognito o etc, unicamente se tiene que realizar la implementacion del codigo correspondiente y todo seguiria funcionando sin muchos cambios en los enrutadores

- **_Porque las fechas son de tipo numérico?_**
  Ya que en mi experiencia tener una fecha en el formato convencional que es String se complica mucho a los clientes que la consumen (Web y Mobile) para poder realizar el parseo. De igual manera servicios como Algolia por colocar un ejemplo no permite fechas en formato String para realizar búsquedas, solo de tipo númerico.
  Las fechas en tipo numerico son mas faciles de parsear entre distintos lenguajes de programación

- **_Porque agregaste un middleware que imprimiera todas las llamadas a la API?_**
  Dado que me ha servido de mucha ayuda registrar los datos que se envian a la API, para cuando sucede un error tener los datos que se ingresaron y el usuario que estuvo logueado realizando la acción para posteriormente intentar reproducirlo y solventar el error.

- **_Porque el producto tiene un id y un sku, el sku no deberia de ser el identificador principal?_**
  Lo hice de está manera por las siguientes razónes:
  - El SKU en muchos casos se utiliza como identificador para imprimir en los clientes que lo consumen (Web, Mobile) y tiene que ser humanamente legible, ej "COD123"
  - El Id es para logica de programación, es de uso mas interno en los cuales en su mayoria se utiliza un formato de UUID/GUID ej "d57b6160-082c-45e5-9a97-a4624ee3f861"
