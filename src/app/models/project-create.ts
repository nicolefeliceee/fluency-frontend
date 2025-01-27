import { ProjectDetail } from "./project-detail";

export class ProjectCreate {
  id!: string;
  title!: string;
  userId!: string;
  statusId!: string;
  caption!: string;
  description!: string;
  mention!: string;
  hashtag!: string;
  influencerId!: string;
  brandId!: string;
  referenceNumber!: string;
  projectDetails!: ProjectDetail[];
}
