import type { ModuleDraft } from "../undergrad-course";
import { mod, unit } from "./mbbs-clinical-kit";

/** MBBS Year 4 module trees. Wording is original; principles are guideline-independent. */

export const IM1: ModuleDraft[] = [
  mod("ischaemic-heart-disease", "Ischaemic Heart Disease", "Stable angina and acute coronary syndromes.", [
    unit("stable-angina", "Stable Angina", "Presentation, risk assessment and long-term management.", [
      "Distinguish typical anginal pain from non-cardiac chest pain using the history",
      "Select non-invasive and invasive investigations to confirm coronary disease",
      "Outline anti-anginal, antiplatelet and risk-factor management principles",
    ]),
    unit("acute-coronary-syndromes", "Acute Coronary Syndromes", "Recognition and early treatment of unstable angina and myocardial infarction.", [
      "Differentiate STEMI, NSTEMI and unstable angina using ECG and troponin",
      "Describe the principles of early reperfusion and antithrombotic therapy",
      "Identify early complications of myocardial infarction and their management",
    ]),
  ]),
  mod("heart-failure-and-arrhythmia", "Heart Failure and Arrhythmia", "Failing pump and disordered rhythm.", [
    unit("heart-failure", "Heart Failure", "Syndrome, causes and treatment.", [
      "Classify heart failure by ejection fraction and describe typical symptoms and signs",
      "Interpret natriuretic peptide and echocardiography in suspected heart failure",
      "Explain the rationale for diuretics and neurohormonal blockers in chronic heart failure",
    ]),
    unit("atrial-fibrillation", "Atrial Fibrillation", "Rate, rhythm and stroke prevention.", [
      "Recognise atrial fibrillation on an ECG and list its common causes",
      "Compare rate control with rhythm control strategies",
      "Apply stroke-risk and bleeding-risk reasoning to the decision to anticoagulate",
    ]),
    unit("bradycardia-and-tachyarrhythmia", "Bradycardias and Tachyarrhythmias", "Emergency recognition and management.", [
      "Differentiate narrow-complex from broad-complex tachycardia on an ECG",
      "Describe the immediate management of the haemodynamically unstable tachycardia",
      "Identify the degrees of heart block and when pacing is indicated",
    ]),
  ]),
  mod("valvular-and-structural-heart-disease", "Valvular and Structural Heart Disease", "Valve lesions, endocarditis and cardiomyopathy.", [
    unit("valve-disease", "Valvular Heart Disease", "Stenotic and regurgitant lesions.", [
      "Describe the murmur and clinical features of aortic stenosis and mitral regurgitation",
      "Interpret echocardiographic findings that determine the severity of a valve lesion",
      "State the indications for valve intervention in terms of symptoms and ventricular function",
    ]),
    unit("endocarditis-and-cardiomyopathy", "Endocarditis and Cardiomyopathy", "Infective and myocardial disease.", [
      "Apply diagnostic criteria for infective endocarditis and choose blood culture strategy",
      "Describe the common types of cardiomyopathy and their presentations",
      "Explain the principles of antibiotic prophylaxis and its limited indications",
    ]),
  ]),
  mod("hypertension-and-vascular-disease", "Hypertension and Vascular Disease", "Blood pressure and the vascular tree.", [
    unit("hypertension", "Hypertension", "Diagnosis, secondary causes and treatment.", [
      "Confirm hypertension using clinic and out-of-office measurement",
      "Identify clues to secondary hypertension and target-organ damage",
      "Outline stepwise treatment using the main antihypertensive classes and their adverse effects",
    ]),
    unit("vascular-emergencies", "Peripheral and Aortic Vascular Disease", "Claudication, limb ischaemia, aneurysm and dissection.", [
      "Distinguish chronic claudication from acute limb ischaemia",
      "Describe the presentation and emergency approach to aortic dissection",
      "Explain the screening and surveillance principles for abdominal aortic aneurysm",
    ]),
  ]),
  mod("obstructive-and-airway-disease", "Asthma and Chronic Obstructive Pulmonary Disease", "Chronic airway disease.", [
    unit("asthma", "Asthma", "Diagnosis, severity and stepwise management.", [
      "Recognise variable airflow obstruction using history, peak flow and spirometry",
      "Describe stepwise preventer and reliever therapy and inhaler technique",
      "Grade acute asthma severity and outline its emergency treatment",
    ]),
    unit("copd", "Chronic Obstructive Pulmonary Disease", "Diagnosis, exacerbations and long-term care.", [
      "Confirm COPD with spirometry and distinguish it from asthma",
      "Explain the role of smoking cessation, bronchodilators and pulmonary rehabilitation",
      "Describe the management of an acute exacerbation including controlled oxygen therapy",
    ]),
  ]),
  mod("respiratory-infection-and-vascular", "Pneumonia, Thromboembolism and Respiratory Failure", "Acute respiratory presentations.", [
    unit("pneumonia", "Pneumonia and Pleural Disease", "Infection, effusion and pneumothorax.", [
      "Assess pneumonia severity and decide on the site of care",
      "Interpret chest radiography in consolidation, effusion and pneumothorax",
      "Outline the diagnostic and management approach to a pleural effusion",
    ]),
    unit("pulmonary-embolism", "Pulmonary Embolism and Respiratory Failure", "Diagnostic probability and gas exchange failure.", [
      "Use pre-test probability and D-dimer or imaging to evaluate suspected pulmonary embolism",
      "Distinguish type 1 from type 2 respiratory failure from blood gases",
      "Describe the principles of oxygen therapy and ventilatory support",
    ]),
    unit("lung-cancer-and-interstitial", "Lung Cancer and Interstitial Lung Disease", "Chronic and malignant lung disease.", [
      "Describe the presentation and staging approach for lung cancer",
      "Recognise the features of interstitial lung disease on examination and imaging",
      "Explain the role of tissue diagnosis and multidisciplinary review",
    ]),
  ]),
];

