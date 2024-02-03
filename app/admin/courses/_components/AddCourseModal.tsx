import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, SelectItem, Select, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import PhotosUploader from "./PhotoUploader";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import { Slide, toast } from "react-toastify";
import PhotosEditor from "./PhotoEditor";
import ViewImages from "./ViewImages";

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
}


function AddCourseModal({ isOpen, onOpen, onOpenChange, token, refresh, setRefresh, onClose, mode, initialData, setInitialData }: AddCourseProps) {
    const formRef = useRef(null);
    const [addedPhotos, setAddedPhotos] = useState([])
    const defaultValues = mode === "edit" ? initialData : {
        course_modules: [],
        course_practicals: []
    };
    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({ defaultValues });


    const initialCourseModules = initialData.modules || [];
    const initialPracticalModules = initialData.practicals || [];
    const [practical_modules, setPractical_Modules] = useState<Module[]>([]);
    const [theory_modules, setTheory_Modules] = useState<Module[]>([]);
    const [startTimeMorning, setStartTimeMorning] = useState("")
    const [endTimeMorning, setEndTimeMorning] = useState("")
    const [startTimeAfternoon, setStartTimeAfternoon] = useState("")
    const [endTimeAfternoon, setEndTimeAfternoon] = useState("")
    const [timeLineType, setTimeLineType] = useState("full_day")


    const handleTheoryModuleChange = (index: number, field: keyof Module, value: string) => {
        const updatedModules = [...theory_modules];
        updatedModules[index][field] = value;
        setTheory_Modules(updatedModules);
    };


    const addTheoryModule = () => {
        setTheory_Modules([...theory_modules, { name: '', description: '' }]);
    };


    const removeTheoryModule = (index: number) => {
        const updatedModules = [...theory_modules];
        updatedModules.splice(index, 1);
        setTheory_Modules(updatedModules);
    };





    //practical module add section
    const handleModuleChange = (index: number, field: keyof Module, value: string) => {
        const updatedModules = [...practical_modules];
        updatedModules[index][field] = value;
        setPractical_Modules(updatedModules);
    };

    const addModule = () => {
        setPractical_Modules([...practical_modules, { name: '', description: '' }]);
    };

    const removeModule = (index: number) => {
        const updatedModules = [...practical_modules];
        updatedModules.splice(index, 1);
        setPractical_Modules(updatedModules);
    };






    const ButtonComponent = () => {
        if (mode == "add") {
            return (
                <Button
                    type="submit" color="primary">
                    Add Course
                </Button>
            )
        } else if (mode == "view") {
            return (
                <></>
            )
        } else {
            return (
                <Button type="submit" color="primary">
                    Modify Course
                </Button>
            )
        }
    }










    useEffect(() => {
        console.log(initialData)
        if (mode === "add") {
            setPractical_Modules([])
            setTheory_Modules([])
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

            setPractical_Modules(initialPracticalModules)
            setTheory_Modules(initialCourseModules)
            setTimeLineType(initialData?.timeline?.[0]?.timeline_type)
            setStartTimeMorning(initialData?.timeline?.[0]?.start_time_morning)
            setEndTimeMorning(initialData?.timeline?.[0]?.end_time_morning)
            setStartTimeAfternoon(initialData?.timeline?.[0]?.start_time_afternoon)
            setEndTimeAfternoon(initialData?.timeline?.[0]?.end_time_afternoon)
        }

        if (mode == "view") {
            setPractical_Modules([])
            setAddedPhotos([])
            setTheory_Modules([])
            setTimeLineType(initialData?.timeline?.[0]?.timeline_type)
            setStartTimeMorning(initialData?.timeline?.[0]?.start_time_morning)
            setEndTimeMorning(initialData?.timeline?.[0]?.end_time_morning)
            setStartTimeAfternoon(initialData?.timeline?.[0]?.start_time_afternoon)
            setEndTimeAfternoon(initialData?.timeline?.[0]?.end_time_afternoon)

        }
    }, [initialData]);


    const onSubmit = async (data: any) => {
        console.log(data)
        const intpr = practical_modules?.map((dat) => {
            return {
                name: dat.name,
                description: dat.description
            }
        })

        const intprs = theory_modules?.map((dat) => {
            return {
                name: dat.name,
                description: dat.description
            }
        })
        const forms = {
            ...data,
            "course_practicals": JSON.stringify(intpr),
            "course_modules": JSON.stringify(intprs),
            "timeline_type": timeLineType,
            "start_time_morning": startTimeMorning || "",
            "end_time_morning": endTimeMorning || "",
            "start_time_afternoon": startTimeAfternoon || "",
            "end_time_afternoon": endTimeAfternoon || "",
        }
        console.log(forms)
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
                const { data } = await axios.put(`/course/${initialData.id}/`, formData,
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
            } catch (error) {
                toast.error('Something went wrong Please try again', {
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
                const { data } = await axios.post('/course/', formData,
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
            } catch (error) {
                toast.success('Something went wrong please try again', {
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
                <ModalHeader className="flex flex-col gap-1">Add New Course</ModalHeader>
            )
        } else if (mode == "view") {
            return (
                <ModalHeader className="flex flex-col gap-1">View Course Details</ModalHeader>
            )
        } else {
            return (
                <ModalHeader className="flex flex-col gap-1">Edit Course</ModalHeader>
            )
        }
    }


    const handlePublish = async () => {
        try {
            const { data } = await axios.patch(`/course/${initialData.id}/published/`, {
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
            const { data } = await axios.patch(`/course/${initialData.id}/published/`, {
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
                                    <button className="p-6 bg-white text-black" onClick={() => {
                                        console.log({ timeLineType, endTimeAfternoon, startTimeMorning, endTimeMorning })
                                    }}>Test</button>
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
                                            label="Name"
                                            errorMessage={errors.name && "Name is required"}
                                            labelPlacement="outside"
                                            type="text"
                                            {...register("name", { required: true })}
                                        />


                                        <Input
                                            defaultValue={initialData.short_name}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.short_name && "Short name is required"}
                                            label="Short Name"
                                            labelPlacement="outside"
                                            type="text"
                                            {...register("short_name", { required: true })}
                                        />

                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Textarea
                                            defaultValue={initialData.description}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.description && "Description is required"}
                                            label="Description"
                                            labelPlacement="outside"
                                            {...register("description", { required: true })}
                                        />
                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Input
                                            defaultValue={initialData.location}
                                            disabled={mode === 'view'}
                                            errorMessage={errors.location && "Location is required"}
                                            label="Location"
                                            labelPlacement="outside"
                                            type="text"
                                            {...register("location", { required: true })}
                                        />
                                        <Input
                                            defaultValue={initialData.duration}
                                            disabled={mode === 'view'}
                                            label="Duration"
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("duration", { required: true })}
                                        />


                                        <Select

                                            isDisabled={mode === 'view'}
                                            defaultSelectedKeys={[initialData.duration_type]}
                                            label="Duration Type"
                                            labelPlacement="outside"
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
                                            label="Seats Available"
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("seats_available", { required: true })}
                                        />

                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        <Input
                                            defaultValue={initialData.actual_course_price}
                                            disabled={mode === 'view'}
                                            label="Price"
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("actual_course_price", { required: true })}
                                        />
                                        <Input
                                            defaultValue={initialData.offer_persentage}
                                            disabled={mode === 'view'}
                                            label="Offer Percentage"
                                            labelPlacement="outside"
                                            type="number"
                                            {...register("offer_persentage", { required: true })}
                                        />
                                      
                                        {/* Timeline Type */}
                                        <Select
                                            isDisabled={mode === 'view'}
                                            errorMessage={errors.timeline_type && "Timeline Type is required"}
                                            defaultSelectedKeys={[timeLineType || "full_day" ]}
                                            label="Timeline Type"
                                            onChange={(e) => setTimeLineType(e.target.value)}
                                            labelPlacement="outside"
                                            required={true}
                                        >
                                            <SelectItem  key="full_day" value="full_day">Full Day</SelectItem>
                                            <SelectItem key="half_day" value="half_day">Half Day</SelectItem>
                                        </Select>
                                        {/* Render time inputs based on timeline_type */}



                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-5">
                                        {<RenderTimeInputs />}
                                    </div>



                                    {/* theory modules */}

                                    <div className="mb-4">
                                        {
                                            mode == "view" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Theory Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "add" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Add Theory Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "edit" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Edit Theory Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "edit" || mode == "add" && (
                                                <div className="flex justify-center items-center">
                                                    {
                                                        theory_modules.length === 0 && (<Button size="lg" className="p-12" type="button" endContent={<PlusCircleIcon color="green" />} variant="ghost" onClick={addTheoryModule}>
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

                                                        <div className="w-full min-w-[200px] max-w-fit border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                                                            <Listbox
                                                                aria-label="Actions"

                                                                onAction={(key) => alert(key)}
                                                            >
                                                                <ListboxSection title={`module ${index + 1}`} showDivider>
                                                                    <ListboxItem key="new">Name: {dat?.name}</ListboxItem>
                                                                    <ListboxItem key="copy">Description: {dat?.description}</ListboxItem>
                                                                </ListboxSection>
                                                            </Listbox>
                                                        </div>

                                                    ))}
                                                </div>
                                            )
                                        }






                                        <div className="grid grid-cols-2 gap-2 ">
                                            {theory_modules?.map((module, index) => (
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
                                                            <Trash2Icon color="red" height={"20px"} className="mt-6 cursor-pointer" onClick={() => removeTheoryModule(index)} />
                                                        </div>


                                                    )}
                                                    {index === theory_modules.length - 1 && (
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
                                            mode == "view" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Practical Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "add" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Add Practical Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "edit" && (
                                                <>
                                                    <h1 className="text-black dark:text-white font-bold">
                                                        Edit Practical Modules
                                                    </h1>
                                                </>
                                            )
                                        }

                                        {
                                            mode == "edit" || mode == "add" && (
                                                <div className="flex justify-center items-center">
                                                    {practical_modules.length === 0 && ( // Check if there are no fields
                                                        <Button type="button" size="lg" className="p-12" variant="ghost" endContent={<PlusCircleIcon color="green" />}
                                                            // onClick={() => appendPractical({ name: '', description: '' })}
                                                            onClick={addModule}
                                                        >
                                                            Add Practical Modules
                                                        </Button>

                                                    )}
                                                </div>
                                            )
                                        }

                                        {
                                            mode == "view" && (
                                                <div className="flex flex-wrap gap-3 mt-3 flex-1">
                                                    {initialPracticalModules.map((dat: { name: string, description: string }, index: number) => (

                                                        <div key={index} className="w-full min-w-[200px] max-w-fit border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                                                            <Listbox
                                                                aria-label="Actions"

                                                                onAction={(key) => alert(key)}
                                                            >
                                                                <ListboxSection title={`module ${index + 1}`} showDivider>
                                                                    <ListboxItem key="new">Name: {dat?.name}</ListboxItem>
                                                                    <ListboxItem key="copy">Description: {dat?.description}</ListboxItem>
                                                                </ListboxSection>
                                                            </Listbox>
                                                        </div>

                                                    ))}
                                                </div>
                                            )
                                        }


                                        <div className="grid grid-cols-2 gap-2 ">



                                            {practical_modules?.map((module, index) => (
                                                <div key={index} className="flex w-full  justify-center align-middle items-center flex-wrap md:flex-nowrap gap-4 pb-5">

                                                    <Input
                                                        // defaultValue={module.name}
                                                        disabled={mode === 'view'}
                                                        label={`Module Name ${index + 1}`}
                                                        labelPlacement="outside"
                                                        value={module.name}
                                                        onChange={(e) => handleModuleChange(index, 'name', e.target.value)}
                                                    // {...register(`course_practicals[${index}].name`, { required: true })}
                                                    />



                                                    <Input
                                                        disabled={mode === 'view'}
                                                        // defaultValue={module.description} // Provide default value
                                                        label={`Module Description ${index + 1}`}
                                                        labelPlacement="outside"
                                                        value={module.description}
                                                        onChange={(e) => handleModuleChange(index, 'description', e.target.value)}
                                                    // {...register(`course_practicals[${index}].description`, { required: true })}
                                                    />


                                                    {index >= 0 && (
                                                        <div>
                                                            <Trash2Icon color="red" height={"20px"} className="mt-6 cursor-pointer"
                                                                // onClick={() => removePractical(index)} 
                                                                onClick={() => removeModule(index)}
                                                            />
                                                        </div>


                                                    )}
                                                    {index === practical_modules.length - 1 && (
                                                        <div>
                                                            <PlusCircleIcon color="green" height={"20px"} className="mt-6 cursor-pointer"
                                                                // onClick={() => appendPractical({ name: '', description: '' })} 
                                                                onClick={addModule}
                                                            />
                                                        </div>


                                                    )}
                                                </div>
                                            ))}
                                        </div>
 {
                                            mode === "edit" && <>
                                                <div className="pb-12">
                                                    <h1 className="text-black dark:text-white font-bold ">
                                                      Edit Images
                                                    </h1>

                                                    <PhotosEditor setRefresh={setRefresh} authToken={token} images={initialData?.images} />
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
                                                mode === "add"  && <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} register={register} />
                                            } 

                                            {
                                                mode==="edit" && <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} register={register} />
                                            }



                                            {
                                                mode === "view" && <ViewImages imageStore={initialData?.images} />
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

export default AddCourseModal