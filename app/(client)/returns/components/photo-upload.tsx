"use client";

import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  onChange?: (files: FileList | null) => void;
}

export default function PhotoUpload({ onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        4. Photo Evidence
      </label>

      <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4">

        <Upload className="h-12 w-12 text-muted-foreground" />

        <div>
          <p className="font-medium">
            Upload photos of the damaged or defective item
          </p>

          <p className="text-sm text-muted-foreground">
            JPG, PNG up to 10MB each (Maximum of 5 photos)
          </p>
        </div>

        <Input
          type="file"
          multiple
          accept="image/*"
          className="max-w-xs"
          onChange={(e) => onChange?.(e.target.files)}
        />
      </div>
    </div>
  );
}