import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, SelectItem, Select, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { PlusCircleIcon, Trash2Icon, XIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import PhotosUploader from "./PhotoUploader";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import { Slide, toast } from "react-toastify";
import PhotosEditor from "./PhotoEditor";
import ViewImages from "./ViewImages";
import Swal from "sweetalert2";
import FormLabel from "@/components/Formhelpers/FormLabel";

interface AddCourseProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    token: string | undefined;
    refresh: boolean;
    setRefresh: any;
    onClose: any;
    mode: string;
    initialData: any;
    setInitialData: any;
}

interface Module {
    name: string;
    description: string;
    id?: string;
}


function AddTreatmentModal({ isOpen, onOpen, onOpenChange, token, refresh, setRefresh, onClose, mode, initialData, setInitialData }: AddCourseProps) {
    const formRef = useRef(null);
    const [addedPhotos, setAddedPhotos] = useState([])
    const defaultValues = mode === "edit" ? initialData : {
        course_modules: [],
        course_practicals: []
    };
    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({ defaultValues });


    const initialCourseModules = initialData.treatmentmodule_treatment || [];
    const [modules, setModules] = useState<Module[]>([]);
    const [startTimeMorning, setStartTimeMorning] = useState("")
    const [endTimeMorning, setEndTimeMorning] = useState("")
    const [startTimeAfternoon, setStartTimeAfternoon] = useState("")
    const [endTimeAfternoon, setEndTimeAfternoon] = useState("")
    const [timeLineType, setTimeLineType] = useState("full_day")


    const handleTheoryModuleChange = (index: number, field: keyof Module, value: string) => {
        const updatedModules = [...modules];
        updatedModules[index][field] = value;
        setModules(updatedModules);
    };


    const addTheoryModule = () => {
        setModules([...modules, { name: '', description: '' }]);
    };


    const removeTheoryModule = async (index: number, id: any) => {

        if (mode === "edit") {
            try {

                const formData = new FormData()
                formData.append("id", id)


                await axios.delete('/treatment/delete_module/', {
                    data: formData,
                    headers: {
                        Authorization: `Bearer ${token}`, // Include your authentication token
                    },
                });
                const updatedModules = [...modules];
                updatedModules.splice(index, 1);
                setModules(updatedModules);


            } catch (error) {
                console.log(error)

            }
        } else {
            const updatedModules = [...modules];
            updatedModules.splice(index, 1);
            setModules(updatedModules);
        }

    };















    const ButtonComponent = () => {
        if (mode == "add") {
            return (
                <Button
                    type="submit" color="primary">
                    Add Treatment
                </Button>
            )
        } else if (mode == "view") {
            return (
                <></>
            )
        } else {
            return (
                <Button type="submit" color="primary">
                    Modify Treatment
                </Button>
            )
        }
    }










    useEffect(() => {
        console.log(initialData)
        if (mode === "add") {
            setModules([])
            setTimeLineType("full_day")
            setStartTimeMorning("")
            setEndTimeMorning("")
            setStartTimeAfternoon("")
            setEndTimeAfternoon("")
            reset({});


        }

        if (mode == "edit") {
            reset(initialData);
            setAddedPhotos([])
            setModules(initialCourseModules)
        }

        if (mode == "view") {
            setAddedPhotos([])
            setModules([])

        }
    }, [initialData]);


    const onSubmit = async (data: any) => {
        console.log(data)


        const intprs = modules?.map((dat: any) => {
            return {
                name: dat.name,
                description: dat.description,
                id: dat?.id
            }
        })
        let forms = {
            ...data,
            "treatment_modules": JSON.stringify(intprs),
        }
        // return ;

        if (mode === "edit") {
            const formData = new FormData()
            Object.entries(forms).forEach(([key, value]) => {
                formData.append(key, forms[key]);
            });

            addedPhotos.forEach((image, index) => {
                formData.append(`file${index + 1}`, image);
            });
            console.log(addedPhotos)

            try {
                const { data } = await axios.put(`/treatment/${initialData.id}/`, formData,
                    {
                        headers:
                        {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                console.log(data)
                setRefresh((prev: boolean) => !prev)
                reset()
                toast.success('Course Details edited successfully', {
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
                onClose();
            } catch (error: any) {
                const msg = error?.response?.data?.msg || 'something went wrong try again'
                toast.error(msg, {
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
                console.log(error)
            }




        } else {
            const formData = new FormData()
            // Append other form input values to FormData
            Object.entries(forms).forEach(([key, value]) => {
                formData.append(key, forms[key]);
            });
            // Append course_modules array


            console.log(addedPhotos, "added photos")

            addedPhotos.forEach((image, index) => {
                formData.append(`file${index + 1}`, image);
            });

            try {
                const { data } = await axios.post('/treatment/', formData,
                    {
                        headers:
                        {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                console.log(data)
                setRefresh((prev: boolean) => !prev)
                reset()
                toast.success('Course Added successfully', {
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
                onClose();
            } catch (error: any) {
                const msg = error?.response?.data?.msg || 'something went wrong try again'
                toast.error(msg, {
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
                console.log(error)
            }



            reset()
            // Close the modal after submitting the form

        }


    };




    // Function to show/hide time inputs based on timeline_type
    const RenderTimeInputs = () => {
        if (timeLineType === 'full_day') {


            return (
                <>
                    <Input
                        errorMessage={errors.start_time_morning && "End Time (Morning) is required"}
                        // defaultValue={initialData.timeline[0]?.start_time_morning} // Set initial value
                        disabled={mode === 'view'} // Disable the input in view mode
                        label="Start Time (Morning)"
                        labelPlacement="outside-left"
                        type="time"
                        value={startTimeMorning}
                        onChange={(e) => setStartTimeMorning(e.target.value)}
                    // {...register("start_time_morning", { required: true })}
                    />

                    <Input
                        // defaultValue={initialData.timeline[0]?.end_time_morning}
                        errorMessage={errors.end_time_morning && "End Time (Morning) is required"}
                        disabled={mode === 'view'} // Disable the input in view mode
                        label="End Time (Morning)"
                        labelPlacement="outside-left"
                        type="time"
                        value={endTimeMorning}
                        onChange={(e) => setEndTimeMorning(e.target.value)}
                    // {...register("end_time_morning", { required: true })}
                    />


                    <Input
                        // defaultValue={initialData.timeline[0]?.start_time_afternoon}
                        errorMessage={errors.start_time_afternoon && "Start Time (Afternoon) is required"}
                        disabled={mode === 'view'} // Disable the input in view mode
                        label="Start Time (Afternoon)"
                        labelPlacement="outside-left"
                        type="time"
                        value={startTimeAfternoon}
                        onChange={(e) => setStartTimeAfternoon(e.target.value)}
                    // {...register("start_time_afternoon", { required: true })}
                    />


                    <Input
                        // defaultValue={initialData.timeline[0]?.end_time_morning}
                        disabled={mode === 'view'}
                        errorMessage={errors.end_time_afternoon && "End Time (Afternoon) is required"}
                        label="End Time (Afternoon)"
                        labelPlacement="outside-left"
                        type="time"
                        value={endTimeAfternoon}
                        onChange={(e) => setEndTimeAfternoon(e.target.value)}
                    // {...register("end_time_afternoon", { required: true })}
                    />

                </>
            );
        } else if (timeLineType === 'half_day') {
            return (
                <>
                    <Input
                        // defaultValue={initialData.timeline[0]?.start_time_morning}
                        value={startTimeMorning}
                        onChange={(e) => setStartTimeMorning(e.target.value)}
                        disabled={mode === 'view'}
                        errorMessage={errors.start_time && "Start Time is required"}
                        label="Start Time"
                        labelPlacement="outside-left"
                        type="time"
                    // {...register("start_time_morning", { required: true })}
                    />


                    <Input
                        // defaultValue={initialData.timeline[0]?.end_time_morning}
                        disabled={mode === 'view'}
                        errorMessage={errors.end_time && "End Time is required"}
                        label="End Time"
                        labelPlacement="outside-left"
                        type="time"
                        value={endTimeMorning}
                        onChange={(e) => setEndTimeMorning(e.target.value)}
                    // {...register("end_time_morning", { required: true })}
                    />
                </>
            );
        }
        return <></>;
    };

    const HeaderComponent = () => {
        if (mode == "add") {
            return (
                <ModalHeader className="flex flex-col gap-1">Add New Treatment</ModalHeader>
            )
        } else if (mode == "view") {
            return (
                <ModalHeader className="flex flex-col gap-1">View Treatment Details</ModalHeader>
            )
        } else {
            return (
                <ModalHeader className="flex flex-col gap-1">Edit Treatment</ModalHeader>
            )
        }
    }


    const handlePublish = async () => {


        try {


            Swal.fire({

                title: "Do you want to publish course?",
                showCancelButton: true,
                confirmButtonText: "Confirm",
                animation: true,
                backdrop: false,



            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.patch(`/treatment/${initialData.id}/published/`, {
                        is_published: true
                    },
                        { headers: { Authorization: `Bearer ${token}` } })

                    setInitialData((prev: any) => {
                        return {
                            ...prev,
                            is_published: true
                        }
                    })

                    setRefresh((prev: boolean) => !prev)

                    toast.success('Course Published successfully', {
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
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.close();
                }
            })

        } catch (error) {
            toast.error('Sometning went wrong Please try again', {
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
            console.log(error)
        }
    }


    const handleUnPublish = async () => {
        try {


            Swal.fire({

                title: "Do you want to publish course?",
                showCancelButton: true,
                confirmButtonText: "Confirm",
                animation: true,
                backdrop: false,



            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.patch(`/treatment/${initialData.id}/published/`, {
                        is_published: false
                    },
                        { headers: { Authorization: `Bearer ${token}` } })

                    setInitialData((prev: any) => {
                        return {
                            ...prev,
                            is_published: false
                        }
                    })
                    setRefresh((prev: boolean) => !prev)
                    toast.success('Course Unpublished', {
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

                    console.log(data)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.close();
                }

            })




        } catch (error) {
            console.log(error)
            toast.error('Something went wrong try again', {
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
            <Modal
                size={"full"}
                isOpen={isOpen}
                closeButton={<div style={{ backgroundColor: 'red', padding: '5px', borderRadius: '50%' }}>
                    <XIcon size={20} color="white" />
                </div>}
                onClose={() => {
                    reset({
                        course_modules: [],
                        course_practicals: []
                    });
                    onClose()
                }}

            >
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent>
                        {(onClose) => (
                            <>

                                <HeaderComponent />

                                <ModalBody style={{ overflowY: 'scroll' }}>
                                    {/* <button className="p-6 bg-white text-black" onClick={() => {
                                        console.log({ timeLineType, endTimeAfternoon, startTimeMorning, endTimeMorning })
                                    }}>Test</button> */}
                                    <div className="ml-auto">
                                        {mode === "view" && (
                                            <>
                                                {
                                                    initialData.is_published ? <Button variant="light" type="button" onClick={handleUnPublish} className="bg-orange-600">Un publish</Button> : <Button onClick={handlePublish} type="button" variant="light" className="bg-orange-600">Publish</Button>
                                                }

                                            </>

                                        )}

                                    </div>

                                    {/* Use the register function to register the form fields */}
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Input
                                            defaultValue={initialData.name}
                                            disabled={mode === 'view'}
                                            label={<FormLabel label="Name" symbolEnable={true} />}
                                            errorMessage={errors.name && "Name is required"}
                                            labelPlacement="outside"
                                            type="text"
                                            {...register("name", { required: true })}
                                        />




                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Textarea
                                            defaultValue={initialData.description}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.description && "Description is required"}
                                            label={<FormLabel label="Description" symbolEnable={true} />}
                                            labelPlacement="outside"
                                            {...register("description", { required: true })}
                                        />
                                    </div>





                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Input
                                            defaultValue={initialData.location}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.location && "Location is required"}
                                            label={<FormLabel label="Location" symbolEnable={true} />}
                                            labelPlacement="outside"
                                            type="text"
                                            {...register("location", { required: true })}
                                        />
                                        <Input
                                            defaultValue={initialData.duration}
                                            disabled={mode === 'view'}
                                            label={<FormLabel label="Duration" symbolEnable={true} />}
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("duration", { required: true })}
                                        />


                                        <Select

                                            isDisabled={mode === 'view'}
                                            defaultSelectedKeys={initialData.duration_type ? [initialData.duration_type] : undefined}
                                            label={<FormLabel label="Duration Type" symbolEnable={true} />}
                                            labelPlacement="outside"
                                            placeholder="Select duration"
                                            {...register("duration_type", { required: true })}
                                        >
                                            <SelectItem key={"day"} value="day">day</SelectItem>
                                            <SelectItem key={"days"} value="days">days</SelectItem>
                                            <SelectItem key={"week"} value="week">week</SelectItem>
                                            <SelectItem key={"weeks"} value="weeks">Weeks</SelectItem>
                                            <SelectItem key={"month"} value="month">month</SelectItem>
                                            <SelectItem key={"months"} value="months">months</SelectItem>
                                            {/* Add other options as needed */}
                                        </Select>


                                        <Input
                                            defaultValue={initialData.seats_available}
                                            disabled={mode === 'view'}
                                            label={<FormLabel label="Seats Available" symbolEnable={true} />}
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("seats_available", { required: true })}
                                        />

                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Input
                                            defaultValue={initialData.actual_price}
                                            disabled={mode === 'view'}
                                            label={<FormLabel label="Price" symbolEnable={true} />}
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("actual_price", { required: true })}
                                        />
                                        <Input
                                            defaultValue={initialData.offer_persentage}
                                            disabled={mode === 'view'}
                                            label="Offer Percentage"
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("offer_persentage")}
                                        />



                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Textarea
                                            defaultValue={initialData.why_treatment1}
                                            disabled={mode === 'view'}
                                            label="Why treatment?"
                                            labelPlacement="outside"
                                            {...register("why_treatment1")}
                                        />

                                        <Textarea
                                            defaultValue={initialData.why_treatment2}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.description && "Description is required"}
                                            label="Why treatment 2 ?"
                                            labelPlacement="outside"
                                            {...register("why_treatment2")}
                                        />

                                        <Textarea
                                            defaultValue={initialData.why_treatment3}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.description && "Description is required"}
                                            label="Why treatment 3 ?"
                                            labelPlacement="outside"
                                            {...register("why_treatment3")}
                                        />
                                    </div>




                                    {/* modules */}

                                    <div className="mb-4">
                                        {
                                            mode == "view" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "add" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Add Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "edit" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Edit Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "edit" || mode == "add" && (
                                                <div className="flex justify-center items-center">
                                                    {
                                                        modules.length === 0 && (<Button size="lg" className="p-12" type="button" endContent={<PlusCircleIcon color="green" />} variant="ghost" onClick={addTheoryModule}>
                                                            Add Theory Modules
                                                        </Button>)
                                                    }

                                                </div>
                                            )
                                        }

                                        {
                                            mode == "view" && (
                                                <div className="flex flex-wrap gap-3 mt-3 flex-1">
                                                    {initialCourseModules.map((dat: { name: string, description: string }, index: number) => (

                                                        <div key={index} className="w-full min-w-[250px] max-w-fit border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                                                            <Listbox
                                                                aria-label="Actions"

                                                            // onAction={(key) => alert(key)}
                                                            >
                                                                <ListboxSection title={`module ${index + 1}`} showDivider>
                                                                    <ListboxItem key="new" className="text-[#d2d2d2]">Name: {dat?.name}</ListboxItem>
                                                                    <ListboxItem className="text-[#d2d2d2]" key="copy">Description: {dat?.description}</ListboxItem>
                                                                </ListboxSection>
                                                            </Listbox>
                                                        </div>

                                                    ))}
                                                </div>
                                            )
                                        }






                                        <div className="grid grid-cols-2 gap-2 ">
                                            {modules?.map((module, index) => (
                                                <div key={index} className="flex w-full  justify-center align-middle items-center flex-wrap md:flex-nowrap gap-4 pb-5">

                                                    <Input
                                                        // defaultValue={module.name} // Set default value
                                                        value={module.name}
                                                        onChange={(e) => handleTheoryModuleChange(index, 'name', e.target.value)}
                                                        disabled={mode === 'view'}
                                                        label={`Module Name ${index + 1}`}
                                                        labelPlacement="outside"
                                                    // {...register(`course_modules[${index}].name`, { required: true })}
                                                    />



                                                    <Input
                                                        disabled={mode === 'view'}
                                                        defaultValue={module.description} // Set default value
                                                        label={`Module Description ${index + 1}`}
                                                        labelPlacement="outside"
                                                        value={module.description}
                                                        onChange={(e) => handleTheoryModuleChange(index, 'description', e.target.value)}
                                                    // {...register(`course_modules[${index}].description`, { required: true })}
                                                    />


                                                    {index >= 0 && (
                                                        <div>
                                                            <Trash2Icon color="red" height={"20px"} className="mt-6 cursor-pointer" onClick={() => removeTheoryModule(index, module?.id)} />
                                                        </div>


                                                    )}
                                                    {index === modules.length - 1 && (
                                                        <div>
                                                            <PlusCircleIcon color="green" height={"20px"} className="mt-6 cursor-pointer" onClick={addTheoryModule} />
                                                        </div>


                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Button to add new module */}
                                        {/* <Button type="button" onClick={() => append({ name: '', description: '' })}>
                                            Add Module
                                        </Button> */}


                                    </div>



                                    {/* theorymodule end */}


                                    <div className="mb-4">
                                        {
                                            mode === "edit" && <>
                                                <div className="pb-12">
                                                    <h1 className="text-black dark:text-white font-bold ">
                                                        Edit Images
                                                    </h1>
                                                    <PhotosEditor setRefresh={setRefresh} authToken={token} images={initialData?.treatmentimages_treatment} treatmentId={initialData?.id} />
                                                </div>

                                            </>
                                        }
                                        <div>
                                            <h1 className="text-black dark:text-white font-bold">
                                                Upload Images
                                            </h1>
                                        </div>




                                        <div className="flex items-center justify-center">
                                            {
                                                mode === "add" && <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} register={register} />
                                            }

                                            {
                                                mode === "edit" && <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} register={register} />
                                            }



                                            {
                                                mode === "view" && <ViewImages imageStore={initialData?.treatmentimages_treatment} />
                                            }

                                        </div>

                                        {/* Button to add new module */}
                                        {/* <Button type="button" onClick={() => append({ name: '', description: '' })}>
                                            Add Module
                                        </Button> */}


                                    </div>

                                    {/* Add a submit button to the form */}
                                    {/* <Button type="submit" color="primary">Add</Button> */}

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={() => {
                                        reset();
                                        onClose()
                                    }}>
                                        Close
                                    </Button>
                                    <ButtonComponent />
                                </ModalFooter>




                            </>
                        )}

                    </ModalContent>
                </form>

            </Modal >
        </>
    )
}

export default AddTreatmentModal