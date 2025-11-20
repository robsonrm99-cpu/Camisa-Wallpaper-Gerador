export interface WallpaperParams {
  genero: 'masculino' | 'feminino';
  nome: string;
  numero: string;
  clube: string;
  logoBase64?: string;
  logoMimeType?: string;
  aspectRatio: '9:16' | '16:9';
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  imageData: string | null; // Base64 string
}

export interface HistoryItem {
  id: string;
  imageData: string;
  timestamp: number;
  params: WallpaperParams;
  type: 'generated' | 'edited';
}