 import {
  Patient,
  PatientDraft,
  PatientScales,
  ScaleResult,
  emptyODIAnswers,
} from '../models/patient';

const STORAGE_KEY = 'luqueSpinePacientes';

const normalizarEscala = (
  escala?: Partial<ScaleResult>
): ScaleResult => {
  return {
    vas: escala?.vas ?? null,
    odi: escala?.odi ?? null,
    odiRespuestas:
      escala?.odiRespuestas ?? emptyODIAnswers(),
  };
};

const normalizarPaciente = (patient: Patient): Patient => {
  const escalas = patient.escalas;

  return {
    ...patient,

    escalas: {
      preoperatorio: normalizarEscala(
        escalas?.preoperatorio
      ),

      alta: normalizarEscala(
        escalas?.alta
      ),

      '1_mes': normalizarEscala(
        escalas?.['1_mes']
      ),

      '3_meses': normalizarEscala(
        escalas?.['3_meses']
      ),

      '6_meses': normalizarEscala(
        escalas?.['6_meses']
      ),

      '12_meses': normalizarEscala(
        escalas?.['12_meses']
      ),
    },
  };
};

export const getPatients = (): Patient[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    const patients = (parsed as Patient[]).map(
      normalizarPaciente
    );

    return patients;
  } catch {
    return [];
  }
};

export const savePatients = (
  patients: Patient[]
): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(patients)
  );
};

export const createPatient = (
  draft: PatientDraft
): Patient => {
  const now = new Date().toISOString();

  const patient: Patient = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  savePatients([
    ...getPatients(),
    patient,
  ]);

  return patient;
};

export const updatePatient = (
  updatedPatient: Patient
): Patient => {
  const patients = getPatients();

  const patient: Patient = {
    ...updatedPatient,
    updatedAt: new Date().toISOString(),
  };

  const updatedPatients = patients.map(
    (item) =>
      item.id === patient.id
        ? patient
        : item
  );

  savePatients(updatedPatients);

  return patient;
};

export const updatePatientScales = (
  patientId: string,
  escalas: PatientScales
): Patient | null => {
  const patient = getPatients().find(
    (item) => item.id === patientId
  );

  if (!patient) return null;

  return updatePatient({
    ...patient,
    escalas,
  });
};