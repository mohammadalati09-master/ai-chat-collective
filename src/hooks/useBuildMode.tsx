import { useState, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface BuildFile {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: BuildFile[];
  isModified?: boolean;
}

export interface BuildState {
  isBuilding: boolean;
  progress: number;
  currentStep: string;
  files: BuildFile[];
  previewUrl: string;
}

const initialFiles: BuildFile[] = [
  {
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      { name: 'App.tsx', path: 'src/App.tsx', type: 'file' },
      { name: 'main.tsx', path: 'src/main.tsx', type: 'file' },
      { name: 'index.css', path: 'src/index.css', type: 'file' },
      {
        name: 'components',
        path: 'src/components',
        type: 'folder',
        children: [],
      },
    ],
  },
  { name: 'package.json', path: 'package.json', type: 'file' },
  { name: 'index.html', path: 'index.html', type: 'file' },
];

const buildSteps = [
  'Skapar projektstruktur...',
  'Installerar beroenden...',
  'Genererar komponenter...',
  'Kompilerar TypeScript...',
  'Bygger applikation...',
  'Startar förhandsvisning...',
];

export function useBuildMode() {
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [buildState, setBuildState] = useState<BuildState>({
    isBuilding: false,
    progress: 0,
    currentStep: '',
    files: initialFiles,
    previewUrl: '',
  });

  const toggleBuildMode = useCallback(() => {
    setIsBuildMode(prev => !prev);
  }, []);

  const simulateBuild = useCallback((description: string) => {
    setBuildState(prev => ({
      ...prev,
      isBuilding: true,
      progress: 0,
      currentStep: buildSteps[0],
    }));

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      const progress = Math.min((stepIndex / buildSteps.length) * 100, 100);
      
      if (stepIndex >= buildSteps.length) {
        clearInterval(interval);
        setBuildState(prev => ({
          ...prev,
          isBuilding: false,
          progress: 100,
          currentStep: 'Klar!',
          previewUrl: 'https://example.lovable.app',
          files: [
            {
              name: 'src',
              path: 'src',
              type: 'folder',
              children: [
                { name: 'App.tsx', path: 'src/App.tsx', type: 'file', isModified: true },
                { name: 'main.tsx', path: 'src/main.tsx', type: 'file' },
                { name: 'index.css', path: 'src/index.css', type: 'file', isModified: true },
                {
                  name: 'components',
                  path: 'src/components',
                  type: 'folder',
                  children: [
                    { name: 'Header.tsx', path: 'src/components/Header.tsx', type: 'file', isModified: true },
                    { name: 'MainContent.tsx', path: 'src/components/MainContent.tsx', type: 'file', isModified: true },
                  ],
                },
              ],
            },
            { name: 'package.json', path: 'package.json', type: 'file', isModified: true },
            { name: 'index.html', path: 'index.html', type: 'file' },
          ],
        }));
        return;
      }
      
      setBuildState(prev => ({
        ...prev,
        progress,
        currentStep: buildSteps[stepIndex] || 'Slutför...',
      }));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const resetBuild = useCallback(() => {
    setBuildState({
      isBuilding: false,
      progress: 0,
      currentStep: '',
      files: initialFiles,
      previewUrl: '',
    });
  }, []);

  return {
    isBuildMode,
    setIsBuildMode,
    toggleBuildMode,
    device,
    setDevice,
    buildState,
    simulateBuild,
    resetBuild,
  };
}
