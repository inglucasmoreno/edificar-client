export class Usuario {
    constructor(
        public uid: string,
        public dni: string,
        public apellido: string,
        public nombre: string,
        public email: string,
        public role?: string,
        public activo?: boolean,
        public password?: string
    ){}
}