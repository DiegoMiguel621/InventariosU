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
  // 1) crea workbook y hoja
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Resguardo', {
    pageSetup: { paperSize: 9, orientation: 'portrait' }
  });

  // 2) anchos de columna A–F
  ws.columns = [
    { key: 'A', width: 19.5 },
    { key: 'B', width: 10.9 },
    { key: 'C', width: 27.3 },
    { key: 'D', width: 29.97 },
    { key: 'E', width: 16.9 },
    { key: 'F', width: 14.5 },
  ];

  // 3) altura por defecto filas 1– (salvo excepciones)
  for (let i = 1; i <= 100; i++) {
    ws.getRow(i).height = 16.5;
  }

  //
  // === ENCABEZADO ESTÁTICO (filas 1–4, texto mayúsculas, negrita, tamaño 9, centrado) ===
  //
  const headerLines = [
    'UNIVERSIDAD POLITÉCNICA DE PACHUCA',
    'SECRETARÍA ADMINISTRATIVA',
    'DEPARTAMENTO DE INVENTARIOS Y PARQUE VEHICULAR',
    'RESGUARDO DE BIENES MUEBLES E INTANGIBLES QUE FORMAN PARTE DEL PATRIMONIO'
  ];
  for (let i = 0; i < 4; i++) {
    const rowNum = i + 1;
    ws.mergeCells(`A${rowNum}:F${rowNum}`);
    const cell = ws.getCell(`A${rowNum}`);
    cell.value = headerLines[i];
    cell.font = { bold: true, size: 9 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    // deja bordes por defecto
  }
  // fila 5: vacío, sin bordes ni contenido — ya está por defecto

  //
  // === SECCIÓN DATOS DE RESGUARDANTE (filas 6–10, fuente 8) ===
  //
  const infoTitles = [
    'FECHA:',
    'NÚMERO DE RESGUARDO:',
    'NOMBRE DEL RESGUARDANTE:',
    'ÁREA DE ADSCRIPCION:',
    'ÁREA FUNCIONAL:'
  ];
  // ajustamos fila 8 a altura 24.17
  ws.getRow(8).height = 25.5;
  for (let i = 0; i < infoTitles.length; i++) {
    const rowNum = 6 + i;
    const row = ws.getRow(rowNum);
    // A: título en mayúsculas, negrita, size=8
    row.getCell(1).value = infoTitles[i];
    row.getCell(1).font = { bold: true, size: 8 };
    // B: valor dinámico
    let val: string = '';
    switch (i) {
      case 0: // fecha hoy
        val = new Date().toLocaleDateString();
        break;
      case 1:
        val = `${this.trabajador.numero}`;
        break;
      case 2:
        val = `LIC. ${this.trabajador.nombre}`;
        break;
      case 3:
        val = this.trabajador.area;
        break;
      case 4:
        val = this.trabajador.areaFuncional;
        break;
    }
    row.getCell(2).value = val;
    row.getCell(2).font = { size: 8 };
  }

  //
  // === SECCIÓN DOMICILIO (filas 6–8, columna D–F fusionadas 3x3) ===
  //
  const domicilioText =
    'DOMICILIO: CARR. PACHUCA-CD. SAHAGÚN, KM. 20, EX-HACIENDA DE SANTA BÁRBARA, ZEMPOALA, ' +
    'HIDALGO, C.P.43830, TELÉFONO 017715477510. CORREO ELECTRÓNICO www.upp.edu.mx';
  ws.mergeCells('D6:F8');
  const domCell = ws.getCell('D6');
  domCell.value = domicilioText;
  domCell.font = { size: 8 };
  domCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

  //
  // === TIPO DE RESGUARDO (filas 9–10) ===
  //
  // D9:D10 fusionada, etiqueta
  ws.mergeCells('D9:D10');
  const tCell = ws.getCell('D9');
  tCell.value = 'TIPO DE RESGUARDO:';
  tCell.font = { bold: true, size: 8 };
  tCell.alignment = { vertical: 'middle', horizontal: 'left' };
  // E9:F10 fusionada, valor
  ws.mergeCells('E9:F10');
  const tvCell = ws.getCell('E9');
  tvCell.value = 'ACTUALIZACIÓN 2024-PA.';
  tvCell.font = { size: 8 };
  tvCell.alignment = { vertical: 'middle', horizontal: 'center' };

  //
  // === SEPARADOR (fila 11 altura=8, fusionada A–F) ===
  //
  ws.getRow(11).height = 8.5;
  ws.mergeCells('A11:F11');

  //
  // — salto filas 12–48 (las dejamos vacías para tu sección dinámica) —
  //

  //
  // === PIE ESTÁTICO (filas 49–57) todas A–F fusionadas, fuente 10 ===
  //
  const pie1Text =
    'IMPORTANTE: El resguardante se obliga a la responsabilidad que emana del presente documento durante ' +
    'el tiempo que tenga asignado estos bienes, utilizándolos estrictamente para el desarrollo de las funciones ' +
    'que se le encomienden, evitando el uso abusivo, sustracción, destrucción, ocultamiento o inutilización indebida ' +
    'de los mismos; asimismo, a notificar oportunamente a la Secretaría Administrativa cualquier incidencia que ' +
    'sufran los bienes descritos en este resguardo.';
  [49, 50].forEach(rn => ws.getRow(rn).height = 16);
  ws.getRow(51).height = 33;
  ws.mergeCells('A49:F51');
  const p1 = ws.getCell('A49');
  p1.value = pie1Text;
  p1.font = { size: 10 };
  p1.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

  // Ley General
  const leyCell = ws.getCell('A52');
  ws.mergeCells('A52:F52');
  leyCell.value = 'LEY GENERAL DE RESPONSABILIDADES ADMINISTRATIVAS';
  leyCell.font = { bold: true, size: 10 };
  leyCell.alignment = { horizontal: 'center' };

  // Artículo 7
  const artCell = ws.getCell('A53');
  ws.mergeCells('A53:F55');
  artCell.value =
    'Artículo 7. Los Servidores Públicos observarán en el desempeño de su empleo, cargo o comisión, ' +
    'los principios de disciplina, legalidad, objetividad, profesionalismo, honradez, lealtad, imparcialidad, ' +
    'integridad, rendición de cuentas, eficacia y eficiencia que rigen el servicio público. Para la efectiva ' +
    'aplicación de dichos principios, los Servidores Públicos observarán las siguientes directrices:';
  artCell.font = { size: 10 };
  artCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

  // Directriz VI
  const viCell = ws.getCell('A56');
  ws.mergeCells('A56:F57');
  viCell.value =
    'VI. Administrar los recursos públicos que estén bajo su responsabilidad, sujetándose a los ' +
    'principios de austeridad, eficiencia, eficacia, economía, transparencia y honradez para satisfacer ' +
    'los objetivos a los que estén destinados.';
  viCell.font = { size: 10 };
  viCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

  //
  // === OBSERVACIONES + firmas (filas 58–66) ===
  //
  ws.getCell('A58').value = 'OBSERVACIONES:';
  ws.getCell('A58').font = { bold: true, size: 10 };

  // fila 59 separador
  ws.getRow(59).height = 16.5;
  ws.mergeCells('A59:F59');

  // fila 60: ACEPTO / ELABORÓ / REVISÓ / AUTORIZÓ
  ws.getRow(60).height = 15.63;
  ws.mergeCells('A60:B60');
  ws.getCell('A60').value = 'ACEPTÓ';
  ws.getCell('A60').font = { bold: true, size: 10 };
  ws.getCell('A60').alignment = { horizontal: 'center' };

  ws.getCell('C60').value = 'ELABORÓ';
  ws.getCell('C60').font = { bold: true, size: 10 };
  ws.getCell('C60').alignment = { horizontal: 'center' };

  ws.getCell('D60').value = 'REVISÓ';
  ws.getCell('D60').font = { bold: true, size: 10 };
  ws.getCell('D60').alignment = { horizontal: 'center' };

  ws.mergeCells('E60:F60');
  ws.getCell('E60').value = 'AUTORIZÓ';
  ws.getCell('E60').font = { bold: true, size: 10 };
  ws.getCell('E60').alignment = { horizontal: 'center' };

  // filas 61–62: vacías
  ws.getRow(61).height = 16.5;
  ws.getRow(62).height = 16.5;

  // fila 63: firmas dinámicas y estáticas
  ws.getRow(63).height = 16.5;
  ws.mergeCells('A63:B63');
  ws.getCell('A63').value = `LIC. ${this.trabajador.nombre}`;
  ws.getCell('A63').alignment = { horizontal: 'center' };

  ws.getCell('C63').value = 'C. FERNANDO PEÑA HERNÁNDEZ';
  ws.getCell('C63').alignment = { horizontal: 'center' };

  ws.getCell('D63').value = 'L.A.E. LUIS ALBERTO VELÁZQUEZ CRUZ';
  ws.getCell('D63').alignment = { horizontal: 'center' };

  ws.mergeCells('E63:F63');
  ws.getCell('E63').value = 'M.R.H. IDANIA ZAMORA ALVAREZ';
  ws.getCell('E63').alignment = { horizontal: 'center' };

  // fila 64
  ws.getRow(64).height = 16.5;
  ws.mergeCells('A64:B64');
  ws.getCell('A64').value = 'SUBDIRECCIÓN DE COMUNICACIÓN SOCIAL';
  ws.getCell('A64').alignment = { horizontal: 'center' };

  ws.getCell('C64').value = 'JEFE DE OFICINA DEL DEPARTAMENTO';
  ws.getCell('C64').alignment = { horizontal: 'center' };

  ws.getCell('D64').value = 'RESPONSABLE DEL DEPARTAMENTO';
  ws.getCell('D64').alignment = { horizontal: 'center' };

  ws.mergeCells('E64:F64');
  ws.getCell('E64').value = 'ENCARGADA DEL DESPACHO DE LA';
  ws.getCell('E64').alignment = { horizontal: 'center' };

  // fila 65
  ws.getRow(65).height = 16.5;
  ws.mergeCells('A65:B65');
  ws.mergeCells('E65:F65');
  ws.getCell('C65').value = 'DE INVENTARIOS';
  ws.getCell('C65').alignment = { horizontal: 'center' };
  ws.getCell('D65').value = 'DE INVENTARIOS';
  ws.getCell('D65').alignment = { horizontal: 'center' };

  // fila 66
  ws.getRow(66).height = 16.5;
  ws.getCell('A66').value = 'R-04/09-2019';
  ws.getCell('A66').font = { size: 10 };
  ws.getCell('F66').value = 'F_AF_IN-02';
  ws.getCell('F66').font = { size: 10 };
  ws.getCell('A66').alignment = { horizontal: 'left' };
  ws.getCell('F66').alignment = { horizontal: 'right' };

  //
  // 8) descarga
  //
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `resguardo_${this.trabajador.numero}.xlsx`);
}
}
