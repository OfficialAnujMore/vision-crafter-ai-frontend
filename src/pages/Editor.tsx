import { useEffect, useState } from 'react'
import { projectService } from '../services/api/projectService';
import { useLoader } from '../components/LoaderContext';
import { useParams } from 'react-router-dom';
import CanvasEditor from '../components/Canvas/CanvasEditor';
import TopBar from '../components/Canvas/TopBar';
import '../styles/Editor.css'
import type { SaveFileResponse } from '../interface/project';
import Toolbar from '../components/Canvas/Toolbar';
import FeatureBar from '../components/Canvas/FeatureBar';
import type { Canvas } from 'fabric';
import { CanvasContext } from '../context/canvasContext';


export type ToolType = 'adjust' | 'crop' | 'resize' | 'text' | "background" | "extend" | "editing";

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
            const data = await projectService.getProjectById(Number(projectId));
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
                        <TopBar title={projectData?.title} />
                        <section className='editor-panel'>
                            <Toolbar />
                            <FeatureBar />
                            <CanvasEditor project={projectData} />
                        </section>
                    </div>
                </CanvasContext.Provider>
            ) : (<div className='loading-placeholder'>Loading project...</div>)
            }
        </div>


    )
}

export default Editor