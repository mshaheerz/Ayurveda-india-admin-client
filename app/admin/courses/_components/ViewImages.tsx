import React from 'react'

function ViewImages({imageStore}:any) {
  return (
    <>
            <div className="mt-2 grid gap-2 grid-col-3 md:grid-cols-4 lg:grid-cols-6">
                {
                    imageStore.length > 0 && imageStore.map((image:any, index: number) => (
                        <div className="h-32 flex relative" key={index}>
                            <img className="rounded-2xl w-full object-cover " src={image.image} alt="err" />
                           
                        </div>
                    ))
                }

            </div>
        </>
  )
}

export default ViewImages