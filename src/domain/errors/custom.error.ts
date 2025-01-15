
export class CustomError extends Error {

  private constructor(    
    public readonly statusCode: number,
    public readonly message: string,
  ){
    super();
  }

  static badRequest(message: string) {
    return new CustomError(400, message);// 400 es para errores de cliente
  }

  static unAuthorized(message: string) {
    return new CustomError(401, message);// 401 es para errores de autenticación
  }

  static forbidden(message: string) {
    return new CustomError(403, message);// 403 es para errores de autorización
  }

  static notFound(message: string) {
    return new CustomError(404, message);// 404 es para errores de recurso no encontrado
  }

  static internalServer(message: string) {
    return new CustomError(500, message);// 500 es para errores de servidor
  }

}