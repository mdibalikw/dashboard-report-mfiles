import dotenv from 'dotenv';
dotenv.config();

// In-memory vault configuration store
let activeSettings = {
  url: process.env.MFWS_URL || '',
  username: process.env.MFWS_USERNAME || '',
  password: process.env.MFWS_PASSWORD || '',
  vaultGuid: process.env.MFWS_VAULT_GUID || '',
  mockMode: false // Custom switch for offline/demo dashboard testing
};

/**
 * Returns the currently active vault settings.
 */
export function getSettings() {
  return { ...activeSettings };
}

/**
 * Persists new vault settings in memory.
 * If password is left obscured ('********'), we preserve the existing password.
 */
export function saveSettings(newSettings) {
  const url = newSettings.url !== undefined ? newSettings.url.trim() : activeSettings.url;
  const username = newSettings.username !== undefined ? newSettings.username.trim() : activeSettings.username;
  const vaultGuid = newSettings.vaultGuid !== undefined ? newSettings.vaultGuid.trim() : activeSettings.vaultGuid;
  const mockMode = newSettings.mockMode !== undefined ? !!newSettings.mockMode : activeSettings.mockMode;
  
  let password = activeSettings.password;
  if (newSettings.password !== undefined && newSettings.password !== '********') {
    password = newSettings.password;
  }

  activeSettings = {
    url,
    username,
    password,
    vaultGuid,
    mockMode
  };

  return getObscuredSettings();
}

/**
 * Returns active settings with the password obscured for UI safety.
 */
export function getObscuredSettings() {
  return {
    url: activeSettings.url,
    username: activeSettings.username,
    password: activeSettings.password ? '********' : '',
    vaultGuid: activeSettings.vaultGuid,
    mockMode: activeSettings.mockMode
  };
}
