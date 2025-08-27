// 'use client';

// import { Feature } from '@/types/order';
// import { useState } from 'react';

// interface AddFeatureProps {
//   newFeature: Feature;
//   setNewFeature: (feature: Feature) => void;
//   handleAddFeature: () => void;
// }

// export default function AddFeature({ newFeature, setNewFeature, handleAddFeature }: AddFeatureProps) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
//       <h2 className="text-lg font-semibold mb-4">Tambah Fitur Baru</h2>
//       <div className="flex flex-col gap-3">
//         <input
//           type="text"
//           placeholder="Nama fitur"
//           className="border border-gray-400 px-3 py-2 rounded"
//           value={newFeature.name}
//           onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Fungsi"
//           className="border border-gray-400 px-3 py-2 rounded"
//           value={newFeature.function}
//           onChange={(e) => setNewFeature({ ...newFeature, function: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="Harga"
//           className="border border-gray-400 px-3 py-2 rounded"
//           value={newFeature.price}
//           onChange={(e) => setNewFeature({ ...newFeature, price: Number(e.target.value) })}
//         />
//         <input
//           type="text"
//           placeholder="Durasi"
//           className="border border-gray-400 px-3 py-2 rounded"
//           value={newFeature.duration}
//           onChange={(e) => setNewFeature({ ...newFeature, duration: e.target.value })}
//         />
//         <button
//           onClick={handleAddFeature}
//           className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
//         >
//           Tambah Fitur
//         </button>
//       </div>
//     </div>
//   );
// }