const mysteries = [
  {
    id: "heisenberg-formula",
    title: "The Heisenberg Formula",
    summary: "A missing batch recipe has locked down the superlab. Decipher chemical cues to restore system access.",
    story: "You walk into the underground lab beneath the industrial laundry. The main control terminal is locked, and a timer is counting down. Walter left three encoded safety prompts across the lab equipment to ensure only someone with acute chemical knowledge can reboot the ventilation system.",
    stages: [
      {
        id: "bb-s1",
        title: "Stage 1: The Periodic Combination",
        question: "What is the 4-digit security PIN to unlock the lab door terminal?",
        clues: [
          "A sticky note on the barrel reads: 'Atomic number of Bromine (Br) followed by the atomic number of Barium (Ba)'.",
          "The element chart on the wall shows: Bromine (Br) = 35, Barium (Ba) = 56."
        ],
        answers: ["3556"],
        hints: [
          "Hint 1: Combine the two atomic numbers side-by-side: Br + Ba.",
          "Hint 2: 35 followed by 56 gives 3556."
        ]
      },
      {
        id: "bb-s2",
        title: "Stage 2: The Encoded Alias Prompt",
        question: "What 10-letter codename decrypts the lead chemist's terminal identity?",
        clues: [
          "The terminal login prompt displays an encrypted sequence: '8 - 5 - 9 - 19 - 5 - 14 - 2 - 5 - 18 - 7'.",
          "A cipher key pinned to the wall reads: 'Convert numbers to letters using standard alphabet order (1=A, 2=B, 3=C ... 8=H, 9=I, 14=N, 18=R, 19=S)'."
        ],
        answers: ["heisenberg"],
        hints: [
          "Hint 1: Map each number to its corresponding letter: 8=H, 5=E, 9=I, 19=S, 5=E, 14=N, 2=B, 5=E, 18=R, 7=G.",
          "Hint 2: The decoded name is 'heisenberg'."
        ]
      },
      {
        id: "bb-s3",
        title: "Stage 3: The Multi-Variable Control Lock",
        question: "What 4-digit code ABCD clears the emergency purge lock and starts the ventilation system?",
        clues: [
          "The ventilation panel displays a rule: 'The 4-digit code ABCD consists of distinct numbers from 1 to 6'.",
          "The override log lists three diagnostic conditions: (1) A is an even number; (2) C is twice the value of A; (3) B is 1, and the sum of all four digits (A + B + C + D) equals 12."
        ],
        answers: ["2145"],
        hints: [
          "Hint 1: Since A is even and C = 2*A using digits 1–6, A must be 2 and C must be 4.",
          "Hint 2: With A=2, B=1, and C=4, solve 2 + 1 + 4 + D = 12 to find D = 5. Enter 2145."
        ]
      }
    ],
    finalReveal: "The terminal screen lights up green, showing 'VENTILATION RESTORED - SYSTEM READY'. The pressure drops back to safe levels just as footsteps echo down the lab stairs. You successfully bypassed the lockdown without blowing your cover."
  }
];