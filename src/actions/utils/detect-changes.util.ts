
export function detectChanges<T>
    (
        oldEntity: T,
        newEntity: T,
        structure: any
    ): Record<string, any>
{
    const changes = {};

    Object.keys(structure).forEach(key =>
    {
        const strVal = structure[ key ];
        const oldVal = oldEntity[ key ];
        const newVal = newEntity[ key ];

        if (strVal !== 0)
        {
            changes[ key ] = detectChanges(oldVal, newVal, strVal);
        }
        else if (oldVal === newVal)
        {
            changes[ key ] = null;
        }
        else
        {
            changes[ key ] = { oldVal, newVal };
        }
    });

    return changes;
}