export const IM2: ModuleDraft[] = [
  mod("gastrointestinal-and-liver-disease", "Gastroenterology and Hepatology", "Gut, liver and pancreas.", [
    unit("upper-gi-disease", "Upper Gastrointestinal Disease", "Dyspepsia, ulcer and bleeding.", [
      "Identify alarm features that mandate endoscopy in dyspepsia",
      "Describe the causes of upper gastrointestinal bleeding and its resuscitation",
      "Explain Helicobacter pylori testing and eradication principles",
    ]),
    unit("inflammatory-bowel-disease", "Inflammatory Bowel Disease and Malabsorption", "Crohn disease, ulcerative colitis and coeliac disease.", [
      "Contrast the clinical and pathological features of Crohn disease and ulcerative colitis",
      "Choose investigations to diagnose coeliac disease and other malabsorption",
      "Outline the principles of induction and maintenance therapy in inflammatory bowel disease",
    ]),
    unit("liver-disease", "Liver Disease", "Hepatitis, cirrhosis and its complications.", [
      "Interpret a liver function pattern as hepatocellular or cholestatic",
      "Describe the complications of cirrhosis including ascites, varices and encephalopathy",
      "Outline the evaluation of jaundice and the main causes of acute liver injury",
    ]),
  ]),
  mod("renal-medicine", "Renal Medicine", "Kidney injury, chronic disease and glomerular disorders.", [
    unit("acute-kidney-injury", "Acute Kidney Injury", "Recognition, causes and management.", [
      "Classify acute kidney injury as prerenal, intrinsic or postrenal",
      "Interpret urea, creatinine, potassium and urinalysis in a patient with oliguria",
      "Outline the emergency treatment of hyperkalaemia and the indications for dialysis",
    ]),
    unit("chronic-kidney-and-glomerular-disease", "Chronic Kidney and Glomerular Disease", "Progression, nephritic and nephrotic syndromes.", [
      "Stage chronic kidney disease by filtration rate and albuminuria",
      "Distinguish nephritic from nephrotic syndrome by presentation and urine findings",
      "Describe the complications of advanced kidney disease and options for renal replacement",
    ]),
  ]),
  mod("endocrinology-and-diabetes", "Endocrinology and Diabetes", "Hormonal disease.", [
    unit("diabetes-mellitus", "Diabetes Mellitus", "Diagnosis, complications and acute emergencies.", [
      "Apply diagnostic criteria and distinguish type 1 from type 2 diabetes",
      "Describe the microvascular and macrovascular complications and their screening",
      "Outline the recognition and treatment of diabetic ketoacidosis and hypoglycaemia",
    ]),
    unit("thyroid-and-adrenal-disease", "Thyroid, Adrenal and Pituitary Disease", "Common hormonal excess and deficiency.", [
      "Interpret thyroid function tests in hyperthyroidism and hypothyroidism",
      "Compare the features and investigation of Cushing syndrome and adrenal insufficiency",
      "Describe the presentation of pituitary tumours by mass effect and hormone secretion",
    ]),
    unit("calcium-and-bone-disorders", "Calcium and Metabolic Bone Disorders", "Parathyroid disease and osteoporosis.", [
      "Evaluate hypercalcaemia by cause using parathyroid hormone",
      "Describe the diagnosis and fracture-risk approach to osteoporosis",
      "Outline the principles of treating hypocalcaemia and osteomalacia",
    ]),
  ]),
  mod("haematology", "Haematology", "Blood disorders.", [
    unit("anaemia", "Anaemia", "Classification and investigation.", [
      "Classify anaemia by red cell size and use the blood film and iron studies",
      "Describe the causes and treatment of iron, vitamin B12 and folate deficiency",
      "Recognise haemolysis and describe the haemoglobinopathies, including sickle cell disease",
    ]),
    unit("haematological-malignancy-and-coagulation", "Haematological Malignancy and Bleeding Disorders", "Leukaemia, lymphoma and coagulopathy.", [
      "Distinguish acute from chronic leukaemia by presentation and blood count",
      "Describe the presentation of lymphoma and the role of biopsy in staging",
      "Interpret a coagulation screen in haemophilia, liver disease and anticoagulant effect",
    ]),
  ]),
  mod("neurology", "Neurology", "Disorders of the nervous system.", [
    unit("stroke-and-cerebrovascular-disease", "Stroke and Transient Ischaemic Attack", "Rapid recognition and acute management.", [
      "Localise a stroke syndrome to a vascular territory from the examination",
      "Explain why imaging precedes thrombolysis or thrombectomy decisions",
      "Describe secondary prevention after ischaemic stroke",
    ]),
    unit("epilepsy-and-headache", "Epilepsy, Headache and Syncope", "Paroxysmal disorders.", [
      "Differentiate seizure from syncope using the history and witness account",
      "Describe the emergency management of status epilepticus",
      "Identify red-flag features in headache and distinguish migraine from other primary headaches",
    ]),
    unit("neurodegenerative-and-neuromuscular", "Neurodegenerative and Neuromuscular Disease", "Parkinson disease, dementia, multiple sclerosis and neuropathy.", [
      "Describe the clinical features and treatment principles of Parkinson disease",
      "Compare the common causes of dementia and delirium",
      "Recognise Guillain-Barre syndrome, multiple sclerosis and myasthenia gravis by their patterns",
    ]),
  ]),
];

