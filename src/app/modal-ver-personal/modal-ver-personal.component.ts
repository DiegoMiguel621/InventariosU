import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrabajadoresService } from '../service/trabajadores.service';
import { BienesService } from '../service/bienes.service';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-modal-ver-personal',
  templateUrl: './modal-ver-personal.component.html',
  styleUrl: './modal-ver-personal.component.css'
})
export class ModalVerPersonalComponent implements OnInit {
  trabajador: any = null; // Almacena los datos del trabajador
  bienesAsignados: any[] = [];  // lista de bienes

  constructor(
    private trabajadoresService: TrabajadoresService,
    private bienesService: BienesService, 
    public dialogRef: MatDialogRef<ModalVerPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number } // Recibimos el ID
  ) {}

  ngOnInit(): void {
    // Obtenemos los datos del trabajador
    this.trabajadoresService.getTrabajadorById(this.data.id).subscribe(
      (data) => {
        this.trabajador = data; // Asignamos los datos
        this.cargarBienesAsignados();
      },
      (error) => {
        console.error('Error al obtener los datos del trabajador:', error);
      }
    );
  }

  private cargarBienesAsignados(): void {
  this.bienesService.getBienes()
    .subscribe(bienes => {
      const nombreTrab = (this.trabajador.nombre || '')
        .trim()
        .toLowerCase();

      this.bienesAsignados = bienes.filter(b => {
        const nomRes = (b.nomRes || '')
          .trim()
          .toLowerCase();
        return nomRes === nombreTrab;
      });

      console.log('Comparando:', nombreTrab, 'contra lista de nomRes:', 
                  bienes.map(b => (b.nomRes||'').trim().toLowerCase()));
    });
}
  closeModal(): void {
    this.dialogRef.close();
  }

  async printResguardo() {
    if (!this.trabajador) return;

    const wb = new ExcelJS.Workbook();
    wb.creator = 'MiApp';
    wb.created = new Date();

    const ws = wb.addWorksheet('Resguardo', {
      pageSetup: { paperSize: 9, orientation: 'portrait' }
    });

    //
    // 1) Cabecera estática/fusionada
    //
    // ancho de columnas (aprox)
    ws.columns = [
      { width: 5 },   // A
      { width: 20 },  // B
      { width: 40 },  // C
      { width: 20 },  // D
      { width: 20 },  // E
      { width: 20 },  // F
      { width: 20 },  // G
      { width: 20 }   // ...
    ];

    // filas demasiado cortas al principio
    ws.getRow(1).height = 5;
    ws.getRow(2).height = 5;

    // Título principal (fila 3–4 fusionadas de B a G)
    ws.mergeCells('B3','G3');
    ws.getCell('B3').value = 'UNIVERSIDAD POLITÉCNICA DE PACHUCA';
    ws.getCell('B3').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('B3').font = { bold: true, size: 14 };

    ws.mergeCells('B4','G4');
    ws.getCell('B4').value = 'RESGUARDO DE BIENES MUEBLES E INTANGIBLES';
    ws.getCell('B4').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('B4').font = { bold: true, size: 12 };

    //
    // 2) Datos del trabajador (fila 6–10)
    //
    const info = [
      ['FECHA:', new Date().toLocaleDateString(), '', 'TIPO DE RESGUARDO:', 'PATRIMONIO'],
      ['NÚMERO DE RESGUARDO:', this.trabajador.numero, '', 'DOMICILIO:', 'CARR. PACHUCA-CD. SAHAGÚN...'],
      ['NOMBRE DEL RESGUARDANTE:', this.trabajador.nombre],
      ['ÁREA DE ADSCRIPCIÓN:', this.trabajador.area],
      ['ÁREA FUNCIONAL:', this.trabajador.areaFuncional]
    ];
    let rowIdx = 6;
    for (const fila of info) {
      const row = ws.getRow(rowIdx++);
      fila.forEach((txt, i) => {
        const cell = row.getCell(i+1);
        cell.value = txt;
        cell.font = { bold: i % 2 === 0 }; // etiqueta en negrita
      });
    }

    //
    // 3) Línea separadora
    //
    ws.getRow(11).border = {
      top: { style: 'thin' }
    };

    //
    // 4) Cabecera de bienes (fila 12)
    //
    const headers = [
      'NÚMERO DE INVENTARIO',
      'NOMBRE DEL BIEN',
      'MARCA',
      'MODELO',
      'NÚMERO DE SERIE'
    ];
    const encabezadoRow = ws.getRow(12);
    headers.forEach((h, i) => {
      const c = encabezadoRow.getCell(i+1);
      c.value = h;
      c.font = { bold: true };
      c.alignment = { horizontal: 'center' };
      c.fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FF673AB7'} };
      c.border = {
        top: {style:'thin'}, left:{style:'thin'},
        bottom:{style:'thin'}, right:{style:'thin'}
      };
    });
    encabezadoRow.height = 20;

    //
    // 5) Filas de bienes (desde fila 13 en adelante)
    //
    let start = 13;
    this.bienesAsignados.forEach((b, idx) => {
      const r = ws.getRow(start + idx);
      r.getCell(1).value = idx+1;
      r.getCell(2).value = b.numInvAnt;
      r.getCell(3).value = b.nombreBien;
      r.getCell(4).value = b.marca;
      r.getCell(5).value = b.modelo;
      r.getCell(6).value = b.numSerie;
      r.height = 18;
      // opcional: bordes ligeros
      for(let c=1; c<=5; c++){
        r.getCell(c).border = {
          bottom:{style:'dotted'}
        };
      }
    });

    //
    // 6) Pie de página estático (justo 2 filas después del último bien)
    //
    const after = start + this.bienesAsignados.length + 1;
    // "TOTAL DE BIENES RESGUARDADOS:"
    ws.mergeCells(`A${after}:D${after}`);
    const tcell = ws.getCell(`A${after}`);
    tcell.value = 'TOTAL DE BIENES RESGUARDADOS:';
    tcell.font = { bold: true };
    ws.getCell(`E${after}`).value = this.bienesAsignados.length;

    // Finalmente, un espacio para firmas (dos líneas más abajo)
    const firmaRow = after + 3;
    ws.mergeCells(`A${firmaRow}:B${firmaRow}`);
    ws.getCell(`A${firmaRow}`).value = 'ACEPTÓ:';
    ws.mergeCells(`C${firmaRow}:D${firmaRow}`);
    ws.getCell(`C${firmaRow}`).value = 'ELABORÓ:';
    ws.mergeCells(`E${firmaRow}:F${firmaRow}`);
    ws.getCell(`E${firmaRow}`).value = 'AUTORIZÓ:';
    [ 'ACEPTÓ:','ELABORÓ:','AUTORIZÓ:' ].forEach((_,i)=>{
      const cell = ws.getRow(firmaRow).getCell(i*2+1);
      cell.font = { bold: true };
    });

    //
    // 7) Descargar
    //
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type:'application/octet-stream' });
    saveAs(blob, `resguardo_${this.trabajador.numero}.xlsx`);
  }
}
