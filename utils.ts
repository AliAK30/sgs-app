import * as Haptics from 'expo-haptics';
import { OS } from '@/app/_layout';


export function nameWithInitials(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return fullName;
  }

  // Trim and split the name into parts
  const nameParts = fullName.trim().split(' ');
  // split by one or more spaces use split(/\s+/) 
  
  // If there are less than 3 parts, return as-is
  if (nameParts.length < 3) {
    return fullName;
  }

  // Process all parts
  const formattedParts = nameParts.map((part, index) => {
    // Abbreviate all except last two names
    if (index < nameParts.length - 2) {
      return `${part.charAt(0).toUpperCase()}.`;
    }
    return part;
  });

  return formattedParts.join(' ');
}

export function formatFirstName(name:string | undefined): string {
  if(name){
    const parts = name.split(" ");
    if(parts.length > 1 )
    {
      return parts[0].charAt(0).toUpperCase()+parts[0].substring(1);
    } else {
      return name.charAt(0).toUpperCase()+name.substring(1);
    }
  } else {
    return "";
  }
  
}

export function formatCode(code:string) {
  const parts = code.split('_');
  if(parts.length>1)
  {
    return parts.map(part=>part.charAt(0)+part.substring(1).toLowerCase()).join(' ');
  } else {
    return code.charAt(0)+code.substring(1).toLowerCase();
  }
  
}

// Format time as MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const triggerHaptic = (type: 'impact-1' | 'impact-2' | 'impact-3'| 'impact-4'| 'impact-5'| 'feedback-success' | 'feedback-error'| 'feedback-warn'| 'select' | 'rythmic-pattern') => {
  if(OS !== 'web')
  {
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
  }
  
};


export const timeAgo = (isoString: string) => {
  const units = [
    { name: 'year', secs: 31536000 },
    { name: 'month', secs: 2592000 },
    { name: 'day', secs: 86400 },
    { name: 'hour', secs: 3600 },
    { name: 'minute', secs: 60 },
    { name: 'second', secs: 1 },
  ];

  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);

  for (const { name, secs } of units) {
    const val = Math.floor(diff / secs);
    if (val >= 1) return `${val} ${name}${val > 1 ? 's' : ''} ago`;
  }

  return 'just now';
}
