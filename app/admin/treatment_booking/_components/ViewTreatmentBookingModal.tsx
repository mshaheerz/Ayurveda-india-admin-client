import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import { bookings } from '../data';
import { XIcon } from 'lucide-react';
import moment from "moment"
interface BookingProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange?: () => void;
    onClose: any;
    booking: any;
}
function ViewTreatmentBookingModal({ isOpen, onOpen, onClose, booking }: BookingProps) {
    const bookingDate = moment(booking?.booking_date);

    // Format the date
    const formattedDate = bookingDate.format('MMMM DD, YYYY');
    return (
        <Modal className='main-bro'
            size='full'
            isOpen={isOpen}
            onClose={onClose}
            closeButton={<div style={{ backgroundColor: 'red', padding: '5px', borderRadius: '50%' }}>
                <XIcon size={20} color="white" />
            </div>}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Booking Details</ModalHeader>
                        <ModalBody style={{ overflowY: 'scroll' }}>
                            <div className='border rounded-md px-5'>
                                <div className='text-end text-gray-3 text-sm'>
                                    Booked on {formattedDate}
                                </div>
                                <h2 className='dark:text-white text-black text-xl font-semibold py-3'>User information</h2>
                                <div className='grid grid-cols-2 gap-4'>

                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Username</h2>
                                        <p>{`${booking?.bookinguserinformations?.first_name || ""} ${booking?.bookinguserinformations?.last_name || ""}`.slice(0, 15) || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Email</h2>
                                        <p>{booking?.bookinguserinformations?.email_id || "(-)"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Phone number</h2>
                                        <p>{booking?.bookinguserinformations?.phone_number || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Gender</h2>
                                        <p>{booking?.bookinguserinformations?.gender || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Age</h2>
                                        <p>{booking?.bookinguserinformations?.age || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Country</h2>
                                        <p>{booking?.bookinguserinformations?.country || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">City</h2>
                                        <p>{booking?.bookinguserinformations?.city || "(-)"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='border rounded-md px-5 '>
                                <h2 className='dark:text-white text-black text-xl font-semibold py-3'>Treatment information</h2>
                                <div className='grid grid-cols-2 gap-4'>


                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Treatment Name</h2>
                                        <p>{booking?.treatment?.name || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Treatment Price</h2>
                                        <p>{parseFloat(booking?.treatment?.actual_price).toFixed(2) || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Offer percentage</h2>
                                        <p>{parseFloat(booking?.treatment?.offer_persentage).toFixed(2) || "(-)"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold mb-1">Total Price</h2>
                                        <p>{parseFloat(booking?.treatment?.grant_price).toFixed(2) || "(-)"}</p>
                                    </div>

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

export default ViewTreatmentBookingModal