import type { ModuleDraft } from "../undergrad-course";
import { mod, unit } from "./mbbs-clinical-kit";

/** MBBS Year 5 module trees. Wording is original; principles are guideline-independent. */

export const IM3: ModuleDraft[] = [
  mod("infectious-disease-syndromes", "Infectious Disease Syndromes", "Clinical approach to infection.", [
    unit("sepsis-and-bacteraemia", "Sepsis and Bacteraemia", "Recognition and the first hour.", [
      "Recognise sepsis from vital signs, lactate and organ dysfunction",
      "Describe the early bundle of cultures, antimicrobials, fluids and source control",
      "Explain how to review and narrow antimicrobial therapy once results return",
    ]),
    unit("cns-and-skin-infection", "Meningitis, Encephalitis and Skin Infection", "Central nervous system and soft tissue.", [
      "Recognise bacterial meningitis and describe urgent empirical treatment before imaging",
      "Interpret cerebrospinal fluid findings in bacterial, viral and tuberculous meningitis",
      "Differentiate cellulitis from necrotising soft tissue infection",
    ]),
  ]),
  mod("tropical-and-chronic-infections", "HIV, Tuberculosis and Tropical Infection", "Major global infections.", [
    unit("hiv-infection", "HIV Infection", "Diagnosis, opportunistic disease and treatment.", [
      "Describe HIV testing, staging and the meaning of CD4 count and viral load",
      "Name the common opportunistic infections and when prophylaxis is considered",
      "Explain the principles of combination antiretroviral therapy and prevention of transmission",
    ]),
    unit("tuberculosis", "Tuberculosis", "Pulmonary and extrapulmonary disease.", [
      "Describe the presentation and diagnostic work-up of pulmonary tuberculosis",
      "Explain why combination therapy and adherence are essential",
      "Distinguish latent from active infection and outline contact tracing",
    ]),
    unit("malaria-and-tropical-fever", "Malaria and Fever in the Returning Traveller", "Imported and endemic fever.", [
      "Take a travel and exposure history for a patient with fever",
      "Describe the diagnosis of malaria and the features of severe disease",
      "List other important tropical causes of fever such as typhoid and viral haemorrhagic fever",
    ]),
  ]),
  mod("rheumatology", "Rheumatology and Musculoskeletal Medicine", "Inflammatory and degenerative joint disease.", [
    unit("inflammatory-arthritis", "Inflammatory Arthritis", "Rheumatoid arthritis, spondyloarthritis and gout.", [
      "Differentiate inflammatory from mechanical joint pain",
      "Describe the features, serology and treatment principles of rheumatoid arthritis",
      "Distinguish gout from septic arthritis and describe joint aspiration findings",
    ]),
    unit("connective-tissue-and-vasculitis", "Connective Tissue Disease and Vasculitis", "Systemic autoimmune disease.", [
      "Describe the multisystem features of systemic lupus erythematosus",
      "Interpret autoantibody tests and their limits",
      "Recognise giant cell arteritis and the urgency of starting steroids",
    ]),
  ]),
  mod("dermatology", "Dermatology", "Diseases of the skin.", [
    unit("common-skin-disease", "Common Inflammatory Skin Disease", "Eczema, psoriasis and acne.", [
      "Describe skin lesions using standard morphological terms",
      "Differentiate eczema from psoriasis by distribution and appearance",
      "Outline topical treatment principles and when to use systemic therapy",
    ]),
    unit("skin-cancer-and-emergencies", "Skin Cancer and Dermatological Emergencies", "Malignancy and severe drug reactions.", [
      "Apply the ABCDE features to assess a pigmented lesion",
      "Distinguish basal cell carcinoma, squamous cell carcinoma and melanoma",
      "Recognise Stevens-Johnson syndrome and erythroderma as emergencies",
    ]),
  ]),
  mod("oncology-and-haematology-practice", "Oncology and Chronic Disease Practice", "Cancer care and multimorbidity.", [
    unit("oncology-principles", "Principles of Oncology", "Staging, treatment and emergencies.", [
      "Describe the modalities of cancer treatment and their goals",
      "Recognise oncological emergencies such as neutropenic sepsis and spinal cord compression",
      "Explain the role of performance status in treatment decisions",
    ]),
    unit("multimorbidity", "Managing Multimorbidity", "Common clinical combinations.", [
      "Prioritise problems in a patient with several chronic conditions",
      "Review a medication list for interactions and burden",
      "Explain shared decision-making in the presence of competing risks",
    ]),
  ]),
];

