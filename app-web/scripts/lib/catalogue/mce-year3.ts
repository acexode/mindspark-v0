import type { Provenance } from "../../../lib/content/schema";
import type { CourseSpec, ModuleDraft } from "../undergrad-course";
import type { SubtopicDraft } from "../topic-builder";

/**
 * BEng Mechanical Engineering, Year 3 — controls, vibrations, thermofluid
 * applications, machine design and the design project, manufacturing systems,
 * FEA, failure analysis, mechatronics, advanced heat transfer, and professional
 * practice. Topic lists are original syntheses of published programme
 * structures (see docs/research/mechanical-curriculum.md).
 *
 * Reused repo subjects (mathematics, statics, fluid mechanics 1, materials
 * basics) are deliberately not repeated here.
 */
const PROGRAMME = "beng-mechanical-engineering";

const MCE_PALETTE = ["#c2570c", "#5b7083", "#1f7a7a", "#a8480f", "#3f5f73", "#2a8c82"];
const color = (index: number): string => MCE_PALETTE[index % MCE_PALETTE.length]!;

/** CourseSpec plus the provenance block the catalogue should attach. */
type MceCourse = CourseSpec & { provenance: Provenance };

const SOURCE_POOL = {
  imperial: {
    id: "imperial-mechanical-engineering",
    title: "Imperial College London, Mechanical Engineering programme",
    type: "institution" as const,
    url: "https://www.imperial.ac.uk/study/courses/undergraduate/mechanical-engineering/",
  },
  mit: {
    id: "mit-course-2",
    title: "MIT Course 2, Mechanical Engineering",
    type: "institution" as const,
    url: "https://catalog.mit.edu/degree-charts/mechanical-engineering-course-2",
  },
  berkeley: {
    id: "uc-berkeley-mechanical-engineering",
    title: "UC Berkeley, Mechanical Engineering",
    type: "institution" as const,
    url: "https://engineering.berkeley.edu/academics/undergraduate-programs/mechanical-engineering/",
  },
  georgiaTech: {
    id: "georgia-tech-mechanical-engineering",
    title: "Georgia Tech, Mechanical Engineering BS",
    type: "institution" as const,
    url: "https://catalog.gatech.edu/programs/mechanical-engineering-general-bs",
  },
  cambridge: {
    id: "cambridge-engineering-tripos",
    title: "University of Cambridge, Engineering Tripos Part IB",
    type: "institution" as const,
    url: "https://teaching.eng.cam.ac.uk/node/541",
  },
  michigan: {
    id: "michigan-mechanical-engineering",
    title: "University of Michigan, Mechanical Engineering BSE",
    type: "institution" as const,
    url: "https://me.engin.umich.edu/academics/undergrad/handbook/bachelors",
  },
  stanford: {
    id: "stanford-mechanical-engineering",
    title: "Stanford University, Mechanical Engineering BS",
    type: "institution" as const,
    url: "https://bulletin.stanford.edu/programs/ME-BS",
  },
  eth: {
    id: "eth-zurich-mechanical-engineering",
    title: "ETH Zurich, Mechanical Engineering BSc",
    type: "institution" as const,
    url: "https://ethz.ch/en/studies/bachelor/bachelors-degree-programmes/engineering-sciences/mechanical-engineering.html",
  },
};

function provenance(...sources: Array<(typeof SOURCE_POOL)[keyof typeof SOURCE_POOL]>): Provenance {
  return {
    sources: [
      ...sources,
      { id: "mindspark-authored", title: "Mindspark authored course structure", type: "authored" },
    ],
    reviewStatus: "draft",
    verified: false,
    note: "Course structure synthesised from published curricula of leading European and US engineering programmes; wording is original. Not yet technically reviewed.",
  };
}

const unit = (
  slug: string,
  name: string,
  summary: string,
  objectives: [string, string, string],
): SubtopicDraft => ({ slug, name, summary, objectives });

const mod = (slug: string, name: string, summary: string, units: SubtopicDraft[]): ModuleDraft => ({
  slug,
  name,
  summary,
  units,
});

