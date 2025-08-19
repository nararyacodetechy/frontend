import { FaWhatsapp } from 'react-icons/fa';

export default function SectionHero() {
  return (
    <section className="flex pt-10 flex-col justify-center items-center text-center min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white px-6 md:px-12">
      <h2 className="text-5xl font-bold mb-10">Let's Grow into a Professional System</h2>
      <p className="text-lg mb-20 max-w-3xl text-gray-700 dark:text-gray-200">
        Mokami bantu kamu yang belum punya <span className="text-italic font-italic italic bg-black dark:bg-white text-white dark:text-black p-1">Super Team IT</span> untuk menyelesaikan masalah bisnis konvensional dengan cara yang efektif, sederhana, dan tepat sasaran.
      </p>
      <a
        href="https://wa.me/6285606241835"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-medium px-6 py-3 rounded hover:opacity-90 transition"
      >
        <FaWhatsapp className="text-xl" />
        Chat Sekarang
      </a>
    </section>
  );
}
