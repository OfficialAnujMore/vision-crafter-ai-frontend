import React, { useState } from 'react';
import '../styles/ProjectsCards.css';

interface ProjectCardProps {

    thumbnailUrl: string;
    title: string;
    projectUrl: string;

}

const ProjectCard: React.FC<ProjectCardProps> = ({
    thumbnailUrl,
    title,
    projectUrl,

}) => {
    const [isHovered, setIsHovered] = useState(false);
    const onEdit = async () => {
        console.log("On Edit Clicked")
    }
    const onDelete = async () => {
        console.log("On Delete Clicked")
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
                <h3 className="project-card__title">{title}</h3>
                <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link"
                >
                    View Project
                </a>
            </div>

            {isHovered && (
                <div className="project-card__overlay">
                    <button
                        onClick={onEdit}
                        className="project-card__button project-card__button--edit"
                    >
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                        className="project-card__button project-card__button--delete"
                    >
                        Delete
                    </button>

                </div>
            )}
        </div>
    );
};

export default ProjectCard;