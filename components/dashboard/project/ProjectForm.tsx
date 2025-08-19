'use client'

import ProjectFormSteps from './ProjectFormSteps';
import { Project, Client } from '@/types/project';

export default function ProjectForm({
  clients,
  projects,
  formStep,
  setFormStep,
  clientExists,
  setClientExists,
  newClient,
  setNewClient,
  newProject,
  setNewProject,
  projectExists,
  setProjectExists,
  onCancel,
  onSubmit,
}: {
  clients: Client[];
  projects: Project[];
  formStep: number;
  setFormStep: (step: number) => void;
  clientExists: boolean;
  setClientExists: (exists: boolean) => void;
  newClient: { name: string; email: string; phone: string };
  setNewClient: (client: { name: string; email: string; phone: string }) => void;
  newProject: any;
  setNewProject: (p: any) => void;
  projectExists: boolean;
  setProjectExists: (exists: boolean) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Add Project</h2>

        <ProjectFormSteps
          formStep={formStep}
          setFormStep={setFormStep}
          clients={clients}
          clientExists={clientExists}
          setClientExists={setClientExists}
          newClient={newClient}
          setNewClient={setNewClient}
          newProject={newProject}
          setNewProject={setNewProject}
          projects={projects}
          projectExists={projectExists}
          setProjectExists={setProjectExists}
        />

        <div className="flex justify-between pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-red-400 text-red-600 rounded hover:bg-red-100"
          >
            Cancel
          </button>

          <div className="flex gap-4">
            {formStep > 1 && (
              <button
                onClick={() => setFormStep(formStep - 1)}
                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
              >
                Back
              </button>
            )}

            {formStep < 3 ? (
              <button
                onClick={() => setFormStep(formStep + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
