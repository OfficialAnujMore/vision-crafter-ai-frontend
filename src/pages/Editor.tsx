import { useEffect, useState } from 'react'
import { projectService } from '../services/api/projectService';
import { useLoader } from '../components/LoaderContext';
import { useParams } from 'react-router-dom';
import CanvasEditor from '../components/Canvas/CanvasEditor';
import '../styles/Editor.css'

const Editor: React.FC = () => {

    const { setLoading } = useLoader();
    const { projectId } = useParams();
    const [projectURL, setProjectURL] = useState<string>("");
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const loadProject = async () => {
        setLoading(true)
        const { project_url, width, height } = await projectService.getProjectById(Number(projectId));
        setProjectURL(project_url);
        setWidth(width);
        setHeight(height);
        // showSuccessToast(
        //     'Project Fetch Successfully',
        //     'Succesful'
        // );
        setLoading(false)
    }
    useEffect(() => {
        loadProject();
    }, [])


    return (
        <div className='editor-container'>
            <CanvasEditor projectUrl={projectURL} width={width} height={height} />
        </div>

    )
}

export default Editor