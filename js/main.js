const gallery_content = document.querySelector('.gallery__content');

function initHandlers() {
    initDragDropHandlers();
    initFormHandlers();
}

/** 
 * Javascript Related to Drag and Drop Events
 * 
 * These functions how dragging and dropping entities functions on the gallery.
 * */
function initDragDropHandlers() {
    const dropHandle = document.getElementById('gallery');
    dropHandle.addEventListener("dragenter", dragenter, false);
    dropHandle.addEventListener("dragover", dragover, false);
    dropHandle.addEventListener("drop", drop, false);
    dropHandle.addEventListener("dragleave", dragleave, false);
}

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
    gallery_content.style.borderColor = 'rgba(0, 91, 117, 0.6)';
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    gallery_content.style.borderColor = 'rgba(130, 134, 136, 0.2)';
    handleFiles(files);
}

function dragleave(e){
    e.stopPropagation();
    e.preventDefault();

    gallery_content.style.borderColor = 'rgba(130, 134, 136, 0.2)';
    gallery_content.style.overflowX = 'scroll'; 
    gallery_content.style.overflowY = 'hidden';
}

function handleFiles(files) { //images[]
    const fileName = document.getElementById('js-metadata__name')
    const mimeTypeText = document.getElementById('js-metadata__mime');
    const fileSizeText = document.getElementById('js-metadata__size');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // console.log(typeof (files[i].size));
        const placeholderText = document.getElementById('js-gallery__placeholder'); // Uses the js- prefix as a handle
        placeholderText.style.display= "none";

        const img = document.createElement("img");
        img.classList.add('js-gallery__thumbnail');
        img.classList.add('gallery__thumbnail');
        img.file = file;
        img.addEventListener('click', (e) => { // Gallery image click handler
            const reader = new FileReader();
            reader.onload = (e) => { 
                document.getElementById('js-editor__img').src = e.target.result; 
                
                fileName.innerHTML = file.name;
                mimeTypeText.innerHTML = file.type;
                fileSizeText.innerHTML = humanizeFileSize(file.size);
                const placeholderText = document.getElementById('js-editor__placeholder'); // Uses the js- prefix as a handle
                placeholderText.style.display= "none";
            };
            reader.readAsDataURL(file);
        })
        const galleryContentElement = document.getElementById('js-gallery__content');
        galleryContentElement.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
        galleryContentElement.classList.add('flex-center--left');

        // Create a new FileReader and assign the image's source as 
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target.result; 
        reader.readAsDataURL(file);
    }
}

/** 
 * Javascript Related to Form Handling
 * 
 * These functions control the adding/removing of CSS transforms to the image in the editor pane
 * They are called by actions performed on the sidebar 
 * */
function initFormHandlers() {
    document.forms.namedItem('clip').addEventListener('change', (e) => changeShape(e.target.value));
    document.forms.namedItem('filter').addEventListener('change', (e) => changeFilter(e.target.value));
}

function changeShape(shape) {
    // TODO: Fill me in
}

function changeFilter(filter) {
    // TODO: Fill me in
}

// Use this function to display filesize in a human-readable format
function humanizeFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si 
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

// Wait for the window to finish loading before executing our Javascript
window.onload = (event) => {
    initHandlers();
}; 