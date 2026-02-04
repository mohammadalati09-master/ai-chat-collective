import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BuildFile } from '@/hooks/useBuildMode';

interface FileTreeProps {
  files: BuildFile[];
}

interface FileNodeProps {
  file: BuildFile;
  depth: number;
}

function FileNode({ file, depth }: FileNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = file.type === 'folder';
  
  return (
    <div>
      <button
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-1.5 py-1 px-2 text-sm hover:bg-muted/50 rounded transition-colors",
          file.isModified && "text-primary"
        )}
        style={{ paddingLeft: depth * 12 + 8 }}
      >
        {isFolder ? (
          <>
            <ChevronRight 
              className={cn(
                "h-3 w-3 transition-transform text-muted-foreground",
                isOpen && "rotate-90"
              )} 
            />
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-3" />
            <File className={cn(
              "h-4 w-4",
              file.isModified ? "text-primary" : "text-muted-foreground"
            )} />
          </>
        )}
        <span className="truncate">{file.name}</span>
        {file.isModified && (
          <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>
      
      <AnimatePresence>
        {isFolder && isOpen && file.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {file.children.map((child) => (
              <FileNode key={child.path} file={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileTree({ files }: FileTreeProps) {
  return (
    <div className="py-2">
      <div className="px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Filer
      </div>
      {files.map((file) => (
        <FileNode key={file.path} file={file} depth={0} />
      ))}
    </div>
  );
}
