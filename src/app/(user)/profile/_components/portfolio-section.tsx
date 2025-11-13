"use client";

import { useState, useActionState, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Pencil, Trash2, Download, ExternalLink } from "lucide-react";
import { updatePortofolioById, deletePortofolioById } from "@/utils/actions/portofolio.actions";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { Portfolio } from "@prisma/client";
import toast from "react-hot-toast";
import Link from "next/link";

export function PortfolioSection({ portfolios }: { portfolios: Portfolio[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateAction = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Menambahkan portofolio...");
    try {
      const formdata = new FormData(e.target);
      const result = await updatePortofolioById(formdata);
      if (!result.error) {
        setIsCreating(false);
        toast.success(result.message, { id: toastId });
        router.refresh();
      } else {
        toast.error(result.message, { id: toastId });
        return result;
      }
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
      console.log(error);
      return error;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [updateState, updateAction] = useActionState(async (prev: any, formData: FormData) => {
    if (!editingId) return prev;
    const toastId = toast.loading("Memperbarui portofolio...");
    try {
      const result = await updatePortofolioById(formData, editingId);
      if (!result.error) {
        setEditingId(null);
        toast.success(result.message, { id: toastId });
        router.refresh();
      } else {
        toast.error(result.message, { id: toastId });
        return result;
      }
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
      console.log(error);
      return error;
    }
  }, null);

  const handleDeletePortofolio = async (id: string) => {
    const toastId = toast.loading("Menghapus portofolio...");
    try {
      const result = await deletePortofolioById(id);
      if (!result.error) {
        router.refresh();
        toast.success(result.message, { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Portofolio</CardTitle>
              <CardDescription>Tampilkan keahlian dan proyek Anda</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Portofolio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Tambah Item Portofolio Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input id="title" name="title" placeholder="ex. Project Alpha" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea id="description" name="description" placeholder="Jelaskan pengalaman, proyek, atau pencapaian Anda dengan keahlian ini..." rows={4} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">Lampirkan Tautan</Label>
                    <Input id="link" name="link" placeholder="tempel tautan ke karya Anda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Lampirkan Berkas</Label>
                    <Input id="file" name="file" type="file" placeholder="Unggah berkas ke karya Anda" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Tambah Portofolio
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="border-blue-100">
              <CardContent className="p-6">
                {editingId === portfolio.id ? (
                  <form action={updateAction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${portfolio.id}`}>Judul</Label>
                      <Input id={`title-${portfolio.id}`} name="title" defaultValue={portfolio.title} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${portfolio.id}`}>Deskripsi</Label>
                      <Textarea id={`description-${portfolio.id}`} name="description" defaultValue={portfolio.description} rows={4} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`link-${portfolio.id}`}>Tautan Portofolio</Label>
                      <Input id={`link-${portfolio.id}`} name="link" defaultValue={portfolio.link as string} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`file-${portfolio.id}`}>Berkas Portofolio</Label>
                      <Input id={`file-${portfolio.id}`} type="file" name="file" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                        Batal
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Simpan Perubahan
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-blue-900">{portfolio.title}</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{portfolio.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            Ditambahkan {formatDate(portfolio.createdAt)}
                          </Badge>
                          <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto" asChild>
                            <Link href={portfolio.link as string} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Lihat Proyek
                            </Link>
                          </Button>
                          <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto" asChild>
                            <a href={portfolio.file?.replace("/upload/", "/upload/fl_attachment/")} download target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                              <Download className="h-4 w-4 mr-1" />
                              Unduh Berkas
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(portfolio.id)} className="border-blue-200 text-blue-600 bg-transparent">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            const confirmation = confirm("Are you sure you want to delete this portfolio?");
                            if (confirmation) {
                              handleDeletePortofolio(portfolio.id);
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {portfolios.length === 0 && (
            <Card className="border-dashed border-blue-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">tidak ada portofolio</h3>
                <p className="text-gray-600 text-center mb-4">Tambahkan keterampilan, proyek, dan pencapaian Anda untuk menunjukkan keahlian Anda kepada calon pemberi kerja.</p>
                <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambahkan Portofolio Pertama Anda
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
