import { useCallback, useEffect, useState } from 'react';
import CustomButton from '../components/CustomComponents/CustomButton';
import ProjectCard from '../components/ProjectsCard';
import { ImageUploadModal } from '../components/ImageUploadModal';
import '../styles/Dashboard.css';
import { authService } from '../services/api/authService';
import { useLoader } from '../components/LoaderContext';
import type { SaveFileResponse } from '../interface/project';
import { projectService } from '../services/api/projectService';
import { Plus } from 'lucide-react';
import CustomText from '../components/CustomComponents/CustomText';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';


const Dashboard = () => {
  const [projects, setProjects] = useState<Array<SaveFileResponse>>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { setLoading } = useLoader();

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();

      if (!user || !user.id) {
        console.error('No user found');
        return;
      }

      const response = await projectService.getUserProjects(user.id);
      setProjects(response || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = useCallback(async (fileId: string) => {
    try {
      await projectService.deleteProjectByFileId(fileId);
      setProjects((prev) => prev.filter((p) => p.file_id !== fileId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }, []);

  const handleRename = useCallback(async (projectId: number, newTitle: string) => {
    try {
      const updatedProject = await projectService.updateProject(projectId, { title: newTitle });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );
    } catch (error) {
      console.error('Failed to rename project:', error);
      throw error;
    }
  }, []);

  return (
    <div className='dashboard-container'>
      <ImageUploadModal isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={loadProjects}
      />
      <section className='create'>
        <CustomButton
          variant={buttonVariants.default}
          text='Create'
          icon={<Plus />}
          onClick={() => setIsModalOpen(true)} />
      </section>
      <section>
        <section className='projects-grid'>
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))
          ) : (
            <CustomText
              variant={textVariant.p}
              text={"No projects yet. Create your first project!"}
            />
          )}
        </section>
      </section>
    </div>
  )
}

export default Dashboard
