import { useEffect, useState } from 'react'
import { projectService } from '../services/api/projectService';
import { useLoader } from '../components/LoaderContext';
import { useParams } from 'react-router-dom';
import CanvasEditor from '../components/Canvas/CanvasEditor';
import TopBar from '../components/Canvas/TopBar';
import '../styles/Editor.css'
import { PanelContext } from '../context/panelContext';
import type { SaveFileResponse } from '../interface/project';
import Toolbar from '../components/Canvas/Toolbar';
import FeatureBar from '../components/Canvas/FeatureBar';


export type ToolType = 'adjust' | 'crop' | 'resize' | 'text' | "background" | "extend" | "editing";

const Editor: React.FC = () => {

    const { setLoading } = useLoader();
    const { projectId } = useParams();


    const [activeTool, setActiveTool] = useState<ToolType>('adjust')
    const [projectData, setProjectData] = useState<SaveFileResponse | null>(null);

    const loadProject = async () => {
        setLoading(true)
        const data = await projectService.getProjectById(Number(projectId));
        setProjectData(data)
        setLoading(false)
    }
    useEffect(() => {
        loadProject();
    }, [projectId])



    return (
        <div>
            {projectData ? (
                <PanelContext.Provider value={{ activeTool, setActiveTool }}>
                    <div className='editor-container'>
                        <TopBar title={projectData?.title} />
                        <section className='editor-panel'>
                            <Toolbar/>
                            <FeatureBar />
                            <CanvasEditor projectUrl={projectData?.project_url} width={projectData?.width} height={projectData?.height} />
                        </section>
                    </div>

                </PanelContext.Provider>
            ) : (<div className='loading-placeholder'>Loading project...</div>)
            }
        </div>


    )
}

export default Editor