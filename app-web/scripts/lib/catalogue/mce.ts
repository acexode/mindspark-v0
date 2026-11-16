import type { CourseSpec } from "../undergrad-course";
import { MCE_YEAR_1_2 } from "./mce-year12";
import { MCE_YEAR_3 } from "./mce-year3";

export const MCE_COURSES: CourseSpec[] = [...MCE_YEAR_1_2, ...MCE_YEAR_3];
