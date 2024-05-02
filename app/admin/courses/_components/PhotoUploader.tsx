import React from 'react'
import { useState } from 'react';
import axios from 'axios';

interface PhotoProps {
    addedPhotos: any,
    setAddedPhotos: any,
    register?: any
}
function PhotosUploader({ addedPhotos, setAddedPhotos }: PhotoProps) {

    const [error, setError] = useState<string | null>("")

    function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;

        if (!files) {
            return;
        }

        setError(null)

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Allowed image MIME types
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes

        const newImages = Array.from(files).filter(file => {
            if (!allowedTypes.includes(file.type)) {
                console.log("fooooo 1")
                setError("Invalid file type. Only images are allowed");
                return false;
            }

            // Check if file size is within limit
            if (file.size > maxSize) {
                setError("File size exceeds 2MB limit.");
                return false;
            }

            return true;
        });

        
        setAddedPhotos([...addedPhotos, ...newImages])
    }



    function removePhoto(ev: any, fileName: any) {
        ev.preventDefault();
        setAddedPhotos([...addedPhotos.filter((photo: any) => photo != fileName)]);
    }

    function selectAsMainPhoto(ev: any, fileName: any) {
        ev.preventDefault();
        setAddedPhotos([fileName, ...addedPhotos.filter((photo: any) => photo != fileName)])
    }
    return (
        <>
            <div className="mt-2 grid gap-2 grid-col-3 md:grid-cols-4 lg:grid-cols-6">
                {
                    addedPhotos.length > 0 && addedPhotos.map((image: any, index: number) => (
                        <div className="h-32 flex relative" key={index}>
                            <img className="rounded-2xl w-full object-cover " src={URL.createObjectURL(image)} alt="err" />
                            <button onClick={(ev) => removePhoto(ev, image)} className='absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-xl p-2 px-3 cursor-pointer'>
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='h-6 w-6'>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>


                            <button onClick={(ev) => selectAsMainPhoto(ev, image)} className='absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-xl p-2 px-3 cursor-pointer'>
                                {
                                    image === addedPhotos[0] && (
                                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='h-6 w-6' >
                                            <path clipRule="evenodd" fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
                                        </svg>
                                    )}
                                {
                                    image !== addedPhotos[0] && (
                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='h-6 w-6'>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                    )
                                }
                            </button>


                        </div>
                    ))
                }
                <label className="flex cursor-pointer items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                    <input type="file"
                        // {
                        //     ...register('file')} 
                        multiple
                        className="hidden"
                        onChange={uploadPhoto} />
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        />
                    </svg>
                    Upload
                </label>
               <div className='text-red-600'>{error && error}</div>
            </div>
            
        </>
    )
}

export default PhotosUploader