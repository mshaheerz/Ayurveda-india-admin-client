import { alertStyle } from "@/app/constatnts";
import Swal from "sweetalert2";



export const callAlert = (onDeleteConfirmed:any,title="Are you sure") => {
    Swal.fire({
        title: title,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        animation: true,
        backdrop: false,
        customClass: alertStyle,
        icon: "warning",
    }).then(async (result) => { 
        if (result.isConfirmed) {
            onDeleteConfirmed()
        }else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.close();
        }
    })
}
