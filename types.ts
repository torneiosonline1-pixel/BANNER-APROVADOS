export enum BannerStyle {
  JDES_ACADEMY = "JDES Academy (Padrão)",
  CHAMPIONS_PRO = "Champions League Pro",
  COPA_ULTRA = "Copa do Mundo Ultra",
  NIKE_ELITE = "Nike Elite",
  ADIDAS_PRO = "Adidas Pro",
  NEON_FUTURO = "Neon Futuro",
  CINEMATIC_STADIUM = "Cinematic Stadium",
  FIRE_ICE = "Fire & Ice Impact",
  ULTRA_GLOW = "Ultra Glow FX"
}

export type ColorStrategy = 'auto' | 'style' | 'manual';
export type BannerStatus = 'APROVADO' | 'CONVOCADO' | 'CUSTOM';

export interface BannerFormData {
  status: BannerStatus;
  customStatusText?: string;
  athleteName: string;
  birthYear: string;
  category: string;
  clubName: string;
  date: string;
  customMessage: string;
  style: BannerStyle;
  colorStrategy: ColorStrategy;
  manualColor: string;
  photoCount: 1 | 2 | 3;
  athletePhotoMain: File | null;
  athletePhotoLeft?: File | null;
  athletePhotoRight?: File | null;
  clubLogo: File | null;
  schoolLogo: File | null;
  clubJersey?: File | null;
}

export interface GenerationResult {
  imageUrl: string | null;
  error?: string;
}