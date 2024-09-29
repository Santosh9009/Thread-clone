"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Upload } from "lucide-react";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { toast } from "../ui/use-toast";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

interface ProfilePicUploadComponentProps {
  defaultImageUrl?: string; // For pre-populating with the user's existing profile picture
  onUploadSuccess: (uploadedFile: CloudinaryUploadResult) => void;
}

export const ProfilePicUploadComponent: React.FC<ProfilePicUploadComponentProps> = ({
  defaultImageUrl,
  onUploadSuccess,
}) => {
  const [resource, setResource] = useState<CloudinaryUploadResult | null>(null);

  const handleUploadSuccess = (uploadedFile: CloudinaryUploadResult) => {
    setResource(uploadedFile);
    onUploadSuccess(uploadedFile);
  };

  const handleRemoveImage = () => {
    setResource(null);
    onUploadSuccess({ secure_url: "", public_id: "" }); // Clear the form field
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        {resource ? (
          <AvatarImage src={resource.secure_url} alt="Uploaded Profile Picture" />
        ) : defaultImageUrl ? (
          <AvatarImage src={defaultImageUrl} alt="Profile Picture" />
        ) : (
          <AvatarFallback>
            <Image alt="User" src={DummyUserIcon} />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Cloudinary Upload Widget */}
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result) => {
          const uploadedFiles: CloudinaryUploadResult[] = Array.isArray(result?.info)
            ? result.info.filter(
                (file): file is CloudinaryUploadResult =>
                  !!file &&
                  typeof file === "object" &&
                  "secure_url" in file &&
                  "public_id" in file
              )
            : result?.info &&
              typeof result.info === "object" &&
              "secure_url" in result.info &&
              "public_id" in result.info
            ? [result.info as CloudinaryUploadResult]
            : [];

          if (uploadedFiles.length === 1) {
            handleUploadSuccess(uploadedFiles[0]);
          } else {
            toast({ description: "You can only upload one photo." });
          }
        }}
        options={{
          multiple: false,
          maxFiles: 1,
        }}
      >
        {({ open }) => (
          <button
            className="flex justify-center items-center gap-1 hover:bg-[#090909] p-2 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              if (resource) {
                toast({ description: "You can only upload one photo." });
              } else {
                open();
              }
            }}
          >
            upload <Upload className="w-4 h-4" />
          </button>
        )}
      </CldUploadWidget>

      {resource && (
        <button onClick={handleRemoveImage} className="text-red-500 mt-2">
          Remove
        </button>
      )}
    </div>
  );
};
