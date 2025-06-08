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

export function formatTwoWordsName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return fullName;
  }

  // Trim and split the name into parts
  const nameParts = fullName.trim().split(' ');
  // split by one or more spaces use split(/\s+/) 
  
  // If there are less than 2 parts, return as-is
  if (nameParts.length < 2) {
    return fullName;
  }

  // Process all parts
  const formattedParts = nameParts.map((part, index) => {
    // Abbreviate all except last two names
    if (index < nameParts.length - 1) {
      return `${part.charAt(0).toUpperCase()}.`;
    }
    return part;
  });

  return formattedParts.join(' ');
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