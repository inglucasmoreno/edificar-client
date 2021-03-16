export class Producto {
    constructor(
        public _id: string,
        public codigo: string,
        public descripcion: string,
        public unidad_medida: boolean,
        public cantidad: number,
        public stock_minimo: boolean,
        public cantidad_minima: number,
        public precio: number,
        public activo: boolean
    ){}
}