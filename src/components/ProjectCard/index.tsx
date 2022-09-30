import * as React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

export interface ProjectCardProps {
  name: string;
  icon: string;
  description: string;
  path: string;
}

const ProjectCard: React.SFC<ProjectCardProps> = props => {
  return (
    <Link className="project-panel" to={props.path}>
      <img className="project-panel__icon" src={props.icon} alt="" />
      <div>
        <h1 className="project-panel__title">{props.name}</h1>
        <p className="project-panel__description">{props.description}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
