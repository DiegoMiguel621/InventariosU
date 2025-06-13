import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { TrabajadoresService } from '../service/trabajadores.service';
import { BienesService } from '../service/bienes.service';
import { ModalTipoResguardoComponent } from '../modal-tipo-resguardo/modal-tipo-resguardo.component';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';


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
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, // Recibimos el ID
    private dialog: MatDialog,
    private http: HttpClient
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

  openModalTipoResguardo(): void {
    const dialogRef = this.dialog.open(ModalTipoResguardoComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((resultado: string | string[] | null) => {
      if (!resultado) {
        // El usuario canceló o no marcó nada
        return;
      }

      // Si vino un arreglo, iteramos sobre cada flag
      if (Array.isArray(resultado)) {
        resultado.forEach(flag => {
          if (flag === 'PATRIMONIO_EXCEL') {
            this.printResguardoPatrimonio();
          } else if (flag === 'SUJETO_CONTROL_EXCEL') {
            this.printResguardoSujetoControl();
          }
        });
        return;
      }

      // Si vino un único string, ejecutamos la función correspondiente
      if (resultado === 'PATRIMONIO_EXCEL') {
        this.printResguardoPatrimonio();
      }
      if (resultado === 'SUJETO_CONTROL_EXCEL') {
        this.printResguardoSujetoControl();
      }
    });
  }

  private async fetchImageAsUint8Array(url: string): Promise<Uint8Array> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Error ${resp.status} al cargar imagen ${url}`);
  }
  const buffer = await resp.arrayBuffer();
  return new Uint8Array(buffer);
}
     //
     // IMPRESION DE RESGUARDOS
     //
     async printResguardoPatrimonio() {
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

  // Helper fetchImageAsUint8Array ya declarado más arriba
  let logoUppUint8: Uint8Array;
  let logoHidalgoUint8: Uint8Array;
  let lineaHorUint8: Uint8Array;
  try {
    logoUppUint8     = await this.fetchImageAsUint8Array('/assets/images/logoUpp.png');
    logoHidalgoUint8 = await this.fetchImageAsUint8Array('/assets/images/logoHidalgo.png');
    lineaHorUint8 = await this.fetchImageAsUint8Array('/assets/images/lineaHorizontal.jpg');
  } catch (err) {
    console.error('Error cargando imágenes:', err);
    // Si quieres continuar sin logos, comenta el return siguiente:
    return;
  }

  const logoUppId     = wb.addImage({ buffer: logoUppUint8,    extension: 'png' });
  const logoHidalgoId = wb.addImage({ buffer: logoHidalgoUint8, extension: 'png' });
  const logoHorId = wb.addImage({ buffer: lineaHorUint8, extension: 'png' });

  ws.addImage(logoUppId, {
  tl: {
    // "0.7" significa 70% hacia la derecha de la columna A,
    // "0.4" significa 40% hacia abajo de la fila 1
    col: 0.7,
    row: 0.4
  },
  ext: {
    width:  79,   // tu ancho en puntos
    height: 77    // tu alto en puntos
  }
});

  ws.addImage(logoHidalgoId, {
  tl: {
    col: 5   + 0.2,  // columna F (5), desplazado un 20% dentro de F
    row: 0.3        // 30% hacia abajo de la fila 1
  },
  ext: {
    width:  78,
    height: 77
  }
});

ws.addImage(logoHorId, 'A16:C16');
//logoHorId

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
  // fila 5: vacío, sin bordes ni contenido

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
  // fila 8
  ws.getRow(8).height = 25.7;
  for (let i = 0; i < infoTitles.length; i++) {
  const rowNum = 6 + i;
  const row = ws.getRow(rowNum);

  // fusionar B y C
  ws.mergeCells(`B${rowNum}:C${rowNum}`);

  // A: título
  row.getCell(1).value = infoTitles[i];
  row.getCell(1).font = { bold: true, size: 8, name: 'Arial' };
  row.getCell(1).alignment = { wrapText: true, vertical: 'middle' };

  // B (y C): valor dinámico
  let val = '';
  switch (i) {
    case 0:
      const hoy = new Date();
      const nombresMes = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
      ];
      val = `${hoy.getDate()} DE ${nombresMes[hoy.getMonth()]} DE ${hoy.getFullYear()}`;
      break;

    case 1: val = `${this.trabajador.numero}`;      break;
    case 2: val = `LIC. ${this.trabajador.nombre}`; break;
    case 3: val = this.trabajador.area;             break;
    case 4: val = this.trabajador.areaFuncional;    break;
  }
  val = val.toString().toUpperCase();

  row.getCell(2).value = val;
  row.getCell(2).font = { size: 8, name: 'Arial' };
  row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
}

  //
  // === SECCIÓN DOMICILIO (filas 6–8, columna D–F fusionadas 3x3) ===
  //
  const domicilioText =
    'DOMICILIO: CARR. PACHUCA-CD. SAHAGÚN, KM. 20, EX-HACIENDA DE SANTA \u200A\n BÁRBARA, ZEMPOALA, ' +
    'HIDALGO, C.P.43830, TELÉFONO 017715477510. CORREO \u200A\n ELECTRÓNICO www.upp.edu.mx';
  ws.mergeCells('D6:F8');
  const domCell = ws.getCell('D6');
  domCell.value = domicilioText;
  domCell.font = { size: 8 };
  domCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

  //
  // === TIPO DE RESGUARDO (filas 9–10) ===
  //
  ws.mergeCells('D9:D10');
  const tCell = ws.getCell('D9');
  tCell.value = 'TIPO DE RESGUARDO:';
  tCell.font = { bold: true, size: 8 };
  tCell.alignment = { vertical: 'middle', horizontal: 'left' };
  // E9:F10 fusionada
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

  // 1) FILTRAR ÚNICAMENTE LOS BIENES “PATRIMONIO”
  const patrimonios = this.bienesAsignados.filter(b =>
    (b.tipoResguardo || '').trim().toUpperCase() === 'PATRIMONIO'
  );

  // 2) DEFINIR FILA 12: ENCABEZADOS DE LA TABLA DE BIENES  
  const headerRowIndex = 12;
  const headerRow = ws.getRow(headerRowIndex);
  headerRow.height = 16.5;

  // Columna A
  headerRow.getCell(1).value = 'NÚMERO DE INVENTARIO';
  headerRow.getCell(1).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // Columnas B + C
  ws.mergeCells(`B${headerRowIndex}:C${headerRowIndex}`);
  const bcCell = headerRow.getCell(2);
  bcCell.value = 'NOMBRE DEL BIEN';
  bcCell.font = { name: 'Arial', size: 8, bold: true };
  bcCell.alignment = { horizontal: 'center', wrapText: true };

  // Columna D
  headerRow.getCell(4).value = 'MARCA';
  headerRow.getCell(4).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(4).alignment = { horizontal: 'center', wrapText: true };

  // Columna E
  headerRow.getCell(5).value = 'MODELO';
  headerRow.getCell(5).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(5).alignment = { horizontal: 'center', wrapText: true };

  // Columna F
  headerRow.getCell(6).value = 'NÚMERO DE SERIE';
  headerRow.getCell(6).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(6).alignment = { horizontal: 'center', wrapText: true };

  headerRow.commit();

  // 3) LLENAR FILAS DE LA 13 A LA 13 + (patrimonios.length - 1)
  let currentRow = headerRowIndex + 1; // empieza en la fila 13
  patrimonios.forEach((b, index) => {
    const r = ws.getRow(currentRow + index);
    r.height = 16.5; // altura estándar

    // Columna A = numInvAnt
    const cellA = r.getCell(1);
    cellA.value = b.numInvAnt ?? '';
    cellA.font = { name: 'Arial', size: 8, bold: false };
    cellA.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columnas B + C (fusionadas) = nombreBien
    ws.mergeCells(`B${currentRow + index}:C${currentRow + index}`);
    const cellBC = r.getCell(2);
    cellBC.value = b.nombreBien ?? '';
    cellBC.font = { name: 'Arial', size: 8, bold: false };
    cellBC.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columna D = marca
    const cellD = r.getCell(4);
    cellD.value = b.marca ?? '';
    cellD.font = { name: 'Arial', size: 8, bold: false };
    cellD.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columna E = modelo
    const cellE = r.getCell(5);
    cellE.value = b.modelo ?? '';
    cellE.font = { name: 'Arial', size: 8, bold: false };
    cellE.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columna F = numSerie
    const cellF = r.getCell(6);
    cellF.value = b.numSerie ?? '';
    cellF.font = { name: 'Arial', size: 8, bold: false };
    cellF.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    r.commit();
  });
  

  // 4) Debajo de la última fila de bienes, escribir el TOTAL
  const totalRowIndex = headerRowIndex + patrimonios.length + 1; // 12 + N bienes + 1
  const totalRow = ws.getRow(totalRowIndex);
  totalRow.height = 16.5;

  // Merge A–E en la fila total
  ws.mergeCells(`A${totalRowIndex}:E${totalRowIndex}`);
  const totalTextCell = totalRow.getCell(1);
  totalTextCell.value = 'TOTAL DE BIENES RESGUARDADOS:';
  totalTextCell.font = { name: 'Arial', size: 8, bold: true };
  totalTextCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Columna F = número de bienes patrimoniales
  const totalNumberCell = totalRow.getCell(6);
  totalNumberCell.value = patrimonios.length;
  totalNumberCell.font = { name: 'Arial', size: 8, bold: true };
  totalNumberCell.alignment = { horizontal: 'center', vertical: 'middle' };

  totalRow.commit();
  const primerFilaVacia = totalRowIndex + 1;
for (let fila = primerFilaVacia; fila <= 48; fila++) {
  ws.mergeCells(`B${fila}:C${fila}`);
}

  //
  // === PIE ESTÁTICO (filas 49–57) todas A–F fusionadas, fuente 10 ===
  //
  const pie1Text =
    'IMPORTANTE: El resguardante se obliga a la responsabilidad que emana del presente documento durante ' +
    'el tiempo que tenga asignado estos bienes, utilizándolos estrictamente para el desarrollo de las funciones ' +
    'que se le encomienden, evitando el uso abusivo, sustracción, destrucción, ocultamiento o inutilización indebida ' +
    'de los mismos; asimismo, a notificar oportunamente a la Secretaría Administrativa cualquier incidencia que ' +
    'sufran los bienes descritos en este resguardo.';
  [49, 50].forEach(rn => ws.getRow(rn).height = 16.5);
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
  // === (filas 58–66) ===
  //
  const obCell = ws.getCell('A58');
  ws.mergeCells('A58:F58');
  obCell.value = 'OBSERVACIONES:';
  obCell.font = { size: 10, bold: true };
  obCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // fila 59 separador
  ws.getRow(59).height = 16.5;
  ws.mergeCells('A59:F59');

  // fila 60: ACEPTO / ELABORÓ / REVISÓ / AUTORIZÓ
  ws.getRow(60).height = 16.5;
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
  ws.getCell('A63').font = { size: 7 };

  ws.getCell('C63').value = 'C. FERNANDO PEÑA HERNÁNDEZ';
  ws.getCell('C63').alignment = { horizontal: 'center' };
  ws.getCell('C63').font = { size: 7 };

  ws.getCell('D63').value = 'L.A.E. LUIS ALBERTO VELÁZQUEZ CRUZ';
  ws.getCell('D63').alignment = { horizontal: 'center' };
  ws.getCell('D63').font = { size: 7 };

  ws.mergeCells('E63:F63');
  ws.getCell('E63').value = 'M.R.H. IDANIA ZAMORA ALVAREZ';
  ws.getCell('E63').alignment = { horizontal: 'center' };
  ws.getCell('E63').font = { size: 7 };

  // fila 64
  ws.getRow(64).height = 16.5;
  ws.mergeCells('A64:B64');
  ws.getCell('A64').value = `${this.trabajador.puesto}`;
  ws.getCell('A64').alignment = { horizontal: 'center' };
  ws.getCell('A64').font = { size: 7 };

  ws.getCell('C64').value = 'JEFE DE OFICINA DEL DEPARTAMENTO';
  ws.getCell('C64').alignment = { horizontal: 'center' };
  ws.getCell('C64').font = { size: 7 };

  ws.getCell('D64').value = 'RESPONSABLE DEL DEPARTAMENTO';
  ws.getCell('D64').alignment = { horizontal: 'center' };
  ws.getCell('D64').font = { size: 7 };

  ws.mergeCells('E64:F64');
  ws.getCell('E64').value = 'ENCARGADA DEL DESPACHO DE LA';
  ws.getCell('E64').alignment = { horizontal: 'center' };
  ws.getCell('E64').font = { size: 7 };

  // fila 65
  ws.getRow(65).height = 16.5;
  ws.mergeCells('A65:B65');
  ws.mergeCells('E65:F65');
  ws.getCell('C65').value = 'DE INVENTARIOS';
  ws.getCell('C65').alignment = { horizontal: 'center' };
  ws.getCell('C65').font = { size: 7 };
  ws.getCell('D65').value = 'DE INVENTARIOS';
  ws.getCell('D65').alignment = { horizontal: 'center' };
  ws.getCell('D65').font = { size: 7 };
  ws.getCell('E65').value = 'SECRETARÍA ADMINISTRATIVA';
  ws.getCell('E65').alignment = { horizontal: 'center' };
  ws.getCell('E65').font = { size: 7 };

  // fila 66
  ws.getRow(66).height = 16.5;
  ws.getCell('A66').value = 'R-04/09-2019';
  ws.getCell('A66').font = { size: 10 };
  ws.getCell('F66').value = 'F_AF_IN-02';
  ws.getCell('F66').font = { size: 10 };
  ws.getCell('A66').alignment = { horizontal: 'center' };
  ws.getCell('F66').alignment = { horizontal: 'center' };

  //
  //TODOS los bordes del resguardo
  //

  const rango = ['A6','B6','A7','B7','A8','B8','A9','B9','A10','B10', 'E9'];
  rango.forEach(coord => {
    ws.getCell(coord).border = {
      top:    { style: 'thin' },
      left:   { style: 'thin' },
      bottom: { style: 'thin' },
      right:  { style: 'thin' }
    };
  });
  
  const rangoG1 = ['A5','B5', 'C5', 'D5', 'E5', 'F5'];
  rangoG1.forEach(coord => {
    ws.getCell(coord).border = {
      bottom:    { style: 'medium' }
    };
  });

  const celdaD6 = ws.getCell('D6');
  celdaD6.border = {  
    left:   { style: 'medium' },  
    bottom: {style: 'thin'},
    right:  { style: 'medium' }
  };

  const celdaD9 = ws.getCell('D9');
  celdaD9.border = {  
    left:   { style: 'medium' },  
    right:  { style: 'thin' }
  };

  const celdaE9 = ws.getCell('E9');
  celdaE9.border = {  
    right:   { style: 'medium' }
  };
  
  const rangoFi11 = ['A11','B11', 'D11', 'E11', 'F11'];
  rangoFi11.forEach(coord => {
    ws.getCell(coord).border = {
      bottom:    { style: 'medium' },
      top:    { style: 'medium' }
    };
  });

  for (let fila = 12; fila <= 58; fila++) {
  const celdaGiz = ws.getCell(`G${fila}`);
  celdaGiz.border = {    
    left:   { style: 'medium' }
  };
  }

  const celdaA58 = ws.getCell('A58');
  celdaA58.border = {  
    bottom:   { style: 'medium' }
  };

  const rangoGen = ['A49', 'A52', 'A53', 'A56'];
  rangoGen.forEach(coord => {
    ws.getCell(coord).border = {
      top:    { style: 'thin' },
      left:   { style: 'thin' },
      bottom: { style: 'thin' },
      right:  { style: 'thin' }
    };
  });

  for (let row = 12; row <= 48; row++) {
  for (let col = 1; col <= 6; col++) {
    const cellTable = ws.getRow(row).getCell(col);
    cellTable.border = {
      top:    { style: 'thin' },
      left:   { style: 'thin' },
      bottom: { style: 'thin' },
      right:  { style: 'thin' }
    };
  }
}

  //
  // 8) descarga
  //
  wb.eachSheet(sheet => {
  sheet.eachRow(row => {
    row.eachCell(cell => {      
      const { size, bold, italic, color, underline } = cell.font || {};
      cell.font = {
        name: 'Arial',
        size,
        bold,
        italic,
        color,
        underline
      };
    });
  });
});

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `Resguardo_Patrimonio_${this.trabajador.nombre}.xlsx`);
}

async printResguardoSujetoControl() {
  if (!this.trabajador) return;
  // 1) crea workbook y hoja
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Sujeto a Control', {
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

  // Helper fetchImageAsUint8Array ya declarado más arriba
  let logoUppUint8: Uint8Array;
  let logoHidalgoUint8: Uint8Array;
  try {
    logoUppUint8     = await this.fetchImageAsUint8Array('/assets/images/logoUpp.png');
    logoHidalgoUint8 = await this.fetchImageAsUint8Array('/assets/images/logoHidalgo.png');
  } catch (err) {
    console.error('Error cargando imágenes:', err);
    // Si quieres continuar sin logos, comenta el return siguiente:
    return;
  }

  const logoUppId     = wb.addImage({ buffer: logoUppUint8,    extension: 'png' });
  const logoHidalgoId = wb.addImage({ buffer: logoHidalgoUint8, extension: 'png' });

  ws.addImage(logoUppId, {
  tl: {
    // "0.7" significa 70% hacia la derecha de la columna A,
    // "0.4" significa 40% hacia abajo de la fila 1
    col: 0.7,
    row: 0.4
  },
  ext: {
    width:  79,   // tu ancho en puntos
    height: 77    // tu alto en puntos
  }
});

  ws.addImage(logoHidalgoId, {
  tl: {
    col: 5   + 0.2,  // columna F (5), desplazado un 20% dentro de F
    row: 0.3        // 30% hacia abajo de la fila 1
  },
  ext: {
    width:  78,
    height: 77
  }
});

  //
  // === ENCABEZADO ESTÁTICO (filas 1–4, texto mayúsculas, negrita, tamaño 9, centrado) ===
  //
  const headerLines = [
    'UNIVERSIDAD POLITÉCNICA DE PACHUCA',
    'SECRETARÍA ADMINISTRATIVA',
    'DEPARTAMENTO DE INVENTARIOS Y PARQUE VEHICULAR',
    'RESGUARDO DE BIENES MUEBLES E INTANGIBLES NO INVENTARIABLES SUJETOS A CONTROL'
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
  // fila 5: vacío, sin bordes ni contenido

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
  // fila 8
  ws.getRow(8).height = 25.7;
  for (let i = 0; i < infoTitles.length; i++) {
  const rowNum = 6 + i;
  const row = ws.getRow(rowNum);

  // fusionar B y C
  ws.mergeCells(`B${rowNum}:C${rowNum}`);

  // A: título
  row.getCell(1).value = infoTitles[i];
  row.getCell(1).font = { bold: true, size: 8, name: 'Arial' };
  row.getCell(1).alignment = { wrapText: true, vertical: 'middle' };

  // B (y C): valor dinámico
  let val = '';
  switch (i) {
    case 0:
      const hoy = new Date();
      const nombresMes = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
      ];
      val = `${hoy.getDate()} DE ${nombresMes[hoy.getMonth()]} DE ${hoy.getFullYear()}`;
      break;

    case 1: val = `${this.trabajador.numero}`;      break;
    case 2: val = `C. ${this.trabajador.nombre}`; break;
    case 3: val = this.trabajador.area;             break;
    case 4: val = this.trabajador.areaFuncional;    break;
  }
  val = val.toString().toUpperCase();

  row.getCell(2).value = val;
  row.getCell(2).font = { size: 8, name: 'Arial' };
  row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
}

  //
  // === SECCIÓN DOMICILIO (filas 6–8, columna D–F fusionadas 3x3) ===
  //
  const domicilioText =
    'DOMICILIO: CARR. PACHUCA-CD. SAHAGÚN, KM. 20, EX-HACIENDA DE SANTA \u200A\n BÁRBARA, ZEMPOALA, ' +
    'HIDALGO, C.P.43830, TELÉFONO 017715477510. CORREO \u200A\n ELECTRÓNICO www.upp.edu.mx';
  ws.mergeCells('D6:F8');
  const domCell = ws.getCell('D6');
  domCell.value = domicilioText;
  domCell.font = { size: 8 };
  domCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

  //
  // === TIPO DE RESGUARDO (filas 9–10) ===
  //
  ws.mergeCells('D9:D10');
  const tCell = ws.getCell('D9');
  tCell.value = 'TIPO DE RESGUARDO:';
  tCell.font = { bold: true, size: 8 };
  tCell.alignment = { vertical: 'middle', horizontal: 'left' };
  // E9:F10 fusionada
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

  // 1) FILTRAR ÚNICAMENTE LOS BIENES “PATRIMONIO”
  const sujetosControl = this.bienesAsignados.filter(b =>
    (b.tipoResguardo || '').trim().toUpperCase() === 'SUJETO A CONTROL'
  );

  // 2) DEFINIR FILA 12: ENCABEZADOS DE LA TABLA DE BIENES  
  const headerRowIndex = 12;
  const headerRow = ws.getRow(headerRowIndex);
  headerRow.height = 16.5;

  // Columna A
  headerRow.getCell(1).value = 'CLAVE DE CONTROL';
  headerRow.getCell(1).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // Columnas B + C
  ws.mergeCells(`B${headerRowIndex}:C${headerRowIndex}`);
  const bcCell = headerRow.getCell(2);
  bcCell.value = 'NOMBRE DEL BIEN';
  bcCell.font = { name: 'Arial', size: 8, bold: true };
  bcCell.alignment = { horizontal: 'center', wrapText: true };

  // Columna D
  headerRow.getCell(4).value = 'MARCA';
  headerRow.getCell(4).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(4).alignment = { horizontal: 'center', wrapText: true };

  // Columna E
  headerRow.getCell(5).value = 'MODELO';
  headerRow.getCell(5).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(5).alignment = { horizontal: 'center', wrapText: true };

  // Columna F
  headerRow.getCell(6).value = 'NÚMERO DE SERIE';
  headerRow.getCell(6).font = { name: 'Arial', size: 8, bold: true };
  headerRow.getCell(6).alignment = { horizontal: 'center', wrapText: true };

  headerRow.commit();

  // 3) LLENAR FILAS DE LA 13 A LA 13 + (sujetosControl.length - 1)
  let currentRow = headerRowIndex + 1; // empieza en la fila 13
  sujetosControl.forEach((b, index) => {
    const r = ws.getRow(currentRow + index);
    r.height = 16.5; // altura estándar

    // Columna A = numInvAnt
    const cellA = r.getCell(1);
    cellA.value = b.cControl ?? '';
    cellA.font = { name: 'Arial', size: 8, bold: false };
    cellA.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columnas B + C (fusionadas) = nombreBien
    ws.mergeCells(`B${currentRow + index}:C${currentRow + index}`);
    const cellBC = r.getCell(2);
    cellBC.value = b.nombreBien ?? '';
    cellBC.font = { name: 'Arial', size: 8, bold: false };
    cellBC.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columna D = marca
    const cellD = r.getCell(4);
    cellD.value = b.marca ?? '';
    cellD.font = { name: 'Arial', size: 8, bold: false };
    cellD.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columna E = modelo
    const cellE = r.getCell(5);
    cellE.value = b.modelo ?? '';
    cellE.font = { name: 'Arial', size: 8, bold: false };
    cellE.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Columna F = numSerie
    const cellF = r.getCell(6);
    cellF.value = b.numSerie ?? '';
    cellF.font = { name: 'Arial', size: 8, bold: false };
    cellF.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    r.commit();
  });
  

  // 4) Debajo de la última fila de bienes, escribir el TOTAL
  const totalRowIndex = headerRowIndex + sujetosControl.length + 1; // 12 + N bienes + 1
  const totalRow = ws.getRow(totalRowIndex);
  totalRow.height = 16.5;

  // Merge A–E en la fila total
  ws.mergeCells(`A${totalRowIndex}:E${totalRowIndex}`);
  const totalTextCell = totalRow.getCell(1);
  totalTextCell.value = 'TOTAL DE BIENES RESGUARDADOS:';
  totalTextCell.font = { name: 'Arial', size: 8, bold: true };
  totalTextCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Columna F = número de bienes patrimoniales
  const totalNumberCell = totalRow.getCell(6);
  totalNumberCell.value = sujetosControl.length;
  totalNumberCell.font = { name: 'Arial', size: 8, bold: true };
  totalNumberCell.alignment = { horizontal: 'center', vertical: 'middle' };

  totalRow.commit();
  const primerFilaVacia = totalRowIndex + 1;
for (let fila = primerFilaVacia; fila <= 48; fila++) {
  ws.mergeCells(`B${fila}:C${fila}`);
}

  //
  // === PIE ESTÁTICO (filas 49–57) todas A–F fusionadas, fuente 10 ===
  //
  const pie1Text =
    'IMPORTANTE: El resguardante se obliga a la responsabilidad que emana del presente documento durante ' +
    'el tiempo que tenga asignado estos bienes, utilizándolos estrictamente para el desarrollo de las funciones ' +
    'que se le encomienden, evitando el uso abusivo, sustracción, destrucción, ocultamiento o inutilización indebida ' +
    'de los mismos; asimismo, a notificar oportunamente a la Secretaría Administrativa cualquier incidencia que ' +
    'sufran los bienes descritos en este resguardo.';
  [49, 50].forEach(rn => ws.getRow(rn).height = 16.5);
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
  // === (filas 58–66) ===
  //
  const obCell = ws.getCell('A58');
  ws.mergeCells('A58:F58');
  obCell.value = 'OBSERVACIONES:';
  obCell.font = { size: 10, bold: true };
  obCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // fila 59 separador
  ws.getRow(59).height = 16.5;
  ws.mergeCells('A59:F59');

  // fila 60: ACEPTO / ELABORÓ / REVISÓ / AUTORIZÓ
  ws.getRow(60).height = 16.5;
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
  ws.getCell('A63').value = `C. ${this.trabajador.nombre?.toString().toUpperCase()}`;
  ws.getCell('A63').alignment = { horizontal: 'center' };
  ws.getCell('A63').font = { size: 7 };

  ws.getCell('C63').value = 'C. FERNANDO PEÑA HERNÁNDEZ';
  ws.getCell('C63').alignment = { horizontal: 'center' };
  ws.getCell('C63').font = { size: 7 };

  ws.getCell('D63').value = 'L.A.E. LUIS ALBERTO VELÁZQUEZ CRUZ';
  ws.getCell('D63').alignment = { horizontal: 'center' };
  ws.getCell('D63').font = { size: 7 };

  ws.mergeCells('E63:F63');
  ws.getCell('E63').value = 'M.R.H. IDANIA ZAMORA ALVAREZ';
  ws.getCell('E63').alignment = { horizontal: 'center' };
  ws.getCell('E63').font = { size: 7 };

  // fila 64
  ws.getRow(64).height = 16.5;
  ws.mergeCells('A64:B64');
  ws.getCell('A64').value = this.trabajador.puesto?.toString().toUpperCase();
  ws.getCell('A64').alignment = { horizontal: 'center' };
  ws.getCell('A64').font = { size: 7 };

  ws.getCell('C64').value = 'JEFE DE OFICINA DEL DEPARTAMENTO';
  ws.getCell('C64').alignment = { horizontal: 'center' };
  ws.getCell('C64').font = { size: 7 };

  ws.getCell('D64').value = 'RESPONSABLE DEL DEPARTAMENTO';
  ws.getCell('D64').alignment = { horizontal: 'center' };
  ws.getCell('D64').font = { size: 7 };

  ws.mergeCells('E64:F64');
  ws.getCell('E64').value = 'ENCARGADA DEL DESPACHO DE LA';
  ws.getCell('E64').alignment = { horizontal: 'center' };
  ws.getCell('E64').font = { size: 7 };

  // fila 65
  ws.getRow(65).height = 16.5;
  ws.mergeCells('A65:B65');
  ws.mergeCells('E65:F65');
  ws.getCell('C65').value = 'DE INVENTARIOS';
  ws.getCell('C65').alignment = { horizontal: 'center' };
  ws.getCell('C65').font = { size: 7 };
  ws.getCell('D65').value = 'DE INVENTARIOS';
  ws.getCell('D65').alignment = { horizontal: 'center' };
  ws.getCell('D65').font = { size: 7 };
  ws.getCell('E65').value = 'SECRETARÍA ADMINISTRATIVA';
  ws.getCell('E65').alignment = { horizontal: 'center' };
  ws.getCell('E65').font = { size: 7 };

  // fila 66
  ws.getRow(66).height = 16.5;
  ws.getCell('A66').value = 'R-04/09-2019';
  ws.getCell('A66').font = { size: 10 };
  ws.getCell('F66').value = 'F_AF_IN-02';
  ws.getCell('F66').font = { size: 10 };
  ws.getCell('A66').alignment = { horizontal: 'center' };
  ws.getCell('F66').alignment = { horizontal: 'center' };

  //
  //TODOS los bordes del resguardo
  //

  const rango = ['A6','B6','A7','B7','A8','B8','A9','B9','A10','B10', 'E9'];
  rango.forEach(coord => {
    ws.getCell(coord).border = {
      top:    { style: 'thin' },
      left:   { style: 'thin' },
      bottom: { style: 'thin' },
      right:  { style: 'thin' }
    };
  });
  
  const rangoG1 = ['A5','B5', 'C5', 'D5', 'E5', 'F5'];
  rangoG1.forEach(coord => {
    ws.getCell(coord).border = {
      bottom:    { style: 'medium' }
    };
  });

  const celdaD6 = ws.getCell('D6');
  celdaD6.border = {  
    left:   { style: 'medium' },  
    bottom: {style: 'thin'},
    right:  { style: 'medium' }
  };

  const celdaD9 = ws.getCell('D9');
  celdaD9.border = {  
    left:   { style: 'medium' },  
    right:  { style: 'thin' }
  };

  const celdaE9 = ws.getCell('E9');
  celdaE9.border = {  
    right:   { style: 'medium' }
  };
  
  const rangoFi11 = ['A11','B11', 'D11', 'E11', 'F11'];
  rangoFi11.forEach(coord => {
    ws.getCell(coord).border = {
      bottom:    { style: 'medium' },
      top:    { style: 'medium' }
    };
  });

  for (let fila = 12; fila <= 58; fila++) {
  const celdaGiz = ws.getCell(`G${fila}`);
  celdaGiz.border = {    
    left:   { style: 'medium' }
  };
  }

  const celdaA58 = ws.getCell('A58');
  celdaA58.border = {  
    bottom:   { style: 'medium' }
  };

  const rangoGen = ['A49', 'A52', 'A53', 'A56'];
  rangoGen.forEach(coord => {
    ws.getCell(coord).border = {
      top:    { style: 'thin' },
      left:   { style: 'thin' },
      bottom: { style: 'thin' },
      right:  { style: 'thin' }
    };
  });

  for (let row = 12; row <= 48; row++) {
  for (let col = 1; col <= 6; col++) {
    const cellTable = ws.getRow(row).getCell(col);
    cellTable.border = {
      top:    { style: 'thin' },
      left:   { style: 'thin' },
      bottom: { style: 'thin' },
      right:  { style: 'thin' }
    };
  }
}

  //
  // 8) descarga
  //
  wb.eachSheet(sheet => {
  sheet.eachRow(row => {
    row.eachCell(cell => {      
      const { size, bold, italic, color, underline } = cell.font || {};
      cell.font = {
        name: 'Arial',
        size,
        bold,
        italic,
        color,
        underline
      };
    });
  });
});

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `Resguardo_SujetoControl_${this.trabajador.nombre}.xlsx`);
}
  
  
}
