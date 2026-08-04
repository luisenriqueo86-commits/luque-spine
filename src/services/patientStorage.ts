import { Patient, PatientDraft } from '../models/patient';

const STORAGE_KEY = 'luqueSpinePacientes';

export const getPatients = (): Patient[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Patient[] : [];
  } catch {
    return [];
  }
};

export const savePatients = (patients: Patient[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const createPatient = (draft: PatientDraft): Patient => {
  const now = new Date().toISOString();
  const patient: Patient = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  savePatients([...getPatients(), patient]);
  return patient;
};
