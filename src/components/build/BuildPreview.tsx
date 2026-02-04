import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeviceSelector } from './DeviceSelector';
import { DeviceType } from '@/hooks/useBuildMode';
import { cn } from '@/lib/utils';

interface BuildPreviewProps {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  previewUrl: string;
  isBuilding: boolean;
}

const deviceDimensions: Record<DeviceType, { width: number; height: number }> = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

export function BuildPreview({ device, onDeviceChange, previewUrl, isBuilding }: BuildPreviewProps) {
  const dimensions = deviceDimensions[device];
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 glass-card rounded-none">
        <DeviceSelector device={device} onDeviceChange={onDeviceChange} />
        
        {/* URL Bar */}
        <div className="flex-1 mx-4 max-w-md">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              {previewUrl || 'Din app kommer visas här...'}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-6 bg-muted/20 overflow-auto">
        <motion.div
          layout
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            "relative bg-background rounded-lg shadow-2xl overflow-hidden",
            device === 'mobile' && "rounded-[2rem] border-[8px] border-foreground/10",
            device === 'tablet' && "rounded-2xl border-[6px] border-foreground/10",
            device === 'desktop' && "rounded-lg border border-border"
          )}
          style={{
            width: device === 'desktop' ? '100%' : dimensions.width,
            height: device === 'desktop' ? '100%' : dimensions.height,
            maxWidth: dimensions.width,
            maxHeight: dimensions.height,
          }}
        >
          {/* Device notch for mobile */}
          {device === 'mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-foreground/10 rounded-b-xl z-10" />
          )}
          
          {/* Content */}
          {isBuilding ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Bygger...</p>
              </div>
            </div>
          ) : previewUrl ? (
            <iframe
              src="about:blank"
              className="w-full h-full border-0"
              title="App Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ingen förhandsvisning</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Beskriv appen du vill bygga för att se den här
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
