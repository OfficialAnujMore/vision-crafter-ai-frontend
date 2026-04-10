import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { authService } from '../../../../src/services/api/authService';
import axiosInstance from '../../../../src/services/api/index';

vi.mock('../../../../src/utils/toast', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

/*
  ============================================================
  TC-AUTH-001 to TC-AUTH-006: Authentication Flow Tests
  ============================================================

  Test ID:         TC-AUTH-001
  Service:         authService
  Description:     Google OAuth token is properly sent and user data is stored
  Preconditions:   authService is initialized, localStorage is empty
  Input Data:      googleToken: 'valid-google-token'
  Expected Output: User stored in localStorage, success toast shown
  Pass Criteria:   localStorage contains user data, no error thrown

  Test ID:         TC-AUTH-002
  Service:         authService
  Description:     Invalid Google token throws error
  Preconditions:   authService is initialized
  Input Data:      googleToken: '' (empty)
  Expected Output: Error thrown, user not stored
  Pass Criteria:   Error is caught, localStorage empty

  Test ID:         TC-AUTH-003
  Service:         authService
  Description:     Logout clears user from localStorage
  Preconditions:   User is authenticated
  Input Data:      N/A
  Expected Output: localStorage cleared, success toast shown
  Pass Criteria:   localStorage.getItem('user') returns null

  Test ID:         TC-AUTH-004
  Service:         authService
  Description:     getCurrentUser returns parsed user object
  Preconditions:   Valid user data in localStorage
  Input Data:      localStorage user: {id: 1, email: 'test@example.com'}
  Expected Output: User object returned
  Pass Criteria:   Returned object matches stored data

  Test ID:         TC-AUTH-005
  Service:         authService
  Description:     isAuthenticated returns true when user exists
  Preconditions:   User is in localStorage
  Input Data:      N/A
  Expected Output: true returned
  Pass Criteria:   Assertion returns true

  Test ID:         TC-AUTH-006
  Service:         authService
  Description:     isAuthenticated returns false when user doesn't exist
  Preconditions:   localStorage is empty
  Input Data:      N/A
  Expected Output: false returned
  Pass Criteria:   Assertion returns false
*/

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('TC-AUTH-001: Google OAuth token handling', () => {
    it('should store user data in localStorage on successful auth', async () => {
      const googleToken = 'valid-google-token';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      // Mock the axios post response
      vi.spyOn(axiosInstance, 'post').mockResolvedValue({
        data: {
          data: {
            user: mockUser,
            token: 'auth-token',
          },
          message: 'Login successful',
        },
      });

      const result = await authService.googleAuth(googleToken);

      expect(result.user).toEqual(mockUser);
      expect(localStorage.getItem('user')).toBeTruthy();
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(storedUser).toEqual(mockUser);
    });

    it('TC-AUTH-002: should throw error if no user data received', async () => {
      const googleToken = 'invalid-token';

      vi.spyOn(axiosInstance, 'post').mockResolvedValue({
        data: {
          data: null,
          message: 'Auth failed',
        },
      });

      await expect(authService.googleAuth(googleToken)).rejects.toThrow();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('TC-AUTH-003: Logout functionality', () => {
    it('should clear user from localStorage on logout', async () => {
      // Set up initial user
      const mockUser = { id: 1, email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      vi.spyOn(axiosInstance, 'post').mockResolvedValue({ data: {} });

      await authService.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('TC-AUTH-003: should still clear localStorage even if API fails', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      vi.spyOn(axiosInstance, 'post').mockRejectedValue(new Error('API Error'));

      await authService.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('TC-AUTH-004: Get current user', () => {
    it('should return user object from localStorage', () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const result = authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(result?.id).toBe(1);
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null if no user in localStorage', () => {
      const result = authService.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return null if stored data is invalid JSON', () => {
      localStorage.setItem('user', 'invalid-json{');

      const result = authService.getCurrentUser();

      expect(result).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('TC-AUTH-005: isAuthenticated when user exists', () => {
    it('should return true when user is in localStorage', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });
  });

  describe('TC-AUTH-006: isAuthenticated when user absent', () => {
    it('should return false when localStorage is empty', () => {
      localStorage.clear();

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when user key is removed', () => {
      localStorage.setItem('user', '{}');
      localStorage.removeItem('user');

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
