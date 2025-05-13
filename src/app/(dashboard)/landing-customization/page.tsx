"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageUploadModal } from "@/components/landing-customization/ImageUploadModal";
import { ImagePreviewModal } from "@/components/landing-customization/ImagePreviewModal";
import { useToast } from "@/components/ui/use-toast";

interface ImageSection {
  id: string;
  section: string;
  path: string;
  placeholder: string;
  required: boolean;
}

const imageSections: ImageSection[] = [
  {
    id: 'hero-bg',
    section: 'Hero Background',
    path: '/images/landing/hero/background.jpg',
    placeholder: 'Main hero section background image',
    required: true
  },
  {
    id: 'hero-overlay',
    section: 'Hero Overlay',
    path: '/images/landing/hero/overlay.png',
    placeholder: 'Hero section overlay image',
    required: false
  },
  {
    id: 'brand-audi',
    section: 'Audi Brand Logo',
    path: '/images/landing/brands/audi.png',
    placeholder: 'Audi brand logo image',
    required: true
  },
  {
    id: 'brand-bmw',
    section: 'BMW Brand Logo',
    path: '/images/landing/brands/bmw.png',
    placeholder: 'BMW brand logo image',
    required: true
  },
  // Add more sections as needed
];

export default function LandingCustomizationPage() {
  const [selectedSection, setSelectedSection] = useState<ImageSection | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    try {
      // Here you would implement the file upload logic
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      setShowUploadModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (sectionId: string) => {
    try {
      // Here you would implement the image removal logic
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Landing Page Customization</h1>
      </div>

      <div className="bg-card rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Required</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {imageSections.map((section) => (
              <TableRow key={section.id}>
                <TableCell className="font-medium">{section.section}</TableCell>
                <TableCell>{section.placeholder}</TableCell>
                <TableCell>{section.required ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSection(section);
                        setShowPreviewModal(true);
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSection(section);
                        setShowUploadModal(true);
                      }}
                    >
                      Upload
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(section.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showUploadModal && selectedSection && (
        <ImageUploadModal
          section={selectedSection}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      {showPreviewModal && selectedSection && (
        <ImagePreviewModal
          section={selectedSection}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
} 