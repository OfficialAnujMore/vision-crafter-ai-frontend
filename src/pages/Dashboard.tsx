import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const load = async () => {
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
    };

    load();
  }, []);

  return (
    <div className='dashboard-container'>


      <ImageUploadModal isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
                fileId={project.file_id}
                projectId={project.id}
                thumbnailUrl={project.thumbnail_url}
                title={project.title}
                projectUrl={project.project_url}
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