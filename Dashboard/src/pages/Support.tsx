import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Support = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-form-email', {
        body: {
          formType: 'support',
          name: formData.fullName,
          email: formData.email,
          message: formData.message,
          company: formData.company || undefined,
        },
      });

      if (error) throw error;

      // Show success message
      toast({
        title: "Thank you for reaching out!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (error: any) {
      console.error('Error sending support email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Let us know how we can help
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            We're here to help and answer any question you might have. We look
            forward to hearing from you! Please fill out the form, or use the
            contact information below.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="fullName" className="text-foreground">
                  Full name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-foreground">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-foreground">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-2 min-h-[120px]"
                  placeholder="Tell us how we can help..."
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Submit'}
              </Button>
            </form>
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">support@ahfy.app</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">+61 469 321 545</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Adelaide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
