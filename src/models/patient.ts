 export type PatientSex =
  | 'masculino'
  | 'femenino'
  | 'otro'
  | '';

export type FollowUpMoment =
  | 'preoperatorio'
  | 'alta'
  | '1_mes'
  | '3_meses'
  | '6_meses'
  | '12_meses';

export type ODIAnswer = number | null;

export type ODIAnswers = [
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer,
  ODIAnswer
];

export interface ScaleResult {
  vas: number | null;

  // Resultado final del ODI expresado en porcentaje.
  odi: number | null;

  // Respuestas de las 10 secciones del ODI.
  // Cada sección se puntúa de 0 a 5.
  odiRespuestas: ODIAnswers;
}

export interface PatientScales {
  preoperatorio: ScaleResult;
  alta: ScaleResult;
  '1_mes': ScaleResult;
  '3_meses': ScaleResult;
  '6_meses': ScaleResult;
  '12_meses': ScaleResult;
}

export interface Patient {
  id: string;
  nombre: string;
  ocultarNombre: boolean;
  edad: string;
  sexo: PatientSex;
  telefono: string;
  historiaClinica: string;
  seguro: string;
  clinica: string;
  tac: string;
  rmn: string;
  diagnostico: string;
  fechaCirugia: string;
  tecnica: string;
  niveles: string;
  escalas: PatientScales;
  createdAt: string;
  updatedAt: string;
}

export type PatientDraft = Omit<
  Patient,
  'id' | 'createdAt' | 'updatedAt'
>;

export const emptyODIAnswers = (): ODIAnswers => [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

export const createEmptyScaleResult = (): ScaleResult => ({
  vas: null,
  odi: null,
  odiRespuestas: emptyODIAnswers(),
});

export const emptyPatientScales: PatientScales = {
  preoperatorio: createEmptyScaleResult(),
  alta: createEmptyScaleResult(),
  '1_mes': createEmptyScaleResult(),
  '3_meses': createEmptyScaleResult(),
  '6_meses': createEmptyScaleResult(),
  '12_meses': createEmptyScaleResult(),
};

export const emptyPatientDraft: PatientDraft = {
  nombre: '',
  ocultarNombre: false,
  edad: '',
  sexo: '',
  telefono: '',
  historiaClinica: '',
  seguro: '',
  clinica: '',
  tac: '',
  rmn: '',
  diagnostico: '',
  fechaCirugia: '',
  tecnica: '',
  niveles: '',

  escalas: {
    preoperatorio: createEmptyScaleResult(),
    alta: createEmptyScaleResult(),
    '1_mes': createEmptyScaleResult(),
    '3_meses': createEmptyScaleResult(),
    '6_meses': createEmptyScaleResult(),
    '12_meses': createEmptyScaleResult(),
  },
};