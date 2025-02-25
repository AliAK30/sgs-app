type Question = {
    question: string;
    number: number;
    section: number;
    a: string;
    b: string;
    containerColor: string;
    gradientColorStart: string;
    sectionColor: string;
}

export const questions : Array<Question> = [
    {
        question: "I understand an algorithm better After I:",
        number: 1,
        section: 1,
        a: "Try that algorithm on different examples 💡",
        b: "Think about algorithm's overall processes 🌐",
        containerColor: "#E9E6F9",
        gradientColorStart: "#9D86FB",
        sectionColor: "#DBD2FF",
    },
    {
        question: "I would try to learn algorithms through by:",
        number: 2,
        section: 1,
        a: "Learning it for more examples through changing the values",
        b: "Learning on some more cases through changing the scenarios",
        containerColor: "#E9E6F9",
        gradientColorStart: "d",
        sectionColor: "#DBD2FF",
    },
    {
        question: "When I think about yesterday's Algorithms class:",
        number: 3,
        section: 1,
        a: "I got a whole picture of Algorithm in my mind 🖼️",
        b: "I only got Words Of Algorithm like Text 💬",
        containerColor: "#E9E6F9",
        gradientColorStart: "d",
        sectionColor: "#DBD2FF",
    },
    {
        question: "When I learn about Algorithms:",
        number: 4,
        section: 1,
        a: "I understand that this is a Bubble sort but I'm unable to understand its entire working 📉",
        b: "I understand its entire working but I am unable to understand that this is a Bubble Sort 🔵",
        containerColor: "#E9E6F9",
        gradientColorStart: "d",
        sectionColor: "#DBD2FF",
    },
    {
        question: "When I am learning new algorithms:",
        number: 5,
        section: 1,
        a: "I can talk about it with my colleagues",
        b: "I can think about that algorithms 💭",
        containerColor: "#E9E6F9",
        gradientColorStart: "d",
        sectionColor: "#DBD2FF",
    },
]

export const optionsColor = "rgba(31, 36, 41, 0.05)"

