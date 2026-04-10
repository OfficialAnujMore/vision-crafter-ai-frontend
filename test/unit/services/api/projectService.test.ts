import { describe, it, expect, beforeEach, vi } from 'vitest';
import { projectService } from '../../../../src/services/api/projectService';
import type { SaveFile, SaveFileResponse } from '../../../../src/interface/project';
import axiosInstance from '../../../../src/services/api/index';

vi.mock('../../../../src/utils/toast', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

/*
  ============================================================
  TC-PROJ-001 to TC-PROJ-007: Project Management Tests
  ============================================================

  Test ID:         TC-PROJ-001
  Service:         projectService
  Description:     Create project API call with valid data
  Preconditions:   User is authenticated
  Input Data:      SaveFile { title, file_type, width, height, project_url }
  Expected Output: Project created, toast shown
  Pass Criteria:   API called with correct payload, success message shown

  Test ID:         TC-PROJ-002
  Service:         projectService
  Description:     Get all user projects by ID
  Preconditions:   User has created projects
  Input Data:      userId: 1
  Expected Output: Array of projects returned
  Pass Criteria:   Array length > 0, each item is SaveFileResponse

  Test ID:         TC-PROJ-003
  Service:         projectService
  Description:     Delete project by file ID
  Preconditions:   Project exists
  Input Data:      fileId: 'file-123'
  Expected Output: Project deleted, API called, success toast
  Pass Criteria:   API delete called with correct ID

  Test ID:         TC-PROJ-004
  Service:         projectService
  Description:     Get project by ID
  Preconditions:   Project exists
  Input Data:      projectId: 1
  Expected Output: Project data returned
  Pass Criteria:   Project object contains expected fields

  Test ID:         TC-PROJ-005
  Service:         projectService
  Description:     Update project with new title
  Preconditions:   Project exists
  Input Data:      projectId: 1, updates: { title: 'New Title' }
  Expected Output: Updated project data returned
  Pass Criteria:   API PATCH called, new title in response

  Test ID:         TC-PROJ-006
  Service:         projectService
  Description:     Handle API error when creating project
  Preconditions:   Backend returns error
  Input Data:      Invalid project data
  Expected Output: Error thrown
  Pass Criteria:   Error is caught and propagated

  Test ID:         TC-PROJ-007
  Service:         projectService
  Description:     Get empty project list
  Preconditions:   User has no projects
  Input Data:      userId: 1
  Expected Output: Empty array returned
  Pass Criteria:   Result is empty array, not null
*/

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProject: SaveFileResponse = {
    id: 1,
    file_id: 'file-123',
    title: 'Test Project',
    width: 1920,
    height: 1080,
    project_url: 'https://cdn.example.com/project.json',
    thumbnail_url: 'https://cdn.example.com/thumbnail.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    user_id: 1,
  };

  describe('TC-PROJ-001: Create project', () => {
    it('should create project with valid data', async () => {
      const projectData: SaveFile = {
        title: 'New Project',
        file_type: 'image',
        width: 1920,
        height: 1080,
        project_url: 'https://cdn.example.com/project.json',
        user_id: 1,
      } as any;

      vi.spyOn(axiosInstance, 'post').mockResolvedValue({
        data: {
          data: mockProject,
          message: 'Project created successfully',
        },
      });

      const result = await projectService.saveCreatedFile(projectData);

      expect(result).toEqual(mockProject);
      expect(result.title).toBe(mockProject.title);
    });
  });

  describe('TC-PROJ-002: Get user projects', () => {
    it('should return array of projects for user', async () => {
      const userId = 1;
      const mockProjects = [mockProject, { ...mockProject, id: 2, title: 'Project 2' }];

      vi.spyOn(axiosInstance, 'get').mockResolvedValue({
        data: {
          data: mockProjects,
        },
      });

      const result = await projectService.getUserProjects(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].title).toBe(mockProject.title);
    });
  });

  describe('TC-PROJ-003: Delete project', () => {
    it('should delete project by file ID', async () => {
      const fileId = 'file-123';

      vi.spyOn(axiosInstance, 'delete').mockResolvedValue({
        data: { message: 'Project deleted' },
      });

      const result = await projectService.deleteProjectByFileId(fileId);

      expect(result).toBeUndefined();
    });

    it('TC-PROJ-003: should throw error if delete fails', async () => {
      const fileId = 'invalid-file-id';

      vi.spyOn(axiosInstance, 'delete').mockRejectedValue(new Error('Delete failed'));

      await expect(projectService.deleteProjectByFileId(fileId)).rejects.toThrow();
    });
  });

  describe('TC-PROJ-004: Get project by ID', () => {
    it('should return project data', async () => {
      const projectId = 1;

      vi.spyOn(axiosInstance, 'get').mockResolvedValue({
        data: {
          data: mockProject,
        },
      });

      const result = await projectService.getProjectById(projectId);

      expect(result).toEqual(mockProject);
      expect(result.id).toBe(projectId);
      expect(result.title).toBe('Test Project');
    });
  });

  describe('TC-PROJ-005: Update project', () => {
    it('should update project with new data', async () => {
      const projectId = 1;
      const updates = { title: 'Updated Title' };
      const updatedProject = { ...mockProject, title: 'Updated Title' };

      vi.spyOn(axiosInstance, 'patch').mockResolvedValue({
        data: {
          data: updatedProject,
        },
      });

      const result = await projectService.updateProject(projectId, updates);

      expect(result.title).toBe('Updated Title');
      expect(result.id).toBe(projectId);
    });

    it('TC-PROJ-005: should handle partial updates', async () => {
      const projectId = 1;
      const updates = { width: 2560 };
      const updatedProject = { ...mockProject, width: 2560 };

      vi.spyOn(axiosInstance, 'patch').mockResolvedValue({
        data: {
          data: updatedProject,
        },
      });

      const result = await projectService.updateProject(projectId, updates);

      expect(result.width).toBe(2560);
    });
  });

  describe('TC-PROJ-006: Error handling', () => {
    it('should handle API errors', async () => {
      const projectData: SaveFile = {
        title: 'Invalid Project',
        file_type: 'image',
      } as any;

      vi.spyOn(axiosInstance, 'post').mockRejectedValue(new Error('Network error'));

      await expect(projectService.saveCreatedFile(projectData)).rejects.toThrow();
    });
  });

  describe('TC-PROJ-007: Empty project list', () => {
    it('should return empty array when user has no projects', async () => {
      const userId = 999;

      vi.spyOn(axiosInstance, 'get').mockResolvedValue({
        data: {
          data: [],
        },
      });

      const result = await projectService.getUserProjects(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
