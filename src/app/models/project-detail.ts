import { Time } from "@angular/common";

export class ProjectDetail {
  mediatypeId!: string;
  note!: string;
  deadlineDate!: Date;
  deadlineTime!: Time;
  link!: string;
  nominal!: string;
  tempId!: number;

  constructor() {}
}
