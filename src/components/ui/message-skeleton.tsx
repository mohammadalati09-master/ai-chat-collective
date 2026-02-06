import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MessageSkeletonProps {
  isUser?: boolean;
}

export function MessageSkeleton({ isUser = false }: MessageSkeletonProps) {
  return (
    <div className={cn("flex gap-3 px-4 py-4", isUser ? "flex-row-reverse" : "")}>
      {/* Avatar skeleton */}
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />

      {/* Message content skeleton */}
      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 space-y-2",
          isUser ? "bg-primary/20 rounded-br-md" : "glass-card rounded-bl-md"
        )}>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatAreaSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header skeleton */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 p-4 space-y-4">
        <MessageSkeleton isUser />
        <MessageSkeleton />
        <MessageSkeleton isUser />
        <MessageSkeleton />
      </div>

      {/* Input skeleton */}
      <div className="p-4">
        <div className="glass-card p-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
