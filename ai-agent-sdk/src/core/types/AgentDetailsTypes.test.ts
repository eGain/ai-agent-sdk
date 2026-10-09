import { describe, it, expect } from 'vitest';
import {
  buildDefaultAuthScopes,
  getAgentClientAppId,
  getAgentExtraScopes,
  mergeAgentExtraScopes,
} from './AgentDetailsTypes.js';

describe('AgentDetailsTypes', () => {
  describe('buildDefaultAuthScopes', () => {
    it('returns the agent defaults', () => {
      expect(buildDefaultAuthScopes('agent')).toEqual(['knowledge.portalmgr.manage', 'core.aiservices.read']);
      expect(buildDefaultAuthScopes()).toEqual(['knowledge.portalmgr.manage', 'core.aiservices.read']);
    });

    it('adds core.customermgr.read for customers', () => {
      expect(buildDefaultAuthScopes('customer')).toEqual([
        'knowledge.portalmgr.manage',
        'core.aiservices.read',
        'core.customermgr.read',
      ]);
    });
  });

  describe('getAgentExtraScopes', () => {
    it('returns an empty list when unset or malformed', () => {
      expect(getAgentExtraScopes(undefined)).toEqual([]);
      expect(getAgentExtraScopes(null)).toEqual([]);
      expect(getAgentExtraScopes({})).toEqual([]);
      expect(getAgentExtraScopes({ extraScopes: 'not-a-list' as unknown as string[] })).toEqual([]);
    });

    it('trims, drops empties and non-strings, and deduplicates in order', () => {
      expect(getAgentExtraScopes({ extraScopes: [' b ', 'a', '', 'b', 42 as unknown as string, '  '] })).toEqual([
        'b',
        'a',
      ]);
    });
  });

  describe('mergeAgentExtraScopes', () => {
    it('appends extras after the base list without duplicates', () => {
      expect(mergeAgentExtraScopes(['a', 'b'], { extraScopes: ['b', 'c'] })).toEqual(['a', 'b', 'c']);
    });

    it('returns a copy of the base list when there are no extras', () => {
      const base = ['a'];
      const merged = mergeAgentExtraScopes(base, undefined);
      expect(merged).toEqual(['a']);
      expect(merged).not.toBe(base);
    });
  });

  describe('getAgentClientAppId', () => {
    it('returns the trimmed id', () => {
      expect(getAgentClientAppId({ clientAppId: '  app-1 ' })).toBe('app-1');
    });

    it('returns undefined when unset, null, blank or not a string', () => {
      expect(getAgentClientAppId(undefined)).toBeUndefined();
      expect(getAgentClientAppId({ clientAppId: null })).toBeUndefined();
      expect(getAgentClientAppId({ clientAppId: '   ' })).toBeUndefined();
      expect(getAgentClientAppId({ clientAppId: 7 as unknown as string })).toBeUndefined();
    });
  });
});
