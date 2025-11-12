"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, MapPin, DollarSign, Calendar, Building2, Filter, SortAsc, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { JobsPageClientProps } from "@/types/additional-types";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

export function JobsPageClient({ jobs, totalJobs, currentPage, pageSize, searchParams }: JobsPageClientProps) {
  const router = useRouter();
  const params = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [submissionDateRange, setSubmissionDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const from = params.get("dateFrom");
    const to = params.get("dateTo");
    if (from && to) {
      setSubmissionDateRange({ from: new Date(from), to: new Date(to) });
    }
  }, [params]);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });

    if (Object.keys(updates).some((key) => key !== "page")) {
      newParams.set("page", "1");
    }

    router.push(`/jobs?${newParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ q: searchQuery || undefined });
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

  const filteredJobs = jobs.filter((job) => {
    if (submissionDateRange?.from && submissionDateRange?.to) {
      const jobStart = new Date(job.submissionStartDate);
      const jobEnd = new Date(job.submissionEndDate);
      const filterStart = new Date(submissionDateRange.from);
      const filterEnd = new Date(submissionDateRange.to);

      const isOverlap = jobStart <= filterEnd && jobEnd >= filterStart;
      return isOverlap;
    }
    return true;
  });

  const totalPages = Math.ceil(totalJobs / pageSize);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Periode Lowongan Kerja</h3>
        <DatePickerWithRange
          date={submissionDateRange}
          onDateChange={(range) => {
            setSubmissionDateRange(range);
            if (range?.from && range?.to) {
              updateSearchParams({
                dateFrom: range.from.toISOString(),
                dateTo: range.to.toISOString(),
              });
            } else {
              updateSearchParams({ dateFrom: undefined, dateTo: undefined });
            }
          }}
        />
        <p className="text-xs text-gray-500 mt-1">Filter berdasarkan tanggal dibuka dan ditutupnya lowongan.</p>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">Status</h3>
        <Select
          value={searchParams.status || "all"}
          onValueChange={(value) =>
            updateSearchParams({
              status: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">Rentang Gaji</h3>
        <div className="space-y-2">
          <Input
            placeholder="Min gaji"
            type="number"
            value={searchParams.salaryMin || ""}
            onChange={(e) =>
              updateSearchParams({
                salaryMin: e.target.value || undefined,
              })
            }
          />
          <Input
            placeholder="Max gaji"
            type="number"
            value={searchParams.salaryMax || ""}
            onChange={(e) =>
              updateSearchParams({
                salaryMax: e.target.value || undefined,
              })
            }
          />
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSearchQuery("");
          setSubmissionDateRange(undefined);
          router.push("/jobs");
        }}
        className="w-full border-blue-200 text-blue-600 bg-transparent"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Lowongan Pekerjaan</h1>
              <p className="text-gray-600 mt-1">{totalJobs.toLocaleString()} lowongan pekerjaan tersedia</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 lg:w-80">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search jobs, companies, locations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </form>

              <Select value={searchParams.sort || "newest"} onValueChange={(value) => updateSearchParams({ sort: value })}>
                <SelectTrigger className="w-full sm:w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="salary_high">Highest Salary</SelectItem>
                  <SelectItem value="salary_low">Lowest Salary</SelectItem>
                  <SelectItem value="deadline">Deadline Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden lg:block  flex-shrink-0">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters & Sort
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => {
                  const isExpired = new Date() > new Date(job.submissionEndDate);
                  const jobStatus = isExpired ? "CLOSED" : job.status;
                  return (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200 bg-white">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">{job.positionName}</h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{job.Company.name}</span>
                              </div>
                            </div>
                            <Badge className={isExpired ? "bg-red-100 text-red-700" : job.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{jobStatus}</Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm line-clamp-1">{job.Company.address}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="h-4 w-4" />
                              <span className="text-sm font-medium">{formatSalary(job.salaryStartRange, job.salaryEndRange)}</span>
                            </div>

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
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters to find more opportunities.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      router.push("/jobs");
                    }}
                    className="border-blue-200 text-blue-600 bg-transparent"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" onClick={() => updateSearchParams({ page: String(currentPage - 1) })} disabled={currentPage <= 1} className="bg-white">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSearchParams({ page: String(pageNum) })}
                        className={currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : "bg-white"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button variant="outline" size="sm" onClick={() => updateSearchParams({ page: String(totalPages) })} className="bg-white">
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button variant="outline" onClick={() => updateSearchParams({ page: String(currentPage + 1) })} disabled={currentPage >= totalPages} className="bg-white">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
