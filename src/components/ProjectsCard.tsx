import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/ProjectsCards.css';
import CustomText from './CustomComponents/CustomText';
import ConfirmationModal from './CustomComponents/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { textVariant } from '../constants/textVariants';
import { MoreVertical, Pencil, Edit, Trash2, Loader2 } from 'lucide-react';
import type { SaveFileResponse } from '../interface/project';

interface ProjectCardProps {
    project: SaveFileResponse;
    onDelete: (projectId: string) => void;
    onRename: (projectId: string, newTitle: string) => Promise<void>;
}

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const withCacheBust = (url: string, updatedAt: string): string => {
    try {
        const parsed = new URL(url);
        parsed.searchParams.set('v', String(new Date(updatedAt).getTime()));
        return parsed.toString();
    } catch {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${encodeURIComponent(String(new Date(updatedAt).getTime()))}`;
    }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onRename }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(project.title);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isRenameSaving, setIsRenameSaving] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const renameInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const thumbnailSrc = useMemo(
        () => withCacheBust(project.thumbnail_url, project.updated_at),
        [project.thumbnail_url, project.updated_at],
    );

    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menuOpen]);

    useEffect(() => {
        if (renaming && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [renaming]);

    useEffect(() => {
        setImageLoaded(false);
    }, [thumbnailSrc]);

    const handleEdit = () => {
        setMenuOpen(false);
        navigate(ROUTES.EDITOR.replace(':projectId', `${project.id}`));
    };

    const handleRenameStart = () => {
        setMenuOpen(false);
        setRenameValue(project.title);
        setRenaming(true);
    };

    const handleRenameSubmit = async () => {
        if (isRenameSaving) return;

        const trimmed = renameValue.trim();
        if (!trimmed || trimmed === project.title) {
            setRenaming(false);
            return;
        }

        setIsRenameSaving(true);
        try {
            await onRename(project.id, trimmed);
            setRenaming(false);
        } finally {
            setIsRenameSaving(false);
        }
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            void handleRenameSubmit();
        } else if (e.key === 'Escape') {
            if (isRenameSaving) return;
            setRenaming(false);
        }
    };

    const handleDeleteClick = () => {
        setMenuOpen(false);
        setConfirmDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        setConfirmDeleteOpen(false);
        onDelete(project.id);
    };

    return (
        <>
            <div className="pc-card">
                <div className="pc-thumb" onClick={handleEdit}>
                    {!imageLoaded && <div className="pc-shimmer" />}
                    <img
                        src={thumbnailSrc}
                        alt={project.title}
                        className={`pc-thumb-img${imageLoaded ? ' pc-thumb-img--loaded' : ''}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>

                <div className="pc-info">
                    <div className="pc-title-row">
                        {renaming ? (
                            <div className="pc-rename-wrapper">
                                <input
                                    ref={renameInputRef}
                                    className="pc-rename-input"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onKeyDown={handleRenameKeyDown}
                                    onBlur={() => void handleRenameSubmit()}
                                    disabled={isRenameSaving}
                                />
                                {isRenameSaving && <Loader2 size={14} className="pc-rename-loader" />}
                            </div>
                        ) : (
                            <CustomText
                                variant={textVariant.p}
                                text={project.title}
                            />
                        )}

                        <div className="pc-menu-container" ref={menuRef}>
                            <button
                                className="pc-menu-trigger"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Project actions"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {menuOpen && (
                                <div className="pc-menu">
                                    <button className="pc-menu-item" onClick={handleRenameStart}>
                                        <Pencil size={14} />
                                        <span>Rename</span>
                                    </button>
                                    <button className="pc-menu-item" onClick={handleEdit}>
                                        <Edit size={14} />
                                        <span>Edit</span>
                                    </button>
                                    <div className="pc-menu-divider" />
                                    <button className="pc-menu-item pc-menu-item--danger" onClick={handleDeleteClick}>
                                        <Trash2 size={14} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pc-meta">
                        <span className="pc-meta-badge">{project.width} x {project.height}</span>
                    </div>
                    <div className="pc-meta">
                        <span className="pc-meta-text">Created {formatDate(project.created_at)}</span>
                    </div>
                    {project.updated_at !== project.created_at && (
                        <div className="pc-meta">
                            <span className="pc-meta-text">Updated {formatDate(project.updated_at)}</span>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete project?"
                description={`"${project.title}" will be permanently deleted. This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </>
    );
};

export default ProjectCard;
