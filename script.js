document.getElementById('convertBtn').addEventListener('click', function () {
    const inputType = document.getElementById('inputFileType').value;
    const outputType = document.getElementById('outputFileType').value;
    const fileInput = document.getElementById('fileInput');
    const downloadLink = document.getElementById('downloadLink');
    const canvas = document.getElementById('imageCanvas');
    const downloadLinksContainer = document.getElementById('downloadLinksContainer'); // Download container
    downloadLink.style.display = 'none'; // Hide single download link
    downloadLinksContainer.innerHTML = ''; // Clear previous downloads

    if (!fileInput.files.length) {
        alert('Please select a file.');
        return;
    }

    const file = fileInput.files[0];
    const fileName = file.name.split('.').slice(0, -1).join('.'); // Extract file name without extension
    const reader = new FileReader();

    // Handle image conversions (JPEG/PNG to JPEG/PNG, PDF)
    if (inputType === 'jpeg' || inputType === 'png') {
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Handle image to PDF conversion
                if (outputType === 'pdf') {
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();

                    // Fit the image proportionally on the PDF page
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

                    const newImgWidth = imgWidth * scaleFactor;
                    const newImgHeight = imgHeight * scaleFactor;

                    const xOffset = (pageWidth - newImgWidth) / 2;
                    const yOffset = (pageHeight - newImgHeight) / 2;

                    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', xOffset, yOffset, newImgWidth, newImgHeight);
                    const pdfBlob = pdf.output('blob');
                    const pdfURL = URL.createObjectURL(pdfBlob);
                    const pdfDownloadLink = document.createElement('a');
                    pdfDownloadLink.href = pdfURL;
                    pdfDownloadLink.download = `${fileName}-convertedbySrimukhesh.pdf`;
                    pdfDownloadLink.style.display = 'block';
                    pdfDownloadLink.textContent = 'Download Converted PDF';
                    downloadLinksContainer.appendChild(pdfDownloadLink);
                } else {
                    // Image to Image conversion
                    const mimeType = outputType === 'jpeg' ? 'image/jpeg' : 'image/png';
                    const convertedImageURL = canvas.toDataURL(mimeType);
                    const imageDownloadLink = document.createElement('a');
                    imageDownloadLink.href = convertedImageURL;
                    imageDownloadLink.download = `${fileName}-convertedbySrimukhesh.${outputType}`;
                    imageDownloadLink.style.display = 'block';
                    imageDownloadLink.textContent = `Download Converted ${outputType.toUpperCase()}`;
                    downloadLinksContainer.appendChild(imageDownloadLink);
                }
            };
        };
        reader.readAsDataURL(file);
    }
    // Handle PDF to Image conversion (Multiple Pages)
    else if (inputType === 'pdf' && (outputType === 'jpeg' || outputType === 'png')) {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

        reader.onload = async function (e) {
            const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
            const pdf = await loadingTask.promise;
            const totalPages = pdf.numPages;

            // Loop through all pages of the PDF sequentially
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 3 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport,
                };
                
                await page.render(renderContext).promise;

                const mimeType = outputType === 'jpeg' ? 'image/jpeg' : 'image/png';
                const convertedImageURL = canvas.toDataURL(mimeType);

                const pageDownloadLink = document.createElement('a');
                pageDownloadLink.href = convertedImageURL;
                pageDownloadLink.download = `${fileName}-convertedbySrimukhesh-page-${pageNum}.${outputType}`;
                pageDownloadLink.textContent = `Download Page ${pageNum} as ${outputType.toUpperCase()}`;
                pageDownloadLink.style.display = 'block';
                pageDownloadLink.style.marginTop = '10px';

                downloadLinksContainer.appendChild(pageDownloadLink);
            }
        };
        reader.readAsArrayBuffer(file);
    } 
    else {
        alert('This conversion is currently not supported.');
    }
});












// document.getElementById('convertBtn').addEventListener('click', function () {
//     const inputType = document.getElementById('inputFileType').value;
//     const outputType = document.getElementById('outputFileType').value;
//     const fileInput = document.getElementById('fileInput');
//     const downloadLink = document.getElementById('downloadLink');
//     const canvas = document.getElementById('imageCanvas');
//     const downloadContainer = document.createElement('div'); // Container for multiple download links
//     downloadLink.style.display = 'none'; // Hide single download link
//     downloadContainer.innerHTML = ''; // Clear previous downloads

//     if (!fileInput.files.length) {
//         alert('Please select a file.');
//         return;
//     }

