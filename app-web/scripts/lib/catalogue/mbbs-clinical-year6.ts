import type { ModuleDraft } from "../undergrad-course";
import { mod, unit } from "./mbbs-clinical-kit";

/** MBBS Year 6 module trees. Wording is original; principles are guideline-independent. */

export const CLERK: ModuleDraft[] = [
  mod("integrated-medical-clerkship", "Integrated Medical Clerkship", "Managing medical inpatients.", [
    unit("admission-and-problem-list", "Admission, Problem List and Plan", "Taking ownership of a patient's care.", [
      "Construct a problem list and differential diagnosis from a full admission assessment",
      "Write an investigation and management plan with clear priorities",
      "Present a patient concisely to a senior clinician",
    ]),
    unit("ward-round-and-discharge", "Ward Rounds, Review and Discharge Planning", "Continuity and safe transitions.", [
      "Review a patient's progress using trends in observations and results",
      "Identify patients at risk of deterioration and escalate appropriately",
      "Prepare a safe discharge summary with follow-up and medication changes",
    ]),
  ]),
  mod("integrated-surgical-clerkship", "Integrated Surgical Clerkship", "Managing surgical inpatients.", [
    unit("surgical-admission-and-theatre", "Surgical Admissions and the Operating Theatre", "Pre-, intra- and postoperative roles.", [
      "Assess a surgical admission and decide between operative and conservative care",
      "Describe the sterile technique and the surgical safety checklist",
      "Explain the student's role in theatre and in obtaining consent with supervision",
    ]),
    unit("surgical-ward-problems", "Common Surgical Ward Problems", "Postoperative complications and fluid balance.", [
      "Manage postoperative pain, nausea, ileus and urine output problems",
      "Assess a patient with abdominal distension after surgery",
      "Recognise and escalate wound, anastomotic and thromboembolic complications",
    ]),
  ]),
  mod("clinical-reasoning-integration", "Integrated Clinical Reasoning", "Across specialties.", [
    unit("complex-case-reasoning", "Reasoning in Complex Cases", "Multisystem presentations.", [
      "Synthesise findings from several systems into a unifying diagnosis",
      "Apply Bayesian reasoning to interpret test results",
      "Recognise and reduce cognitive bias in diagnosis",
    ]),
    unit("multidisciplinary-care", "Multidisciplinary Working and Communication", "Teams and handover.", [
      "Describe the roles of the multidisciplinary team in a complex discharge",
      "Communicate handover using a structured format",
      "Explain how to challenge a decision safely and respectfully",
    ]),
  ]),
  mod("clinical-procedures-and-assessment", "Procedures and Final Clinical Assessment", "Practical competence.", [
    unit("practical-procedures", "Core Practical Procedures", "Safe performance with consent.", [
      "Describe the indications, consent, steps and complications of venepuncture and cannulation",
      "Describe the technique and safety of catheterisation and arterial blood gas sampling",
      "Explain how to document procedures and manage sharps injury",
    ]),
    unit("structured-clinical-examination", "Structured Clinical Examination Skills", "Assessed performance.", [
      "Take a focused history and examine a station-based case within a time limit",
      "Interpret common results and explain the findings to a patient",
      "Reflect on feedback to guide further learning",
    ]),
  ]),
];

