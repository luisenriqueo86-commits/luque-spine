 export type PatientSex = 'masculino' | 'femenino' | 'otro' | '';

export type FollowUpMoment =
  | 'preoperatorio'
  | 'alta'
  | '1_mes'
  | '3_meses'
  | '6_meses'
  | '12_meses';

export interface ScaleResult {
  vas: number | null;
  odi: number | null;
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

export const emptyScaleResult: ScaleResult = {
  vas: null,
  odi: null,
};

export const emptyPatientScales: PatientScales = {
  preoperatorio: { ...emptyScaleResult },
  alta: { ...emptyScaleResult },
  '1_mes': { ...emptyScaleResult },
  '3_meses': { ...emptyScaleResult },
  '6_meses': { ...emptyScaleResult },
  '12_meses': { ...emptyScaleResult },
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
    preoperatorio: { ...emptyScaleResult },
    alta: { ...emptyScaleResult },
    '1_mes': { ...emptyScaleResult },
    '3_meses': { ...emptyScaleResult },
    '6_meses': { ...emptyScaleResult },
    '12_meses': { ...emptyScaleResult },
  },
};