//     const file = fileInput.files[0];
//     const fileName = file.name.split('.').slice(0, -1).join('.'); // Extract file name without extension
//     const reader = new FileReader();

//     // Handle image conversions (JPEG/PNG to JPEG/PNG, PDF)
//     if (inputType === 'jpeg' || inputType === 'png') {
//         reader.onload = function (e) {
//             const img = new Image();
//             img.src = e.target.result;
//             img.onload = function () {
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(img, 0, 0);

//                 // Handle image to PDF conversion
//                 if (outputType === 'pdf') {
//                     const { jsPDF } = window.jspdf;
//                     const pdf = new jsPDF();

//                     // Fit the image proportionally on the PDF page
//                     const pageWidth = pdf.internal.pageSize.getWidth();
//                     const pageHeight = pdf.internal.pageSize.getHeight();
//                     const imgWidth = img.width;
//                     const imgHeight = img.height;
//                     const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

//                     const newImgWidth = imgWidth * scaleFactor;
//                     const newImgHeight = imgHeight * scaleFactor;

//                     const xOffset = (pageWidth - newImgWidth) / 2;
//                     const yOffset = (pageHeight - newImgHeight) / 2;

//                     pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', xOffset, yOffset, newImgWidth, newImgHeight);
//                     const pdfBlob = pdf.output('blob');
//                     const pdfURL = URL.createObjectURL(pdfBlob);
//                     downloadLink.href = pdfURL;
//                     downloadLink.download = `${fileName}-converted.pdf`;
//                     downloadLink.style.display = 'inline';
//                     downloadLink.textContent = 'Download Converted PDF';
//                 } else {
//                     // Image to Image conversion
//                     const mimeType = outputType === 'jpeg' ? 'image/jpeg' : 'image/png';
//                     const convertedImageURL = canvas.toDataURL(mimeType);
//                     downloadLink.href = convertedImageURL;
//                     downloadLink.download = `${fileName}-converted.${outputType}`;
//                     downloadLink.style.display = 'inline';
//                     downloadLink.textContent = `Download Converted ${outputType.toUpperCase()}`;
//                 }
//             };
//         };
//         reader.readAsDataURL(file);
//     }
//     // Handle PDF to Image conversion (Multiple Pages)
//     else if (inputType === 'pdf' && (outputType === 'jpeg' || outputType === 'png')) {
//         const pdfjsLib = window['pdfjs-dist/build/pdf'];
//         pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

//         reader.onload = async function (e) {
//             const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
//             const pdf = await loadingTask.promise;
//             const totalPages = pdf.numPages;

//             // Loop through all pages of the PDF sequentially
//             for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
//                 const page = await pdf.getPage(pageNum);
//                 const viewport = page.getViewport({ scale: 1 });
//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;
//                 const renderContext = {
//                     canvasContext: canvas.getContext('2d'),
//                     viewport: viewport,
//                 };
                
//                 await page.render(renderContext).promise;

//                 const mimeType = outputType === 'jpeg' ? 'image/jpeg' : 'image/png';
//                 const convertedImageURL = canvas.toDataURL(mimeType);

//                 const pageDownloadLink = document.createElement('a');
//                 pageDownloadLink.href = convertedImageURL;
//                 pageDownloadLink.download = `${fileName}-converted-page-${pageNum}.${outputType}`;
//                 pageDownloadLink.textContent = `Download Page ${pageNum} as ${outputType.toUpperCase()}`;
//                 pageDownloadLink.style.display = 'block';
//                 pageDownloadLink.style.marginTop = '10px';

//                 downloadContainer.appendChild(pageDownloadLink);
//             }
//         };
//         reader.readAsArrayBuffer(file);
//         document.body.appendChild(downloadContainer);
//     } 
//     else {
//         alert('This conversion is currently not supported.');
//     }
// });






// document.getElementById('convertBtn').addEventListener('click', function () {
//   const inputType = document.getElementById('inputFileType').value;
//   const outputType = document.getElementById('outputFileType').value;
//   const fileInput = document.getElementById('fileInput');
//   const downloadLink = document.getElementById('downloadLink');
//   const canvas = document.getElementById('imageCanvas');
//   const downloadContainer = document.createElement('div'); // Container for multiple download links
//   downloadLink.style.display = 'none'; // Hide single download link
//   downloadContainer.innerHTML = ''; // Clear previous downloads

//   if (!fileInput.files.length) {
//     alert('Please select a file.');
//     return;
//   }

//   const file = fileInput.files[0];
//   const reader = new FileReader();

