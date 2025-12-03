import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { useTherapistTeam, useStudentsUnderCare, useDeleteTherapist } from "@/hooks/useTherapists";
import { AddTherapistForm } from "@/components/therapist/AddTherapistForm";
import { TherapistAssignmentDropdown } from "@/components/therapist/TherapistAssignmentDropdown";
import { useMemo } from "react";

const Therapist = () => {
  const { data: therapistTeam, isLoading: loadingTeam } = useTherapistTeam();
  const { data: studentsUnderCare, isLoading: loadingStudents } = useStudentsUnderCare();
  const deleteTherapist = useDeleteTherapist();

  const kpis = useMemo(() => {
    if (!studentsUnderCare) {
      return { needingAttention: 0, scheduled: 0 };
    }

    const needingAttention = studentsUnderCare.filter(
      (s) => s.meeting_status === 'in queue'
    ).length;

    const scheduled = studentsUnderCare.filter(
      (s) => s.meeting_status === 'scheduled'
    ).length;

    return { needingAttention, scheduled };
  }, [studentsUnderCare]);

  const getInitials = (firstName: string, lastName?: string | null): string => {
    if (lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    return firstName.substring(0, 2).toUpperCase();
  };

  const handleDeleteTherapist = (therapistId: string, therapistName: string) => {
    if (confirm(`Are you sure you want to remove ${therapistName} from the team?`)) {
      deleteTherapist.mutate(therapistId);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section 1: Therapist Team */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-6">Therapist Team</h1>
          <Card>
            <CardContent className="p-6">
              <AddTherapistForm />
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                {loadingTeam ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[250px]" />
                      </div>
                    </div>
                  ))
                ) : therapistTeam?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No therapists added yet. Add your first therapist above.
                  </p>
                ) : (
                  therapistTeam?.map((therapist, index) => (
                    <div key={therapist.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(therapist.first_name, therapist.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {therapist.first_name} {therapist.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{therapist.email}</p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTherapist(
                            therapist.id, 
                            `${therapist.first_name} ${therapist.last_name || ''}`
                          )}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < (therapistTeam?.length || 0) - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Students Under Care KPIs */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Students Under Care</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Students Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStudents ? (
                  <Skeleton className="h-12 w-20" />
                ) : (
                  <p className="text-4xl font-bold text-primary">{kpis.needingAttention}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Students Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStudents ? (
                  <Skeleton className="h-12 w-20" />
                ) : (
                  <p className="text-4xl font-bold text-primary">{kpis.scheduled}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 3: Student Care Table */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Student Care</h2>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Email</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Last Emotion Identified</TableHead>
                      <TableHead>Emotional State</TableHead>
                      <TableHead>Assigned Therapist</TableHead>
                      <TableHead>Meeting Status</TableHead>
                      <TableHead>Questionnaire Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingStudents ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 7 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-6 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : studentsUnderCare?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                          No students requiring attention at this time.
                        </TableCell>
                      </TableRow>
                    ) : (
                      studentsUnderCare?.map((student) => (
                        <TableRow key={student.user_id}>
                          <TableCell className="font-medium">{student.email}</TableCell>
                          <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                          <TableCell>{student.last_emotion_identified}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.emotional_state === 'critical'
                                  ? 'destructive'
                                  : student.emotional_state === 'moderate'
                                    ? 'default'
                                    : 'secondary'
                              }
                              className="capitalize"
                            >
                              {student.emotional_state}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TherapistAssignmentDropdown
                              studentId={student.user_id}
                              currentTherapistId={student.assigned_therapist_id}
                              currentTherapistName={student.assigned_therapist_name}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={student.meeting_status === 'scheduled' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {student.meeting_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">Score: {student.questionnaire_score}</div>
                              <div className="text-muted-foreground text-xs capitalize">
                                {student.questionnaire_category}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Therapist;
