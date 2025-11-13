"use client";

import { useState, useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, X } from "lucide-react";
import { updatePersonalInfo } from "@/utils/actions/user.actions";
import { formatDate } from "@/lib/format";
import toast from "react-hot-toast";
import { Employee, User } from "@prisma/client";

export function PersonalInfoSection({ user, employee }: { user: User; employee: Employee }) {
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [state, action] = useActionState(async (prev: any, formData: FormData) => {
    const toastId = toast.loading("Updating personal information...");
    formData.append("role", user.role);
    formData.append("email", user.email);
    try {
      const result = await updatePersonalInfo(formData);
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

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={employee.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={employee.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={employee.date_of_birth ? employee.date_of_birth.toISOString().split("T")[0] : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={employee.gender || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-900">Informasi Pribadi</CardTitle>
            <CardDescription>Detail pribadi dasar Anda</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)} className="border-blue-200 text-blue-600 bg-transparent">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Nama Lengkap</Label>
              <div className="text-lg font-medium text-gray-900">{employee.name}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <div className="text-lg text-gray-900">{user.email}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Nomor Telepon</Label>
              <div className="text-lg text-gray-900">{employee.phone || "Tidak disediakan"}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Tanggal Lahir</Label>
              <div className="text-lg text-gray-900">{employee.date_of_birth ? formatDate(employee.date_of_birth) : "Tidak disediakan"}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Jenis Kelamin</Label>
              <div className="text-lg text-gray-900">{employee.gender || "Tidak tersedia"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
