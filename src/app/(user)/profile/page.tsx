import prisma from "@/lib/prisma";
import { ProfileHeader } from "./_components/profile-header";
import { PersonalInfoSection } from "./_components/personal-info-section";
import { AddressSection } from "./_components/address-section";
import { PortfolioSection } from "./_components/portfolio-section";
import { ApplicationsSection } from "./_components/applications-section";
import { CompanyAffiliationSection } from "./_components/company-affiliation-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Briefcase, FileText, Building2 } from "lucide-react";
import { nextGetServerSession } from "@/lib/AuthOptions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await nextGetServerSession();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      Employee: {
        include: {
          address: {
            orderBy: { createdAt: "desc" },
          },
          portfolios: {
            orderBy: { createdAt: "desc" },
          },
          positionApplied: {
            include: {
              AvailablePosition: {
                include: {
                  Company: true,
                },
              },
            },
            orderBy: { applyDate: "desc" },
          },
          Company: true,
          user: true,
          _count: true,
        },
      },
    },
  });

  if (!user || !user.Employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-gray-500">Profile not found or user is not an employee.</div>
        </div>
      </div>
    );
  }

  const employee = user.Employee;

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} employee={employee} />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoSection user={user} employee={employee} />
        </TabsContent>

        <TabsContent value="address" className="space-y-6">
          <AddressSection addresses={employee.address} />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioSection portfolios={employee.portfolios} />
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <ApplicationsSection applications={employee.positionApplied} />
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <CompanyAffiliationSection employee={employee} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
