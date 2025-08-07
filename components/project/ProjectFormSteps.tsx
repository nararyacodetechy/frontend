'use client';

import { Client, Project } from '@/types/project';
import React from 'react';

type ProjectFormStepsProps = {
  formStep: number;
  setFormStep: (step: number) => void;
  clients: Client[];
  clientExists: boolean;
  setClientExists: (value: boolean) => void;
  newClient: { name: string; email: string; phone: string };
  setNewClient: (client: { name: string; email: string; phone: string }) => void;
  newProject: any;
  setNewProject: (project: any) => void;
  projects: Project[];
  projectExists: boolean;
  setProjectExists: (value: boolean) => void;
};

export default function ProjectFormSteps({
  formStep,
  setFormStep,
  clients,
  clientExists,
  setClientExists,
  newClient,
  setNewClient,
  newProject,
  setNewProject,
  projects,
  projectExists,
  setProjectExists,
}: ProjectFormStepsProps) {
  return (
    <>
      {/* Step indicator */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span className={formStep === 1 ? 'font-semibold text-blue-600' : ''}>1. Klien</span>
        <span className={formStep === 2 ? 'font-semibold text-blue-600' : ''}>2. Proyek</span>
        <span className={formStep === 3 ? 'font-semibold text-blue-600' : ''}>3. Ringkasan</span>
      </div>

      {/* Step 1: Client */}
      {formStep === 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={clientExists}
              onChange={() => setClientExists(!clientExists)}
            />
            <label className="text-sm">Klien sudah terdaftar</label>
          </div>

          {clientExists ? (
            <select
              value={newProject.client}
              onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Pilih Klien</option>
              {clients.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="text"
                placeholder="Nama Klien"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email Klien"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="No Telepon Klien"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}
        </div>
      )}

      {/* Step 2: Project */}
      {formStep === 2 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={projectExists}
              onChange={() => setProjectExists(!projectExists)}
            />
            <label className="text-sm">Proyek sudah didaftarkan klien</label>
          </div>

          {projectExists ? (
            <select
              value={newProject.name}
              onChange={(e) => {
                const selected = projects.find(
                  (p) => p.name === e.target.value && p.client === newProject.client
                );
                if (selected) {
                  setNewProject({
                    ...selected,
                    createdAt: selected.createdAt.toISOString().split('T')[0],
                    deadline: selected.deadline.toISOString().split('T')[0],
                  });
                }
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Pilih Proyek</option>
              {projects
                .filter((p) => p.client === newProject.client)
                .map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
            </select>
          ) : (
            <>
              <input
                type="text"
                placeholder="Nama Proyek"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="URL Gambar (Opsional)"
                value={newProject.imageUrl}
                onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Deadline"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Tanggal dibuat"
                value={newProject.createdAt}
                onChange={(e) => setNewProject({ ...newProject, createdAt: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}
        </div>
      )}

      {/* Step 3: Summary */}
      {formStep === 3 && (
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Klien:</strong> {newProject.client}</p>
          <p><strong>Proyek:</strong> {newProject.name}</p>
          <p><strong>Gambar:</strong> {newProject.imageUrl || 'N/A'}</p>
          <p><strong>Deadline:</strong> {newProject.deadline}</p>
          <p><strong>Tanggal dibuat:</strong> {newProject.createdAt}</p>
          <p><strong>Status Progress:</strong> {newProject.statusProgress}</p>
          <p><strong>Status Payment:</strong> {newProject.statusPayment}</p>
        </div>
      )}
    </>
  );
}