export const SURG2: ModuleDraft[] = [
  mod("orthopaedics-and-trauma", "Orthopaedics and Fracture Care", "Bone and joint surgery.", [
    unit("fracture-management", "Fracture Assessment and Management", "Description, reduction and complications.", [
      "Describe a fracture radiograph by site, pattern, displacement and joint involvement",
      "Explain the principles of reduction, immobilisation and fixation",
      "Recognise compartment syndrome, open fractures and neurovascular compromise",
    ]),
    unit("joint-and-spine-disease", "Joint, Spine and Paediatric Orthopaedics", "Degenerative and developmental conditions.", [
      "Compare osteoarthritis and inflammatory arthritis in the context of joint replacement",
      "Recognise red flags in low back pain and cauda equina syndrome",
      "Describe the presentation of septic arthritis and developmental hip dysplasia",
    ]),
  ]),
  mod("urology", "Urology", "Urinary tract disease.", [
    unit("urinary-obstruction-and-stones", "Renal Colic, Stones and Obstruction", "Acute and chronic obstruction.", [
      "Describe the presentation and imaging of ureteric colic",
      "Explain the emergency of an obstructed infected kidney",
      "Outline the options for stone management",
    ]),
    unit("prostate-and-urological-cancer", "Prostate Disease and Urological Cancer", "Lower urinary tract symptoms and malignancy.", [
      "Evaluate lower urinary tract symptoms in a man",
      "Discuss the benefits and limits of prostate-specific antigen testing",
      "Describe the presentation of bladder and renal cancer, and the importance of haematuria",
    ]),
    unit("acute-scrotum-and-retention", "The Acute Scrotum and Urinary Retention", "Urological emergencies.", [
      "Recognise testicular torsion and explain the time-critical need for exploration",
      "Differentiate acute from chronic urinary retention and their management",
      "Describe the catheterisation process and its complications",
    ]),
  ]),
  mod("ear-nose-and-throat", "Ear, Nose and Throat Surgery", "Head and neck.", [
    unit("ear-disease-and-hearing", "Ear Disease and Hearing Loss", "Otitis, vertigo and deafness.", [
      "Differentiate conductive from sensorineural hearing loss using tuning fork tests",
      "Describe the presentation and complications of otitis media",
      "Distinguish the common causes of vertigo",
    ]),
    unit("nose-throat-and-airway", "Nose, Throat and Airway Emergencies", "Epistaxis, tonsillitis and airway obstruction.", [
      "Describe the first-aid and stepwise management of epistaxis",
      "Recognise peritonsillar abscess and deep neck space infection",
      "Describe the assessment of a neck lump and the red flags for head and neck cancer",
    ]),
  ]),
  mod("ophthalmology", "Ophthalmology", "The eye and vision.", [
    unit("the-red-eye-and-visual-loss", "The Red Eye and Sudden Visual Loss", "Urgent presentations.", [
      "Differentiate conjunctivitis from acute angle-closure glaucoma, uveitis and keratitis",
      "Describe causes of painless sudden visual loss, including retinal artery occlusion",
      "Explain the examination steps including visual acuity, pupils and fundoscopy",
    ]),
    unit("chronic-eye-disease", "Cataract, Glaucoma and Diabetic Eye Disease", "Chronic causes of visual impairment.", [
      "Describe the clinical features and treatment of cataract",
      "Explain how raised intraocular pressure damages the optic nerve",
      "Describe the stages of diabetic retinopathy and the importance of screening",
    ]),
  ]),
];

