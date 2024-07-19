import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportToPdf = async (data) => {
    const doc = new jsPDF('landscape');

    // Add table headers
    const tableColumn = [
        'Image',
        'ID', 
        'Student Name', 
        'Father\'s Name', 
        'Mother\'s Name', 
        'Class', 
        'Address', 
        'Mobile Number', 
        'School Name', 
        'School Code', 
        'Samagra ID', 
        'Session', 
        'Student ID No', 
        'Aadhar', 
        'Date of Birth', 
        'Section', 
        'House Name', 
        'Blood Group', 
        'Other 1', 
        'Other 2', 
        'Other 3', 
        'Created At', 
        'Updated At'
    ];

    // Function to convert image URL to base64
    const getBase64ImageFromURL = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/jpeg');
                resolve(dataURL);
            };
            img.onerror = (error) => {
                reject(error);
            };
            img.src = url;
        });
    };

    // Prepare the table rows
    const tableRows = await Promise.all(data.map(async (student) => {
        const imgBase64 = await getBase64ImageFromURL(student.img);
        return [
            imgBase64, // Base64 image
            student.id,
            student.studentname,
            student.fathersname,
            student.mothersname,
            student.class,
            student.address,
            student.mobilenumber,
            student.schoolname,
            student.schoolcode,
            student.samagraid,
            student.session,
            student.studentidno,
            student.aadhar,
            student.dob,
            student.section,
            student.housename,
            student.Bloodgroup,
            student.other1,
            student.other2,
            student.other3,
            student.createdAt,
            student.updatedAt
        ];
    }));

    // Add table to the PDF
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 10,
        didDrawCell: (data) => {
            if (data.column.index === 0 && data.cell.raw) {
                doc.addImage(data.cell.raw, 'JPEG', data.cell.x + 2, data.cell.y + 2, 20, 20);
            }
        }
    });

    doc.save('student_data.pdf');
};

export default exportToPdf;
