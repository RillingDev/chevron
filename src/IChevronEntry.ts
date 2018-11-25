interface IChevronEntry extends Array<any> {
    [0]: boolean; // State of construction
    [1]: any; // Content
    [2]?: () => any; // Constructor
}

export {IChevronEntry};
