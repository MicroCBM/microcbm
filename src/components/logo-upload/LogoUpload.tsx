"use client";
import React, { useRef, useState, useCallback } from "react";
import { Control, useController } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/libs";
import { Icon } from "@/libs/icon";
import { Label } from "../label";
import { ErrorText } from "../error-text";

interface LogoUploadProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label?: string;
  className?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number; // maximum number of files allowed
  onFileSelect?: (file: File) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
  name,
  control,
  label,
  className,
  error,
  accept = "image/*",
  maxSize = 5, // 5MB default
  maxFiles = 1, // 1 file default
  onFileSelect,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    field: { onChange },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    rules: {
      required: "Logo is required",
      validate: (file) => {
        if (!file || !file[0]) return "Please select a logo";

        // Check if too many files
        if (file.length > maxFiles) {
          return `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`;
        }

        const selectedFile = file[0];

        // Check file type
        if (!selectedFile.type.startsWith("image/")) {
          return "Please select a valid image file";
        }

        // Check file size
        if (selectedFile.size > maxSize * 1024 * 1024) {
          return `File size must be less than ${maxSize}MB`;
        }

        return true;
      },
    },
  });

  const displayError = error || fieldError?.message;

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setFileName(file.name);
      onChange([file]);
      onFileSelect?.(file);
    },
    [maxSize, onChange, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setPreview(null);
    setFileName("");
    onChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-[6px]", className)}>
      {label && <Label className="font-normal">{label}</Label>}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          "hover:border-blue/50 hover:bg-blue/5",
          isDragOver && "border-blue bg-blue/10",
          displayError && "border-red-500",
          !displayError && !isDragOver && "border-grey"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={preview}
                alt="Logo preview"
                width={96}
                height={96}
                className="w-24 h-24 object-contain rounded-lg border border-grey"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Icon icon="mdi:close" className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:cloud-upload" className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                Drag and drop your logo here
              </p>
              <p className="text-xs text-gray-500">or click to browse files</p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      <ErrorText error={displayError} />
    </div>
  );
};

export default LogoUpload;
