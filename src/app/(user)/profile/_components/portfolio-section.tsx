"use client";

import { useState, useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Pencil, Trash2, Download, ExternalLink } from "lucide-react";
import { updatePortofolioById, deletePortofolioById } from "@/utils/actions/portofolio.actions";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";

type Portfolio = {
  id: string;
  skill: string;
  description: string;
  file: string;
  createdAt: Date;
};

export function PortfolioSection({ portfolios, employeeId }: { portfolios: Portfolio[]; employeeId: string }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [createState, createAction] = useActionState(async (prev: any, formData: FormData) => {
    const result = await updatePortofolioById(formData);
    if (!result.error) {
      setIsCreating(false);
      router.refresh();
    }
    return result;
  }, null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [updateState, updateAction] = useActionState(async (prev: any, formData: FormData) => {
    if (!editingId) return prev;
    const result = await updatePortofolioById(formData, editingId);
    if (!result.error) {
      setEditingId(null);
      router.refresh();
    }
    return result;
  }, null);

  return (
    <Card>
      <div className="space-y-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Portfolio</CardTitle>
              <CardDescription>Showcase your skills and projects</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Portfolio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Portfolio Item</DialogTitle>
                </DialogHeader>
                <form action={createAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill">Skill/Technology</Label>
                    <Input id="skill" name="skill" placeholder="e.g., React, Python, UI/UX Design" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe your experience, projects, or achievements with this skill..." rows={4} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Portfolio File/Link</Label>
                    <Input id="file" name="file" placeholder="Upload file or paste link to your work" required />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Add Portfolio
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="border-blue-100">
              <CardContent className="p-6">
                {editingId === portfolio.id ? (
                  <form action={updateAction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`skill-${portfolio.id}`}>Skill/Technology</Label>
                      <Input id={`skill-${portfolio.id}`} name="skill" defaultValue={portfolio.skill} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${portfolio.id}`}>Description</Label>
                      <Textarea id={`description-${portfolio.id}`} name="description" defaultValue={portfolio.description} rows={4} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`file-${portfolio.id}`}>Portfolio File/Link</Label>
                      <Input id={`file-${portfolio.id}`} name="file" defaultValue={portfolio.file} required />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-blue-900">{portfolio.skill}</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{portfolio.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            Added {formatDate(portfolio.createdAt)}
                          </Badge>
                          {portfolio.file.startsWith("http") ? (
                            <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto" asChild>
                              <a href={portfolio.file} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Project
                              </a>
                            </Button>
                          ) : (
                            <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                              <Download className="h-4 w-4 mr-1" />
                              Download File
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(portfolio.id)} className="border-blue-200 text-blue-600 bg-transparent">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <form
                          action={async () => {
                            await deletePortofolioById(portfolio.id);
                            router.refresh();
                          }}
                        >
                          <Button variant="outline" size="sm" className="border-red-200 text-red-600 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {portfolios.length === 0 && (
            <Card className="border-dashed border-blue-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items</h3>
                <p className="text-gray-600 text-center mb-4">Add your skills, projects, and achievements to showcase your expertise to potential employers.</p>
                <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Portfolio
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
