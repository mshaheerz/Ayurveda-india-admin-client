import { Card, Skeleton, Input } from '@nextui-org/react'

import React from 'react'

function TableSkeleton() {
    return (
        <Card className="p-4" radius="lg">
            {/* Filter Inputs Skeleton */}
            <div className="flex flex-col justify-between md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                <Skeleton disableAnimation={true} className="w-full md:w-1/3 rounded-lg">
                    <Input placeholder="Filter by Name" />
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-full md:w-1/3 rounded-lg">
                    <Input placeholder="Filter by Email" />
                </Skeleton>
            </div>
            <div className="flex mt-4 flex-col justify-between md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                <Skeleton disableAnimation={true} className="w-2/6 rounded-sm">
                    <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-sm">
                    <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-sm">
                    <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
            </div>


            <div className="flex mt-4 flex-col justify-between md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-6 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-6 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-6 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-6 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
            </div>

            {/* Table Skeleton */}
            <div className="mt-4">
                <Skeleton  disableAnimation={true} className="rounded-lg">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="w-1/4 p-2">Name</th>
                                <th className="w-1/4 p-2">Email</th>
                                <th className="w-1/4 p-2">Phone Number</th>
                                <th className="w-1/4 p-2">Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Rows */}
                            {Array.from({ length: 17 }).map((_, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <Skeleton className="w-3/4" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton className="w-3/4" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton className="w-3/4" />
                                    </td>
                                    <td className="p-2">
                                        <Skeleton className="w-3/4" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Skeleton>
            </div>

            <div className="flex mt-4 flex-col justify-between md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-7 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-12 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>
                <Skeleton disableAnimation={true} className="w-2/6 rounded-md">
                    <div className="h-5 w-full rounded-lg bg-secondary-200"></div>
                </Skeleton>

            </div>
        </Card>
    )
}

export default TableSkeleton