import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import axios from "@/lib/axios";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Slide, toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
interface AddUserProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    token: string | undefined;
    refresh: boolean;
    setRefresh: any;
    onClose: any;
    mode: string;
    initialData: any;
}

interface RoleType {
    label: string;
    value: string
}


function AddUserModal({ isOpen, onOpen, onOpenChange, token, refresh, setRefresh, onClose, mode, initialData }: AddUserProps) {

    const validationSchema = yup.object().shape({
        email_id: yup.string().email().required('Email is a required field'),
        password: mode === "edit" ? yup
            .string()
            .notRequired()
            : yup
                .string()
                .required()
                .min(6)
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.'
                ),

        first_name: yup.string().required('First name is a required field').min(4),
        last_name: yup.string().notRequired(),
        role: yup.string().required(),
        phone_number: yup
            .string()
            .required('Phone number is required')
            .matches(
                /^[0-9]{10}$/,
                'Invalid phone number. Please enter a 10-digit phone number without spaces or special characters.'
            ),
        city: yup.string().required('city is required'),
        zip_code: yup.string().notRequired(),
        state: yup.string().required('State is required'),
        country: yup.string().required('country is required'),
        address_line_1: yup.string().required('Address is required field'),
        address_line_2: yup.string().notRequired()
    });
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        if (isOpen) {
            reset(initialData);  // Reset form with initial data when modal opens
            reset({ role: initialData?.role?.id })

            // Set default value for uncontrolled input (Textarea)
        }
    }, [isOpen, reset, initialData]);

    // ... (rest of the component code)





    const [roles, setRoles] = useState([])
    useEffect(() => {
        getRoles()
    }, [])

    const getRoles = async () => {
        try {
            const { data } = await axios.get('/roles/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log(data)
            const labelized = data.map((dat: { id: string, name: string }) => {
                return ({
                    label: dat.name,
                    value: dat.id
                })

            })
            setRoles(labelized)


        } catch (error) {
            console.log(error)
        }

    }
    // const roles = [{ label: "admin", value: "admin" }, { label: "super admin", value: "super-admin" }]

    const [modalPlacement, setModalPlacement] = useState("auto");
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (data: any) => {
        if (mode === "edit") {
            console.log(data); // Access and submit form data here
            try {
                const { data: res } = await axios.put(`/users/${initialData.id}/`, data, { headers: { Authorization: `Bearer ${token}` } })
                setRefresh(!refresh)
                reset()

                onClose()
                toast.success('Successfully edited', {
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
            }

        } else {
            try {
                const { data: res } = await axios.post(`/users/`, data, { headers: { Authorization: `Bearer ${token}` } })
                console.log(res, "res")
                setRefresh(!refresh)
                reset()
                onClose()
                toast.success('User Added successfully', {
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

            }
        }


    };

    const HeaderComponent = () => {
        if (mode == "add") {
            return (
                <ModalHeader className="flex flex-col gap-1">Add New User</ModalHeader>
            )
        } else if (mode == "view") {
            return (
                <ModalHeader className="flex flex-col gap-1">View User Details</ModalHeader>
            )
        } else {
            return (
                <ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
            )
        }
    }
    const ButtonComponent = () => {
        if (mode == "add") {
            return (
                <Button type="submit" color="primary">
                    Add User
                </Button>
            )
        } else if (mode == "view") {
            return (
                <></>
            )
        } else {
            return (
                <Button type="submit" color="primary">
                    Edit Role
                </Button>
            )
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            size={"4xl"}
            placement={"top"}
            backdrop="blur"
            onOpenChange={onOpenChange}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <HeaderComponent />


                            <ModalBody style={{ overflowY: 'scroll' }}>
                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                    <Input
                                        defaultValue={initialData.email_id}
                                        placeholder="Please enter your email address"
                                        isDisabled={mode === 'view'}
                                        {...register("email_id")}
                                        errorMessage={errors?.email_id && errors?.email_id?.message}
                                        labelPlacement="outside"
                                        startContent={
                                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                        }

                                        type="email"
                                        label="Email*"
                                    />

                                    {
                                        mode === "add" && (
                                            <Input
                                                startContent={<></>}
                                                placeholder="6 letter and one special character and Capital"
                                                errorMessage={errors.password && errors.password.message}
                                                labelPlacement="outside"
                                                endContent={
                                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                                        {isVisible ? (
                                                            <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                                                        ) : (
                                                            <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                                        )}
                                                    </button>
                                                }
                                                type={isVisible ? "text" : "password"}
                                                label="Password*"
                                                {...register("password", { required: true })}
                                            />
                                        )
                                    }


                                </div>

                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                                    <Input
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData?.first_name}
                                        labelPlacement="outside"
                                        errorMessage={errors.first_name && errors.first_name.message}
                                        type="text"
                                        label="First Name*"
                                        placeholder="Enter your first name"
                                        {...register("first_name")}
                                    />

                                    <Input
                                        startContent={<></>}
                                        errorMessage={errors.last_name && errors.last_name.message}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData?.last_name}
                                        labelPlacement="outside"
                                        placeholder="Enter your last name"
                                        type="text"
                                        label="Last Name"
                                        {...register("last_name")}
                                    />

                                    <Select
                                        errorMessage={errors.role && errors.role.message}
                                        unselectable="off"
                                        isDisabled={mode === "view"}
                                        defaultSelectedKeys={mode === "view" || mode === "edit" ? [initialData?.role?.id] : []}
                                        label="Role*"
                                        placeholder={"Please select Role"}
                                        labelPlacement="outside"
                                        {...register("role",)}
                                    >
                                        {/* {label: "Giraffe", value: "giraffe", description: "The tallest land animal"} */}
                                        {roles.map((role: RoleType) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                </div>

                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                                    <Input
                                        errorMessage={errors.phone_number && errors.phone_number.message}
                                        placeholder="Enter your Phone number without country code"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.phone_number}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="number"
                                        label="Phone*"
                                        {...register("phone_number", { required: true })}
                                    />

                                    <Input
                                        errorMessage={errors.city && errors.city.message}
                                        placeholder="Enter your City"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.city}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="city"
                                        {...register("city", { required: true })}
                                    />

                                    <Input
                                        errorMessage={errors.state && errors.state.message}
                                        placeholder="Enter your State"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.state}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="state"
                                        {...register("state", { required: true })}
                                    />

                                </div>

                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                                    <Input
                                        errorMessage={errors.country && errors.country.message}
                                        placeholder="Enter your country"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.country}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="Country"
                                        {...register("country", { required: true })}
                                    />


                                    <Input
                                        errorMessage={errors.zip_code && errors.zip_code.message}
                                        placeholder="Enter your zip code"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.zip_code}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="number"
                                        label="Zip code"
                                        {...register("zip_code")}
                                    />

                                </div>

                                <div>

                                    <Textarea
                                        errorMessage={errors.address_line_1 && errors.address_line_1.message}
                                        startContent={<></>}
                                        placeholder="Write your address here"
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.address_line_1}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="Address"
                                        {...register("address_line_1")}
                                    />

                                    <Textarea
                                        errorMessage={errors.address_line_2 && errors.address_line_2.message}
                                        startContent={<></>}
                                        placeholder="Write your second address here"
                                        isDisabled={mode === "view"}
                                        defaultValue={initialData.address_line_2}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="Secondary Address"
                                        {...register("address_line_2")}
                                    />



                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <ButtonComponent />
                            </ModalFooter>


                        </>
                    )}
                </ModalContent>
            </form>
        </Modal>
    )
}

export default AddUserModal