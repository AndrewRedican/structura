export interface ParentMessage {
  type: string;
  options?: ChildOptions;
}

interface ChildOptions {
  inputCallback?: string | null;
}