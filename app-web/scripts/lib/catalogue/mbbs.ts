import type { CourseSpec } from "../undergrad-course";
import { MBBS_CLINICAL } from "./mbbs-clinical";
import { MBBS_YEAR_1 } from "./mbbs-year1";
import { MBBS_YEAR_2_3 } from "./mbbs-year23";

export const MBBS_COURSES: CourseSpec[] = [...MBBS_YEAR_1, ...MBBS_YEAR_2_3, ...MBBS_CLINICAL];
