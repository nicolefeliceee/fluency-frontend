import { ProjectDetail } from "./project-detail";

export class ProjectCreate {
  title!: string;
  statusId!: string;
  caption!: string;
  description!: string;
  mention!: string;
  hashtag!: string;
  influencerId!: string;
  brandId!: string;
  projectDetails!: ProjectDetail[];
}