export const SURG1: ModuleDraft[] = [
  mod("surgical-assessment-and-perioperative-care", "Surgical Assessment and Perioperative Care", "Getting a patient safely to and through an operation.", [
    unit("preoperative-assessment", "Preoperative Assessment", "Risk, consent and preparation.", [
      "Identify patient and procedure factors that raise perioperative risk",
      "Explain the elements of valid informed consent for surgery",
      "Describe the preparation of patients on anticoagulants, antidiabetics and steroids",
    ]),
    unit("postoperative-care", "Postoperative Care and Complications", "Monitoring, fluids, pain and complications.", [
      "Prescribe maintenance fluids and analgesia for a postoperative patient",
      "Differentiate causes of postoperative fever by timing",
      "Recognise anastomotic leak, wound infection and venous thromboembolism",
    ]),
  ]),
  mod("acute-abdomen", "The Acute Abdomen", "Emergency abdominal surgery.", [
    unit("acute-abdominal-pain", "Acute Abdominal Pain", "Appendicitis, cholecystitis and perforation.", [
      "Take a pain history that localises the likely source of an acute abdomen",
      "Select blood tests and imaging for suspected appendicitis, cholecystitis and perforation",
      "Describe the immediate resuscitation and surgical decision-making for peritonitis",
    ]),
    unit("bowel-obstruction", "Intestinal Obstruction and Hernia", "Mechanical obstruction and abdominal wall defects.", [
      "Distinguish small-bowel from large-bowel obstruction clinically and radiologically",
      "Describe the complications of strangulated hernia and the urgency of repair",
      "Outline conservative and operative management of bowel obstruction",
    ]),
    unit("pancreatitis-and-biliary-disease", "Pancreatitis and Biliary Disease", "Gallstones and pancreatic inflammation.", [
      "Diagnose acute pancreatitis using symptoms and amylase or lipase",
      "Describe the investigation and management of obstructive jaundice and cholangitis",
      "Explain the severity assessment and supportive care of acute pancreatitis",
    ]),
  ]),
  mod("surgical-oncology-and-gi-surgery", "Surgical Oncology and Gastrointestinal Surgery", "Elective abdominal and endocrine surgery.", [
    unit("colorectal-and-upper-gi-cancer", "Colorectal and Upper Gastrointestinal Cancer", "Presentation, staging and treatment.", [
      "Describe the presentation of colorectal cancer and the role of colonoscopy",
      "Explain TNM staging and the role of the multidisciplinary team",
      "Outline the principles of curative resection and adjuvant therapy",
    ]),
    unit("breast-and-endocrine-surgery", "Breast, Thyroid and Endocrine Surgery", "Lumps and the triple assessment.", [
      "Apply triple assessment to a breast lump",
      "Evaluate a thyroid nodule using ultrasound and cytology",
      "Describe the indications for surgery in hyperthyroidism and hyperparathyroidism",
    ]),
  ]),
  mod("trauma-and-vascular-surgery", "Trauma, Burns and Vascular Surgery", "Injury and ischaemia.", [
    unit("trauma-primary-survey", "Trauma and the Primary Survey", "Systematic resuscitation of the injured patient.", [
      "Apply the airway, breathing, circulation, disability and exposure approach to a trauma patient",
      "Recognise tension pneumothorax, massive haemothorax and cardiac tamponade",
      "Explain the principles of haemorrhage control and fluid resuscitation in trauma",
    ]),
    unit("burns-and-wounds", "Burns, Wounds and Surgical Infection", "Assessment and care of skin injury.", [
      "Estimate burn depth and surface area and plan initial fluid care",
      "Describe wound healing and the factors that impair it",
      "Explain the principles of surgical site infection prevention and necrotising infection recognition",
    ]),
  ]),
];

