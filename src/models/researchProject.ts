export interface ResearchProject {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  activo: boolean;
  patientIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ResearchProjectDraft = Omit<
  ResearchProject,
  'id' | 'createdAt' | 'updatedAt'
>;

export const emptyResearchProjectDraft: ResearchProjectDraft = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  activo: true,
  patientIds: [],
};