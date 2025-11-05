"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AvailablePositionPayload } from "@/types/entity.relations";
import { updateAvailablePositionWithId } from "@/utils/actions/position.actions";
import { jobStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function PositionForm({ initialData, pageTitle }: { initialData?: AvailablePositionPayload | null; pageTitle: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<jobStatus | null>(initialData?.status || null);

  const router = useRouter();
  const defaultValues = {
    positionName: initialData?.positionName || "",
    capacity: initialData?.capacity || "",
    status: initialData?.status || "OPEN" || ("CLOSED" as jobStatus),
    about: initialData?.about,
    description: initialData?.description.map((item) => item),
    requirements: initialData?.requirements.map((item) => item),
    benefits: initialData?.benefits.map((item) => item),
    submissionStartDate: initialData?.submissionStartDate as Date | undefined,
    submissionEndDate: initialData?.submissionEndDate as Date | undefined,
    salaryStartRange: initialData?.salaryStartRange as number | undefined,
    salaryEndRange: initialData?.salaryEndRange as number | undefined,
  };

  const form = useForm({
    values: defaultValues,
  });

  const [descriptions, setDescriptions] = useState<string[]>(initialData?.description.map((item) => item) || []);
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements.map((item) => item) || []);
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits.map((item) => item) || []);

  const [submissionStartDate, setSubmissionStartDate] = useState<Date | undefined>(initialData?.submissionStartDate as Date | undefined);
  const [submissionEndDate, setSubmissionEndDate] = useState<Date | undefined>(initialData?.submissionEndDate as Date | undefined);

  const addDescriptions = () => {
    setDescriptions([...descriptions, ""]);
  };

  const addRequirements = () => {
    setRequirements([...requirements, ""]);
  };
  const addBenefits = () => {
    setBenefits([...benefits, ""]);
  };

  const deleteDescriptions = (index: number) => {
    const newDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDescriptions);
  };
  const deleteRequirements = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };
  const deleteBenefits = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
  };

  const updateDescription = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };
  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };
  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading("Submitting form...");
    const formData = new FormData(e.target as HTMLFormElement);
    if (!status) {
      toast.error("Please select a status", { id: toastId });
      return;
    }
    formData.append("submissionStartDate", submissionStartDate?.toISOString() ?? "");
    formData.append("submissionEndDate", submissionEndDate?.toISOString() ?? "");
    formData.append("status", status as string);
    descriptions.forEach((item) => {
      formData.append("description", item);
    });
    requirements.forEach((item) => {
      formData.append("requirements", item);
    });
    benefits.forEach((item) => {
      formData.append("benefits", item);
    });
    setLoading(true);
    try {
      if (initialData) {
        const update = await updateAvailablePositionWithId(formData, initialData?.id as string);
        if (!update) {
          toast.error("Failed to update position", { id: toastId });
          setLoading(false);
          return;
        }
      } else {
        const create = await updateAvailablePositionWithId(formData, null);
        if (create.error) {
          toast.error("Failed to create position", { id: toastId });
          setLoading(false);
          return;
        }
      }
      toast.success("Form submitted successfully", { id: toastId });
      setLoading(false);
      router.refresh();
      router.push("/hrd/jobs");
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="positionName"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Position Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter position name" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="capacity"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter capacity" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="submissionStartDate"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Submission Start Date</FormLabel>
                      <FormControl>
                        <Input
                          ref={field.ref}
                          value={submissionStartDate ? new Date(submissionStartDate).toISOString().slice(0, 16) : ""}
                          onChange={(e) => setSubmissionStartDate(new Date(e.target.value))}
                          type="datetime-local"
                          placeholder="Enter submission start date"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="submissionEndDate"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Submission End Date</FormLabel>
                      <FormControl>
                        <Input
                          ref={field.ref}
                          value={submissionEndDate ? new Date(submissionEndDate).toISOString().slice(0, 16) : ""}
                          onChange={(e) => setSubmissionEndDate(new Date(e.target.value))}
                          type="datetime-local"
                          placeholder="Enter submission end date"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="salaryStartRange"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Salary Start Range</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter salary start range" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="salaryEndRange"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Salary End Range</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter salary end range" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="about"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter about job" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status as jobStatus} onValueChange={(value) => setStatus(value as jobStatus)} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(jobStatus).map((x) => (
                      <SelectItem key={x} value={x}>
                        {x.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-6 p-2 border-2 border-black/50 rounded-md">
                <div className="space-y-2">
                  <Label>Descriptions</Label>
                  {descriptions.map((desc, index) => (
                    <div key={index} className="flex gap-x-3 items-center px-2">
                      <Label>{index + 1}</Label>
                      <div className="w-full">
                        <input
                          type="text"
                          value={desc}
                          onChange={(e) => updateDescription(index, e.target.value)}
                          placeholder={`Description ${index + 1}`}
                          className={cn(
                            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          )}
                        />
                      </div>
                      <button onClick={() => deleteDescriptions(index)} type="button" className="bg-blue-500 group hover:bg-white rounded-full border-2 border-blue-500 mt-3 mb-6 hover:border-blue-500 p-2 duration-300">
                        <svg className="w-6 h-6 text-white hover:text-blue-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => addDescriptions()} className="bg-blue-500 group w-fit text-white hover:text-blue-500 hover:bg-white rounded-full border-2 border-blue-500 mt-3 mb-6 hover:border-blue-500 flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="none">
                    <path className="fill-white group-hover:fill-blue-500" d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                  Add Description
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 p-2 border-2 border-black/50 rounded-md">
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  {requirements.map((req, index) => (
                    <div key={index} className="flex gap-x-3 items-center px-2">
                      <Label>{index + 1}</Label>
                      <div className="w-full">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => updateRequirement(index, e.target.value)}
                          placeholder={`Requirement ${index + 1}`}
                          className={cn(
                            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          )}
                        />
                      </div>
                      <button onClick={() => deleteRequirements(index)} type="button" className="bg-blue-500 group hover:bg-white rounded-full border-2 border-blue-500 mt-3 mb-6 hover:border-blue-500 p-2 duration-300">
                        <svg className="w-6 h-6 text-white hover:text-blue-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => addRequirements()} className="bg-blue-500 group w-fit text-white hover:text-blue-500 hover:bg-white rounded-full border-2 border-blue-500 mt-3 mb-6 hover:border-blue-500 flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="none">
                    <path className="fill-white group-hover:fill-blue-500" d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                  Add Requirement
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 p-2 border-2 border-black/50 rounded-md">
                <div className="space-y-2">
                  <Label>Benefits</Label>
                  {benefits.map((ben, index) => (
                    <div key={index} className="flex gap-x-3 items-center px-2">
                      <Label>{index + 1}</Label>
                      <div className="w-full">
                        <input
                          type="text"
                          value={ben}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                          placeholder={`Benefit ${index + 1}`}
                          className={cn(
                            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          )}
                        />
                      </div>
                      <button onClick={() => deleteBenefits(index)} type="button" className="bg-blue-500 group hover:bg-white rounded-full border-2 border-blue-500 mt-3 mb-6 hover:border-blue-500 p-2 duration-300">
                        <svg className="w-6 h-6 text-white hover:text-blue-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => addBenefits()} className="bg-blue-500 group w-fit text-white hover:text-blue-500 hover:bg-white rounded-full border-2 border-blue-500 mt-3 mb-6 hover:border-blue-500 flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="none">
                    <path className="fill-white group-hover:fill-blue-500" d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                  Add Benefit
                </Button>
              </div>
            </div>
            <div className="flex justify-start gap-4">
              <Button type="button" onClick={() => router.push("/hrd/jobs")}>
                Back
              </Button>
              {loading ? (
                <Button type="submit" disabled className="bg-gray-500 text-white">
                  Submitting...
                </Button>
              ) : (
                <Button type="submit">{initialData ? "Update" : "Add"} Position</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