export const OBG1: ModuleDraft[] = [
  mod("antenatal-care", "Antenatal Care", "Normal pregnancy and its surveillance.", [
    unit("physiology-of-pregnancy", "Physiology of Pregnancy and Booking", "Maternal adaptation and first visit.", [
      "Describe the cardiovascular, haematological and renal adaptations of pregnancy",
      "Take an obstetric history and calculate gestational age and expected date of delivery",
      "List the routine investigations and screening offered at the booking visit",
    ]),
    unit("fetal-assessment", "Fetal Assessment and Screening", "Growth, wellbeing and anomaly detection.", [
      "Measure fundal height and interpret fetal growth on ultrasound",
      "Explain the principles and limits of screening for chromosomal and structural anomalies",
      "Describe the indications for and interpretation of cardiotocography",
    ]),
  ]),
  mod("medical-disorders-in-pregnancy", "Medical Disorders in Pregnancy", "Hypertension, diabetes and bleeding.", [
    unit("hypertensive-disorders", "Hypertensive Disorders of Pregnancy", "Pre-eclampsia and eclampsia.", [
      "Classify hypertension in pregnancy and diagnose pre-eclampsia",
      "Describe the complications of severe pre-eclampsia and the role of magnesium sulphate",
      "Explain the timing of delivery and postnatal follow-up",
    ]),
    unit("diabetes-and-anaemia-in-pregnancy", "Diabetes, Anaemia and Infection in Pregnancy", "Common medical complications.", [
      "Screen for and manage gestational diabetes",
      "Evaluate and treat anaemia in pregnancy",
      "Outline the risks of malaria and urinary infection in pregnancy and their prevention",
    ]),
    unit("antepartum-haemorrhage", "Early Pregnancy Loss and Antepartum Haemorrhage", "Bleeding in pregnancy.", [
      "Differentiate miscarriage types and ectopic pregnancy by presentation and ultrasound",
      "Distinguish placenta praevia from placental abruption",
      "Describe the resuscitation of a woman with major obstetric haemorrhage",
    ]),
  ]),
  mod("labour-and-delivery", "Labour and Delivery", "Normal and abnormal birth.", [
    unit("normal-labour", "Normal Labour", "Stages, mechanism and pain relief.", [
      "Describe the stages of labour and the cardinal movements of delivery",
      "Use the partogram to monitor the progress of labour",
      "Compare the options for analgesia in labour",
    ]),
    unit("complicated-labour", "Abnormal Labour and Operative Delivery", "Dystocia, malpresentation and caesarean section.", [
      "Identify causes of failure to progress and when to intervene",
      "Describe the indications for instrumental delivery and caesarean section",
      "Outline the management of shoulder dystocia and cord prolapse",
    ]),
  ]),
  mod("postpartum-care", "The Puerperium and Postpartum Complications", "After delivery.", [
    unit("postpartum-haemorrhage", "Postpartum Haemorrhage", "Causes and stepwise management.", [
      "List the four causes of postpartum haemorrhage as tone, tissue, trauma and thrombin",
      "Describe the stepwise medical, mechanical and surgical management",
      "Identify risk factors and measures that reduce the risk",
    ]),
    unit("puerperal-care", "Puerperal Sepsis, Lactation and Contraception", "Recovery and counselling.", [
      "Recognise and treat puerperal sepsis",
      "Explain the physiology and benefits of breastfeeding",
      "Counsel on postpartum contraceptive options",
    ]),
  ]),
];

