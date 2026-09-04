import type { CourseSpec } from "../undergrad-course";
import { CS_PALETTE, paletteColor } from "../undergrad-course";

/**
 * BSc Computer Science, Year 2 — algorithms, systems and the engineering of
 * software, matching MIT (6.1220 Design and Analysis of Algorithms, 6.1810
 * Operating System Engineering, 6.1020 Software Construction, 6.3700
 * Probability), Cambridge Part IB and Imperial Year 2.
 */
const PROGRAMME = "bsc-computer-science";

export const CS_YEAR_2: CourseSpec[] = [
  {
    slug: "cs-algorithm-design",
    code: "CSC201",
    name: "Algorithm Design and Analysis",
    shortName: "Algorithms",
    description:
      "Designing algorithms rather than recalling them: divide and conquer, greedy methods, dynamic programming, advanced graph algorithms, amortised analysis and an introduction to intractability.",
    year: "Year2",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 0),
    icon: "GitBranch",
    modules: [
      {
        slug: "divide-and-conquer",
        name: "Divide and Conquer",
        summary: "Splitting a problem into independent subproblems, and the recurrences that describe the cost.",
        units: [
          {
            slug: "recurrences",
            name: "Solving Recurrences",
            summary: "Recursion trees, substitution and the master theorem.",
            objectives: [
              "Write the recurrence describing a divide-and-conquer algorithm",
              "Apply the master theorem to solve a recurrence of standard form",
              "Solve a recurrence by the substitution method and verify the bound",
            ],
          },
          {
            slug: "classic-divide-conquer",
            name: "Classic Divide-and-Conquer Algorithms",
            summary: "Binary search, merge sort, closest pair and fast integer multiplication.",
            objectives: [
              "Explain how Karatsuba multiplication beats the schoolbook method asymptotically",
              "Describe the divide-and-conquer solution to the closest pair problem",
              "Identify when a problem decomposes into independent subproblems",
            ],
          },
          {
            slug: "selection",
            name: "Order Statistics and Selection",
            summary: "Finding the kth smallest element in linear expected time.",
            objectives: [
              "Describe quickselect and state its expected and worst-case complexity",
              "Explain how median-of-medians guarantees linear worst-case selection",
              "Compare selection by sorting with direct selection",
            ],
          },
        ],
      },
      {
        slug: "greedy",
        name: "Greedy Algorithms",
        summary: "Taking the locally best option — and proving that it is globally optimal.",
        units: [
          {
            slug: "greedy-choice",
            name: "The Greedy Choice Property",
            summary: "When a locally optimal choice leads to a global optimum, and how to prove it.",
            objectives: [
              "State the greedy-choice property and optimal substructure",
              "Prove a greedy algorithm correct by an exchange argument",
              "Give a problem where the obvious greedy strategy fails",
            ],
          },
          {
            slug: "scheduling-and-huffman",
            name: "Scheduling and Huffman Coding",
            summary: "Interval scheduling, activity selection and optimal prefix codes.",
            objectives: [
              "Solve an interval scheduling problem with the correct greedy criterion",
              "Construct a Huffman code for a given set of frequencies",
              "Explain why Huffman coding produces an optimal prefix code",
            ],
          },
          {
            slug: "minimum-spanning-trees",
            name: "Minimum Spanning Trees",
            summary: "Kruskal and Prim, the cut property, and union-find.",
            objectives: [
              "Trace Kruskal's and Prim's algorithms on a weighted graph",
              "State the cut property and use it to justify correctness",
              "Explain how union-find supports Kruskal's algorithm efficiently",
            ],
          },
        ],
      },
      {
        slug: "dynamic-programming",
        name: "Dynamic Programming",
        summary: "Overlapping subproblems solved once and reused — the most powerful design technique in the course.",
        units: [
          {
            slug: "memoisation",
            name: "Overlapping Subproblems and Memoisation",
            summary: "Top-down memoisation and bottom-up tabulation of the same recurrence.",
            objectives: [
              "Identify overlapping subproblems in a naive recursion",
              "Convert a recursive solution to a memoised one and state the complexity gain",
              "Rewrite a memoised solution as a bottom-up table",
            ],
          },
          {
            slug: "dp-on-sequences",
            name: "Dynamic Programming on Sequences",
            summary: "Longest common subsequence, edit distance and the knapsack problem.",
            objectives: [
              "Formulate the recurrence for edit distance and fill its table",
              "Solve a 0/1 knapsack instance by dynamic programming",
              "Reconstruct an optimal solution from a completed DP table",
            ],
          },
          {
            slug: "dp-design",
            name: "Designing a Dynamic Program",
            summary: "Choosing the state, the transition and the evaluation order.",
            objectives: [
              "Define the DP state and transition for an unfamiliar problem",
              "Determine a valid evaluation order from the dependency structure",
              "Analyse the time and space complexity of a DP formulation",
            ],
          },
        ],
      },
      {
        slug: "advanced-graphs",
        name: "Advanced Graph Algorithms",
        summary: "Beyond traversal — shortest paths with negative weights, flows and connectivity.",
        units: [
          {
            slug: "shortest-path-algorithms",
            name: "Shortest Path Algorithms",
            summary: "Bellman-Ford, Floyd-Warshall and negative cycles.",
            objectives: [
              "Apply Bellman-Ford and explain how it detects a negative cycle",
              "Compute all-pairs shortest paths with Floyd-Warshall",
              "Choose the appropriate shortest-path algorithm for stated graph properties",
            ],
          },
          {
            slug: "network-flow",
            name: "Network Flow",
            summary: "Max-flow, residual graphs, Ford-Fulkerson and the max-flow min-cut theorem.",
            objectives: [
              "Compute a maximum flow using augmenting paths on a residual graph",
              "State the max-flow min-cut theorem and identify a minimum cut",
              "Model a matching or assignment problem as a flow network",
            ],
          },
          {
            slug: "connectivity-and-ordering",
            name: "Connectivity and Topological Order",
            summary: "Strongly connected components, topological sorting and DAG shortest paths.",
            objectives: [
              "Produce a topological ordering of a directed acyclic graph",
              "Identify strongly connected components of a directed graph",
              "Exploit a topological order to solve DAG shortest paths in linear time",
            ],
          },
        ],
      },
      {
        slug: "amortised-analysis",
        name: "Amortised Analysis",
        summary: "Averaging cost over a sequence of operations rather than bounding the worst single one.",
        units: [
          {
            slug: "amortised-methods",
            name: "Aggregate, Accounting and Potential Methods",
            summary: "Three techniques for bounding the cost of an operation sequence.",
            objectives: [
              "Apply the aggregate method to bound a sequence of operations",
              "Use the accounting method with a credit invariant",
              "Define a potential function and use it to derive an amortised bound",
            ],
          },
          {
            slug: "union-find",
            name: "Disjoint Sets",
            summary: "Union by rank, path compression and near-constant amortised cost.",
            objectives: [
              "Implement union-find with union by rank and path compression",
              "Explain why path compression improves amortised performance",
              "Trace the structure produced by a sequence of union and find operations",
            ],
          },
          {
            slug: "amortised-structures",
            name: "Amortised Data Structures",
            summary: "Dynamic arrays, multipop stacks and binary counters.",
            objectives: [
              "Prove the amortised O(1) cost of dynamic array append",
              "Analyse the cost of incrementing a binary counter over many operations",
              "Distinguish amortised cost from average-case cost",
            ],
          },
        ],
      },
      {
        slug: "intractability",
        name: "Intractability",
        summary: "Problems for which no efficient algorithm is known, and how to recognise one.",
        units: [
          {
            slug: "p-and-np",
            name: "P, NP and Verification",
            summary: "Decision problems, polynomial time, certificates and the P versus NP question.",
            objectives: [
              "Define the classes P and NP in terms of solving and verifying",
              "Give a certificate for a problem in NP and describe its verification",
              "State the P versus NP question and its significance",
            ],
          },
          {
            slug: "np-completeness",
            name: "NP-Completeness and Reductions",
            summary: "Polynomial-time reduction, NP-hardness and the standard complete problems.",
            objectives: [
              "Explain what a polynomial-time reduction establishes",
              "Show a problem is NP-complete given a reduction from a known NP-complete problem",
              "Name several standard NP-complete problems",
            ],
          },
          {
            slug: "coping-with-hardness",
            name: "Coping with Intractability",
            summary: "Approximation, heuristics and exploiting special structure.",
            objectives: [
              "Describe an approximation algorithm and state its approximation ratio",
              "Explain how restricting the input can make a hard problem tractable",
              "Choose a practical strategy for an NP-hard problem in a stated setting",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-operating-systems",
    code: "CSC202",
    name: "Operating Systems",
    shortName: "OS",
    description:
      "How an operating system manages a machine: processes and threads, scheduling, synchronisation, memory and virtual memory, file systems, and input/output.",
    year: "Year2",
    semester: 1,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 1),
    icon: "Stack",
    modules: [
      {
        slug: "os-structure",
        name: "Operating System Structure",
        summary: "What an OS is for, and the boundary it maintains between programs and hardware.",
        units: [
          {
            slug: "os-role",
            name: "The Role of an Operating System",
            summary: "Resource management, abstraction and isolation.",
            objectives: [
              "State the principal responsibilities of an operating system",
              "Explain the abstraction an OS provides over raw hardware",
              "Distinguish monolithic, microkernel and layered designs",
            ],
          },
          {
            slug: "system-calls",
            name: "System Calls and Privilege",
            summary: "User and kernel mode, traps, and the system call interface.",
            objectives: [
              "Explain the transition from user mode to kernel mode during a system call",
              "Describe why privilege separation is required for protection",
              "Trace the steps of a read system call",
            ],
          },
          {
            slug: "interrupts",
            name: "Interrupts and Exceptions",
            summary: "Hardware interrupts, exceptions and the handler mechanism.",
            objectives: [
              "Distinguish an interrupt from an exception and from a system call",
              "Describe the actions taken when an interrupt arrives",
              "Explain why interrupt handlers must be short",
            ],
          },
        ],
      },
      {
        slug: "processes-and-threads",
        name: "Processes and Threads",
        summary: "The unit of execution, its state, and how the OS switches between many of them.",
        units: [
          {
            slug: "process-model",
            name: "The Process Model",
            summary: "Address space, process control block, process states and lifecycle.",
            objectives: [
              "Describe the contents of a process control block",
              "Draw the process state diagram and the transitions between states",
              "Explain what happens during process creation and termination",
            ],
          },
          {
            slug: "threads",
            name: "Threads",
            summary: "Multiple execution contexts sharing an address space, and user versus kernel threads.",
            objectives: [
              "Compare a thread with a process in terms of what is shared",
              "State the advantages and risks of multithreading",
              "Distinguish user-level from kernel-level threads",
            ],
          },
          {
            slug: "context-switching",
            name: "Context Switching",
            summary: "Saving and restoring execution state, and the cost of doing so.",
            objectives: [
              "List the state saved and restored during a context switch",
              "Explain why context switching has a measurable cost",
              "Compare the cost of a thread switch with a process switch",
            ],
          },
        ],
      },
      {
        slug: "scheduling",
        name: "CPU Scheduling",
        summary: "Deciding which runnable process runs next, and what that decision optimises.",
        units: [
          {
            slug: "scheduling-criteria",
            name: "Scheduling Criteria",
            summary: "Throughput, turnaround, waiting and response time, and the trade-offs between them.",
            objectives: [
              "Define throughput, turnaround time, waiting time and response time",
              "Explain why optimising one criterion can degrade another",
              "Distinguish preemptive from non-preemptive scheduling",
            ],
          },
          {
            slug: "scheduling-algorithms",
            name: "Scheduling Algorithms",
            summary: "FCFS, SJF, round robin, priority scheduling and multilevel feedback queues.",
            objectives: [
              "Compute average waiting and turnaround time for a given schedule",
              "Compare round robin and shortest-job-first on a workload",
              "Explain starvation and how ageing addresses it",
            ],
          },
          {
            slug: "realtime-scheduling",
            name: "Real-Time and Multiprocessor Scheduling",
            summary: "Deadlines, rate-monotonic scheduling and scheduling across cores.",
            objectives: [
              "Distinguish hard from soft real-time requirements",
              "Explain the principle of rate-monotonic scheduling",
              "Describe load balancing and processor affinity on a multicore system",
            ],
          },
        ],
      },
      {
        slug: "concurrency",
        name: "Concurrency and Synchronisation",
        summary: "Coordinating threads that share data — the source of the hardest bugs in systems programming.",
        units: [
          {
            slug: "race-conditions",
            name: "Race Conditions and Critical Sections",
            summary: "Interleaving, the critical section problem and its requirements.",
            objectives: [
              "Identify a race condition in an interleaved execution",
              "State the mutual exclusion, progress and bounded waiting requirements",
              "Explain why an increment operation is not atomic",
            ],
          },
          {
            slug: "synchronisation-primitives",
            name: "Locks, Semaphores and Monitors",
            summary: "Mutual exclusion primitives and condition variables.",
            objectives: [
              "Use a mutex to protect a critical section correctly",
              "Solve a producer-consumer problem with semaphores",
              "Explain the role of a condition variable in a monitor",
            ],
          },
          {
            slug: "deadlock",
            name: "Deadlock",
            summary: "The four necessary conditions, and prevention, avoidance and detection.",
            objectives: [
              "State the four necessary conditions for deadlock",
              "Detect a deadlock from a resource allocation graph",
              "Compare deadlock prevention, avoidance and detection strategies",
            ],
          },
        ],
      },
      {
        slug: "memory-management",
        name: "Memory Management",
        summary: "Giving every process the illusion of a large private address space.",
        units: [
          {
            slug: "allocation",
            name: "Memory Allocation",
            summary: "Contiguous allocation, fragmentation and allocation strategies.",
            objectives: [
              "Distinguish internal from external fragmentation",
              "Apply first-fit, best-fit and worst-fit to an allocation request",
              "Explain why compaction is expensive",
            ],
          },
          {
            slug: "paging",
            name: "Paging and Address Translation",
            summary: "Pages, frames, page tables and the translation lookaside buffer.",
            objectives: [
              "Translate a virtual address to a physical address using a page table",
              "Explain the purpose of the TLB and the cost of a TLB miss",
              "Describe multi-level page tables and why they are used",
            ],
          },
          {
            slug: "virtual-memory",
            name: "Virtual Memory and Replacement",
            summary: "Demand paging, page faults, replacement policies and thrashing.",
            objectives: [
              "Describe the sequence of events on a page fault",
              "Apply FIFO, LRU and optimal replacement to a reference string and count faults",
              "Explain thrashing and how the working set model addresses it",
            ],
          },
        ],
      },
      {
        slug: "storage-and-io",
        name: "File Systems and I/O",
        summary: "Persistent storage, its organisation, and how the OS drives devices.",
        units: [
          {
            slug: "file-systems",
            name: "File System Structure",
            summary: "Files, directories, inodes and allocation methods.",
            objectives: [
              "Describe how an inode locates the blocks of a file",
              "Compare contiguous, linked and indexed allocation",
              "Explain how a directory maps a name to a file",
            ],
          },
          {
            slug: "file-system-reliability",
            name: "Reliability and Journalling",
            summary: "Crash consistency, journalling and caching of file system data.",
            objectives: [
              "Explain how a crash mid-write can corrupt a file system",
              "Describe how journalling restores consistency after a crash",
              "State the trade-off between write caching and durability",
            ],
          },
          {
            slug: "io-systems",
            name: "I/O Systems",
            summary: "Device drivers, polling, interrupts and direct memory access.",
            objectives: [
              "Compare polling with interrupt-driven I/O",
              "Explain the role of DMA in reducing CPU involvement",
              "Describe the function of a device driver in the I/O stack",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-software-engineering",
    code: "CSC203",
    name: "Software Engineering",
    shortName: "Software Eng",
    description:
      "Building software that survives change: requirements, design principles and patterns, architecture, testing strategy, version control and continuous integration, and development process.",
    year: "Year2",
    semester: 1,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 2),
    icon: "Wrench",
    modules: [
      {
        slug: "requirements",
        name: "Requirements",
        summary: "Finding out what to build before building it — where most project failures originate.",
        units: [
          {
            slug: "eliciting-requirements",
            name: "Eliciting Requirements",
            summary: "Stakeholders, interviews, user stories and use cases.",
            objectives: [
              "Write a user story with acceptance criteria for a stated need",
              "Distinguish functional from non-functional requirements",
              "Identify a stakeholder whose needs a stated requirement set omits",
            ],
          },
          {
            slug: "specifying-requirements",
            name: "Specifying and Prioritising",
            summary: "Making requirements testable, and deciding what to build first.",
            objectives: [
              "Rewrite a vague requirement so that it is testable",
              "Prioritise a requirement set against stated constraints",
              "Explain the cost of a requirement defect found late",
            ],
          },
          {
            slug: "requirements-change",
            name: "Managing Change",
            summary: "Why requirements change, and designing so change is affordable.",
            objectives: [
              "Explain why requirements change during a project",
              "Describe how traceability supports change impact analysis",
              "Identify a design decision that makes a likely change expensive",
            ],
          },
        ],
      },
      {
        slug: "design-principles",
        name: "Design Principles",
        summary: "The properties that make code changeable — the real measure of software quality.",
        units: [
          {
            slug: "coupling-and-cohesion",
            name: "Coupling and Cohesion",
            summary: "Dependencies between modules and focus within them.",
            objectives: [
              "Assess a design for coupling and cohesion",
              "Refactor a low-cohesion module into focused parts",
              "Explain why tight coupling makes change propagate",
            ],
          },
          {
            slug: "solid-principles",
            name: "Design Principles in Practice",
            summary: "Single responsibility, open-closed, substitution, interface segregation and dependency inversion.",
            objectives: [
              "Identify a violation of the single responsibility principle in given code",
              "Apply dependency inversion to decouple a module from a concrete implementation",
              "Explain the Liskov substitution principle with a violating example",
            ],
          },
          {
            slug: "abstraction",
            name: "Abstraction and Information Hiding",
            summary: "Interfaces as contracts, and hiding the decisions most likely to change.",
            objectives: [
              "Design an interface that hides a likely-to-change decision",
              "Explain the difference between an interface and an implementation",
              "Identify a leaky abstraction and its consequence",
            ],
          },
        ],
      },
      {
        slug: "design-patterns",
        name: "Design Patterns",
        summary: "Named solutions to recurring design problems, and the judgement to know when not to use them.",
        units: [
          {
            slug: "creational-patterns",
            name: "Creational Patterns",
            summary: "Factory, builder and singleton, and the problems each addresses.",
            objectives: [
              "Apply a factory pattern to decouple construction from use",
              "Describe when a builder is preferable to a long constructor",
              "Explain the drawbacks of the singleton pattern",
            ],
          },
          {
            slug: "structural-behavioural",
            name: "Structural and Behavioural Patterns",
            summary: "Adapter, decorator, observer and strategy.",
            objectives: [
              "Use the strategy pattern to make an algorithm interchangeable",
              "Apply the observer pattern to decouple a publisher from subscribers",
              "Distinguish an adapter from a decorator by intent",
            ],
          },
          {
            slug: "pattern-judgement",
            name: "Using Patterns Well",
            summary: "Over-engineering, pattern misuse, and preferring the simplest thing that works.",
            objectives: [
              "Identify a case where applying a pattern adds cost without benefit",
              "Explain why a pattern is a vocabulary rather than a target",
              "Choose the simplest design that satisfies stated requirements",
            ],
          },
        ],
      },
      {
        slug: "architecture",
        name: "Software Architecture",
        summary: "The structural decisions that are hardest to reverse later.",
        units: [
          {
            slug: "architectural-styles",
            name: "Architectural Styles",
            summary: "Layered, client-server, event-driven, microservices and monolith.",
            objectives: [
              "Compare a layered architecture with an event-driven one",
              "State the trade-offs of microservices against a monolith",
              "Select an architectural style for stated requirements and justify it",
            ],
          },
          {
            slug: "quality-attributes",
            name: "Quality Attributes",
            summary: "Performance, scalability, availability, security and maintainability as design drivers.",
            objectives: [
              "Identify the quality attributes that dominate a stated system",
              "Explain a design trade-off between two quality attributes",
              "Describe how an architectural decision supports a specific quality attribute",
            ],
          },
          {
            slug: "documenting-architecture",
            name: "Documenting and Evolving Architecture",
            summary: "Views, decision records and technical debt.",
            objectives: [
              "Record an architectural decision with its context and consequences",
              "Explain what technical debt is and when incurring it is rational",
              "Describe how an architecture is evolved without a rewrite",
            ],
          },
        ],
      },
      {
        slug: "testing",
        name: "Testing and Quality",
        summary: "Building confidence systematically rather than by hoping.",
        units: [
          {
            slug: "test-levels",
            name: "Levels of Testing",
            summary: "Unit, integration, system and acceptance testing, and the test pyramid.",
            objectives: [
              "Distinguish unit, integration and system testing by scope",
              "Explain the test pyramid and the cost of inverting it",
              "Choose the appropriate test level for a stated risk",
            ],
          },
          {
            slug: "test-design",
            name: "Designing Test Cases",
            summary: "Equivalence partitioning, boundary values, coverage and test doubles.",
            objectives: [
              "Derive test cases using equivalence partitioning and boundary value analysis",
              "Explain what statement and branch coverage do and do not guarantee",
              "Use a mock or stub to isolate a unit under test",
            ],
          },
          {
            slug: "code-quality",
            name: "Reviews, Refactoring and Static Analysis",
            summary: "Catching defects before execution, and improving code without changing behaviour.",
            objectives: [
              "Conduct a code review against stated quality criteria",
              "Perform a refactoring that preserves behaviour and improves structure",
              "Explain what static analysis catches that testing does not",
            ],
          },
        ],
      },
      {
        slug: "process-and-tooling",
        name: "Process and Tooling",
        summary: "How teams coordinate, and the automation that makes frequent change safe.",
        units: [
          {
            slug: "version-control",
            name: "Version Control",
            summary: "Commits, branching, merging and collaborative workflows.",
            objectives: [
              "Describe a branching workflow suitable for a small team",
              "Explain how a merge conflict arises and how it is resolved",
              "Write a commit history that supports later debugging",
            ],
          },
          {
            slug: "continuous-integration",
            name: "Continuous Integration and Delivery",
            summary: "Automated build, test and deployment pipelines.",
            objectives: [
              "Describe the stages of a continuous integration pipeline",
              "Explain how CI reduces integration risk",
              "State the preconditions for safe continuous deployment",
            ],
          },
          {
            slug: "development-process",
            name: "Development Processes",
            summary: "Waterfall, iterative and agile approaches, and when each fits.",
            objectives: [
              "Compare waterfall with iterative development on risk and feedback",
              "Describe the core practices of an agile process",
              "Select a process for a project with stated uncertainty and constraints",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-computer-networks",
    code: "CSC204",
    name: "Computer Networks",
    shortName: "Networks",
    description:
      "How data crosses a network: layered architecture, the link layer, IP and routing, TCP and UDP, application protocols, and network security.",
    year: "Year2",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 3),
    icon: "Network",
    modules: [
      {
        slug: "network-architecture",
        name: "Network Architecture",
        summary: "Layering as the organising idea, and the models that describe it.",
        units: [
          {
            slug: "layered-models",
            name: "Layered Models",
            summary: "The OSI and TCP/IP models and the service each layer provides.",
            objectives: [
              "Name the layers of the TCP/IP model and the function of each",
              "Map an OSI layer to its TCP/IP counterpart",
              "Explain why layering makes a network easier to evolve",
            ],
          },
          {
            slug: "encapsulation",
            name: "Encapsulation and Protocol Data Units",
            summary: "Headers added and removed as data descends and ascends the stack.",
            objectives: [
              "Describe how a message is encapsulated as it passes down the stack",
              "Identify the PDU name at each layer",
              "Compute protocol overhead for a given payload size",
            ],
          },
          {
            slug: "performance-metrics",
            name: "Network Performance",
            summary: "Bandwidth, latency, propagation delay, jitter and throughput.",
            objectives: [
              "Distinguish bandwidth from latency and from throughput",
              "Compute total delay from transmission, propagation and queuing components",
              "Explain the bandwidth-delay product and its significance",
            ],
          },
        ],
      },
      {
        slug: "link-layer",
        name: "The Link Layer",
        summary: "Getting a frame across one hop reliably, and sharing a medium fairly.",
        units: [
          {
            slug: "framing-and-errors",
            name: "Framing and Error Detection",
            summary: "Frame delimitation, parity, checksums and cyclic redundancy checks.",
            objectives: [
              "Compute a checksum or CRC for a given frame",
              "Compare error detection with error correction",
              "Explain why the link layer detects errors even though higher layers also do",
            ],
          },
          {
            slug: "medium-access",
            name: "Medium Access Control",
            summary: "Sharing a channel: CSMA/CD, CSMA/CA and collisions.",
            objectives: [
              "Explain how CSMA/CD detects and recovers from a collision",
              "Describe why wireless networks use collision avoidance rather than detection",
              "Compute the effect of collisions on effective throughput",
            ],
          },
          {
            slug: "switching",
            name: "Switching and Ethernet",
            summary: "MAC addresses, switches, learning bridges and LAN topology.",
            objectives: [
              "Explain how a switch learns which port reaches a MAC address",
              "Distinguish a switch from a hub and from a router",
              "Describe the structure of an Ethernet frame",
            ],
          },
        ],
      },
      {
        slug: "network-layer",
        name: "The Network Layer",
        summary: "Getting a packet across many hops to a host anywhere on the internet.",
        units: [
          {
            slug: "ip-addressing",
            name: "IP Addressing and Subnetting",
            summary: "IPv4 and IPv6 addresses, subnet masks, CIDR and address exhaustion.",
            objectives: [
              "Compute a subnet mask, network address and usable host range from a CIDR prefix",
              "Divide an address block into subnets meeting stated host requirements",
              "Explain the motivation for IPv6 and for network address translation",
            ],
          },
          {
            slug: "routing",
            name: "Routing",
            summary: "Forwarding tables, distance vector and link state routing.",
            objectives: [
              "Determine the next hop from a forwarding table using longest prefix match",
              "Compare distance vector with link state routing",
              "Trace the convergence of a distance vector protocol after a link failure",
            ],
          },
          {
            slug: "internet-protocol",
            name: "IP and Supporting Protocols",
            summary: "The IP datagram, fragmentation, TTL, ICMP and ARP.",
            objectives: [
              "Explain the purpose of the TTL field and the effect of it reaching zero",
              "Describe how ARP resolves an IP address to a MAC address",
              "Explain what ping and traceroute reveal and how they work",
            ],
          },
        ],
      },
      {
        slug: "transport-layer",
        name: "The Transport Layer",
        summary: "End-to-end delivery between processes, reliable or not.",
        units: [
          {
            slug: "udp-and-tcp",
            name: "UDP and TCP",
            summary: "Ports, multiplexing, and the choice between reliability and latency.",
            objectives: [
              "Compare UDP and TCP on reliability, ordering and overhead",
              "Explain how port numbers multiplex connections to processes",
              "Choose the appropriate transport protocol for a stated application",
            ],
          },
          {
            slug: "reliable-transfer",
            name: "Reliable Data Transfer",
            summary: "Acknowledgements, retransmission, sequence numbers and sliding windows.",
            objectives: [
              "Explain how sequence numbers and acknowledgements provide reliability",
              "Describe the sliding window mechanism and its effect on throughput",
              "Trace TCP connection establishment and termination",
            ],
          },
          {
            slug: "congestion-control",
            name: "Flow and Congestion Control",
            summary: "Receiver windows, slow start, congestion avoidance and fairness.",
            objectives: [
              "Distinguish flow control from congestion control",
              "Describe TCP slow start and congestion avoidance phases",
              "Explain how TCP infers congestion from packet loss",
            ],
          },
        ],
      },
      {
        slug: "application-layer",
        name: "The Application Layer",
        summary: "The protocols users actually interact with.",
        units: [
          {
            slug: "http-and-web",
            name: "HTTP and the Web",
            summary: "Request/response, methods, status codes, cookies and caching.",
            objectives: [
              "Describe the structure of an HTTP request and response",
              "Explain the meaning of common status code classes",
              "Explain how caching reduces load and how it is controlled",
            ],
          },
          {
            slug: "dns",
            name: "DNS",
            summary: "The distributed name hierarchy and the resolution process.",
            objectives: [
              "Trace an iterative DNS resolution from root to authoritative server",
              "Explain the role of caching and TTL in DNS",
              "Describe the consequence of a DNS failure for an application",
            ],
          },
          {
            slug: "application-protocols",
            name: "Other Application Protocols",
            summary: "Email, file transfer, streaming and the client-server versus peer-to-peer models.",
            objectives: [
              "Compare client-server with peer-to-peer architectures",
              "Describe the protocols involved in sending and retrieving email",
              "Explain the requirements streaming places on the network",
            ],
          },
        ],
      },
      {
        slug: "network-security",
        name: "Network Security",
        summary: "Threats to communication and the mechanisms that counter them.",
        units: [
          {
            slug: "threats",
            name: "Threats and Attacks",
            summary: "Eavesdropping, spoofing, man-in-the-middle and denial of service.",
            objectives: [
              "Describe how a man-in-the-middle attack is mounted",
              "Explain why an unauthenticated protocol is vulnerable to spoofing",
              "Distinguish a denial-of-service from a distributed denial-of-service attack",
            ],
          },
          {
            slug: "secure-channels",
            name: "Securing a Channel",
            summary: "TLS, certificates and the handshake that establishes trust.",
            objectives: [
              "Describe the purpose of each stage of the TLS handshake",
              "Explain the role of a certificate authority in establishing trust",
              "State what TLS does and does not protect",
            ],
          },
          {
            slug: "network-defence",
            name: "Firewalls and Network Defence",
            summary: "Filtering, network segmentation, VPNs and intrusion detection.",
            objectives: [
              "Explain how a packet-filtering firewall makes a decision",
              "Describe the purpose of network segmentation",
              "Compare a VPN with an unencrypted connection over the public internet",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-probability-statistics",
    code: "CSC205",
    name: "Probability and Statistics for Computing",
    shortName: "Probability",
    description:
      "Reasoning under uncertainty: probability, random variables and distributions, expectation and variance, estimation and hypothesis testing, and randomised algorithms and Markov chains.",
    year: "Year2",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 4),
    icon: "ChartLine",
    modules: [
      {
        slug: "probability-foundations",
        name: "Foundations of Probability",
        summary: "Sample spaces, events and the axioms everything else follows from.",
        units: [
          {
            slug: "sample-spaces",
            name: "Sample Spaces and Events",
            summary: "Outcomes, events, the probability axioms and counting-based probability.",
            objectives: [
              "Define a sample space and event for a described experiment",
              "Apply the probability axioms to compute the probability of a compound event",
              "Compute a probability using combinatorial counting",
            ],
          },
          {
            slug: "conditional-probability",
            name: "Conditional Probability and Independence",
            summary: "Conditioning, the multiplication rule, and what independence really means.",
            objectives: [
              "Compute a conditional probability from a joint distribution",
              "Test two events for independence",
              "Apply the law of total probability to a partitioned sample space",
            ],
          },
          {
            slug: "bayes",
            name: "Bayes' Theorem",
            summary: "Inverting conditional probabilities, and the base rate fallacy.",
            objectives: [
              "Apply Bayes' theorem to update a probability given evidence",
              "Explain the base rate fallacy with a diagnostic testing example",
              "Compute a posterior probability for a spam classification scenario",
            ],
          },
        ],
      },
      {
        slug: "random-variables",
        name: "Random Variables",
        summary: "Attaching numbers to outcomes so they can be summarised and combined.",
        units: [
          {
            slug: "discrete-random-variables",
            name: "Discrete Random Variables",
            summary: "Probability mass functions, cumulative distribution functions and their properties.",
            objectives: [
              "Construct a probability mass function for a described experiment",
              "Compute a cumulative distribution function from a pmf",
              "Determine the probability of a range of values from a distribution",
            ],
          },
          {
            slug: "expectation-and-variance",
            name: "Expectation and Variance",
            summary: "The mean, variance, standard deviation, and linearity of expectation.",
            objectives: [
              "Compute the expectation and variance of a discrete random variable",
              "Apply linearity of expectation to a sum of dependent variables",
              "Explain what variance measures and why standard deviation is often preferred",
            ],
          },
          {
            slug: "continuous-random-variables",
            name: "Continuous Random Variables",
            summary: "Probability density functions, integration and the normal distribution.",
            objectives: [
              "Compute a probability from a probability density function by integration",
              "Standardise a normal variable and use standard normal tables",
              "Explain why the probability of any single value is zero for a continuous variable",
            ],
          },
        ],
      },
      {
        slug: "distributions",
        name: "Common Distributions",
        summary: "The standard models, and recognising which one a situation calls for.",
        units: [
          {
            slug: "bernoulli-binomial",
            name: "Bernoulli, Binomial and Geometric",
            summary: "Repeated trials, counts of successes and waiting times.",
            objectives: [
              "Compute binomial probabilities for a stated number of trials",
              "Identify when a geometric distribution models a waiting time",
              "State the mean and variance of the binomial and geometric distributions",
            ],
          },
          {
            slug: "poisson-exponential",
            name: "Poisson and Exponential",
            summary: "Rare events in an interval, and the time between them.",
            objectives: [
              "Model arrivals in an interval using a Poisson distribution",
              "Compute exponential probabilities for inter-arrival times",
              "Explain the memoryless property of the exponential distribution",
            ],
          },
          {
            slug: "normal-and-clt",
            name: "The Normal Distribution and the Central Limit Theorem",
            summary: "Why sums of many effects look normal, regardless of their own distribution.",
            objectives: [
              "State the central limit theorem and its conditions",
              "Apply the CLT to approximate the distribution of a sample mean",
              "Use a normal approximation to a binomial distribution",
            ],
          },
        ],
      },
      {
        slug: "statistical-inference",
        name: "Statistical Inference",
        summary: "Drawing conclusions about a population from a sample, with quantified uncertainty.",
        units: [
          {
            slug: "estimation",
            name: "Point and Interval Estimation",
            summary: "Estimators, bias, standard error and confidence intervals.",
            objectives: [
              "Compute a point estimate and its standard error from sample data",
              "Construct a confidence interval for a population mean",
              "State correctly what a 95% confidence interval does and does not mean",
            ],
          },
          {
            slug: "hypothesis-testing",
            name: "Hypothesis Testing",
            summary: "Null and alternative hypotheses, p-values, significance and errors.",
            objectives: [
              "Formulate null and alternative hypotheses for a stated question",
              "Compute a test statistic and interpret the resulting p-value",
              "Distinguish Type I from Type II error and relate them to significance and power",
            ],
          },
          {
            slug: "experiments-and-regression",
            name: "Experiments and Regression",
            summary: "Comparing systems fairly, and fitting a linear relationship.",
            objectives: [
              "Design a fair experiment to compare two algorithms empirically",
              "Fit and interpret a simple linear regression",
              "Explain why correlation does not establish causation",
            ],
          },
        ],
      },
      {
        slug: "randomised-algorithms",
        name: "Randomness in Algorithms",
        summary: "Using randomness deliberately to get simpler or faster algorithms.",
        units: [
          {
            slug: "randomised-analysis",
            name: "Randomised Algorithms",
            summary: "Las Vegas and Monte Carlo algorithms and expected running time.",
            objectives: [
              "Distinguish a Las Vegas from a Monte Carlo algorithm",
              "Analyse the expected running time of randomised quicksort",
              "Explain why randomisation defeats adversarial worst-case inputs",
            ],
          },
          {
            slug: "hashing-and-concentration",
            name: "Hashing and Concentration Bounds",
            summary: "Universal hashing, collisions, and bounding deviation from the mean.",
            objectives: [
              "Compute the expected number of collisions in a hash table",
              "Apply Markov's or Chebyshev's inequality to bound a tail probability",
              "Explain the birthday paradox and its relevance to hashing",
            ],
          },
          {
            slug: "markov-chains",
            name: "Markov Chains",
            summary: "State transitions with no memory, and long-run behaviour.",
            objectives: [
              "Construct a transition matrix for a described Markov process",
              "Compute the state distribution after n steps",
              "Determine a stationary distribution and interpret it",
            ],
          },
        ],
      },
      {
        slug: "data-analysis",
        name: "Working with Data",
        summary: "Summarising and visualising data honestly before modelling it.",
        units: [
          {
            slug: "descriptive-statistics",
            name: "Descriptive Statistics",
            summary: "Measures of centre and spread, quartiles and outliers.",
            objectives: [
              "Compute mean, median, mode, variance and interquartile range from data",
              "Identify outliers using a stated criterion",
              "Explain when the median is a better summary than the mean",
            ],
          },
          {
            slug: "visualisation",
            name: "Summarising and Visualising Data",
            summary: "Histograms, box plots and scatter plots, and misleading presentation.",
            objectives: [
              "Choose an appropriate plot for a stated data type and question",
              "Interpret a histogram's shape in terms of the underlying distribution",
              "Identify a misleading feature in a presented chart",
            ],
          },
          {
            slug: "sampling",
            name: "Sampling and Bias",
            summary: "Representative samples, sampling methods and the biases that invalidate conclusions.",
            objectives: [
              "Distinguish random, stratified and convenience sampling",
              "Identify a source of sampling bias in a described study",
              "Explain how sample size affects the precision of an estimate",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cs-compilers",
    code: "CSC206",
    name: "Compilers and Language Processing",
    shortName: "Compilers",
    description:
      "How a program in a high-level language becomes machine code: lexical analysis, parsing, semantic analysis, intermediate representation, code generation and optimisation.",
    year: "Year2",
    semester: 2,
    creditUnits: 3,
    programme: PROGRAMME,
    accentColor: paletteColor(CS_PALETTE, 5),
    icon: "FileCode",
    modules: [
      {
        slug: "compiler-structure",
        name: "The Structure of a Compiler",
        summary: "The phases of translation and why the front end is separated from the back end.",
        units: [
          {
            slug: "compilation-phases",
            name: "Phases of Compilation",
            summary: "Front end, middle end and back end, and what each phase produces.",
            objectives: [
              "Name the phases of a compiler and the output of each",
              "Explain the benefit of separating the front end from the back end",
              "Distinguish a compiler from an interpreter",
            ],
          },
          {
            slug: "language-definition",
            name: "Defining a Language",
            summary: "Syntax versus semantics, and grammars as specification.",
            objectives: [
              "Distinguish syntax from semantics with an example of each kind of error",
              "Read a context-free grammar in BNF notation",
              "Explain what a grammar does not specify about a language",
            ],
          },
          {
            slug: "symbol-tables",
            name: "Symbol Tables and Scope",
            summary: "Recording declarations and resolving names across nested scopes.",
            objectives: [
              "Describe the structure of a symbol table supporting nested scopes",
              "Resolve a name to its declaration under lexical scoping rules",
              "Explain the difference between static and dynamic scoping",
            ],
          },
        ],
      },
      {
        slug: "lexical-analysis",
        name: "Lexical Analysis",
        summary: "Turning a character stream into tokens — the first and simplest phase.",
        units: [
          {
            slug: "tokens-and-regex",
            name: "Tokens and Regular Expressions",
            summary: "Lexemes, token classes and the regular expressions that describe them.",
            objectives: [
              "Write regular expressions describing identifiers, numbers and operators",
              "Tokenise a short source fragment by hand",
              "Explain the maximal munch rule for token recognition",
            ],
          },
          {
            slug: "finite-automata",
            name: "Finite Automata",
            summary: "DFAs and NFAs, and their equivalence to regular expressions.",
            objectives: [
              "Construct a DFA recognising a given regular language",
              "Convert an NFA to an equivalent DFA by subset construction",
              "Explain why finite automata suffice for lexical analysis",
            ],
          },
          {
            slug: "lexer-implementation",
            name: "Implementing a Lexer",
            summary: "Hand-written versus generated lexers, and lexical error handling.",
            objectives: [
              "Describe how a table-driven lexer operates",
              "Handle a lexical error and recover to continue scanning",
              "Explain how keywords are distinguished from identifiers",
            ],
          },
        ],
      },
      {
        slug: "parsing",
        name: "Parsing",
        summary: "Recovering the structure the grammar implies from a flat token stream.",
        units: [
          {
            slug: "grammars-and-trees",
            name: "Context-Free Grammars and Parse Trees",
            summary: "Derivations, parse trees, ambiguity and precedence.",
            objectives: [
              "Derive a string from a context-free grammar and draw its parse tree",
              "Identify an ambiguous grammar and give two parse trees for one string",
              "Rewrite a grammar to encode operator precedence and associativity",
            ],
          },
          {
            slug: "top-down-parsing",
            name: "Top-Down Parsing",
            summary: "Recursive descent, LL(1), FIRST and FOLLOW sets and left recursion.",
            objectives: [
              "Write a recursive descent parser for a small grammar",
              "Compute FIRST and FOLLOW sets for a grammar",
              "Eliminate left recursion so a grammar becomes suitable for top-down parsing",
            ],
          },
          {
            slug: "bottom-up-parsing",
            name: "Bottom-Up Parsing",
            summary: "Shift-reduce parsing, LR items and parser generators.",
            objectives: [
              "Trace a shift-reduce parse using a stack and input buffer",
              "Explain why LR parsing handles a larger grammar class than LL",
              "Identify a shift-reduce conflict and its cause",
            ],
          },
        ],
      },
      {
        slug: "semantic-analysis",
        name: "Semantic Analysis",
        summary: "Checking what the grammar cannot express — that a syntactically valid program makes sense.",
        units: [
          {
            slug: "type-checking",
            name: "Type Checking",
            summary: "Type rules, inference on expressions and type errors.",
            objectives: [
              "Apply typing rules to determine the type of an expression",
              "Identify a type error that parsing cannot detect",
              "Explain implicit coercion and its risks",
            ],
          },
          {
            slug: "semantic-rules",
            name: "Attribute Grammars and Semantic Rules",
            summary: "Synthesised and inherited attributes, and syntax-directed translation.",
            objectives: [
              "Distinguish synthesised from inherited attributes",
              "Annotate a parse tree using a set of semantic rules",
              "Describe syntax-directed translation of an expression",
            ],
          },
          {
            slug: "error-reporting",
            name: "Error Detection and Reporting",
            summary: "Producing diagnostics a programmer can act on, and recovering to find more.",
            objectives: [
              "Classify an error as lexical, syntactic or semantic",
              "Explain what makes a compiler error message useful",
              "Describe a strategy for error recovery during parsing",
            ],
          },
        ],
      },
      {
        slug: "intermediate-representation",
        name: "Intermediate Representation",
        summary: "A form that is easier to analyse and optimise than either source or machine code.",
        units: [
          {
            slug: "ir-forms",
            name: "Forms of Intermediate Code",
            summary: "Three-address code, abstract syntax trees and static single assignment.",
            objectives: [
              "Translate an expression into three-address code",
              "Explain the advantage of an IR over direct source-to-target translation",
              "Describe static single assignment form and its benefit for analysis",
            ],
          },
          {
            slug: "control-flow-graphs",
            name: "Control Flow Graphs",
            summary: "Basic blocks, edges and the representation optimisation works on.",
            objectives: [
              "Partition a code sequence into basic blocks",
              "Construct a control flow graph from three-address code",
              "Identify a loop in a control flow graph",
            ],
          },
          {
            slug: "translating-constructs",
            name: "Translating Language Constructs",
            summary: "Lowering conditionals, loops, arrays and procedure calls to IR.",
            objectives: [
              "Translate an if-else and a while loop into three-address code with labels",
              "Generate address computation for an array access",
              "Describe the IR produced for a procedure call and return",
            ],
          },
        ],
      },
      {
        slug: "code-generation",
        name: "Code Generation and Optimisation",
        summary: "Producing target code that is correct first and fast second.",
        units: [
          {
            slug: "instruction-selection",
            name: "Instruction Selection and Register Allocation",
            summary: "Mapping IR to instructions and assigning limited registers.",
            objectives: [
              "Select target instructions for a three-address statement",
              "Explain register allocation as a graph colouring problem",
              "Describe what spilling is and why it costs performance",
            ],
          },
          {
            slug: "local-optimisation",
            name: "Local Optimisation",
            summary: "Constant folding, common subexpression elimination and dead code removal.",
            objectives: [
              "Apply constant folding and propagation to a basic block",
              "Eliminate a common subexpression and state the saving",
              "Identify dead code that can be removed safely",
            ],
          },
          {
            slug: "loop-optimisation",
            name: "Loop and Global Optimisation",
            summary: "Loop-invariant code motion, strength reduction and unrolling.",
            objectives: [
              "Move a loop-invariant computation out of a loop",
              "Apply strength reduction to a loop induction variable",
              "Explain the trade-off loop unrolling makes between size and speed",
            ],
          },
        ],
      },
    ],
  },
];
