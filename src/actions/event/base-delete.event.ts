import { BaseCreateEvent } from './base-create.event';

export interface BaseDeleteEvent<T> extends BaseCreateEvent<T>
{ }
