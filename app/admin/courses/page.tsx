"use client"
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    useDisclosure,
    Skeleton
} from "@nextui-org/react";
import '@sweetalert2/theme-dark/dark.css';
import { columns, courses, statusOptions } from "./data";
import { capitalize } from "@/lib/utils";
import { PlusIcon } from "@/components/custom-icons/PlusIcon";
import { VerticalDotsIcon } from "@/components/custom-icons/VerticalDotsIcon";
import { ChevronDownIcon } from "@/components/custom-icons/ChevronDownIcon";
import { SearchIcon } from "@/components/custom-icons/SearchIcon";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";
import AddCourseModal from "./_components/AddCourseModal";
import { CheckIcon, CrossIcon, CrosshairIcon, XIcon } from "lucide-react";
import { Slide, toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import SpinLoader from "@/components/common/spinLoader";
import TableSkeleton from "@/components/Skeletons/TableSkeleton";


//global variables
const statusColorMap: Record<string, ChipProps["color"]> = {
    Active: "success",
    Inactive: "danger",
};

const publishedColorMap: Record<string, ChipProps["color"]> = {
    published: "success",
    notpublished: "danger",

}
const INITIAL_VISIBLE_COLUMNS = ["name", "short_name", "duration", "course_price", "seats_available", "is_published", "status"];
type Course = typeof courses[0];




// main component
export default function CoursePage() {
    const { data: session } = useSession()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });
    const [formData, setFormData] = useState({}); // Your form data state
    const [mode, setMode] = useState('view'); // Default to view mode
    const [courses, setcourses] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCourse()
    }, [refresh, currentPage]);


    //fetch course
    const getCourse = async () => {
        console.log(session?.user)
        if (!isOpen) (
            setLoading(true)
        )

        try {
            const { data } = await axios.get(`/course/?page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`
                }
            })

            // setCurrentPage(data.current_page)
            setCurrentPage(prevPage => data.current_page !== prevPage ? data.current_page : prevPage);
            setTotalCount(data.total)
            setTotalPages(data.total_pages)
            setcourses(data.data)
            setLoading(false)


        } catch (error) {
            console.log(error)
            setLoading(false)

        } finally {
            // setLoading(false)
        }

    }

    // handle modal open view, edit
    const handleModal = async (course: any, mod: string) => {
        if (mod === "view" || mod === "edit") {
            setMode(mod)
            try {
                const { data } = await axios.get(`/course/${course.id}/`, { headers: { Authorization: `Bearer ${session?.user.access_token}` } })
                setFormData(data)
                onOpen()
            } catch (error) {
                console.log(error)
            }
        }
    }

    //delete function 
    const handleDelete = async (id: string) => {
        try {
            const { data } = await axios.delete(`/course/${id}/`, {
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`
                }
            })
            setRefresh((prev) => !prev)
            toast.success('Course Deleted ', {
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
            console.log(error)
            setRefresh((prev) => !prev)
            toast.error('something went wrong', {
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

    const handleCourseStatus = async (id: string, status: string) => {
        try {
            const { data } = await axios.patch(`/course/${id}/`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`
                }
            })
            console.log(data)
            setRefresh((prev) => !prev)
            toast.success(data?.msg, {
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
            toast.error('Something went wrong Please Try again', {
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

    //table related states and components
    const [page, setPage] = React.useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredcourses = [...courses];

        if (filterValue.length == 0) {
            // filteredcourses = filteredcourses.filter((user: Course) =>
            //     user?.name.toLowerCase().includes(filterValue.toLowerCase()),
            // );
            // setRefresh((prev) => !prev)
        }
        // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
        //     filteredcourses = filteredcourses.filter((user: Course) =>
        //         Array.from(statusFilter).includes(user.status),
        //     );
        // }

        return filteredcourses;
    }, [courses, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Course, b: Course) => {
            const first = a[sortDescriptor.column as keyof Course] as string;
            const second = b[sortDescriptor.column as keyof Course] as string;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    const renderCell = React.useCallback((course: Course, columnKey: React.Key) => {
        const cellValue = course[columnKey as keyof Course];

        let truncatedValue = cellValue || "(-)";

        if (typeof truncatedValue === "string" && truncatedValue.length > 15) {
            truncatedValue = truncatedValue.slice(0, 15) + "..."; // Truncate and add ellipsis
        }

        switch (columnKey) {
            case "name":
                return (
                    // <User


                    //     avatarProps={{ radius: "lg",alt:"ADK" }}
                    //     description={user.email_id}
                    //     name=
                    // >
                    <div>
                        {truncatedValue}
                    </div>

                    // </User>
                );
            case "short_name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{truncatedValue}</p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">{user.short_name || "no data"}</p> */}
                    </div>
                );
            case "status":
                return (
                    <div className="flex">
                        <Chip className="capitalize" color={statusColorMap[cellValue == 1 ? 'Active' : 'Inactive']} size="sm" variant="dot">
                            {cellValue == 1 ? 'Active' : 'Inactive'}
                        </Chip>
                        <div className="relative flex justify-center items-center gap-2">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button isIconOnly size="sm" variant="light">
                                        <VerticalDotsIcon className="text-default-300" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => { handleModal(course, "view") }}>View</DropdownItem>
                                    <DropdownItem onClick={() => { handleModal(course, "edit") }}>Edit</DropdownItem>
                                    {
                                        course.status === 1 ? <DropdownItem onClick={() => handleCourseStatus(course.id, '0')}> <h2 className="text-warning">Deactivate</h2></DropdownItem>
                                            : <DropdownItem onClick={() => handleCourseStatus(course.id, '1')}> <h2 className="text-success">Activate</h2> </DropdownItem>

                                    }
                                    <DropdownItem onClick={() => handleDelete(course.id)}>Delete</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                );

            case "is_published":
                return (
                    <Chip className="capitalize" color={publishedColorMap[cellValue ? 'published' : 'notpublished']} size="sm" variant="dot">
                        {cellValue == 1 ? "Published" : "Not published"}
                    </Chip>
                )
            case "duration":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue} {course?.duration_type || "(-)"}</p>

                    </div>
                )
            case "seats_available":
                return (
                    <div>
                        {truncatedValue}
                    </div>
                )
            case "course_price":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{(isNaN(parseFloat(course.course_price)) || course.course_price === "" ? "(-)" : parseFloat(course.course_price).toFixed(2))} </p>

                    </div>
                )


            // case "actions":
            //     return (

            //     );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
    }, [totalPage, currentPage]);

    const onPreviousPage = React.useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback(async (value?: string, event?: React.KeyboardEvent<HTMLInputElement>) => {
        setFilterValue(value || "");
        if (event?.key === 'Enter') {

            if (value) {
                setLoad(true)
                try {

                    console.log("true mwone")
                    const { data } = await axios.get(`/course/?search=${value}`, {
                        headers: {
                            Authorization: `Bearer ${session?.user.access_token}`
                        }
                    });



                    setcourses(data.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                } finally {
                    setLoad(false)
                }
            } else {
                setFilterValue("");
            }

        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const [load, setLoad] = useState(false)



    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">

                <div className="flex justify-between  gap-3 items-end">

                    <Input
                        isClearable
                        className="w-full  sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        onKeyDown={(e) => onSearchChange(filterValue, e)}
                    />
                    <div className="flex gap-3">
                        {/* <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown> */}
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" onPress={() => {
                            setMode("add")
                            setFormData({
                                name: "",
                                short_name: "",
                                description: "",
                                location: "",
                                duration: "",
                                durationType: "",
                                seats_available: "",
                                actual_course_price: "",
                                practicals: [],
                                modules: [],
                                offer_persentage: "",
                                timeline_type: "",
                                course_modules: [],
                                course_practicals: [],
                                timeline: [],
                                start_time_morning: "",
                                end_time_morning: "",
                                start_time_afternoon: "",
                                end_time_afternoon: "",

                            })
                            onOpen()

                        }} endContent={<PlusIcon />}>
                            Add New
                        </Button>
                    </div>

                </div>


                <div className="flex justify-between items-center">

                    <span className="text-default-400 text-small">Total {totalCount} Courses</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page: 10
                        {/* <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select> */}
                    </label>

                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        courses.length,
        hasSearchFilter,
    ]);


    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">

                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={currentPage}
                    total={totalPage}
                    onChange={setCurrentPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={currentPage === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={totalPage === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>

            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    if(load){
        return <TableSkeleton />
    }


    if (loading) {
        return <SpinLoader />
    }


    //main component return
    return (
        <>
            <Breadcrumb pageName="Courses" />
            <AddCourseModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} token={session?.user.access_token} refresh={refresh} setRefresh={setRefresh} onClose={onClose} mode={mode} initialData={formData} setInitialData={setFormData} />
            <div>
                <Table
                    aria-label="Example table with custom cells, pagination and sorting"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                        wrapper: "max-h-[382px]",
                    }}
                    selectedKeys={selectedKeys}
                    selectionMode="none"
                    sortDescriptor={sortDescriptor}
                    topContent={topContent}
                    topContentPlacement="outside"
                    onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
                >
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"No courses found"} items={sortedItems}>
                        {(item: any) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

