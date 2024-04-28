import React from 'react'
import { useState } from 'react';
import axios from '@/lib/axios';
import { Slide, toast } from 'react-toastify';


interface Image {
    id: string;
    image: string;
    is_main_image: boolean;
    created_by: string;
    updated_by: string | null;
    status: number;
    created_at: string;
    updated_at: string;
    course: string;
}

interface PhotoProps {
    images: Image[];
    authToken: any; // Add an authToken prop
    setRefresh: any;

}
function PhotosEditor({ images, authToken, setRefresh }: PhotoProps) {
    const [imageStore, setImageStore] = useState([...images])

    const [addedPhotos, setAddedPhotos] = useState<File[]>([]);


    async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;

        if (!files) {
            return;
        }

        const newImages = Array.from(files);
        setAddedPhotos(newImages)
        await handleUpload(newImages, authToken);

    }

    const handleUpload = async (files: File[], authToken: string) => {
        const formData = new FormData();
    
        files.forEach((file, index) => {
          formData.append(`file${index + 1}`, file);
        });
    
        try {
          // Call your upload API using axios with headers
          await axios.post('YOUR_UPLOAD_API_ENDPOINT', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authToken}`, // Include your authentication token
            },
          });
    
          // Optionally, update the state or re-fetch the images from the server
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      };



    async function removePhoto(ev: any, id: string) {
        ev.preventDefault();
        try {
            // Call your delete API using axios
            const formData = new FormData()
            formData.append("id",id)

            await axios.delete('/course/delete_image/', {
                data: formData,
                headers: {
                    Authorization: `Bearer ${authToken}`, // Include your authentication token
                },
            });
            const filtered = imageStore.filter((image)=>image.id !==id)
            setImageStore([...filtered])


          
            toast.success('Image Deleted successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });

             setRefresh((prev: boolean) => !prev)

            // Optionally, update the state or re-fetch the images from the server
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Something went wrong', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });
        } 
    }


    return (
        <>
            <div className="mt-2 grid gap-2 grid-col-3 md:grid-cols-4 lg:grid-cols-6">
                {
                    imageStore.length > 0 && imageStore.map((image, index: number) => (
                        <div className="h-32 flex relative" key={index}>
                            <img className="rounded-2xl w-full object-cover " src={image.image} alt="err" />
                            <button type='button' onClick={(ev) => removePhoto(ev, image.id)} className='absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-xl p-2 px-3 cursor-pointer'>
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='h-6 w-6'>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>


                            


                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default PhotosEditor