//   // Handle image conversions (JPEG/PNG to JPEG/PNG, PDF)
//   if (inputType === 'jpeg' || inputType === 'png') {
//     reader.onload = function (e) {
//       const img = new Image();
//       img.src = e.target.result;
//       img.onload = function () {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0);

//         // Handle image to PDF conversion
//         if (outputType === 'pdf') {
//           const { jsPDF } = window.jspdf;
//           const pdf = new jsPDF();

//           // Calculate dimensions to fit the image proportionally on the PDF page
//           const pageWidth = pdf.internal.pageSize.getWidth();
//           const pageHeight = pdf.internal.pageSize.getHeight();
//           const imgWidth = img.width;
//           const imgHeight = img.height;
//           const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

//           const newImgWidth = imgWidth * scaleFactor;
//           const newImgHeight = imgHeight * scaleFactor;

//           const xOffset = (pageWidth - newImgWidth) / 2;
//           const yOffset = (pageHeight - newImgHeight) / 2;

//           pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', xOffset, yOffset, newImgWidth, newImgHeight);
//           const pdfBlob = pdf.output('blob');
//           const pdfURL = URL.createObjectURL(pdfBlob);
//           downloadLink.href = pdfURL;
//           downloadLink.download = 'converted-image.pdf';
//           downloadLink.style.display = 'inline';
//           downloadLink.textContent = 'Download Converted PDF';
//         } else {
//           // Image to Image conversion
//           const mimeType = outputType === 'jpeg' ? 'image/jpeg' : 'image/png';
//           const convertedImageURL = canvas.toDataURL(mimeType);
//           downloadLink.href = convertedImageURL;
//           downloadLink.download = `converted-image.${outputType}`;
//           downloadLink.style.display = 'inline';
//           downloadLink.textContent = `Download Converted ${outputType.toUpperCase()}`;
//         }
//       };
//     };
//     reader.readAsDataURL(file);
//   } 
//   // Handle DOCX to PDF conversion
//   else if (inputType === 'docx' && outputType === 'pdf') {
//     reader.onload = function (e) {
//       const arrayBuffer = e.target.result;
//       mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
//         .then(function (result) {
//           const { jsPDF } = window.jspdf;
//           const pdf = new jsPDF();
//           pdf.text(result.value, 10, 10);
//           const pdfBlob = pdf.output('blob');
//           const pdfURL = URL.createObjectURL(pdfBlob);
//           downloadLink.href = pdfURL;
//           downloadLink.download = 'converted-document.pdf';
//           downloadLink.style.display = 'inline';
//           downloadLink.textContent = 'Download Converted PDF';
//         })
//         .catch(function (error) {
//           console.error('Error converting DOCX to PDF:', error);
//         });
//     };
//     reader.readAsArrayBuffer(file);
//   } 
//   // Handle PDF to Image conversion (Multiple Pages)
//   // Handle PDF to Image conversion (Multiple Pages)
// else if (inputType === 'pdf' && (outputType === 'jpeg' || outputType === 'png')) {
//     const pdfjsLib = window['pdfjs-dist/build/pdf'];
//     pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

//     reader.onload = async function (e) {
//         const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
//         const pdf = await loadingTask.promise;
//         const totalPages = pdf.numPages;

//         // Loop through all pages of the PDF sequentially
//         for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
//             const page = await pdf.getPage(pageNum);
//             const viewport = page.getViewport({ scale: 1 });
//             canvas.width = viewport.width;
//             canvas.height = viewport.height;
//             const renderContext = {
//                 canvasContext: canvas.getContext('2d'),
//                 viewport: viewport,
//             };
            
//             // Render the page
//             await page.render(renderContext).promise;

//             // Convert to image
//             const mimeType = outputType === 'jpeg' ? 'image/jpeg' : 'image/png';
//             const convertedImageURL = canvas.toDataURL(mimeType);

//             // Create a separate download link for each page
//             const pageDownloadLink = document.createElement('a');
//             pageDownloadLink.href = convertedImageURL;
//             pageDownloadLink.download = `converted-pdf-page-${pageNum}.${outputType}`;
//             pageDownloadLink.textContent = `Download Page ${pageNum} as ${outputType.toUpperCase()}`;
//             pageDownloadLink.style.display = 'block';
//             pageDownloadLink.style.marginTop = '10px';

//             downloadContainer.appendChild(pageDownloadLink);
//         }
//     };
//     reader.readAsArrayBuffer(file);

//     // Append the download container for multiple pages
//     document.body.appendChild(downloadContainer);
// }

//   else {
//     alert('This conversion is currently not supported.');
//   }
// });
