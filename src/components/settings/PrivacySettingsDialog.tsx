
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/shadcn-button";
import { Switch } from "@/components/ui/switch";
import { Settings } from 'lucide-react';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { toast } from '@/hooks/use-toast';

export function PrivacySettingsDialog() {
  const { settings, updateSettings, isLoading } = usePrivacySettings();
  const [localSettings, setLocalSettings] = useState({
    share_location: true,
    share_contact: true,
    share_status: true
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        share_location: settings.share_location ?? true,
        share_contact: settings.share_contact ?? true,
        share_status: settings.share_status ?? true
      });
    }
  }, [settings]);

  const handleToggle = (setting: string) => (checked: boolean) => {
    const newSettings = { ...localSettings, [setting]: checked };
    setLocalSettings(newSettings);
    
    // Save to localStorage immediately for better UX
    localStorage.setItem('privacy_settings', JSON.stringify(newSettings));
    
    updateSettings({ [setting]: checked })
      .then(() => {
        toast({
          description: `${setting.replace('_', ' ')} setting updated successfully`,
        });
      })
      .catch(() => {
        toast({
          title: "Update failed",
          description: "Settings saved locally but couldn't be synchronized",
          variant: "destructive"
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Privacy Settings</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center">Loading privacy settings...</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Share Location</span>
                <span className="text-sm text-muted-foreground">
                  Allow caregivers to see your location
                </span>
              </div>
              <Switch
                checked={localSettings.share_location}
                onCheckedChange={handleToggle('share_location')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Share Contact</span>
                <span className="text-sm text-muted-foreground">
                  Allow caregivers to contact you directly
                </span>
              </div>
              <Switch
                checked={localSettings.share_contact}
                onCheckedChange={handleToggle('share_contact')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">Share Status</span>
                <span className="text-sm text-muted-foreground">
                  Show your online status to caregivers
                </span>
              </div>
              <Switch
                checked={localSettings.share_status}
                onCheckedChange={handleToggle('share_status')}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
