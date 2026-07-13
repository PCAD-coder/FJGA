import { UploadCloud } from "lucide-react";

export default function ReferenceUpload() {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        Reference Images

      </label>

      <div className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed transition hover:bg-muted/50">

        <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />

        <p className="text-sm font-medium">

          Click or Drag files here

        </p>

        <p className="text-xs text-muted-foreground">

          JPG • PNG • WEBP

        </p>

      </div>

    </div>
  );
}