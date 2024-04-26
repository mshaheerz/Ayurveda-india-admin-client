import React from 'react'


interface Props {
    label: string;
    symbolEnable?: boolean;
    customSymbol?: string;
}


function FormLabel({ label, symbolEnable = false, customSymbol = "*" }: Props) {
    return (
        <div>{label}<span className='text-red-500 text-lg'>{symbolEnable && customSymbol}</span> </div>
    )
}

export default FormLabel