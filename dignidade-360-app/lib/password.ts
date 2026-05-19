export function validatePassword(password: string) {
  const issues: string[] = [];

  if (password.length < 10) issues.push('ao menos 10 caracteres');
  if (!/[A-Z]/.test(password)) issues.push('uma letra maiuscula');
  if (!/[a-z]/.test(password)) issues.push('uma letra minuscula');
  if (!/\d/.test(password)) issues.push('um numero');
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('um caractere especial');

  return {
    valid: issues.length === 0,
    message: issues.length ? `A senha precisa ter ${issues.join(', ')}.` : '',
  };
}
