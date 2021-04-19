export class Ingreso {
    constructor(
        public numero_remito: string,
        public proveedor: any,
        public fecha_ingreso: Date,
        public estado: string,
        public activo?: boolean
    ){}
};