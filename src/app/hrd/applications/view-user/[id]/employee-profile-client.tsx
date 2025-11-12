"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Calendar, User2, Briefcase, Award, FileText, LinkIcon, Download, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeGetPayload, UserGetPayload } from "@/types/entity.relations";
import Image from "next/image";
import Link from "next/link";

interface EmployeeProfileClientProps {
  user: UserGetPayload;
  employee: EmployeeGetPayload;
}

export function EmployeeProfileClient({ user, employee }: EmployeeProfileClientProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "?";

  const primaryAddress = employee?.address?.find((addr) => addr.isPrimary) || employee?.address?.[0];

  return (
    <div className="space-y-6">
      {/* Header Section with User Info */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profile_picture || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">{userInitials}</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-3xl font-bold text-blue-900">{user.name || "No Name"}</h2>
                <p className="text-gray-600 text-lg">{user.email}</p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className={user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : user.role === "HRD" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>{user.role}</Badge>
                <Badge className={user.verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                  {user.verified ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </>
                  )}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                {employee?.phone && (
                  <div className="flex items-center gap-1 text-gray-700">
                    <Phone className="h-4 w-4" />
                    {employee.phone}
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="h-4 w-4" />
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:w-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{employee?.positionApplied?.length || 0}</div>
                <div className="text-xs text-gray-600">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{employee?.portfolios?.length || 0}</div>
                <div className="text-xs text-gray-600">Portfolios</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Sections */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {employee ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User2 className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-foreground font-medium">{user.name || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-foreground font-medium">{user.email || "-"}</p>
                    </div>
                    {employee?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-foreground font-medium">{employee.phone}</p>
                      </div>
                    )}
                    {employee?.date_of_birth && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                        <p className="text-foreground font-medium">{formatDate(new Date(employee.date_of_birth))}</p>
                      </div>
                    )}
                    {employee?.gender && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Gender</label>
                        <p className="text-foreground font-medium capitalize">{employee.gender}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {employee?.Company ? (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Current Company</label>
                        <div className="flex items-center gap-2 mt-1">
                          {employee.Company.logo && <Image src={employee.Company.logo || "/placeholder.svg"} alt={employee.Company.name} className="h-6 w-6 rounded" />}
                          <p className="text-foreground font-medium">{employee.Company.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Current Company</label>
                        <p className="text-foreground font-medium">-</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Applications</label>
                      <p className="text-foreground font-medium">{employee.positionApplied?.length || 0}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Portfolio Items</label>
                      <p className="text-foreground font-medium">{employee.portfolios?.length || 0}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Member Since</label>
                      <p className="text-foreground font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              {primaryAddress && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Street</label>
                        <p className="text-foreground font-medium">{primaryAddress.street}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">City</label>
                        <p className="text-foreground font-medium">{primaryAddress.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">State</label>
                        <p className="text-foreground font-medium">{primaryAddress.state}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Country</label>
                        <p className="text-foreground font-medium">{primaryAddress.country}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">ZIP Code</label>
                        <p className="text-foreground font-medium">{primaryAddress.zip}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Badge className="mt-1">{primaryAddress.isPrimary ? "Primary" : "Secondary"}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="text-orange-900">No employee profile found for this user.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          {employee?.positionApplied && employee.positionApplied.length > 0 ? (
            <div className="space-y-4">
              {employee.positionApplied.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-blue-900">{application.AvailablePosition?.positionName || "Job Title"}</h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4" />
                            {application.AvailablePosition?.Company?.name || "Company"}
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">{application.applyingStatus || "Applied"}</Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Applied Date</label>
                          <p className="text-foreground font-medium">{formatDate(application.applyDate)}</p>
                        </div>
                        {application.AvailablePosition?.salaryStartRange && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Salary Range</label>
                            <p className="text-foreground font-medium">
                              Rp {application.AvailablePosition?.salaryStartRange?.toLocaleString()} - Rp {application.AvailablePosition?.salaryEndRange?.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {application.AvailablePosition?.Company.address && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                            <p className="text-foreground font-medium">{application.AvailablePosition.Company.address}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Job Type</label>
                          <p className="text-foreground font-medium">{application.AvailablePosition?.Company.type || "-"}</p>
                        </div>
                      </div>

                      {/* Job Description */}
                      {application.AvailablePosition?.description && (
                        <div className="pt-4 border-t">
                          <label className="text-sm font-medium text-gray-600 mb-2 block">Job Description</label>
                          <p className="text-gray-700 text-sm line-clamp-3">{application.AvailablePosition.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 py-8">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">No applications found.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          {employee?.portfolios && employee.portfolios.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {employee.portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1 flex items-center gap-2">
                      <Award className="h-5 w-5 flex-shrink-0" />
                      {portfolio.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{portfolio.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    {portfolio.file && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">File</label>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <Link href={portfolio.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                            {portfolio.file.split("/").pop()}
                          </Link>
                          <Download className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    )}

                    {portfolio.link && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Link</label>
                        <Link href={portfolio.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                          <LinkIcon className="h-4 w-4" />
                          {portfolio.link}
                        </Link>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">Updated: {formatDate(portfolio.updatedAt)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 py-8">
                  <Award className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">No portfolio items found.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email: </label>
                  <Link href={`mailto:${user.email}`} className="text-blue-600 hover:underline font-medium">
                    {user.email}
                  </Link>
                </div>

                {employee?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone: </label>
                    <Link href={`tel:${employee.phone}`} className="text-blue-600 hover:underline font-medium">
                      {employee.phone}
                    </Link>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">User ID</label>
                  <p className="font-mono text-sm text-gray-700 break-all">{user.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Last Login</label>
                  <p className="text-foreground font-medium">{user.last_login ? formatDate(user.last_login) : "Never"}</p>
                </div>
              </CardContent>
            </Card>

            {/* All Addresses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  All Addresses ({employee?.address?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {employee?.address && employee.address.length > 0 ? (
                  employee.address.map((addr) => (
                    <div key={addr.id} className={`p-3 rounded-lg border ${addr.isPrimary ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                      {addr.isPrimary && <Badge className="mb-2 bg-blue-600">Primary</Badge>}
                      <p className="text-sm font-medium text-gray-900">{addr.street}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p className="text-xs text-gray-600">{addr.country}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No addresses found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Meta Information */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-gray-600">System Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="text-gray-600 font-medium">Created</label>
            <p className="text-foreground">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <label className="text-gray-600 font-medium">Last Updated</label>
            <p className="text-foreground">{formatDate(user.updatedAt)}</p>
          </div>
          <div>
            <label className="text-gray-600 font-medium">User ID</label>
            <p className="font-mono text-xs text-gray-600 truncate">{user.id}</p>
          </div>
          <div>
            <label className="text-gray-600 font-medium">Account Status</label>
            <Badge className={user.verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>{user.verified ? "Active" : "Pending"}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
