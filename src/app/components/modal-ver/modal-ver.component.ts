import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BienesService } from '../../service/bienes.service';

// Importaciones necesarias para generar el PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-modal-ver',
  templateUrl: './modal-ver.component.html',
  styleUrls: ['./modal-ver.component.css']
})
export class ModalVerComponent implements OnInit {
  bien: any;

  constructor(
    private dialogRef: MatDialogRef<ModalVerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idBien: number },
    private bienesService: BienesService
  ) {}

  ngOnInit(): void {
    console.log('ID recibido en el modal:', this.data.idBien);

    if (this.data && this.data.idBien) {
      this.bienesService.getBien(this.data.idBien).subscribe(
        (response) => {
          console.log('Respuesta de la API:', response);
          this.bien = response; // Almacena el objeto con todos los campos
        },
        (error) => {
          console.error('Error al obtener el bien:', error);
        }
      );
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  printBienInfo(): void {
    if (!this.bien) {
      return;
    }

    // 1) Configuración inicial de jsPDF
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
      orientation: 'portrait'
    });

    const marginLR    = 40;   // margen izquierdo/derecho en puntos
    const marginTop   = 40;   // margen superior
    const pageWidth   = doc.internal.pageSize.getWidth();       // aprox. 612pt
    const usableWidth = pageWidth - marginLR * 2;               // aprox. 532pt

    // 2) Dibujar título centrado “Información del Bien”
    const titleText = `Información del Bien ${this.bien.numInvAnt}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const textWidth = doc.getTextWidth(titleText);
    const xTitle    = marginLR + (usableWidth - textWidth) / 2;
    const yTitle    = marginTop;
    doc.text(titleText, xTitle, yTitle);

    // Línea morada debajo del título (#9e5bb5 → RGB 158,91,181)
    const lineY = yTitle + 8;
    doc.setDrawColor(158, 91, 181);
    doc.setLineWidth(2);
    doc.line(marginLR, lineY, marginLR + usableWidth, lineY);

    // 3) Preparar los datos de la tabla (cada fila: [etiqueta, valor])
    const rows: [string, any][] = [
      ['Número de inventario anterior:', this.bien.numInvAnt || ''],
      ['Número de inventario armonizado:', this.bien.numInvArm || ''],
      ['Clave de control:', this.bien.cControl || ''],
      ['Nombre del bien:', this.bien.nombreBien || ''],
      ['Clasificación del Bien:', this.bien.clasificacion || ''],
      ['Clasificación adicional del Bien:', this.bien.clasAdic || ''],
      ['Nombre del Bien (catálogo):', this.bien.nombreCat || ''],
      ['Descripción:', this.bien.descripcion || ''],
      ['Marca:', this.bien.marca || ''],
      ['Modelo:', this.bien.modelo || ''],
      ['Número de serie:', this.bien.numSerie || ''],
      ['Aplica registro contable:', this.bien.aplicaRegCont || ''],
      ['Grupo de Bienes (Contabilidad):', this.bien.grupoBienesCont || ''],
      ['Grupo de Bienes (CONAC):', this.bien.grupoBienesConac || ''],
      ['Categoría:', this.bien.categoria || ''],
      ['Subcategoría:', this.bien.subcategoria || ''],
      ['Tipo de Alta:', this.bien.tipoAlta || ''],
      ['Factura Física:', this.bien.facturaFisica || ''],
      ['Fecha Recepción Factura:', this.bien.fechaRecFact || ''],
      ['Número de Factura:', this.bien.numFact || ''],
      ['Fecha Factura:', this.bien.fechaFact || ''],
      ['Fecha Alta:', this.bien.fechaAlta || ''],
      ['Costo Adquisición:', this.bien.costoAdq || ''],
      ['Costo Adquisición Contable:', this.bien.costoAdqCont || ''],
      ['Depreciación:', this.bien.depreciacion || ''],
      ['Frecuencia Depreciación:', this.bien.frecDepre || ''],
      ['% Depreciación Anual:', this.bien.porcDepAnual || ''],
      ['Meses a Depreciar:', this.bien.mesesDepre || ''],
      ['Importe Mensual Depreciación:', this.bien.impMensDepre || ''],
      ['Monto Depreciado:', this.bien.montoDepre || ''],
      ['Valor en Libros:', this.bien.valLibros || ''],
      ['Meses Pendientes Depreciación:', this.bien.mesesPendDepre || ''],
      ['Clave del Proyecto:', this.bien.claveProyecto || ''],
      ['Aplica Proyecto:', this.bien.apProye || ''],
      ['Partida Presupuestal:', this.bien.partPres || ''],
      ['Fuente de Financiamiento:', this.bien.fuenteFinan || ''],
      ['Número de Cuenta:', this.bien.numCuenta || ''],
      ['Nombre Proveedor:', this.bien.proveedor || ''],
      ['RFC del Proveedor:', this.bien.rfcProveedor || ''],
      ['Domicilio del Proveedor:', this.bien.domProveedor || ''],
      ['Bienes Menores:', this.bien.bienesMenores || ''],
      ['Tipo de Resguardo:', this.bien.tipoResguardo || ''],
      ['Nombre del Resguardante:', this.bien.nomRes || ''],
      ['Número del Resguardante:', this.bien.numRes || ''],
      ['Área del Resguardante:', this.bien.areaRes || ''],
      ['Ubicación del Resguardante:', this.bien.ubiRes || ''],
      ['Observaciones 1:', this.bien.observ1 || ''],
      ['Observaciones 2:', this.bien.observ2 || ''],
      ['Comentario Contable:', this.bien.comentCont || ''],
      ['Seguimiento de Desincorporación:', this.bien.seguimDesinc || ''],
      ['Estatus del Bien:', this.bien.estatusBien || ''],
      ['Motivo de Baja:', this.bien.motBaja || ''],
      ['Fecha de Baja:', this.bien.fechaBaja || ''],
      ['Año de Adquisición:', this.bien.aAdquisicion || ''],
      ['Mes de Adquisición:', this.bien.mAdquisicion || ''],
      ['Foto del Bien:', this.bien.fotoBien || ''],
      ['Perfil del Resguardante:', this.bien.perfilRes || ''],
      ['Puesto del Resguardante:', this.bien.puestoRes || ''],
      ['Estatus del Resguardante:', this.bien.estatusRes || ''],
      ['Correo Personal del Resguardante:', this.bien.correoPerRes || ''],
      ['Correo Institucional del Resguardante:', this.bien.correoInstRes || ''],
      ['Resguardo 2016 y años anteriores:', this.bien.res16Ant || ''],
      ['Resguardo 2017 Si/No:', this.bien.res17 || ''],
      ['Resguardo 2018 Si/No:', this.bien.res18 || ''],
      ['Resguardo 2019 Si/No:', this.bien.res19 || ''],
      ['Resguardo 2020 Si/No:', this.bien.res20 || ''],
      ['Resguardo 2021 Si/No:', this.bien.res21 || ''],
      ['Resguardo 2022 Si/No:', this.bien.res22 || ''],
      ['Resguardo 2023 Si/No:', this.bien.res23 || ''],
      ['Resguardo 2024 Si/No:', this.bien.res24 || ''],
      ['Estatus del Resguardo:', this.bien.estatusResguardo || ''],
      ['Último Resguardo:', this.bien.ultimoResguardo || ''],
      ['Etiqueta:', this.bien.etiqueta || '']
    ];

    // 4) Dibujar la tabla con autoTable
    const startY = lineY + 20; // dejamos 20pt debajo de la línea morada
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    autoTable(doc, {
      startY: startY,
      theme: 'grid',
      head: [], // no necesitamos encabezado adicional
      body: rows,
      styles: {
        font: 'helvetica',
        fontSize: 12,
        cellPadding: 5,
        textColor: 20,
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250] // gris claro para filas pares
      },
      columnStyles: {
        0: { cellWidth: usableWidth * 0.4 }, // 40% para la etiqueta
        1: { cellWidth: usableWidth * 0.6 }  // 60% para el valor
      },
      margin: {
        left: marginLR,
        right: marginLR
      }
    });

    // 5) Guardar PDF
    doc.save(`Detalles_Bien_${this.bien.numInvAnt || 'info'}.pdf`);
  }
}
