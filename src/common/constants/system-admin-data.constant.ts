import { PERMISSION_LIST } from 'src/iam/authorization/permission.constants';


export const SYSTEM_ADMIN_DATA = {
    "systemAdmin": true,
    "id": 0,
    "userName": "system_admin",
    "email": "system@system.system",
    "phoneNumber": "900000000",
    "marks": {
        "registered": false,
        "active": true
    },
    "language": {
        "code": "en",
        "name": "English"
    },
    "employee": {
        "id": 0,
        "firstName": "System",
        "lastName": "Admin",
        "middleName": "",
        "birthDate": null,
        "photoFile": null,
    },
    "roles": [
        {
            "id": 0,
            "name": "SYSTEM_ADMIN",
            "permissions": PERMISSION_LIST,
        }
    ],
    "organization": {
        "id": 0,
        "name": "System Org",
        "email": "system@system.system"
    },
};