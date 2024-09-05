export enum ReportsPermission
{
    ManagersMembersKanban = 'REPORT_KANBAN_PROJECT_MANAGER_AND_MEMBER',
    ManagersMembersTrello = 'REPORT_TRELLO_PROJECT_MANAGER_AND_MEMBER',
    UserKanbanTrello = 'REPORT_KANBAN_TRELLO_PROJECT_WITH_USER',
    ChartKanban = 'REPORT_CHART_KANBAN_PROJECT',
    ChartTrello = 'REPORT_CHART_TRELLO_PROJECT',
    TimeLeft = 'REPORT_TIME_LEFT',
    ManagersMembersUpload = 'REPORT_MANAGERS_MEMBERS_UPLOAD',
    UserUpload = 'REPORT_PERSONAL_UPLOAD',
    TimeLeftUpload = 'REPORT_TIME_LEFT_UPLOAD',
}