type SectionRef = {
    one: number,
    two: number,
    three: number,
    four: number
}

let section: SectionRef = {one: 0, two: 0, three: 0, four: 0};


const useSection = () => {
  return { section };
}

export default useSection;