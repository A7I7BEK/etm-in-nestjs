import { TaskCopyEvent } from './task-copy.event';

export interface TaskMoveEvent<T> extends TaskCopyEvent<T>
{ }
