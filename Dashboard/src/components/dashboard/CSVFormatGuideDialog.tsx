import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface CSVFormatGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CSVFormatGuideDialog = ({ open, onOpenChange }: CSVFormatGuideDialogProps) => {
  const mockData = [
    { email: "john.doe@university.edu", first_name: "John", last_name: "Doe" },
    { email: "jane.smith@university.edu", first_name: "Jane", last_name: "Smith" },
    { email: "alex.jones@university.edu", first_name: "Alex", last_name: "Jones" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>CSV Format Guide</DialogTitle>
          <DialogDescription>
            Your CSV file must include these columns to properly import student data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">email</TableHead>
                  <TableHead className="font-semibold">first_name</TableHead>
                  <TableHead className="font-semibold">last_name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{row.email}</TableCell>
                    <TableCell>{row.first_name}</TableCell>
                    <TableCell>{row.last_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important Notes</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Email</strong> is required for matching existing students</li>
                <li>Column names are <strong>case-insensitive</strong> (Email, email, EMAIL all work)</li>
                <li>Spaces in headers are converted to underscores (First Name → first_name)</li>
                <li>First and last names help improve student matching accuracy</li>
                <li>The system will match by email first, then by name if email isn't found</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVFormatGuideDialog;
