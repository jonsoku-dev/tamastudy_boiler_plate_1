import { useTheme as emotionUseTheme } from 'emotion-theming';
import theme from '../styles/theme';

export default function useTheme() {
  return emotionUseTheme<typeof theme>();
}