export const OBG2: ModuleDraft[] = [
  mod("gynaecological-assessment", "Gynaecological Assessment and Menstrual Disorders", "Menstrual and pelvic disease.", [
    unit("menstrual-disorders", "Menstrual Disorders and Amenorrhoea", "Abnormal bleeding and absent periods.", [
      "Take a gynaecological history and describe the pelvic examination",
      "Classify abnormal uterine bleeding by cause",
      "Investigate primary and secondary amenorrhoea",
    ]),
    unit("pelvic-pain-and-endometriosis", "Pelvic Pain, Endometriosis and Fibroids", "Benign gynaecological disease.", [
      "Distinguish the causes of acute and chronic pelvic pain",
      "Describe the features and management of endometriosis and fibroids",
      "Recognise ovarian torsion and pelvic inflammatory disease",
    ]),
  ]),
  mod("gynaecological-oncology", "Gynaecological Oncology and Screening", "Cervix, uterus and ovary.", [
    unit("cervical-disease", "Cervical Screening and Cervical Cancer", "Prevention and treatment.", [
      "Explain the role of human papillomavirus in cervical neoplasia and vaccination",
      "Describe how screening and colposcopy detect precancer",
      "Outline the staging and treatment principles of cervical cancer",
    ]),
    unit("uterine-and-ovarian-cancer", "Endometrial and Ovarian Cancer", "Postmenopausal bleeding and pelvic masses.", [
      "Investigate postmenopausal bleeding",
      "Describe the presentation and assessment of an ovarian mass",
      "Explain why ovarian cancer is often diagnosed at a late stage",
    ]),
  ]),
  mod("reproductive-health", "Fertility, Contraception and Menopause", "Reproductive life.", [
    unit("contraception-and-termination", "Contraception and Abortion Care", "Counselling and methods.", [
      "Compare contraceptive methods by mechanism, effectiveness and contraindications",
      "Describe emergency contraception options",
      "Explain the legal and ethical framework of counselling on pregnancy termination",
    ]),
    unit("subfertility-and-menopause", "Subfertility, Polycystic Ovary Syndrome and Menopause", "Conception and ageing.", [
      "Outline the initial investigation of a couple with subfertility",
      "Describe the features and consequences of polycystic ovary syndrome",
      "Discuss the benefits and risks of menopausal hormone therapy",
    ]),
    unit("sexual-health", "Sexually Transmitted Infection and Sexual Health", "Diagnosis and partner management.", [
      "Take a sexual history respectfully and assess risk",
      "Describe the presentation and treatment principles of chlamydia, gonorrhoea and syphilis",
      "Explain partner notification and confidentiality",
    ]),
  ]),
  mod("high-risk-obstetrics", "High-Risk Obstetrics", "Complex pregnancy.", [
    unit("preterm-and-multiple-pregnancy", "Preterm Labour and Multiple Pregnancy", "Early birth and twins.", [
      "Describe risk factors and prevention strategies for preterm birth",
      "Explain the role of antenatal corticosteroids and tocolysis",
      "Describe complications specific to twin pregnancy",
    ]),
    unit("maternal-collapse", "Obstetric Emergencies and Maternal Mortality", "Life-threatening events.", [
      "Describe the causes of maternal death and the interventions that prevent them",
      "Outline the management of eclampsia, amniotic fluid embolism and sepsis",
      "Explain the role of skilled birth attendance and referral systems",
    ]),
  ]),
];

