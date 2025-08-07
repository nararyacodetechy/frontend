'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ProjectList from '@/components/project/ProjectList';
import ProjectForm from '@/components/project/ProjectForm';

type Client = {
  id: number;
  name: string;
};

type Project = {
  id: number;
  name: string;
  imageUrl: string;
  clientId: number;
  client: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  statusProgress: string;
  statusPayment: string;
};

const dummyClients: Client[] = [
  { id: 1, name: 'PT Sukses Selalu' },
  { id: 2, name: 'Laundry Kita' },
  { id: 3, name: 'Aje Dourado' },
];

const dummyProjects: Project[] = [
  {
    id: 1,
    name: 'Website Toko Online',
    imageUrl: '/images/picture-01.png',
    clientId: 1,
    client: 'PT Sukses Selalu',
    description: 'Membangun platform e-commerce lengkap dengan keranjang, checkout, dan sistem pembayaran.',
    deadline: new Date('2025-09-01'),
    createdAt: new Date('2025-07-01'),
    statusProgress: 'In Progress',
    statusPayment: '✔ total paid off',
  },
  {
    id: 2,
    name: 'Aplikasi Manajemen Laundry',
    imageUrl: '/images/picture-02.png',
    clientId: 2,
    client: 'Laundry Kita',
    description: 'Sistem untuk mencatat transaksi laundry, pelacakan pakaian, dan laporan keuangan.',
    deadline: new Date('2025-08-25'),
    createdAt: new Date('2025-07-15'),
    statusProgress: 'Planning',
    statusPayment: '[1/2] partially paid',
  },
  {
    id: 3,
    name: 'Website Startup',
    imageUrl: '/images/picture-03.png',
    clientId: 3,
    client: 'Aje Dourado',
    description: 'Website profil dan landing page untuk startup teknologi.',
    deadline: new Date('2025-07-30'),
    createdAt: new Date('2025-06-10'),
    statusProgress: 'Completed',
    statusPayment: '✖ unpaid',
  },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [clients, setClients] = useState<Client[]>(dummyClients);
  const [showForm, setShowForm] = useState(false);

  const [newProject, setNewProject] = useState<any>({
    name: '',
    client: '',
    imageUrl: '',
    description: '',
    createdAt: '',
    deadline: '',
    statusProgress: 'Planning',
    statusPayment: '✖ unpaid',
  });

  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [formStep, setFormStep] = useState(1);
  const [clientExists, setClientExists] = useState(false);
  const [projectExists, setProjectExists] = useState(false);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = () => {
    const nextId = projects.length + 1;
    const projectToAdd = {
      id: nextId,
      ...newProject,
      deadline: new Date(newProject.deadline),
      createdAt: new Date(newProject.createdAt),
      clientId: clients.find(c => c.name === newProject.client)?.id ?? nextId,
    };
    setProjects([...projects, projectToAdd]);

    setNewProject({
      name: '',
      client: '',
      imageUrl: '',
      description: '',
      createdAt: '',
      deadline: '',
      statusProgress: 'Planning',
      statusPayment: '✖ unpaid',
    });
  };

  const handleSubmit = () => {
    if (!clientExists && newClient.name) {
      const newClientId = clients.length + 1;
      setClients([...clients, { id: newClientId, name: newClient.name }]);
      setNewProject({ ...newProject, client: newClient.name });
    }
    handleAddProject();
    setShowForm(false);
    setFormStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Project List */}
      <ProjectList projects={filteredProjects} onViewDetail={(p) => alert(`View: ${p.name}`)} />

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          clients={clients}
          projects={projects}
          formStep={formStep}
          setFormStep={setFormStep}
          clientExists={clientExists}
          setClientExists={setClientExists}
          newClient={newClient}
          setNewClient={setNewClient}
          newProject={newProject}
          setNewProject={setNewProject}
          projectExists={projectExists}
          setProjectExists={setProjectExists}
          onCancel={() => {
            setShowForm(false);
            setFormStep(1);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
