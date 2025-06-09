import * as Haptics from 'expo-haptics';

export const triggerHaptic = (type: 'impact-1' | 'impact-2' | 'impact-3'| 'impact-4'| 'impact-5'| 'feedback-success' | 'feedback-error'| 'feedback-warn'| 'select' | 'rythmic-pattern') => {
  switch (type) {
    case 'impact-1':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      break;
    case 'impact-2':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'impact-3':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'impact-4':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'impact-5':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      break;        
    case 'feedback-success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
      case 'feedback-error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
      case 'feedback-warn':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'select':
      Haptics.selectionAsync();
      break;
    default:
      console.warn('Unknown haptic type:', type);
  }
};