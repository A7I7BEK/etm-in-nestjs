
type OrderInArrayType = Array<{ ordering: number; }>;


export function reOrderItems<T extends OrderInArrayType>(items: T)
{
    items.forEach((item, index) =>
    {
        item.ordering = index;
    });
}