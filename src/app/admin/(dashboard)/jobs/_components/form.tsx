"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserGetPayload } from "@/types/entity.relations";
import { updateUserWithId } from "@/utils/actions/user.actions";
import { userRole } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function UserForm({ initialData, pageTitle }: { initialData?: UserGetPayload | null; pageTitle: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<userRole | null>(initialData?.role || null);

  const router = useRouter();
  const defaultValuesEmployee = {
    email: initialData?.email || "",
    name: initialData?.name || "",
    role: initialData?.role || "USER" || "EMPLOYEE",
    profile_picture: initialData?.profile_picture,
    date_of_birth: initialData?.Employee?.date_of_birth,
    gender: initialData?.Employee?.gender,
    phone: initialData?.Employee?.phone,
  };
  const defaultValuesHRD = {
    email: initialData?.email || "",
    name: initialData?.name || "",
    role: initialData?.role || "HRD",
    position: initialData?.HumanResource?.position,
  };

  const defaultValuesAdmin = {
    email: initialData?.email || "",
    name: initialData?.name || "",
    role: initialData?.role || "ADMIN",
  };

  const Employeeform = useForm({
    values: defaultValuesEmployee,
  });
  const HRDform = useForm({
    values: defaultValuesHRD,
  });
  const Adminform = useForm({
    values: defaultValuesAdmin,
  });

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading("Submitting form...");
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("role", role as string);
    setLoading(true);
    try {
      if (initialData) {
        const update = await updateUserWithId(initialData?.id as string, formData);
        if (!update) {
          toast.error("Failed to update user", { id: toastId });
          setLoading(false);
          return;
        }
      } else {
        const create = await updateUserWithId(null, formData);
        if (!create) {
          toast.error("Failed to create user", { id: toastId });
          setLoading(false);
          return;
        }
      }
      toast.success("Form submitted successfully", { id: toastId });
      setLoading(false);
      router.refresh();
      router.push("/admin/users");
    } catch (error) {
      setLoading(false);
      toast.error((error as Error).message, { id: toastId });
      console.log("Error submitting form:", error);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 w-1/2">
          <Label>Role</Label>
          <Select value={role as userRole} onValueChange={(value) => setRole(value as userRole)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(userRole).map((x) => (
                <SelectItem key={x} value={x}>
                  {x.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {["EMPLOYEE", "USER"].includes(role as userRole) && (
          <Form {...Employeeform}>
            <form onSubmit={HandleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  name="name"
                  control={Employeeform.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter user name" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="email"
                  control={Employeeform.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" step="0.01" placeholder="Enter email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...field} />
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="phone"
                  control={Employeeform.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} value={field.value ?? ""} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={Employeeform.control}
                name="date_of_birth"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ? (typeof field.value === "string" ? field.value : field.value.toISOString().split("T")[0]) : ""} onChange={(e) => field.onChange(e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={Employeeform.control}
                name="gender"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select {...field} onValueChange={(value) => field.onChange(value as string)} value={field.value as string}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["male", "female", "other"].map((x) => (
                            <SelectItem key={x} value={x}>
                              {x.toLocaleLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex justify-start gap-4">
                <Button type="button" onClick={() => router.push("/admin/manageUsers")}>
                  Back
                </Button>
                {loading ? (
                  <Button type="submit" disabled className="bg-gray-500 text-white">
                    Submitting...
                  </Button>
                ) : (
                  <Button type="submit">{initialData ? "Update" : "Add"} User</Button>
                )}
              </div>
            </form>
          </Form>
        )}
        {["ADMIN"].includes(role as userRole) && (
          <Form {...Adminform}>
            <form onSubmit={HandleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  name="name"
                  control={Adminform.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter user name" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="email"
                  control={Adminform.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" step="0.01" placeholder="Enter email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...field} />
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-start gap-4">
                <Button type="button" onClick={() => router.push("/admin/manageUsers")}>
                  Back
                </Button>
                {loading ? (
                  <Button type="submit" disabled className="bg-gray-500 text-white">
                    Submitting...
                  </Button>
                ) : (
                  <Button type="submit">{initialData ? "Update" : "Add"} User</Button>
                )}
              </div>
            </form>
          </Form>
        )}
        {["HRD"].includes(role as userRole) && (
          <Form {...HRDform}>
            <form onSubmit={HandleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={HRDform.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter user name" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={HRDform.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" step="0.01" placeholder="Enter email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...field} />
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={HRDform.control}
                  name="position"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter position" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-start gap-4">
                <Button type="button" onClick={() => router.push("/admin/manageUsers")}>
                  Back
                </Button>
                {loading ? (
                  <Button type="submit" disabled className="bg-gray-500 text-white">
                    Submitting...
                  </Button>
                ) : (
                  <Button type="submit">{initialData ? "Update" : "Add"} User</Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