export const THERAP: ModuleDraft[] = [
  mod("prescribing-principles", "Principles of Safe Prescribing", "The prescribing process.", [
    unit("prescribing-process", "The Prescribing Process and Medicines Reconciliation", "From decision to administration.", [
      "Describe the steps of safe prescribing from indication to review",
      "Perform medicines reconciliation at admission and discharge",
      "Write a legal, complete and unambiguous prescription",
    ]),
    unit("patient-factors-in-prescribing", "Patient Factors in Prescribing", "Kidney, liver, age and pregnancy.", [
      "Adjust prescribing for kidney and liver impairment using general principles",
      "Identify drugs to avoid or use with caution in pregnancy, breastfeeding and old age",
      "Explain how weight and age affect dosing, particularly in children",
    ]),
  ]),
  mod("adverse-effects-and-interactions", "Adverse Drug Events and Interactions", "Harm from medicines.", [
    unit("adverse-drug-reactions", "Adverse Drug Reactions and Allergy", "Classification and reporting.", [
      "Classify adverse reactions as predictable or idiosyncratic",
      "Evaluate a reported drug allergy and cross-reactivity",
      "Describe how to report suspected adverse reactions",
    ]),
    unit("drug-interactions", "Drug Interactions and High-Risk Medicines", "Pharmacokinetic and pharmacodynamic.", [
      "Predict interactions from enzyme induction, inhibition and additive effects",
      "Identify medicines with a narrow therapeutic index",
      "Describe monitoring requirements for anticoagulants, insulin, opioids and nephrotoxic drugs",
    ]),
  ]),
  mod("prescribing-in-practice", "Prescribing in Common Scenarios", "Clinical decisions.", [
    unit("fluids-and-analgesia", "Intravenous Fluids and Analgesia", "Fluid and pain prescribing.", [
      "Choose fluid type and rate for resuscitation, replacement and maintenance",
      "Apply a stepwise analgesic approach and minimise opioid harm",
      "Monitor and reassess treatment response",
    ]),
    unit("antimicrobial-stewardship", "Antimicrobial Prescribing and Stewardship", "Using antibiotics responsibly.", [
      "Choose empirical therapy using likely pathogens and local resistance patterns",
      "Apply review at 48 to 72 hours and intravenous-to-oral switch",
      "Explain the drivers of antimicrobial resistance",
    ]),
    unit("overdose-and-poisoning", "Toxicology and Overdose Management", "Antidotes and supportive care.", [
      "Assess the toxic risk after an overdose",
      "Select antidotes for common poisonings",
      "Explain when to seek poison information services and psychiatric assessment",
    ]),
  ]),
  mod("medication-safety-systems", "Medication Safety and Evidence", "System-level safety.", [
    unit("error-and-human-factors", "Medication Errors and Human Factors", "Preventing harm.", [
      "Classify medication errors by stage and describe common contributing factors",
      "Apply the learning-from-error approach without blame",
      "Describe barriers such as checklists, electronic prescribing and double checks",
    ]),
    unit("deprescribing-and-adherence", "Deprescribing and Adherence", "Rationalising therapy.", [
      "Identify potentially inappropriate medicines in older adults",
      "Explain the principles of deprescribing",
      "Discuss the causes of non-adherence and strategies for improvement",
    ]),
  ]),
];

export const ANAES: ModuleDraft[] = [
  mod("anaesthetic-assessment", "Preoperative Assessment and Anaesthetic Planning", "Preparing for anaesthesia.", [
    unit("preoperative-risk", "Preoperative Risk Assessment", "Function, comorbidity and fasting.", [
      "Assess airway, cardiorespiratory fitness and comorbidity before anaesthesia",
      "Use a risk classification such as the American Society of Anesthesiologists grade",
      "Explain fasting rules and medication management before surgery",
    ]),
    unit("anaesthetic-techniques", "General, Regional and Local Anaesthesia", "Choosing a technique.", [
      "Describe the stages of general anaesthesia and the main drug groups",
      "Compare regional and neuraxial techniques with general anaesthesia",
      "Describe the safe maximum dosing principle and toxicity of local anaesthetics",
    ]),
  ]),
  mod("airway-and-perioperative-safety", "Airway Management and Perioperative Safety", "Keeping the patient safe.", [
    unit("airway-management", "Airway Management", "Maintenance and rescue.", [
      "Describe simple airway manoeuvres and adjuncts",
      "Explain the principles of intubation and the difficult airway plan",
      "Recognise failed airway and the need to call for help early",
    ]),
    unit("perioperative-emergencies", "Perioperative Complications", "Anaphylaxis, hypotension and malignant hyperthermia.", [
      "Recognise and treat perioperative anaphylaxis and aspiration",
      "Describe the causes of intraoperative hypotension",
      "Explain the monitoring standards for anaesthesia and recovery",
    ]),
  ]),
  mod("acute-pain-medicine", "Acute Pain Management", "Relieving postoperative pain.", [
    unit("analgesic-pharmacology", "Analgesic Pharmacology", "Opioids, non-steroidal drugs and adjuncts.", [
      "Compare opioid, paracetamol and non-steroidal analgesic mechanisms and risks",
      "Describe multimodal analgesia and opioid-sparing approaches",
      "Recognise and manage opioid-induced respiratory depression",
    ]),
    unit("regional-analgesia-and-pca", "Regional Analgesia and Patient-Controlled Analgesia", "Delivery methods.", [
      "Describe epidural and nerve block analgesia and their complications",
      "Explain how patient-controlled analgesia is set up and monitored",
      "Assess pain with scores and reassess after intervention",
    ]),
  ]),
  mod("chronic-pain-medicine", "Chronic Pain", "Persistent pain.", [
    unit("mechanisms-of-chronic-pain", "Mechanisms and Assessment of Chronic Pain", "Biopsychosocial approach.", [
      "Differentiate nociceptive, neuropathic and nociplastic pain",
      "Take a biopsychosocial pain history and identify yellow flags",
      "Explain why chronic pain responds poorly to opioids",
    ]),
    unit("managing-chronic-pain", "Managing Chronic Pain", "Treatments and rehabilitation.", [
      "Outline the pharmacological options for neuropathic pain",
      "Describe the role of physical, psychological and interventional treatment",
      "Set realistic goals and manage expectations with patients",
    ]),
  ]),
];

