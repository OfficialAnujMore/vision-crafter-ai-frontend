import { useEffect, useState } from 'react'
import { projectService } from '../services/api/projectService';
import { useLoader } from '../components/LoaderContext';
import { useParams } from 'react-router-dom';
import CanvasEditor from '../components/Canvas/CanvasEditor';
import TopBar from '../components/Canvas/TopBar';
import BottomToolbar from '../components/Canvas/BottomToolbar';
import FeatureBar from '../components/Canvas/FeatureBar';
import '../styles/Canvas/Editor.css'
import type { SaveFileResponse } from '../interface/project';
import type { Canvas } from 'fabric';
import { CanvasContext } from '../context/canvasContext';

export type ToolType = 'adjust' | 'crop' | 'resize' | 'text' | 'bg-remove' | 'bg-color' | 'bg-image' | 'extend' | 'editing' | 'filters' | 'liquify' | 'draw' | 'layers' | 'tools';

const Editor: React.FC = () => {
    const { setLoading } = useLoader();
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState<SaveFileResponse | null>(null);
    const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
    const [activeTool, setActiveTool] = useState<ToolType>('adjust');

    useEffect(() => {
        const loadProject = async () => {
            if (!projectId) return;
            setLoading(true)
            const data = await projectService.getProjectById(projectId);
            setProjectData(data)
            setLoading(false)
        }
        loadProject();
    }, [projectId, setLoading])

    return (
        <div>
            {projectData ? (
                <CanvasContext.Provider
                    value={{
                        fabricCanvas,
                        setFabricCanvas,
                        activeTool,
                        setActiveTool,
                    }}>
                    <div className='editor-container'>
                        <CanvasEditor project={projectData} />
                        <TopBar title={projectData?.title} />
                        <FeatureBar project={projectData} />
                        <BottomToolbar />
                    </div>
                </CanvasContext.Provider>
            ) : (
                <div className='loading-placeholder'>Loading project...</div>
            )}
        </div>
    )
}

export default Editor
