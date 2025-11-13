import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, Globe, MapPin } from "lucide-react";
import { EmployeeGetPayload } from "@/types/entity.relations";

export function CompanyAffiliationSection({ employee }: { employee: EmployeeGetPayload }) {
  const company = employee.Company;

  return (
    <Card>
      <div className="space-y-4">
        <CardHeader>
          <div>
            <CardTitle className="text-blue-900">Perusahaan Terafiliasi</CardTitle>
            <CardDescription>Informasi perusahaan Anda saat ini</CardDescription>
          </div>
        </CardHeader>

        {company ? (
          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {company.name}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-700">Karyawan saat ini</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    {company.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    {company.phone}
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{company.address}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">Tentang Perusahaan</h4>
                <p className="text-gray-700 leading-relaxed">{company.description}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-blue-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada afiliasi perusahaan</h3>
              <p className="text-gray-600 text-center">Anda saat ini tidak terafiliasi dengan perusahaan manapun. Ini akan diperbarui ketika Anda diterima bekerja.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Card>
  );
}