export const PAED1: ModuleDraft[] = [
  mod("neonatology", "The Newborn", "Birth and the first weeks of life.", [
    unit("newborn-examination", "Newborn Assessment and Resuscitation", "Adaptation, examination and Apgar.", [
      "Describe the physiological transition at birth and the steps of newborn resuscitation",
      "Perform and interpret the routine newborn examination",
      "Identify the features of a preterm and a small-for-gestational-age infant",
    ]),
    unit("neonatal-problems", "Neonatal Jaundice, Infection and Respiratory Distress", "Common problems of the first week.", [
      "Differentiate physiological from pathological neonatal jaundice",
      "Recognise neonatal sepsis and describe its initial management",
      "Compare the causes of neonatal respiratory distress",
    ]),
  ]),
  mod("growth-and-development", "Growth, Development and Nutrition", "Healthy childhood.", [
    unit("growth-and-milestones", "Growth and Developmental Milestones", "Assessment on charts and across domains.", [
      "Plot growth on a centile chart and recognise faltering growth",
      "Recall milestones in motor, language, social and fine motor domains",
      "Identify red flags that prompt developmental referral",
    ]),
    unit("nutrition-and-immunisation", "Nutrition and Immunisation", "Feeding and prevention.", [
      "Describe infant feeding and complementary feeding principles",
      "Classify and treat severe acute malnutrition in outline",
      "Explain the principles of immunisation schedules and contraindications",
    ]),
  ]),
  mod("acute-childhood-illness", "Acute Childhood Illness", "The sick child.", [
    unit("fever-and-respiratory-infection", "Fever, Bronchiolitis, Croup and Pneumonia", "Common respiratory and febrile illness.", [
      "Assess a febrile child using a traffic-light approach to serious illness",
      "Differentiate bronchiolitis, croup and pneumonia by presentation",
      "Describe supportive care and the indications for admission",
    ]),
    unit("gastroenteritis-and-dehydration", "Gastroenteritis and Dehydration", "Assessment and rehydration.", [
      "Assess the degree of dehydration in a child",
      "Describe oral and intravenous rehydration principles",
      "Recognise meningitis and urinary tract infection as causes of fever in children",
    ]),
    unit("paediatric-emergencies", "Paediatric Emergencies", "Anaphylaxis, seizures and diabetic ketoacidosis.", [
      "Apply an airway, breathing and circulation approach to the collapsed child",
      "Describe the management of febrile and prolonged seizures",
      "Recognise and treat anaphylaxis and diabetic ketoacidosis in children",
    ]),
  ]),
  mod("child-health-and-safeguarding", "Chronic Disease and Child Protection", "Long-term conditions and welfare.", [
    unit("chronic-childhood-conditions", "Asthma, Epilepsy and Congenital Heart Disease", "Long-term conditions.", [
      "Describe childhood asthma diagnosis and control",
      "Classify childhood epilepsy and explain treatment principles",
      "Distinguish cyanotic from acyanotic congenital heart disease by presentation",
    ]),
    unit("child-protection", "Safeguarding and Child Abuse", "Recognising and responding to harm.", [
      "Identify injuries and histories that raise concern for non-accidental injury",
      "Describe the duty to share concerns and the child protection pathway",
      "Explain how to document and communicate with a family when abuse is suspected",
    ]),
  ]),
];

