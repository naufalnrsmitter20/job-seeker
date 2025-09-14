"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Building2, Filter, SortAsc, Briefcase, Globe, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CompaniesPageClientProps } from "@/types/additional-types";

export function CompaniesPageClient({ companies, totalCompanies, types, locations, currentPage, pageSize, searchParams }: CompaniesPageClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const totalPages = Math.ceil(totalCompanies / pageSize);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    if (Object.keys(updates).some((key) => key !== "page")) {
      newParams.set("page", "1");
    }

    router.push(`/companies?${newParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ q: searchQuery || undefined });
  };

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Tipe Industri</h3>
        <Select value={searchParams.type || "all"} onValueChange={(value) => updateSearchParams({ type: value === "all" ? undefined : value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Industri</SelectItem>
            {types.slice(0, 15).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSearchQuery("");
          router.push("/companies");
        }}
        className="w-full border-blue-200 text-blue-600 bg-transparent"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Perusahaan</h1>
              <p className="text-gray-600 mt-1">{totalCompanies.toLocaleString()} Perusahaan yang sedang merekrut</p>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 lg:w-80">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search companies, industries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
                  <SelectItem value="most_jobs">Most Jobs</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-64 flex-shrink-0">
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
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

            {/* Companies Grid */}
            {companies.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {companies.map((company) => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow duration-200 bg-white">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={company.logo || ""} alt={company.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">{getCompanyInitials(company.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">{company.name}</h3>
                            {company.type && (
                              <Badge variant="outline" className="text-xs">
                                {company.type}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-2">{company.address}</span>
                          </div>

                          {company.website && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Globe className="h-4 w-4" />
                              <Link href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 line-clamp-1">
                                {company.website.replace(/^https?:\/\//, "")}
                              </Link>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {company.availablePositions.length} open position
                              {company.availablePositions.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-3">{company.description}</p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-xs text-gray-500">
                            {company._count.availablePositions} total job
                            {company._count.availablePositions !== 1 ? "s" : ""}
                          </div>
                          <div className="flex gap-2">
                            {company.website && (
                              <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-600 bg-transparent">
                                <Link href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Visit
                                </Link>
                              </Button>
                            )}
                            <Button onClick={() => router.push(`/companies/${company.id}`)} size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={company.availablePositions.length === 0}>
                              View Jobs
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Empty State
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters to find more companies.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      router.push("/companies");
                    }}
                    className="border-blue-200 text-blue-600 bg-transparent"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
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
