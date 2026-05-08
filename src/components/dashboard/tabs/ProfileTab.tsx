// components/dashboard/tabs/ProfileTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import { Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";
import { updatePatient } from "@/lib/actions/patient.actions";

export default function ProfileTab({ user, patient }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    email: patient?.email || "",
    phone: patient?.phone || "",
    address: patient?.address || "",
    occupation: patient?.occupation || "",
    emergencyContactName: patient?.emergencyContactName || "",
    emergencyContactNumber: patient?.emergencyContactNumber || "",
    allergies: patient?.allergies || "",
    currentMedication: patient?.currentMedication || "",
    insuranceProvider: patient?.insuranceProvider || "",
    insurancePolicyNumber: patient?.insurancePolicyNumber || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updatePatient(patient.$id, formData);
      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(result.error?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-24-bold text-white">Personal Information</h2>
        <Button
          variant="outline"
          className="border-dark-500 text-dark-600 hover:bg-dark-500"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
          <h3 className="text-18-bold text-white">Basic Information</h3>
          <div className="space-y-3">
            {[
              { label: "Full Name", key: "name" },
              { label: "Email", key: "email" },
              { label: "Phone", key: "phone" },
              {
                label: "Gender",
                key: "gender",
                value: patient?.gender,
                editable: false,
              },
              {
                label: "Date of Birth",
                key: "birthDate",
                value: formatDateTime(patient?.birthDate).dateOnly,
                editable: false,
              },
              { label: "Address", key: "address" },
              { label: "Occupation", key: "occupation" },
            ].map((item) => (
              <div
                key={item.key}
                className="border-dark-500 flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-0"
              >
                <span className="text-14-regular text-dark-600">
                  {item.label}
                </span>
                {isEditing && item.editable !== false ? (
                  <Input
                    value={formData[item.key as keyof typeof formData] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [item.key]: e.target.value })
                    }
                    className="bg-dark-300 border-dark-500 h-8 w-48 text-sm text-white"
                  />
                ) : (
                  <span className="text-14-medium text-white capitalize">
                    {item.value ||
                      formData[item.key as keyof typeof formData] ||
                      "—"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Medical Information */}
          <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
            <h3 className="text-18-bold text-white">Medical Information</h3>
            <div className="space-y-3">
              {[
                {
                  label: "Primary Physician",
                  key: "primaryPhysician",
                  value: patient?.primaryPhysician,
                  editable: false,
                },
                { label: "Insurance Provider", key: "insuranceProvider" },
                { label: "Policy Number", key: "insurancePolicyNumber" },
                { label: "Allergies", key: "allergies" },
                { label: "Current Medications", key: "currentMedication" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="border-dark-500 flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-0"
                >
                  <span className="text-14-regular text-dark-600">
                    {item.label}
                  </span>
                  {isEditing && item.editable !== false ? (
                    <Input
                      value={formData[item.key as keyof typeof formData] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [item.key]: e.target.value })
                      }
                      className="bg-dark-300 border-dark-500 h-8 w-48 text-sm text-white"
                    />
                  ) : (
                    <span className="text-14-medium text-white">
                      {item.value ||
                        formData[item.key as keyof typeof formData] ||
                        "—"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
            <h3 className="text-18-bold text-white">Emergency Contact</h3>
            <div className="space-y-3">
              {[
                { label: "Contact Name", key: "emergencyContactName" },
                { label: "Contact Number", key: "emergencyContactNumber" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="border-dark-500 flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-0"
                >
                  <span className="text-14-regular text-dark-600">
                    {item.label}
                  </span>
                  {isEditing ? (
                    <Input
                      value={formData[item.key as keyof typeof formData] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [item.key]: e.target.value })
                      }
                      className="bg-dark-300 border-dark-500 h-8 w-48 text-sm text-white"
                    />
                  ) : (
                    <span className="text-14-medium text-white">
                      {formData[item.key as keyof typeof formData] || "—"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