export const PSYCH: ModuleDraft[] = [
  mod("psychiatric-assessment", "Psychiatric Assessment", "History, mental state and risk.", [
    unit("mental-state-examination", "History and Mental State Examination", "Structured psychiatric interview.", [
      "Take a psychiatric history including past, family, substance and social history",
      "Describe the components of a mental state examination",
      "Differentiate delusions, hallucinations and thought disorder",
    ]),
    unit("risk-assessment", "Risk Assessment and Self-Harm", "Suicide and violence.", [
      "Assess risk factors and protective factors for suicide",
      "Describe the immediate management of a patient after self-harm",
      "Explain the principles of mental health legislation, capacity and compulsory treatment",
    ]),
  ]),
  mod("mood-and-anxiety-disorders", "Mood and Anxiety Disorders", "Common mental disorders.", [
    unit("depression-and-bipolar", "Depression and Bipolar Disorder", "Diagnosis and treatment.", [
      "Apply diagnostic criteria for a depressive episode and for mania",
      "Describe the principles of antidepressant, mood-stabiliser and psychological treatment",
      "Recognise treatment-resistant depression and indications for electroconvulsive therapy",
    ]),
    unit("anxiety-and-trauma", "Anxiety, Obsessive and Trauma-Related Disorders", "Fear, compulsion and post-traumatic stress.", [
      "Differentiate generalised anxiety, panic and phobic disorders",
      "Describe the features of obsessive-compulsive and post-traumatic stress disorder",
      "Outline first-line psychological and pharmacological treatments",
    ]),
  ]),
  mod("psychotic-and-organic-disorders", "Psychotic and Organic Disorders", "Schizophrenia, delirium and dementia.", [
    unit("schizophrenia", "Schizophrenia and Related Psychoses", "Presentation, course and treatment.", [
      "Describe positive, negative and cognitive symptoms of schizophrenia",
      "Explain the role of antipsychotics and the monitoring of their adverse effects",
      "Outline relapse prevention and psychosocial rehabilitation",
    ]),
    unit("delirium-and-dementia", "Delirium and Dementia", "Acute and chronic cognitive impairment.", [
      "Distinguish delirium from dementia and depression in an older patient",
      "Investigate and treat the reversible causes of delirium",
      "Describe the assessment and support of a person with dementia",
    ]),
  ]),
  mod("substance-use-and-special-populations", "Substance Use and Special Populations", "Addiction, children and perinatal mental health.", [
    unit("substance-use-disorders", "Alcohol and Substance Use Disorders", "Intoxication, withdrawal and treatment.", [
      "Recognise alcohol withdrawal and describe its management including thiamine",
      "Describe brief intervention and the principles of treating dependence",
      "Identify the features of intoxication and withdrawal with opioids and stimulants",
    ]),
    unit("child-and-perinatal-psychiatry", "Child, Perinatal and Eating Disorders", "Disorders across the life course.", [
      "Describe the features of attention deficit hyperactivity disorder and autism",
      "Recognise perinatal depression and puerperal psychosis",
      "Describe the assessment and medical risks of anorexia nervosa",
    ]),
  ]),
];