export const GERI: ModuleDraft[] = [
  mod("geriatric-assessment", "Comprehensive Geriatric Assessment", "Older adults.", [
    unit("ageing-and-frailty", "Ageing and Frailty", "Physiology, reserve and risk.", [
      "Describe physiological changes of ageing and reduced homeostatic reserve",
      "Assess frailty with a validated tool",
      "Explain how atypical presentations occur in older patients",
    ]),
    unit("geriatric-syndromes", "Falls, Delirium, Incontinence and Immobility", "Common geriatric syndromes.", [
      "Assess a patient who has fallen and identify modifiable factors",
      "Evaluate causes of urinary incontinence",
      "Describe pressure ulcer prevention and the harms of immobility",
    ]),
  ]),
  mod("polypharmacy-and-function", "Medicines, Function and Rehabilitation", "Maintaining independence.", [
    unit("polypharmacy-in-older-adults", "Polypharmacy and Prescribing in Older Adults", "Balancing benefit and harm.", [
      "Identify anticholinergic burden and high-risk medicines in older adults",
      "Conduct a structured medication review",
      "Explain the principles of shared decision-making in older adults",
    ]),
    unit("rehabilitation-and-social-care", "Rehabilitation, Care Settings and Social Care", "Support after illness.", [
      "Describe the multidisciplinary approach to rehabilitation",
      "Compare home, intermediate and residential care options",
      "Recognise elder abuse and describe the response",
    ]),
  ]),
  mod("palliative-care-principles", "Palliative Care", "Care of life-limiting illness.", [
    unit("symptom-control", "Symptom Control in Advanced Illness", "Pain, breathlessness and nausea.", [
      "Apply the principles of analgesic titration for cancer pain",
      "Manage breathlessness, nausea, constipation and agitation in advanced illness",
      "Recognise and treat common palliative emergencies",
    ]),
    unit("end-of-life-care", "End-of-Life Care and Communication", "The last days of life.", [
      "Recognise the dying patient and review treatments accordingly",
      "Describe the elements of advance care planning",
      "Explain how to break bad news and support grieving families",
    ]),
  ]),
  mod("ethics-of-late-life", "Capacity, Consent and Ethical Issues in Older Adults", "Decisions at the end of life.", [
    unit("capacity-and-decision-making", "Capacity and Best Interests", "Supporting decisions.", [
      "Assess decision-specific mental capacity using standard criteria",
      "Describe how to act in the best interests of a patient lacking capacity",
      "Explain the role of advance statements and proxy decision makers",
    ]),
    unit("end-of-life-ethics", "Ethical Issues at the End of Life", "Treatment limits and assisted dying debates.", [
      "Distinguish withholding or withdrawing treatment from euthanasia",
      "Apply the doctrine of double effect in symptom control",
      "Describe how local law and professional guidance shape practice",
    ]),
  ]),
];

