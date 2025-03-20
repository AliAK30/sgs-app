/* 
type Details = {
    Active: {
        key: number;
        text: string[];
    };
    Reflective: {
        key: number;
        text: string[];
    };
    Sensing: {
        key: number;
        text: string[];
    };
    Intuitive: {
        key: number;
        text: string[];
    };
    Visual: {
        key: number;
        text: string[];
    };
    Verbal: {
        key: number;
        text: string[];
    };
    Sequential: {
        key: number;
        text: string[];
    };
    Global: {
        key: number;
        text: string[];
    };
}
 */

const details =  {

    Active: {
        key: 0,
        text: [
            "Prefer engaging in activities like discussions, applying concepts, and trying things out.",
            "Learn best by \"doing\" and working in groups.",
            "Example: When learning programming, active learners may prefer collaborative coding exercises, pair programming, or hands-on labs.",
        ]
    },

    Reflective: {
        key: 1,
        text: [
            "Prefer to think through and reflect on the information before acting on it.",
            "Learn best alone or by reviewing material deeply.",
            "Example: When learning programming, reflective learners might prefer to read documentation, watch tutorials, or analyze code examples independently.",
        ]
    },

    Sensing: {
        key: 2,
        text: [
            "Prefer Like facts, concrete information, and practical applications.",
            "Prefer structured, step-by-step approaches.",
            "Example: In a math class, sensing learners might appreciate step-by-step guides on solving equations and applying formulas in real-world scenarios.",
        ]
    },

    Intuitive: {
        key: 3,
        text: [
            "Enjoy abstract concepts, theories, and innovative ideas.",
            "Prefer discovering relationships and exploring possibilities.",
            "Example: In a math class, intuitive learners might enjoy discussing the theoretical implications of mathematical models or exploring creative ways to solve problems.",
        ]
    },

    Visual: {
        key: 4,
        text: [
            "Learn best from visual representations like diagrams, flowcharts, videos, and illustrations.",
            "Example: When studying biology, visual learners might prefer using labeled diagrams of the human anatomy or watching animated videos of biological processes."
        ]
    },

    Verbal: {
        key: 5,
        text: [
            "Prefer written or spoken explanations, lectures, and reading.",
            "Example: When studying biology, verbal learners might prefer reading textbooks or listening to detailed explanations from a teacher."
        ]
    },

    Sequential: {
        key: 6,
        text: [
            "Learn in linear steps and prefer logical progression.",
            "Example: In a history class, sequential learners would prefer a timeline that breaks events into a chronological sequence to understand the flow of history.",
        ]
    },

    Global: {
        key: 7,
        text: [
            "Grasp the big picture first and then fill in the details.",
            "Example: In a history class, global learners would prefer to understand the overarching themes or motivations behind historical events before diving into the details.",
        ]
    },
}

export default details;