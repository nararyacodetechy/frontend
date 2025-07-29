import Link from 'next/link'

export default function Header() {
  return (
    <footer className="text-center text-sm text-[#888] py-8 border-t border-[#262626]">
        &copy; {new Date().getFullYear()} MokamiApp. All rights reserved.
    </footer>
  )
}
