import { useTherapistTeam, useAssignTherapist } from '@/hooks/useTherapists';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TherapistAssignmentDropdownProps {
  studentId: string;
  currentTherapistId: string | null;
  currentTherapistName: string | null;
}

export const TherapistAssignmentDropdown = ({
  studentId,
  currentTherapistId,
  currentTherapistName,
}: TherapistAssignmentDropdownProps) => {
  const { data: therapists } = useTherapistTeam();
  const assignTherapist = useAssignTherapist();

  const handleAssign = (therapistId: string) => {
    assignTherapist.mutate({ studentId, therapistId });
  };

  return (
    <Select
      value={currentTherapistId || undefined}
      onValueChange={handleAssign}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Assign therapist">
          {currentTherapistName || 'Unassigned'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {therapists?.map((therapist) => (
          <SelectItem key={therapist.id} value={therapist.id}>
            {therapist.first_name} {therapist.last_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
