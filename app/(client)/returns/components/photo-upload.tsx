"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface Props {
  files: FileList | null;
  onChange: (files: FileList | null) => void;
  disabled?: boolean;
}

function PhotoPreview({ file }: { file: File }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (imageRef.current) imageRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    // Local file previews use object URLs and do not need image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={imageRef} alt={`Photo evidence: ${file.name}`} className="aspect-square w-full bg-muted object-contain" />
  );
}

export default function PhotoUpload({
  files,
  onChange,
  disabled = false,
}: Props) {
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);
  const selectedFiles = Array.from(files ?? []);

  function updateFiles(nextFiles: File[]) {
    const transfer = new DataTransfer();
    nextFiles.forEach((file) => transfer.items.add(file));
    onChange(nextFiles.length ? transfer.files : null);
  }

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="font-medium">
        4. Photo Evidence
      </label>

      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed bg-muted/20 p-6 text-center">
        <Upload className="h-10 w-10 text-muted-foreground" aria-hidden="true" />

        <div>
          <p className="font-medium">
            Upload photos of the damaged or defective item
          </p>

          <p id={helpId} className="text-sm text-muted-foreground">
            JPG or PNG, up to 10 MB each. Add up to 5 photos and preview them below.
          </p>
        </div>

        <Input
          id={inputId}
          type="file"
          multiple
          accept="image/jpeg,image/png"
          className="max-w-xs"
          disabled={disabled || selectedFiles.length >= 5}
          aria-invalid={!!error}
          aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`}
          onChange={(event) => {
            const addedFiles = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (!addedFiles.length) return;
            setError(null);
            if (selectedFiles.length + addedFiles.length > 5) {
              setError("You can upload a maximum of 5 photos. Remove a photo before adding more.");
              return;
            }
            for (const file of addedFiles) {
              if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError(`“${file.name}” is not supported. Please choose a JPG or PNG image.`);
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                setError(`“${file.name}” exceeds the 10 MB limit.`);
                return;
              }
            }
            updateFiles([...selectedFiles, ...addedFiles]);
          }}
        />
      </div>

      {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground" role="status">
            {selectedFiles.length} of 5 photos selected
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="relative overflow-hidden rounded-lg border bg-card">
                <PhotoPreview file={file} />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 size-7 rounded-full shadow-sm"
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => {
                    setError(null);
                    updateFiles(selectedFiles.filter((_, position) => position !== index));
                  }}
                >
                  <X className="size-4" />
                </Button>
                <div className="space-y-1 p-2">
                  <p className="truncate text-xs font-medium" title={file.name}>{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
