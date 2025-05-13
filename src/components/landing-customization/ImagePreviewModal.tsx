"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ImageSection {
  id: string;
  section: string;
  path: string;
  placeholder: string;
  required: boolean;
}

interface ImagePreviewModalProps {
  section: ImageSection;
  onClose: () => void;
}

export function ImagePreviewModal({
  section,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview: {section.section}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          <Image
            src={section.path}
            alt={section.placeholder}
            fill
            className="object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 