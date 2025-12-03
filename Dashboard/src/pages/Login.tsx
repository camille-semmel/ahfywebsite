import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMfaChallenge, setShowMfaChallenge] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);

  // Redirect if already logged in (but not during MFA verification)
  useEffect(() => {
    if (user && !authLoading && !isVerifyingMfa) {
      navigate("/dashboard");
    }
  }, [user, authLoading, isVerifyingMfa, navigate]);

  // Show loading state while auth initializes
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsVerifyingMfa(true);  // Set this FIRST to block useEffect redirect

    // Sign in with email and password (creates AAL1 session)
    const { error } = await signIn(email, password);

    if (error) {
      setLoading(false);
      setIsVerifyingMfa(false);  // Reset on error
      toast.error(error.message || "Failed to sign in");
      return;
    }

    // Check if MFA verification is required using AAL level
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    
    // If currentLevel is aal1 and nextLevel is aal2, MFA verification is required
    if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
      setShowMfaChallenge(true);
      setLoading(false);
      // Keep isVerifyingMfa as true
      toast.info("Please enter your 6-digit authentication code");
      return;
    }

    // No MFA required - user is fully authenticated
    setIsVerifyingMfa(false);  // Clear flag to allow navigation
    setLoading(false);
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  const handleMfaVerify = async () => {
    if (mfaCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        throw new Error('No MFA factor found');
      }

      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) throw challenge.error;

      const verification = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code: mfaCode,
      });

      if (verification.error) throw verification.error;

      // Session is now upgraded to AAL2
      setIsVerifyingMfa(false);  // Allow navigation
      toast.success('Login successful');
      navigate('/dashboard');

    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            <h1 className="text-3xl font-semibold">Welcome to Ahfy</h1>
          </div>
          
          <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={showMfaChallenge}
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={showMfaChallenge}
            />
            
            {showMfaChallenge && (
              <div className="space-y-2">
                <Label htmlFor="mfa-code">Authentication Code</Label>
                <Input
                  id="mfa-code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="font-mono text-center text-2xl tracking-widest"
                />
                <Button 
                  type="button"
                  onClick={handleMfaVerify} 
                  disabled={loading || mfaCode.length !== 6}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowMfaChallenge(false);
                    setMfaCode('');
                    setIsVerifyingMfa(false);
                  }}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            )}
            
            {!showMfaChallenge && (
              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            )}
          </form>

          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Don't have an account?</p>
            <a href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
