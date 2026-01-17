import React, { useState } from 'react';
import '../styles/ProjectsCards.css';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { projectService } from '../services/api/projectService';

interface ProjectCardProps {
    fileId:string;
    thumbnailUrl: string;
    title: string;
    projectUrl: string;

}

const ProjectCard: React.FC<ProjectCardProps> = ({
    fileId,
    thumbnailUrl,
    title,

}) => {
    const [isHovered, setIsHovered] = useState(false);
    const onEdit = async () => {
        console.log("On Edit Clicked")
    }
    const onDelete = async () => {
        console.log("On Delete Clicked")

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
                <CustomText variant="h6" value={title} />
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