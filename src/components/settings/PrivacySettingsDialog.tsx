
import React from 'react';
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

export function PrivacySettingsDialog() {
  const { settings, updateSettings } = usePrivacySettings();

  const handleToggle = (setting: string) => (checked: boolean) => {
    updateSettings({ [setting]: checked });
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
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium">Share Location</span>
              <span className="text-sm text-muted-foreground">
                Allow caregivers to see your location
              </span>
            </div>
            <Switch
              checked={settings?.share_location ?? false}
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
              checked={settings?.share_contact ?? false}
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
              checked={settings?.share_status ?? false}
              onCheckedChange={handleToggle('share_status')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
