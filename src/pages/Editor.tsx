import React, { useEffect } from 'react'
import { projectService } from '../services/api/projectService';
import { useLoader } from '../components/LoaderContext';
import { useParams } from 'react-router-dom';
import { showSuccessToast } from '../utils/toast';

const Editor = () => {

    const { setLoading } = useLoader();
    const { projectId } = useParams();
    const loadProject = async () => {
        setLoading(true)
        await projectService.getProjectById(Number(projectId));
        showSuccessToast(
            'Project Fetch Successfully',
            'Succesful'
        );
        setLoading(false)
    }
    useEffect(() => {
        loadProject();
    }, [])


    return (
        <div>Editor</div>
    )
}

export default Editor