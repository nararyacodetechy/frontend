'use client'

import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';

export default function ProjectList({
  projects,
  onViewDetail,
}: {
  projects: Project[];
  onViewDetail?: (project: Project) => void;
}) {
  return (
    <div className="grid gap-4">
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} onViewDetail={onViewDetail} />
        ))
      ) : (
        <p className="text-gray-500">No projects found.</p>
      )}
    </div>
  );
}
