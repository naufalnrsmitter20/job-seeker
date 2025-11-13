import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Building2, TrendingUp, Shield, Award } from "lucide-react";
import prisma from "@/lib/prisma";
import EmptyData from "@/components/global/empty-data";
import { formatDate } from "@/lib/format";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HomePage() {
  const [featuredJobs, availablePositions, positionApplied, user, company] = await Promise.all([
    prisma.availablePosition.findMany({
      include: { Company: true },
    }),
    prisma.availablePosition.count({
      where: { status: "OPEN" },
    }),
    prisma.positionApplied.count({
      where: { applyingStatus: "ACCEPTED" },
    }),
    prisma.user.count({
      where: { role: "USER" },
    }),
    prisma.company.count(),
  ]);

  const stats = [
    { icon: Users, label: "Pencari Kerja Aktif", value: `${user}` },
    { icon: Building2, label: "Perusahaan Terdaftar", value: `${company}` },
    { icon: TrendingUp, label: "Lowongan Tersedia", value: `${availablePositions}` },
    { icon: Award, label: "Berhasil Ditempatkan", value: `${positionApplied}` },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Platform Resmi Indonesia
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-blue-900 leading-tight">
                  Temukan Pekerjaan
                  <span className="text-blue-600"> Impian Anda</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">Platform terpercaya yang menghubungkan pencari kerja dengan perusahaan terbaik di Indonesia. Mulai karir Anda atau temukan talenta terbaik untuk perusahaan Anda.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Daftar Sebagai Pencari Kerja
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 bg-transparent">
                    Daftar Sebagai HRD
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 max-w-full">
                <div className="row-span-2">
                  <Image src="/img/placeholder-3.jpg" alt="placeholder 1" width={100} height={100} unoptimized className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <Image src="/img/placeholder-2.jpg" alt="placeholder 1" width={100} height={100} unoptimized className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="col-start-2 row-start-2">
                  <Image src="/img/placeholder-1.jpg" alt="placeholder 1" width={100} height={100} unoptimized className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Lowongan Kerja Terbaru</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Temukan peluang karir terbaik dari perusahaan-perusahaan terpercaya di Indonesia</p>
          </div>
          {featuredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow border-0 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage src={job.Company?.logo || ""} alt={job.Company?.name} />
                        <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">{job.Company?.name}</AvatarFallback>
                      </Avatar>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {job.status === "OPEN" ? "Tersedia" : "Ditutup"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-blue-900">{job.positionName}</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">{job.Company.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-auto w-auto mr-2" />
                      {job.Company.address}
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      Rp. {job.salaryStartRange?.toLocaleString("ID-id")} - Rp. {job.salaryEndRange?.toLocaleString("ID-id")}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(job.updatedAt)}
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Link href={`/jobs/${job.id}`}>Lamar Sekarang</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyData title="Lowongan Kerja" />
          )}

          <div className="text-center">
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                Lihat Semua Lowongan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Siap Memulai Perjalanan Karir Anda?</h2>
            <p className="text-xl text-blue-100">Bergabunglah dengan ribuan pencari kerja dan perusahaan yang telah mempercayai platform kami</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 bg-transparent">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
