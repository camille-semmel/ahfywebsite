import { useState, useMemo } from "react";
import { Plus, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudents } from "@/hooks/useStudents";
import { PersonalizedLinkDialog } from "@/components/students/PersonalizedLinkDialog";
import { Skeleton } from "@/components/ui/skeleton";

const Students = () => {
  const { data: students, isLoading, error } = useStudents();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewLink = (studentName: string) => {
    setSelectedStudent(studentName);
    setLinkDialogOpen(true);
  };

  // Real-time search filtering
  const filteredStudents = useMemo(() => {
    if (!students || !searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase().trim();
    
    return students.filter((student) => {
      const email = student?.email?.toLowerCase() || '';
      const firstName = student?.first_name?.toLowerCase() || '';
      const lastName = student?.last_name?.toLowerCase() || '';
      const status = student?.status?.toLowerCase() || '';
      const emotion = student?.last_emotion_identified?.toLowerCase() || '';
      const emotionalState = student?.emotional_state?.toLowerCase() || '';
      
      return (
        email.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        status.includes(query) ||
        emotion.includes(query) ||
        emotionalState.includes(query)
      );
    });
  }, [students, searchQuery]);

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-destructive">
          Error loading students: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">
            Demo School
          </h1>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, status, or emotion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredStudents?.length ?? 0} of {students?.length ?? 0} students
            </p>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-card rounded-card border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Student Email</TableHead>
                <TableHead className="font-semibold">Student Name</TableHead>
                <TableHead className="font-semibold">Student Last Name</TableHead>
                <TableHead className="font-semibold">
                  Status: Invited/Downloaded
                </TableHead>
                <TableHead className="font-semibold">Last Emotion Identified</TableHead>
                <TableHead className="font-semibold">Emotional State</TableHead>
                <TableHead className="font-semibold">Total Exercise Done</TableHead>
                <TableHead className="font-semibold">
                  Improvement Questionnaire
                </TableHead>
                <TableHead className="font-semibold">Personalized Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredStudents?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-12"
                  >
                    {searchQuery ? "No results match your search." : "No students found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents?.map((student) => (
                  <TableRow key={student?.user_id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{student?.email ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.first_name ?? 'Not Available'}</TableCell>
                    <TableCell>{student?.last_name ?? 'Not Available'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student?.status === "downloaded"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {student?.status ?? 'invited'}
                      </span>
                    </TableCell>
                    <TableCell>{student?.last_emotion_identified ?? 'Not Available'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student?.emotional_state === "critical"
                            ? "bg-destructive/10 text-destructive"
                            : student?.emotional_state === "moderate"
                              ? "bg-yellow-500/10 text-yellow-700"
                              : "bg-green-500/10 text-green-700"
                        }`}
                      >
                        {student?.emotional_state ?? 'good'}
                      </span>
                    </TableCell>
                    <TableCell>{student?.total_exercises_done ?? 0}</TableCell>
                    <TableCell>{student?.improvement_questionnaire ?? 'Pending'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleViewLink(`${student?.first_name ?? 'Student'} ${student?.last_name ?? ''}`)
                        }
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Personalized Link Dialog */}
        <PersonalizedLinkDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          studentName={selectedStudent}
        />
      </div>
    </div>
  );
};

export default Students;
