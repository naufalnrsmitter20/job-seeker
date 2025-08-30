"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CompanyGetPayload, HumanResourceGetPayload } from "@/types/entity.relations";
import { updateCompanyById } from "@/utils/actions/company.actions";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function UserForm({ initialData, hrd, pageTitle }: { initialData?: CompanyGetPayload | null; hrd: HumanResourceGetPayload[]; pageTitle: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<File | undefined>(undefined);

  const router = useRouter();
  const defaultValues = {
    logo: initialData?.logo,
    name: initialData?.name || "",
    email: initialData?.email || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    website: initialData?.website || "",
    phone: initialData?.phone || "",
    type: initialData?.type || "",
    humanResourceId: initialData?.humanResourceId,
  };

  const form = useForm({
    values: defaultValues,
  });

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading("Submitting form...");
    const formData = new FormData(e.target as HTMLFormElement);
    console.log("Form Data:", Array.from(formData.entries()));
    formData.append("humanResourceId", form.getValues("humanResourceId") || "");
    if (logo) {
      formData.append("logo", logo as File);
    }
    setLoading(true);
    try {
      if (initialData) {
        const update = await updateCompanyById(formData, initialData.id as string);
        if (!update) {
          toast.error("Failed to update company", { id: toastId });
          setLoading(false);
          return;
        }
      } else {
        const create = await updateCompanyById(formData);
        if (!create) {
          toast.error("Failed to create company", { id: toastId });
          setLoading(false);
          return;
        }
      }
      toast.success("Form submitted successfully", { id: toastId });
      setLoading(false);
      router.refresh();
      router.push("/admin/companies");
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
        <Form {...form}>
          <form onSubmit={HandleSubmit} className="space-y-8">
            <FormField
              name="logo"
              control={form.control}
              render={({ field: { ref } }) => {
                return (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input type="file" placeholder="Enter company Logo" onChange={(e) => setLogo(e.target.files?.[0])} ref={ref} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter company name" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" step="0.01" placeholder="Enter company email" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter company description" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter company address" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="website"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter company website" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter company phone" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="humanResourceId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HRD</FormLabel>
                    <FormControl>
                      <Select value={field.value as string} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HRD" />
                        </SelectTrigger>
                        <SelectContent>
                          {hrd.map((x) => (
                            <SelectItem key={x.id} value={x.id}>
                              {x.name.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter company type/category" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-start gap-4">
              <Button type="button" onClick={() => router.push("/admin/companies")}>
                Back
              </Button>
              {loading ? (
                <Button type="submit" disabled className="bg-gray-500 text-white">
                  Submitting...
                </Button>
              ) : (
                <Button type="submit">{initialData ? "Update" : "Add"} Company</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
