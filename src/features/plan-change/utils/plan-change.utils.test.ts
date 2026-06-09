import { describe, it, expect } from 'vitest';
import {
  formatChangeTypeLabel,
  formatEffectiveDateLabel,
  getChangeTypeBadgeVariant,
} from './plan-change.utils';

describe('plan-change utils', () => {
  describe('formatChangeTypeLabel', () => {
    it('returns "Programado" for scheduled', () => {
      expect(formatChangeTypeLabel('scheduled')).toBe('Programado');
    });

    it('returns "Inmediato" for immediate', () => {
      expect(formatChangeTypeLabel('immediate')).toBe('Inmediato');
    });
  });

  describe('formatEffectiveDateLabel', () => {
    const isoDate = '2026-03-15T10:00:00.000Z';

    it('returns "Efecto: Hoy" for immediate changes', () => {
      const result = formatEffectiveDateLabel('immediate', isoDate);
      expect(result).toBe('Efecto: Hoy');
    });

    it('returns formatted date for scheduled changes', () => {
      const result = formatEffectiveDateLabel('scheduled', isoDate);
      expect(result).toContain('Efecto el');
      expect(result).toContain('2026');
    });
  });

  describe('getChangeTypeBadgeVariant', () => {
    it('returns "warning" for scheduled changes', () => {
      expect(getChangeTypeBadgeVariant('scheduled')).toBe('warning');
    });

    it('returns "success" for immediate changes', () => {
      expect(getChangeTypeBadgeVariant('immediate')).toBe('success');
    });
  });
});
