export const emptyMap = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

export const copyArray = (original) => {
    return original.map((arr) => {
        return arr.slice();
    });
};
