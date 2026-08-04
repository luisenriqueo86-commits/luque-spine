export type PatientSex = 'masculino' | 'femenino' | 'otro' | '';

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
  createdAt: string;
  updatedAt: string;
}

export type PatientDraft = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

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
};
