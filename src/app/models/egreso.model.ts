export class Egreso {
    constructor(
        public descripcion_cliente: string,
        public tipo_identificacion_cliente: string,
        public identificacion_cliente: string,
        public codigo: string,
        public fecha_egreso: Date,
        public estado: string,
        public activo: boolean,
        public _id?: string
    ){}
}