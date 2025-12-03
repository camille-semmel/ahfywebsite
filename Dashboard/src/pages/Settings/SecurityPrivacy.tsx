import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n/i18n';
import { useAuth } from '@/contexts/AuthContext';

const SecurityPrivacy = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, updatePassword, enrollMfa, verifyMfaEnrollment, checkMfaStatus, unenrollMfa } = useAuth();
  
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [qrCode, setQrCode] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isEnrollingMfa, setIsEnrollingMfa] = useState(false);
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);
  const [currentFactorId, setCurrentFactorId] = useState<string>('');

  useEffect(() => {
    const loadMfaStatus = async () => {
      const enabled = await checkMfaStatus();
      setMfaEnabled(enabled);
      
      // Get factor ID if MFA is enabled
      if (enabled) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data } = await supabase.auth.mfa.listFactors();
          if (data?.totp?.[0]?.id) {
            setCurrentFactorId(data.totp[0].id);
          }
        } catch (error) {
          console.error('Error loading factor ID:', error);
        }
      }
    };
    loadMfaStatus();
  }, [checkMfaStatus]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: t('required_field'),
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast({
        title: validationError,
        variant: 'destructive',
      });
      return;
    }
    
    setIsChangingPassword(true);
    const { error } = await updatePassword(currentPassword, newPassword);
    setIsChangingPassword(false);
    
    if (error) {
      toast({
        title: error.message || 'Failed to update password',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: t('password_updated'),
      description: 'You can now use your new password to log in',
    });
    
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleStartMfaEnrollment = async () => {
    setIsEnrollingMfa(true);
    const { data, error } = await enrollMfa();
    setIsEnrollingMfa(false);
    
    if (error) {
      toast({
        title: 'Failed to start MFA enrollment',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    setQrCode(data.totp.qr_code);
    setSecretKey(data.totp.secret);
    setFactorId(data.id);
    setOtpDialogOpen(true);
  };

  const handleVerifyMfa = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      });
      return;
    }
    
    setIsVerifyingMfa(true);
    const { error } = await verifyMfaEnrollment(factorId, verificationCode);
    setIsVerifyingMfa(false);
    
    if (error) {
      toast({
        title: 'Verification failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: t('2fa_enabled'),
      description: 'Two-factor authentication has been enabled',
    });
    
    setMfaEnabled(true);
    setCurrentFactorId(factorId);
    setOtpDialogOpen(false);
    setVerificationCode('');
    setQrCode('');
    setSecretKey('');
    setFactorId('');
  };

  const handleDisableMfa = async () => {
    if (!currentFactorId) {
      toast({
        title: 'Error',
        description: 'No MFA factor found',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await unenrollMfa(currentFactorId);
    
    if (error) {
      toast({
        title: 'Failed to disable 2FA',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: '2FA Disabled',
      description: 'Two-factor authentication has been disabled',
    });
    
    setMfaEnabled(false);
    setCurrentFactorId('');
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-primary">{t('security_privacy')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('account_email')}</CardTitle>
            <CardDescription>Your registered email address</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="email"
              value={user?.email || 'Loading...'}
              disabled
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('change_password')}</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setPasswordDialogOpen(true)}>
              {t('change_password')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('otp_registration')}</CardTitle>
            <CardDescription>Set up two-factor authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mfaEnabled ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">2FA is enabled</span>
                </div>
                <Button variant="destructive" onClick={handleDisableMfa}>
                  Disable 2FA
                </Button>
              </div>
            ) : (
              <Button onClick={handleStartMfaEnrollment} disabled={isEnrollingMfa}>
                {isEnrollingMfa ? 'Setting up...' : t('enable_2fa')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Password Change Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('change_password')}</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current">{t('current_password')}</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">{t('new_password')}</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            getPasswordStrength(newPassword) >= level
                              ? 'bg-green-500'
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {
                        getPasswordStrength(newPassword) < 3 ? 'Weak' :
                        getPasswordStrength(newPassword) < 5 ? 'Medium' : 'Strong'
                      }
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">{t('confirm_password')}</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating...' : t('update_password')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* OTP Registration Dialog */}
        <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('enable_2fa')}</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                {qrCode ? (
                  <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 bg-muted flex items-center justify-center rounded-lg">
                    <span className="text-muted-foreground">Loading QR Code...</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>{t('secret_key')}</Label>
                <Input
                  value={secretKey}
                  readOnly
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Manual entry if you can't scan the QR code
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verification-code">Enter 6-digit code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="font-mono text-center text-2xl tracking-widest"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleVerifyMfa} disabled={isVerifyingMfa}>
                {isVerifyingMfa ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