export const PAED2: ModuleDraft[] = [
  mod("child-systems-disease", "Paediatric Systems Disease", "Organ-specific illness in children.", [
    unit("paediatric-gastroenterology-and-nephrology", "Gastroenterology and Renal Disease in Children", "Abdominal and urinary problems.", [
      "Differentiate causes of vomiting and abdominal pain in infants, including pyloric stenosis and intussusception",
      "Describe the diagnosis and management of urinary tract infection in children",
      "Recognise nephrotic syndrome and post-infectious glomerulonephritis",
    ]),
    unit("paediatric-endocrinology-and-haematology", "Endocrine, Haematological and Genetic Disease", "Growth, anaemia and syndromes.", [
      "Describe the presentation of type 1 diabetes and congenital hypothyroidism",
      "Recognise sickle cell disease complications and childhood leukaemia",
      "Describe common chromosomal syndromes and their associated problems",
    ]),
  ]),
  mod("neurodevelopment-and-disability", "Neurodevelopment and Disability", "Developmental and neurological disorders.", [
    unit("developmental-delay-and-cerebral-palsy", "Developmental Delay and Cerebral Palsy", "Recognition and support.", [
      "Differentiate global developmental delay from isolated delay",
      "Describe the causes, types and associated problems of cerebral palsy",
      "Explain the roles of the multidisciplinary team and education services",
    ]),
    unit("behaviour-and-mental-health", "Behavioural and Mental Health Problems in Children", "Attention, autism and adolescence.", [
      "Assess a child with behavioural concerns using information from several settings",
      "Describe common adolescent mental health problems",
      "Explain confidentiality and consent in adolescents",
    ]),
  ]),
  mod("childhood-infection-and-immunity", "Childhood Infection and Allergy", "Infection patterns and prevention.", [
    unit("exanthems-and-vaccine-preventable-disease", "Rashes and Vaccine-Preventable Disease", "Measles, pertussis and others.", [
      "Differentiate common childhood rashes by pattern and associated features",
      "Recognise Kawasaki disease and its cardiac risk",
      "Explain herd immunity and the public health case for vaccination",
    ]),
    unit("allergy-and-atopy", "Allergy and Atopic Disease", "Food allergy, eczema and anaphylaxis.", [
      "Describe the presentation of IgE-mediated food allergy",
      "Explain the management of childhood eczema",
      "Outline the use of adrenaline for anaphylaxis and the importance of an action plan",
    ]),
  ]),
  mod("paediatric-surgery-and-critical-care", "Paediatric Surgery and Critical Illness", "Surgical problems and the very sick child.", [
    unit("paediatric-surgical-conditions", "Common Paediatric Surgical Conditions", "Congenital and acquired.", [
      "Describe the presentation of inguinal hernia, undescended testis and appendicitis in children",
      "Recognise bilious vomiting as a surgical emergency in the newborn",
      "Explain the principles of analgesia and fasting in children",
    ]),
    unit("paediatric-resuscitation", "Paediatric Resuscitation and Poisoning", "Life support and ingestion.", [
      "Describe paediatric basic and advanced life support principles",
      "Approach a child with accidental ingestion and consider the toxin and timing",
      "Recognise the prevention of injuries as a cause of child mortality",
    ]),
  ]),
];

