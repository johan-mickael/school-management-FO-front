export interface Class {
  id: number,
  name: string,
  description: string
}

export interface Subclass {
  id: number,
  name: string,
  class_id: number,
  description: string,
  class_name: string,
  class_description: string
}

export interface PlanningCalendar {
  planningId: number,
  title: string,
  start: string,
  end: string,
  isRemote: number,
  borderColor: string,
  backgroundColor: string,
  className: string,
  subclassId: number
}

export interface Planning {
  id: number,
  subclass_id: number,
  subclass_name: string,
  place: string,
  planning_date: string,
  start: string,
  end: string,
  schoolyear_id: number,
  is_remote: number,
  description: string,
  status: number,
  subject_id: number,
  subject_name: string,
  subject_description: string,
  professor_name: string
}

export interface Student {
  id: number,
  first_name: string,
  last_name: string,
  description: string,
  start: string,
  end: string,
  subclass_id: string
}

export interface SchoolYear {
  id: number,
  description: string,
  start: string,
  end: string
}

export interface  ChartData {
  name: string,
  value: number
}
