import { useEffect, useState } from 'react';
import CustomButton from '../components/CustomButton';
import ProjectCard from '../components/ProjectsCard';
import { ImageUploadModal } from '../components/ImageUploadModal';
import '../styles/Dashboard/Dashboard.css';
import { getUserProjects } from '../services/api/projectService';
import { authService } from '../services/api/authService';
import type { SaveImageResponse } from '../services/api/imageKitService';
import { useLoader } from '../components/LoaderContext';


const Dashboard = () => {
  const [projects, setProjects] = useState<Array<SaveImageResponse>>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { setLoading } = useLoader();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { id } = await authService.getCurrentUser();
        const response = await getUserProjects(id);
        setProjects(response);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [setLoading]);
  return (
    <div className='dashboard-container'>
      <ImageUploadModal isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <section className='create'>
        <CustomButton variant='primary' text='Create' onClick={() => setIsModalOpen(true)} />
      </section>
      <section>
        <section className='projects-grid'>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              thumbnailUrl={project.thumbnail_url}
              title={project.title}
              projectUrl={project.project_url}
            />
          ))}
        </section>
      </section>

    </div>
  )
}

export default Dashboard