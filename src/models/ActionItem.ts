export interface ActionItemIFace {
  readonly id: number;
  order: number;
  readonly jobId: number;
  authorId: number;
  checkedOffById?: number;
  completed?: boolean;
  text: string;
  status?: string;
}

export default class ActionItem {
  protected readonly id: number;
  protected order: number;
  protected readonly jobId: number;
  protected authorId: number;
  protected checkedOffById?: number;
  protected completed?: boolean;
  protected text: string;
  protected status: string;

  constructor(actionItemData: ActionItemIFace) {
    this.id = actionItemData.id;
    this.order = actionItemData.order;
    this.jobId = actionItemData.jobId;
    this.authorId = actionItemData.authorId;
    this.checkedOffById = actionItemData.checkedOffById;
    this.completed = actionItemData.completed;
    this.text = actionItemData.text;
    this.status = actionItemData.status;
  }

  public toJSON = () => {
    return {
      id:           this.id,
      order:   this.order,
      jobId:     this.jobId,
      authorId:        this.authorId,
      checkedOffById:  this.checkedOffById,
      completed:      this.completed,
      text:          this.text,
      status:      this.status,
    }
  }
}