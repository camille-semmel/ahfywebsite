import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddTherapist } from '@/hooks/useTherapists';

export const AddTherapistForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const addTherapist = useAddTherapist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !email.trim()) {
      return;
    }
    
    addTherapist.mutate(
      { 
        firstName: firstName.trim(), 
        lastName: lastName.trim() || undefined,
        email: email.trim().toLowerCase()
      },
      {
        onSuccess: () => {
          setFirstName('');
          setLastName('');
          setEmail('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
      <Input
        type="text"
        placeholder="First Name *"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="flex-1"
        required
      />
      <Input
        type="text"
        placeholder="Last Name (Optional)"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="flex-1"
      />
      <Input
        type="email"
        placeholder="Email Address *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
        required
      />
      <Button 
        type="submit" 
        disabled={addTherapist.isPending}
        className="whitespace-nowrap"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Therapist
      </Button>
    </form>
  );
};
