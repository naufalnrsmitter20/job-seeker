"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HumanResourceGetPayload } from "@/types/entity.relations";
import { updateCompanyLogo, updateCompanyProfile } from "@/utils/actions/company.actions";
import { Camera, Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import toast from "react-hot-toast";

export default function InfoSection({ data }: { data: HumanResourceGetPayload }) {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [imgValue, setImgValue] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpload = async () => {
    const toastId = toast.loading("Uploading Image...");
    setUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("logo", imgValue as File);
      const upload = await updateCompanyLogo(formdata);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [state, action] = useActionState(async (prev: any, formData: FormData) => {
    const toastId = toast.loading("Updating company profile...");
    try {
      const result = await updateCompanyProfile(formData);
      if (!result.error) {
        setIsEditing(false);
        toast.success(result.message, { id: toastId });
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

  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row gap-6">
        <div className="relative mb-4 h-fit">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={data.Company?.logo || ""} alt={data.Company?.name} />
            <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">{data.Company?.name}</AvatarFallback>
          </Avatar>
          <Dialog open={isEditingPhoto} onOpenChange={setIsEditingPhoto}>
            <DialogTrigger asChild>
              <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Logo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="photo">Choose Photo</Label>
                  <Input onChange={(e) => setImgValue(e.target.files?.[0])} id="photo" type="file" accept="image/*" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditingPhoto(false)}>
                    Cancel
                  </Button>
                  <Button disabled={uploading} onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900 text-2xl">Company profile</CardTitle>
                <CardDescription>Your company details</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="border-blue-200 text-blue-600 bg-transparent">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          {isEditing ? (
            <>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Pencil className="h-5 w-5" />
                  Edit Company Profile
                </CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={action} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name</Label>
                      <Input id="name" name="name" defaultValue={data.Company?.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Company Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={data.Company?.email || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Company Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" defaultValue={data.Company?.phone || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Company Website</Label>
                      <Input id="website" name="website" type="text" defaultValue={data.Company?.website || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Company Address</Label>
                      <Textarea id="address" name="address" defaultValue={data.Company?.address || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea id="description" name="description" defaultValue={data.Company?.description || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Company Type</Label>
                      <Input id="type" name="type" type="text" defaultValue={data.Company?.type || ""} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                      <div className="text-lg font-medium text-gray-900">{data.Company?.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Email</Label>
                      <div className="text-lg text-gray-900">{data.Company?.email}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Phone Number</Label>
                      <div className="text-lg font-medium text-gray-900">{data.Company?.phone}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Website</Label>
                      <div className="text-lg text-gray-900">{data.Company?.website}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Address</Label>
                      <div className="text-lg font-medium text-gray-900">{data.Company?.address}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Description</Label>
                      <div className="text-lg text-gray-900">{data.Company?.description}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company Type</Label>
                    <div className="text-lg text-gray-900">{data.Company?.type}</div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </CardContent>
    </Card>
  );
}
