
type Nutrients = {
    ENERC_KCAL: number;
};

export type Food = {
    foodId: string;
    label: string;
    knownAs: string;
    nutrients: Nutrients;
    brand?: string;
    category: string;
    categoryLabel: string;
    image: string;
    quantity: number;
};
