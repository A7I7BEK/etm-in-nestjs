import { FindManyOptions } from 'typeorm';


export function setNestedOptions<T>(mainOption: FindManyOptions<T>, injectedOption: FindManyOptions<T>)
{
    const injectedOptionArray = JSON.stringify(injectedOption).match(/\b\w+\b/g);
    const injectedOptionValue = Number(injectedOptionArray.pop());

    injectedOptionArray.reduce((acc, key, index) =>
    {
        if (index === injectedOptionArray.length - 1)
        {
            acc[ key ] = injectedOptionValue;
        }
        else
        {
            acc[ key ] ??= {};
        }

        return acc[ key ];

    }, mainOption);
}


/**
 * Alternative
 */
export function setNestedOptionsRecursive<T>(mainOption: FindManyOptions<T>, injectedOption: FindManyOptions<T>)
{
    const [ key ] = Object.keys(injectedOption);

    if (Number(injectedOption[ key ]) > 0)
    {
        mainOption[ key ] = injectedOption[ key ];
    }
    else
    {
        setNestedOptionsRecursive(mainOption[ key ] ??= {}, injectedOption[ key ]);
    }
}

// setNestedOptionsRecursive(mainOptionsExample ??= {}, injectedOptionsExample);
