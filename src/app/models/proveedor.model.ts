export class Proveedor {
    constructor(
        public razon_social: string,
        public cuit: string,
        public activo: boolean,   
        public domicilio?: string,
        public _id?: string,
    ){}
}