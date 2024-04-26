import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "@/lib/axios";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Slide, toast } from "react-toastify";
import * as yup from 'yup';
import FormLabel from "@/components/Formhelpers/FormLabel";



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
    errors: any;
    setErrors: any;
}

interface RoleType {
    label: string;
    value: string
}

interface FormDataType {
    first_name: "",
    last_name: "",
    profile_image?: string,
    address_line_1: "",
    address_line_2: "",
    city: "",
    country: "",
    email_id: "",
    password: "",
    phone_number: "",
    role?: "",
    state: "",
    zip_code: ""
}

interface FormErrors {
    [key: string]: string | undefined;
    first_name: "";
    last_name: "";
    address_line_1: "";
    address_line_2: "";
    city: "";
    country: "";
    email_id: "";
    password: "";
    phone_number: "";
    role: "";
    state: "";
    zip_code: "";
}


function AddUserModal({ isOpen, onOpen, onOpenChange, token, refresh, setRefresh, onClose, mode, initialData, errors, setErrors }: AddUserProps) {


    const [formData, setFormData] = useState<FormDataType>({ ...initialData, role: initialData?.role?.id })
    const [roles, setRoles] = useState([])
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);


    //input field schema
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
        city: yup.string().notRequired(),
        zip_code: yup.string().notRequired(),
        state: yup.string().notRequired(),
        country: yup.string().notRequired(),
        address_line_1: yup.string().required('Address is required field'),
        address_line_2: yup.string().notRequired()
    },
    );


    useEffect(() => {
        setFormData({ ...initialData, role: initialData?.role?.id })
    }, [initialData])


    useEffect(() => {
        getRoles()
    }, [])


    const getRoles = async () => {
        try {

            const { data } = await axios.get('/roles/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
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


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const closer = () => {
        onClose()
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()
        let data: FormDataType = formData
        delete data.profile_image

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            if (mode === "edit") {
                console.log(data); // Access and submit form data here
                delete data.role;

                try {
                    const { data: res } = await axios.put(`/users/${initialData.id}/`, data, { headers: { Authorization: `Bearer ${token}` } })
                    setRefresh(!refresh)
                    closer()
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
                    closer()
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
        } catch (error: any) {
            const validationErrors: FormErrors = {
                first_name: "",
                last_name: "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                country: "",
                email_id: "",
                password: "",
                phone_number: "",
                role: "",
                state: "",
                zip_code: ""
            };
            if (error instanceof yup.ValidationError) {
                error.inner.forEach((err: any) => {
                    validationErrors[err.path] = err.message;
                });
            }
            setErrors(validationErrors);
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
            <form onSubmit={onSubmit}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <HeaderComponent />
                            <ModalBody style={{ overflowY: 'scroll' }}>
                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                    <Input
                                        onChange={handleChange}
                                        value={formData.email_id}
                                        placeholder="Please enter your email address"
                                        isDisabled={mode === 'view'}
                                        name="email_id"
                                        maxLength={60}
                                        errorMessage={errors?.email_id && errors?.email_id}
                                        labelPlacement="outside"
                                        startContent={
                                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                        }
                                        type="email"
                                        label={<FormLabel label="Email" symbolEnable={true} />}
                                    />

                                    {
                                        mode === "add" && (
                                            <Input
                                                onChange={handleChange}
                                                startContent={<></>}
                                                placeholder="6 letter and one special character and Capital"
                                                errorMessage={errors.password && errors.password}
                                                labelPlacement="outside"
                                                name="password"
                                                maxLength={60}
                                                value={formData.password}
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
                                                label={<FormLabel label="Password" symbolEnable={true} />}
                                            />
                                        )
                                    }
                                </div>

                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                                    <Input
                                        onChange={handleChange}
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        labelPlacement="outside"
                                        errorMessage={errors.first_name && errors.first_name}
                                        type="text"
                                        label={<FormLabel label="First Name" symbolEnable={true} />}
                                        placeholder="Enter your first name"
                                        name="first_name"
                                        maxLength={60}
                                        value={formData.first_name}
                                    />

                                    <Input
                                        onChange={handleChange}
                                        startContent={<></>}
                                        errorMessage={errors.last_name && errors.last_name}
                                        isDisabled={mode === "view"}
                                        labelPlacement="outside"
                                        placeholder="Enter your last name"
                                        type="text"
                                        label={<FormLabel label="Last Name" symbolEnable={true} />}
                                        name="last_name"
                                        maxLength={60}
                                        value={formData.last_name}
                                    />

                                    <Select
                                        onChange={handleChange}
                                        errorMessage={errors.role && errors.role}
                                        // unselectable="on"
                                        isDisabled={mode === "view"}
                                        label={<FormLabel label="Role" symbolEnable={true} />}
                                        placeholder="Please select Role"
                                        labelPlacement="outside"
                                        name="role"
                                        
                                        // selectedKeys={[formData?.role || ""]}
                                    >
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
                                        errorMessage={errors.phone_number && errors.phone_number}
                                        placeholder="Enter your Phone number without country code"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="number"
                                        label={<FormLabel label="Phone" symbolEnable={true} />}
                                        value={formData.phone_number}
                                        name="phone_number"
                                        maxLength={10}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        errorMessage={errors.city && errors.city}
                                        placeholder="Enter your City"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="city"
                                        name="city"
                                        value={formData.city}
                                        maxLength={60}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        errorMessage={errors.state && errors.state}
                                        placeholder="Enter your State"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="state"
                                        name="state"
                                        value={formData.state}
                                        maxLength={60}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                                    <Input
                                        errorMessage={errors.country && errors.country}
                                        placeholder="Enter your country"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        maxLength={60}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        errorMessage={errors.zip_code && errors.zip_code}
                                        placeholder="Enter your zip code"
                                        startContent={<></>}
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="number"
                                        label={<FormLabel label="Zip code" />}
                                        value={formData.zip_code}
                                        name="zip_code"
                                        maxLength={8}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        errorMessage={errors.address_line_1 && errors.address_line_1}
                                        startContent={<></>}
                                        placeholder="Write your address here"
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="Address 1"
                                        name="address_line_1"
                                        value={formData.address_line_1}
                                        maxLength={256}
                                        onChange={handleChange}
                                    />

                                    <Textarea
                                        errorMessage={errors.address_line_2 && errors.address_line_2}
                                        startContent={<></>}
                                        placeholder="Write your address 2 here"
                                        isDisabled={mode === "view"}
                                        endContent={<></>}
                                        labelPlacement="outside"
                                        type="text"
                                        label="Address 2"
                                        name="address_line_2"
                                        value={formData.address_line_2}
                                        maxLength={256}
                                        onChange={handleChange}
                                    />
                                </div>

                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={closer}>
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