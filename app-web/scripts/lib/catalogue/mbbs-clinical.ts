import type { CourseSpec, ModuleDraft } from "../undergrad-course";
import { paletteColor } from "../undergrad-course";
import { ANAES, CLERK, EBP, FORENSIC, GERI, THERAP, TRANS } from "./mbbs-clinical-year6";
import { EMCC, FCM, IM3, OBG2, PAED2, RADLAB, SURG2 } from "./mbbs-clinical-year5";
import { IM1, IM2, OBG1, PAED1, PSYCH, SURG1 } from "./mbbs-clinical-year4";

/**
 * MBBS clinical years 4-6: clerkship-style courses organised by specialty.
 * The research doc (docs/research/mbbs-curriculum.md) covers Years 1-3 only, so
 * this structure is authored from general knowledge of clinical curricula at
 * leading European and US schools; no specific institution's clinical
 * curriculum was retrieved, and none is cited. Wording is original.
 */
const PROGRAMME = "mbbs-medicine";

const MBBS_PALETTE = ["#9b2335", "#0f766e", "#6b3fa0", "#b4472f", "#1f6f78", "#7a2e5a"];

interface CourseProvenance {
  sources: Array<{ id: string; title: string; type: "authored" }>;
  reviewStatus: "draft";
  verified: false;
  note: string;
}

type MbbsCourseSpec = CourseSpec & { provenance: CourseProvenance };

const PROVENANCE: CourseProvenance = {
  sources: [{ id: "mindspark-authored", title: "Mindspark authored course structure", type: "authored" }],
  reviewStatus: "draft",
  verified: false,
  note: "Clinical-years course structure authored from general knowledge of clerkship curricula at European and US medical schools; no specific institutional curriculum was consulted for this course. Wording is original. Not yet clinically reviewed or checked against named university curricula.",
};

interface Row {
  slug: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  year: "Year4" | "Year5" | "Year6";
  semester: 1 | 2;
  icon: string;
  modules: ModuleDraft[];
}

