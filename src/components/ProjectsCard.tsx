import React, { useState } from 'react';
import '../styles/ProjectsCards.css';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { projectService } from '../services/api/projectService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { textVariant } from '../constants/textVarients';

interface ProjectCardProps {
    fileId: string;
    projectId: number
    thumbnailUrl: string;
    title: string;
    projectUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    fileId,
    projectId,
    thumbnailUrl,
    title,

}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate()
    const onEdit = async () => {
        navigate(ROUTES.EDITOR.replace(':projectId', `${projectId}`));
    }
    const onDelete = async () => {
        await projectService.deleteProjectByFileId(fileId)
    }

    return (
        <div
            className="project-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={thumbnailUrl}
                alt={title}
                className="project-card__image"
            />

            <div className="project-card__content">
                <CustomText
                    variant={textVariant.h4}
                    text={title} />
            </div>

            {isHovered && (
                <div className="project-card__overlay">
                    <CustomButton
                        onClick={onEdit}
                        variant='primary'
                        text="Edit"
                    />
                    <CustomButton
                        variant='primary'
                        text="Delete"
                        onClick={onDelete}

                    />


                </div>
            )}
        </div>
    );
};

export default ProjectCard;