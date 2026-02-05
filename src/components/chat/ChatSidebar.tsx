import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { Conversation } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { SettingsSheet } from '@/components/settings/SettingsSheet';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isGuest?: boolean;
  onSignIn?: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isCollapsed,
  onToggleCollapse,
  isGuest = false,
  onSignIn,
}: ChatSidebarProps) {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const userInitials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen flex flex-col glass-card border-r border-border/50"
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-border/50">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg gradient-text"
            >
              AI Chat
            </motion.h1>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full gradient-button gap-2",
            isCollapsed && "px-0"
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>Ny chatt</span>}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök konversationer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-0"
            />
          </div>
        </div>
      )}

      {/* Conversations list */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group"
            >
              {editingId === conversation.id ? (
                <div className="flex items-center gap-1 p-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button size="icon" className="h-8 w-8" onClick={saveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={cancelEdit}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => onSelectConversation(conversation)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                    currentConversation?.id === conversation.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(conversation.updated_at), 'd MMM', {
                          locale: sv,
                        })}
                      </p>
                    </div>
                  )}
                  {!isCollapsed && (
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(conversation);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer with user */}
      <div className="p-3 border-t border-border/50">
        {isGuest ? (
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}>
            <Button
              onClick={onSignIn}
              variant="outline"
              size={isCollapsed ? "icon" : "default"}
              className={cn("gap-2", isCollapsed && "h-10 w-10")}
            >
              <User className="h-4 w-4" />
              {!isCollapsed && <span>Logga in för att spara</span>}
            </Button>
            {!isCollapsed && <ThemeToggle />}
          </div>
        ) : (
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 glass-card">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <SettingsSheet 
                  trigger={
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                      <Settings className="h-4 w-4" />
                      <span>Inställningar</span>
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logga ut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
                <ThemeToggle />
              </>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
