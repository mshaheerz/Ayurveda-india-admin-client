import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import { bookings } from '../data';

interface BookingProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange?: () => void;
    onClose: any;
    booking: any;
}
function ViewBookingModal({ isOpen, onOpen, onClose, booking }: BookingProps) {
    
    return (
        <Modal backdrop={"blur"} size='3xl' isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Booking Details</ModalHeader>
                        <ModalBody>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Course Name</h2>
                                    <p>{booking?.course?.name || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">User Name</h2>
                                    <p>{`${booking?.bookinguserinformations?.first_name || ""} ${booking?.bookinguserinformations?.last_name || ""}`.slice(0, 15) || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Phone Number</h2>
                                    <p>{booking?.bookinguserinformations?.phone_number || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Gender</h2>
                                    <p>{booking?.bookinguserinformations?.gender || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Country</h2>
                                    <p>{booking?.bookinguserinformations?.country || "(-)"}</p>
                                </div>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Course Code</h2>
                                    <p>{booking?.course?.short_name || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Email</h2>
                                    <p>{booking?.bookinguserinformations?.email_id || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Course Price</h2>
                                    <p>{parseFloat(booking?.course?.course_price).toFixed(2) || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">Age</h2>
                                    <p>{booking?.bookinguserinformations?.age || "(-)"}</p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-1">City</h2>
                                    <p>{booking?.bookinguserinformations?.city || "(-)"}</p>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            {/* <Button color="primary" onPress={onClose}>
                                Action
                            </Button> */}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ViewBookingModal