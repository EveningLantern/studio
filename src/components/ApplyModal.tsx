'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendApplicationEmail } from '@/app/career/actions';
import { Loader2 } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export function ApplyModal({ isOpen, onClose, jobTitle }: ApplyModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set('jobTitle', jobTitle);

    const result = await sendApplicationEmail(formData);

    if (result.success) {
      toast({
        title: 'Application Sent!',
        description: "We've received your application and will be in touch soon.",
      });
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.message || 'An unexpected error occurred.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glassmorphism">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-black-500">Apply for {jobTitle}</DialogTitle>
          <DialogDescription className="text-black-600">
            Fill out the form below to submit your application. We look forward to hearing from you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-black-500 font-semibold">Full Name</Label>
            <Input id="name" name="name" required className="bg-input/50 border-orange-300 focus:border-orange-500 text-green-700" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-black-500 font-semibold">Email Address</Label>
            <Input id="email" name="email" type="email" required className="bg-input/50 border-orange-300 focus:border-orange-500 text-green-700" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message" className="text-black-500 font-semibold">Message (Optional)</Label>
            <Textarea id="message" name="message" placeholder="Tell us why you're a great fit..." className="bg-input/50 border-orange-300 focus:border-orange-500 text-green-700" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resume" className="text-black-500 font-semibold">Resume (PDF, DOC, DOCX)</Label>
            <Input id="resume" name="resume" type="file" required accept=".pdf,.doc,.docx" className="bg-input/50 border-orange-300 focus:border-orange-500 text-green-700 file:text-orange-500 file:bg-orange-50" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-orange-500 hover:text-orange-600 hover:bg-orange-50">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
