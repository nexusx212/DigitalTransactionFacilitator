import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Shield, Bell, Globe, Moon, Sun, Smartphone, Lock, LogOut, LucideIcon, Mail, BellRing, BellOff, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/hooks/use-i18n';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, changeLanguage } = useI18n();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // Settings states
  const [general, setGeneral] = useState({
    theme: 'system',
    language: language || 'en',
    timezone: 'Africa/Kampala',
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketplaceUpdates: true,
    tradeFinanceAlerts: true,
    paymentNotifications: true,
    marketingEmails: false,
  });
  
  const handleThemeChange = (value: string) => {
    setGeneral({...general, theme: value});
    // Apply theme change logic
  };
  
  const handleLanguageChange = (value: string) => {
    setGeneral({...general, language: value});
    changeLanguage(value);
  };
  
  const handleGeneralSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings Saved',
        description: 'Your general settings have been updated successfully.',
        variant: 'default',
      });
    }, 1500);
  };
  
  const handleSecuritySave = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
        variant: 'default',
      });
      setSecurity({
        ...security,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1500);
  };
  
  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };
  
  const handleNotificationsSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Notification Settings Saved',
        description: 'Your notification preferences have been updated.',
        variant: 'default',
      });
    }, 1500);
  };
  
  // Setting item component for notification settings
  const NotificationItem = ({ 
    title, 
    description, 
    icon: Icon, 
    enabled, 
    onChange 
  }: { 
    title: string; 
    description: string; 
    icon: LucideIcon; 
    enabled: boolean; 
    onChange: () => void;
  }) => (
    <div className="flex items-start justify-between space-x-4 py-4">
      <div className="flex items-start space-x-4">
        <Icon className="mt-1 h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="relative rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="relative rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="relative rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your interface preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={general.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={general.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center">
                        <span className="mr-2">🇬🇧</span>
                        <span>English</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="fr">
                      <div className="flex items-center">
                        <span className="mr-2">🇫🇷</span>
                        <span>Français</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ar">
                      <div className="flex items-center">
                        <span className="mr-2">🇪🇬</span>
                        <span>العربية</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sw">
                      <div className="flex items-center">
                        <span className="mr-2">🇰🇪</span>
                        <span>Kiswahili</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="zh">
                      <div className="flex items-center">
                        <span className="mr-2">🇨🇳</span>
                        <span>中文</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={general.timezone} onValueChange={(value) => setGeneral({...general, timezone: value})}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Kampala">East Africa Time (UTC+3)</SelectItem>
                    <SelectItem value="Africa/Lagos">West Africa Time (UTC+1)</SelectItem>
                    <SelectItem value="Africa/Cairo">Eastern European Time (UTC+2)</SelectItem>
                    <SelectItem value="Africa/Johannesburg">South Africa Standard Time (UTC+2)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (UTC+0)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="Asia/Dubai">Gulf Standard Time (UTC+4)</SelectItem>
                    <SelectItem value="Asia/Shanghai">China Standard Time (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleGeneralSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>
                Update your password and manage two-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSecuritySave} 
                    disabled={saving || !security.currentPassword || !security.newPassword || !security.confirmPassword}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({...security, twoFactorEnabled: checked})}
                  />
                </div>
                
                {security.twoFactorEnabled && (
                  <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Two-factor authentication is enabled</p>
                        <p className="text-sm text-muted-foreground">
                          You'll be asked for a verification code when you sign in on a new device.
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Configure Two-Factor Authentication
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <p className="text-sm text-muted-foreground">Choose how you want to receive notifications</p>
              </div>
              
              <div className="border rounded-lg divide-y">
                <NotificationItem
                  title="Email Notifications"
                  description="Receive important updates via email"
                  icon={Mail}
                  enabled={notifications.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                />
                
                <NotificationItem
                  title="Push Notifications"
                  description="Receive alerts on your device"
                  icon={Bell}
                  enabled={notifications.pushNotifications}
                  onChange={() => handleNotificationToggle('pushNotifications')}
                />
              </div>
              
              <div className="space-y-1 pt-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <p className="text-sm text-muted-foreground">Select which types of notifications you'd like to receive</p>
              </div>
              
              <div className="border rounded-lg divide-y">
                <NotificationItem
                  title="Marketplace Updates"
                  description="New products, price changes, and offers"
                  icon={Globe}
                  enabled={notifications.marketplaceUpdates}
                  onChange={() => handleNotificationToggle('marketplaceUpdates')}
                />
                
                <NotificationItem
                  title="Trade Finance Alerts"
                  description="Invoice status changes and financing updates"
                  icon={BellRing}
                  enabled={notifications.tradeFinanceAlerts}
                  onChange={() => handleNotificationToggle('tradeFinanceAlerts')}
                />
                
                <NotificationItem
                  title="Payment Notifications"
                  description="Transaction confirmations and payment updates"
                  icon={BellRing}
                  enabled={notifications.paymentNotifications}
                  onChange={() => handleNotificationToggle('paymentNotifications')}
                />
                
                <NotificationItem
                  title="Marketing Emails"
                  description="Newsletter, promotions, and special offers"
                  icon={BellOff}
                  enabled={notifications.marketingEmails}
                  onChange={() => handleNotificationToggle('marketingEmails')}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleNotificationsSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}