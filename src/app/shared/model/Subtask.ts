
import { Task } from "./Task";
import { Board } from "./Board";

export class Subtask {
  id?: string;
  description: string;
  status: string;
  creationDate: string;
  //assignedUser?: User;
  task?: Task;
  board?: Board;

  constructor(
    id?: string,
    description: string = "",
    status: string = "",
    creationDate: string = "",
    //assignedUser?: User,
    task?: Task,
    board?: Board
  ) {
    this.id = id;
    this.description = description;
    //this.assignedUser = assignedUser;
    this.task = task;
    this.board = board;
  }
}

