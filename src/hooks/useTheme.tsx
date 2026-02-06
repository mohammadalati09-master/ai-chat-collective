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
    description: 'Varm och bekväm för ögonen',
    colors: {
      primary: 'hsl(250 45% 55%)',
      accent: 'hsl(340 50% 60%)',
      background: 'hsl(40 20% 98%)',
    },
  },
  {
    id: 'dark',
    name: 'Mörkt',
    description: 'Mjukt nattläge med lägre kontrast',
    colors: {
      primary: 'hsl(250 55% 65%)',
      accent: 'hsl(340 55% 58%)',
      background: 'hsl(220 20% 12%)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Lugna, dämpade havstoner',
    colors: {
      primary: 'hsl(185 50% 50%)',
      accent: 'hsl(195 60% 55%)',
      background: 'hsl(200 25% 14%)',
    },
  },
  {
    id: 'sunset',
    name: 'Solnedgång',
    description: 'Varma bärnstens- och terrakottatoner',
    colors: {
      primary: 'hsl(30 65% 50%)',
      accent: 'hsl(15 55% 55%)',
      background: 'hsl(25 20% 12%)',
    },
  },
  {
    id: 'forest',
    name: 'Skog',
    description: 'Jordiga mossgröna toner',
    colors: {
      primary: 'hsl(140 40% 45%)',
      accent: 'hsl(90 35% 50%)',
      background: 'hsl(120 15% 12%)',
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
