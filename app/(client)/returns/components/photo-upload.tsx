"use client";

import { Upload } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props {
  onChange?: (files: FileList | null) => void;
  disabled?: boolean;
}

export default function PhotoUpload({
  onChange,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        4. Photo Evidence
      </label>

      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center">
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
          accept="image/jpeg,image/png"
          className="max-w-xs"
          disabled={disabled}
          onChange={(event) =>
            onChange?.(event.target.files)
          }
        />
      </div>
    </div>
  );
}