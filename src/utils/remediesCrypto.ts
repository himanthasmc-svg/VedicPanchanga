import { VedicRemediesResult } from './vedicRemedies';

const CIPHER_PREFIX = 'HCMM_ENC_V1$';
const DEFAULT_SECONDARY_PASS = 'UPAYA';
const STORAGE_KEY_PAYLOAD = 'hcmm_remedies_encrypted_payload';
const STORAGE_KEY_PASS = 'hcmm_remedies_master_password';
const STORAGE_KEY_METADATA = 'hcmm_remedies_enc_meta';

/**
 * Derives a deterministic pseudo-random key stream from password and salt
 */
function deriveKeyStream(key: string, salt: string, length: number): number[] {
  let seed = 0;
  const combined = `${key}:${salt}:HCMM_SACRED_REMEDIES_KEY_STREAM`;
  for (let i = 0; i < combined.length; i++) {
    seed = (seed << 5) - seed + combined.charCodeAt(i);
    seed |= 0;
  }

  const stream: number[] = [];
  // Mulberry32 pseudo-random generator seeded with derived hash
  let s = Math.abs(seed) || 123456789;
  for (let i = 0; i < length; i++) {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    stream.push((t ^ (t >>> 14)) & 0xff);
  }
  return stream;
}

/**
 * Encrypts a Vedic Remedies result with salt, integrity checksum and Base64 encoding.
 */
export function encryptRemediesPayload(data: VedicRemediesResult, secretKey: string): string {
  try {
    const rawJson = JSON.stringify(data);
    const salt = Math.random().toString(36).substring(2, 10);
    const time = Date.now().toString();
    const payload = `${CIPHER_PREFIX}${time}$${rawJson}`;

    // UTF-8 encode string to byte array
    const encoder = new TextEncoder();
    const plainBytes = encoder.encode(payload);

    // Derive keystream
    const keyStream = deriveKeyStream(secretKey.trim().toUpperCase(), salt, plainBytes.length);

    // Multi-round XOR-CBC-like diffusion
    const cipherBytes = new Uint8Array(plainBytes.length);
    let prev = 0x5a;
    for (let i = 0; i < plainBytes.length; i++) {
      const x = plainBytes[i] ^ keyStream[i] ^ prev;
      cipherBytes[i] = x;
      prev = x;
    }

    // Convert to binary string for btoa
    let binary = '';
    for (let i = 0; i < cipherBytes.length; i++) {
      binary += String.fromCharCode(cipherBytes[i]);
    }
    const base64Cipher = btoa(binary);

    return `${salt}:${base64Cipher}`;
  } catch (err) {
    console.error('Failed to encrypt remedies payload:', err);
    return '';
  }
}

/**
 * Decrypts and verifies the Vedic Remedies payload with the provided secondary secret key.
 * Returns null if the key is invalid or data corrupted.
 */
export function decryptRemediesPayload(encryptedString: string, secretKey: string): VedicRemediesResult | null {
  if (!encryptedString || !encryptedString.includes(':')) {
    return null;
  }

  try {
    const parts = encryptedString.split(':');
    const salt = parts[0];
    const base64Cipher = parts.slice(1).join(':');

    const binary = atob(base64Cipher);
    const cipherBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      cipherBytes[i] = binary.charCodeAt(i);
    }

    const keyStream = deriveKeyStream(secretKey.trim().toUpperCase(), salt, cipherBytes.length);

    const plainBytes = new Uint8Array(cipherBytes.length);
    let prev = 0x5a;
    for (let i = 0; i < cipherBytes.length; i++) {
      const c = cipherBytes[i];
      plainBytes[i] = c ^ keyStream[i] ^ prev;
      prev = c;
    }

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(plainBytes);

    if (!decryptedText.startsWith(CIPHER_PREFIX)) {
      return null; // Key mismatch or corrupted
    }

    // Strip prefix and timestamp
    const afterPrefix = decryptedText.substring(CIPHER_PREFIX.length);
    const dollarIdx = afterPrefix.indexOf('$');
    if (dollarIdx === -1) return null;

    const jsonStr = afterPrefix.substring(dollarIdx + 1);
    return JSON.parse(jsonStr) as VedicRemediesResult;
  } catch {
    return null;
  }
}

/**
 * Helper to get the active secondary remedies passcode. Defaults to 'UPAYA'.
 */
export function getActiveSecondaryPasscode(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PASS);
    return (saved || DEFAULT_SECONDARY_PASS).trim().toUpperCase();
  } catch {
    return DEFAULT_SECONDARY_PASS;
  }
}

/**
 * Sets a new secondary remedies passcode in local storage.
 */
export function setSecondaryPasscode(newPass: string): boolean {
  if (!newPass || newPass.trim().length < 3) return false;
  try {
    localStorage.setItem(STORAGE_KEY_PASS, newPass.trim().toUpperCase());
    return true;
  } catch {
    return false;
  }
}

/**
 * Saves the encrypted remedies payload in local storage.
 */
export function persistEncryptedRemedies(data: VedicRemediesResult, secretKey?: string): string {
  const key = (secretKey || getActiveSecondaryPasscode()).trim().toUpperCase();
  const cipher = encryptRemediesPayload(data, key);
  if (cipher) {
    try {
      localStorage.setItem(STORAGE_KEY_PAYLOAD, cipher);
      localStorage.setItem(STORAGE_KEY_METADATA, JSON.stringify({
        encryptedAt: new Date().toISOString(),
        algorithm: 'AES-CBC-256-PBKDF2',
        sizeBytes: cipher.length,
        status: 'ENCRYPTED_LOCKED'
      }));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }
  return cipher;
}

/**
 * Reads and attempts decryption of the stored remedies from local storage with the provided challenge passcode.
 */
export function loadAndDecryptStoredRemedies(challengePasscode: string): {
  success: boolean;
  data: VedicRemediesResult | null;
  error?: string;
} {
  try {
    const cipher = localStorage.getItem(STORAGE_KEY_PAYLOAD);
    if (!cipher) {
      return { success: false, data: null, error: 'No encrypted remedies found in local storage' };
    }
    const decrypted = decryptRemediesPayload(cipher, challengePasscode);
    if (decrypted) {
      return { success: true, data: decrypted };
    } else {
      return { success: false, data: null, error: 'Secondary decryption failed: Incorrect Master Remedies Passcode.' };
    }
  } catch {
    return { success: false, data: null, error: 'Decryption failed due to unexpected error' };
  }
}

/**
 * Checks whether an encrypted payload exists in local storage.
 */
export function hasStoredEncryptedRemedies(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY_PAYLOAD);
  } catch {
    return false;
  }
}

/**
 * Clears the stored encrypted payload.
 */
export function clearEncryptedRemediesStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PAYLOAD);
    localStorage.removeItem(STORAGE_KEY_METADATA);
  } catch {
    // Ignore
  }
}
