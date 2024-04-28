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
    useDisclosure
} from "@nextui-org/react";
import { columns, users } from "./data";
import { capitalize } from "@/lib/utils";
import { PlusIcon } from "@/components/custom-icons/PlusIcon";
import { VerticalDotsIcon } from "@/components/custom-icons/VerticalDotsIcon";
import { ChevronDownIcon } from "@/components/custom-icons/ChevronDownIcon";
import { SearchIcon } from "@/components/custom-icons/SearchIcon";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddUserModal from "./_components/AddUserModal";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Slide, toast } from "react-toastify";
import TableSkeleton from "@/components/Skeletons/TableSkeleton";

//global variables
const statusColorMap: Record<string, ChipProps["color"]> = {
    Active: "success",
    Inactive: "danger",
};
const INITIAL_VISIBLE_COLUMNS = ["email_id", "first_name", "last_name", "phone_number", "role", "status"];
type User = typeof users[0];


//main component
export default function ManageUserPage() {

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
    const [users, setUsers] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
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
        zip_code: "",
    })

    useEffect(() => {
        getUsers()
    }, [refresh, currentPage]);



    const getUsers = async () => {

        if (!isOpen) (
            setLoading(true)
        )
        try {
            const { data } = await axios.get(`/users/?page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`
                }
            })
            const transformedUsers = data?.data?.map((user: any) => ({
                ...user, // Spread all existing properties
                roleId: user.role.id,
                roleName: user.role.name,
                role: undefined // Remove the original role object
            }));
            setCurrentPage(prevPage => data.current_page !== prevPage ? data.current_page : prevPage);
            setUsers(transformedUsers)
            setTotalCount(data.total)
            setTotalPages(data.total_pages)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    // handle modal open view, edit
    const handleModal = async (user: any, mod: string) => {
        if (mod === "view" || mod === "edit") {
            setMode(mod)
            try {
                const { data } = await axios.get(`/users/${user.id}/`, { headers: { Authorization: `Bearer ${session?.user.access_token}` } })
                setFormData(data)
                onOpen()
            } catch (error) {
                console.log(error)
            }
        }
    }


    const resetErrors = () => {
        setErrors({
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
            zip_code: "",
        })
    }


    //delete handler
    const handleDelete = async (id: string) => {
        try {
            const { data } = await axios.delete(`/users/${id}/`, {
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`
                }
            })
            setRefresh((prev) => !prev)
            toast.success(data.msg, {
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
        } catch (error:any) {

            toast.error(error?.response?.data.msg || 'Something went wrong Please Try again', {
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


    const handleUserStatus = async (id: string, status: string) => {
        try {
            const { data } = await axios.patch(`/users/${id}/`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`
                }
            })
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

    //table based components and states
    const [page, setPage] = React.useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];
        console.log(filterValue.length, "foooo", typeof (filterValue))
        if (filterValue.length == 0) {

            // filteredUsers = filteredUsers.filter((user: User) =>
            //     user?.email_id.toLowerCase().includes(filterValue.toLowerCase()),
            // );

            // setRefresh((prev) => !prev)


        }
        // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
        //     filteredUsers = filteredUsers.filter((user: User) =>
        //         Array.from(statusFilter).includes(user.status),
        //     );
        // }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);



    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User] as string;
            const second = b[sortDescriptor.column as keyof User] as string;
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        let truncatedValue = cellValue || "(-)";

        if (typeof truncatedValue === "string" && truncatedValue.length > 15) {
            truncatedValue = truncatedValue.slice(0, 15) + "..."; // Truncate and add ellipsis
        }

        switch (columnKey) {
            case "email_id":
                return (
                    // <User
                    //     avatarProps={{ radius: "lg", src: user.email_id }}
                    //     description={user.email_id}
                    //     name={cellValue}
                    // >
                    <div>
                        {truncatedValue}
                    </div>

                    // </User>
                );
            case "first_name":
                return (<div>{truncatedValue}</div>)

            case "last_name":
                return (<div>{truncatedValue}</div>)

            case "phone_number":
                return (<div>{truncatedValue}</div>)

            case "role":
                return (
                    <div className="flex flex-col">
                        {/* <p className="text-bold text-small capitalize">{cellValue || "(-)"}</p> */}
                        <p className="text-bold text-tiny capitalize text-default-400">{user.roleName || "(-)"}</p>
                    </div>
                );
            case "status":
                return (
                    <div className="flex flex-row">

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
                                    {/* <DropdownItem onClick={() => handleModal(user, "view")}>View</DropdownItem> */}
                                    <DropdownItem onClick={() => handleModal(user, "edit")}>Edit</DropdownItem>
                                    {
                                        user.status === 1 ? <DropdownItem onClick={() => handleUserStatus(user.id, '0')}> <h2 className="text-warning">Deactivate</h2></DropdownItem>
                                            : <DropdownItem onClick={() => handleUserStatus(user.id, '1')}> <h2 className="text-success">Activate</h2> </DropdownItem>

                                    }

                                    <DropdownItem onClick={() => handleDelete(user.id)}><h2 className="text-danger">Delete</h2></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                );

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
        console.log(event)
        if (event?.key === 'Enter') {

            if (value) {
                // setPage(1);
                setLoading(true)
                try {

                    console.log("true mwone")
                    const { data } = await axios.get(`/users/?search=${value}`, {
                        headers: {
                            Authorization: `Bearer ${session?.user.access_token}`
                        }
                    });

                    const transformedUsers = data?.data?.map((user: any) => ({
                        ...user, // Spread all existing properties
                        roleId: user.role.id,
                        roleName: user.role.name,
                        role: undefined // Remove the original role object
                    }));


                    setUsers(transformedUsers);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }finally{
                    setLoading(false)
                }
            } else {
                // console.log("else worked")
                // try {
                //     const { data } = await axios.get('/users', {
                //         headers: {
                //             Authorization: `Bearer ${session?.user.access_token}`
                //         }
                //     });

                //     const transformedUsers = data?.data?.map((user: any) => ({
                //         ...user, // Spread all existing properties
                //         roleId: user.role.id,
                //         roleName: user.role.name,
                //         role: undefined // Remove the original role object
                //     }));

                //     setUsers(transformedUsers);
                // } catch (error) {
                //     console.error('Error fetching all users:', error);
                // }

            }
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])


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
                            resetErrors()
                            setFormData({
                                "email_id": "",
                                "phone_number": "",
                                "description": "",
                                "first_name": "",
                                "last_name": "",
                                "country_code": "",
                                "address_line_1": "",
                                "address_line_2": "",
                                "country": "",
                                "state": "",
                                "city": "",
                                "zip_code": "",
                                "profile_image": "",
                                "status": 1,
                                "role": {
                                    "id": "",
                                    "name": ""
                                }
                            })
                            setMode("add")
                            onOpen()
                        }} endContent={<PlusIcon />}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {totalCount} users</span>
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
        users.length,
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


    if (loading) {
        return <TableSkeleton />
    }


    return (
        <>
            <Breadcrumb pageName="Manage users" />
            <AddUserModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} token={session?.user.access_token} refresh={refresh} setRefresh={setRefresh} onClose={onClose} mode={mode} initialData={formData} errors={errors} setErrors={setErrors} />
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
                    <TableBody emptyContent={"No users found"} items={sortedItems}>
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

