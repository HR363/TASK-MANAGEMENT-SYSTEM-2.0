export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public assignedToUserId: number | null = null
  ) {}
}
