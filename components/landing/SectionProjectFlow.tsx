'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const flowSteps = [
  {
    step: 1,
    position: 'left',
    title: 'Konsultasi dengan Product Manager',
    goal: 'Memahami kebutuhan dan struktur sistem klien.',
    stages: [
      'Diskusi awal dan pengenalan sistem konvensional klien',
      'Analisis data & kebutuhan',
      'Pembuatan dan revisi alur sistem',
      'Diskusi paket & harga, lalu deal pembayaran awal'
    ],
    discussions: [
      {
        title: 'Diskusi 1',
        points: [
          'Penjelasan sistem lama/konvensional klien',
          'PM memahami struktur dan kebutuhan',
          'Klien menyerahkan data dasar'
        ]
      },
      {
        title: 'Diskusi 2',
        points: [
          'PM menyampaikan alur sistem awal',
          'Klien revisi dan diskusi lebih dalam',
          'Pembahasan paket dan harga',
          'ACC & pembayaran awal'
        ]
      }
    ]
  },
  {
    step: 2,
    position: 'right',
    title: 'Desain UI/UX oleh Designer',
    goal: 'Menghasilkan desain visual sesuai alur sistem yang disepakati.',
    stages: [
      'Pembahasan gaya desain & referensi',
      'Proses desain UI awal',
      'Revisi desain & alur',
      'ACC & pembayaran kedua',
      'Penyerahan desain final'
    ],
    discussions: [
      {
        title: 'Diskusi 1',
        points: [
          'Diskusi palet warna & style',
          'Klien memberi contoh referensi',
          'Persetujuan konsep visual'
        ]
      },
      {
        title: 'Diskusi 2',
        points: [
          'Review desain awal',
          'Revisi alur dan tampilan',
          'Konfirmasi final desain',
          'ACC & pembayaran tahap 2'
        ]
      }
    ]
  },
  {
    step: 3,
    position: 'left',
    title: 'Pengembangan oleh Developer',
    goal: 'Mengembangkan sistem sesuai desain dan kebutuhan.',
    stages: [
      'Diskusi teknologi dan tujuan sistem',
      'Proses coding dan pengembangan fitur',
      'Demo & uji coba internal',
      'Revisi sistem',
      'Edukasi awal & penguatan keamanan'
    ],
    discussions: [
      {
        title: 'Diskusi 1',
        points: [
          'Pembahasan teknologi backend/frontend',
          'Pemetaan fitur dan tujuan teknis'
        ]
      },
      {
        title: 'Diskusi 2',
        points: [
          'Demo versi awal',
          'Uji coba internal bersama klien',
          'Catat bug & revisi'
        ]
      },
      {
        title: 'Diskusi 3',
        points: [
          'Demo final',
          'Pelatihan penggunaan',
          'Review keamanan sistem'
        ]
      }
    ]
  },
  {
    step: 4,
    position: 'right',
    title: 'DevOps dan Launching',
    goal: 'Menjalankan dan mempublikasikan aplikasi secara stabil & aman.',
    stages: [
      'Pembuatan akun & akses',
      'Edukasi dan pelatihan terakhir',
      'Deployment dan domain setup',
      'Final test',
      'ACC & pembayaran akhir',
      'Serah terima & pengalihan keamanan'
    ],
    discussions: [
      {
        title: 'Diskusi 1',
        points: [
          'Pembuatan akun admin/opsional',
          'Persiapan hosting & domain',
          'Penyerahan akses sementara'
        ]
      },
      {
        title: 'Diskusi 2',
        points: [
          'Final testing dan validasi fungsi',
          'ACC akhir dan pembayaran lunas',
          'Pengalihan keamanan akun ke klien'
        ]
      }
    ]
  }
]

export default function SectionProjectFlow() {
  const [openDetails, setOpenDetails] = useState<number[]>([]); // menyimpan index step yang terbuka

  const toggleDetail = (idx: number) => {
    setOpenDetails((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="relative w-full px-6 md:px-12">
      <div className="flex flex-col pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
            Bagaimana Memulainya?
        </h2>
        <p className="text-lg md:text-lg text-gray-700 text-center italic">
            Melalui 4 tahapan sederhana
        </p>
      </div>

      {/* Garis tengah */}
      <div className="absolute top-36 bottom-0 left-1/2 w-1 bg-gray-300 dark:bg-neutral-600 -translate-x-1/2 z-0" />

      <div className="relative z-10 mx-auto flex flex-col">
        {flowSteps.map((step, idx) => {
          const isLeft = step.position === 'left';
          const isOpen = openDetails.includes(idx);

          return (
            <div
              key={idx}
              className={cn(
                'relative flex items-start w-full',
                isLeft ? 'justify-start' : 'justify-end'
              )}
            >
              {/* Cabang melengkung dari tengah */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.15 }}
                className={cn(
                  'absolute top-24 w-[110px] h-[45px] overflow-hidden',
                  isLeft
                    ? 'left-1/2 -translate-x-full origin-right'
                    : 'left-1/2 origin-left'
                )}
              >
                <div
                  className={cn(
                    'w-full h-full border-t-2 border-gray-300',
                    isLeft
                      ? 'border-r-4 rounded-tr-full ml-0.5'
                      : 'border-l-4 rounded-tl-full -ml-0.5'
                  )}
                />
              </motion.div>

              {/* Box konten */}
              <motion.div
                initial={{ opacity: 1, x: isLeft ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.15 + 0.1 }}
                className={cn(
                  'w-full md:w-[42%] p-6 rounded-lg shadow-md border-2 border-gray-300 bg-white dark:bg-neutral-800 relative'
                )}
              >
                {/* Nomor step */}
                <div className="absolute -top-8 left-0 right-0 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 text-black flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                </div>

                {/* Judul & Goal */}
                <h3 className="text-xl mt-5 text-center font-bold text-gray-800 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-300 italic mb-4">
                  {step.goal}
                </p>

                {/* Tombol Lihat Detail */}
                <div className="flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toggleDetail(idx)}
                    className="mt-2 px-4 py-1 text-sm text-black dark:text-white border border-gray-800 bg-white dark:bg-black rounded-md transition"
                  >
                    {isOpen ? 'Sembunyikan' : 'Lihat Detail'}
                  </motion.button>
                </div>

                {/* Detail: hanya muncul jika open */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 space-y-4"
                    >
                      {/* Stages */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700 dark:text-white">Tahapan:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-neutral-300">
                          {step.stages.map((stage, stageIdx) => (
                            <li key={stageIdx}>{stage}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Discussions */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700 dark:text-white">Diskusi:</h4>
                        <div className="space-y-3">
                          {step.discussions.map((discussion, dIdx) => (
                            <div key={dIdx}>
                              <p className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-1">
                                {discussion.title}
                              </p>
                              <ul className="list-decimal pl-5 text-sm text-gray-700 dark:text-neutral-300 space-y-1">
                                {discussion.points.map((point, pIdx) => (
                                  <li key={pIdx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
