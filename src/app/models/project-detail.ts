import { Time } from "@angular/common";

export class ProjectDetail {
  id!: number;
  mediatypeId!: string;
  note!: string;
  deadlineDate!: Date;
  deadlineTime!: Time;
  link!: string;
  nominal!: string;
  tempId!: number;
  instagramMediaId!: string;

  constructor() {}
}
