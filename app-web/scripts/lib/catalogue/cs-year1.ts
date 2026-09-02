import type { CourseSpec } from "../undergrad-course";
import { CS_PALETTE, paletteColor } from "../undergrad-course";

/**
 * BSc Computer Science, Year 1 — the consensus core taught in the first year at
 * MIT (6.1010 / 6.1200 / 6.1910), Cambridge (Foundations, Discrete Maths,
 * Digital Electronics, Algorithms, Databases) and Imperial (Programming,
 * Discrete Structures, Architecture, Logic, Databases 1).
 */
const PROGRAMME = "bsc-computer-science";

export const CS_YEAR_1: CourseSpec[] = [
  {
    slug: "cs-programming-fundamentals",
    code: "CSC101",
    name: "Programming Fundamentals",
    shortName: "Programming",
    description:
      "Writing correct programs from first principles: values and types, control flow, functions, collections, modularity and object-oriented design, with testing and debugging throughout.",
    year: "Year1",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 0),
    icon: "Code",
    modules: [
      {
        slug: "values-and-types",
        name: "Values, Types and Expressions",
        summary: "The atoms of a program — what a value is, how types constrain it, and how expressions combine them.",
        units: [
          {
            slug: "primitive-types",
            name: "Primitive Types",
            summary: "Integers, floating-point numbers, booleans and characters, and how each is stored.",
            objectives: [
              "Name the primitive types of a typical language and state what each can represent",
              "Explain why integer and floating-point arithmetic can give different answers for the same expression",
              "Predict the value and type of a simple expression",
            ],
          },
          {
            slug: "expressions-and-operators",
            name: "Expressions and Operators",
            summary: "Operator precedence, associativity and evaluation order in arithmetic, comparison and logical expressions.",
            objectives: [
              "Evaluate an expression by applying precedence and associativity rules in the correct order",
              "Use comparison and logical operators to build a compound condition",
              "Explain short-circuit evaluation and give a case where it changes program behaviour",
            ],
          },
          {
            slug: "type-conversion",
            name: "Type Conversion and Type Safety",
            summary: "Implicit widening, explicit casts, and the errors that follow from losing information.",
            objectives: [
              "Distinguish implicit conversion from an explicit cast",
              "Identify where a conversion loses precision or overflows",
              "Explain what static typing catches that dynamic typing does not",
            ],
          },
        ],
      },
      {
        slug: "control-flow",
        name: "Control Flow",
        summary: "Choosing between paths and repeating work — the two ways a program departs from straight-line execution.",
        units: [
          {
            slug: "conditionals",
            name: "Conditionals",
            summary: "if, else-if chains and switch, and how to structure a decision without redundant tests.",
            objectives: [
              "Write an if/else-if chain that covers every case exactly once",
              "Rewrite nested conditionals into a flatter, equivalent form",
              "Trace which branch executes for given inputs",
            ],
          },
          {
            slug: "loops",
            name: "Loops and Iteration",
            summary: "while, for and do-while loops, loop counters, and the conditions that terminate them.",
            objectives: [
              "Choose the appropriate loop form for a counted, sentinel or condition-driven repetition",
              "State a loop's termination condition and argue that it is reached",
              "Identify and fix an off-by-one error in a loop bound",
            ],
          },
          {
            slug: "nested-iteration",
            name: "Nested Iteration and Loop Patterns",
            summary: "Nested loops, accumulation, search and early exit — the patterns that recur in every program.",
            objectives: [
              "Implement accumulation, search and filter patterns with loops",
              "Use break and continue correctly without obscuring control flow",
              "State how many times the body of a nested loop executes for given bounds",
            ],
          },
        ],
      },
      {
        slug: "functions",
        name: "Functions and Abstraction",
        summary: "Naming a computation so it can be reused, reasoned about and tested in isolation.",
        units: [
          {
            slug: "defining-functions",
            name: "Defining and Calling Functions",
            summary: "Parameters, arguments, return values, and the contract a function promises its caller.",
            objectives: [
              "Define a function with parameters and a return value, and call it correctly",
              "State a function's contract as a precondition and a postcondition",
              "Explain the difference between pass-by-value and pass-by-reference",
            ],
          },
          {
            slug: "scope-and-lifetime",
            name: "Scope and Lifetime",
            summary: "Where a name is visible, how long its value lives, and why globals cause trouble.",
            objectives: [
              "Determine the scope of a variable and which declaration a name resolves to",
              "Distinguish a variable's scope from its lifetime",
              "Explain why shared mutable global state makes a program hard to reason about",
            ],
          },
          {
            slug: "recursion",
            name: "Recursion",
            summary: "Functions defined in terms of themselves, with a base case that guarantees termination.",
            objectives: [
              "Write a recursive function with a correct base case and a shrinking argument",
              "Trace a recursive call stack and state its depth for a given input",
              "Convert a simple recursion into an equivalent loop",
            ],
          },
        ],
      },
      {
        slug: "collections",
        name: "Collections",
        summary: "Grouping many values — the built-in structures every program uses before it needs custom ones.",
        units: [
          {
            slug: "arrays-and-lists",
            name: "Arrays and Lists",
            summary: "Indexed sequences, fixed versus growable, and the cost of each operation.",
            objectives: [
              "Access, insert and remove elements of an indexed sequence",
              "State the cost of indexing, appending and inserting at the front",
              "Explain how a growable array achieves amortised constant-time append",
            ],
          },
          {
            slug: "maps-and-sets",
            name: "Maps and Sets",
            summary: "Key-value association and membership testing, and when each is the right choice.",
            objectives: [
              "Use a map to associate keys with values and a set to test membership",
              "Choose between a list and a map for a lookup-heavy task, with justification",
              "State what makes a value usable as a key",
            ],
          },
          {
            slug: "strings",
            name: "Strings and Text",
            summary: "Text as a sequence of characters, immutability, and the cost of naive concatenation.",
            objectives: [
              "Perform indexing, slicing, searching and splitting on strings",
              "Explain why repeated concatenation in a loop can be quadratic",
              "Describe how characters beyond ASCII are encoded",
            ],
          },
        ],
      },
      {
        slug: "program-structure",
        name: "Program Structure and Errors",
        summary: "Organising code across files and handling the cases where things go wrong.",
        units: [
          {
            slug: "modules",
            name: "Modules and Namespaces",
            summary: "Splitting a program into units with explicit interfaces and controlled visibility.",
            objectives: [
              "Split a program into modules with a clear public interface",
              "Explain how namespaces prevent name collisions",
              "Justify hiding an implementation detail behind an interface",
            ],
          },
          {
            slug: "error-handling",
            name: "Errors and Exceptions",
            summary: "Distinguishing expected failure from a bug, and propagating errors without losing information.",
            objectives: [
              "Distinguish a recoverable error from a programming defect",
              "Use exceptions to propagate a failure to a level that can handle it",
              "Explain why silently swallowing an exception is harmful",
            ],
          },
          {
            slug: "files-and-io",
            name: "Files and Input/Output",
            summary: "Reading and writing external data, and why I/O fails in ways computation does not.",
            objectives: [
              "Read and write a text file, releasing the resource afterwards",
              "Handle a missing or malformed input file without crashing",
              "Explain why I/O is slow relative to in-memory computation",
            ],
          },
        ],
      },
      {
        slug: "object-oriented",
        name: "Object-Oriented Foundations",
        summary: "Bundling state with the operations on it — the dominant way large programs are organised.",
        units: [
          {
            slug: "classes-and-objects",
            name: "Classes and Objects",
            summary: "Defining a type with fields and methods, and constructing instances of it.",
            objectives: [
              "Define a class with fields, a constructor and methods, and create instances",
              "Distinguish a class from an instance, and instance state from class state",
              "Explain what the receiver (this/self) refers to inside a method",
            ],
          },
          {
            slug: "encapsulation",
            name: "Encapsulation and Invariants",
            summary: "Protecting internal state so an object cannot be put into an invalid configuration.",
            objectives: [
              "State a class invariant and show how the constructor establishes it",
              "Use visibility modifiers to prevent external code breaking an invariant",
              "Explain why returning a reference to internal mutable state is dangerous",
            ],
          },
          {
            slug: "inheritance-and-polymorphism",
            name: "Inheritance and Polymorphism",
            summary: "Subtypes that can stand in for their supertype, and dispatch chosen at run time.",
            objectives: [
              "Define a subclass that overrides a method of its superclass",
              "Explain dynamic dispatch and predict which implementation runs",
              "State the substitution principle and give an example that violates it",
            ],
          },
        ],
      },
      {
        slug: "correctness",
        name: "Correctness and Testing",
        summary: "Establishing that a program does what it claims, and finding out quickly when it does not.",
        units: [
          {
            slug: "unit-testing",
            name: "Unit Testing",
            summary: "Writing tests that pin behaviour down, including the boundaries and the empty case.",
            objectives: [
              "Write unit tests covering typical, boundary and error cases",
              "Explain why a test suite that only tests the happy path gives false confidence",
              "Choose test inputs that partition the input space",
            ],
          },
          {
            slug: "debugging",
            name: "Debugging",
            summary: "Locating a defect by forming and testing hypotheses rather than by guessing.",
            objectives: [
              "Reduce a failing case to a minimal reproducible example",
              "Use a debugger or targeted logging to locate the first incorrect state",
              "Distinguish the symptom of a defect from its cause",
            ],
          },
          {
            slug: "invariants-and-assertions",
            name: "Invariants and Assertions",
            summary: "Stating what must always be true and checking it where it could fail.",
            objectives: [
              "Write an assertion that documents an assumption at a point in the code",
              "Identify a loop invariant for a simple loop",
              "Explain the difference between an assertion and input validation",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-discrete-mathematics",
    code: "CSC102",
    name: "Discrete Mathematics",
    shortName: "Discrete Maths",
    description:
      "The mathematical language of computing: logic and proof, sets, relations and functions, induction, counting, graphs and elementary number theory.",
    year: "Year1",
    semester: 1,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 1),
    icon: "MathOperations",
    modules: [
      {
        slug: "logic-and-proof",
        name: "Logic and Proof",
        summary: "Stating a claim precisely and establishing it beyond doubt — the basic skill the rest of the course assumes.",
        units: [
          {
            slug: "propositional-logic",
            name: "Propositional Logic",
            summary: "Connectives, truth tables, tautology and logical equivalence.",
            objectives: [
              "Construct a truth table for a compound proposition",
              "Decide whether two propositions are logically equivalent",
              "Translate an English statement into propositional form",
            ],
          },
          {
            slug: "predicates-and-quantifiers",
            name: "Predicates and Quantifiers",
            summary: "Universal and existential quantification, nesting, and negation.",
            objectives: [
              "Translate a quantified English statement into predicate logic and back",
              "Negate a quantified statement correctly",
              "Explain how the order of nested quantifiers changes meaning",
            ],
          },
          {
            slug: "proof-techniques",
            name: "Proof Techniques",
            summary: "Direct proof, proof by contraposition, contradiction and counterexample.",
            objectives: [
              "Prove a simple implication directly and by contraposition",
              "Construct a proof by contradiction and identify the contradiction reached",
              "Disprove a universal claim with a counterexample",
            ],
          },
        ],
      },
      {
        slug: "sets-relations-functions",
        name: "Sets, Relations and Functions",
        summary: "The vocabulary used to describe every structure in computing.",
        units: [
          {
            slug: "sets",
            name: "Sets and Set Operations",
            summary: "Membership, subsets, union, intersection, complement, power sets and Cartesian products.",
            objectives: [
              "Compute unions, intersections, complements and Cartesian products",
              "Prove a set identity using element-wise argument or set algebra",
              "State the cardinality of a power set and justify it",
            ],
          },
          {
            slug: "relations",
            name: "Relations",
            summary: "Reflexivity, symmetry, transitivity, equivalence relations and partial orders.",
            objectives: [
              "Test a relation for reflexivity, symmetry, antisymmetry and transitivity",
              "Identify an equivalence relation and describe its equivalence classes",
              "Recognise a partial order and draw its Hasse diagram",
            ],
          },
          {
            slug: "functions",
            name: "Functions",
            summary: "Domain, codomain, image, injectivity, surjectivity, bijection and composition.",
            objectives: [
              "Determine whether a function is injective, surjective or bijective",
              "Compose two functions and state the domain of the result",
              "Explain why only a bijection has an inverse function",
            ],
          },
        ],
      },
      {
        slug: "induction",
        name: "Induction and Recursion",
        summary: "Proving a statement for infinitely many cases, and defining structures in terms of themselves.",
        units: [
          {
            slug: "mathematical-induction",
            name: "Mathematical Induction",
            summary: "Base case, inductive step, and why the principle is valid.",
            objectives: [
              "Prove a summation formula by induction, stating base case and inductive step",
              "Identify where an inductive proof uses the inductive hypothesis",
              "Spot the flaw in an invalid inductive argument",
            ],
          },
          {
            slug: "strong-induction",
            name: "Strong and Structural Induction",
            summary: "Assuming all smaller cases, and inducting over recursively defined structures.",
            objectives: [
              "Use strong induction where ordinary induction is insufficient",
              "Prove a property of a recursively defined structure by structural induction",
              "Give a recursive definition of a set or sequence",
            ],
          },
          {
            slug: "recurrence-relations",
            name: "Recurrence Relations",
            summary: "Describing a sequence by its predecessors and solving for a closed form.",
            objectives: [
              "Set up a recurrence relation from a recursive process",
              "Solve a first-order linear recurrence to a closed form",
              "Verify a proposed closed form by induction",
            ],
          },
        ],
      },
      {
        slug: "combinatorics",
        name: "Counting and Combinatorics",
        summary: "Counting configurations without enumerating them — the basis of complexity and probability.",
        units: [
          {
            slug: "counting-principles",
            name: "Counting Principles",
            summary: "Sum rule, product rule, inclusion-exclusion and the pigeonhole principle.",
            objectives: [
              "Apply the sum and product rules to a multi-stage counting problem",
              "Use inclusion-exclusion to count a union of overlapping sets",
              "Apply the pigeonhole principle to prove an existence claim",
            ],
          },
          {
            slug: "permutations-and-combinations",
            name: "Permutations and Combinations",
            summary: "Ordered and unordered selection, with and without repetition.",
            objectives: [
              "Distinguish a permutation from a combination in a worded problem",
              "Compute the number of selections with and without repetition",
              "Count arrangements subject to a constraint",
            ],
          },
          {
            slug: "binomial-theorem",
            name: "Binomial Coefficients",
            summary: "Pascal's identity, the binomial theorem and combinatorial proof.",
            objectives: [
              "Expand a binomial power using the binomial theorem",
              "Prove Pascal's identity combinatorially",
              "Use binomial coefficients to count lattice paths or subsets",
            ],
          },
        ],
      },
      {
        slug: "graph-theory",
        name: "Graph Theory",
        summary: "Vertices and edges — the model behind networks, dependencies, maps and state spaces.",
        units: [
          {
            slug: "graphs-and-representation",
            name: "Graphs and Their Representation",
            summary: "Directed and undirected graphs, degree, adjacency matrices and adjacency lists.",
            objectives: [
              "Represent a graph as an adjacency matrix and an adjacency list",
              "Apply the handshake lemma relating degree sum to edge count",
              "Choose a representation given the density of a graph",
            ],
          },
          {
            slug: "paths-and-connectivity",
            name: "Paths, Cycles and Connectivity",
            summary: "Walks, paths, cycles, connected components, Euler and Hamiltonian paths.",
            objectives: [
              "Determine whether a graph is connected and count its components",
              "State and apply the condition for a graph to have an Euler circuit",
              "Distinguish an Euler path from a Hamiltonian path",
            ],
          },
          {
            slug: "trees",
            name: "Trees",
            summary: "Acyclic connected graphs, rooted trees, spanning trees and their properties.",
            objectives: [
              "Prove that a tree on n vertices has exactly n − 1 edges",
              "Identify a spanning tree of a connected graph",
              "Describe rooted-tree terminology: root, parent, leaf, height",
            ],
          },
        ],
      },
      {
        slug: "number-theory",
        name: "Number Theory for Computing",
        summary: "Divisibility and modular arithmetic, the mathematics underneath hashing and cryptography.",
        units: [
          {
            slug: "divisibility-and-modular",
            name: "Divisibility and Modular Arithmetic",
            summary: "The division algorithm, congruence, and arithmetic modulo n.",
            objectives: [
              "Apply the division algorithm to find quotient and remainder",
              "Perform addition and multiplication modulo n",
              "Decide whether two integers are congruent modulo n",
            ],
          },
          {
            slug: "gcd-and-euclid",
            name: "GCD and the Euclidean Algorithm",
            summary: "Greatest common divisors, the Euclidean algorithm and Bézout's identity.",
            objectives: [
              "Compute a gcd using the Euclidean algorithm, showing each step",
              "Use the extended Euclidean algorithm to express a gcd as a linear combination",
              "Find a modular multiplicative inverse where one exists",
            ],
          },
          {
            slug: "primes-and-applications",
            name: "Primes and Applications",
            summary: "Prime factorisation, Fermat's little theorem and the idea behind public-key cryptography.",
            objectives: [
              "State the fundamental theorem of arithmetic and factorise an integer",
              "Apply Fermat's little theorem to simplify a modular power",
              "Explain at a high level why factoring difficulty underpins RSA",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-computer-systems",
    code: "CSC103",
    name: "Computer Systems and Architecture",
    shortName: "Systems",
    description:
      "How a machine actually runs a program: binary representation, digital logic, instruction set architecture, assembly, the memory hierarchy and what determines performance.",
    year: "Year1",
    semester: 1,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 2),
    icon: "Cpu",
    modules: [
      {
        slug: "data-representation",
        name: "Data Representation",
        summary: "Everything in a computer is a bit pattern — how numbers and characters are encoded, and where the encodings break down.",
        units: [
          {
            slug: "number-bases",
            name: "Binary, Hexadecimal and Conversion",
            summary: "Positional notation in base 2 and 16, and converting between bases.",
            objectives: [
              "Convert between decimal, binary and hexadecimal representations",
              "Explain why hexadecimal is used as shorthand for binary",
              "Perform binary addition and identify a carry out of the most significant bit",
            ],
          },
          {
            slug: "integer-representation",
            name: "Signed Integers and Overflow",
            summary: "Two's complement, the asymmetric range, and what happens when a result will not fit.",
            objectives: [
              "Represent a negative integer in two's complement and convert it back",
              "State the range of an n-bit two's complement integer",
              "Detect signed overflow in an addition and explain its consequence",
            ],
          },
          {
            slug: "floating-point",
            name: "Floating-Point Numbers",
            summary: "Sign, exponent and mantissa, precision limits and why 0.1 + 0.2 is not 0.3.",
            objectives: [
              "Describe the sign, exponent and mantissa fields of an IEEE 754 number",
              "Explain why many decimal fractions cannot be represented exactly",
              "Identify where rounding error accumulates in a computation",
            ],
          },
        ],
      },
      {
        slug: "digital-logic",
        name: "Digital Logic",
        summary: "Building arithmetic and memory out of gates — the layer between physics and instructions.",
        units: [
          {
            slug: "boolean-algebra",
            name: "Boolean Algebra and Gates",
            summary: "AND, OR, NOT, NAND, XOR, truth tables and algebraic simplification.",
            objectives: [
              "Write the truth table of a gate network",
              "Simplify a Boolean expression using algebraic identities or a Karnaugh map",
              "Explain why NAND is functionally complete",
            ],
          },
          {
            slug: "combinational-circuits",
            name: "Combinational Circuits",
            summary: "Adders, multiplexers and decoders — circuits whose output depends only on current input.",
            objectives: [
              "Design a half adder and a full adder from gates",
              "Explain the role of a multiplexer and a decoder in a datapath",
              "Analyse propagation delay through a combinational network",
            ],
          },
          {
            slug: "sequential-circuits",
            name: "Sequential Circuits and State",
            summary: "Flip-flops, registers and clocking — how a circuit remembers.",
            objectives: [
              "Distinguish combinational from sequential logic",
              "Describe how a D flip-flop stores a bit across a clock edge",
              "Explain how the clock period relates to the longest combinational path",
            ],
          },
        ],
      },
      {
        slug: "processor-architecture",
        name: "Processor Architecture",
        summary: "The contract between hardware and software, and the machinery that honours it.",
        units: [
          {
            slug: "instruction-set-architecture",
            name: "Instruction Set Architecture",
            summary: "Instruction formats, addressing modes and the RISC/CISC distinction.",
            objectives: [
              "Describe the fields of a typical instruction encoding",
              "Compare register, immediate and memory addressing modes",
              "State what an ISA guarantees to a compiler writer",
            ],
          },
          {
            slug: "datapath-and-control",
            name: "Datapath and Control",
            summary: "ALU, register file, buses and the control signals that steer them.",
            objectives: [
              "Identify the datapath components used by a given instruction",
              "Explain the role of the control unit in instruction execution",
              "Trace data movement through the datapath for an arithmetic instruction",
            ],
          },
          {
            slug: "instruction-cycle",
            name: "The Instruction Execution Cycle",
            summary: "Fetch, decode, execute, memory access and write-back.",
            objectives: [
              "List the stages of the instruction cycle and what happens in each",
              "Explain the role of the program counter and how branching changes it",
              "Count the cycles a simple instruction sequence requires",
            ],
          },
        ],
      },
      {
        slug: "assembly",
        name: "Assembly and Machine Code",
        summary: "Reading the code the processor actually executes, and how high-level constructs compile down to it.",
        units: [
          {
            slug: "assembly-basics",
            name: "Assembly Language Basics",
            summary: "Registers, load/store, arithmetic and branch instructions.",
            objectives: [
              "Read a short assembly listing and state what it computes",
              "Translate a simple arithmetic expression into assembly",
              "Explain the load/store discipline for accessing memory",
            ],
          },
          {
            slug: "control-in-assembly",
            name: "Control Flow in Assembly",
            summary: "Conditional branches, comparisons, loops and jump targets.",
            objectives: [
              "Implement an if/else and a loop using conditional branches",
              "Explain how condition flags are set and tested",
              "Convert a while loop into branch-based assembly",
            ],
          },
          {
            slug: "procedures-and-stack",
            name: "Procedures and the Stack",
            summary: "Calling conventions, the stack frame, arguments, return addresses and locals.",
            objectives: [
              "Describe the contents of a stack frame during a procedure call",
              "Explain how the return address enables a call to resume correctly",
              "State why a calling convention must be agreed between caller and callee",
            ],
          },
        ],
      },
      {
        slug: "memory-hierarchy",
        name: "The Memory Hierarchy",
        summary: "Fast memory is small and slow memory is large — caching is how the gap is hidden.",
        units: [
          {
            slug: "memory-technologies",
            name: "Memory Technologies and Locality",
            summary: "Registers, SRAM, DRAM and storage, and the temporal and spatial locality caches exploit.",
            objectives: [
              "Order the levels of the memory hierarchy by speed, size and cost",
              "Distinguish temporal from spatial locality with an example",
              "Explain why locality makes caching effective",
            ],
          },
          {
            slug: "caches",
            name: "Caches",
            summary: "Cache lines, direct-mapped and set-associative placement, hits, misses and replacement.",
            objectives: [
              "Compute a cache hit rate for a given access sequence",
              "Compare direct-mapped and set-associative placement",
              "Explain the effect of cache line size on spatial locality",
            ],
          },
          {
            slug: "cache-aware-code",
            name: "Writing Cache-Friendly Code",
            summary: "How array traversal order and data layout change real running time.",
            objectives: [
              "Explain why row-major traversal of a 2D array outperforms column-major",
              "Identify a memory access pattern with poor locality",
              "Estimate the effect of a cache miss on effective access time",
            ],
          },
        ],
      },
      {
        slug: "performance",
        name: "Performance",
        summary: "Measuring speed honestly, and the two ways architectures get faster.",
        units: [
          {
            slug: "measuring-performance",
            name: "Measuring Performance",
            summary: "CPU time, clock rate, cycles per instruction and the CPU performance equation.",
            objectives: [
              "Compute CPU time from instruction count, CPI and clock rate",
              "Explain why clock rate alone is a poor measure of performance",
              "Compare two designs using the CPU performance equation",
            ],
          },
          {
            slug: "pipelining",
            name: "Pipelining",
            summary: "Overlapping instruction stages for throughput, and the hazards that stall the pipeline.",
            objectives: [
              "Explain how pipelining improves throughput without reducing latency",
              "Identify data, control and structural hazards in an instruction sequence",
              "Compute the speedup of an ideal k-stage pipeline",
            ],
          },
          {
            slug: "parallelism",
            name: "Parallelism and Amdahl's Law",
            summary: "Multiple cores, the limits of speedup, and where parallelism pays.",
            objectives: [
              "Apply Amdahl's law to bound the speedup from parallelising part of a program",
              "Distinguish instruction-level from thread-level parallelism",
              "Explain why adding cores gives diminishing returns",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-data-structures-algorithms",
    code: "CSC104",
    name: "Data Structures and Algorithms",
    shortName: "Data Structures",
    description:
      "The core structures and algorithms every program is built from — complexity analysis, lists, stacks and queues, sorting, hashing, trees, heaps and graph traversal.",
    year: "Year1",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 3),
    icon: "TreeStructure",
    modules: [
      {
        slug: "complexity",
        name: "Algorithmic Complexity",
        summary: "Describing how cost grows with input size, so two algorithms can be compared without running them.",
        units: [
          {
            slug: "asymptotic-notation",
            name: "Asymptotic Notation",
            summary: "Big-O, Omega and Theta, and what they do and do not tell you.",
            objectives: [
              "State the formal definition of big-O and apply it to a given function",
              "Rank common growth rates from slowest to fastest growing",
              "Explain why constant factors are omitted and when that matters in practice",
            ],
          },
          {
            slug: "analysing-algorithms",
            name: "Analysing Loops and Recursion",
            summary: "Counting operations in nested loops and solving simple recurrences.",
            objectives: [
              "Derive the time complexity of nested loops from their bounds",
              "Write and solve the recurrence for a divide-and-conquer algorithm",
              "Analyse the space complexity of a recursive algorithm",
            ],
          },
          {
            slug: "case-analysis",
            name: "Best, Average and Worst Case",
            summary: "Which case matters, and why amortised cost is different again.",
            objectives: [
              "Distinguish best-, average- and worst-case complexity for a given algorithm",
              "Explain amortised analysis using dynamic array growth",
              "Choose which case to optimise for given a stated requirement",
            ],
          },
        ],
      },
      {
        slug: "linear-structures",
        name: "Linear Structures",
        summary: "Sequences with different cost trade-offs — the first real design decision in a program.",
        units: [
          {
            slug: "dynamic-arrays",
            name: "Arrays and Dynamic Arrays",
            summary: "Contiguous storage, random access, and doubling growth.",
            objectives: [
              "State the cost of access, append, insert and delete for a dynamic array",
              "Explain why doubling on growth gives amortised O(1) append",
              "Choose an array over a linked list with justification",
            ],
          },
          {
            slug: "linked-lists",
            name: "Linked Lists",
            summary: "Singly and doubly linked nodes, insertion and deletion, and the cost of traversal.",
            objectives: [
              "Implement insertion and deletion at a known node in a linked list",
              "Compare singly and doubly linked lists for a given access pattern",
              "Explain why indexing a linked list is O(n)",
            ],
          },
          {
            slug: "stacks-and-queues",
            name: "Stacks and Queues",
            summary: "LIFO and FIFO discipline, and the problems each solves naturally.",
            objectives: [
              "Implement a stack and a queue with O(1) operations",
              "Use a stack to evaluate an expression or check balanced brackets",
              "Explain how a circular buffer implements a queue over an array",
            ],
          },
        ],
      },
      {
        slug: "sorting",
        name: "Sorting",
        summary: "The most studied problem in computing, and a showcase of algorithm design techniques.",
        units: [
          {
            slug: "elementary-sorts",
            name: "Elementary Sorting Algorithms",
            summary: "Insertion, selection and bubble sort — quadratic, but not useless.",
            objectives: [
              "Trace insertion sort and selection sort on a small array",
              "State the time and space complexity of each elementary sort",
              "Explain why insertion sort is preferred for small or nearly-sorted inputs",
            ],
          },
          {
            slug: "merge-sort",
            name: "Merge Sort",
            summary: "Divide, conquer and merge — a stable O(n log n) sort with extra space.",
            objectives: [
              "Describe the divide-and-conquer structure of merge sort",
              "Derive the O(n log n) running time from its recurrence",
              "Explain what stability means and why merge sort is stable",
            ],
          },
          {
            slug: "quicksort",
            name: "Quicksort and Lower Bounds",
            summary: "Partitioning, pivot choice, the quadratic worst case, and why comparison sorting cannot beat n log n.",
            objectives: [
              "Trace the partition step of quicksort for a given pivot",
              "Explain when quicksort degrades to O(n²) and how pivot choice mitigates it",
              "State the comparison-sorting lower bound and the idea behind its proof",
            ],
          },
        ],
      },
      {
        slug: "searching-and-hashing",
        name: "Searching and Hashing",
        summary: "Finding an item fast — by ordering it, or by computing where it should be.",
        units: [
          {
            slug: "binary-search",
            name: "Binary Search",
            summary: "Halving a sorted range, and the invariant that makes it correct.",
            objectives: [
              "Implement binary search with correct loop bounds",
              "State the loop invariant that guarantees correctness",
              "Explain why the input must be sorted and the cost of sorting first",
            ],
          },
          {
            slug: "hash-tables",
            name: "Hash Tables",
            summary: "Hash functions, buckets, load factor and expected constant-time lookup.",
            objectives: [
              "Explain how a hash function maps a key to a bucket index",
              "State the average and worst-case cost of hash table lookup",
              "Describe what makes a good hash function",
            ],
          },
          {
            slug: "collision-resolution",
            name: "Collision Resolution",
            summary: "Chaining and open addressing, load factor and rehashing.",
            objectives: [
              "Compare separate chaining with open addressing",
              "Explain how load factor affects performance and when to rehash",
              "Trace insertion into a hash table with linear probing",
            ],
          },
        ],
      },
      {
        slug: "trees",
        name: "Trees",
        summary: "Hierarchical structure with logarithmic depth — the workhorse of ordered data.",
        units: [
          {
            slug: "binary-trees",
            name: "Binary Trees and Traversal",
            summary: "Structure, height, and in-order, pre-order, post-order and level-order traversal.",
            objectives: [
              "Perform in-order, pre-order, post-order and level-order traversals",
              "Relate the height of a binary tree to its number of nodes",
              "Implement a traversal both recursively and with an explicit stack or queue",
            ],
          },
          {
            slug: "binary-search-trees",
            name: "Binary Search Trees",
            summary: "The ordering invariant, search, insertion, deletion, and degeneration to a list.",
            objectives: [
              "State the BST invariant and use it to search for a key",
              "Insert and delete a node while preserving the invariant",
              "Explain how insertion order can degrade a BST to O(n) operations",
            ],
          },
          {
            slug: "balanced-trees",
            name: "Balanced Trees",
            summary: "Why balance matters and how rotations restore it.",
            objectives: [
              "Explain why balancing guarantees O(log n) operations",
              "Describe how a rotation restores balance after an insertion",
              "Compare a balanced BST with a hash table for ordered access",
            ],
          },
        ],
      },
      {
        slug: "heaps",
        name: "Priority Queues and Heaps",
        summary: "Getting the smallest or largest item efficiently, repeatedly.",
        units: [
          {
            slug: "binary-heaps",
            name: "Binary Heaps",
            summary: "The heap property, array representation, sift-up and sift-down.",
            objectives: [
              "State the heap property and verify it for a given array",
              "Insert into and extract the minimum from a binary heap",
              "Explain the array indexing scheme for parent and child nodes",
            ],
          },
          {
            slug: "heapsort",
            name: "Heapsort and Heap Construction",
            summary: "Building a heap in linear time and sorting in place.",
            objectives: [
              "Describe how heapsort sorts in place using a heap",
              "Explain why bottom-up heap construction is O(n), not O(n log n)",
              "Compare heapsort with merge sort on time and space",
            ],
          },
          {
            slug: "priority-queue-applications",
            name: "Priority Queue Applications",
            summary: "Scheduling, event simulation and greedy algorithms that need the next-best item.",
            objectives: [
              "Model a scheduling problem using a priority queue",
              "Explain the role of a priority queue in a greedy algorithm",
              "Choose between a heap and a sorted list for a given usage pattern",
            ],
          },
        ],
      },
      {
        slug: "graphs",
        name: "Graph Algorithms",
        summary: "Traversing networks — the first algorithms that operate on relationships rather than sequences.",
        units: [
          {
            slug: "graph-representation",
            name: "Representing Graphs",
            summary: "Adjacency matrices and adjacency lists, and their space and time trade-offs.",
            objectives: [
              "Build an adjacency list and an adjacency matrix for a given graph",
              "Compare the space cost of each representation for sparse and dense graphs",
              "State the cost of enumerating a vertex's neighbours in each representation",
            ],
          },
          {
            slug: "graph-traversal",
            name: "Breadth-First and Depth-First Search",
            summary: "Two traversal orders, the structures behind them, and what each discovers.",
            objectives: [
              "Trace BFS and DFS from a given start vertex",
              "Explain why BFS uses a queue and DFS uses a stack",
              "Use BFS to find the shortest path in an unweighted graph",
            ],
          },
          {
            slug: "shortest-paths",
            name: "Weighted Shortest Paths",
            summary: "Dijkstra's algorithm, edge relaxation, and why negative weights break it.",
            objectives: [
              "Trace Dijkstra's algorithm on a small weighted graph",
              "Explain the relaxation step and the role of the priority queue",
              "State why Dijkstra's algorithm fails with negative edge weights",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-databases",
    code: "CSC105",
    name: "Databases",
    shortName: "Databases",
    description:
      "Storing and querying structured data reliably: the relational model, relational algebra, SQL, schema design and normalisation, transactions, and storage and indexing.",
    year: "Year1",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 4),
    icon: "Database",
    modules: [
      {
        slug: "relational-model",
        name: "The Relational Model",
        summary: "Data as relations with declared constraints — the idea that made databases a discipline.",
        units: [
          {
            slug: "relations-and-schemas",
            name: "Relations, Tuples and Schemas",
            summary: "Tables as sets of tuples, attributes, domains and the schema/instance distinction.",
            objectives: [
              "Define a relation schema with attributes and domains",
              "Distinguish a schema from an instance of that schema",
              "Explain why a relation is a set and what that implies about duplicate rows",
            ],
          },
          {
            slug: "keys",
            name: "Keys and Integrity Constraints",
            summary: "Candidate, primary and foreign keys, entity integrity and referential integrity.",
            objectives: [
              "Identify candidate keys for a relation and choose a primary key",
              "Explain referential integrity and what a foreign key guarantees",
              "State the effect of deleting a row that another table references",
            ],
          },
          {
            slug: "conceptual-modelling",
            name: "Conceptual Modelling",
            summary: "Entities, attributes and relationships, and mapping an ER model to tables.",
            objectives: [
              "Draw an entity-relationship model for a described domain",
              "Map one-to-many and many-to-many relationships to relational tables",
              "Represent a weak entity and justify its key",
            ],
          },
        ],
      },
      {
        slug: "relational-algebra",
        name: "Relational Algebra",
        summary: "The formal operations a query engine actually executes, and the basis of query optimisation.",
        units: [
          {
            slug: "selection-projection",
            name: "Selection, Projection and Rename",
            summary: "Filtering rows, choosing columns, and why projection can remove duplicates.",
            objectives: [
              "Write selection and projection expressions for a stated query",
              "Explain why projection may return fewer tuples than its input",
              "Compose selection and projection and state the resulting schema",
            ],
          },
          {
            slug: "joins",
            name: "Joins",
            summary: "Cartesian product, theta join, equijoin, natural join and outer joins.",
            objectives: [
              "Express a natural join as a product followed by selection and projection",
              "Distinguish inner from left, right and full outer joins by their results",
              "Predict the number of rows produced by a join",
            ],
          },
          {
            slug: "set-operations",
            name: "Set Operations and Division",
            summary: "Union, intersection, difference, union compatibility, and 'for all' queries.",
            objectives: [
              "Apply union, intersection and difference to union-compatible relations",
              "State the union compatibility requirement",
              "Express a 'for all' query using division or a double negation",
            ],
          },
        ],
      },
      {
        slug: "sql",
        name: "SQL",
        summary: "The language every relational database speaks, and the one you will use most.",
        units: [
          {
            slug: "sql-queries",
            name: "Querying with SELECT",
            summary: "SELECT, FROM, WHERE, ORDER BY, DISTINCT and predicate construction.",
            objectives: [
              "Write a SELECT statement with filtering and ordering for a stated requirement",
              "Use DISTINCT correctly and explain its cost",
              "Handle NULL correctly in a WHERE predicate",
            ],
          },
          {
            slug: "sql-joins-subqueries",
            name: "Joins and Subqueries",
            summary: "Multi-table queries, correlated and uncorrelated subqueries, EXISTS and IN.",
            objectives: [
              "Write a multi-table query using explicit JOIN syntax",
              "Distinguish a correlated from an uncorrelated subquery",
              "Rewrite a subquery as a join where equivalent",
            ],
          },
          {
            slug: "aggregation",
            name: "Aggregation and Grouping",
            summary: "COUNT, SUM, AVG, GROUP BY and HAVING, and how NULLs are treated.",
            objectives: [
              "Write a GROUP BY query with an aggregate and a HAVING filter",
              "Explain the difference between WHERE and HAVING",
              "State how aggregate functions treat NULL values",
            ],
          },
        ],
      },
      {
        slug: "normalisation",
        name: "Schema Design and Normalisation",
        summary: "Designing tables so that updating one fact requires changing exactly one place.",
        units: [
          {
            slug: "functional-dependencies",
            name: "Functional Dependencies",
            summary: "Determination between attribute sets, closure and the anomalies dependencies cause.",
            objectives: [
              "Identify functional dependencies from a described domain",
              "Compute the closure of an attribute set",
              "Explain insertion, update and deletion anomalies with an example",
            ],
          },
          {
            slug: "normal-forms",
            name: "Normal Forms",
            summary: "1NF, 2NF, 3NF and BCNF, and decomposing a relation to reach them.",
            objectives: [
              "Determine the highest normal form a relation satisfies",
              "Decompose a relation into 3NF, preserving dependencies",
              "State the difference between 3NF and BCNF",
            ],
          },
          {
            slug: "design-tradeoffs",
            name: "Denormalisation and Trade-offs",
            summary: "When redundancy is bought deliberately for read performance.",
            objectives: [
              "Explain why a fully normalised schema can perform poorly on reads",
              "Describe a case where denormalisation is justified and its cost",
              "Identify the update risk that denormalisation introduces",
            ],
          },
        ],
      },
      {
        slug: "transactions",
        name: "Transactions",
        summary: "Keeping data correct when many users write at once and machines fail mid-write.",
        units: [
          {
            slug: "acid",
            name: "ACID Properties",
            summary: "Atomicity, consistency, isolation and durability, and what each protects against.",
            objectives: [
              "Define each ACID property and the failure it guards against",
              "Give an example where losing atomicity corrupts data",
              "Explain what a transaction commit guarantees",
            ],
          },
          {
            slug: "concurrency-control",
            name: "Concurrency Control",
            summary: "Interleaving anomalies, serialisability, locking and isolation levels.",
            objectives: [
              "Identify a lost update, dirty read or non-repeatable read in a schedule",
              "Explain how two-phase locking achieves serialisability",
              "Compare isolation levels by the anomalies each permits",
            ],
          },
          {
            slug: "recovery",
            name: "Recovery",
            summary: "Write-ahead logging, undo and redo, and restoring a consistent state after a crash.",
            objectives: [
              "Explain the write-ahead logging rule and why it is required",
              "Describe how undo and redo restore consistency after a crash",
              "State what must be durable before a commit can be acknowledged",
            ],
          },
        ],
      },
      {
        slug: "storage-and-indexing",
        name: "Storage and Indexing",
        summary: "Why a query is fast or slow — the physical layer beneath the relational abstraction.",
        units: [
          {
            slug: "files-and-pages",
            name: "Files, Pages and Buffers",
            summary: "How rows are laid out on disk pages and cached in a buffer pool.",
            objectives: [
              "Explain how records are organised into pages and files",
              "Describe the role of the buffer pool in reducing disk I/O",
              "Estimate the pages read by a full table scan",
            ],
          },
          {
            slug: "indexes",
            name: "Indexes and B+ Trees",
            summary: "Clustered and secondary indexes, and why B+ trees suit disk-based storage.",
            objectives: [
              "Explain how a B+ tree index reduces lookup cost to logarithmic",
              "Distinguish a clustered from a secondary index",
              "State why B+ trees are shallow and wide rather than binary",
            ],
          },
          {
            slug: "query-performance",
            name: "Query Performance",
            summary: "Reading a query plan and choosing indexes that actually get used.",
            objectives: [
              "Interpret a simple query plan and identify a full scan",
              "Choose an index that supports a given query predicate",
              "Explain why an index can slow down write-heavy workloads",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-logic-and-reasoning",
    code: "CSC106",
    name: "Logic and Formal Reasoning",
    shortName: "Logic",
    description:
      "Reasoning rigorously about programs and specifications: propositional and predicate logic, proof systems, Hoare logic and loop invariants, formal specification and an introduction to computability.",
    year: "Year1",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 5),
    icon: "Function",
    modules: [
      {
        slug: "propositional-logic",
        name: "Propositional Logic",
        summary: "The logic of whole statements — the foundation every later system builds on.",
        units: [
          {
            slug: "syntax-and-semantics",
            name: "Syntax and Semantics",
            summary: "Well-formed formulae, valuations, satisfiability and validity.",
            objectives: [
              "Distinguish a well-formed formula from a malformed one",
              "Determine whether a formula is satisfiable, valid or unsatisfiable",
              "Evaluate a formula under a given valuation",
            ],
          },
          {
            slug: "equivalence",
            name: "Logical Equivalence and Laws",
            summary: "De Morgan, distribution, contraposition and the substitution of equals.",
            objectives: [
              "Prove two formulae equivalent using logical laws",
              "Apply De Morgan's laws to push negation inwards",
              "Simplify a formula to a minimal equivalent form",
            ],
          },
          {
            slug: "normal-forms",
            name: "Normal Forms",
            summary: "Conjunctive and disjunctive normal form, and why solvers want CNF.",
            objectives: [
              "Convert a formula to conjunctive normal form",
              "Explain the role of CNF in automated satisfiability solving",
              "State why conversion to CNF can blow up in size",
            ],
          },
        ],
      },
      {
        slug: "predicate-logic",
        name: "Predicate Logic",
        summary: "Quantifying over a domain — enough expressive power to state real specifications.",
        units: [
          {
            slug: "quantifiers",
            name: "Quantifiers and Binding",
            summary: "Universal and existential quantifiers, bound and free variables, and scope.",
            objectives: [
              "Identify free and bound occurrences of a variable",
              "Translate an English specification into a quantified formula",
              "Explain why quantifier order changes meaning",
            ],
          },
          {
            slug: "models",
            name: "Models and Interpretation",
            summary: "Domains, interpretations, and what makes a formula true in a structure.",
            objectives: [
              "Evaluate a quantified formula in a given finite model",
              "Construct a model that satisfies a formula and one that falsifies it",
              "Distinguish validity from truth in a particular model",
            ],
          },
          {
            slug: "formal-proof",
            name: "Formal Proof",
            summary: "Rules for introducing and eliminating quantifiers in a derivation.",
            objectives: [
              "Apply universal instantiation and existential generalisation correctly",
              "Construct a short formal derivation from stated premises",
              "Identify an invalid quantifier step in a proposed proof",
            ],
          },
        ],
      },
      {
        slug: "proof-systems",
        name: "Proof Systems",
        summary: "Mechanising reasoning — what a proof system is, and what it can and cannot achieve.",
        units: [
          {
            slug: "natural-deduction",
            name: "Natural Deduction",
            summary: "Introduction and elimination rules, assumptions and discharge.",
            objectives: [
              "Construct a natural deduction proof for a propositional entailment",
              "Explain how an assumption is discharged by implication introduction",
              "Identify the rule applied at each step of a given derivation",
            ],
          },
          {
            slug: "soundness-completeness",
            name: "Soundness and Completeness",
            summary: "The relationship between what is provable and what is true.",
            objectives: [
              "State what soundness and completeness each claim about a proof system",
              "Explain why soundness is the property that makes a proof trustworthy",
              "Describe the consequence of a proof system being incomplete",
            ],
          },
          {
            slug: "resolution",
            name: "Resolution and Automated Reasoning",
            summary: "Refutation, the resolution rule, and how automated provers search.",
            objectives: [
              "Apply the resolution rule to a pair of clauses",
              "Prove a propositional entailment by refutation",
              "Explain why automated provers work with clauses rather than arbitrary formulae",
            ],
          },
        ],
      },
      {
        slug: "reasoning-about-programs",
        name: "Reasoning About Programs",
        summary: "Proving a program correct rather than testing it and hoping.",
        units: [
          {
            slug: "preconditions-postconditions",
            name: "Preconditions and Postconditions",
            summary: "Hoare triples, partial correctness, and specifying what code must achieve.",
            objectives: [
              "Write a Hoare triple specifying a fragment of code",
              "Distinguish partial from total correctness",
              "Determine whether a given triple holds for a short program",
            ],
          },
          {
            slug: "loop-invariants",
            name: "Loop Invariants",
            summary: "The assertion that survives every iteration, and the variant that guarantees termination.",
            objectives: [
              "State a loop invariant that establishes a loop's postcondition",
              "Verify that an invariant is preserved by the loop body",
              "Give a variant expression that proves a loop terminates",
            ],
          },
          {
            slug: "weakest-preconditions",
            name: "Weakest Preconditions",
            summary: "Working backwards from what must hold at the end to what must hold at the start.",
            objectives: [
              "Compute the weakest precondition of an assignment for a given postcondition",
              "Derive the weakest precondition through a conditional statement",
              "Use weakest preconditions to check a specification is satisfiable",
            ],
          },
        ],
      },
      {
        slug: "formal-specification",
        name: "Formal Specification",
        summary: "Saying precisely what a component must do, before writing the code that does it.",
        units: [
          {
            slug: "specifying-behaviour",
            name: "Specifying Behaviour",
            summary: "Writing unambiguous specifications and distinguishing them from implementations.",
            objectives: [
              "Write a formal specification for a described operation",
              "Explain why a specification should not constrain implementation choices",
              "Identify an ambiguity in an informal requirement",
            ],
          },
          {
            slug: "abstraction-functions",
            name: "Abstraction Functions and Representation Invariants",
            summary: "Relating concrete data structures to the abstract values they stand for.",
            objectives: [
              "State the representation invariant of a data structure implementation",
              "Define an abstraction function from concrete state to abstract value",
              "Show that an operation preserves the representation invariant",
            ],
          },
          {
            slug: "refinement",
            name: "Refinement",
            summary: "Replacing a specification with an implementation that is guaranteed to satisfy it.",
            objectives: [
              "Explain what it means for an implementation to refine a specification",
              "Check whether a proposed refinement weakens the postcondition",
              "Describe stepwise refinement as a development method",
            ],
          },
        ],
      },
      {
        slug: "computability",
        name: "Introduction to Computability",
        summary: "The limits of what any program can decide — a first look at problems with no algorithm.",
        units: [
          {
            slug: "decidability",
            name: "Decidability",
            summary: "Decision problems, decidable and undecidable languages, and what a decider is.",
            objectives: [
              "State what it means for a decision problem to be decidable",
              "Give an example of a decidable and an undecidable problem",
              "Distinguish a decider from a recogniser",
            ],
          },
          {
            slug: "halting-problem",
            name: "The Halting Problem",
            summary: "The classic undecidable problem and its diagonalisation argument.",
            objectives: [
              "State the halting problem precisely",
              "Outline the contradiction that shows it is undecidable",
              "Explain what its undecidability means for program analysis tools",
            ],
          },
          {
            slug: "reductions",
            name: "Reductions",
            summary: "Proving a new problem undecidable by transforming a known one into it.",
            objectives: [
              "Explain how a reduction transfers undecidability between problems",
              "Set up a reduction from the halting problem to another problem",
              "State the direction a reduction must run to prove undecidability",
            ],
          },
        ],
      },
    ],
  },
];
