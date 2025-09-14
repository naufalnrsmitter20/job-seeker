import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">JobSeeker Indonesia</span>
              </div>
              <p className="text-blue-200">Platform resmi pemerintah Indonesia untuk menghubungkan pencari kerja dengan perusahaan.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Untuk Pencari Kerja</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="/jobs" className="hover:text-white">
                    Cari Lowongan
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white">
                    Buat Profil
                  </Link>
                </li>
                <li>
                  <Link href="/tips" className="hover:text-white">
                    Tips Karir
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Untuk Perusahaan</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="/post-job" className="hover:text-white">
                    Pasang Lowongan
                  </Link>
                </li>
                <li>
                  <Link href="/candidates" className="hover:text-white">
                    Cari Kandidat
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Harga
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Kontak Kami
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2025 JobSeeker Indonesia. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
