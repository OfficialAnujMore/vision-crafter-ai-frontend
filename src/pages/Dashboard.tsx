import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomButton from '../components/CustomComponents/CustomButton';
import ProjectCard from '../components/ProjectsCard';
import { ImageUploadModal } from '../components/ImageUploadModal';
import TokenBalance from '../components/TokenBalance';
import PurchaseModal from '../components/PurchaseModal';
import '../styles/Dashboard.css';
import { authService } from '../services/api/authService';
import { useLoader } from '../components/LoaderContext';
import { useTokens } from '../context/tokenContext';
import type { SaveFileResponse } from '../interface/project';
import { projectService } from '../services/api/projectService';
import { Plus, Search } from 'lucide-react';
import CustomText from '../components/CustomComponents/CustomText';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';
import { showSuccessToast } from '../utils/toast';


const Dashboard = () => {
  const [projects, setProjects] = useState<Array<SaveFileResponse>>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setLoading } = useLoader();
  const { refreshBalance } = useTokens();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      showSuccessToast('Payment successful! Tokens will appear shortly.');
      setSearchParams({}, { replace: true });
      // Poll for balance update — webhook is async and may arrive a few seconds after redirect
      let attempts = 0;
      const poll = () => {
        refreshBalance();
        if (attempts < 5) {
          attempts++;
          setTimeout(poll, 2000 * attempts);
        }
      };
      setTimeout(poll, 1000);
    } else if (payment === 'cancelled') {
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFileNameFromUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname;
      const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
      return decodeURIComponent(fileName);
    } catch {
      return '';
    }
  };

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) => {
      const titleMatch = project.title.toLowerCase().includes(query);
      const fileNameMatch = getFileNameFromUrl(project.project_url).toLowerCase().includes(query);
      return titleMatch || fileNameMatch;
    });
  }, [projects, searchQuery]);

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
  }, [setLoading]);

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

  const handleRename = useCallback(async (projectId: string, newTitle: string) => {
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

      <section className='dashboard-toolbar'>
        <div className='dashboard-search-wrap'>
          <Search size={16} className='dashboard-search-icon' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='dashboard-search-input'
            placeholder='Search by file name...'
            aria-label='Search projects by file name'
          />
        </div>
        <div className='dashboard-toolbar-right'>
          <TokenBalance onClick={() => setIsPurchaseOpen(true)} />
          <CustomButton
            variant={buttonVariants.default}
            icon={<Plus />}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </section>

      <PurchaseModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />

      <section>
        <section className='projects-grid'>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))
          ) : projects.length === 0 ? (
            <div className='dashboard-empty-state'>
              <CustomText
                variant={textVariant.h4}
                text='No projects yet'
              />
              <CustomText
                variant={textVariant.p}
                text='Start creating your first image project. It will appear here once uploaded.'
              />
              <CustomButton
                variant={buttonVariants.default}
                text='Create Your First Image'
                icon={<Plus />}
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          ) : (
            <div className='dashboard-empty-state'>
              <CustomText
                variant={textVariant.h4}
                text='No matching projects'
              />
              <CustomText
                variant={textVariant.p}
                text={`No results found for "${searchQuery.trim()}". Try another file name.`}
              />
            </div>
          )}
        </section>
      </section>
    </div>
  )
}

export default Dashboard
