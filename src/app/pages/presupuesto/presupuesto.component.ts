import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Cell, Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styles: [
  ]
})
export class PresupuestoComponent implements OnInit {

  // Fecha
  public fechaHoy = Date.now();

  // Loadings
  public loading = false;

  // Datos de cliente
  public cliente = {
    descripcion: '',
    tipoIdentificacion: 'DNI',
    identificacion: ''
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

  constructor(private productosService: ProductosService,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {}
  
  // Cargando datos de cliente
  datosCliente(data: string, selector: string): void{
    this.cliente[selector] = data.toUpperCase();
  }

  // Presupuesto en PDF
  async presupuestoPDF() {
    const hoy = moment().format('DD/MM/YYYY');
    const pdf = new PdfMakeWrapper();
  
    pdf.info({
      title: `Presupuesto | ${hoy}`,
      author: 'Equinoccio Technology',
      subject: 'Presupuesto'      
    });
    
    const titulo = new Txt(`Presupuesto - Fecha: ${hoy}`).fontSize(10).bold().end;

    // Tabla - Presupuesto
    const productosPresupuesto = this.extractData();
    const tabla = new Table([
   
      [ // Cabecera
        new Txt('Productos').bold().fontSize(10).margin([0, 5]).end, 
        new Txt('Precio (c/u)').bold().fontSize(10).alignment('center').margin([0, 5]).end, 
        new Txt('Cantidad').bold().fontSize(10).alignment('center').margin([0, 5]).end, 
        new Txt('Precio total').bold().fontSize(10).alignment('center').margin([0, 5]).end], 
        ...productosPresupuesto,
        [ // Productos
          new Txt('PRECIO TOTAL').fontSize(10).bold().margin([0, 5]).end, 
          '', 
          '', 
          new Txt('$' + new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(this.precioTotal)).fontSize(10).alignment('center').bold().margin([0, 5]).end,]
    ])
    .layout('lightHorizontalLines')
    .widths(['*', 100, 50, 80])
    .end;

    const isMobile = this.deviceService.isMobile();
    // const isDesktop = this.deviceService.isDesktop();
    const isTablet = this.deviceService.isTablet();
    
    pdf.add(await new Img('assets/Logo-Pdf-2.png').width(520).build());
    pdf.add(new Txt('').margin([0,10]).end);
    pdf.add(titulo);
    pdf.add(new Txt('').margin([0,4]).end);
    pdf.add(tabla);

    if(isMobile || isTablet){
      pdf.create().download(); // Se genera PDF y se descarga    
    }else{
      pdf.create().open(); // Se genera PDF y se abre en otra pestaña  
    }
  
  }

  extractData(): any{
    return this.seleccionados.map( seleccionado => [
        new Txt(seleccionado.descripcion).fontSize(8).margin([0, 10]).end, 
        new Txt('$' + new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(seleccionado.precio)).fontSize(8).alignment('center').margin([0, 10]).end,
        new Txt(seleccionado.cantidad).alignment('center').fontSize(8).margin([0, 10]).end,
        new Txt('$' + new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(seleccionado.total)).fontSize(8).alignment('center').margin([0, 10]).end,
      ],
    );
  }

  // Agregar producto al presupuesto
  agregarProducto(txtCantidad: any): void{

    if(txtCantidad.value.trim() === '' || txtCantidad.value === '0'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe colocar una cantidad valida',
        confirmButtonText: 'Entendido'
      })
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
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Este producto ya esta agregado',
        confirmButtonText: 'Entendido'
      });
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
    this.loading = true;
    this.productosService.listarProductos(
      this.limit,
      0,
      true,
      this.descripcion
    ).subscribe(({productos, total}) => {
      this.total = total;
      this.productos = productos;
      this.loading = false;
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loading = false;
    });
  }

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === ''){
      this.productos = [];  
    }else{
      this.loading = true;
      this.descripcion = descripcion;
      this.buscarProducto();  
    }
  }

  // Eliminar presupuesto
  eliminarPresupuesto(): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por eliminar el presupuesto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.seleccionados = [];
        this.precioTotal = 0;
      }
    })
  }

}
