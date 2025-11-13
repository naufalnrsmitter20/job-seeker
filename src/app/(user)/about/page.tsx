import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Heart, Zap, Globe, Award, TrendingUp, CheckCircle, ArrowRight, Mail, Phone, MapPin, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami - JobSeeker Indonesia",
  description: "Pelajari lebih lanjut tentang JobSeeker Indonesia, platform pencarian kerja resmi yang menghubungkan talenta terbaik dengan perusahaan-perusahaan terkemuka.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Integritas",
      description: "Kami berkomitmen pada transparansi dan kejujuran dalam setiap interaksi dengan pengguna kami.",
    },
    {
      icon: Zap,
      title: "Inovasi",
      description: "Terus mengembangkan teknologi terdepan untuk memberikan pengalaman terbaik bagi pencari kerja.",
    },
    {
      icon: Users,
      title: "Kolaborasi",
      description: "Bekerja sama dengan perusahaan dan individu untuk membangun ekosistem kerja yang sehat.",
    },
    {
      icon: Globe,
      title: "Inklusivitas",
      description: "Memberikan kesempatan yang sama bagi semua pencari kerja tanpa diskriminasi.",
    },
  ];

  const achievements = [
    { number: "150,000+", label: "Pencari Kerja Terdaftar" },
    { number: "5,000+", label: "Perusahaan Mitra" },
    { number: "25,000+", label: "Lowongan Aktif" },
    { number: "75,000+", label: "Penempatan Sukses" },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30">Tentang Kami</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">Memberdayakan Talenta Indonesia</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              JobSeeker Indonesia adalah platform resmi pemerintah yang berkomitmen menghubungkan talenta terbaik Indonesia dengan peluang karir yang tepat, menciptakan ekosistem kerja yang adil dan berkelanjutan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Misi Kami</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Memfasilitasi pertumbuhan ekonomi Indonesia melalui pencocokan optimal antara talenta dan peluang kerja, dengan memberikan layanan berkualitas tinggi yang inklusif dan mudah diakses bagi semua level pencari kerja.
                </p>
                <ul className="space-y-3">
                  {["Menyederhanakan proses pencarian kerja untuk semua pencari kerja", "Membantu perusahaan menemukan talenta terbaik dengan efisien", "Mendukung perkembangan karir jangka panjang individu"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Visi Kami</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Menjadi platform pencarian kerja terdepan di Asia Tenggara yang menciptakan ekosistem kerja yang inklusif, transparan, dan berpusat pada pertumbuhan talenta Indonesia di era digital.
                </p>
                <ul className="space-y-3">
                  {[
                    "Platform pilihan pertama bagi jutaan pencari kerja di Indonesia",
                    "Partner terpercaya bagi perusahaan dalam rekrutmen talenta berkualitas",
                    "Membangun komunitas profesional yang saling mendukung dan berkembang bersama",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50 border-y border-blue-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Dampak Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Pencapaian nyata yang menunjukkan komitmen kami dalam memberdayakan talenta Indonesia</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Nilai-Nilai Inti Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Prinsip-prinsip yang memandu setiap keputusan dan tindakan kami</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="border-0 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Apa yang Membedakan Kami</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Platform Resmi Pemerintah",
                description: "Terpercaya dan didukung oleh lembaga pemerintah Indonesia untuk memastikan keamanan dan transparansi.",
              },
              {
                icon: TrendingUp,
                title: "Teknologi Canggih",
                description: "Menggunakan AI dan machine learning untuk memberikan rekomendasi pekerjaan yang paling relevan.",
              },
              {
                icon: Award,
                title: "Komunitas Berkualitas",
                description: "Diverifikasi dan dikurasi dengan cermat untuk memastikan kualitas pengguna dan lowongan kerja.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Bergabung dengan Kami Hari Ini</h2>
            <p className="text-xl text-blue-100">Mulai perjalanan karir Anda atau temukan talenta terbaik untuk tim Anda</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 bg-transparent">
                  Jelajahi Lowongan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Hubungi Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Kami siap membantu Anda dengan pertanyaan atau masukan</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Email</h3>
              <p className="text-gray-600">support@jobseeker.id</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Telepon</h3>
              <p className="text-gray-600">+62 821-4134-1737</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Kantor</h3>
              <p className="text-gray-600">Malang, Indonesia</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
