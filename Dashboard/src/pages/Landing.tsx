import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      handleFileUpload(droppedFile);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      // Parse CSV here and store in Supabase
      // For now, just show success and navigate
      toast.success(`${uploadedFile.name} uploaded successfully`);
      
      // Simulate processing time
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Failed to upload CSV file");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-foreground">Welcome to Ahfy</h1>
          <p className="text-xl text-muted-foreground">
            You are on the right track to improve your student's mental health
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-lg font-medium text-foreground block">
            Students CSV
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-card p-12 text-center transition-all
              ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}
            `}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              {file ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">File ready to upload</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Drag and drop your CSV file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              )}
            </div>
          </div>

          {file && (
            <Button
              size="lg"
              className="w-full"
              onClick={() => handleFileUpload(file)}
            >
              Upload CSV
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
