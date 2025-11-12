"use client";

import { useState, FormEventHandler, Dispatch, SetStateAction, ChangeEvent } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign, Calendar, Clock, Users, Building2, ArrowLeft, Share2, CheckCircle, AlertCircle, FileText, Send, Eye, TrendingUp, Archive, Info } from "lucide-react";
import { formatDate } from "@/lib/format";
import { JobDetailClientProps } from "@/types/additional-types";
import { UserGetPayload } from "@/types/entity.relations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { applyJobPosition } from "@/utils/actions/position.actions";
import toast from "react-hot-toast";

export function JobDetailClient({ job, similarJobs, stats, userData, positionApplied }: JobDetailClientProps) {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Submitting your application...");
    try {
      setLoading(true);
      const apply = await applyJobPosition(job.id);
      if (apply.error) {
        toast.error(apply.message, { id: toastId });
        setLoading(false);
        return;
      }
      setIsApplicationOpen(false);
      toast.success(apply.message, { id: toastId });
      setLoading(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application", { id: toastId });
      setLoading(false);
    }
  };

  const formatSalary = (start: number | null, end: number | null) => {
    if (!start && !end) return "Salary negotiable";
    if (start && end) {
      return `Rp ${start.toLocaleString()} - Rp ${end.toLocaleString()}`;
    }
    if (start) return `From Rp ${start.toLocaleString()}`;
    if (end) return `Up to Rp ${end.toLocaleString()}`;
    return "Salary negotiable";
  };

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.positionName} at ${job.Company?.name}`,
          text: job.description.slice(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        console.log(err);
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const isExpired = new Date() > new Date(job.submissionEndDate);
  const canApply = job.status === "OPEN" && !isExpired;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-50 border-b">
        <div className="container mx-auto px-4 pt-6 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700">
              <Link href="/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                {job.Company && (
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarImage src={job.Company.logo || ""} alt={job.Company.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-bold">{getCompanyInitials(job.Company.name)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">{job.positionName}</h1>
                  {job.Company && (
                    <Link href={`/companies/${job.Company.id}`} className="text-xl text-blue-600 hover:text-blue-700 font-medium mb-2 inline-block">
                      {job.Company.name}
                    </Link>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.Company?.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{formatSalary(job.salaryStartRange, job.salaryEndRange)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge className={job.status === "OPEN" && !isExpired ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{isExpired ? "EXPIRED" : job.status}</Badge>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {formatDate(job.submissionEndDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{stats.totalApplications} applicants</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>

              {stats.daysRemaining <= 7 && stats.daysRemaining > 0 && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">
                    Only {stats.daysRemaining} day{stats.daysRemaining !== 1 ? "s" : ""} left to apply!
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
              <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
                <DialogTrigger asChild>
                  {positionApplied?.applyingStatus === "PENDING" ? (
                    <Button size="lg" className="bg-gray-400 cursor-not-allowed hover:bg-gray-400" disabled>
                      Application Pending
                    </Button>
                  ) : positionApplied?.applyingStatus === "ACCEPTED" ? (
                    <Button size="lg" className="bg-green-600 cursor-not-allowed hover:bg-green-600" disabled>
                      Application Accepted
                    </Button>
                  ) : (
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" disabled={!canApply}>
                      {!canApply ? (isExpired ? "Application Closed" : "Position Closed") : "Apply Now"}
                    </Button>
                  )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.positionName}</DialogTitle>
                  </DialogHeader>
                  <ApplicationForm userData={userData!} submit={handleApply} setIsApplicationOpen={setIsApplicationOpen} loading={loading} />
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleShare} className="border-blue-200 text-blue-600 bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About Job
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">{job.about}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.description &&
                    job.description.map((item, index) => (
                      <ul key={index} className="text-gray-700 ml-5 list-disc space-y-2">
                        <li className="">{item}</li>
                      </ul>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.requirements &&
                    job.requirements.map((item, index) => (
                      <ul key={index} className="text-gray-700 ml-5 list-disc space-y-2">
                        <li className="">{item}</li>
                      </ul>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.benefits &&
                    job.benefits.map((item, index) => (
                      <ul key={index} className="text-gray-700 ml-5 list-disc space-y-2">
                        <li className="">{item}</li>
                      </ul>
                    ))}
                </div>
              </CardContent>
            </Card>

            {job.Company && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    About {job.Company.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={job.Company.logo || ""} alt={job.Company.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">{getCompanyInitials(job.Company.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{job.Company.name}</h3>
                      {job.Company.type && (
                        <Badge variant="outline" className="text-xs">
                          {job.Company.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{job.Company.description}</p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-600 bg-transparent">
                      <Link href={`/companies/${job.Company.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Company
                      </Link>
                    </Button>
                    {job.Company.website && (
                      <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-600 bg-transparent">
                        <Link href={job.Company.website} target="_blank" rel="noopener noreferrer">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Visit Website
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {stats.recentApplications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">{application.Employee?.user?.name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{application.Employee?.user?.name || "Anonymous"}</div>
                            <div className="text-sm text-gray-600">Applied {formatDate(application.applyDate)}</div>
                          </div>
                        </div>
                        <Badge className={application.applyingStatus === "ACCEPTED" ? "bg-green-100 text-green-700" : application.applyingStatus === "REJECTED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                          {application.applyingStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Position</div>
                  <div className="text-gray-900 font-medium">{job.positionName}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Salary Range</div>
                  <div className="text-gray-900 font-medium">{formatSalary(job.salaryStartRange, job.salaryEndRange)}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Capacity</div>
                  <div className="text-gray-900">
                    {job.capacity} position{job.capacity !== 1 ? "s" : ""}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Application Period</div>
                  <div className="text-gray-900">
                    {formatDate(job.submissionStartDate)} - {formatDate(job.submissionEndDate)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Location</div>
                  <div className="text-gray-900">{job.Company.address}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                  <Badge className={job.status === "OPEN" && !isExpired ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{isExpired ? "EXPIRED" : job.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Application Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Current Applications</span>
                  <span className="font-semibold text-blue-600">{stats.totalApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining</span>
                  <span className={`font-semibold ${stats.daysRemaining <= 7 ? "text-orange-600" : "text-green-600"}`}>{stats.daysRemaining > 0 ? `${stats.daysRemaining} days` : "Expired"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Positions Available</span>
                  <span className="font-semibold text-gray-900">{job.capacity}</span>
                </div>
              </CardContent>
            </Card>

            {similarJobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <Link key={similarJob.id} href={`/jobs/${similarJob.id}`} className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium text-gray-900 mb-1">{similarJob.positionName}</h4>
                        <div className="text-sm text-gray-600 mb-2">{formatSalary(similarJob.salaryStartRange, similarJob.salaryEndRange)}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">{similarJob._count.positionApplied} applicants</div>
                          <Badge className={similarJob.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{similarJob.status}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationForm({ userData, submit, setIsApplicationOpen, loading }: { userData: UserGetPayload | null; submit: FormEventHandler<HTMLFormElement>; setIsApplicationOpen: Dispatch<SetStateAction<boolean>>; loading: boolean }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dataComplete, setDataComplete] = useState(false);

  return (
    <form onSubmit={submit} className="space-y-6">
      <Alert variant="destructive">
        <Info />
        <AlertTitle>Perlu diperhatikan!</AlertTitle>
        <AlertDescription>Pastikan data diri anda lengkap sebelum mengajukan lamaran!</AlertDescription>
      </Alert>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" name="name" readOnly defaultValue={userData?.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" readOnly defaultValue={userData?.email} />
          </div>
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" name="phone" type="tel" readOnly defaultValue={userData?.Employee?.phone as string} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start space-x-2">
            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
            <Label htmlFor="terms" className="text-sm leading-relaxed inline-block">
              Saya menyetujui{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 inline-block">
                Syarat & Ketentuan
              </Link>{" "}
              serta{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 inline-block">
                Kebijakan Privasi
              </Link>
              .
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="data-complete" checked={dataComplete} onCheckedChange={(checked) => setDataComplete(checked as boolean)} />
            <Label htmlFor="data-complete" className="text-sm leading-relaxed inline-block">
              Saya memastikan bahwa seluruh data yang saya berikan sudah lengkap dan benar.
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => setIsApplicationOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!agreedToTerms || !dataComplete || loading}>
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
