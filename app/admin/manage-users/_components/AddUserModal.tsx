import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
interface AddUserProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
}




function AddUserModal({ isOpen, onOpen, onOpenChange }: AddUserProps) {

    const roles = [{ label: "admin", value: "admin" }, { label: "super admin", value: "super-admin" }]
    const [modalPlacement, setModalPlacement] = useState("auto");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <Modal
            isOpen={isOpen}
            size="4xl"
            placement={"auto"}
            backdrop="blur"
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add New Role</ModalHeader>
                        <ModalBody>
                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input labelPlacement="outside" startContent={
                                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                } type="email" label="Email" />
                                <Input  labelPlacement="outside"  endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                      <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                      <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                  </button>
                                } type={isVisible ? "text" : "password"} label="Password" />

                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input  labelPlacement="outside"  type="text" label="Full name" />
                                <Select
                                    label="Role"
                                    labelPlacement="outside" 
                                >
                                    {/* {label: "Giraffe", value: "giraffe", description: "The tallest land animal"} */}
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Add Role
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AddUserModal