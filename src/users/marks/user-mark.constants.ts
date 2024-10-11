import { UserMark } from './user-mark.interface';


export const USER_MARK_REGISTER_NEW: UserMark = {
    registered: true,
    active: false,
    systemAdmin: false,
};


export const USER_MARK_REGISTER_CONFIRMED: UserMark = {
    registered: true,
    active: true,
    systemAdmin: false,
};


export const USER_MARK_EMPLOYEE_NEW: UserMark = {
    registered: false,
    active: true,
    systemAdmin: false,
};


export const USER_MARK_SYSTEM_ADMIN: UserMark = {
    registered: false,
    active: true,
    systemAdmin: true,
};
