export interface ScheduleDetail {
    date: string;
    details: string[];
}

export interface Schedule {
    hours: string;
    location: string;
    sessions: ScheduleDetail[];
}

export interface SyllabusInfo {
    courseName: string;
    courseCode: string;
    professorName: string[];
    schedule: Schedule;
    gradingCriteria: string;
}