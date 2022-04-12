import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';
import { PresupuestosService } from '../../services/presupuestos.service';
import { environment } from '../../../environments/environment';
import gsap from 'gsap';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

const base_url = environment.base_url;

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styles: [
  ]
})
export class PresupuestoComponent implements OnInit {

  // Fecha
  public fechaHoy = Date.now();

  // Datos de cliente
  public cliente = {
    descripcion: '',
    tipoIdentificacion: 'DNI',
    identificacion: '',
    telefono: '',
    correo: ''
  };

  // Variables de producto
  public total = 0;
  public precioTotal = 0;
  public productos: any = [];
  public seleccionado: any = {};
  public flagSeleccionado: boolean;
  public seleccionados = [];
  public limit = 5;
  public descripcion = '';

  // Paginacion
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }

  constructor(private productosService: ProductosService,
              private dataService: DataService,
              private alertService: AlertService,
              private presupuestosService: PresupuestosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Presupuestos";
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .3 });
  }
  
  // Cargando datos de cliente
  datosCliente(data: string, selector: string): void{
    if(selector === 'correo'){
      this.cliente[selector] = data.toLowerCase();
    }else{
      this.cliente[selector] = data.toUpperCase();
    }
  }

  // Se el presupuesto
  crearPresupuesto(): void { 

    this.alertService.question({ msg: 'Está por generar un presupuesto', buttonText: 'Generar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            // Se verifican los datos obligatorios
            if(this.cliente.descripcion.trim() === '' || 
              this.cliente.identificacion.trim() === '' ||
              this.cliente.telefono.trim() === ''      
            ){
              this.alertService.info('Debe completar los datos obligatorios');
              return;
            }

            const data = {
              cliente: this.cliente,
              productos: this.seleccionados
            }

            this.alertService.loading();

            this.presupuestosService.generarPresupuesto(data).subscribe( () => {
              this.alertService.close();
              window.open(`${base_url}/presupuestos`, '_blank');  
            },({error}) => {
              this.alertService.errorApi(error.msg);
            });
          }
        }); 
  }

  // Agregar producto al presupuesto
  agregarProducto(txtCantidad: any): void{

    if(txtCantidad.value.trim() === '' || txtCantidad.value === '0'){
      this.alertService.info('Debe colocar una cantidad valida');
      return;
    }else{

      const total = this.seleccionado.precio * txtCantidad.value;
      
      this.seleccionados.push({
        id: this.seleccionado._id,
        descripcion: this.seleccionado.descripcion,
        precio: this.seleccionado.precio,
        unidad_medida: this.seleccionado.unidad_medida.descripcion,
        cantidad: txtCantidad.value,
        total
      });
      this.precioTotalFnc();
      this.borrarProductoSeleccionado();
      this.productos = [];
      txtCantidad.value = '';
    }
  }

  // Se extra un elemento del arreglo
  extraerProducto(productoId: string): void {
    const productos = this.seleccionados.filter(elemento => elemento.id !== productoId);
    this.seleccionados = productos;
    this.precioTotalFnc();
  }

  // Se calcula el precio total del presupuesto
  precioTotalFnc(): void {
    let tmpTotal = 0;
    this.seleccionados.forEach(producto => {
      tmpTotal += Number.parseFloat(producto.total); 
    });
    this.precioTotal = tmpTotal;
  }

  // Seleccionar producto
  seleccionarProducto(producto: any): void {
    // Se controla si el producto ya esa en el presupuesto
    const existe = this.seleccionados.find(elemento => elemento.id == producto._id);
    if(existe){
      this.alertService.info('Este producto ya esta agregado');
      this.productos = [];
    }else{
      this.flagSeleccionado = true;
      this.seleccionado = producto;
      this.productos = [];
    }
  }

  // Eliminar producto seleccionado
  borrarProductoSeleccionado(): void {
    this.seleccionado = {};
    this.flagSeleccionado = false;  
  }

  // Listar productos
  buscarProducto(): void{
    if(this.descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    this.alertService.loading();
    this.reiniciarPaginacion();
    this.listarProductos();
  }

  // Listar productos
  listarProductos(): void {
    this.productosService.listarProductos(
      this.paginacion.hasta,
      this.paginacion.desde,
      true,
      this.descripcion
    ).subscribe(({productos, total}) => {
      this.total = total;
      this.productos = productos;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === '') this.productos = [];
    this.descripcion = descripcion;      
  }

  // Eliminar presupuesto
  eliminarPresupuesto(): void {
    this.alertService.question({ msg: 'Está por eliminar el presupuesto', buttonText: 'Eliminar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.seleccionados = [];
            this.precioTotal = 0;
          }
        }); 
  }

  // Borrar listado
  borrarListado(): void {
    this.productos = [];
  }

  // Reiniciar paginación
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;
    this.paginacion.limit = 5;
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void { 
    this.alertService.loading();
    if (selector === 'siguiente'){ // Incrementar
      if (this.paginacion.hasta < this.total){
        this.paginacion.desde += this.paginacion.limit;
        this.paginacion.hasta += this.paginacion.limit;
      }
    }else{                         // Decrementar
      this.paginacion.desde -= this.paginacion.limit;
      if (this.paginacion.desde < 0){
        this.paginacion.desde = 0;
      }else{
        this.paginacion.hasta -= this.paginacion.limit;
      }
    }
    this.listarProductos();
  }

}
