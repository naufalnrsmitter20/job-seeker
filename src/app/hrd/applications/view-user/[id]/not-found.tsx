import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Employee Not Found</h1>
        <p className="text-gray-600 mt-2">
          The employee profile you{"'"}re looking for doesn{"'"}t exist.
        </p>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Profile Not Found</h3>
              <p className="text-red-800 text-sm">
                We couldn{"'"}t find the employee profile you{"'"}re trying to access. It may have been deleted or the ID is incorrect.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link href="/dashboard/users">
          <Button className="bg-blue-600 hover:bg-blue-700">Back to Users</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="border-blue-200 text-blue-600 bg-transparent">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
