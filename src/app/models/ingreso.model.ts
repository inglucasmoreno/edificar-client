export class Ingreso {
    constructor(
        public numero_remito: string,
        public razon_social: string,
        public cuit_proveedor: string,
        public fecha_ingreso: Date,
        public estado: string,
        public productos: any[],
        public activo?: boolean
    ){}
};