export const EMCC: ModuleDraft[] = [
  mod("emergency-assessment", "Emergency Assessment and Resuscitation", "The first minutes.", [
    unit("primary-survey-and-triage", "Triage and the Sick Adult", "Structured assessment of the acutely unwell.", [
      "Apply an airway, breathing, circulation, disability and exposure assessment",
      "Use early warning scores to recognise deterioration",
      "Explain triage principles in a busy department or mass casualty setting",
    ]),
    unit("cardiac-arrest", "Cardiac Arrest and Life Support", "Basic and advanced life support.", [
      "Describe the sequence of basic life support and defibrillation",
      "Distinguish shockable from non-shockable rhythms and their treatment",
      "Identify and treat reversible causes of cardiac arrest",
    ]),
  ]),
  mod("medical-emergencies", "Medical Emergencies", "Common emergencies.", [
    unit("shock-and-sepsis", "Shock and Anaphylaxis", "Circulatory failure.", [
      "Classify shock as hypovolaemic, cardiogenic, distributive or obstructive",
      "Describe the immediate treatment of anaphylaxis",
      "Explain fluid and vasopressor reasoning in septic shock",
    ]),
    unit("poisoning-and-environment", "Poisoning, Overdose and Environmental Injury", "Toxicology and exposure.", [
      "Approach the overdosed patient with risk assessment and supportive care",
      "Describe the antidotes for paracetamol, opioid and benzodiazepine poisoning",
      "Recognise the presentation of hypothermia, heat illness and drowning",
    ]),
    unit("acid-base-and-metabolic-emergencies", "Acid-Base and Metabolic Emergencies", "Interpreting arterial gases.", [
      "Interpret an arterial blood gas for acid-base disorders",
      "Recognise and treat severe hyponatraemia and hyperkalaemia",
      "Describe the management of diabetic ketoacidosis in the emergency department",
    ]),
  ]),
  mod("trauma-and-surgical-emergencies", "Trauma and Surgical Emergencies", "Injury in the emergency department.", [
    unit("major-trauma", "Major Trauma and Head Injury", "Systematic trauma care.", [
      "Describe the immediate priorities in a major trauma patient",
      "Assess head injury with the Glasgow Coma Scale and decide on imaging",
      "Recognise cervical spine injury and principles of immobilisation",
    ]),
    unit("minor-injury-and-wounds", "Minor Injuries, Wounds and Analgesia", "Everyday emergency practice.", [
      "Assess and close wounds appropriately and consider tetanus prophylaxis",
      "Describe the stepwise use of analgesia in acute pain",
      "Identify features of injuries that need specialist referral",
    ]),
  ]),
  mod("critical-care", "Critical Care", "Organ support.", [
    unit("respiratory-and-circulatory-support", "Respiratory and Circulatory Support", "Ventilation and haemodynamic support.", [
      "Describe the indications for non-invasive and invasive ventilation",
      "Explain the basic principles of vasopressors and invasive monitoring",
      "Recognise acute respiratory distress syndrome",
    ]),
    unit("multi-organ-failure-and-ethics", "Multi-Organ Failure and Treatment Limitation", "Prognosis and values.", [
      "Describe how organ failure is scored and monitored in intensive care",
      "Explain the principles of withholding and withdrawing treatment",
      "Describe communication with families and the role of do-not-attempt-resuscitation decisions",
    ]),
  ]),
];

export const RADLAB: ModuleDraft[] = [
  mod("principles-of-imaging", "Principles of Medical Imaging", "How images are made and chosen.", [
    unit("modalities-and-safety", "Imaging Modalities and Radiation Safety", "Radiographs, CT, MRI and ultrasound.", [
      "Compare the physical basis and typical uses of radiography, CT, MRI and ultrasound",
      "Explain radiation dose, justification and contrast agent risks",
      "Select the most appropriate first imaging test for common clinical questions",
    ]),
    unit("systematic-image-interpretation", "Systematic Image Interpretation", "A reliable approach to reading images.", [
      "Apply a systematic approach to chest and abdominal radiographs",
      "Identify the common findings of pneumonia, heart failure and pneumothorax",
      "Describe how to present an image with its limits and uncertainty",
    ]),
  ]),
  mod("clinical-radiology", "Clinical Radiology by System", "Imaging in practice.", [
    unit("neuro-and-musculoskeletal-imaging", "Neurological and Musculoskeletal Imaging", "Head, spine and bones.", [
      "Recognise haemorrhage and infarct on a computed tomography head scan",
      "Describe the pattern of fractures and common bone pathology on radiographs",
      "Select imaging for suspected spinal cord compression",
    ]),
    unit("abdominal-and-interventional-imaging", "Abdominal Imaging and Interventional Radiology", "Gut, solid organs and procedures.", [
      "Choose between ultrasound and CT for abdominal pain",
      "Identify free gas and bowel obstruction on plain films",
      "Describe common image-guided procedures such as drainage and embolisation",
    ]),
  ]),
  mod("laboratory-medicine", "Laboratory Medicine", "Chemical pathology and haematology tests.", [
    unit("interpreting-biochemistry", "Interpreting Biochemistry", "Electrolytes, kidney, liver and cardiac markers.", [
      "Interpret urea and electrolytes, liver function tests and troponin in context",
      "Explain reference intervals, biological variation and test sensitivity",
      "Identify causes of spurious results and sample errors",
    ]),
    unit("haematology-and-transfusion", "Full Blood Count, Coagulation and Transfusion", "Blood tests and blood products.", [
      "Interpret a full blood count and common blood film abnormalities",
      "Describe blood group compatibility and the steps to prevent transfusion errors",
      "Recognise transfusion reactions and their management",
    ]),
  ]),
  mod("microbiology-and-histopathology-practice", "Microbiology and Histopathology in Practice", "Specimens and results.", [
    unit("microbiology-diagnostics", "Microbiology Diagnostics", "Collecting and reading cultures.", [
      "Describe correct sampling for blood, urine and wound cultures",
      "Interpret Gram stain and antibiotic susceptibility reports",
      "Explain the role of molecular and rapid tests in diagnosis",
    ]),
    unit("histopathology-and-cytology", "Histopathology and Cytology", "Tissue diagnosis.", [
      "Describe how a biopsy specimen is fixed, processed and reported",
      "Explain the role of frozen sections, cytology and immunohistochemistry",
      "Interpret the key elements of a cancer pathology report",
    ]),
  ]),
];

