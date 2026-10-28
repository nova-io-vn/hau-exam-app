import {DynamicColorIOS,Platform} from 'react-native';
const semantic=(light:string,dark:string)=>Platform.OS==='ios'?DynamicColorIOS({light,dark}):light;
export const colors = {
  background: semantic('#F4F7FA','#12161E'),
  surface: semantic('#FFFFFF','#1B2230'),
  text: semantic('#172033','#F5F7FB'),
  textSecondary: semantic('#667085','#C4CCDA'),
  accent: semantic('#134D8B','#79B2EA'),
  accentHover: semantic('#0F4177','#9BC9F4'),
  accentActive: semantic('#0B3768','#B7DCFA'),
  accentSoft: semantic('#EDF5FC','#1D3552'),
  primaryDark: semantic('#172033','#F5F7FB'),
  border: semantic('#D9E2EC','#354052'),
  borderLight: semantic('#E8EEF4','#354052'),
  muted: semantic('#F0F3F7','#252F40'),
  success: semantic('#16835D','#83CAA0'),
  warning: semantic('#D97706','#E5B763'),
  danger: semantic('#D92D20','#F0938C'),
  info: semantic('#134D8B','#9FC2E5'),
  infoSoft: semantic('#EDF5FC','#21364C'),
  dangerSoft: semantic('#FFF0EF','#422B30'),
  successSoft: semantic('#EAF8F2','#203C2D'),
  warningSoft: semantic('#FFF5E6','#40351F'),
  white: '#FFFFFF',
} as const;
export const darkColors = { ...colors, background: '#12161E', surface: '#1B2230', text: '#F5F7FB', textSecondary: '#C4CCDA', accent: '#79B2EA', accentHover: '#9BC9F4', accentActive: '#B7DCFA', border: '#354052', borderLight: '#354052', muted: '#252F40', accentSoft: '#1D3552', danger: '#F0938C', dangerSoft: '#422B30', success: '#83CAA0', successSoft: '#203C2D', warning: '#E5B763', warningSoft: '#40351F', info: '#9FC2E5', infoSoft: '#21364C' } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 10, lg: 14, pill: 999 } as const;
export const typography = { body: 16, label: 14, title: 28, heading: 22, caption: 12 } as const;

export const shadows = {
  card: { shadowColor: '#0F4177', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  modal: { shadowColor: '#0F4177', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
} as const;

export const theme = { colors, spacing, radius, typography } as const;
