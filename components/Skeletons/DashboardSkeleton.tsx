import React from 'react'
import CardDataStats from '../CardDataStats'
import { BookOpenText, GraduationCapIcon, Pencil } from 'lucide-react'
import { Skeleton } from '@nextui-org/react'

function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <Skeleton disableAnimation={true} className='rounded-md'>
                <CardDataStats title="Treatments" total={"0"} rate="" >
                    <div></div>
                </CardDataStats>
            </Skeleton>

            <Skeleton disableAnimation={true} className='rounded-md'>
                <CardDataStats title="Treatments" total={"0"} rate="" >
                    <div></div>
                </CardDataStats>
            </Skeleton>
            <Skeleton disableAnimation={true} className='rounded-md'>
                <CardDataStats title="Treatments" total={"0"} rate="" >
                    <div></div>
                </CardDataStats>
            </Skeleton>
            <Skeleton disableAnimation={true} className='rounded-md'>
                <CardDataStats title="Treatments" total={"0"} rate="" >
                    <div></div>
                </CardDataStats>
            </Skeleton>
        </div>
    )
}

export default DashboardSkeleton