const ROWS: Row[] = [
  { slug: "mbbs-internal-medicine-1", code: "MBB401", name: "Internal Medicine I (Cardiology and Respiratory Medicine)", shortName: "Medicine I", description: "Clinical reasoning in heart and lung disease: ischaemic heart disease, heart failure, arrhythmia, valve disease, hypertension, asthma, COPD, pneumonia and pulmonary embolism.", year: "Year4", semester: 1, icon: "Heartbeat", modules: IM1 },
  { slug: "mbbs-internal-medicine-2", code: "MBB402", name: "Internal Medicine II (Gastroenterology, Renal, Endocrine, Haematology and Neurology)", shortName: "Medicine II", description: "Presentation, diagnosis, investigation and management of gut, liver, kidney, hormonal, blood and neurological disease.", year: "Year4", semester: 1, icon: "Stethoscope", modules: IM2 },
  { slug: "mbbs-general-surgery-1", code: "MBB403", name: "General Surgery I", shortName: "Surgery I", description: "Perioperative care, the acute abdomen, gastrointestinal and breast and endocrine surgery, trauma, burns and vascular emergencies.", year: "Year4", semester: 1, icon: "Scalpel", modules: SURG1 },
  { slug: "mbbs-obstetrics-gynaecology-1", code: "MBB404", name: "Obstetrics and Gynaecology I (Obstetrics)", shortName: "Obs and Gynae I", description: "Normal and complicated pregnancy, labour and delivery, obstetric emergencies and the puerperium.", year: "Year4", semester: 2, icon: "Baby", modules: OBG1 },
  { slug: "mbbs-paediatrics-1", code: "MBB405", name: "Paediatrics I", shortName: "Paediatrics I", description: "The newborn, growth and development, nutrition and immunisation, acute childhood illness and child protection.", year: "Year4", semester: 2, icon: "Baby", modules: PAED1 },
  { slug: "mbbs-psychiatry", code: "MBB406", name: "Psychiatry", shortName: "Psychiatry", description: "Psychiatric assessment and risk, mood, anxiety, psychotic and organic disorders, substance use and psychiatry across the life course.", year: "Year4", semester: 2, icon: "Brain", modules: PSYCH },
  { slug: "mbbs-internal-medicine-3", code: "MBB501", name: "Internal Medicine III (Infectious Disease, Rheumatology and Dermatology)", shortName: "Medicine III", description: "Infection syndromes, HIV, tuberculosis and malaria, inflammatory joint and connective tissue disease, skin disease and oncology practice.", year: "Year5", semester: 1, icon: "Virus", modules: IM3 },
  { slug: "mbbs-surgery-2", code: "MBB502", name: "Surgery II (Orthopaedics, Urology, ENT and Ophthalmology)", shortName: "Surgery II", description: "Fractures and joint disease, urinary tract disease, ear, nose and throat surgery, and the eye.", year: "Year5", semester: 1, icon: "Scalpel", modules: SURG2 },
  { slug: "mbbs-obstetrics-gynaecology-2", code: "MBB503", name: "Obstetrics and Gynaecology II (Gynaecology and High-Risk Obstetrics)", shortName: "Obs and Gynae II", description: "Gynaecological assessment, benign and malignant disease, reproductive health and high-risk obstetric care.", year: "Year5", semester: 1, icon: "Baby", modules: OBG2 },
  { slug: "mbbs-paediatrics-2", code: "MBB504", name: "Paediatrics II", shortName: "Paediatrics II", description: "Paediatric systems disease, neurodevelopment and disability, childhood infection and allergy, paediatric surgery and critical illness.", year: "Year5", semester: 2, icon: "Baby", modules: PAED2 },
  { slug: "mbbs-emergency-critical-care", code: "MBB505", name: "Emergency Medicine and Critical Care", shortName: "Emergency Medicine", description: "Resuscitation, medical and surgical emergencies, trauma, poisoning and organ support in critical care.", year: "Year5", semester: 2, icon: "Ambulance", modules: EMCC },
  { slug: "mbbs-radiology-laboratory-medicine", code: "MBB506", name: "Radiology and Laboratory Medicine", shortName: "Radiology and Lab", description: "Choosing and interpreting imaging, clinical radiology by system, and the interpretation of biochemistry, haematology, microbiology and histopathology results.", year: "Year5", semester: 2, icon: "Scan", modules: RADLAB },
  { slug: "mbbs-family-community-medicine", code: "MBB507", name: "Family and Community Medicine", shortName: "Family Medicine", description: "The primary care consultation, chronic disease and prevention, community and occupational health, and care of families and vulnerable groups.", year: "Year5", semester: 2, icon: "Home", modules: FCM },
  { slug: "mbbs-clinical-clerkship-integration", code: "MBB601", name: "Clinical Clerkship Integration (Medicine and Surgery)", shortName: "Clerkship", description: "Integrated medical and surgical clerkships: admission, reasoning, ward management, discharge and core practical procedures.", year: "Year6", semester: 1, icon: "Clipboard", modules: CLERK },
  { slug: "mbbs-therapeutics-prescribing-safety", code: "MBB602", name: "Therapeutics and Prescribing Safety", shortName: "Therapeutics", description: "Safe prescribing, adverse drug events and interactions, antimicrobial stewardship, toxicology and medication safety systems.", year: "Year6", semester: 1, icon: "Pill", modules: THERAP },
  { slug: "mbbs-anaesthesia-pain", code: "MBB603", name: "Anaesthesia and Pain Medicine", shortName: "Anaesthesia", description: "Preoperative assessment, anaesthetic techniques, airway management, acute pain and chronic pain.", year: "Year6", semester: 1, icon: "Syringe", modules: ANAES },
  { slug: "mbbs-geriatrics-palliative-care", code: "MBB604", name: "Geriatrics and Palliative Care", shortName: "Geriatrics", description: "Comprehensive geriatric assessment, polypharmacy and rehabilitation, symptom control and end-of-life care, capacity and ethics.", year: "Year6", semester: 2, icon: "Heart", modules: GERI },
  { slug: "mbbs-forensic-medicine-law", code: "MBB605", name: "Forensic Medicine and Medical Law", shortName: "Forensic and Law", description: "Forensic pathology and toxicology, documentation of injury, medical law and professional ethics.", year: "Year6", semester: 2, icon: "Scale", modules: FORENSIC },
  { slug: "mbbs-evidence-based-practice-research", code: "MBB606", name: "Evidence-Based Practice and Research Project", shortName: "EBP and Research", description: "Formulating questions, appraising trials, reviews and diagnostic studies, designing and reporting a research project, and quality improvement.", year: "Year6", semester: 2, icon: "BookOpen", modules: EBP },
  { slug: "mbbs-transition-to-practice", code: "MBB607", name: "Transition to Practice", shortName: "Transition", description: "On-call work, recognising the deteriorating patient, professionalism and patient safety, wellbeing and career planning for the first year as a doctor.", year: "Year6", semester: 2, icon: "Briefcase", modules: TRANS },
];

export const MBBS_CLINICAL: CourseSpec[] = ROWS.map(
  (row, index): MbbsCourseSpec => ({
    ...row,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, index),
    provenance: PROVENANCE,
  }),
);
