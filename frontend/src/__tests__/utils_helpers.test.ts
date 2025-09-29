import { 
  formatDuration,
  validateAudioFormat,
  generateMessageId,
  generateConversationId,
  sanitizeText,
  truncateText,
  isValidUrl,
  copyToClipboard,
  formatBytes,
  blobToBase64,
  base64ToBlob,
} from '../utils/helpers';

describe('utils/helpers', () => {
  it('formatDuration works', () => {
    expect(formatDuration(1000)).toBe('1s');
    expect(formatDuration(61_000)).toBe('1:01');
  });

  it('formatBytes works', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('sanitizeText strips scripts', () => {
    const dirty = "<script>alert('x')</script><b>ok</b>";
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain('<script>');
  });

  it('truncateText respects length', () => {
    expect(truncateText('abc', 5)).toBe('abc');
    expect(truncateText('abcdef', 3)).toBe('abc...');
  });

  it('isValidUrl validates', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('notaurl')).toBe(false);
  });

  it('id generators produce strings', () => {
    expect(typeof generateMessageId()).toBe('string');
    expect(typeof generateConversationId()).toBe('string');
  });

  it('validateAudioFormat rejects invalid type', () => {
    const file = new File(['x'], 'x.txt', { type: 'text/plain' });
    const res = validateAudioFormat(file as any);
    expect(res.isValid).toBe(false);
  });

  it('blob/base64 conversions', async () => {
    const blob = new Blob([new Uint8Array([1,2,3])], { type: 'audio/wav' });
    const b64 = await blobToBase64(blob);
    const round = base64ToBlob(b64, 'audio/wav');
    expect(round.type).toBe('audio/wav');
  });

  it('copyToClipboard works with fallback', async () => {
    const ok = await copyToClipboard('hello');
    expect(typeof ok).toBe('boolean');
  });
});
