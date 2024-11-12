import { UserMark } from './user-mark.interface';

// BINGO

export const USER_MARK_REGISTER_NEW: UserMark = {
    registered: true,
    active: false,
};


export const USER_MARK_REGISTER_CONFIRMED: UserMark = {
    registered: true,
    active: true,
};


export const USER_MARK_EMPLOYEE_NEW: UserMark = {
    registered: false,
    active: true,
};
