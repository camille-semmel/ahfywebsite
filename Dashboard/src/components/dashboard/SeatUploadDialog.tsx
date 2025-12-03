import { useState } from "react";
import { Upload, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { processStudentCSV } from "@/lib/csvProcessor";
import CSVFormatGuideDialog from "./CSVFormatGuideDialog";

interface SeatUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SeatUploadDialog = ({ open, onOpenChange }: SeatUploadDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    const isValidFile =
      droppedFile &&
      (droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv"));

    if (isValidFile) {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const isValidFile =
      selectedFile &&
      (selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv"));

    if (isValidFile) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const result = await processStudentCSV(file);
      
      // Refresh student data
      queryClient.invalidateQueries({ queryKey: ['students-overview'] });
      
      // Show success/error messages
      if (result.errors.length > 0) {
        toast({
          title: "Upload completed with errors",
          description: `Matched: ${result.matched}, Created: ${result.created}. ${result.errors.length} errors occurred.`,
          variant: "destructive",
        });
        console.error("CSV processing errors:", result.errors);
      } else {
        toast({
          title: "Upload successful",
          description: `Matched ${result.matched} students and created ${result.created} new entries.`,
        });
      }
      
      setFile(null);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fill in seats</DialogTitle>
          <DialogDescription>
            Upload a CSV file with student data to fill available seats.
          </DialogDescription>
        </DialogHeader>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFormatGuide(true)}
          className="w-fit gap-2 -mt-2 mb-2"
        >
          <Info className="h-4 w-4" />
          View CSV Format Guide
        </Button>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${isDragging ? "border-primary bg-primary/5" : "border-border"}
          `}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">Ready to upload</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Drop CSV file here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse
                </p>
              </div>
            )}
          </div>
        </div>

        {file && (
          <Button 
            onClick={handleUpload} 
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? "Processing..." : "Upload Students"}
          </Button>
        )}

        <CSVFormatGuideDialog 
          open={showFormatGuide} 
          onOpenChange={setShowFormatGuide} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default SeatUploadDialog;
