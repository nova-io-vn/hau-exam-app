import {DynamicColorIOS,Platform} from 'react-native';
const semantic=(light:string,dark:string)=>Platform.OS==='ios'?DynamicColorIOS({light,dark}):light;
export const colors = {
  background: semantic('#F4F7FB','#111827'),
  surface: semantic('#FFFFFF','#12233A'),
  text: semantic('#102A43','#EAF3FF'),
  textSecondary: semantic('#52657A','#AFC2D8'),
  accent: semantic('#134D8B','#60A5FA'),
  accentHover: semantic('#0E3B6B','#93C5FD'),
  accentSoft: semantic('#E8F1FB','#17365C'),
  primaryDark: semantic('#102A43','#EAF3FF'),
  border: semantic('#D6E2F0','#29415E'),
  muted: semantic('#EEF4FA','#182D49'),
  success: semantic('#18864B','#63C98D'),
  warning: semantic('#9A6700','#E4B85A'),
  danger: semantic('#C62828','#F08080'),
  info: semantic('#356B93','#74AED5'),
  infoSoft: semantic('#E8F1F8','#20384A'),
  dangerSoft: semantic('#FDE9E7','#4A2525'),
  successSoft: semantic('#E8F4EB','#1F3C2A'),
  warningSoft: semantic('#FFF3DF','#4A3820'),
  white: '#FFFFFF',
} as const;
export const darkColors = { ...colors, background: '#0B1728', surface: '#12233A', text: '#EAF3FF', textSecondary: '#AFC2D8', border: '#29415E', muted: '#182D49', accentSoft: '#17365C', dangerSoft: '#4A2525', successSoft: '#1F3C2A', warningSoft: '#4A3820', infoSoft: '#20384A' } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 5, md: 8, lg: 12, pill: 999 } as const;
export const typography = { body: 16, label: 14, title: 28, heading: 22, caption: 12 } as const;

export const shadows = {
  card: { shadowColor: '#0E3B6B', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  modal: { shadowColor: '#0E3B6B', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
} as const;

export const theme = { colors, spacing, radius, typography } as const;