export const FCM: ModuleDraft[] = [
  mod("primary-care-consultation", "The Primary Care Consultation", "Undifferentiated illness in the community.", [
    unit("consultation-skills", "Consultation Skills and Undifferentiated Illness", "Time-limited, patient-centred care.", [
      "Structure a consultation to elicit ideas, concerns and expectations",
      "Manage uncertainty and use time and safety-netting as diagnostic tools",
      "Explain how the pre-test probability of disease differs in primary care and hospital",
    ]),
    unit("common-presentations", "Common Presentations in Primary Care", "Cough, fatigue, back pain and skin problems.", [
      "Approach a persistent cough, fatigue and back pain in primary care",
      "Identify the red flags that warrant urgent referral",
      "Decide when to treat, observe or refer",
    ]),
  ]),
  mod("chronic-disease-and-prevention", "Chronic Disease and Prevention", "Long-term care in the community.", [
    unit("chronic-disease-management", "Chronic Disease Management", "Diabetes, hypertension and asthma.", [
      "Describe structured review and self-management support for chronic disease",
      "Set individual treatment targets with the patient",
      "Explain the roles of the primary care team and medicines optimisation",
    ]),
    unit("screening-and-health-promotion", "Screening, Immunisation and Health Promotion", "Preventing disease.", [
      "Apply the criteria for an effective screening programme",
      "Counsel on smoking, alcohol, diet and physical activity",
      "Describe the stages of change and motivational interviewing",
    ]),
  ]),
  mod("community-and-global-health", "Community and Global Health Practice", "Populations and settings.", [
    unit("community-diagnosis", "Community Diagnosis and Health Programmes", "Understanding the local population.", [
      "Describe how to carry out a community health needs assessment",
      "Explain the organisation of primary health care and referral systems",
      "Identify social determinants that affect health in a community",
    ]),
    unit("occupational-and-environmental-health", "Occupational and Environmental Health", "Work and environment as causes of disease.", [
      "Take an occupational history",
      "Describe common occupational diseases and their prevention",
      "Explain the hierarchy of controls for workplace hazards",
    ]),
  ]),
  mod("family-and-special-groups", "Family-Centred and Special Population Care", "Care across the life course.", [
    unit("family-medicine-and-life-course", "Family Medicine and the Life Course", "Families, ageing and adolescence.", [
      "Use a family history and genogram in assessment",
      "Describe the care of adolescents and of older adults in the community",
      "Explain continuity of care and its effect on outcomes",
    ]),
    unit("health-equity-and-vulnerable-groups", "Health Equity and Vulnerable Groups", "Access and inequality.", [
      "Identify barriers to health care access for vulnerable populations",
      "Describe approaches to culturally sensitive communication including use of interpreters",
      "Explain how to advocate for patients within the health system",
    ]),
  ]),
];
