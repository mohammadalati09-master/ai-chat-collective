import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DeviceType } from '@/hooks/useBuildMode';

interface DeviceSelectorProps {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

const devices: { type: DeviceType; icon: typeof Monitor; label: string }[] = [
  { type: 'mobile', icon: Smartphone, label: 'Mobil' },
  { type: 'tablet', icon: Tablet, label: 'Surfplatta' },
  { type: 'desktop', icon: Monitor, label: 'Dator' },
];

export function DeviceSelector({ device, onDeviceChange }: DeviceSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      {devices.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          onClick={() => onDeviceChange(type)}
          className={cn(
            "h-8 px-3 gap-2 transition-all",
            device === type 
              ? "bg-background shadow-sm text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
}
