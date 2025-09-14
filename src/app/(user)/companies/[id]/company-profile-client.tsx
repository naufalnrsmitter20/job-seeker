"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Globe, Mail, Phone, Calendar, Users, Briefcase, TrendingUp, Clock, DollarSign, ArrowLeft, ExternalLink, Share2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { CompanyProfileClientProps } from "@/types/additional-types";

export function CompanyProfileClient({ company, stats, searchParams }: CompanyProfileClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const jobsPerPage = 6;

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSalary = (start: number | null, end: number | null) => {
    if (!start && !end) return "Salary not specified";
    if (start && end) {
      return `Rp ${start.toLocaleString()} - Rp ${end.toLocaleString()}`;
    }
    if (start) return `From Rp ${start.toLocaleString()}`;
    if (end) return `Up to Rp ${end.toLocaleString()}`;
    return "Salary not specified";
  };

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`/companies/${company.id}?${newParams.toString()}`);
  };

  // Pagination for jobs
  const totalJobPages = Math.ceil(company.availablePositions.length / jobsPerPage);
  const paginatedJobs = company.availablePositions.slice((currentJobPage - 1) * jobsPerPage, currentJobPage * jobsPerPage);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${company.name} - Company Profile`,
          text: company.description,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-50 border-b">
        <div className="container mx-auto px-4 pt-6 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700">
              <Link href="/companies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Company Header */}
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                <AvatarImage src={company.logo || ""} alt={company.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">{getCompanyInitials(company.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">{company.name}</h1>
                  {company.type && (
                    <Badge variant="outline" className="text-sm">
                      {company.type}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{company.address}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <Link href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
                        {company.website.replace(/^https?:\/\//, "")}
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{company.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
              {company.website && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href={company.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={handleShare} className="border-blue-200 text-blue-600 bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share Company
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">{stats.openJobs}</div>
              <div className="text-sm text-gray-600">Open Positions</div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-700">{stats.totalApplications}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700">{new Date().getFullYear() - new Date(company.createdAt).getFullYear() || "New"}</div>
              <div className="text-sm text-gray-600">Years Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={searchParams.tab || "overview"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" onClick={() => updateSearchParams({ tab: "overview" })}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" onClick={() => updateSearchParams({ tab: "jobs" })}>
              Jobs ({stats.openJobs})
            </TabsTrigger>
            <TabsTrigger value="about" onClick={() => updateSearchParams({ tab: "about" })}>
              About
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Company Description */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">About {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description}</p>
                  </CardContent>
                </Card>

                {/* Recent Jobs */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-blue-900">Recent Job Openings</CardTitle>
                      <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-600 bg-transparent">
                        <Link href={`/companies/${company.id}?tab=jobs`}>View All</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{job.positionName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Clock className="h-3 w-3" />
                              Posted {formatDate(job.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={job.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{job.status}</Badge>
                            <Button onClick={() => router.push(`/jobs/${job.id}`)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Industry</div>
                      <div className="text-gray-900">{company.type || "Not specified"}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Founded</div>
                      <div className="text-gray-900">{formatDate(company.createdAt)}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Location</div>
                      <div className="text-gray-900">{company.address}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Contact</div>
                      <div className="space-y-1">
                        <div className="text-gray-900">{company.email}</div>
                        <div className="text-gray-900">{company.phone}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Open Positions</span>
                      <span className="font-semibold text-green-600">{stats.openJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Closed Positions</span>
                      <span className="font-semibold text-gray-600">{stats.closedJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Applications</span>
                      <span className="font-semibold text-blue-600">{stats.totalApplications}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Job Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Select value={searchParams.jobStatus || "all"} onValueChange={(value) => updateSearchParams({ jobStatus: value === "all" ? undefined : value })}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={searchParams.sort || "newest"} onValueChange={(value) => updateSearchParams({ sort: value })}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="salary_high">Highest Salary</SelectItem>
                        <SelectItem value="deadline">Deadline Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-gray-600">
                    {company.availablePositions.length} job{company.availablePositions.length !== 1 ? "s" : ""} found
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            {paginatedJobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {paginatedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{job.positionName}</h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <DollarSign className="h-4 w-4" />
                              <span className="text-sm font-medium">{formatSalary(job.salaryStartRange, job.salaryEndRange)}</span>
                            </div>
                          </div>
                          <Badge className={job.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{job.status}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Deadline: {formatDate(job.submissionEndDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">
                              {job._count.positionApplied} applicant{job._count.positionApplied !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            Posted {formatDate(job.createdAt)}
                          </div>
                          <Button onClick={() => router.push(`/jobs/${job.id}`)} size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={job.status === "CLOSED"}>
                            {job.status === "OPEN" ? "Apply Now" : "Closed"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">This company doesnt have any jobs matching your criteria.</p>
                </CardContent>
              </Card>
            )}

            {/* Jobs Pagination */}
            {totalJobPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" onClick={() => setCurrentJobPage(currentJobPage - 1)} disabled={currentJobPage <= 1} className="bg-white">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalJobPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentJobPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentJobPage(pageNum)}
                        className={currentJobPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : "bg-white"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button variant="outline" onClick={() => setCurrentJobPage(currentJobPage + 1)} disabled={currentJobPage >= totalJobPages} className="bg-white">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Company Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{company.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Address</div>
                        <div className="text-gray-600">{company.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">Email</div>
                        <div className="text-gray-600">{company.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">Phone</div>
                        <div className="text-gray-600">{company.phone}</div>
                      </div>
                    </div>
                    {company.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Website</div>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Company Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Industry</div>
                      <div className="text-gray-600">{company.type || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Company Size</div>
                      <div className="text-gray-600">{stats.totalJobs > 50 ? "Large" : stats.totalJobs > 10 ? "Medium" : "Small"} Company</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Founded</div>
                      <div className="text-gray-600">{formatDate(company.createdAt)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
