import React, { useState } from 'react';
import { Input, Textarea } from '@nextui-org/react';
import FormLabel from '@/components/Formhelpers/FormLabel';

interface formProps {
    mode: string;
    initialData: any;
}
export const DoctorForm = ({ mode, initialData }: formProps) => {
    const [doctorDetails, setDoctorDetails] = useState({
        photo: initialData?.photo || '',
        name: initialData?.name || '',
        specialization: initialData?.specialization || '',
        description: initialData?.description || '',
    });
    const [selectedFile, setSelectedFile] = useState(null);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          setDoctorDetails((prevDetails) => ({
            ...prevDetails,
            photo: URL.createObjectURL(file), // Create a URL for the selected file
          }));
        }
      };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    return (
        <div>
            {mode === "edit" && (
                <div>
                    <h3>Services</h3>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                        <Input
                            type="text"
                            name="specialization"
                            value={doctorDetails.specialization}
                            onChange={handleChange}
                            maxLength={256}
                            label={<FormLabel label="specialization" symbolEnable={true} />}
                            labelPlacement="outside"
                            placeholder=""
                            pattern=".{0,256}"
                        />

                        <Input
                            type="text"
                            name="name"
                            value={doctorDetails.name}
                            onChange={handleChange}
                            maxLength={256}
                            label={<FormLabel label="name" symbolEnable={true} />}
                            labelPlacement="outside"
                            placeholder=""
                            pattern=".{0,256}"
                        />

                    </div>

                    <div>

                        <Textarea
                            name="description"
                            value={doctorDetails.description}
                            onChange={handleChange}
                            maxLength={512}
                            type="text"
                            label={<FormLabel label="description" symbolEnable={true} />}
                            labelPlacement="outside"
                            placeholder=""
                            pattern=".{0,256}"
                        />

                    </div>

                    <div className="mt-4">
                        {doctorDetails.photo ? (
                            <div className="relative w-32 h-32">
                                <img
                                    src={doctorDetails.photo}
                                    alt="Doctor"
                                    className="w-full h-full object-cover rounded-full border"
                                />
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 border shadow-md"
                                    onClick={() => setDoctorDetails((prevDetails) => ({ ...prevDetails, photo: '' }))}
                                >
                                    <span role="img" aria-label="Edit">
                                        ✏️
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                        )}
                    </div>

                    <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Submit
                    </button>


                </div>
            )}
        </div>
    );
};