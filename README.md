# Rest Project + TypeScript

Este proyecto previamente inicializado tiene todo lo necesario para trabajar con TypeScript, Express y Rest.

## Instalación 
# Rama Dev
1. Clonar el .env template y crear tu .env
2. Ejecutar el comando ``` npm install ```
3. Ejecutar el comando ``` docker compose up -d ```
4. Ejecutar el comando ``` prisma migrate dev ```
5. Ejecutar el comando ``` npm run dev ```

Descripción:    
FastOrder es una aplicación web para la gestión integral de órdenes en cocinas y restaurantes pequeños. El sistema automatiza el proceso de registro de pedidos, el control de raciones disponibles y la administración de clientes y pagos pendientes, reduciendo errores y optimizando la operación diaria.
Características:

    Gestión de Pedidos: Permite registrar pedidos en tiempo real y ajustar automáticamente las raciones disponibles.
    Control de Inventario: Automatiza el conteo de raciones, ayudando a evitar sobreventa o desperdicio de comida.
    Administración de Clientes: Maneja información de clientes, historial de pedidos y pagos pendientes.
    Modos de Entrega: Soporta múltiples modalidades de pedidos, como servicio presencial, para llevar y entrega a domicilio.
    Integración con Cloudinary: Subida de imágenes directamente desde el navegador o desde memoria, sin necesidad de archivos temporales en el servidor.
    Arquitectura limpia: Basada en principios de Domain-Driven Design (DDD) y separación de capas (Dominio, Infraestructura, Presentación).

Tecnologías Utilizadas:

    Backend: Node.js, Express
    Lenguaje: TypeScript
    ORM: Prisma para gestión de base de datos (PostgreSQL)
    Autenticación: JWT con refresh tokens
    Almacenamiento de Imágenes: Cloudinary (a través de un adaptador)
    Otros: Express-fileupload para el manejo de archivos, entre otras librerías.