export const FORENSIC: ModuleDraft[] = [
  mod("forensic-pathology", "Forensic Pathology and Death", "Dying and the dead.", [
    unit("death-certification", "Death, Certification and Postmortem", "Diagnosis and legal process.", [
      "Describe the criteria for confirming death, including brainstem death",
      "Explain the purpose and legal framework of death certification and coroner or medical examiner referral",
      "Distinguish hospital from medicolegal autopsy",
    ]),
    unit("postmortem-changes-and-injury", "Postmortem Changes and Pattern of Injury", "Time since death and injury types.", [
      "Describe the postmortem changes used to estimate time since death and their limits",
      "Classify wounds as abrasion, contusion, laceration, incised, stab and firearm injuries",
      "Differentiate features of asphyxia, hanging and drowning",
    ]),
  ]),
  mod("clinical-forensic-medicine", "Clinical Forensic Medicine and Toxicology", "Examining the living.", [
    unit("injury-documentation", "Documentation of Injury and Assault", "Medicolegal records.", [
      "Document injuries accurately with measurements, description and body diagrams",
      "Preserve evidence and maintain the chain of custody",
      "Describe the care of a patient after sexual assault including consent and confidentiality",
    ]),
    unit("forensic-toxicology", "Forensic Toxicology and Substance Misuse", "Poisons and intoxication.", [
      "Describe sampling and interpretation of toxicology specimens",
      "Recognise the clinical and legal issues of alcohol and drug intoxication",
      "Explain fitness to be interviewed or detained",
    ]),
  ]),
  mod("medical-law", "Medical Law and Professional Regulation", "The legal framework of practice.", [
    unit("consent-and-confidentiality", "Consent, Confidentiality and Records", "Duties to the patient.", [
      "State the legal requirements for valid consent",
      "Describe when confidentiality may be lawfully breached",
      "Explain legal requirements for record keeping and access",
    ]),
    unit("negligence-and-regulation", "Negligence, Complaints and Professional Regulation", "Accountability.", [
      "Describe the elements of clinical negligence: duty, breach, causation and harm",
      "Outline the processes for complaints and fitness-to-practise concerns",
      "Explain the professional duty of candour",
    ]),
  ]),
  mod("medical-ethics-practice", "Ethics in Medical Practice", "Applying ethics.", [
    unit("ethical-frameworks", "Ethical Frameworks and Difficult Cases", "Principlism applied.", [
      "Apply autonomy, beneficence, non-maleficence and justice to a case",
      "Resolve conflicts between patient wishes and clinician judgement",
      "Discuss resource allocation and conflicts of interest",
    ]),
    unit("research-and-reproductive-ethics", "Research Ethics and Reproductive Ethics", "Special areas.", [
      "Describe the requirements of ethical review and informed consent in research",
      "Discuss ethical issues in pregnancy termination and assisted reproduction",
      "Explain the ethics of organ donation and transplantation",
    ]),
  ]),
];

