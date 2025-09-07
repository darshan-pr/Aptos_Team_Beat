// This file is now deprecated - use projectStore from /lib/projectStore.ts instead
// Keeping for backward compatibility during migration

import { projectStore } from "@/lib/projectStore";

// Re-export types and functions for backward compatibility
export type { Project as SharedProject, ProjectImage } from "@/lib/projectStore";

// Legacy compatibility functions
export const SHARED_PROJECTS = projectStore.getAllProjects();

export const getProjectById = (id: string) => {
  return projectStore.getProjectById(id);
};

export const getProjectImages = (id: string) => {
  const project = projectStore.getProjectById(id);
  return project?.images.map(img => img.url) || [];
};

// Legacy image mapping for backward compatibility
export const PROJECT_IMAGES = SHARED_PROJECTS.reduce((acc, project) => {
  acc[project.id] = project.images.map(img => img.url);
  return acc;
}, {} as Record<string, string[]>);
