import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
}

export function FileUpload({
  onFileSelect,
  accept = { "text/csv": [".csv"] },
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          }`}
          data-testid="upload-zone"
        >
          <input {...getInputProps()} data-testid="input-file-upload" />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">
                {isDragActive
                  ? "Drop your CSV file here"
                  : "Upload Dataset"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop your CSV file here, or click to browse
              </p>
            </div>
            <Button variant="outline" data-testid="button-browse-files">
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold" data-testid="text-filename">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              data-testid="button-remove-file"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