export const EBP: ModuleDraft[] = [
  mod("asking-and-finding-evidence", "Asking Questions and Finding Evidence", "From clinical problem to literature.", [
    unit("formulating-questions", "Formulating Answerable Questions", "PICO and search strategies.", [
      "Frame a clinical question in terms of population, intervention, comparison and outcome",
      "Construct a search strategy using databases and controlled vocabulary",
      "Identify the best study design for therapy, diagnosis, prognosis and harm questions",
    ]),
    unit("hierarchy-of-evidence", "Hierarchy of Evidence and Sources", "Appraising where evidence comes from.", [
      "Rank study designs by susceptibility to bias",
      "Distinguish primary studies, systematic reviews and guidelines",
      "Explain the risk of publication bias and predatory journals",
    ]),
  ]),
  mod("critical-appraisal", "Critical Appraisal", "Judging trials and reviews.", [
    unit("appraising-trials", "Appraising Randomised Trials", "Validity, results and relevance.", [
      "Assess randomisation, allocation concealment, blinding and follow-up",
      "Interpret relative risk, absolute risk reduction and number needed to treat",
      "Explain intention-to-treat analysis and confidence intervals",
    ]),
    unit("appraising-reviews-and-diagnostics", "Appraising Systematic Reviews and Diagnostic Studies", "Pooled and accuracy evidence.", [
      "Read a forest plot and judge heterogeneity",
      "Interpret sensitivity, specificity and likelihood ratios",
      "Identify spectrum bias and verification bias",
    ]),
  ]),
  mod("research-project-methods", "Research Project Methods", "Doing a project.", [
    unit("designing-a-project", "Designing a Research Project", "Question, design and ethics.", [
      "Select a study design appropriate to the question",
      "Estimate sample size requirements in principle and avoid underpowered studies",
      "Describe ethical approval, consent and data protection requirements",
    ]),
    unit("analysis-and-reporting", "Analysis, Reporting and Authorship", "Statistical choices and honesty.", [
      "Choose basic statistical tests for categorical and continuous outcomes",
      "Follow a reporting guideline appropriate to the design",
      "Describe authorship criteria and research misconduct",
    ]),
  ]),
  mod("applying-evidence", "Applying Evidence in Practice", "Guidelines and quality improvement.", [
    unit("guidelines-and-shared-decisions", "Guidelines and Shared Decision Making", "Evidence to the individual.", [
      "Appraise a clinical guideline for rigour and applicability",
      "Communicate risk and uncertainty to patients",
      "Adapt evidence to patients excluded from trials",
    ]),
    unit("quality-improvement", "Audit and Quality Improvement", "Closing the loop.", [
      "Distinguish audit from research and service evaluation",
      "Describe a plan-do-study-act improvement cycle",
      "Present findings in a poster or oral summary",
    ]),
  ]),
];

export const TRANS: ModuleDraft[] = [
  mod("first-days-as-a-doctor", "The First Days as a Doctor", "Starting work.", [
    unit("on-call-and-prioritisation", "On-Call Work and Prioritisation", "Managing a task list.", [
      "Prioritise concurrent tasks using urgency and risk",
      "Describe when and how to call for senior help",
      "Document and hand over tasks to the next team",
    ]),
    unit("common-ward-calls", "Common Out-of-Hours Calls", "Typical problems.", [
      "Respond to the patient with chest pain, breathlessness or low urine output on the ward",
      "Assess an abnormal early warning score and escalate",
      "Manage a confused or agitated patient safely",
    ]),
  ]),
  mod("deteriorating-patient", "Recognising and Managing the Deteriorating Patient", "Escalation.", [
    unit("recognition-and-response", "Recognition and Response", "Vital signs and escalation.", [
      "Interpret a set of vital signs and a track-and-trigger score",
      "Use a structured communication tool such as situation, background, assessment and recommendation",
      "Initiate first-line treatment while awaiting help",
    ]),
    unit("resuscitation-decisions", "Resuscitation and Treatment Escalation Decisions", "Conversations and plans.", [
      "Describe the elements of a treatment escalation plan",
      "Communicate with relatives of a critically ill patient",
      "Document decisions clearly and legally",
    ]),
  ]),
  mod("professionalism-and-safety", "Professionalism and Patient Safety", "Being a safe, ethical junior doctor.", [
    unit("working-within-limits", "Working Within Limits and Raising Concerns", "Speaking up.", [
      "Recognise personal competence limits and seek help",
      "Describe the process for raising a patient safety concern",
      "Explain the importance of incident reporting and learning culture",
    ]),
    unit("communication-and-teamwork", "Communication, Teamwork and Teaching", "Working with others.", [
      "Communicate effectively with patients, relatives and colleagues",
      "Describe the roles of the multidisciplinary team and referral etiquette",
      "Apply teaching and feedback skills to junior colleagues",
    ]),
  ]),
  mod("career-and-wellbeing", "Career Planning, Wellbeing and Lifelong Learning", "Sustaining a career.", [
    unit("wellbeing-and-resilience", "Wellbeing, Fatigue and Burnout", "Looking after yourself.", [
      "Recognise burnout and the effect of fatigue on performance",
      "Describe sources of support and when to seek help",
      "Explain professional responsibility for personal health",
    ]),
    unit("lifelong-learning", "Portfolios, Reflection and Career Planning", "Continuing development.", [
      "Keep a reflective portfolio with learning points",
      "Describe the stages of postgraduate training and licensing in outline",
      "Develop a personal development plan and identify mentors",
    ]),
  ]),
];
