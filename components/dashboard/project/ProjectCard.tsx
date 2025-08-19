'use client'

import { Project } from '@/types/project';

export default function ProjectCard({
  project,
  onViewDetail,
}: {
  project: Project;
  onViewDetail?: (project: Project) => void;
}) {
  const getProgressStatusClass = (status: string) => {
    if (status.toLowerCase().includes('not started')) return 'border-gray-400 text-gray-600';
    if (status.toLowerCase().includes('in progress')) return 'border-yellow-500 text-yellow-600';
    if (status.toLowerCase().includes('completed')) return 'border-green-600 text-green-700';
    return 'border-gray-300 text-gray-700';
  };

  const getPaymentStatusClass = (status: string) => {
    if (status.includes('unpaid')) return 'bg-red-100 text-red-700';
    if (status.includes('partially')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('paid')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition relative">
      <img
        src={project.imageUrl || ''}
        alt={project.name}
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = '/images/no-picture-project.png';
        }}
        className="w-40 h-full object-cover rounded-md border border-gray-400"
      />

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <div className="flex items-center gap-2">
            <button
              className="text-gray-500 cursor-pointer hover:text-green-600 border border-gray-400 hover:bg-gray-100 rounded-md p-2"
              title="View Details"
              onClick={() => onViewDetail?.(project)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
            </button>

            {/* Edit */}
            <button
                className="text-gray-500 hover:text-yellow-600 cursor-pointer border border-gray-400 hover:bg-gray-100 rounded-md py-1 pl-0.5 pr-1.5"
                title="Edit Project"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 16H9v-2.828z"
                    />
                </svg>
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600">Client: {project.client}</p>
        <p className="text-sm text-gray-600">Created: {project.createdAt.toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Deadline: {project.deadline.toLocaleDateString()}</p>
        <p className="mt-2 text-gray-700 text-sm line-clamp-2">{project.description}</p>
        <div className="w-full flex justify-between">
          <p className={`text-sm font-medium mt-2 px-2 py-1 rounded border ${getProgressStatusClass(project.statusProgress)}`}>{project.statusProgress}</p>
          <p className={`text-sm font-medium mt-2 px-2 py-1 rounded ${getPaymentStatusClass(project.statusPayment)}`}>{project.statusPayment}</p>
        </div>
      </div>
    </div>
  );
}
