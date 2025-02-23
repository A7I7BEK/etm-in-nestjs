
type OrderInArrayType = Array<{ ordering: number; }>;


export function reorderItems<T extends OrderInArrayType>(items: T)
{
    items.forEach((item, index) =>
    {
        item.ordering = index;
    });
}