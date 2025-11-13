"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Mail, Phone, Calendar, MapPin, Verified } from "lucide-react";
import { formatDate } from "@/lib/format";
import { EmployeeGetPayload } from "@/types/entity.relations";
import toast from "react-hot-toast";
import { updateUserProfilePicture } from "@/utils/actions/user.actions";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

export function ProfileHeader({ user, employee }: { user: User; employee: EmployeeGetPayload }) {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [imgValue, setImgValue] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpload = async () => {
    const toastId = toast.loading("Uploading Image...");
    setUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("image", imgValue as File);
      const upload = await updateUserProfilePicture(formdata);
      if (!upload.error) {
        toast.success(upload.message, { id: toastId });
        setImgValue(undefined);
        setUploading(false);
        setIsEditingPhoto(false);
        router.refresh();
      } else {
        toast.error(upload.message, { id: toastId });
        setUploading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message, { id: toastId });
      setUploading(false);
    }
  };

  return (
    <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Picture */}
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profile_picture || ""} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Dialog open={isEditingPhoto} onOpenChange={setIsEditingPhoto}>
              <DialogTrigger asChild>
                <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Foto Profil</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="photo">Pilih Foto</Label>
                    <Input onChange={(e) => setImgValue(e.target.files?.[0])} id="photo" type="file" accept="image/*" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditingPhoto(false)}>
                      Batal
                    </Button>
                    <Button disabled={uploading} onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                      {uploading ? "Mengunggah..." : "Unggah"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-blue-900">{employee.name}</h1>
                {user.verified && (
                  <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                    <Verified className="h-3 w-3" />
                    Terverifikasi
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {employee.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {employee.phone}
                </div>
              )}
              {employee.date_of_birth && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {formatDate(employee.date_of_birth)}
                </div>
              )}
              {employee.Company && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Saat ini di {employee.Company.name}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700">Pencari Kerja</Badge>
              {employee.gender && <Badge variant="outline">{employee.gender}</Badge>}
              <Badge variant="outline">Member sejak {formatDate(user.createdAt)}</Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:w-48">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-900">0</div>
              <div className="text-sm text-gray-600">Portofolio</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-900">0</div>
              <div className="text-sm text-gray-600">Pekerjaan</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
