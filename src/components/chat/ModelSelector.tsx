import { ChevronDown, Sparkles, Zap, Brain, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const models = [
  { id: 'GPT-4', name: 'GPT-4', description: 'Mest kapabel', icon: Sparkles },
  { id: 'GPT-4o', name: 'GPT-4o', description: 'Snabbare svar', icon: Zap },
  { id: 'Claude 3', name: 'Claude 3', description: 'Analytisk', icon: Brain },
  { id: 'Gemini Pro', name: 'Gemini Pro', description: 'Multimodal', icon: Eye },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  const Icon = currentModel.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="glass-card h-9 px-3 gap-2 hover:bg-accent/50"
        >
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{currentModel.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="glass-card w-56">
        {models.map((model) => {
          const ModelIcon = model.icon;
          return (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <ModelIcon className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
