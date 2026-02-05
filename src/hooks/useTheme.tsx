import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest';

export interface ThemeInfo {
  id: Theme;
  name: string;
  description: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
}

export const themes: ThemeInfo[] = [
  {
    id: 'light',
    name: 'Ljust',
    description: 'Ren och ljus design',
    colors: {
      primary: 'hsl(262 83% 58%)',
      accent: 'hsl(340 82% 65%)',
      background: 'hsl(240 20% 97%)',
    },
  },
  {
    id: 'dark',
    name: 'Mörkt',
    description: 'Elegant nattläge',
    colors: {
      primary: 'hsl(262 83% 65%)',
      accent: 'hsl(340 82% 60%)',
      background: 'hsl(240 15% 8%)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Lugna havstoner',
    colors: {
      primary: 'hsl(185 75% 45%)',
      accent: 'hsl(200 90% 55%)',
      background: 'hsl(200 50% 10%)',
    },
  },
  {
    id: 'sunset',
    name: 'Solnedgång',
    description: 'Varma kvällsfärger',
    colors: {
      primary: 'hsl(25 95% 55%)',
      accent: 'hsl(340 85% 60%)',
      background: 'hsl(20 30% 12%)',
    },
  },
  {
    id: 'forest',
    name: 'Skog',
    description: 'Naturliga jordtoner',
    colors: {
      primary: 'hsl(142 70% 40%)',
      accent: 'hsl(95 60% 45%)',
      background: 'hsl(140 20% 10%)',
    },
  },
];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved && themes.some(t => t.id === saved)) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'ocean', 'sunset', 'forest');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
