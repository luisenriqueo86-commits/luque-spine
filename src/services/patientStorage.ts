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
 export const deletePatient = (
  patientId: string
): void => {
  const patients = getPatients().filter(
    (patient) => patient.id !== patientId
  );

  savePatients(patients);

  const rawProjects = localStorage.getItem(
    'luqueSpineResearchProjects'
  );

  if (!rawProjects) return;

  try {
    const projects = JSON.parse(rawProjects);

    const updatedProjects = projects.map(
      (project: any) => ({
        ...project,
        patientIds: Array.isArray(project.patientIds)
          ? project.patientIds.filter(
              (id: string) => id !== patientId
            )
          : [],
      })
    );

    localStorage.setItem(
      'luqueSpineResearchProjects',
      JSON.stringify(updatedProjects)
    );
  } catch {
    // Si los proyectos no pueden leerse,
    // no bloqueamos la eliminación del paciente.
  }
};
export const contarSeguimientosPendientes = (
  patients: Patient[]
): number => {
  const hoy = new Date();

  return patients.reduce((total, patient) => {
    if (!patient.fechaCirugia) {
      return total;
    }

    const fecha = new Date(
      `${patient.fechaCirugia}T00:00:00`
    );

    if (Number.isNaN(fecha.getTime())) {
      return total;
    }

    const meses =
      (hoy.getFullYear() - fecha.getFullYear()) * 12 +
      (hoy.getMonth() - fecha.getMonth());

    const controles = [
      { key: '1_mes', meses: 1 },
      { key: '3_meses', meses: 3 },
      { key: '6_meses', meses: 6 },
      { key: '12_meses', meses: 12 },
    ] as const;

    const pendientesPaciente = controles.filter(
      (control) => {
        if (meses < control.meses) {
          return false;
        }

        const escala =
          patient.escalas[control.key];

        const tieneVAS =
          typeof escala?.vas === 'number';

        const tieneODI =
          typeof escala?.odi === 'number';

        return !tieneVAS && !tieneODI;
      }
    ).length;

    return total + pendientesPaciente;
  }, 0);
};