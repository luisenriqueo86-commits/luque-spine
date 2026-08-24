 import {
  ResearchProject,
  ResearchProjectDraft,
} from '../models/researchProject';

const STORAGE_KEY = 'luqueSpineResearchProjects';

const normalizeProject = (
  project: ResearchProject
): ResearchProject => {
  return {
    ...project,
    patientIds: Array.isArray(project.patientIds)
      ? project.patientIds
      : [],
  };
};

export const getResearchProjects = (): ResearchProject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return (parsed as ResearchProject[]).map(
      normalizeProject
    );
  } catch {
    return [];
  }
};

export const saveResearchProjects = (
  projects: ResearchProject[]
): void => {
  const normalizedProjects =
    projects.map(normalizeProject);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizedProjects)
  );
};

export const createResearchProject = (
  draft: ResearchProjectDraft
): ResearchProject => {
  const now = new Date().toISOString();

  const project: ResearchProject = {
    ...draft,
    patientIds: Array.isArray(draft.patientIds)
      ? draft.patientIds
      : [],
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  saveResearchProjects([
    ...getResearchProjects(),
    project,
  ]);

  return project;
};

export const updateResearchProject = (
  updatedProject: ResearchProject
): ResearchProject => {
  const projects = getResearchProjects();

  const project: ResearchProject =
    normalizeProject({
      ...updatedProject,
      updatedAt: new Date().toISOString(),
    });

  const updatedProjects = projects.map((item) =>
    item.id === project.id
      ? project
      : item
  );

  saveResearchProjects(updatedProjects);

  return project;
};

export const deleteResearchProject = (
  projectId: string
): void => {
  const projects =
    getResearchProjects().filter(
      (project) =>
        project.id !== projectId
    );

  saveResearchProjects(projects);
};