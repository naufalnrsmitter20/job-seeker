"use client";

import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { updateAddressById, deleteAddressById } from "@/utils/actions/address.actions";
import { useRouter } from "next/navigation";
import { AddressGetPayload } from "@/types/entity.relations";
import toast from "react-hot-toast";

export function AddressSection({ addresses }: { addresses: AddressGetPayload[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPrimaryChecked, setIsPrimaryChecked] = useState(false);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Updating address...");
    try {
      const formData = new FormData(e.target);
      formData.append("isPrimary", isPrimaryChecked ? "true" : "false");
      const result = await updateAddressById(formData, editingId as string);
      if (!result.error) {
        setEditingId(null);
        router.refresh();
        toast.success(result.message, { id: toastId });
        setIsCreating(false);
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.", { id: toastId });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const toastId = toast.loading("Deleting address...");
    try {
      const result = await deleteAddressById(id);
      if (!result.error) {
        router.refresh();
        toast.success(result.message, { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address.", { id: toastId });
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">
                Alamat <i>(Max 2)</i>
              </CardTitle>
              <CardDescription>Kelola informasi alamat Anda</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Alamat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Alamat Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Alamat Jalan</Label>
                      <Input id="street" name="street" required />
                    </div>
                    <div>
                      <Label htmlFor="city">Kota</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div>
                      <Label htmlFor="state">Provinsi</Label>
                      <Input id="state" name="state" required />
                    </div>
                    <div>
                      <Label htmlFor="country">Negara</Label>
                      <Input id="country" name="country" defaultValue="Indonesia" required />
                    </div>
                    <div>
                      <Label htmlFor="zip">Kode POS</Label>
                      <Input id="zip" name="zip" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="isPrimary">Jadikan Utama</Label>
                      <Input id="isPrimary" name="isPrimarys" onChange={(e) => setIsPrimaryChecked(e.target.checked)} type="checkbox" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Simpan Alamat
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <div className={`grid gap-4 px-4`}>
          {addresses.map((address) => (
            <Card key={address.id} className={`border-blue-100 ${address.isPrimary ? "border-blue-600 border-2 ring-4 ring-blue-200" : ""}`}>
              <CardContent className="p-4">
                {editingId === address.id ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor={`street-${address.id}`}>Alamat Jalan</Label>
                        <Input id={`street-${address.id}`} name="street" defaultValue={address.street} required />
                      </div>
                      <div>
                        <Label htmlFor={`city-${address.id}`}>Kota</Label>
                        <Input id={`city-${address.id}`} name="city" defaultValue={address.city} required />
                      </div>
                      <div>
                        <Label htmlFor={`state-${address.id}`}>Provinsi</Label>
                        <Input id={`state-${address.id}`} name="state" defaultValue={address.state} required />
                      </div>
                      <div>
                        <Label htmlFor={`country-${address.id}`}>Negara</Label>
                        <Input id={`country-${address.id}`} name="country" defaultValue={address.country} required />
                      </div>
                      <div>
                        <Label htmlFor={`zip-${address.id}`}>Kode POS</Label>
                        <Input type="number" id={`zip-${address.id}`} name="zip" defaultValue={address.zip} required />
                      </div>
                      <div className="flex justify-start gap-2 items-center">
                        <Input className="size-10 m-2" type="checkbox" id={`isPrimary-${address.id}`} name="isPrimarys" onChange={(e) => setIsPrimaryChecked(e.target.checked)} defaultChecked={address.isPrimary} />
                        <Label htmlFor={`isPrimary-${address.id}`}>Jadikan Utama</Label>
                      </div>
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
                  <div className={`flex relative items-start justify-between`}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{address.street}</span>
                      </div>
                      <div className="text-gray-600">
                        {address.city}, {address.state} {address.zip}
                      </div>
                      <Badge variant="outline">{address.country}</Badge>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                      {address.isPrimary && <Badge className="mt-2 mr-2 bg-blue-100 text-blue-700">Alamat Utama</Badge>}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(address.id)} className="border-blue-200 text-blue-600 bg-transparent">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            const confirmation = confirm("Are you sure you want to delete this address?");
                            if (confirmation) {
                              handleDeleteAddress(address.id);
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

          {addresses.length === 0 && (
            <Card className="border-dashed border-blue-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada alamat yang ditambahkan</h3>
                <p className="text-gray-600 text-center mb-4">Tambahkan informasi alamat Anda untuk melengkapi profil Anda.</p>
                <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambahkan Alamat Pertama Anda
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