const COURSES: MceCourse[] = [
  // ---------------------------------------------------------------- MCE301
  {
    slug: "mce-control-engineering",
    code: "MCE301",
    name: "Control Engineering",
    shortName: "Control Eng",
    description:
      "Modern control design: state-space models, state feedback and observers, compensator design, digital control, frequency-domain margins and disturbance rejection.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(0),
    icon: "Sliders",
    provenance: provenance(SOURCE_POOL.eth, SOURCE_POOL.berkeley, SOURCE_POOL.imperial),
    modules: [
      mod("state-space-models", "State-Space Models", "Representing dynamic systems with state variables and relating them to transfer functions.", [
        unit("state-equations", "State Equations from Physical Systems", "Choosing states and writing first-order matrix equations for mechanical and electrical plants.", [
          "Derive state-space matrices A, B, C and D for a mass-spring-damper system",
          "Select a valid set of state variables for a second-order electrical circuit",
          "Convert a higher-order ODE into a set of first-order state equations",
        ]),
        unit("state-and-transfer-function", "State Space and Transfer Functions", "Moving between the two representations and reading dynamics from eigenvalues.", [
          "Compute the transfer function G(s) = C(sI - A)^-1 B + D for a given model",
          "Determine system poles from the eigenvalues of the A matrix",
          "Compute the state response to an initial condition using the matrix exponential",
        ]),
      ]),
      mod("controllability-observability", "Controllability and Observability", "Testing whether states can be steered and inferred from available inputs and outputs.", [
        unit("controllability", "Controllability", "Rank tests and what an uncontrollable mode means in practice.", [
          "Form the controllability matrix and test its rank for a given system",
          "Identify an uncontrollable mode from a pole-zero cancellation",
          "Explain why an uncontrollable unstable mode cannot be stabilised by state feedback",
        ]),
        unit("observability", "Observability", "Rank tests and the dual relationship with controllability.", [
          "Form the observability matrix and test its rank for a given system",
          "State the duality between controllability and observability",
          "Determine whether a chosen sensor set makes a two-state plant observable",
        ]),
      ]),
      mod("state-feedback-observers", "State Feedback and Observers", "Placing closed-loop poles and estimating unmeasured states.", [
        unit("pole-placement", "Pole Placement", "Computing a gain matrix K that gives specified closed-loop dynamics.", [
          "Compute a state-feedback gain that places closed-loop poles at specified locations",
          "Choose pole locations to meet overshoot and settling-time targets",
          "Evaluate how control effort grows as poles are moved further left",
        ]),
        unit("observer-design", "Observer Design", "Building a Luenberger observer and combining it with state feedback.", [
          "Design an observer gain so the estimation error decays at a chosen rate",
          "Explain the separation principle for combined observer and state feedback",
          "Simulate how initial estimation error affects the closed-loop response",
        ]),
        unit("lqr-intro", "Optimal Control with LQR", "Trading state error against control effort through weighting matrices.", [
          "Write the LQR cost function in terms of the Q and R weighting matrices",
          "Describe how increasing R changes control effort and response speed",
          "Compare an LQR design with a pole-placement design on the same plant",
        ]),
      ]),
      mod("compensator-design", "Lead and Lag Compensation", "Shaping the open-loop frequency response with classical compensators.", [
        unit("lead-compensator", "Lead Compensators", "Adding phase to improve margin and speed of response.", [
          "Calculate the maximum phase lead of a lead compensator from its pole-zero ratio",
          "Design a lead compensator to achieve a specified phase margin",
          "Explain the penalty a lead compensator imposes on high-frequency noise",
        ]),
        unit("lag-compensator", "Lag Compensators", "Raising low-frequency gain to reduce steady-state error.", [
          "Compute the steady-state error improvement from a lag compensator",
          "Place the lag zero and pole so phase margin is only slightly degraded",
          "Compare lead, lag and PID compensation for a given specification",
        ]),
      ]),
      mod("digital-control", "Digital Control", "Implementing controllers on sampled-data hardware.", [
        unit("sampling-z-transform", "Sampling and the z-Transform", "Discrete signals, aliasing and the z-domain.", [
          "Select a sampling rate that avoids aliasing for a signal of known bandwidth",
          "Compute the z-transform of a simple sampled sequence",
          "Map s-plane pole locations to z-plane locations using z = e^(sT)",
        ]),
        unit("discrete-controllers", "Discrete Controller Design", "Discretising a continuous design and checking stability.", [
          "Discretise a PID controller using the backward-difference approximation",
          "Test discrete stability by checking poles lie inside the unit circle",
          "Describe the effect of computation delay on closed-loop phase margin",
        ]),
      ]),
      mod("nyquist-margins", "Nyquist Analysis and Stability Margins", "Using the Nyquist criterion and margins to judge robustness.", [
        unit("nyquist-criterion", "The Nyquist Criterion", "Counting encirclements of the critical point.", [
          "Sketch a Nyquist plot for a simple open-loop transfer function",
          "Apply the Nyquist criterion to determine closed-loop stability",
          "Interpret encirclements for an open-loop unstable plant",
        ]),
        unit("gain-phase-margins", "Gain, Phase and Sensitivity", "Quantifying robustness and relating it to the sensitivity function.", [
          "Read gain margin and phase margin from a Bode plot",
          "Compute the sensitivity function S = 1/(1 + L) at a given frequency",
          "Estimate the allowable plant gain variation from the gain margin",
        ]),
      ]),
      mod("disturbance-rejection", "Disturbance Rejection and Tracking", "Meeting steady-state and disturbance specifications.", [
        unit("steady-state-tracking", "Steady-State Error and System Type", "Error constants and internal-model reasoning.", [
          "Compute steady-state error to step and ramp inputs from system type",
          "Explain why integral action removes constant-disturbance error",
          "Add integral action to a state-feedback design to achieve zero step error",
        ]),
        unit("feedforward-robustness", "Feedforward and Robustness", "Using known signals and bounding the effect of model uncertainty.", [
          "Design a feedforward term that cancels a measured disturbance",
          "Estimate disturbance attenuation from the sensitivity magnitude at a frequency",
          "Describe how unmodelled dynamics limit achievable bandwidth",
        ]),
      ]),
      mod("control-hardware", "Hardware Implementation", "Turning a controller design into working embedded code.", [
        unit("actuators-sensors-limits", "Actuator Saturation and Sensor Limits", "Real-world limits that break linear designs.", [
          "Explain integrator windup and apply an anti-windup scheme",
          "Estimate the effect of quantisation on a sensor with a given resolution",
          "Choose controller bandwidth with reference to actuator rate limits",
        ]),
        unit("embedded-implementation", "Embedded Controller Implementation", "Fixed-step loops, timing and verification on hardware.", [
          "Write a fixed-sample-time control loop in pseudocode with state update",
          "Verify an implementation by comparing simulated and measured step responses",
          "Estimate the worst-case computation time budget within one sample period",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE302
  {
    slug: "mce-machine-dynamics-vibrations",
    code: "MCE302",
    name: "Machine Dynamics and Vibrations",
    shortName: "Vibrations",
    description:
      "Vibration of mechanical systems: single and multi degree of freedom response, damping, isolation, balancing, torsional vibration, continuous systems and measurement.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(1),
    icon: "WaveSine",
    provenance: provenance(SOURCE_POOL.imperial, SOURCE_POOL.michigan, SOURCE_POOL.stanford),
    modules: [
      mod("sdof-vibration", "Single Degree of Freedom Vibration", "Free and forced response of a mass-spring-damper system.", [
        unit("sdof-free", "Free Vibration", "Undamped and damped natural frequency and decay.", [
          "Compute the undamped natural frequency of a spring-mass system from m and k",
          "Determine the damping ratio from the logarithmic decrement of a decay record",
          "Classify a system as underdamped, critically damped or overdamped from its damping ratio",
        ]),
        unit("sdof-forced", "Harmonic Forced Response", "Amplitude, phase and resonance under sinusoidal loading.", [
          "Calculate steady-state amplitude of a damped system under harmonic force",
          "Find the dynamic magnification factor at a given frequency ratio",
          "Predict the phase shift between force and response below and above resonance",
        ]),
      ]),
      mod("damping-q", "Damping and Quality Factor", "Measuring and modelling energy dissipation.", [
        unit("damping-models", "Damping Models", "Viscous, Coulomb and structural damping.", [
          "Compare energy loss per cycle for viscous and Coulomb damping",
          "Compute an equivalent viscous damping ratio from measured energy loss",
          "Explain when structural (hysteretic) damping is a more suitable model",
        ]),
        unit("half-power-q", "Half-Power Bandwidth and Q", "Estimating damping from a frequency response curve.", [
          "Estimate the damping ratio using the half-power bandwidth method",
          "Relate the quality factor Q to the damping ratio near resonance",
          "Calculate resonant amplitude from Q and static deflection",
        ]),
      ]),
      mod("isolation", "Base Excitation and Isolation", "Reducing transmitted force and motion.", [
        unit("base-excitation", "Base Excitation and Transmissibility", "Response of a supported mass to moving ground.", [
          "Calculate the displacement transmissibility for a given frequency ratio",
          "Identify the frequency ratio above which isolation begins to reduce transmission",
          "Compute the relative motion between mass and base",
        ]),
        unit("isolator-specification", "Specifying an Isolator", "Selecting stiffness and damping to meet a transmissibility target.", [
          "Select an isolator stiffness to achieve a target transmissibility at an operating speed",
          "Explain the trade-off between damping at resonance and isolation at high frequency",
          "Compute transmitted force to the foundation from a rotating machine",
        ]),
      ]),
      mod("mdof-modal", "Multi Degree of Freedom Systems", "Modal analysis of coupled systems.", [
        unit("two-dof", "Two Degree of Freedom Systems", "Natural frequencies and mode shapes.", [
          "Assemble mass and stiffness matrices for a two-mass spring system",
          "Solve the eigenproblem to find two natural frequencies and mode shapes",
          "Sketch the mode shapes and identify in-phase and out-of-phase motion",
        ]),
        unit("modal-superposition", "Modal Superposition and Vibration Absorbers", "Decoupling equations and tuning a dynamic absorber.", [
          "Use orthogonality of mode shapes to decouple the equations of motion",
          "Compute the response of a two-DOF system as a sum of modal contributions",
          "Tune an undamped vibration absorber to cancel motion at a target frequency",
        ]),
      ]),
      mod("rotating-balancing", "Unbalance and Balancing", "Vibration forces from rotating machinery.", [
        unit("rotor-unbalance", "Rotor Unbalance", "Forces from eccentric mass and critical speeds.", [
          "Calculate the unbalance force from eccentric mass, radius and speed",
          "Determine the critical speed of a shaft carrying a single disc",
          "Explain the change in the phase of response when passing through a critical speed",
        ]),
        unit("balancing", "Static and Dynamic Balancing", "Correcting unbalance in one and two planes.", [
          "Find the correction mass for single-plane balancing from a trial-weight run",
          "Explain why a statically balanced rotor can remain dynamically unbalanced",
          "Compute correction masses in two planes for a rotor with two unbalances",
        ]),
      ]),
      mod("torsional-vibration", "Torsional Vibration", "Twisting oscillations of shafts and drivetrains.", [
        unit("torsional-single", "Single and Two-Inertia Systems", "Natural frequency of shaft-inertia assemblies.", [
          "Compute the torsional stiffness of a circular shaft from G, J and L",
          "Determine the natural frequency of a shaft with one disc",
          "Find the natural frequency and node position of a two-disc shaft",
        ]),
        unit("geared-systems", "Geared Systems and Excitation", "Equivalent systems and engine-order excitation.", [
          "Reduce a geared system to an equivalent single-shaft model using the gear ratio",
          "Identify the engine speeds at which a given order excites a torsional mode",
          "Estimate the torsional stress at resonance from shaft twist amplitude",
        ]),
      ]),
      mod("continuous-systems", "Continuous Systems", "Vibration of strings, bars and beams.", [
        unit("strings-bars", "Strings and Bars", "Wave equation solutions for simple continua.", [
          "Calculate natural frequencies of a taut string with fixed ends",
          "Determine longitudinal natural frequencies of a fixed-free bar",
          "Relate the wave speed to material properties for axial vibration",
        ]),
        unit("beam-vibration", "Beam Bending Vibration", "Euler-Bernoulli beam modes and Rayleigh estimates.", [
          "Compute the first natural frequency of a cantilever using the standard beam result",
          "Apply Rayleigh's method to estimate a fundamental frequency from an assumed shape",
          "Explain how added mass and changed boundary conditions shift beam frequencies",
        ]),
      ]),
      mod("vibration-measurement", "Vibration Measurement", "Instruments and signal analysis for vibrating machines.", [
        unit("transducers", "Vibration Transducers", "Accelerometers, seismic instruments and their limits.", [
          "Select an accelerometer type for a given frequency range and amplitude",
          "Explain how a seismic instrument's natural frequency sets its useful band",
          "Describe the effect of mounting method on high-frequency accuracy",
        ]),
        unit("spectral-analysis", "Spectra and Modal Testing", "Interpreting spectra and extracting modal parameters.", [
          "Identify resonant peaks and harmonics on a frequency spectrum",
          "Choose sampling rate and record length to resolve two close frequencies",
          "Describe an impact hammer test and how a frequency response function is formed",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE303
  {
    slug: "mce-thermofluid-applications",
    code: "MCE303",
    name: "Thermofluid Applications",
    shortName: "Thermofluids",
    description:
      "Applied thermofluids: turbomachinery theory, pumps and fans, turbine stages, power plant and engine performance, refrigeration, HVAC and energy-sustainability analysis.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(2),
    icon: "Fan",
    provenance: provenance(SOURCE_POOL.imperial, SOURCE_POOL.mit),
    modules: [
      mod("turbomachinery-theory", "Turbomachinery Theory", "The Euler turbomachine equation and velocity triangles.", [
        unit("velocity-triangles", "Velocity Triangles", "Absolute, relative and blade velocities at inlet and outlet.", [
          "Construct inlet and outlet velocity triangles for a given blade angle and speed",
          "Resolve absolute velocity into whirl and axial components",
          "Compute flow coefficient and blade loading coefficient from velocity triangles",
        ]),
        unit("euler-equation", "The Euler Equation", "Specific work from the change in angular momentum.", [
          "Apply Euler's equation to compute specific work from blade speed and whirl velocity",
          "Distinguish work input of a pump from work output of a turbine in sign and form",
          "Relate stagnation enthalpy change to specific work for an adiabatic machine",
        ]),
      ]),
      mod("pumps-fans", "Pumps and Fans", "Selecting and operating rotodynamic pumps and fans.", [
        unit("pump-performance", "Pump Performance and Similarity", "Head, flow, power and the affinity laws.", [
          "Use the affinity laws to predict flow, head and power when speed changes",
          "Calculate pump efficiency from hydraulic power and shaft power",
          "Determine specific speed and use it to choose a pump type",
        ]),
        unit("system-matching-cavitation", "System Matching and Cavitation", "Operating point, parallel operation and NPSH.", [
          "Find the operating point from the intersection of pump and system curves",
          "Calculate available NPSH for a given suction arrangement",
          "Predict whether a pump will cavitate by comparing NPSH available and required",
        ]),
      ]),
      mod("turbine-stages", "Turbine Stages", "Impulse and reaction stage analysis for steam, gas and hydraulic turbines.", [
        unit("axial-turbine-stage", "Axial Turbine Stages", "Degree of reaction and stage work.", [
          "Compute stage work from nozzle and rotor velocity triangles",
          "Calculate the degree of reaction of an axial turbine stage",
          "Compare an impulse stage with a 50 percent reaction stage on blade speed and loss",
        ]),
        unit("hydraulic-turbines", "Hydraulic Turbines", "Pelton, Francis and Kaplan selection.", [
          "Calculate Pelton wheel power from jet velocity and bucket angle",
          "Select a turbine type using specific speed, head and flow",
          "Estimate hydropower output from head, flow rate and overall efficiency",
        ]),
      ]),
      mod("power-plant-analysis", "Power Plant Analysis", "Evaluating steam and gas-turbine plants.", [
        unit("steam-plant", "Steam Plant with Irreversibilities", "Real turbine and pump performance in the Rankine cycle.", [
          "Compute thermal efficiency of a Rankine cycle with isentropic efficiencies",
          "Evaluate the efficiency gain from reheat and feedwater heating",
          "Calculate steam mass flow needed for a target net power output",
        ]),
        unit("combined-cycle", "Gas Turbine and Combined Cycles", "Brayton cycle with real components and heat recovery.", [
          "Compute Brayton cycle net work with compressor and turbine efficiencies",
          "Evaluate the effect of pressure ratio on efficiency and specific work",
          "Calculate combined-cycle efficiency from topping and bottoming cycle efficiencies",
        ]),
      ]),
      mod("ic-engine-performance", "Internal Combustion Engine Performance", "Measures of engine output and efficiency.", [
        unit("engine-measures", "Indicated and Brake Performance", "Power, mean effective pressure and efficiencies.", [
          "Calculate indicated power from mean effective pressure, displacement and speed",
          "Determine brake power and mechanical efficiency from dynamometer data",
          "Compute brake specific fuel consumption from fuel flow and power",
        ]),
        unit("engine-operation", "Air-Fuel Ratio, Volumetric Efficiency and Emissions", "Mixture effects on output and emissions.", [
          "Calculate volumetric efficiency from measured air mass flow",
          "Relate equivalence ratio to the dominant emissions of a spark-ignition engine",
          "Explain how compression ratio affects ideal Otto cycle efficiency and knock risk",
        ]),
      ]),
      mod("refrigeration-systems", "Refrigeration Systems", "Vapour-compression systems and refrigerant behaviour.", [
        unit("vapour-compression", "Vapour-Compression Cycle Analysis", "Cycle states, COP and component sizing.", [
          "Locate cycle states on a p-h diagram for a given evaporating and condensing pressure",
          "Compute coefficient of performance from enthalpy values",
          "Calculate compressor power for a given refrigeration capacity",
        ]),
        unit("refrigeration-improvements", "Cycle Improvements and Refrigerants", "Subcooling, multistage compression and refrigerant choice.", [
          "Quantify the capacity gain from subcooling the liquid before expansion",
          "Explain why multistage compression with intercooling reduces work",
          "Compare refrigerants by global warming potential and operating pressure",
        ]),
      ]),
      mod("hvac", "Heating, Ventilation and Air Conditioning", "Conditioning air for comfort and process.", [
        unit("psychrometric-processes", "Psychrometric Processes", "Heating, cooling and humidification on the chart.", [
          "Determine humidity ratio and enthalpy of moist air from dry- and wet-bulb temperatures",
          "Compute the cooling load for cooling and dehumidifying an air stream",
          "Calculate the water addition required to humidify air to a target state",
        ]),
        unit("building-loads", "Building Loads and Air Handling", "Sensible and latent loads and mixing of air streams.", [
          "Calculate the sensible and latent loads of an occupied room",
          "Find the mixed-air state when fresh and recirculated air streams combine",
          "Size supply air flow rate to remove a given sensible load at a set supply temperature",
        ]),
      ]),
      mod("energy-sustainability", "Energy and Sustainability Analysis", "Judging systems by efficiency, emissions and lifetime cost.", [
        unit("energy-balances", "Energy and Exergy Accounting", "Second-law view of where useful energy is lost.", [
          "Compute the exergy destroyed in a throttling or heat exchange process",
          "Build an energy balance table for a multi-component plant",
          "Identify the component with the largest exergy destruction in a cycle",
        ]),
        unit("emissions-economics", "Emissions and Levelised Cost", "Carbon intensity and simple techno-economics.", [
          "Calculate CO2 emitted per kWh from fuel carbon content and plant efficiency",
          "Compute a levelised cost of energy from capital, fuel and operating costs",
          "Compare two energy options on efficiency, emissions and cost",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE304
  {
    slug: "mce-machine-design-project",
    code: "MCE304",
    name: "Machine Design II and Design Project",
    shortName: "Design Project",
    description:
      "Team design, make and test project: requirements, design reviews, systems integration, design for manufacture, tolerance stack-up, reliability, test planning, standards and project management.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(3),
    icon: "Wrench",
    provenance: provenance(SOURCE_POOL.imperial, SOURCE_POOL.georgiaTech, SOURCE_POOL.michigan),
    modules: [
      mod("scoping-requirements", "Project Scoping and Requirements", "Turning a customer brief into verifiable engineering requirements.", [
        unit("requirements-capture", "Requirements Capture", "Stakeholder needs, constraints and measurable specifications.", [
          "Convert a customer need into a measurable engineering requirement with a target value",
          "Classify requirements as functional, performance, constraint or regulatory",
          "Write acceptance criteria that can be verified by test, inspection or analysis",
        ]),
        unit("scope-baseline", "Scope Statement and Concept Selection", "Bounding the project and choosing a concept transparently.", [
          "Write a scope statement that lists deliverables and explicit exclusions",
          "Score concepts with a weighted decision matrix and test its sensitivity to weights",
          "Document the rationale for rejecting at least two alternative concepts",
        ]),
      ]),
      mod("design-review", "Design Reviews", "Structured reviews that find problems before manufacture.", [
        unit("review-preparation", "Preparing a Design Review", "Evidence, calculations and review criteria.", [
          "Assemble a review pack with requirements traceability to design evidence",
          "Justify a critical dimension with a documented hand calculation",
          "List open risks with owners and planned closure actions",
        ]),
        unit("review-conduct", "Conducting and Recording Reviews", "Roles, findings and action tracking.", [
          "Distinguish concept, preliminary and critical design review objectives",
          "Record review findings as actions with owner, severity and due date",
          "Evaluate a design against a checklist and rate each item as pass, concern or fail",
        ]),
      ]),
      mod("systems-integration", "Systems Integration", "Making subsystems work together.", [
        unit("interfaces", "Interfaces and Architecture", "Defining functional and physical interfaces.", [
          "Draw a functional block diagram showing energy, material and signal flows",
          "Define a mechanical interface by datum, fit and fastening method",
          "Allocate a top-level requirement such as mass or power budget across subsystems",
        ]),
        unit("integration-planning", "Integration and Budgets", "Assembly sequence, budgets and clash checking.", [
          "Plan an assembly sequence that allows every fastener to be accessed",
          "Maintain a mass budget and report margin against the limit",
          "Identify interface clashes in a CAD assembly using interference checking",
        ]),
      ]),
      mod("dfm-dfa", "Design for Manufacture and Assembly", "Choosing features and processes that are cheap to make and assemble.", [
        unit("dfm", "Design for Manufacture", "Process-driven feature rules.", [
          "Revise a part design to remove a feature that is difficult to machine or mould",
          "Select a process for a given volume, material and tolerance requirement",
          "Estimate relative part cost for two alternative manufacturing routes",
        ]),
        unit("dfa", "Design for Assembly", "Reducing part count and handling effort.", [
          "Apply part-count reduction criteria to decide which parts can be combined",
          "Add features that make a part self-locating and prevent incorrect assembly",
          "Compute a design-for-assembly efficiency from ideal and actual assembly times",
        ]),
      ]),
      mod("tolerance-stack", "Tolerance Stack-Up", "Predicting how part tolerances accumulate in an assembly.", [
        unit("worst-case-stack", "Worst-Case Stack-Up", "Linear chains of dimensions.", [
          "Draw a dimension chain and assign positive and negative directions",
          "Calculate the worst-case gap and its upper and lower limits",
          "Determine which tolerance to tighten to meet a required clearance",
        ]),
        unit("statistical-stack", "Statistical Stack-Up and Fits", "Root-sum-square methods and standard fits.", [
          "Calculate a root-sum-square tolerance for a chain of independent dimensions",
          "Select a clearance or interference fit class for a shaft and hole",
          "Compare worst-case and statistical results and state the risk accepted",
        ]),
      ]),
      mod("reliability-fmea", "Reliability and FMEA", "Anticipating failure modes in a design.", [
        unit("fmea", "Failure Modes and Effects Analysis", "Severity, occurrence and detection ranking.", [
          "List failure modes, effects and causes for a mechanical subsystem",
          "Compute risk priority numbers from severity, occurrence and detection ratings",
          "Propose design actions that reduce the highest-ranked risks and re-score",
        ]),
        unit("reliability-basics", "Reliability Calculations", "Series, parallel and component life distributions.", [
          "Calculate system reliability for components in series and in parallel",
          "Use an exponential failure model to find reliability over a stated operating time",
          "Explain how redundancy improves reliability and what it costs",
        ]),
      ]),
      mod("prototype-testing", "Prototyping and Test Planning", "Building the design and proving it meets requirements.", [
        unit("test-plans", "Test Planning", "Matching tests to requirements.", [
          "Write a test procedure with setup, measurements, pass criteria and safety checks",
          "Map each requirement to a test, analysis or inspection method",
          "Choose instrument range and accuracy to resolve the required tolerance",
        ]),
        unit("test-evaluation", "Test Execution and Evaluation", "Recording results and closing the loop to the design.", [
          "Record test data with units, uncertainty and calibration references",
          "Compare measured performance with predicted performance and explain discrepancies",
          "Recommend design changes based on test results and revise the requirements trace",
        ]),
      ]),
      mod("standards-project-management", "Standards, Safety and Project Management", "Delivering the project safely, on time and fully documented.", [
        unit("standards-safety", "Standards and Safety Case", "Applicable codes and hazard control.", [
          "Identify the standards that apply to a given product and state why",
          "Perform a hazard assessment and rank risks before and after control measures",
          "Document guarding, emergency stop and lockout needs for a machine",
        ]),
        unit("planning-reporting", "Planning and Final Report", "Schedule control and communicating the design.", [
          "Build a work breakdown structure and Gantt chart with dependencies and milestones",
          "Identify the critical path and compute schedule float",
          "Structure a design report so each decision links to requirements and evidence",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE305
  {
    slug: "mce-manufacturing-systems-metrology",
    code: "MCE305",
    name: "Manufacturing Systems and Metrology",
    shortName: "Mfg Systems",
    description:
      "Manufacturing at system level: CNC and CAM, automation, process planning, statistical process control, dimensional metrology, lean production and quality standards.",
    year: "Year3",
    semester: 1,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: color(4),
    icon: "Factory",
    provenance: provenance(SOURCE_POOL.imperial, SOURCE_POOL.michigan),
    modules: [
      mod("cnc-cam", "CNC and CAM", "Programming numerically controlled machines.", [
        unit("cnc-fundamentals", "CNC Machine Fundamentals", "Axes, coordinate systems and G-code.", [
          "Identify the axes and work coordinate system of a three-axis milling machine",
          "Write G-code for a simple profile using linear and circular interpolation",
          "Explain the difference between absolute and incremental programming",
        ]),
        unit("cam-toolpaths", "CAM Toolpaths and Cutting Parameters", "Turning geometry into a machining strategy.", [
          "Calculate spindle speed from cutting speed and tool diameter",
          "Compute feed rate from feed per tooth, number of teeth and spindle speed",
          "Choose roughing and finishing strategies to meet a surface finish target",
        ]),
      ]),
      mod("automation", "Automation and Robotics in Manufacturing", "Machines that load, move and inspect parts.", [
        unit("automation-types", "Types of Automation", "Fixed, programmable and flexible automation.", [
          "Classify a production line as fixed, programmable or flexible automation",
          "Select an automation level for a given volume and variety of parts",
          "Compare an industrial robot with dedicated tooling for a loading task",
        ]),
        unit("cell-design", "Manufacturing Cell Design", "Layout, cycle time and utilisation.", [
          "Calculate the cycle time of a robotic work cell from its component times",
          "Determine machine utilisation for a given demand and available time",
          "Identify the bottleneck station in a serial line from station times",
        ]),
      ]),
      mod("process-planning", "Process Planning", "Deciding the route a part takes through the factory.", [
        unit("operation-sequencing", "Operation Sequencing and Fixturing", "Datums, set-ups and work-holding.", [
          "Create an operation sequence that machines features in an order that preserves datums",
          "Apply the 3-2-1 locating principle to constrain a prismatic part",
          "Minimise the number of set-ups for a part by grouping features by orientation",
        ]),
        unit("process-costing", "Time Standards and Costing", "Estimating how long and how much.", [
          "Compute machining time for a turning or milling operation",
          "Estimate unit cost from material, machine time, labour and overhead",
          "Calculate break-even volume between two production methods",
        ]),
      ]),
      mod("spc", "Statistical Process Control", "Monitoring a process with data.", [
        unit("control-charts", "Control Charts", "X-bar and R charts and their limits.", [
          "Calculate centre line and control limits for an X-bar and R chart from sample data",
          "Identify an out-of-control signal such as a point beyond limits or a run",
          "Distinguish common-cause from special-cause variation",
        ]),
        unit("process-capability", "Process Capability", "Cp and Cpk against specification limits.", [
          "Calculate Cp and Cpk from process mean, standard deviation and specification limits",
          "Estimate the fraction of parts outside tolerance assuming a normal distribution",
          "Decide whether to re-centre a process or reduce its variation",
        ]),
      ]),
      mod("metrology", "Dimensional Metrology", "Measuring parts and trusting the measurement.", [
        unit("measurement-uncertainty", "Instruments and Uncertainty", "Hand tools, gauges and uncertainty budgets.", [
          "Select a measuring instrument by comparing its resolution with the tolerance",
          "Combine independent uncertainty contributions in a simple budget",
          "Apply the 10-to-1 rule to relate gauge accuracy to part tolerance",
        ]),
        unit("cmm-gdt-inspection", "CMM and Geometric Inspection", "Coordinate measurement and form checks.", [
          "Describe how a CMM establishes a datum reference frame from probed features",
          "Evaluate flatness or straightness from a set of measured points",
          "Explain the role of calibration traceability in measurement results",
        ]),
      ]),
      mod("lean-production", "Lean Production", "Removing waste and smoothing flow.", [
        unit("lean-tools", "Lean Principles and Tools", "Value, waste and visual management.", [
          "Identify the seven forms of waste in a described production scenario",
          "Draw a value-stream map and compute the value-added time ratio",
          "Describe how pull systems with kanban limit work in progress",
        ]),
        unit("flow-and-takt", "Takt Time and Line Balancing", "Matching production rate to demand.", [
          "Calculate takt time from available time and customer demand",
          "Balance an assembly line by assigning tasks to stations within takt time",
          "Calculate line balance efficiency from task times and station count",
        ]),
      ]),
      mod("quality-standards", "Quality Systems and Standards", "Organising for consistent quality.", [
        unit("quality-management", "Quality Management Systems", "ISO 9001 principles and continuous improvement.", [
          "Describe the plan-do-check-act cycle and apply it to a quality problem",
          "Explain the purpose of corrective and preventive action records",
          "Use a Pareto chart to prioritise defect causes",
        ]),
        unit("acceptance-sampling", "Acceptance Sampling", "Deciding about batches from samples.", [
          "Determine the probability of accepting a batch for a single sampling plan",
          "Interpret the operating characteristic curve of a sampling plan",
          "Explain the difference between producer risk and consumer risk",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE311
  {
    slug: "mce-finite-element-analysis",
    code: "MCE311",
    name: "Finite Element Analysis and Applications",
    shortName: "FEA",
    description:
      "Finite element method beyond the basics: variational formulation, isoparametric elements, plates and shells, nonlinear and contact analysis, modal and dynamic FE, coupled problems and modelling best practice.",
    year: "Year3",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(5),
    icon: "Cube",
    provenance: provenance(SOURCE_POOL.imperial),
    modules: [
      mod("variational-formulation", "Variational Formulation", "From governing equations to the weak form and element equations.", [
        unit("weak-form", "Strong and Weak Forms", "Weighted residuals and the principle of virtual work.", [
          "Derive the weak form of a one-dimensional axial bar equation",
          "Explain why the weak form lowers the continuity required of the trial functions",
          "Distinguish essential from natural boundary conditions",
        ]),
        unit("rayleigh-ritz-galerkin", "Rayleigh-Ritz and Galerkin Methods", "Approximating with trial functions.", [
          "Apply the Rayleigh-Ritz method with a single trial function to a bar problem",
          "Show that the Galerkin method gives a symmetric stiffness matrix for a self-adjoint problem",
          "Compare an approximate solution with the exact solution and quantify the error",
        ]),
      ]),
      mod("isoparametric-elements", "Isoparametric Elements", "Mapped elements for general geometry.", [
        unit("shape-functions", "Shape Functions and Mapping", "Natural coordinates and the Jacobian.", [
          "Write shape functions for a four-node quadrilateral in natural coordinates",
          "Compute the Jacobian matrix for a given element geometry",
          "Explain what a negative Jacobian determinant indicates about an element",
        ]),
        unit("numerical-integration", "Numerical Integration and Element Quality", "Gauss quadrature, distortion and locking.", [
          "Choose a Gauss point count that integrates a stiffness matrix exactly for a regular element",
          "Explain how reduced integration can alleviate shear locking and cause hourglassing",
          "Assess element quality using aspect ratio and skew",
        ]),
        unit("higher-order", "Higher-Order and Triangular Elements", "Choosing element order.", [
          "Compare linear and quadratic elements on accuracy for bending-dominated problems",
          "Write the area-coordinate shape functions of a linear triangle",
          "Choose between triangles and quadrilaterals for a given geometry",
        ]),
      ]),
      mod("plates-shells", "Beams, Plates and Shells", "Structural elements for thin members.", [
        unit("beam-plate-theory", "Beam and Plate Elements", "Bending theories and their element forms.", [
          "Assemble the stiffness matrix of an Euler-Bernoulli beam element",
          "State when Timoshenko theory is needed instead of Euler-Bernoulli theory",
          "Choose between plate and solid elements given thickness-to-span ratio",
        ]),
        unit("shell-modelling", "Shell Modelling Practice", "Mid-surface models and drilling stiffness.", [
          "Create a mid-surface idealisation of a thin-walled part and assign thickness",
          "Predict the bending versus membrane behaviour of a shell under a given load",
          "Check that rotational degrees of freedom are properly constrained in shell-to-beam joints",
        ]),
      ]),
      mod("nonlinear-contact", "Nonlinear and Contact Analysis", "When linear assumptions fail.", [
        unit("nonlinear-sources", "Sources of Nonlinearity", "Geometric, material and boundary nonlinearity.", [
          "Classify a problem as geometrically, materially or boundary nonlinear",
          "Describe the Newton-Raphson iteration for a nonlinear static problem",
          "Select load increment sizes and convergence criteria for a plasticity analysis",
        ]),
        unit("contact", "Contact Modelling", "Penalty and Lagrange contact enforcement.", [
          "Explain how the penalty method enforces non-penetration and its sensitivity to stiffness",
          "Identify master and slave surface selection issues for a contact pair",
          "Diagnose convergence trouble in a contact analysis and propose two remedies",
        ]),
      ]),
      mod("modal-dynamic-fe", "Modal and Dynamic Finite Element Analysis", "Computing frequencies and time-varying response.", [
        unit("fe-modal", "Modal Analysis", "The generalised eigenvalue problem.", [
          "Form the consistent and lumped mass matrices of a bar element",
          "Solve the eigenproblem for a two-element bar to obtain natural frequencies",
          "Compare FE and analytical natural frequencies and discuss the discrepancy",
        ]),
        unit("fe-transient", "Transient and Harmonic Response", "Time integration and modal superposition.", [
          "Explain the stability limit of explicit time integration in terms of element size",
          "Choose between full and modal-superposition methods for a harmonic analysis",
          "Select a time step to resolve the highest mode of interest",
        ]),
      ]),
      mod("coupled-thermal-structural", "Thermal-Structural Coupling", "Temperature fields driving structural stress.", [
        unit("fe-thermal", "Thermal Finite Element Analysis", "Steady and transient conduction.", [
          "Assemble the conduction matrix for a one-dimensional two-element thermal model",
          "Apply convection and heat-flux boundary conditions in an FE model",
          "Choose a time step for a transient thermal analysis from element size and diffusivity",
        ]),
        unit("thermal-stress", "Thermal Stress Analysis", "Sequentially coupled thermomechanical problems.", [
          "Compute the thermal strain and constrained thermal stress in a restrained bar",
          "Set up a sequentially coupled analysis passing temperatures to a structural model",
          "Identify where thermal gradient produces the highest stress in a bi-material joint",
        ]),
      ]),
      mod("fea-best-practice", "Modelling Best Practice", "Building models that can be trusted.", [
        unit("mesh-convergence", "Mesh Convergence and Error", "Showing the answer does not depend on the mesh.", [
          "Carry out a mesh convergence study and plot a key result against element count",
          "Identify stress singularities and explain why refinement does not converge there",
          "Use Richardson extrapolation or an error estimator to bound discretisation error",
        ]),
        unit("fea-verification", "Verification and Validation", "Hand checks and comparison with experiment.", [
          "Verify an FE model against a closed-form beam or pressure-vessel solution",
          "Perform a reaction-force and equilibrium check on a solved model",
          "Write a short model assumptions log covering geometry, loads, constraints and mesh",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE312
  {
    slug: "mce-fracture-fatigue-failure",
    code: "MCE312",
    name: "Fracture, Fatigue and Failure Analysis",
    shortName: "Failure Analysis",
    description:
      "Why engineering components fail: linear elastic fracture mechanics, toughness, fatigue crack growth, stress-life and strain-life fatigue, creep, failure investigation and fitness for service.",
    year: "Year3",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(0),
    icon: "Hammer",
    provenance: provenance(SOURCE_POOL.imperial, SOURCE_POOL.cambridge),
    modules: [
      mod("lefm", "Linear Elastic Fracture Mechanics", "Stress intensity and the conditions for unstable crack growth.", [
        unit("stress-intensity", "Stress Intensity Factor", "Characterising the crack-tip stress field.", [
          "Calculate K = Y sigma sqrt(pi a) for a through-thickness crack with a given geometry factor",
          "Distinguish Mode I, II and III crack loading",
          "Explain why a sharp crack produces a stress singularity that stress concentration factors cannot describe",
        ]),
        unit("energy-release", "Energy Release Rate and Fracture Criterion", "Griffith's energy balance.", [
          "Relate the energy release rate G to K under plane strain conditions",
          "Apply the criterion K = Kc to find the critical stress for a given crack length",
          "Compute the critical crack length for a given applied stress and toughness",
        ]),
      ]),
      mod("toughness", "Fracture Toughness", "Material resistance to crack propagation.", [
        unit("plane-strain-toughness", "Plane Strain Toughness and Constraint", "Thickness effects and valid K_IC tests.", [
          "Explain why toughness falls with increasing thickness until plane strain is reached",
          "Check the plane strain size requirement for a K_IC specimen",
          "Estimate the plastic zone size at a crack tip using Irwin's correction",
        ]),
        unit("toughness-selection", "Toughness, Temperature and Selection", "Ductile-brittle transition and material choice.", [
          "Explain the ductile-to-brittle transition in body-centred cubic steels",
          "Select between two materials for a fail-safe design using yield strength and toughness",
          "Describe the effect of strain rate and temperature on fracture mode",
        ]),
      ]),
      mod("fatigue-crack-growth", "Fatigue Crack Growth", "Predicting how fast a crack extends under cyclic load.", [
        unit("paris-law", "The Paris Law", "Crack growth rate against stress intensity range.", [
          "Identify the three regimes of the da/dN versus delta K curve",
          "Integrate the Paris law to compute the number of cycles to grow a crack between two sizes",
          "Compute delta K from the stress range and crack length",
        ]),
        unit("growth-factors", "Mean Stress, Overloads and Thresholds", "Effects that modify growth rate.", [
          "Explain how the load ratio R changes crack growth rate",
          "Describe crack retardation after a tensile overload",
          "Use a threshold delta K to decide whether a given crack will grow",
        ]),
      ]),
      mod("stress-life-strain-life", "Stress-Life and Strain-Life Fatigue", "Predicting crack initiation life.", [
        unit("s-n-approach", "The S-N Approach", "Endurance limit, mean stress and cumulative damage.", [
          "Estimate cycles to failure from an S-N curve for a given stress amplitude",
          "Apply the Goodman or Gerber line to account for mean stress",
          "Calculate damage using Miner's rule for a variable-amplitude loading block",
        ]),
        unit("strain-life", "The Strain-Life Approach", "Low-cycle fatigue and the Coffin-Manson relation.", [
          "Separate total strain amplitude into elastic and plastic components",
          "Estimate low-cycle fatigue life using the Coffin-Manson relation",
          "Decide when a strain-life method is preferable to a stress-life method",
        ]),
      ]),
      mod("creep", "Creep and High-Temperature Failure", "Time-dependent deformation under sustained load.", [
        unit("creep-behaviour", "Creep Behaviour", "Primary, secondary and tertiary creep.", [
          "Identify the three stages of creep on a strain-time curve",
          "Calculate minimum creep rate from a power-law relation at a given stress and temperature",
          "Explain the effect of temperature on creep rate through an Arrhenius dependence",
        ]),
        unit("creep-design", "Creep Design Methods", "Larson-Miller parameter and creep rupture.", [
          "Use the Larson-Miller parameter to estimate rupture life at a different temperature",
          "Estimate creep deflection of a component over its design life",
          "Select a material for a high-temperature service condition based on creep resistance",
        ]),
      ]),
      mod("failure-investigation", "Failure Investigation and Case Studies", "Finding out why a component failed.", [
        unit("fractography", "Fractography and Evidence", "Reading fracture surfaces.", [
          "Identify beach marks and striations as indicators of fatigue",
          "Distinguish ductile cup-and-cone from brittle cleavage fracture surfaces",
          "Locate the initiation site from the pattern of crack arrest marks",
        ]),
        unit("case-studies", "Failure Case Studies", "Learning from documented failures.", [
          "Construct a failure timeline from loading history and fracture evidence",
          "Identify root cause versus contributing factors in a documented failure",
          "Propose a design or inspection change that would have prevented a given failure",
        ]),
      ]),
      mod("ndt", "Non-Destructive Testing", "Finding flaws without damaging the part.", [
        unit("ndt-methods", "NDT Methods", "Principles and limits of common techniques.", [
          "Match dye penetrant, magnetic particle, ultrasonic and radiographic methods to flaw types",
          "Explain why surface-breaking cracks suit penetrant and magnetic particle testing",
          "Calculate flaw depth from an ultrasonic pulse-echo time and wave speed",
        ]),
        unit("ndt-reliability", "Detection Capability and Inspection Intervals", "What size flaw can be found, and how often to look.", [
          "Define the smallest reliably detectable flaw size for a technique",
          "Set an inspection interval from the crack growth life between detectable and critical sizes",
          "Explain the safety factor applied to the interval to allow for detection uncertainty",
        ]),
      ]),
      mod("fitness-for-service", "Fitness for Service", "Deciding whether a flawed component can stay in use.", [
        unit("assessment-diagrams", "Failure Assessment Diagrams", "Combining brittle fracture and plastic collapse.", [
          "Compute the toughness ratio and load ratio coordinates for an assessment point",
          "Decide whether an assessment point lies inside the safe region of a failure assessment diagram",
          "Explain how the diagram interpolates between brittle fracture and plastic collapse",
        ]),
        unit("leak-before-break", "Leak-Before-Break and Safe Life", "Design philosophies for flaw tolerance.", [
          "Evaluate a pressure vessel for leak-before-break using critical crack length and wall thickness",
          "Contrast safe-life and fail-safe design philosophies",
          "Recommend a repair, re-rate or retire decision based on assessment results",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE313
  {
    slug: "mce-mechatronics-instrumentation",
    code: "MCE313",
    name: "Mechatronics and Instrumentation",
    shortName: "Mechatronics",
    description:
      "Integrating electronics, software and mechanics: embedded C, data acquisition and signal processing, sensors and noise, motor drives, PLCs, communication buses and introductory robot kinematics.",
    year: "Year3",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: color(1),
    icon: "Robot",
    provenance: provenance(SOURCE_POOL.imperial, SOURCE_POOL.berkeley),
    modules: [
      mod("embedded-c", "Embedded C Programming", "Writing firmware for microcontrollers.", [
        unit("registers-gpio", "Registers, GPIO and Timers", "Controlling hardware peripherals from C.", [
          "Configure a GPIO pin as input or output using register bit operations",
          "Compute timer prescaler and period values to generate a PWM signal of given frequency",
          "Explain the use of volatile for variables shared with hardware or interrupts",
        ]),
        unit("interrupts-realtime", "Interrupts and Real-Time Behaviour", "Responding to events within deadlines.", [
          "Write an interrupt service routine that sets a flag and keeps its execution short",
          "Estimate worst-case interrupt latency from clock cycles and clock frequency",
          "Structure a main loop so that a periodic control task meets its deadline",
        ]),
      ]),
      mod("adc-signal-processing", "ADC and Signal Processing", "Converting analogue signals and cleaning them up in software.", [
        unit("adc-basics", "Analogue-to-Digital Conversion", "Resolution, range and sampling.", [
          "Calculate the voltage resolution of an N-bit ADC for a given reference voltage",
          "Select a sample rate that satisfies the Nyquist criterion for a signal of known bandwidth",
          "Design an anti-aliasing filter cutoff for a chosen sample rate",
        ]),
        unit("digital-filtering", "Digital Filtering", "Moving average and first-order filters.", [
          "Implement a first-order low-pass filter from a time constant and sample period",
          "Compare a moving-average filter and an exponential filter on lag and noise reduction",
          "Estimate the delay a digital filter adds to a measured signal",
        ]),
      ]),
      mod("sensors-noise", "Sensors and Noise", "Choosing sensors and understanding measurement error.", [
        unit("sensor-selection", "Sensor Characteristics", "Range, sensitivity, linearity and bandwidth.", [
          "Compute sensor sensitivity from calibration data using linear regression",
          "Select a position or force sensor by comparing range, resolution and bandwidth",
          "Calculate bridge output voltage for a strain gauge in a quarter-bridge configuration",
        ]),
        unit("noise-conditioning", "Noise and Signal Conditioning", "Sources of noise and how to reduce them.", [
          "Compute the signal-to-noise ratio in decibels from signal and noise amplitudes",
          "Design an instrumentation amplifier stage with a given gain",
          "Identify ground-loop and electromagnetic pickup and propose wiring remedies",
        ]),
      ]),
      mod("motor-drives", "Motor Drives", "Powering and controlling electric motors.", [
        unit("dc-bldc-motors", "DC and Brushless Motors", "Torque, speed and back-EMF.", [
          "Use the motor torque constant and back-EMF constant to compute speed under load",
          "Calculate stall torque and no-load speed from motor parameters and supply voltage",
          "Select a motor and gearbox to meet a given torque and speed requirement",
        ]),
        unit("pwm-h-bridge", "PWM and H-Bridge Drives", "Switching amplifiers for bidirectional control.", [
          "Relate PWM duty cycle to average motor voltage",
          "Explain how an H-bridge reverses motor direction and why shoot-through must be avoided",
          "Choose a PWM frequency considering switching loss and audible noise",
        ]),
      ]),
      mod("plc-basics", "PLC Basics", "Industrial logic control.", [
        unit("ladder-logic", "Ladder Logic", "Contacts, coils and latching.", [
          "Translate a Boolean control requirement into ladder logic",
          "Build a start-stop latching circuit with an emergency stop",
          "Use timers to sequence two outputs with a fixed delay",
        ]),
        unit("plc-systems", "PLC Systems and Safety", "I/O, scan cycle and safety.", [
          "Explain how the PLC scan cycle affects response time to an input change",
          "Select sinking or sourcing input wiring to match a sensor type",
          "Describe why safety functions use dedicated safety-rated devices",
        ]),
      ]),
      mod("communication-buses", "Communication Buses", "Moving data between devices.", [
        unit("serial-buses", "UART, SPI and I2C", "Serial protocols for chips and sensors.", [
          "Compute the transmission time of a UART frame from baud rate and frame format",
          "Compare UART, SPI and I2C on wire count, speed and addressing",
          "Interpret an I2C transaction to read a register from a sensor",
        ]),
        unit("fieldbus-can", "CAN and Industrial Networks", "Robust communication in vehicles and machines.", [
          "Explain how CAN arbitration resolves simultaneous transmissions by message priority",
          "Estimate bus load from message size, rate and bit rate",
          "Select a communication standard for a long, noisy industrial link",
        ]),
      ]),
      mod("robot-kinematics", "Introduction to Robot Kinematics", "Geometry of manipulators.", [
        unit("forward-kinematics", "Forward Kinematics", "End-effector position from joint values.", [
          "Compute the end-effector position of a two-link planar arm from joint angles",
          "Construct a homogeneous transformation matrix for a rotation and translation",
          "Count the degrees of freedom of a serial manipulator and its workspace type",
        ]),
        unit("inverse-kinematics-jacobian", "Inverse Kinematics and the Jacobian", "Joint values from a desired pose, and velocity mapping.", [
          "Solve the inverse kinematics of a two-link planar arm for a target point",
          "Derive the Jacobian of a two-link arm and compute end-effector velocity",
          "Identify singular configurations where the Jacobian loses rank",
        ]),
      ]),
      mod("integration-lab", "Integration Laboratory", "Combining sensing, computing and actuation into a loop.", [
        unit("sensor-actuator-loop", "Sensor-Actuator Loop Design", "A closed loop with timing constraints.", [
          "Specify a control loop rate from the plant bandwidth and sensor update rate",
          "Build a timing budget covering sampling, computation and actuation",
          "Add limits and fault handling so an unplugged sensor drives the actuator to a safe state",
        ]),
        unit("test-debug", "Testing and Debugging", "Systematic debugging of hardware and software.", [
          "Use an oscilloscope to verify PWM frequency and duty cycle",
          "Isolate a fault to hardware or software by substituting a known-good signal",
          "Record a test log showing expected and measured outputs for each function",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE314
  {
    slug: "mce-advanced-heat-transfer",
    code: "MCE314",
    name: "Advanced Heat Transfer and Energy Systems",
    shortName: "Adv Heat Transfer",
    description:
      "Design-oriented thermal engineering: heat exchanger design, two-phase flow, electronics cooling, solar thermal systems, combustion, introductory CFD, thermal management and energy storage.",
    year: "Year3",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: color(2),
    icon: "Thermometer",
    provenance: provenance(SOURCE_POOL.georgiaTech, SOURCE_POOL.stanford),
    modules: [
      mod("heat-exchanger-design", "Heat Exchanger Design", "Sizing and rating exchangers.", [
        unit("lmtd-ntu", "LMTD and Effectiveness-NTU Methods", "Choosing and applying the right method.", [
          "Calculate the log mean temperature difference for counterflow and parallel flow",
          "Apply the effectiveness-NTU method to find outlet temperatures of a given exchanger",
          "Select LMTD or effectiveness-NTU depending on which quantities are known",
        ]),
        unit("exchanger-sizing", "Sizing, Fouling and Pressure Drop", "Overall coefficient and practical limits.", [
          "Compute the overall heat transfer coefficient including fouling resistances",
          "Determine the required heat transfer area for a specified duty",
          "Estimate the pumping power penalty of a design with higher heat transfer coefficient",
        ]),
      ]),
      mod("two-phase-flow", "Boiling, Condensation and Two-Phase Flow", "Heat transfer with phase change.", [
        unit("boiling", "Pool and Flow Boiling", "Boiling regimes and critical heat flux.", [
          "Identify the pool boiling regimes on a boiling curve",
          "Estimate critical heat flux for saturated pool boiling from a standard correlation",
          "Explain why heat-flux-controlled surfaces can burn out at critical heat flux",
        ]),
        unit("condensation", "Condensation", "Film and dropwise condensation.", [
          "Compute the film condensation heat transfer coefficient on a vertical plate using a Nusselt-type correlation",
          "Calculate the condensate rate from heat duty and latent heat",
          "Compare film and dropwise condensation on heat transfer coefficient",
        ]),
      ]),
      mod("electronics-cooling", "Electronics Cooling", "Keeping devices below their temperature limits.", [
        unit("thermal-resistance-networks", "Junction-to-Ambient Thermal Networks", "Series resistance from chip to air.", [
          "Build a thermal resistance network from junction to ambient for a packaged chip",
          "Calculate junction temperature from power dissipation and total thermal resistance",
          "Identify the dominant resistance in a network and propose an improvement",
        ]),
        unit("heat-sinks", "Heat Sinks and Airflow", "Finned surfaces and fan selection.", [
          "Calculate heat dissipated by a fin array using fin efficiency",
          "Determine the airflow needed to carry a given power with a limited air temperature rise",
          "Find the operating point of a fan against a heat sink pressure-drop curve",
        ]),
      ]),
      mod("solar-thermal", "Solar Thermal Systems", "Collecting and using solar heat.", [
        unit("solar-geometry", "Solar Radiation Basics", "Incident radiation on a collector.", [
          "Compute the angle of incidence on a tilted surface for a given sun position",
          "Estimate absorbed radiation from irradiance, absorptance and area",
          "Explain the role of the selective surface in reducing radiative loss",
        ]),
        unit("collector-performance", "Collector Performance", "Efficiency and storage matching.", [
          "Apply the Hottel-Whillier equation to estimate collector useful heat gain",
          "Compute collector efficiency at a given operating temperature difference",
          "Size a hot-water storage tank for a stated daily demand",
        ]),
      ]),
      mod("combustion-applications", "Combustion Applications", "Burning fuel for heat.", [
        unit("combustion-stoichiometry", "Stoichiometry and Flame Temperature", "Air requirements and energy release.", [
          "Balance a hydrocarbon combustion reaction and compute stoichiometric air-fuel ratio",
          "Calculate the excess air from a dry flue gas oxygen measurement",
          "Estimate adiabatic flame temperature from an enthalpy balance",
        ]),
        unit("burners-efficiency", "Boiler and Burner Efficiency", "Losses and emissions.", [
          "Compute boiler efficiency from stack loss, radiation loss and other losses",
          "Explain how excess air trades combustion completeness against stack loss",
          "Identify the conditions that raise NOx formation",
        ]),
      ]),
      mod("cfd-intro", "Introduction to CFD", "Numerical solution of flow and heat transfer.", [
        unit("cfd-workflow", "CFD Workflow and Discretisation", "From geometry to results.", [
          "Outline the steps of a CFD study from geometry preparation to post-processing",
          "Explain the difference between finite volume and finite difference discretisation",
          "Choose between first-order and second-order upwind schemes with regard to accuracy and stability",
        ]),
        unit("cfd-turbulence-checks", "Turbulence Modelling and Checks", "Wall treatment and verification.", [
          "Estimate the first cell height from a target y+ value",
          "State when a RANS turbulence model is appropriate rather than direct simulation",
          "Check a CFD result against a simple energy balance and a correlation",
        ]),
      ]),
      mod("thermal-management", "Thermal Management", "System-level thermal design.", [
        unit("thermal-design-process", "Thermal Design Process", "Budgets, margins and trade-offs.", [
          "Create a heat-flow budget for a system with several heat sources",
          "Apply a design margin to maximum allowable component temperatures",
          "Compare passive and active cooling options on cost, noise and reliability",
        ]),
        unit("thermal-interfaces", "Interfaces and Spreading", "Contact resistance and heat spreading.", [
          "Calculate temperature drop across a thermal interface material from its conductivity and thickness",
          "Explain why heat spreading reduces peak temperature under a small heat source",
          "Estimate the effect of contact pressure on interface resistance qualitatively",
        ]),
      ]),
      mod("energy-storage", "Energy Storage", "Holding energy for later use.", [
        unit("thermal-storage", "Thermal Energy Storage", "Sensible and latent storage.", [
          "Compute the energy stored in a sensible heat store from mass, specific heat and temperature rise",
          "Calculate the capacity of a phase-change material store including latent heat",
          "Compare sensible and latent storage on energy density and temperature stability",
        ]),
        unit("battery-thermal", "Battery and Electrical Storage Considerations", "Energy density and thermal limits.", [
          "Calculate heat generation in a battery pack from current and internal resistance",
          "Compare storage technologies by specific energy, specific power and round-trip efficiency",
          "Evaluate the temperature rise of a battery pack in the absence of cooling",
        ]),
      ]),
    ],
  },

  // ---------------------------------------------------------------- MCE315
  {
    slug: "mce-engineering-practice-ethics",
    code: "MCE315",
    name: "Engineering Practice, Ethics and Management",
    shortName: "Eng Practice",
    description:
      "Professional practice for engineers: ethics and codes of conduct, risk and safety, sustainability and life-cycle assessment, engineering economics, intellectual property, teamwork, communication and professional registration.",
    year: "Year3",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: color(3),
    icon: "ShieldCheck",
    provenance: provenance(SOURCE_POOL.imperial),
    modules: [
      mod("ethics-codes", "Ethics and Professional Codes", "Responsibilities of a professional engineer.", [
        unit("codes-of-conduct", "Codes of Conduct", "Public safety and professional duty.", [
          "Explain the duty to hold paramount the safety and welfare of the public",
          "Identify the clause of a professional code that applies to a described dilemma",
          "Distinguish a legal obligation from an ethical obligation with an example",
        ]),
        unit("ethical-cases", "Ethical Case Analysis", "Reasoning through dilemmas.", [
          "Apply a structured ethical decision framework to a case study",
          "Evaluate the options available to an engineer who finds a safety issue that management ignores",
          "Assess conflicts of interest and describe how to disclose or manage them",
        ]),
      ]),
      mod("risk-safety", "Risk and Safety", "Identifying, quantifying and controlling hazards.", [
        unit("risk-assessment", "Risk Assessment", "Likelihood, severity and risk matrices.", [
          "Score a hazard using a likelihood and severity matrix",
          "Apply the hierarchy of controls to rank candidate risk reduction measures",
          "Calculate expected annual loss from event probability and consequence cost",
        ]),
        unit("safety-engineering", "Safety Engineering Methods", "Hazard analysis and safety standards.", [
          "Perform a basic hazard and operability study using guide words on a process line",
          "Construct a simple fault tree and compute the top-event probability for independent events",
          "Explain the legal duty of care in design for safe use and maintenance",
        ]),
      ]),
      mod("sustainability-lca", "Sustainability and Life-Cycle Assessment", "Measuring environmental impact over a product's life.", [
        unit("lca-method", "Life-Cycle Assessment Method", "Goal, inventory, impact and interpretation.", [
          "Define the functional unit and system boundary for an LCA study",
          "Compile a simple inventory of material and energy inputs for a product",
          "Compare two product designs on embodied carbon per functional unit",
        ]),
        unit("circular-design", "Circular and Sustainable Design", "Reducing impact by design.", [
          "Describe design strategies for reuse, repair, remanufacture and recycling",
          "Calculate the carbon payback time of a higher-embodied-energy design with lower operating energy",
          "Evaluate a design against sustainability principles and identify trade-offs",
        ]),
      ]),
      mod("engineering-economics", "Engineering Economics", "Judging designs and projects financially.", [
        unit("time-value-money", "Time Value of Money", "Present and annual worth.", [
          "Compute the present value of a future cash flow at a given discount rate",
          "Calculate the net present value of an investment with a stream of cash flows",
          "Convert between present worth and equivalent annual cost",
        ]),
        unit("project-appraisal", "Project Appraisal and Cost Estimation", "Comparing alternatives.", [
          "Compute the payback period of an investment",
          "Select between alternatives with unequal lives on equivalent annual cost",
          "Build a bottom-up cost estimate and add contingency for stated uncertainties",
        ]),
      ]),
      mod("intellectual-property", "Intellectual Property", "Protecting and respecting inventions.", [
        unit("ip-types", "Patents, Designs, Copyright and Trade Secrets", "What each form of protection covers.", [
          "Distinguish patents, registered designs, copyright and trade secrets by what they protect",
          "State the criteria of novelty, inventive step and industrial applicability for a patent",
          "Identify which form of protection suits a given product feature",
        ]),
        unit("ip-practice", "IP in Engineering Practice", "Searching, licensing and avoiding infringement.", [
          "Conduct a basic patent search using classification and keywords",
          "Identify the independent claim of a patent and decide whether a design falls within it",
          "Explain how employment and collaboration agreements affect IP ownership",
        ]),
      ]),
      mod("teamwork-management", "Teamwork and Project Leadership", "Working effectively in engineering teams.", [
        unit("team-dynamics", "Team Roles and Dynamics", "Forming, conflict and decisions.", [
          "Describe the stages of team development and typical issues at each stage",
          "Assign team roles and responsibilities using a responsibility matrix",
          "Resolve a described team conflict using an evidence-based approach",
        ]),
        unit("project-control", "Project Planning and Control", "Schedule, cost and risk.", [
          "Create a critical path schedule from a task list with durations and dependencies",
          "Track project progress with planned versus actual cost and schedule",
          "Maintain a risk register with likelihood, impact and mitigation actions",
        ]),
      ]),
      mod("engineering-communication", "Engineering Communication", "Writing and presenting technical work.", [
        unit("technical-writing", "Technical Reports and Documentation", "Clear, structured, evidence-based writing.", [
          "Structure a technical report with a purpose, method, results and conclusions",
          "Present quantitative data in a figure or table with labelled axes, units and uncertainty",
          "Cite sources consistently and distinguish evidence from opinion",
        ]),
        unit("presentation", "Presentations and Stakeholder Communication", "Tailoring the message to the audience.", [
          "Prepare a short presentation that answers one clear technical question",
          "Adapt a technical explanation for a non-technical decision maker",
          "Respond to challenging questions by referring to the supporting evidence",
        ]),
      ]),
      mod("professional-registration", "Professional Registration and Careers", "Routes to chartered or licensed status.", [
        unit("registration-routes", "Registration Routes", "Accreditation and licensure.", [
          "Outline the steps from an accredited degree to professional registration in one jurisdiction",
          "Describe the competences expected of a professional engineer",
          "Explain the purpose of continuing professional development",
        ]),
        unit("career-planning", "Career Planning", "Reflecting and planning.", [
          "Write a personal development plan with measurable goals and timescales",
          "Map your skills to the requirements of a chosen role in industry",
          "Reflect on a project experience using a structured reflective model",
        ]),
      ]),
    ],
  },
];

export const MCE_YEAR_3: CourseSpec[] = COURSES;
