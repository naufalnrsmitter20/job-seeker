"use client";

import { useState, useActionState, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { updateAddressById, deleteAddressById } from "@/utils/actions/address.actions";
import { useRouter } from "next/navigation";
import { AddressGetPayload } from "@/types/entity.relations";
import toast from "react-hot-toast";

export function AddressSection({ addresses }: { addresses: AddressGetPayload[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Updating address...");
    try {
      const formData = new FormData(e.target);
      const result = await updateAddressById(formData, editingId as string);
      if (!result.error) {
        setEditingId(null);
        router.refresh();
        toast.success(result.message, { id: toastId });
        setIsCreating(false);
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.", { id: toastId });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const toastId = toast.loading("Deleting address...");
    try {
      const result = await deleteAddressById(id);
      if (!result.error) {
        router.refresh();
        toast.success(result.message, { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address.", { id: toastId });
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">
                Addresses <i>(Max 2)</i>
              </CardTitle>
              <CardDescription>Manage your address information</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" name="street" required />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" name="state" required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" defaultValue="Indonesia" required />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" type="number" required />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Save Address
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <div className="grid gap-4 px-4">
          {addresses.map((address) => (
            <Card key={address.id} className="border-blue-100">
              <CardContent className="p-4">
                {editingId === address.id ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor={`street-${address.id}`}>Street Address</Label>
                        <Input id={`street-${address.id}`} name="street" defaultValue={address.street} required />
                      </div>
                      <div>
                        <Label htmlFor={`city-${address.id}`}>City</Label>
                        <Input id={`city-${address.id}`} name="city" defaultValue={address.city} required />
                      </div>
                      <div>
                        <Label htmlFor={`state-${address.id}`}>State/Province</Label>
                        <Input id={`state-${address.id}`} name="state" defaultValue={address.state} required />
                      </div>
                      <div>
                        <Label htmlFor={`country-${address.id}`}>Country</Label>
                        <Input id={`country-${address.id}`} name="country" defaultValue={address.country} required />
                      </div>
                      <div>
                        <Label htmlFor={`zip-${address.id}`}>ZIP Code</Label>
                        <Input type="number" id={`zip-${address.id}`} name="zip" defaultValue={address.zip} required />
                      </div>
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
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{address.street}</span>
                      </div>
                      <div className="text-gray-600">
                        {address.city}, {address.state} {address.zip}
                      </div>
                      <Badge variant="outline">{address.country}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(address.id)} className="border-blue-200 text-blue-600 bg-transparent">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          const confirmation = confirm("Are you sure you want to delete this address?");
                          if (confirmation) {
                            handleDeleteAddress(address.id);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {addresses.length === 0 && (
            <Card className="border-dashed border-blue-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses added</h3>
                <p className="text-gray-600 text-center mb-4">Add your address information to complete your profile.</p>
                <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
