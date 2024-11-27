import { PERMISSION_LIST } from 'src/iam/authorization/permission.constants';


export const SYSTEM_ADMIN_DATA = {
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
    "roles": [
        {
            "id": 0,
            "roleName": "system admin",
            "codeName": "SYSTEM_ADMIN",
            "permissions": PERMISSION_LIST,
        }
    ],
    "userId": 0,
    "systemAdmin": true,
    "id": 0,
    "firstName": "System",
    "lastName": "Admin",
    "middleName": null,
    "birthDate": null,
    "photoUrl": null,
    "organizationId": 0,
    "organizationName": "System Org"
};